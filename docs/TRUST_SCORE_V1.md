# TJT Trust Score v0.1 — Methodology

TJT Trust Score is an **educational, estimated framework** for DeFi protocol risk context. It provides a **0–100 composite score** with category bands, weighted factor breakdowns, and explicit data-status labels. It is **not financial advice**, not a recommendation, and not a guarantee of safety or performance.

## Product strategy context

Trust Score sits in the TJT funnel as:

**SEO → Traffic → CPA → Trust Score → Risk Engine/API**

v0.1 is a **static foundation** — explainable scores for all 10 catalog protocols without live scoring APIs, AI models, wallet connections, or trading signals.

## Scoring philosophy

Trust Score v0.1 answers: *"Based on what TJT knows today, what is the informational trust profile of this protocol?"*

Design principles:

- **Trust overview** — composite score with transparent factor weights
- **Risk context** — explicit risk notes alongside the score
- **Educational score** — informational framing, never endorsement language
- **Estimated framework** — placeholder and estimated data clearly labeled

### Language we use

- Trust overview
- Risk context
- Educational score
- Estimated framework

### Language we avoid

- safe investment
- recommended
- guaranteed
- buy / sell / hold

## Score range and categories

| Score | Category |
|-------|----------|
| 90–100 | Very High Trust |
| 75–89 | High Trust |
| 60–74 | Moderate Trust |
| 40–59 | Elevated Risk |
| 0–39 | High Risk |

Categories are derived from the composite score via `scoreToCategory()` in `frontend/src/lib/trust/trust-score.ts`.

## Scoring factors (v0.1)

Eight weighted factors sum to 100%:

| Factor | Weight | v0.1 data source |
|--------|--------|------------------|
| TVL | 20% | Estimated tier from public DeFi aggregates |
| Protocol age | 12% | Estimated mainnet history |
| Audits | 18% | Placeholder — audit registry API not connected |
| Exploit history | 15% | Placeholder — incident feed not connected |
| Liquidity | 12% | Estimated from protocol category and market depth |
| Yield sustainability | 8% | Estimated from yield model characteristics |
| Protocol adoption | 10% | Estimated from ecosystem integration breadth |
| Documentation quality | 5% | Verified or estimated from public docs |

Each factor produces a 0–100 sub-score. The composite is the sum of `sub-score × (weight / 100)`.

### Data status labels

Every factor and profile carries a data status:

| Status | Meaning |
|--------|---------|
| `verified` | Sourced from publicly accessible, stable documentation |
| `estimated` | Conservative heuristic from known protocol characteristics |
| `placeholder` | Static placeholder until external API connects |

## Protocol profiles (v0.1)

Static registry in `frontend/src/lib/trust/trust-registry.ts`:

| Protocol | Slug | Score (computed) | Category | Data status |
|----------|------|------------------|----------|-------------|
| Aave | `aave` | 89 | High Trust | estimated |
| Lido | `lido` | 90 | Very High Trust | estimated |
| Jito | `jito` | 70 | Moderate Trust | estimated |
| Morpho | `morpho` | 81 | High Trust | estimated |
| Spark | `spark` | 81 | High Trust | estimated |
| Rocket Pool | `rocket-pool` | 82 | High Trust | estimated |
| EtherFi | `etherfi` | 74 | Moderate Trust | estimated |
| Pendle | `pendle` | 78 | High Trust | estimated |
| Ethena | `ethena` | 72 | Moderate Trust | estimated |
| Compound | `compound` | 86 | High Trust | estimated |

Each profile includes:

- Protocol name and slug
- Composite score and category
- Factor breakdown with weights and notes
- Short explanation (educational score framing)
- Risk notes (risk context)
- Last reviewed date (`2026-06-10` at launch)
- Overall data status

## Module structure

```
frontend/src/lib/trust/
├── trust-types.ts      # ProtocolTrustProfile, TrustFactor, TrustCategory
├── trust-registry.ts   # Static profiles for 10 catalog protocols
├── trust-score.ts      # scoreToCategory, helpers, SEO slug mapping
├── resolve.ts          # getProtocolTrustForDisplay, trustProfileToCompareBadge
└── index.ts

frontend/src/components/trust/
└── trust-score-card.tsx   # Trust overview UI with indexable text
```

## UI integration

| Surface | Integration |
|---------|-------------|
| `/reviews/{slug}` | Full `TrustScoreCard` when slug maps via `SEO_PILOT_TRUST_SLUG_MAP` |
| `/safety/{slug}` | Full `TrustScoreCard` when slug maps via `SEO_PILOT_TRUST_SLUG_MAP` |
| `/compare/{slug}` table | Static v0.1 via `trustBadge` (canonical); legacy fallback if missing |
| `/compare/{slug}` overview | `CompareTrustOverview` with static `TrustScoreCard` |
| `/protocols/{slug}` | Static v0.1 via `trustProfile` + `ProtocolTrustScoreCard` (Phase 3 complete) |
| `/earn/{asset}` | Legacy `trust-score` module (dynamic computation) — Phase 4 migration |

See `docs/TRUST_SCORE_UNIFICATION.md` for migration phases and status.

### SEO requirements

Trust Score explanation is rendered as **visible, indexable text** in the card body — not visual-only UI. Review and safety pages include supplementary `sr-only` prose via `buildTrustSeoProse()` for crawler completeness.

## Limitations (v0.1)

1. **No external APIs** — TVL, audits, and exploits are not fetched live
2. **Ten protocols** — full catalog coverage in `TRUST_PROTOCOL_REGISTRY`
3. **Not predictive** — scores reflect informational profile, not future outcomes
4. **Partial legacy coexistence** — `frontend/src/lib/trust-score/` still powers `/protocols` and `/earn`; compare table unified to static v0.1 (Phase 0–2)

## Roadmap to v1.0

| Factor | Target source |
|--------|---------------|
| TVL | DeFiLlama / on-chain TVL oracles |
| Protocol age | Verified mainnet launch dates |
| Audits | Audit registry API |
| Exploit history | Incident feeds (Rekt, Immunefi) |
| Liquidity | Withdrawal queue depth, slashing history |
| Yield sustainability | Historical APY time series |
| Protocol adoption | On-chain integration metrics |
| Documentation quality | Automated doc coverage scoring |

v1.0 should upgrade factor statuses from `placeholder` / `estimated` to `verified` as feeds connect, unify with the legacy `trust-score` module, and version the model with a changelog.

## Disclaimer (shown on every card)

> This educational score is an estimated framework for risk context only — not financial advice, not a recommendation, and not a guarantee of safety or performance. Several factors use placeholder or estimated data until external verification sources are connected.
