# TJT Compare Expansion v1

Step 5 of the TJT product roadmap: add the first protocol-vs-protocol comparison pages for expanded protocols.

## Product strategy context

**SEO → Traffic → CPA → Trust Score → Risk Engine/API**

Compare Expansion v1 connects Protocol Expansion v1 protocols into side-by-side informational pages with Trust Score cards — not rankings or financial advice.

## Compare pages added

| Slug | Type | Protocols | Locales |
|------|------|-----------|---------|
| `morpho-vs-aave` | protocol_vs_protocol | Morpho vs Aave | en, ru |
| `compound-vs-aave` | protocol_vs_protocol | Compound vs Aave | en, ru |
| `lido-vs-rocket-pool` | protocol_vs_protocol | Lido vs Rocket Pool | en, ru |

**Total compare slugs:** 10 (6 protocol-vs-protocol + 4 best-yield)

**Deferred:** `jito-vs-marinade` — Marinade not in protocol registry.

## Page content per comparison

Each new compare detail page includes:

| Element | Implementation |
|---------|----------------|
| SEO title | `getCompareSlugTitle()` + `\| TJT` via `generatePageMetadata()` |
| Meta description | `PROTOCOL_COMPARE_SUMMARIES` in registry |
| Canonical | `compareDetailMetadataPath()` |
| hreflang | `generatePageMetadata()` alternates (en / ru) |
| JSON-LD | `WebPage` + `ItemList` + `FAQPage` in `compare/seo.ts` |
| H1 | Compare page title |
| Summary | Bilingual summary paragraph |
| Comparison table | `CompareComparisonTable` — APY, TVL, chain, asset, Trust Score, risk |
| Protocol overview | `CompareEditorialSections` — left/right overview cards |
| Trust Score | `CompareTrustOverview` — static v0.1 cards for both protocols |
| Risk context | `CompareDisclaimer` + table risk column |
| Use case comparison | Editorial `useCaseComparison` block |
| Related Earn | Internal links to shared asset earn hubs |
| Related Reviews | Internal links to protocol review pages |
| Related Safety | Internal links to protocol safety pages |
| Related Learn | Contextual learn guides per comparison |
| Disclaimer | `COMPARE_LEGAL_DISCLAIMER` |
| FAQ | Editorial FAQ + FAQPage JSON-LD |

## Internal linking updates

| Source | New targets |
|--------|-------------|
| Compare detail pages | Both protocol hubs, reviews, safety, earn, learn, compare hub |
| Protocol hub pages | `morpho-vs-aave`, `compound-vs-aave`, `lido-vs-rocket-pool` via `getProtocolCompareLinks()` |
| Reviews (Aave, Morpho, Compound, Lido, Rocket Pool) | Relevant new compare slugs |
| Safety (Aave, Morpho, Compound, Lido, Rocket Pool) | Relevant new compare slugs |
| Compare hub | Auto-lists all `COMPARE_SLUGS` via `CompareGrid` |

## Sitemap

No manual edits. New pages auto-included via `COMPARE_SLUGS.flatMap()` in `frontend/src/app/sitemap.ts`.

## Trust Score integration

- **Compare table:** legacy dynamic Trust Score (letter grade) from `buildProtocolsFromOffers()`
- **Trust overview section:** static v0.1 `TrustScoreCard` from `lib/trust/` for Morpho, Aave, Compound, Lido, Rocket Pool
- All five protocols have profiles in `TRUST_PROTOCOL_REGISTRY`

## Architecture — files touched

| Area | Files |
|------|-------|
| Compare registry | `lib/compare/types.ts`, `registry.ts`, `content.ts` |
| Editorial content | `lib/compare/detail-content.ts` (new) |
| Internal links | `lib/compare/internal-links.ts` |
| SEO / JSON-LD | `lib/compare/seo.ts` |
| UI | `components/compare/editorial-sections.tsx` (new), `app/[lang]/compare/[slug]/page.tsx` |
| SEO Pilot cross-links | `seo-pilot/content/reviews.ts`, `seo-pilot/content/safety.ts` |
| Exports | `lib/compare/index.ts` |

## Content rules

**Use:** Compare, Risk context, Protocol overview, Educational information, Market context

**Avoid:** Buy, Sell, Hold, Recommendation, Guaranteed, Safe investment, Best investment

## Limitations

1. **TVL is estimated** — tier labels from placeholder profiles, not live feeds
2. **APY from catalog** — `config.json` CPA offers; may be null for expansion protocols without offers
3. **Editorial content** — only on 3 new comparisons; original 3 protocol pairs use table + trust only
4. **No Marinade compare** — blocked until Marinade protocol registry entry
5. **Dual trust modules** — table uses legacy scores; overview uses static v0.1

## Next recommended step

**Step 6 — Marinade + Solana Compare:** add Marinade to protocol registry, then ship `jito-vs-marinade` and expand `best-sol-staking` rows with Trust Score cards for both Solana liquid-staking leaders.
