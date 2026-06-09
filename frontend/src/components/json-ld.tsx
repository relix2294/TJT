import { serializeJsonLd } from "@/lib/seo/json-ld";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Inline JSON-LD block — use alongside page-specific schema builders. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
