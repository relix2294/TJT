# TJT SEO Audit

Audit date: **2026-06-09**  
Scope: Next.js 16 frontend (`frontend/`), bilingual `en`/`ru` hub  
Method: Codebase review of metadata, sitemap, robots, JSON-LD, routing, and content layer

---

## Executive Summary

TJT has a working SEO baseline: dynamic sitemap, robots.txt, per-page metadata on most routes, and JSON-LD on news, offers, breadcrumbs, and (newly) market assets. A unified utility layer (`frontend/src/lib/seo/`) now centralizes canonical URLs, OpenGraph, Twitter Cards, and schema builders.

Remaining gaps are dominated by **placeholder domain configuration**, **missing page types** (guides, compare, protocol hubs), and **incomplete social metadata on hub pages** before production launch.

---

## Critical Issues

### C1 — Placeholder production domain

| | |
|---|---|
| **Impact** | Sitemap, robots, canonical URLs, JSON-LD, and OG tags resolve to `https://tjt.example` or fallback `https://yourdomain.com`. Search engines will index the wrong origin. |
| **Evidence** | `frontend/src/lib/config.ts` → `SITE.url: "https://tjt.example"` |
| **Fix** | Set `SITE.url` to the real production origin before launch. Consider driving it from `NEXT_PUBLIC_SITE_URL` env var with `SITE.url` as fallback. |
| **Status** | Open — requires deployment config |

### C2 — Academy / guides content not indexable

| | |
|---|---|
| **Impact** | Three academy articles exist in `config.json` (`ui.academy.articles`) but have **no routes**, **no slugs**, and **no sitemap entries**. Footer links point to `#academy` anchors that do not exist on the home page. |
| **Evidence** | `AcademyPreview` component exists but is not imported by any page; no `/guides/` or `/[lang]/guides/` route |
| **Fix** | When ready: add `slug` to academy articles, create `/{lang}/guides/[slug]` route, register in sitemap, wire `AcademyPreview` or equivalent listing. See `/docs/SEO_ARCHITECTURE.md`. |
| **Status** | Open — content exists, routes do not (intentionally deferred) |

### C3 — Broken footer academy anchor links

| | |
|---|---|
| **Impact** | Internal links resolve to `#academy` hash on pages without a matching `id="academy"` — wasted crawl signals and poor UX. |
| **Evidence** | Footer columns in `config.json`; home page has no academy section |
| **Fix** | Either add `id="academy"` section to home, or update footer hrefs to a future `/guides` hub. Do not remove footer links. |
| **Status** | Open |

---

## High Priority Issues

### H1 — URL taxonomy mismatch with SEO target paths

| | |
|---|---|
| **Impact** | External SEO strategy expects `/coins/`, `/earn/`, `/protocols/`; live routes use `/market/` and `/offers/`. No duplicate-content risk today (aliases don't exist), but link equity and analytics naming diverge. |
| **Evidence** | Live routes in `frontend/src/app/[lang]/` |
| **Fix** | Documented in `SEO_ROUTE_MAP`. Enable Next.js rewrites when alias routes are approved — no UI change required. |
| **Status** | Mitigated — architecture documented; migration path defined |

### H2 — No dedicated protocol hub pages

| | |
|---|---|
| **Impact** | Protocol names (Jito, Lido, Aave) appear as offer fields only. Cannot rank for "Lido staking review" as a protocol landing page. |
| **Evidence** | `cpa_offers[].protocol` — no `/protocols/[slug]` route |
| **Fix** | Future: aggregate offers by protocol slug, create hub + detail under `/{lang}/protocols/{slug}`. Use `getRelatedOfferLinks()` pattern. |
| **Status** | Open — not implemented (speculative) |

### H3 — Compare pages do not exist

| | |
|---|---|
| **Impact** | High-volume queries like "BTC vs ETH" have no landing page. |
| **Evidence** | No routes, components, or config for compare |
| **Fix** | Future: `/{lang}/compare/{slug}` with slug convention `{asset-a}-vs-{asset-b}`. |
| **Status** | Open — not implemented (speculative) |

### H4 — All pages use `force-dynamic` rendering

| | |
|---|---|
| **Impact** | Every request is SSR; no static HTML at CDN edge. Slower TTFB vs ISR/SSG; Core Web Vitals may suffer at scale. Metadata is still server-rendered (good for crawlers). |
| **Evidence** | `export const dynamic = "force-dynamic"` on all `[lang]` pages |
| **Fix** | When `config.json` writes stabilize: switch slug pages to `revalidate` (ISR) or SSG with `generateStaticParams`. Keep sitemap dynamic. |
| **Status** | Open — performance, not indexing blocker |

### H5 — Monolithic sitemap will not scale past ~10k URLs

| | |
|---|---|
| **Impact** | Single `sitemap.xml` works today but must split into index + child sitemaps before large programmatic expansion. |
| **Evidence** | `frontend/src/app/sitemap.ts` |
| **Fix** | Use `chunkSitemapEntries()` and sitemap index — documented in `SEO_ARCHITECTURE.md` Phase 2. |
| **Status** | Mitigated — utilities ready; split not yet needed |

---

## Medium Priority Issues

### M1 — Hub pages previously lacked full OG/Twitter images

| | |
|---|---|
| **Impact** | News, market, offers, and calculator hubs had OG title/description but omitted images and Twitter cards — weak social previews. |
| **Evidence** | Hub `generateMetadata` before refactor |
| **Fix** | **Fixed** — all hubs now use `generatePageMetadata()` with default OG image and Twitter card. |
| **Status** | ✅ Resolved |

### M2 — Market detail pages lacked JSON-LD and Twitter cards

| | |
|---|---|
| **Impact** | Coin pages missed structured data and social metadata vs news/offers. |
| **Evidence** | `market/[slug]/page.tsx` before refactor |
| **Fix** | **Fixed** — `buildFinancialProductSchema()` + full OG/Twitter via `generatePageMetadata()`. |
| **Status** | ✅ Resolved |

### M3 — Duplicated `SITE_URL` constants

| | |
|---|---|
| **Impact** | Hardcoded `https://tjt.example` in 4+ files risked drift. |
| **Evidence** | Previously in breadcrumbs, news, offers pages |
| **Fix** | **Fixed** — centralized in `getSiteUrl()` / `getMetadataBase()`. |
| **Status** | ✅ Resolved |

### M4 — No `x-default` hreflang on most pages

| | |
|---|---|
| **Impact** | Google may not know which URL to show users with unmatched languages. |
| **Evidence** | Only home layout had partial alternates; no `x-default` |
| **Fix** | **Partial** — `generatePageMetadata()` supports `xDefault: true`; enabled on locale layout. Enable on high-traffic pages when validated. |
| **Status** | Partially resolved |

### M5 — No site-wide WebSite / Organization JSON-LD

| | |
|---|---|
| **Impact** | Missing sitelinks search box eligibility and brand entity signals. |
| **Evidence** | No `WebSite` schema in layout |
| **Fix** | Inject `buildWebSiteSchema()` + `buildOrganizationSchema()` in `[lang]/layout.tsx` when brand copy is finalized. |
| **Status** | Open — builders exist, not yet injected |

### M6 — No favicon in `/public`

| | |
|---|---|
| **Impact** | Browser tab / SERP favicon may 404. |
| **Evidence** | `public/` contains `og-card.png` but no `favicon.ico` |
| **Fix** | Add `favicon.ico` and optional `apple-touch-icon.png`. |
| **Status** | Open |

### M7 — Default OG image is generic for all pages

| | |
|---|---|
| **Impact** | Every share shows the same card; lower CTR on social. |
| **Evidence** | `/public/og-card.png` used globally |
| **Fix** | Future: per-asset/per-article OG images via dynamic `opengraph-image.tsx` routes. |
| **Status** | Open — enhancement |

### M8 — robots.txt did not disallow admin paths

| | |
|---|---|
| **Impact** | Admin routes relied on `noindex` meta only; crawlers could still fetch login/dashboard. |
| **Evidence** | `robots.ts` before refactor |
| **Fix** | **Fixed** — added `disallow: /*/admin/`. |
| **Status** | ✅ Resolved |

### M9 — Unused SEO-adjacent components

| | |
|---|---|
| **Impact** | `AcademyPreview`, `Hero`, `SafetySteps` exist but are not rendered — missed internal linking and content surface area. |
| **Evidence** | Components in `frontend/src/components/` with no imports |
| **Fix** | Wire into home or dedicated pages when product approves; do not delete. |
| **Status** | Open |

### M10 — No search engine verification meta tags

| | |
|---|---|
| **Impact** | Cannot verify domain in Google Search Console / Bing Webmaster Tools via meta tag. |
| **Evidence** | No `verification` in metadata |
| **Fix** | Add to `generatePageMetadata()` or layout when tokens are available. |
| **Status** | Open |

---

## Low Priority Issues

| ID | Issue | Fix |
|---|---|---|
| L1 | Home page has no page-specific metadata beyond layout | Add `generateMetadata` on `[lang]/page.tsx` with home-specific description if needed |
| L2 | No `manifest.json` / PWA metadata | Add web app manifest if mobile install is a goal |
| L3 | Social links in footer are `#` placeholders | Replace with real profiles when available |
| L4 | News keywords rendered as visible `#tags` — fine for UX, negligible SEO value | Keep; optional `meta keywords` already set |
| L5 | Calculator lacks `SoftwareApplication` JSON-LD | Add schema when tool positioning is finalized |

---

## Recommended Fix Order

1. **Set production `SITE.url`** (C1) — blocks correct indexing
2. **Fix academy footer anchors or add guides hub** (C2, C3)
3. **Add favicon** (M6)
4. **Inject WebSite/Organization schema** (M5)
5. **Enable `x-default` hreflang on key pages** (M4)
6. **Plan ISR/SSG for slug pages** (H4) — performance
7. **Split sitemap at 5k+ URLs** (H5)
8. **Ship guides + compare + protocol routes** when content ready (C2, H2, H3)

---

## What Was Implemented (This Pass)

| Deliverable | Location |
|---|---|
| Unified SEO utilities | `frontend/src/lib/seo/` |
| `generatePageMetadata()` | `frontend/src/lib/seo/metadata.ts` |
| Canonical + hreflang helpers | `frontend/src/lib/seo/urls.ts` |
| JSON-LD builders | `frontend/src/lib/seo/json-ld.ts` |
| Sitemap scaling helpers | `frontend/src/lib/seo/sitemap.ts` |
| Internal linking helpers | `frontend/src/lib/seo/internal-links.ts` |
| `<JsonLd />` component | `frontend/src/components/json-ld.tsx` |
| Page refactors (metadata + schema) | All `[lang]/**/page.tsx` with SEO |
| Architecture doc | `/docs/SEO_ARCHITECTURE.md` |
| This audit | `/docs/SEO_AUDIT.md` |
| robots.txt admin disallow | `frontend/src/app/robots.ts` |
| Market page FinancialProduct schema | `market/[slug]/page.tsx` |

**Preserved:** all existing routes, UI, features, and `/market`, `/offers`, `/news` URL paths.
