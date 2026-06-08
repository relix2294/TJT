import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

const SITE_URL = "https://tjt.example";

/**
 * Strict, SEO-friendly breadcrumb trail.
 *
 * Renders a semantic <nav>/<ol> for users and an inline `BreadcrumbList`
 * JSON-LD block for Google crawlers, so article and listing pages expose a
 * machine-readable hierarchy.
 */
export function Breadcrumbs({
  items,
  ariaLabel,
}: {
  items: Crumb[];
  ariaLabel: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label={ariaLabel} className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded-md px-1.5 py-0.5 font-medium transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "rounded-md px-1.5 py-0.5 font-medium text-platinum"
                      : "px-1.5 py-0.5"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  aria-hidden
                  className="size-3.5 text-muted-foreground/50"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
