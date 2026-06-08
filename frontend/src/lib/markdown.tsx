import { Fragment, type ReactNode } from "react";

/**
 * Minimal, dependency-free Markdown renderer for AI-authored news `content`.
 *
 * The TJT backend emits trusted Markdown text (no raw HTML), so a tiny,
 * audited subset is safer and lighter than pulling a full Markdown engine:
 * headings (##, ###), paragraphs, unordered/ordered lists, blockquotes, and
 * inline **bold**, *italic*, `code` and [links](url).
 *
 * Everything is styled in the graphite-platinum palette via Tailwind utility
 * classes (no external typography plugin).
 */

const INLINE_PATTERN =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-i${i++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-numeric text-[0.85em] text-platinum"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={key} className="italic text-foreground/90">
          {token.slice(1, -1)}
        </em>,
      );
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = /^https?:\/\//.test(href);
        nodes.push(
          <a
            key={key}
            href={href}
            className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

type Block =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let quote: string[] = [];
  let ul: string[] = [];
  let ol: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      blocks.push({ type: "quote", text: quote.join(" ") });
      quote = [];
    }
  };
  const flushUl = () => {
    if (ul.length) {
      blocks.push({ type: "ul", items: ul });
      ul = [];
    }
  };
  const flushOl = () => {
    if (ol.length) {
      blocks.push({ type: "ol", items: ol });
      ol = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushQuote();
    flushUl();
    flushOl();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === "") {
      flushAll();
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushAll();
      blocks.push({
        type: "heading",
        level: heading[1].length as 2 | 3 | 4,
        text: heading[2].trim(),
      });
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushUl();
      flushOl();
      quote.push(line.replace(/^>\s?/, ""));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      flushOl();
      ul.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    const ordered = /^\d+\.\s+(.*)$/.exec(line);
    if (ordered) {
      flushParagraph();
      flushQuote();
      flushUl();
      ol.push(ordered[1]);
      continue;
    }

    flushQuote();
    flushUl();
    flushOl();
    paragraph.push(line.trim());
  }

  flushAll();
  return blocks;
}

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseBlocks(content);

  return (
    <div className={className}>
      {blocks.map((block, idx) => {
        const key = `b-${idx}`;
        switch (block.type) {
          case "heading": {
            if (block.level === 2) {
              return (
                <h2
                  key={key}
                  className="mt-10 mb-4 font-heading text-2xl font-bold text-white first:mt-0 sm:text-3xl"
                >
                  {renderInline(block.text, key)}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3
                  key={key}
                  className="mt-8 mb-3 font-heading text-xl font-bold text-white"
                >
                  {renderInline(block.text, key)}
                </h3>
              );
            }
            return (
              <h4
                key={key}
                className="mt-6 mb-2 font-heading text-lg font-semibold text-white"
              >
                {renderInline(block.text, key)}
              </h4>
            );
          }
          case "quote":
            return (
              <blockquote
                key={key}
                className="my-6 rounded-r-xl border-l-2 border-primary/60 bg-white/[0.03] py-3 pr-4 pl-5 text-[0.95rem] leading-relaxed text-foreground/80 italic"
              >
                {renderInline(block.text, key)}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={key} className="my-5 space-y-2 pl-1">
                {block.items.map((item, i) => (
                  <li
                    key={`${key}-${i}`}
                    className="flex gap-3 text-[0.95rem] leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/70"
                    />
                    <span>{renderInline(item, `${key}-${i}`)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} className="my-5 space-y-2 pl-1">
                {block.items.map((item, i) => (
                  <li
                    key={`${key}-${i}`}
                    className="flex gap-3 text-[0.95rem] leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="font-numeric text-sm font-semibold text-primary"
                    >
                      {i + 1}.
                    </span>
                    <span>{renderInline(item, `${key}-${i}`)}</span>
                  </li>
                ))}
              </ol>
            );
          case "paragraph":
          default:
            return (
              <p
                key={key}
                className="my-4 text-[0.95rem] leading-relaxed text-muted-foreground"
              >
                <Fragment>{renderInline(block.text, key)}</Fragment>
              </p>
            );
        }
      })}
    </div>
  );
}
