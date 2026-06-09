# TJT SEO Pilot Pages (Step 1)

First batch of indexable educational SEO pages — bilingual (`en` / `ru`), static content, wired into sitemap and `@/lib/seo` metadata utilities.

## Pages (10 slugs × 2 locales = 20 URLs)

| # | EN path | RU path | Type |
|---|---------|---------|------|
| 1 | `/en/reviews/aave-review` | `/ru/reviews/aave-review` | Review |
| 2 | `/en/reviews/lido-review` | `/ru/reviews/lido-review` | Review |
| 3 | `/en/reviews/jito-review` | `/ru/reviews/jito-review` | Review |
| 4 | `/en/safety/is-aave-safe` | `/ru/safety/is-aave-safe` | Safety |
| 5 | `/en/safety/is-lido-safe` | `/ru/safety/is-lido-safe` | Safety |
| 6 | `/en/safety/is-jito-safe` | `/ru/safety/is-jito-safe` | Safety |
| 7 | `/en/learn/what-is-defi-yield` | `/ru/learn/what-is-defi-yield` | Learn |
| 8 | `/en/learn/what-is-liquid-staking` | `/ru/learn/what-is-liquid-staking` | Learn |
| 9 | `/en/learn/crypto-yield-risks` | `/ru/learn/crypto-yield-risks` | Learn |
| 10 | `/en/earn/how-to-compare-usdt-yield` | `/ru/earn/how-to-compare-usdt-yield` | Earn guide |

## Architecture

- **Content:** `frontend/src/lib/seo-pilot/content/` — bilingual copy, no new engine registries.
- **Routes:** App Router segments `reviews/[slug]`, `safety/[slug]`, `learn/[slug]`, plus static `earn/how-to-compare-usdt-yield`.
- **UI:** `frontend/src/components/seo-pilot/detail-page.tsx` — shared layout (H1, sections, FAQ, disclaimer, CTA).
- **SEO:** `generatePageMetadata()` — canonical, hreflang `en`/`ru`, OpenGraph, Twitter.
- **JSON-LD:** `Article` + `FAQPage` + `BreadcrumbList` via `buildSeoPilotJsonLd()`.
- **Sitemap:** `frontend/src/app/sitemap.ts` — `SEO_PILOT_PAGES` entries with bilingual alternates.

## Wording

- CTA: **Compare opportunities** (not “Start earning”).
- Uses: educational information, market context, risk overview, protocol overview.
- Avoids: buy/sell/hold, guaranteed, safe investment, financial advice, recommendation.

## Related live routes

Pilot pages link to existing Compare, Market, Offers, Protocols, and Earn hubs — no changes to those engines required.

## Next steps (suggested)

1. Add hub index pages (`/reviews`, `/safety`, `/learn`) when crawl graph needs them.
2. Cross-link from protocol/compare detail sidebars to matching pilot pages.
3. Extend `SEO_ROUTE_MAP` in `urls.ts` when these paths become canonical taxonomy targets.
