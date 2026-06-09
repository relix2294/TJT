# TJT Earn Asset Trust Model v0.1 — Design Audit

Design-only specification for unifying `/earn` trust scoring with the canonical static Trust Score model. **Not yet implemented.**

## Product strategy context

**SEO → Traffic → CPA → Trust Score → Risk Engine/API**

| Surface | Trust source | Status |
|---------|--------------|--------|
| `/compare` | Static v0.1 (`lib/trust/`) | ✅ Phases 0–2 |
| `/protocols` | Static v0.1 | ✅ Phase 3 |
| `/reviews`, `/safety` | Static v0.1 | ✅ |
| `/earn` | Legacy dynamic (`lib/trust-score/`) | ⏳ Phase 4 blocked |

See also: [`TRUST_SCORE_V1.md`](./TRUST_SCORE_V1.md), [`TRUST_SCORE_UNIFICATION.md`](./TRUST_SCORE_UNIFICATION.md).

---

## Language policy

TJT Trust Score is an **educational, estimated framework** for DeFi risk context. It provides a **0–100 composite score** with category bands, weighted factor breakdowns, and explicit data-status labels.

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

---

## 1. Current `/earn` trust architecture

### Dual-system landscape

TJT runs two parallel Trust Score systems that both label themselves `v0.1`:

| System | Module | Grading | Factors | Nature |
|--------|--------|---------|---------|--------|
| **Canonical static** | `frontend/src/lib/trust/` | Category bands (Very High → High Risk) | 8 | Hand-authored `ProtocolTrustProfile` |
| **Legacy dynamic** | `frontend/src/lib/trust-score/` | Letter grades A–F | 6 | Runtime from CPA catalog + placeholders |

### Where `/earn` uses legacy `lib/trust-score/`

```
config.json (CPA offers)
        ↓
buildYieldOpportunitiesFromOffers()
        ↓
buildEarnAssetTrustScore()          ← earn-helpers.ts
        ↓
computeProtocolTrustScore()         ← per protocol with live topApy
        ↓
computeEarnAssetTrustScore()        ← arithmetic mean blend
        ↓
TrustScoreCard (letter grade)       ← trust-score/trust-score-card.tsx
```

**Direct legacy consumers:**

| File | Role |
|------|------|
| `frontend/src/lib/earn/index.ts` | Re-exports `buildEarnAssetTrustScore` |
| `frontend/src/app/[lang]/earn/page.tsx` | Computes `trustScoreByAsset` for hub grid |
| `frontend/src/app/[lang]/earn/[asset]/page.tsx` | Full `TrustScoreCard` on asset detail |
| `frontend/src/components/earn/hub-page-grid.tsx` | Compact legacy card per asset |
| `frontend/src/components/earn/asset-grid.tsx` | Same pattern (unused today) |
| `frontend/src/lib/earn/content.ts` | Trust prose references legacy `TrustScore` type |

**Not used on `/earn`:** `lib/trust/resolve.ts`, `getProtocolTrustForDisplay`, canonical `TrustScoreCard`.

### Data flow: CPA → protocol scores → asset blend

Entry point: `frontend/src/lib/trust-score/earn-helpers.ts` → `buildEarnAssetTrustScore()`.

**Critical behaviors:**

1. **CPA-gated inclusion** — only protocols with live CPA offers for that asset contribute. `EARN_PROTOCOLS.assets` is ignored for scoring.
2. **Silent skip** — protocol slugs not in `EARN_PROTOCOLS` are dropped.
3. **Empty-set fallback** — zero contributing protocols → **50/100, grade C**, empty factors.
4. **Simple arithmetic mean** — asset score = average of protocol composite scores; factors averaged per key.

### Legacy protocol scoring (building block)

Six weighted factors (`frontend/src/lib/trust-score/factors.ts`):

| Factor | Weight |
|--------|--------|
| TVL strength | 25% |
| Protocol maturity | 15% |
| Audit status | 20% |
| Exploit history | 20% |
| APY sustainability | 10% |
| Liquidity & withdrawal | 10% |

APY sustainability uses **live catalog APY** and **protocol category** (not asset category):

- `lending`: ≤6%→90, ≤10%→75, ≤15%→55, else 35
- non-lending: ≤8%→88, ≤12%→72, ≤18%→55, else 40

Risk tier from `EARN_PROTOCOLS` nudges audit/exploit placeholders (+8/+10 for AAA, +4/+5 for AA).

### How USDT, USDC, ETH, SOL scores are calculated today

**Catalog reality** (`config.json` — 4 CPA offers at audit time):

| Offer | Asset | APY |
|-------|-------|-----|
| Jito | SOL | 8.4% |
| Lido | ETH | 3.6% |
| Aave USDC | USDC | 11.8% |
| Aave ETH | ETH | 5.2% |

**Static protocol linkage** (`EARN_PROTOCOLS.assets` in `frontend/src/lib/earn/registry.ts`):

| Asset | Linked protocols |
|-------|------------------|
| **USDT** | aave, morpho, spark, ethena, compound |
| **USDC** | aave, morpho, spark, pendle, ethena, compound |
| **ETH** | aave, lido, morpho, spark, rocket-pool, etherfi, pendle, compound |
| **SOL** | jito |

**Live `/earn` scores (legacy dynamic, approximate):**

| Asset | Contributing protocols (CPA only) | Legacy score | Canonical protocol scores |
|-------|-----------------------------------|--------------|---------------------------|
| **USDT** | *none* | **50** (default) | Aave 89, Morpho 81, Spark 81, Ethena 72, Compound 86 |
| **USDC** | Aave only | **~86** | Aave 89 |
| **ETH** | Aave + Lido | **~90** | Aave 89, Lido 90 |
| **SOL** | Jito only | **~78** | Jito 70 |

**Structural problems:**

- USDT shows **50/100** despite five linked protocols in the knowledge graph.
- USDC `/earn` (~86) disagrees with `/protocols/aave` (89) and `/compare/best-usdc-yield` (89).
- SOL `/earn` (~78) disagrees with `/protocols/jito` (70) because legacy APY heuristics and different factor weights inflate the dynamic score.
- Scores **shift when CPA offers are added or removed** — not suitable for SEO-stable trust context.

---

## 2. Proposed Earn Asset Trust Model

### Design principles

1. **Static and editorial** — align with canonical v0.1; scores do not move with CPA catalog changes.
2. **Protocol-derived, asset-framed** — asset score reflects the informational trust profile of earn routes available for that asset across the catalogued protocol set.
3. **Catalog-stable denominator** — use `EARN_PROTOCOLS.assets` ∩ `TRUST_PROTOCOL_REGISTRY`, not live CPA offers.
4. **Educational framing** — trust overview and risk context only; no ranking, endorsement, or performance claims.
5. **APY decoupled** — live APY displayed separately; does not feed asset composite in v0.1.

### `EarnAssetTrustProfile` type

```typescript
/** Supported earn asset slugs in the v0.1 static earn registry. */
export type EarnAssetSlug = "usdt" | "usdc" | "eth" | "sol";

/** How confident TJT is in the underlying earn-asset data at v0.1. */
export type EarnTrustDataStatus = "placeholder" | "estimated" | "verified";

/** Static Trust Score profile for an earn asset — TJT estimated framework v0.1. */
export type EarnAssetTrustProfile = {
  symbol: string;
  slug: EarnAssetSlug;
  assetCategory: "stablecoin" | "native";
  score: number;
  category: TrustCategory;
  categoryLabel: TrustLocalizedString;
  factors: TrustFactor[];
  contributingProtocols: TrustProtocolSlug[];
  protocolScores: Array<{ slug: TrustProtocolSlug; score: number }>;
  explanation: TrustLocalizedString;
  riskNotes: TrustLocalizedString[];
  lastReviewed: string;
  dataStatus: EarnTrustDataStatus;
  disclaimer: TrustLocalizedString;
  version: "0.1";
  blendMethod: "equal_weight_protocol_mean_v0.1";
};
```

Supporting resolver APIs:

```typescript
export function getEarnAssetTrustForDisplay(
  slug: EarnAssetSlug,
): EarnAssetTrustDisplay | null;

export function blendEarnAssetTrustProfile(
  asset: Asset,
  protocolProfiles: ProtocolTrustProfile[],
): EarnAssetTrustProfile;
```

### Asset-level methodology

**Question answered:** *"Based on TJT's canonical protocol trust profiles, what is the informational trust context for earn routes on this asset?"*

**Blend rule (v0.1):**

```
contributingProtocols = EARN_PROTOCOLS
  .filter(p => p.assets.includes(asset.slug))
  .map(p => p.slug)
  .filter(slug => slug in TRUST_PROTOCOL_REGISTRY)

asset.score = round( mean( profile.score for profile in contributingProtocols ) )

for each canonical factor key:
  asset.factors[key] = equal-weight mean of protocol.factors[key].score
  asset.factors[key].dataStatus = worstStatus(protocol factors)
  asset.factors[key].note = editorial asset-context note

asset.category = scoreToCategory(asset.score)
```

**No APY input. No CPA input. No letter grades.**

### Protocol profiles per asset

| Asset | Contributing protocols | Canonical scores |
|-------|------------------------|------------------|
| **USDT** | aave, morpho, spark, ethena, compound | 89, 81, 81, 72, 86 |
| **USDC** | aave, morpho, spark, pendle, ethena, compound | 89, 81, 81, 78, 72, 86 |
| **ETH** | aave, lido, morpho, spark, rocket-pool, etherfi, pendle, compound | 89, 90, 81, 81, 82, 74, 78, 86 |
| **SOL** | jito | 70 |

### Proposed static asset scores (computed)

| Asset | Protocol mean | Category | Δ vs legacy today |
|-------|---------------|----------|-------------------|
| **USDT** | **82** | High Trust | +32 (was 50 default) |
| **USDC** | **81** | High Trust | −5 (was ~86 dynamic) |
| **ETH** | **83** | High Trust | −7 (was ~90 dynamic) |
| **SOL** | **70** | Moderate Trust | −8 (was ~78 dynamic) |

### Factor weights

Asset factors inherit **canonical 8-factor weights** from `frontend/src/lib/trust/trust-score.ts` — no separate asset factor weight table in v0.1:

| Factor | Weight |
|--------|--------|
| TVL | 20% |
| Protocol age | 12% |
| Audits | 18% |
| Exploit history | 15% |
| Liquidity | 12% |
| Yield sustainability | 8% |
| Protocol adoption | 10% |
| Documentation quality | 5% |

Composite = Σ (blended sub-score × weight/100), same as protocol profiles.

**v0.2 candidate (not v0.1):** asset-overlay factors such as `issuer_transparency` (USDT vs USDC), `route_diversity`, `chain_coverage`. Defer until issuer and chain data pipelines exist.

### Fallback rules

| Condition | Behavior |
|-----------|----------|
| Asset slug not in `EARN_ASSETS` | `getEarnAssetTrustForDisplay` → `null`; page `notFound()` |
| Zero protocols in `EARN_PROTOCOLS.assets` | Should not occur for v0.1 catalog; if it does → `null` + log |
| Protocol in `EARN_PROTOCOLS` but missing from `TRUST_PROTOCOL_REGISTRY` | Exclude from blend; log warning |
| All contributing protocols excluded | `null`; UI shows "Trust context unavailable" (not 50 default) |
| Single-protocol asset (SOL) | Valid — score = that protocol's canonical score |
| Runtime blend vs hand-authored registry | **v0.1: runtime blend** from canonical profiles (DRY); optional hand-authored `EARN_ASSET_TRUST_REGISTRY` for editorial overrides in v0.2 |

### `dataStatus` rules

**Profile-level:**

| Status | When |
|--------|------|
| `estimated` | Default for all four v0.1 asset profiles (blend of estimated protocol profiles) |
| `placeholder` | Any contributing protocol profile is `placeholder`-dominated AND asset has <3 routes |
| `verified` | Reserved for v1.0 when external feeds connect |

**Factor-level:** `worstStatus` across contributing protocol factors for that key.

**Copy requirement:** Asset cards must state scores are an **estimated educational framework** derived from protocol-level profiles, not live market data.

### APY: now or later?

| | v0.1 (now) | v1.0+ (later) |
|---|-----------|---------------|
| **APY in trust composite** | **No** | Optional `yield_sustainability_live` factor with verified feed |
| **APY on page** | Yes — separate indicative snapshot from CPA catalog | Same, with freshness metadata |
| **Rationale** | Live APY is volatile, offer-specific, and conflates yield level with protocol trust; canonical `yield_sustainability` is already editorial per protocol | Risk Engine can ingest utilization, incentive expiry, and stress scenarios |

Keeping APY out of v0.1 asset scores also eliminates the lending-category vs stablecoin-asset mismatch in legacy `scoreApySustainability`.

---

## 3. Migration plan

| Phase | Scope | UI change | `lib/trust-score/` |
|-------|-------|-----------|---------------------|
| **4a** | Add `EarnAssetTrustProfile`, blend + resolver in `lib/trust/`; parallel compute behind dev guard | None | Retained |
| **4b** | Extend `verify-trust-unification.ts`; add `verify-earn-trust.ts` | None | Retained |
| **4c** | Swap earn pages to canonical `TrustScoreCard`; category bands replace letter grades | **Yes** | Retained (protocol fallback) |
| **4d** | Update `TRUST_SCORE_V1.md`, `TRUST_SCORE_UNIFICATION.md` | Copy only | Retained |
| **5** | Remove legacy module after all surfaces migrated + live feeds scoped | — | Deprecated |

**Ordering constraint:** 4a → 4b must pass before 4c. No UI flip until verification green.

---

## 4. Risk list

### Risks if `/earn` stays on legacy

| Risk | Severity | Detail |
|------|----------|--------|
| Cross-surface score drift | High | Same protocol shows different scores on `/earn`, `/protocols`, `/compare` |
| CPA catalog volatility | High | Adding/removing offers changes asset scores (USDT stuck at 50 today) |
| SEO inconsistency | Medium | Indexable trust prose on earn pages disagrees with protocol/compare pages |
| Dual maintenance | Medium | `placeholders.ts` and `trust-registry.ts` drift independently |
| Grading confusion | Medium | Letter grades on earn vs category bands elsewhere |
| APY-driven trust swings | Medium | Rate changes re-score protocols without editorial review |
| Risk Engine integration debt | High | API consumers cannot rely on a single trust schema |

### Risks if `/earn` is migrated too early

| Risk | Severity | Detail |
|------|----------|--------|
| Premature UI flip | High | Users see new scores before blend rules are verified |
| SOL single-protocol exposure | Medium | Asset score = Jito 70 with no diversification context unless `riskNotes` are strong |
| USDT score jump | Medium | 50 → 82 may look like "improvement" without clear methodology disclosure |
| Incomplete verification | High | Earn excluded from current `verify-trust-unification.ts` |
| Type migration breakage | Medium | `content.ts`, `hub-page-grid.tsx` import legacy `TrustScore` type |
| Editorial lag | Low | New protocol in `EARN_PROTOCOLS` before `TRUST_PROTOCOL_REGISTRY` → excluded silently |

---

## 5. Files to touch (implementation reference)

### New files

| File | Purpose |
|------|---------|
| `frontend/src/lib/trust/earn-trust-types.ts` | `EarnAssetTrustProfile`, display types |
| `frontend/src/lib/trust/earn-trust-blend.ts` | `blendEarnAssetTrustProfile`, contributor resolution |
| `frontend/src/lib/trust/earn-trust-resolve.ts` | `getEarnAssetTrustForDisplay` |
| `frontend/scripts/verify-earn-trust.ts` | Asset blend parity + contributor set checks |

### Modified files (Phase 4c)

| File | Change |
|------|--------|
| `frontend/src/lib/trust/index.ts` | Export earn trust APIs |
| `frontend/src/app/[lang]/earn/page.tsx` | Replace `buildEarnAssetTrustScore` → `getEarnAssetTrustForDisplay` |
| `frontend/src/app/[lang]/earn/[asset]/page.tsx` | Canonical card + profile type |
| `frontend/src/components/earn/hub-page-grid.tsx` | Canonical compact card |
| `frontend/src/lib/earn/index.ts` | Stop re-exporting legacy builder (or deprecate) |
| `frontend/src/lib/earn/content.ts` | Update trust prose types and copy |
| `frontend/scripts/verify-trust-unification.ts` | Cross-surface earn parity section |
| `docs/TRUST_SCORE_UNIFICATION.md` | Phase 4 completion notes |
| `docs/TRUST_SCORE_V1.md` | Earn asset section |

### Untouched in Phase 4

| File | Reason |
|------|--------|
| `frontend/src/lib/trust-score/**` | Retained per migration policy |
| `frontend/src/components/trust-score/**` | Deprecated after 4c, not deleted |
| `frontend/src/lib/protocols/registry.ts` | Legacy `trustScore` field kept for fallback |
| `config.json` | APY display unchanged |

---

## 6. Test plan

### Automated (`verify-earn-trust.ts`)

- [ ] All 4 asset slugs resolve non-null profiles
- [ ] Contributor sets match `EARN_PROTOCOLS.assets` ∩ registry exactly
- [ ] USDT score = 82, USDC = 81, ETH = 83, SOL = 70 (rounded mean)
- [ ] Each asset `category` matches `scoreToCategory(score)`
- [ ] Factor composites recompute to profile `score` (±1 rounding)
- [ ] `dataStatus` is `estimated` for all v0.1 profiles
- [ ] SOL `contributingProtocols` = `["jito"]` only

### Cross-surface parity (`verify-trust-unification.ts` extension)

- [ ] For each protocol on an earn asset page, `protocol.trustProfile.score` appears in `protocolScores` audit trail
- [ ] `/earn/usdc` asset score ≠ single-protocol score (multi-protocol blend)
- [ ] Earn asset score ≠ any single offer APY value (sanity)

### Manual QA

- [ ] `/earn` hub — 4 cards show category bands, not A–F
- [ ] `/earn/usdt` — score 82, lists 5 contributing protocols in explanation
- [ ] `/earn/sol` — score 70, matches `/protocols/jito`
- [ ] `/earn/usdc` — score 81; `/compare/best-usdc-yield` Aave row still 89
- [ ] APY still displays from catalog; changing `config.json` APY does **not** change trust score
- [ ] EN/RU disclaimer and risk notes render

---

## 7. Recommendation

**Partially migrate** — approve model now, implement in phased order (4a → 4b → 4c).

| Option | Verdict | Rationale |
|--------|---------|-----------|
| Migrate now (full cutover) | ❌ | No `EarnAssetTrustProfile` exists; verification not written; USDT 50→82 needs disclosure |
| **Partially migrate** | ✅ | Add static model + verification first; flip UI only when parity checks pass |
| Wait indefinitely | ❌ | Legacy earn is the last cross-surface inconsistency; blocks Risk Engine schema unification |

Do not wait on product grounds — the architecture is defined here. Do wait on UI cutover until Phase 4a/4b complete.

---

## 8. Next implementation prompt (Step 9)

**TJT Step 9 — Implement Earn Asset Trust Model (Phase 4a–4b only, no UI change)**

Context: Step 8 audit approved. Canonical protocol trust lives in `lib/trust/`. `/earn` still uses legacy `lib/trust-score/`. Do NOT remove `lib/trust-score/`. Do NOT change `/earn` UI yet.

**Implement Phase 4a:**

1. Create `frontend/src/lib/trust/earn-trust-types.ts` with `EarnAssetTrustProfile` per this spec.
2. Create `frontend/src/lib/trust/earn-trust-blend.ts`:
   - `getContributingProtocolsForAsset(assetSlug)` from `EARN_PROTOCOLS` ∩ `TRUST_PROTOCOL_REGISTRY`
   - `blendEarnAssetTrustProfile(asset, profiles)` — equal-weight mean, canonical 8-factor blend
   - Asset-specific `riskNotes` (stablecoin issuer context for USDT/USDC; single-protocol note for SOL)
3. Create `frontend/src/lib/trust/earn-trust-resolve.ts` with `getEarnAssetTrustForDisplay(slug)`.
4. Export from `lib/trust/index.ts`.

**Implement Phase 4b:**

5. Create `frontend/scripts/verify-earn-trust.ts` with all automated checks from Section 6.
6. Add dev-only parallel compute in `earn/page.tsx` (env guard) logging legacy vs static scores — no UI wiring.

**Constraints:**

- No APY in asset blend
- No changes to `hub-page-grid.tsx`, `trust-score-card.tsx`, or earn card rendering
- Keep `buildEarnAssetTrustScore` as production path
- Use neutral educational language in all copy

**Verify:**

```bash
cd frontend && npx tsx scripts/verify-earn-trust.ts
cd frontend && npx tsx scripts/verify-trust-unification.ts
```

---

*Last reviewed: 2026-06-10. Status: design approved, implementation pending (Phase 4a).*
