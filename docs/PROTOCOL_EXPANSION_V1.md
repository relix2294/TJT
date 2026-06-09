# TJT Protocol Expansion v1

Step 4 of the TJT product roadmap: expand protocol coverage without adding new product modules. This release adds seven protocols to the existing Earn, Protocols, Trust Score, and SEO Pilot architecture.

## Product strategy context

**SEO → Traffic → CPA → Trust Score → Risk Engine/API**

Protocol Expansion v1 makes TJT look like a real protocol marketplace — not a three-protocol demo.

## Protocols added

| Protocol | Slug | Category | Supported assets | SEO review | SEO safety |
|----------|------|----------|------------------|------------|------------|
| Morpho | `morpho` | lending | USDC, USDT, ETH | yes | yes |
| Spark | `spark` | lending | USDC, USDT, ETH | hub only | — |
| Rocket Pool | `rocket-pool` | liquid_staking | ETH | yes | yes |
| EtherFi | `etherfi` | liquid_staking | ETH | hub only | — |
| Pendle | `pendle` | vault | USDC, ETH | hub only | — |
| Ethena | `ethena` | vault | USDT, USDC | hub only | — |
| Compound | `compound` | lending | USDC, USDT, ETH | yes | yes |

**Total protocol count:** 10 (3 original + 7 expansion)

## Data status

All expansion protocol profiles use **estimated** or **placeholder** data:

| Data field | Status |
|------------|--------|
| Protocol descriptions | Estimated — curated from public documentation |
| Risk tiers | Estimated — conservative catalog-style labels (AA / A) |
| Supported assets & chains | Estimated — seed nodes in earn registry |
| Linked CPA offers | Live where `config.json` matches protocol name |
| TVL, audits, exploits | Placeholder / estimated — no external APIs connected |
| Last reviewed | `2026-06-10` |

## Trust Score status

Trust Score v0.1 static profiles added for all seven expansion protocols in `frontend/src/lib/trust/trust-registry.ts`.

| Protocol | Score (computed) | Category | Data status |
|----------|------------------|----------|-------------|
| Morpho | 81 | High Trust | estimated |
| Spark | 80 | High Trust | estimated |
| Rocket Pool | 82 | High Trust | estimated |
| EtherFi | 73 | Moderate Trust | estimated |
| Pendle | 77 | High Trust | estimated |
| Ethena | 70 | Moderate Trust | estimated |
| Compound | 85 | High Trust | estimated |

Trust Score cards render on:

- `/reviews/{slug}` — morpho-review, rocket-pool-review, compound-review
- `/safety/{slug}` — is-morpho-safe, is-rocket-pool-safe, is-compound-safe
- `/compare/{slug}` — when comparison rows reference registry protocols
- `/protocols/{slug}` — legacy dynamic trust-score module (placeholder tiers)

## Pages added

### SEO Pilot (6 new slugs × 2 locales = 12 URLs)

**Reviews:**
- `/en/reviews/morpho-review` / `/ru/reviews/morpho-review`
- `/en/reviews/rocket-pool-review` / `/ru/reviews/rocket-pool-review`
- `/en/reviews/compound-review` / `/ru/reviews/compound-review`

**Safety:**
- `/en/safety/is-morpho-safe` / `/ru/safety/is-morpho-safe`
- `/en/safety/is-rocket-pool-safe` / `/ru/safety/is-rocket-pool-safe`
- `/en/safety/is-compound-safe` / `/ru/safety/is-compound-safe`

### Protocol hubs (7 new slugs × 2 locales = 14 URLs)

- `/en/protocols/morpho`, `/en/protocols/spark`, `/en/protocols/rocket-pool`, `/en/protocols/etherfi`, `/en/protocols/pendle`, `/en/protocols/ethena`, `/en/protocols/compound`
- Russian equivalents under `/ru/protocols/...`

### Sitemap

No manual sitemap edits required. New pages are auto-included via:

- `PROTOCOL_SLUGS` → protocol hub entries
- `SEO_PILOT_PAGES` → review and safety entries

## Internal linking

Every new SEO page links to:

- Relevant Compare pages (best-usdc-yield, best-usdt-yield, best-eth-staking, aave-vs-lido)
- Protocol hub pages (`/protocols/{slug}`)
- Earn asset hubs (`/earn/usdc`, `/earn/eth`, etc.)
- Learn guides (what-is-defi-yield, what-is-liquid-staking, crypto-yield-risks)
- Parent hub (reviews or safety)

Earn hub internal links now include all 10 protocol hub pages plus reviews hub.

## Architecture — files touched

| Area | Files |
|------|-------|
| Protocol registry | `lib/protocols/types.ts`, `lib/protocols/registry.ts`, `lib/protocols/content.ts` |
| Earn seed nodes | `lib/earn/registry.ts`, `lib/earn/content.ts`, `lib/earn/internal-links.ts` |
| Trust Score v0.1 | `lib/trust/trust-types.ts`, `lib/trust/trust-registry.ts`, `lib/trust/trust-score.ts` |
| Legacy trust score | `lib/trust-score/placeholders.ts`, `lib/trust-score/protocol-categories.ts` |
| SEO Pilot | `lib/seo-pilot/types.ts`, `content/reviews.ts`, `content/safety.ts`, `hub-content.ts` |
| Compare links | `lib/compare/internal-links.ts` |

## Limitations

1. **No new Compare slugs** — expansion protocols link to existing best-yield and protocol-vs-protocol pages
2. **Partial SEO coverage** — Spark, EtherFi, Pendle, and Ethena have protocol hubs only; dedicated review/safety pages deferred
3. **No live Trust Score APIs** — all scores are static v0.1 estimates
4. **Limited CPA offers** — linked offers appear only where `config.json` already lists matching protocol names
5. **Legacy dual trust modules** — `/protocols/` still uses dynamic `lib/trust-score/`; SEO surfaces use static `lib/trust/`

## Next protocols to add (recommended)

| Priority | Protocol | Rationale |
|----------|----------|-----------|
| 1 | Marinade | Solana liquid staking — pairs with Jito |
| 2 | Kamino | Solana lending — expands SOL earn graph |
| 3 | Uniswap / Curve | DEX liquidity yield category |
| 4 | EigenLayer | Restaking category expansion |
| 5 | Maker / Sky | DAI ecosystem depth beyond Spark |

## Next recommended step

**Step 5 — Compare Expansion v1:** add `morpho-vs-aave`, `compound-vs-aave`, and `lido-vs-rocket-pool` compare slugs so expansion protocols appear in side-by-side tables with Trust Score cards, not only in best-yield aggregations.
