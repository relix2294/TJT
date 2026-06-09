# TJT Trust Score Unification

Migration plan for consolidating two parallel Trust Score systems into a single canonical model.

## Product strategy context

**SEO → Traffic → CPA → Trust Score → Risk Engine/API**

## Two systems (current)

| System | Path | Nature | Output |
|--------|------|--------|--------|
| **Canonical static v0.1** | `frontend/src/lib/trust/` | Hand-authored profiles | 0–100 + category band |
| **Legacy dynamic** | `frontend/src/lib/trust-score/` | Runtime from CPA + placeholders | 0–100 + letter grade A–F |

Both modules label themselves `version: "0.1"` but use **different factor models** (8 vs 6 factors) and **different grading** (category bands vs letter grades).

## Canonical source of truth

**`frontend/src/lib/trust/`** is the canonical Trust Score for protocol-level display.

Resolver layer: `frontend/src/lib/trust/resolve.ts`

- `getProtocolTrustForDisplay(slug)` — static profile for UI surfaces
- `trustProfileToCompareBadge(profile)` — score + category label for compare table

Protocol adapter: `frontend/src/components/protocols/protocol-trust-score-card.tsx`

- Prefers `protocol.trustProfile` (static v0.1)
- Falls back to `protocol.trustScore` (legacy dynamic)

## Migration status

| Surface | Trust source | Status |
|---------|--------------|--------|
| `/compare/{slug}` table | Static v0.1 via `trustBadge` | ✅ Phase 0–2 |
| `/compare/{slug}` Trust overview | Static v0.1 via `CompareTrustOverview` | ✅ Phase 0–2 |
| `/compare/{slug}` metrics (`trust_left` / `trust_right`) | Static when available | ✅ Phase 0–2 |
| `/protocols` hub + detail | Static v0.1 via `trustProfile` + `ProtocolTrustScoreCard` | ✅ Phase 3 |
| `/reviews`, `/safety` | Static v0.1 | ✅ Unchanged |
| `/earn` | Legacy dynamic (incl. asset blend) | ⏳ Phase 4 |

### Phase 3 — complete

`buildProtocolsFromOffers()` now attaches `trustProfile` from `TRUST_PROTOCOL_REGISTRY` alongside legacy `trustScore`.

Protocol pages display:

- **Score** — static composite 0–100
- **Category** — trust band label (not letter grade)
- **Explanation** — editorial `trustProfile.explanation`

Legacy `trustScore` field is retained on `Protocol` for fallback and earn parity.

### Compare + protocol data shape (backward compatible)

`Protocol`, `ProtocolComparisonSide`, and `YieldComparisonRow` carry:

- `trustScore` — legacy dynamic (retained)
- `trustProfile` — optional static `ProtocolTrustProfile`
- `trustBadge` — optional precomputed compare badge (compare only)

UI prefers static profile when present.

## Legacy module status

`frontend/src/lib/trust-score/` is **not removed**.

It still powers:

- `/earn` hub and asset detail pages
- Legacy `trustScore` field on `Protocol` (fallback + earn pipeline input)
- SEO prose fallback when `trustProfile` is absent

## Remaining blocker: Earn Asset Trust Model

Phase 4 cannot proceed until:

1. **Earn-asset trust methodology** — how to blend canonical protocol profiles into USDT/USDC/ETH/SOL asset scores
2. **Static earn profiles or blend rules** — no `EarnAssetTrustProfile` exists today
3. **Product sign-off** — asset-level scores are user-facing on `/earn`; higher blast radius than protocol pages

Until Phase 4, `/earn` will show legacy dynamic scores that may differ from `/protocols` and `/compare` for the same backing protocol.

## Future phases

| Phase | Scope | Status |
|-------|-------|--------|
| **0–2** | Compare table + metrics unification | ✅ Complete |
| **3** | `/protocols` hub + detail → static card | ✅ Complete |
| **4** | Earn asset trust model + `/earn` migration | ⏳ Blocked on earn model |
| **5** | Deprecate `lib/trust-score/`, live data feeds, version `1.0` | Pending |

## Verification

```bash
cd frontend && npx tsx scripts/verify-trust-unification.ts
```

Checks:

- Resolver returns correct profiles for all 10 registry slugs
- Protocol registry `trustProfile.score` matches canonical registry
- Cross-surface parity: compare · protocols · reviews · safety for all 10 protocols
- Compare table `trustBadge.score` === overview score
- Legacy `trustScore` still present on all protocols

## Manual QA checklist

- [x] Compare table matches Trust overview (Phase 0–2)
- [ ] `/protocols/aave` — static card with score 89, category "High Trust" (no letter grade)
- [ ] `/protocols` hub — compact cards show category, not A–F grade
- [ ] `/protocols/morpho` score matches `/compare/morpho-vs-aave` Morpho row
- [ ] `/earn/usdc` — still shows legacy dynamic card (unchanged)

## Risks remaining

1. **Earn inconsistency** — `/earn` still uses legacy dynamic scores until Phase 4.
2. **Dual maintenance** — `placeholders.ts` and `trust-registry.ts` can drift until Phase 5.
3. **Reviews/safety coverage** — SEO Pilot maps 6 protocols; Spark, EtherFi, Pendle, Ethena have no review/safety trust cards yet (protocol + compare scores still consistent).

## Next recommended step

**Phase 4 — Earn asset trust model:** define `EarnAssetTrustProfile` or documented blend rules, then migrate `/earn` hub and asset detail pages.
