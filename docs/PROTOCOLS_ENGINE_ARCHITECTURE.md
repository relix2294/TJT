# TJT Protocols Engine Architecture

Foundation for protocol reviews, Trust Score integration, Earn linking, and future Compare pages. The Protocols Engine is a **review layer** that maps DeFi protocol nodes to supported assets, chains, earn opportunities, and live CPA offers — without replacing the existing `/offers` conversion funnel.

---

## Goals

1. **Protocol-first discovery** — hub at `/{lang}/protocols`, detail at `/{lang}/protocols/{slug}`.
2. **Preserve live routes** — `/offers`, `/earn`, `/market`, `/news` remain unchanged and indexed.
3. **SEO-native** — every protocol page ships metadata, canonical URLs, hreflang, Open Graph, and JSON-LD on day one.
4. **Earn integration** — protocol pages link to earn asset hubs and live CPA offers.
5. **Future hooks** — Trust Score and Compare integrations are structurally reserved, not implemented.

---

## Routing Strategy

### Live routes (this release)

| Route | Purpose | Static params |
|---|---|---|
| `/{lang}/protocols` | Protocols hub — featured protocol grid | `en`, `ru` |
| `/{lang}/protocols/{slug}` | Protocol review page | `aave`, `lido`, `jito` × locales |

### Legacy routes (unchanged)

| Route | Purpose | SEO content type |
|---|---|---|
| `/{lang}/offers` | CPA yield catalog | `protocols` (offer conversion) |
| `/{lang}/offers/{slug}` | Offer/protocol detail | `protocols` (offer slugs) |
| `/{lang}/earn` | Earn hub | `earn` |
| `/{lang}/earn/{asset}` | Asset earn page | `earn` |

### Path helpers

Location: `frontend/src/lib/protocols/paths.ts`

- `protocolsHubPath(lang)` → `/{lang}/protocols`
- `protocolDetailPath(lang, slug)` → `/{lang}/protocols/{slug}`
- `protocolComparePath(lang, slug)` → reserved for compare pages

### SEO route map

`frontend/src/lib/seo/urls.ts` maps content types to live App Router segments:

| Content type | Hub | Detail |
|---|---|---|
| `protocols` | `/protocols` | `/offers/{slug}` (CPA offer slugs) |
| `earn` | `/earn` | `/earn/{slug}` (asset slugs) |
| `coins` | `/market` | `/market/{slug}` |

**Important:** CPA offer pages continue to use `detailPath(lang, "protocols", offerSlug)` so their canonical URLs stay on `/offers/…`. Protocol **review** pages use explicit `protocolDetailPath()` helpers and canonical to `/protocols/{protocolSlug}`.

### Locale proxy

All public protocol URLs require a locale prefix. The Next.js 16 proxy (`frontend/src/proxy.ts`) redirects bare paths to `/{lang}/…` using cookie and `Accept-Language`.

---

## Data Model Strategy

Location: `frontend/src/lib/protocols/`

### Core types (`types.ts`)

| Type | Role |
|---|---|
| **Protocol** | Full review entity — name, category, assets, chains, offers, earn edges |
| **ProtocolCategory** | Taxonomy node (`lending`, `liquid_staking`, …) |
| **ProtocolRiskProfile** | Risk tier + explanation placeholder |
| **ProtocolSupportedAsset** | Asset node with link to earn hub |
| **ProtocolSupportedChain** | Chain node resolved from earn registry |
| **ProtocolLinkedOffer** | Live CPA offer with `/offers/{slug}` path |
| **ProtocolLinkedEarnOpportunity** | Earn edge with APY + earn asset path |
| **ProtocolTrustScorePlaceholder** | Structural hook — `score: null`, `status: "coming_soon"` |

### Hydration strategy

Protocol entities are **not** stored separately in `config.json` today. They are hydrated at render time from:

1. **Static seed nodes** — `EARN_PROTOCOLS` in `frontend/src/lib/earn/registry.ts` (Aave, Lido, Jito).
2. **Live CPA offers** — `config.json` → `cpa_offers[]`, grouped by `protocol` field.
3. **Earn Knowledge Graph** — `buildYieldOpportunitiesFromOffers()` maps offers → earn edges.

Registry: `frontend/src/lib/protocols/registry.ts`

```ts
buildProtocolsFromOffers(offers, lang) → Protocol[]
getProtocol(protocols, slug) → Protocol | undefined
```

### Future config extension

A dedicated `protocols[]` block in `config.json` can be added later with localized descriptions, audit links, and Trust Score factor overrides. Until then, the earn registry + CPA grouping pattern keeps the diff minimal.

---

## SEO Strategy

### Metadata

Every protocol page exports `generateMetadata` and delegates to `generatePageMetadata()` in `frontend/src/lib/seo/metadata.ts`:

- Canonical path (`path: "/en/protocols/aave"`)
- hreflang alternates (`en`, `ru`)
- Open Graph + Twitter
- `metadataBase` from `getSiteUrl()`

Helpers: `frontend/src/lib/protocols/seo.ts`

- `protocolsHubMetadataPath(lang)`
- `protocolDetailMetadataPath(lang, protocol)`
- `buildProtocolsHubJsonLd()` — `WebPage` + `ItemList`
- `buildProtocolDetailJsonLd()` — `FinancialService` + `Offer` / earn `ItemList`

### Sitemap

`frontend/src/app/sitemap.ts` emits:

- Hub: `/{lang}/protocols` (via `buildStaticHubEntries`)
- Detail: `/{lang}/protocols/{slug}` for each `PROTOCOL_SLUGS` entry × locale

Each entry includes bilingual `alternates.languages` via `buildSitemapEntry()`.

### JSON-LD

| Page | Schema |
|---|---|
| Protocols hub | `WebPage` + `ItemList` of protocol reviews |
| Protocol detail | `FinancialService` + linked `Offer` `ItemList` + earn `ItemList` |

Rendered via `<JsonLd />` component on each page.

---

## Internal Linking Strategy

Location: `frontend/src/lib/protocols/internal-links.ts`

### Protocol detail page graph

```
Protocol review
  ├── Sibling protocol reviews (aave ↔ lido ↔ jito)
  ├── Earn asset hubs (/earn/usdc, /earn/eth, …)
  ├── Linked CPA offers (/offers/{slug}) — conversion preserved
  └── Future compare slots (empty today)
```

### Protocols hub graph

```
Protocols hub
  ├── Earn hub
  ├── Yield catalog (/offers)
  ├── Market hub
  ├── News hub
  └── All protocol review pages
```

### Earn → Protocol connection

Earn asset pages already link to CPA offers via `getEarnOfferLinks()` → `detailPath(lang, "protocols", offerSlug)` → `/offers/{slug}`.

Protocol review pages link **back** to earn asset hubs via `getProtocolEarnAssetLinks()` → `earnAssetPath(lang, asset)`.

This creates a bidirectional crawl graph:

```
/earn/{asset}  ←→  /protocols/{protocol}  →  /offers/{offerSlug}
```

All internal links pass through `dedupeInternalLinks()` before render.

---

## Future Trust Score Integration

### Placeholder structure

```ts
type ProtocolTrustScorePlaceholder = {
  score: null;
  status: "coming_soon";
  label: LocalizedString;
  factorKeys: readonly string[];
};
```

Factor keys reserved: `audit_status`, `tvl_depth`, `smart_contract_age`, `governance_decentralization`, `historical_exploit_record`, `liquidity_exit_speed`.

### Integration path

1. Add `trust_score` block to `config.json` or external scoring service.
2. Replace `DEFAULT_PROTOCOL_TRUST_SCORE` with computed values in `registry.ts`.
3. Extend `buildProtocolDetailJsonLd()` with `AggregateRating` or custom `PropertyValue` nodes.
4. Render score UI in protocol detail page header — no route changes required.

Content block key `trust_score_placeholder` on protocol pages is marked `aiSlot: true` for programmatic injection.

---

## Future Compare Integration

### Reserved paths

- `protocolComparePath(lang, slug)` → `/{lang}/compare/{slug}` (not implemented)
- Content block key `compare_teaser` on protocol pages
- `getProtocolComparePlaceholderLinks()` returns `[]` today

### Integration path

1. Ship `/{lang}/compare/{slug}` routes (e.g. `aave-vs-compound-usdc`).
2. Wire `getProtocolComparePlaceholderLinks()` to emit compare deep-links from protocol review pages.
3. Add sitemap entries and JSON-LD `Product` comparison schemas.
4. Cross-link from earn asset pages via existing `getEarnComparePlaceholderLinks()` pattern.

---

## How Protocol Pages Connect to Earn Pages

| Connection | Direction | Mechanism |
|---|---|---|
| Supported assets | Protocol → Earn | `ProtocolSupportedAsset.earnPath` → `/earn/{asset}` |
| Earn opportunities | Protocol → Earn | `ProtocolEarnOpportunities` component links to earn hubs |
| Offer conversion | Protocol → Offers | `ProtocolLinkedOffers` → `/offers/{slug}` + click-track |
| Asset discovery | Earn → Offers | Existing `getEarnOfferLinks()` on earn asset pages |
| Shared graph | Both | `buildYieldOpportunitiesFromOffers()` hydrates edges |

### Example: Aave protocol page

```
/en/protocols/aave
  ├── Supported assets: USDC, USDT, ETH → /en/earn/usdc, /en/earn/usdt, /en/earn/eth
  ├── Earn routes: Aave V3 USDC Supply (11.8% APY) → /en/earn/usdc + /en/offers/aave-v3-usdc-arbitrum
  └── Linked offers: aave-v3-usdc-arbitrum, aave-v3-eth-ethereum → /en/offers/…
```

---

## File Map

```
frontend/src/lib/protocols/
  types.ts           — domain models
  registry.ts        — hydration from earn registry + CPA offers
  paths.ts           — URL builders
  seo.ts             — metadata paths + JSON-LD
  internal-links.ts  — crawl graph helpers
  content.ts         — bilingual copy + content blocks
  index.ts           — public barrel

frontend/src/app/[lang]/protocols/
  page.tsx           — protocols hub
  [slug]/page.tsx    — protocol review detail

frontend/src/components/protocols/
  protocol-grid.tsx
  content-blocks.tsx
  linked-offers.tsx
  earn-opportunities.tsx
  supported-assets.tsx
  supported-chains.tsx
  internal-link-section.tsx
```

---

## Verification

```bash
cd frontend
npm run build
npx tsc --noEmit
```

Both must pass before merge. Protocol pages are `force-dynamic` and read live `config.json` — no redeploy needed when CPA offers change; sitemap picks up new offers on next crawl request.
