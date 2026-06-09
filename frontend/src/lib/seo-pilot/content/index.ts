import type { SeoPilotHubSegment, SeoPilotPage, SeoPilotSlug } from "@/lib/seo-pilot/types";
import {
  REVIEW_SLUGS,
  SAFETY_SLUGS,
  LEARN_SLUGS,
  EARN_GUIDE_SLUGS,
  isReviewSlug,
  isSafetySlug,
  isLearnSlug,
  isEarnGuideSlug,
} from "@/lib/seo-pilot/types";
import { REVIEW_PAGES } from "@/lib/seo-pilot/content/reviews";
import { SAFETY_PAGES } from "@/lib/seo-pilot/content/safety";
import { LEARN_PAGES } from "@/lib/seo-pilot/content/learn";
import { EARN_GUIDE_PAGES } from "@/lib/seo-pilot/content/earn-guide";

export const SEO_PILOT_PAGES: SeoPilotPage[] = [
  ...REVIEW_PAGES,
  ...SAFETY_PAGES,
  ...LEARN_PAGES,
  ...EARN_GUIDE_PAGES,
];

const PAGE_BY_SLUG = new Map<SeoPilotSlug, SeoPilotPage>(
  SEO_PILOT_PAGES.map((page) => [page.slug, page]),
);

export function getSeoPilotPage(slug: string): SeoPilotPage | undefined {
  return PAGE_BY_SLUG.get(slug as SeoPilotSlug);
}

export function getSeoPilotPagesByHub(
  hubSegment: SeoPilotHubSegment,
): SeoPilotPage[] {
  return SEO_PILOT_PAGES.filter((page) => page.hubSegment === hubSegment);
}

export function getSeoPilotSlugsForHub(hubSegment: SeoPilotHubSegment): string[] {
  switch (hubSegment) {
    case "reviews":
      return [...REVIEW_SLUGS];
    case "safety":
      return [...SAFETY_SLUGS];
    case "learn":
      return [...LEARN_SLUGS];
    case "earn":
      return [...EARN_GUIDE_SLUGS];
  }
}

export function isSeoPilotSlugForHub(
  hubSegment: SeoPilotHubSegment,
  slug: string,
): boolean {
  switch (hubSegment) {
    case "reviews":
      return isReviewSlug(slug);
    case "safety":
      return isSafetySlug(slug);
    case "learn":
      return isLearnSlug(slug);
    case "earn":
      return isEarnGuideSlug(slug);
  }
}
