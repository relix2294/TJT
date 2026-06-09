# TJT Earn Engine Architecture

Foundation for the future crypto marketplace earn layer. The Earn Engine is a **Knowledge Graph** that maps assets, chains, protocols, and yield opportunities into SEO-ready, bilingual pages scalable to **10,000+ URLs** without refactoring core types or routing conventions.

---

## Goals

1. **Asset-first earn discovery** — hub at `/{lang}/earn`, detail at `/{lang}/earn/{asset}`.
2. **Preserve live routes** — `/offers`, `/market`, `/news` remain unchanged and indexed.
3. **SEO-native** — every earn page ships metadata, hreflang, Open Graph, and JSON-LD on day one.
4. **AI-ready content blocks** — stable block keys for programmatic prose injection.
5. **Future hooks** — Trust Score and Compare integrations are structurally reserved, not implemented.

---

## Routing Strategy

### Live routes (this release)

| Route | Purpose | Static params |
|---|---|---|
| `/{lang}/earn` | Earn hub — asset grid + knowledge graph entry | `en`, `ru` |
| `/{lang}/earn/{asset}` | Asset earn page | `usdt`, `usdc`, `eth`, `sol` × locales |

### Legacy routes (unchanged)

| Route | Purpose | SEO content type |
|---|---|---|
| `/{lang}/offers` | CPA yield catalog | `protocols` (canonical metadata) |
| `/{lang}/offers/{slug}` | Protocol/offer detail | `protocols` |
| `/{lang}/market/{slug}` | Coin terminal | `coins` |

### Future expansion (path helpers ready, routes not shipped)

```
/{lang}/earn/{asset}/{chain}     → e.g. /en/earn/usdt/arbitrum
/{lang}/earn/{asset}/{chain}/{protocol}  → optional fourth segment
/{lang}/compare/{slug}           → e.g. /en/compare/usdt-aave-vs-compound
```

Path builders live in `frontend/src/lib/earn/paths.ts`:

- `earnHubPath(lang)` → `/{lang}/earn`
- `earnAssetPath(lang, asset)` → `/{lang}/earn/{asset}`
- `earnAssetChainPath(lang, asset, chain)` → reserved for chain-scoped pages
- `comparePath(lang, slug)` → reserved for compare pages

### SEO route map

`frontend/src/lib/seo/urls.ts` maps content types to live App Router segments:

| Content type | Hub | Detail |
|---|---|---|
| `earn` | `/earn` | `/earn/{slug}` (asset slugs) |
| `protocols` | `/offers` | `/offers/{slug}` |
| `coins` | `/market` | `/market/{slug}` |

**Important:** CPA offer pages use `detailPath(lang, "protocols", slug)` so their canonical URLs stay on `/offers/…`. Earn asset pages use explicit `earnAssetPath()` helpers.

### Locale proxy

All public earn URLs require a locale prefix. The Next.js 16 proxy (`frontend/src/proxy.ts`) redirects bare paths to `/{lang}/…` using cookie and `Accept-Language`.

---

## Domain Model (Knowledge Graph)

Location: `frontend/src/lib/earn/`

### Core types (`types.ts`)

| Type | Role |
|---|---|
| **Asset** | Yieldable token node (`usdt`, `usdc`, `eth`, `sol`) |
| **Chain** | Network node (`ethereum`, `arbitrum`, `solana`, …) |
| **Protocol** | DeFi protocol node (Aave, Lido, Jito, …) |
| **YieldOpportunity** | Edge: asset × chain × protocol with APY + optional CPA `offerSlug` |
| **TrustScorePlaceholder** | Structural hook — `score: null`, `status: "coming_soon"` |

### Registry (`registry.ts`)

- `EARN_ASSETS`, `EARN_CHAINS`, `EARN_PROTOCOLS` — static seed graph.
- `buildYieldOpportunitiesFromOffers(offers)` — hydrates opportunities from `config.json` `cpa_offers[]`.
- Lookup helpers: `getEarnAsset`, `getOpportunitiesForAsset`, `getTopApyForAsset`.

### Scaling the graph to 10,000+ pages

Today the graph is in-memory TypeScript. At scale:

1. **Indexed maps** — replace `Array.find` with `Map<slug, Entity>` built at module init or SSR cache.
2. **External store** — move graph edges to JSON/DB (same shape as `YieldOpportunity`).
3. **Route segments** — add `[chain]` under `[asset]` without changing parent types.
4. **Sitemap chunking** — use `chunkSitemapEntries()` (10k per file) and a sitemap index (`/sitemap-earn.xml`).
5. **ISR / static** — switch `force-dynamic` to `generateStaticParams` + incremental revalidation when graph is stable.

Page count estimate at full expansion:

```
4 assets × 6 chains × ~20 protocols × 2 locales ≈ 960 base earn URLs
+ compare pairs + guides + news cross-links → 10,000+ with programmatic long-tail
```

---

## SEO Strategy

### Metadata

All earn pages delegate to `generatePageMetadata()` (`frontend/src/lib/seo/metadata.ts`):

- Canonical path per locale
- `en` / `ru` hreflang alternates
- Open Graph + Twitter large image
- Asset-specific `keywords` arrays

Copy for earn hub and asset meta descriptions lives in `frontend/src/lib/earn/content.ts` (bilingual `{ en, ru }` leaves).

### JSON-LD

Builders in `frontend/src/lib/earn/seo.ts`:

| Page | Schema types |
|---|---|
| Earn hub | `WebPage` + `ItemList` (asset links) |
| Earn asset | `FinancialProduct` + `ItemList` of `Offer` items |

Injected via `<JsonLd />` (`frontend/src/components/json-ld.tsx`). Breadcrumbs continue to emit `BreadcrumbList` through the shared `<Breadcrumbs>` component.

### Sitemap

- Hub `/earn` in `buildStaticHubEntries()`.
- Asset pages `/earn/{asset}` in `frontend/src/app/sitemap.ts` with bilingual alternates.
- Future: dedicated `sitemap-earn.xml` route when URL count exceeds single-file comfort.

---

## Internal Linking Strategy

### Helpers (`frontend/src/lib/earn/internal-links.ts`)

| Function | Emits links to |
|---|---|
| `getEarnHubLinkGraph` | Earn hub, sibling assets, market hub, offers catalog, news |
| `getRelatedEarnAssetLinks` | Other asset earn pages |
| `getEarnOfferLinks` | Live CPA offers (`/offers/{slug}`) |
| `getEarnToMarketLinks` | Matching market terminal coin |
| `getEarnComparePlaceholderLinks` | Empty until Compare ships |

### UI component

`EarnInternalLinkSection` renders crawl-oriented link blocks with `data-link-type` attributes for graph analysis.

### Crawl graph rules

1. Every earn asset page links **up** to earn hub and **sideways** to sibling assets.
2. Opportunities with `offerSlug` link **down** to protocol detail (`/offers/…`).
3. Symbol-matched market assets link to coin terminal (`/market/…`).
4. `dedupeInternalLinks()` merges by href before render.

Global hub links in `frontend/src/lib/seo/internal-links.ts` — `getHubLinks()` now resolves earn hub to `/earn` via updated `SEO_ROUTE_MAP`.

---

## Reusable Content Blocks (AI Pages)

`frontend/src/lib/earn/content.ts` defines stable block keys:

```
hero_summary, how_it_works, risk_disclosure, chain_landscape,
protocol_landscape, top_opportunities, trust_score_placeholder,
faq, related_assets, compare_teaser
```

`buildEarnAssetContentBlocks()` returns default prose per asset. Blocks marked `aiSlot: true` are placeholders for future AI-generated copy.

UI: `frontend/src/components/earn/content-blocks.tsx` — each block exposes `id="earn-block-{key}"` and `data-earn-block` for injection pipelines.

---

## Future Trust Score Integration

`TrustScorePlaceholder` in `types.ts`:

```ts
{
  score: null;              // never computed in this release
  status: "coming_soon";
  label: LocalizedString;
  factorKeys: TrustScoreFactorKey[];
}
```

Factor keys reserved: `audit_status`, `tvl_depth`, `smart_contract_age`, `governance_decentralization`, `historical_exploit_record`, `liquidity_exit_speed`.

**Integration plan (not implemented):**

1. Replace placeholder with `TrustScore` type (`score: number`, `grade`, `factors[]`).
2. Add `trust_score` field on `YieldOpportunity` and `Protocol`.
3. Extend JSON-LD with `AggregateRating` or custom `PropertyValue` nodes.
4. Render scored block in place of `trust_score_placeholder` content block.

---

## Future Compare Integration

Compare is listed in `SEO_CONTENT_TYPES` but has no live routes.

**Integration plan (not implemented):**

1. Add `frontend/src/app/[lang]/compare/[slug]/page.tsx`.
2. Use `comparePath(lang, slug)` for canonical URLs.
3. Wire `compare_teaser` content block to `getEarnComparePlaceholderLinks()` (currently returns `[]`).
4. Slug convention: `{asset}-{protocol-a}-vs-{protocol-b}` or `{asset}-chains`.

---

## File Map

```
frontend/src/lib/earn/
  types.ts           # Domain models
  registry.ts        # Knowledge graph seed + offer hydration
  paths.ts           # URL builders
  seo.ts             # JSON-LD + metadata path helpers
  internal-links.ts  # Earn-specific link graph
  content.ts         # Hub copy + AI content blocks
  index.ts           # Public exports

frontend/src/components/earn/
  asset-grid.tsx
  content-blocks.tsx
  internal-link-section.tsx
  opportunity-list.tsx

frontend/src/app/[lang]/earn/
  page.tsx           # Hub
  [asset]/page.tsx   # Asset detail
```

---

## Verification

```bash
cd frontend && npm run build
cd frontend && npx tsc --noEmit
```

---

## Non-Goals (this release)

- Trust Score computation or display of numeric scores
- Compare pages or comparison logic
- Redesign of navbar, home, offers, or market pages
- Removal or redirect of `/offers` routes
- Chain-level earn routes (`/earn/usdt/arbitrum`)
