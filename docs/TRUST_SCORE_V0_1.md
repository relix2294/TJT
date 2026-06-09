# TJT Trust Score v0.1

TJT Trust Score is the first proprietary scoring layer of the TJT platform. It provides a **0–100 informational indicator** with letter grades and weighted factor breakdowns for DeFi protocols and earn assets. It is **not financial advice**, not a recommendation, and not a guarantee of safety or performance.

## Scoring philosophy

Trust Score v0.1 is designed as a **transparent, explainable risk-awareness layer** — not a ranking engine or investment signal. The model:

- Combines multiple independent risk dimensions into one composite score
- Surfaces **which factors are verified vs. estimated** so users can judge confidence
- Uses only data available inside TJT today (CPA catalog, static protocol registry) plus conservative placeholders where external feeds are not yet connected
- Avoids language that implies endorsement, recommendation, or guaranteed outcomes

The score answers: *"Based on what TJT knows today, what is the informational trust profile of this protocol or earn route?"*

## Factor weights (v0.1)

| Factor | Weight | v0.1 data source |
|--------|--------|------------------|
| TVL strength | 25% | Placeholder tier per known protocol; live USD when available |
| Protocol maturity / age | 15% | Static age placeholder (~years since launch) |
| Audit status | 20% | Placeholder adjusted by catalog risk tier (AAA/AA) |
| Exploit history | 20% | Placeholder — no incident feed connected |
| APY sustainability | 10% | Catalog top APY (verified when present) |
| Liquidity / withdrawal risk | 10% | Category-based placeholder |

Weights sum to **100%**. Each factor produces a 0–100 sub-score; the composite is the sum of `sub-score × (weight / 100)`.

### Letter grades

| Score | Grade |
|-------|-------|
| 85–100 | A |
| 70–84 | B |
| 55–69 | C |
| 40–54 | D |
| 25–39 | E |
| 0–24 | F |

## What is estimated vs. verified

### Verified (when catalog data exists)

- **APY sustainability** — derived from live CPA offer APY snapshots in `config.json`

### Estimated

- **TVL strength** — static tier scores for Aave, Lido, Jito until DeFiLlama or on-chain TVL APIs connect
- **Protocol maturity** — approximate launch-age placeholders
- **Liquidity / withdrawal risk** — category heuristics (lending vs. liquid staking)

### Pending verification

- **Audit status** — no audit registry API; placeholder nudged by CPA `riskRating` / `riskTier`
- **Exploit history** — no Rekt/immunefi/incident feed connected

Every factor displays a status badge: `Verified`, `Estimated`, or `Pending verification`.

## Limitations (v0.1)

1. **No external APIs** — TVL, audits, exploits, and governance data are not fetched live
2. **Small protocol set** — scores exist for Aave, Lido, Jito (protocol pages) and USDT, USDC, ETH, SOL (earn asset aggregation)
3. **Asset-level scores are blended** — earn asset Trust Scores average protocol scores across catalogued CPA routes; they do not score individual offers
4. **Not predictive** — past profile does not forecast future exploits, APY changes, or liquidity events
5. **Informational only** — displayed with a mandatory disclaimer on every Trust Score card

## Data required for v1.0

| Factor | Target source |
|--------|----------------|
| TVL strength | DeFiLlama / on-chain TVL oracles |
| Protocol maturity | Verified mainnet launch dates (on-chain + docs) |
| Audit status | Audit registry (Code4rena, OpenZeppelin, etc.) |
| Exploit history | Incident feeds (Rekt, Immunefi, protocol post-mortems) |
| APY sustainability | Historical APY time series + borrow/utilization rates |
| Liquidity / withdrawal | Withdrawal queue depth, slashing history, bridge exposure |

v1.0 should upgrade factor statuses from `estimated` / `pending_verification` to `verified` as feeds connect, and version the model (`version: "1.0"`) with a changelog.

## Integration map

### Protocols Engine (`/protocols`, `/protocols/{slug}`)

- `computeProtocolTrustScore()` runs during `buildProtocolsFromOffers()`
- Hub grid shows compact score + grade on each protocol card
- Detail pages render full `TrustScoreCard` with factor breakdown and disclaimer
- Content block `trust_score_placeholder` carries crawlable prose for SEO

### Earn Engine (`/earn`, `/earn/{asset}`)

- `buildEarnAssetTrustScore()` aggregates protocol scores for routes on each asset
- Hub grid shows compact asset-level scores
- Asset detail pages show full breakdown
- APY from catalog informs both protocol APY sustainability and asset-level context

### Future Compare (not implemented)

Compare pages will consume the same `TrustScore` type to show side-by-side factor deltas between protocols or earn routes. v0.1 stores stable `TrustScoreFactorKey` identifiers for diff rendering without redesigning the model.

## Module location

```
frontend/src/lib/trust-score/
├── types.ts          # TrustScore, TrustScoreFactor, TrustScoreGrade, TrustScoreInput, TrustScoreExplanation
├── factors.ts        # Weights, labels, disclaimer
├── placeholders.ts   # Static protocol profiles, scoring helpers
├── scoring.ts        # computeProtocolTrustScore, computeEarnAssetTrustScore
├── earn-helpers.ts   # buildEarnAssetTrustScore
├── protocol-categories.ts
└── index.ts

frontend/src/components/trust-score/
└── trust-score-card.tsx   # compact + full UI variants
```

## SEO notes

- Metadata uses *"informational indicators"* — avoids *"recommendation"* language
- JSON-LD is **unchanged** in v0.1: estimated scores are not embedded in schema.org markup to avoid implying third-party endorsement
