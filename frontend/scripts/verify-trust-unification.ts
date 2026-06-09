/**
 * Lightweight verification for Trust Score unification (Phases 0–3).
 * Run: npx tsx scripts/verify-trust-unification.ts
 */
import { COMPARE_SLUGS } from "../src/lib/compare/types";
import { buildComparePagesFromOffers } from "../src/lib/compare/registry";
import { buildProtocolsFromOffers } from "../src/lib/protocols/registry";
import { PROTOCOL_SLUGS } from "../src/lib/protocols/types";
import {
  getProtocolTrustForDisplay,
  getTrustProfile,
  getTrustProfileOrNull,
  resolveTrustSlugFromSeoPilot,
  SEO_PILOT_TRUST_SLUG_MAP,
  trustProfileToCompareBadge,
  TRUST_PROTOCOL_SLUGS,
} from "../src/lib/trust";
import { isProtocolComparison, isYieldComparison } from "../src/lib/compare/types";

let failures = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failures += 1;
  } else {
    console.log(`OK: ${message}`);
  }
}

console.log("=== Resolver unit checks ===\n");

for (const slug of TRUST_PROTOCOL_SLUGS) {
  const display = getProtocolTrustForDisplay(slug);
  const profile = getTrustProfile(slug);
  const badge = trustProfileToCompareBadge(profile);

  assert(display !== null, `getProtocolTrustForDisplay(${slug}) returns profile`);
  assert(display!.score === profile.score, `${slug} display score matches profile`);
  assert(badge.score === profile.score, `${slug} badge score matches profile`);
  assert(
    display!.categoryLabel.en === profile.categoryLabel.en,
    `${slug} display category matches profile`,
  );
}

assert(
  getProtocolTrustForDisplay("unknown-protocol") === null,
  "unknown slug returns null",
);

console.log("\n=== Protocol registry (Phase 3) ===\n");

const protocols = buildProtocolsFromOffers([], "en");

for (const slug of PROTOCOL_SLUGS) {
  const protocol = protocols.find((p) => p.slug === slug)!;
  const canonical = getTrustProfile(slug);

  assert(
    protocol.trustProfile !== null && protocol.trustProfile !== undefined,
    `${slug} protocol has trustProfile`,
  );
  assert(
    protocol.trustProfile!.score === canonical.score,
    `${slug} protocol trustProfile score matches registry (${canonical.score})`,
  );
  assert(
    protocol.trustScore !== undefined,
    `${slug} protocol retains legacy trustScore`,
  );
}

console.log("\n=== Cross-surface score consistency (compare · protocols · reviews · safety) ===\n");

const canonicalScores: Record<string, number> = {};
for (const slug of TRUST_PROTOCOL_SLUGS) {
  canonicalScores[slug] = getTrustProfile(slug).score;
}

for (const slug of PROTOCOL_SLUGS) {
  const protocol = protocols.find((p) => p.slug === slug)!;
  const canonical = canonicalScores[slug];

  assert(
    protocol.trustProfile!.score === canonical,
    `${slug} protocols page score ${protocol.trustProfile!.score} === canonical ${canonical}`,
  );
}

const comparePages = buildComparePagesFromOffers([], "en");

for (const slug of COMPARE_SLUGS) {
  const page = comparePages.find((p) => p.slug === slug);
  if (!page) continue;

  const comparison = page.comparison;

  if (isProtocolComparison(comparison)) {
    for (const side of [comparison.left, comparison.right]) {
      const canonical = canonicalScores[side.protocolSlug];
      assert(
        side.trustProfile?.score === canonical,
        `${slug} compare ${side.protocolSlug} score ${side.trustProfile?.score} === canonical ${canonical}`,
      );
    }
  }

  if (isYieldComparison(comparison)) {
    for (const row of comparison.rows) {
      const canonical = canonicalScores[row.protocolSlug];
      if (canonical === undefined) continue;
      assert(
        row.trustProfile?.score === canonical,
        `${slug} compare yield ${row.protocolSlug} score ${row.trustProfile?.score} === canonical ${canonical}`,
      );
    }
  }
}

for (const [seoSlug, protocolSlug] of Object.entries(SEO_PILOT_TRUST_SLUG_MAP)) {
  const reviewProfile = getTrustProfileOrNull(protocolSlug);
  const resolved = resolveTrustSlugFromSeoPilot(seoSlug);
  const canonical = canonicalScores[protocolSlug];

  assert(resolved === protocolSlug, `${seoSlug} resolves to ${protocolSlug}`);
  assert(
    reviewProfile?.score === canonical,
    `reviews/safety ${seoSlug} → ${protocolSlug} score ${reviewProfile?.score} === canonical ${canonical}`,
  );
}

console.log("\n=== Compare table vs overview parity ===\n");

for (const slug of COMPARE_SLUGS) {
  const page = comparePages.find((p) => p.slug === slug);
  assert(page !== undefined, `compare page exists: ${slug}`);
  if (!page) continue;

  const comparison = page.comparison;

  if (isProtocolComparison(comparison)) {
    for (const side of [comparison.left, comparison.right]) {
      const overview = getTrustProfile(side.protocolSlug);
      assert(
        side.trustBadge !== null && side.trustBadge !== undefined,
        `${slug} ${side.protocolSlug} has trustBadge`,
      );
      assert(
        side.trustProfile?.score === overview.score,
        `${slug} ${side.protocolSlug} trustProfile matches registry`,
      );
      assert(
        side.trustBadge!.score === overview.score,
        `${slug} ${side.protocolSlug} table score matches overview (${overview.score})`,
      );
      if (side === comparison.left) {
        const metric = page.metrics.find((m) => m.key === "trust_left");
        assert(
          metric?.value === overview.score,
          `${slug} trust_left metric matches static score`,
        );
      }
      if (side === comparison.right) {
        const metric = page.metrics.find((m) => m.key === "trust_right");
        assert(
          metric?.value === overview.score,
          `${slug} trust_right metric matches static score`,
        );
      }
    }
  }

  if (isYieldComparison(comparison)) {
    for (const row of comparison.rows) {
      const overview = getTrustProfileOrNull(row.protocolSlug);
      if (!overview) continue;
      assert(
        row.trustBadge?.score === overview.score,
        `${slug} ${row.protocolSlug} yield row table score matches overview (${overview.score})`,
      );
    }
  }
}

console.log("\n=== Canonical scores (all 10 protocols) ===\n");
for (const slug of PROTOCOL_SLUGS) {
  console.log(`  ${slug}: ${canonicalScores[slug]}`);
}

console.log(`\n=== Result: ${failures} failure(s) ===\n`);
process.exit(failures > 0 ? 1 : 0);
