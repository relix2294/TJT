# TJT SEO Architecture

Scalable SEO foundation for a bilingual (`en` / `ru`) fintech hub built on **Next.js 16 App Router**. This document defines URL taxonomy, reusable utilities, sitemap strategy, and internal linking rules for **10,000+ programmatic pages** without breaking existing routes.

---

## Principles

1. **Preserve live routes** — `/market`, `/offers`, `/news`, `/tools/roi-calculator` remain canonical until alias rewrites ship.
2. **Single source of truth** — `config.json` drives dynamic slugs; SEO utilities read the same data as pages.
3. **Locale-first URLs** — every public URL is `/{lang}/…` with hreflang alternates for `en` and `ru`.
4. **Centralized metadata** — all pages delegate to `generatePageMetadata()` in `frontend/src/lib/seo/`.
5. **No speculative UI** — utilities and docs only; new page types ship when content exists.

---

## URL Taxonomy

Target SEO content types and their **live** App Router mappings:

| Content type | Target path (future canonical) | Live path today | Hub | Detail example |
|---|---|---|---|---|
| **Coins** | `/{lang}/coins/{slug}` | `/{lang}/market/{slug}` | `/market` | `/en/market/bitcoin` |
| **Protocols** | `/{lang}/protocols/{slug}` | `/{lang}/offers/{slug}` (by protocol) | `/offers` | `/en/offers/lido-steth-ethereum` |
| **Compare** | `/{lang}/compare/{slug}` | *Not implemented* | — | `btc-vs-eth` (planned) |
| **Earn** | `/{lang}/earn/{slug}` | `/{lang}/offers/{slug}` | `/offers` | `/en/offers/jito-liquid-staking-solana` |
| **News** | `/{lang}/news/{slug}` | `/{lang}/news/{slug}` | `/news` | `/en/news/eth-etf-rekordnye-pritoki…` |
| **Guides** | `/{lang}/guides/{slug}` | *Not implemented* | — | Academy articles in `config.json` have no routes yet |

### Locale prefix

All public pages require a locale segment. The proxy (`frontend/src/proxy.ts`) redirects bare paths:

```
/           → /en  or  /ru  (cookie / Accept-Language)
/news       → /en/news
/market/bitcoin → /en/market/bitcoin
```

### Slug sources

| Type | Slug field | Source |
|---|---|---|
| Coins | `market_snapshot[].slug` | `config.json` (CoinGecko-style IDs) |
| Earn / Protocols | `cpa_offers[].slug` | `config.json` |
| News | `news[].slug` | `config.json` (AI-authored) |
| Guides | *TBD* | `ui.academy.articles[]` — needs `slug` field + route |
| Compare | *TBD* | Pair slugs, e.g. `bitcoin-vs-ethereum` |

### Migration path (future)

When alias routes ship, add Next.js rewrites in `next.config.ts`:

```ts
// Example — do not enable until pages exist
async rewrites() {
  return [
    { source: '/:lang/coins/:slug', destination: '/:lang/market/:slug' },
    { source: '/:lang/earn/:slug', destination: '/:lang/offers/:slug' },
  ];
}
```

Update `SEO_ROUTE_MAP` in `frontend/src/lib/seo/urls.ts` so metadata and sitemap emit the new canonical paths.

---

## Reusable SEO Utilities

Location: **`frontend/src/lib/seo/`**

| Module | Exports | Purpose |
|---|---|---|
| `constants.ts` | `getSiteUrl()`, `getMetadataBase()`, `DEFAULT_OG_IMAGE` | Single origin for absolute URLs |
| `urls.ts` | `detailPath()`, `hubPath()`, `hreflangAlternates()`, `SEO_ROUTE_MAP` | URL building & taxonomy |
| `metadata.ts` | **`generatePageMetadata()`**, `noIndexMetadata()` | Canonical, OG, Twitter, hreflang |
| `json-ld.ts` | `buildNewsArticleSchema()`, `buildProductSchema()`, `buildFinancialProductSchema()`, `buildBreadcrumbList()` | Structured data |
| `sitemap.ts` | `buildSitemapEntry()`, `chunkSitemapEntries()`, `SITEMAP_CHUNK_SIZE` | Dynamic sitemap at scale |
| `internal-links.ts` | `getRelatedCoinLinks()`, `getRelatedNewsLinks()`, `getRelatedOfferLinks()`, `dedupeInternalLinks()` | Crawl graph helpers |
| `index.ts` | Re-exports all public APIs | Import via `@/lib/seo` |

### `generatePageMetadata()` usage

Every page keeps Next.js `export async function generateMetadata()` and delegates:

```ts
import { generatePageMetadata, detailPath } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  return generatePageMetadata({
    lang,
    path: detailPath(lang, "news", slug),
    title: `${article.title} — TJT`,
    description: article.description,
    keywords: article.seoKeywords,
    ogType: "article",
    publishedTime: article.publishedAt,
  });
}
```

### Canonical URLs

- Relative canonical paths are locale-prefixed: `/en/market/bitcoin`.
- `metadataBase` resolves OG/Twitter image paths to absolute URLs.
- Set production domain once in `frontend/src/lib/config.ts` → `SITE.url`.

### OpenGraph & Twitter Cards

`generatePageMetadata()` always emits:

- `openGraph`: type, siteName, locale, alternateLocale, title, description, url, images
- `twitter`: `summary_large_image`, title, description, images

Default image: `/public/og-card.png` (1200×630).

### JSON-LD

| Page type | Schema | Builder |
|---|---|---|
| All pages with breadcrumbs | `BreadcrumbList` | `buildBreadcrumbList()` via `<Breadcrumbs>` |
| News article | `NewsArticle` | `buildNewsArticleSchema()` |
| Offer / earn detail | `Product` | `buildProductSchema()` |
| Coin / market detail | `FinancialProduct` | `buildFinancialProductSchema()` |
| Site-wide (planned) | `WebSite`, `Organization` | `buildWebSiteSchema()`, `buildOrganizationSchema()` |

Inject with `<JsonLd data={…} />` (`frontend/src/components/json-ld.tsx`).

---

## Dynamic Sitemap Strategy

**Current:** single `sitemap.xml` at `frontend/src/app/sitemap.ts`

- `dynamic = "force-dynamic"` — reads `config.json` on each request
- Bilingual entries with `alternates.languages` for every URL
- Static hubs: home, news, market, offers, ROI calculator
- Dynamic: all offers, news articles, market assets

### Scaling to 10,000+ URLs

Google allows ≤ 50,000 URLs per sitemap file. TJT chunks at **10,000** (`SITEMAP_CHUNK_SIZE`).

**Phase 1 (current):** monolithic sitemap — sufficient for ~100–500 pages.

**Phase 2 (≥ 5,000 URLs):** sitemap index:

```
/sitemap.xml              → index pointing to child files
/sitemap-static.xml       → hub routes
/sitemap-coins.xml        → market assets (chunked if needed)
/sitemap-earn.xml         → CPA offers
/sitemap-news.xml         → news articles
/sitemap-guides.xml       → guides (when routes exist)
```

Implementation: use `chunkSitemapEntries()` from `@/lib/seo` and add route handlers under `frontend/src/app/sitemap/` (Next.js 16 supports multiple sitemap files).

**Phase 3 (≥ 50,000 URLs):** split by first letter or category; add `lastmod` from content timestamps; optional ping on publish via `/api/admin/publish-article`.

### robots.txt

`frontend/src/app/robots.ts`:

- `allow: /`
- `disallow: /api/`, `/*/admin/`
- `sitemap` and `host` from `getSiteUrl()` in `@/lib/seo/constants`

---

## Internal Linking Strategy

Goal: every indexable page receives links from ≥ 2 other indexable pages (hub + related content).

### Hub → detail

| Hub | Links to |
|---|---|
| `/market` | Every coin in `market_snapshot` |
| `/offers` | Every CPA offer |
| `/news` | Every news article |
| Home | Teasers to market, offers, news, calculator |

### Detail → detail (contextual)

| Page type | Related links (utility) | UI location today |
|---|---|---|
| Coin detail | Similar coins (`getRelatedCoinLinks`) | `SimilarAssetsRow` |
| Coin detail | Related news (`getRelatedNewsLinks`) | News panel on market page |
| Coin detail | Related earn offers | CPA sidebar on market page |
| News article | Mentioned assets → coin pages | Asset cards in article |
| News article | Same-category news (`getRelatedNewsByCategory`) | Related section |
| Offer detail | Other offers (`getRelatedOfferLinks`) | Related section |

### Cross-cutting links

- Breadcrumbs on every detail/hub page → home + parent hub
- Footer columns from `config.json` → hub pages
- Calculator deep-link available via `calculatorLink(lang)` for future inline CTAs

### Crawl budget rules

1. **No orphan pages** — if a slug is in sitemap, it must appear on a hub or related block.
2. **Dedupe** — use `dedupeInternalLinks()` when composing programmatic link sets.
3. **Nofollow on outbound CPA** — referral links use `/api/click-track` (already in place); keep `rel="noopener noreferrer"` on external anchors.

---

## File Map

```
docs/
  SEO_ARCHITECTURE.md     ← this document
  SEO_AUDIT.md            ← prioritized issues & fixes

frontend/src/lib/seo/
  index.ts
  constants.ts
  urls.ts
  metadata.ts
  json-ld.ts
  sitemap.ts
  internal-links.ts

frontend/src/components/
  json-ld.tsx             ← JSON-LD script wrapper
  breadcrumbs.tsx         ← BreadcrumbList schema

frontend/src/app/
  sitemap.ts              ← dynamic sitemap entrypoint
  robots.ts
  [lang]/…/page.tsx       ← each calls generatePageMetadata()
```

---

## Checklist for New Page Types

When adding a new indexable route (e.g. `/guides/[slug]`):

1. Add slug field to `config.json` schema + TypeScript types
2. Extend `SEO_ROUTE_MAP` and `SEO_HUB_PATH` in `urls.ts`
3. Create App Router page with `generateMetadata()` → `generatePageMetadata()`
4. Add JSON-LD builder if a standard schema applies
5. Register URLs in `sitemap.ts` (or child sitemap)
6. Wire internal links from hub + ≥ 1 related page type
7. Update this document and `SEO_AUDIT.md`

---

## Environment

| Variable / constant | Location | Purpose |
|---|---|---|
| `SITE.url` | `frontend/src/lib/config.ts` | Production canonical origin |
| `COINGECKO_API_KEY` | `.env` | Live market data (not SEO-critical) |

Replace `https://tjt.example` with the production domain before launch.
