# Compare Engine Architecture

The TJT Compare Engine is the SEO and conversion layer connecting **Earn**, **Protocols**, **Offers**, and **Trust Score**. It ships informational comparison pages under `/{lang}/compare` without altering existing routes, Trust Score formulas, or external API integrations.

## Routing strategy

Compare pages live in the Next.js App Router under the existing bilingual locale prefix:

| Route | Purpose |
|---|---|
| `/{lang}/compare` | Compare hub — lists all comparison pages |
| `/{lang}/compare/{slug}` | Detail comparison page |

**Initial slugs (v1 foundation):**

| Slug | Type |
|---|---|
| `aave-vs-lido` | Protocol vs protocol |
| `aave-vs-jito` | Protocol vs protocol |
| `lido-vs-jito` | Protocol vs protocol |
| `best-usdt-yield` | Best yield |
| `best-usdc-yield` | Best yield |
| `best-eth-staking` | Best yield |
| `best-sol-staking` | Best yield |

**Implementation files:**

- Hub: `frontend/src/app/[lang]/compare/page.tsx`
- Detail: `frontend/src/app/[lang]/compare/[slug]/page.tsx`
- Path helpers: `frontend/src/lib/compare/paths.ts`
- `generateStaticParams()` pre-renders `LOCALES × COMPARE_SLUGS`
- `export const dynamic = "force-dynamic"` reads live `config.json` for APY snapshots

`SEO_ROUTE_MAP.compare` maps to live `/compare` paths (no longer aliased to `/market`).

## Comparison types

### `protocol_vs_protocol`

Side-by-side informational comparison of two DeFi protocol review entities. Hydrated from `buildProtocolsFromOffers()` with per-side:

- APY (catalog snapshot or focus-asset opportunity)
- TVL tier label (estimated placeholder until external APIs)
- Chain and supported asset
- TJT Trust Score v0.1
- Risk explanation from protocol risk profile

### `best_yield`

Asset-scoped yield comparison table. Rows are built from protocols that support the target earn asset, merged with live CPA `YieldOpportunity` rows from `buildYieldOpportunitiesFromOffers()`. Sorted by catalog APY descending for market context — not a ranking or recommendation.

## Data model strategy

Domain models live in `frontend/src/lib/compare/types.ts`:

| Type | Role |
|---|---|
| `ComparePage` | Full page entity for detail routes |
| `ComparePageType` | `"protocol_vs_protocol"` \| `"best_yield"` |
| `ProtocolComparison` | Two-sided protocol payload |
| `YieldComparison` | Asset-scoped rows payload |
| `CompareMetric` | Summary metrics for JSON-LD hooks |
| `CompareLinkedOffer` | CPA conversion edges |
| `CompareInternalLink` | Crawl-oriented link graph node |

**Hydration pipeline:**

```
config.json (cpa_offers)
    → buildYieldOpportunitiesFromOffers()
    → buildProtocolsFromOffers()
    → buildComparePagesFromOffers()
    → ComparePage[]
```

Static slug registry (`COMPARE_SLUGS`) drives routing and sitemap. Page copy (titles, summaries, disclaimer) is co-located in `registry.ts` and `content.ts`. At 10,000+ scale, slug registry becomes a generated index or database-backed catalog; builders remain pure functions over registries + offers.

## SEO strategy

### Metadata

Both hub and detail routes implement `generateMetadata()` via `generatePageMetadata()` from `@/lib/seo`:

- **Canonical URLs** — locale-relative paths (`/en/compare/aave-vs-lido`)
- **OpenGraph** — title, description, url, default OG image
- **hreflang alternates** — `en` / `ru` via `hreflangAlternates()`
- **Keywords** — comparison-focused, SEO-safe vocabulary

### JSON-LD

`frontend/src/lib/compare/seo.ts`:

- Hub: `WebPage` + `ItemList` of comparison pages
- Detail: `WebPage` + `ItemList` of compared protocols/offers with `FinancialService` / `Offer` items

Injected via `<JsonLd>` component on each page.

### Sitemap

`frontend/src/app/sitemap.ts` emits:

- Compare hub (via `buildStaticHubEntries` → `/compare`)
- `COMPARE_SLUGS × LOCALES` detail entries with hreflang alternates

### SEO-safe copy rules

Copy avoids financial-advice language:

- Do **not** use: “best investment”, “guaranteed”, “recommended”
- Prefer: “comparison”, “informational”, “market context”

Legal disclaimer on every compare page:

> TJT provides informational comparisons only and does not provide financial advice.

## Internal linking strategy

`frontend/src/lib/compare/internal-links.ts` composes `CompareInternalLink[]` per page:

| Source | Targets | Priority |
|---|---|---|
| Compare detail | Compare hub, sibling compare pages | 0.9–0.72 |
| Protocol comparison | Both protocol review pages, shared earn asset | 0.84–0.83 |
| Yield comparison | Earn asset hub, protocol reviews, linked offers | 0.86–0.77 |

Placeholder hooks wired for backward compatibility:

- `getEarnComparePlaceholderLinks()` → best-yield compare for earn assets
- `getProtocolComparePlaceholderLinks()` → protocol-vs-protocol pairs

`dedupeCompareInternalLinks()` merges by href, keeping highest priority.

## Trust Score integration

Compare pages surface **existing** Trust Score v0.1 results — no formula changes:

- Protocol comparisons: `protocol.trustScore` from `computeProtocolTrustScore()`
- Yield rows: per-protocol trust scores on each table row
- UI: compact `TrustScoreBadge` in comparison table (full `TrustScoreCard` available on linked protocol/earn pages)

TVL displays estimated tier labels from `getProtocolPlaceholderProfile()` until external TVL APIs connect.

## Earn integration

- Yield comparison pages link to `/{lang}/earn/{asset}` hubs
- Rows reference `earnAssetPath` and catalog `YieldOpportunity` APY
- `getEarnCompareLinks()` surfaces best-yield compare pages from earn asset context
- Earn registry (`EARN_ASSETS`, `EARN_PROTOCOLS`) seeds protocols without live CPA offers (e.g. USDT routes)

## Protocols integration

- Protocol comparison pages link to `/{lang}/protocols/{slug}` review pages
- Sides hydrated from `buildProtocolsFromOffers()` including risk profiles and linked offers
- `getProtocolCompareLinks()` surfaces relevant `aave-vs-*` / `lido-vs-*` pairs from protocol detail sidebars

## Offers integration

- `CompareLinkedOffer` maps live CPA offers to `/{lang}/offers/{slug}` conversion paths
- Yield table rows link to offers when `offerSlug` is present on the opportunity
- Linked offers included in JSON-LD `ItemList` for crawl discovery

## Future expansion to 10,000+ pages

The foundation supports programmatic scale without route changes:

1. **Slug generation** — expand `COMPARE_SLUGS` from combinatorics: `{asset}-{protocol-a}-vs-{protocol-b}`, `{asset}-yield`, cross-chain pairs
2. **Registry source** — move static specs to JSON/DB; keep `buildComparePagesFromOffers()` as hydration layer
3. **Sitemap chunking** — use `chunkSitemapEntries()` (already in `@/lib/seo/sitemap`) for sitemap index files
4. **Static params** — switch to ISR or on-demand rendering when slug count exceeds build budget
5. **External APIs** — plug TVL, audit, and live APY feeds into existing `CompareMetric` and side builders without changing page components
6. **AI content blocks** — add `compare/content.ts` block keys mirroring earn/protocol content engines for long-form SEO prose

## Module map

```
frontend/src/lib/compare/
├── types.ts          # Domain models
├── registry.ts       # Page builders
├── paths.ts          # URL helpers
├── seo.ts            # Metadata paths + JSON-LD
├── internal-links.ts # Link graph + earn/protocol hooks
├── content.ts        # Hub copy + disclaimer
└── index.ts          # Public API

frontend/src/components/compare/
├── compare-grid.tsx
├── comparison-table.tsx
├── internal-link-section.tsx
└── disclaimer.tsx
```

## Verification

```bash
cd frontend
npm run build
npx tsc --noEmit
```

Both commands must pass before merge. Compare routes are additive — existing earn, protocols, offers, and market routes remain unchanged.
