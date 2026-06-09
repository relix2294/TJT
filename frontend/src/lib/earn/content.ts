import type { Locale } from "@/lib/i18n";
import type { Asset } from "@/lib/earn/types";
import type { TrustScore } from "@/lib/trust-score";

/** Hub-level copy — bilingual, independent of config.json for earn foundation. */
export const EARN_HUB_COPY = {
  metaTitle: {
    en: "Crypto Earn Hub — USDT, USDC, ETH, SOL Yield | TJT",
    ru: "Crypto Earn — доходность USDT, USDC, ETH, SOL | TJT",
  },
  metaDescription: {
    en: "Explore non-custodial yield routes for USDT, USDC, ETH and SOL. APY snapshots, protocol mapping, TJT Trust Score v0.1 indicators and scalable earn knowledge graph.",
    ru: "Некастодиальные маршруты доходности для USDT, USDC, ETH и SOL. APY, протоколы, индикаторы TJT Trust Score v0.1 и масштабируемый earn knowledge graph.",
  },
  eyebrow: { en: "Earn Engine", ru: "Earn Engine" },
  title: {
    en: "Crypto Earn Knowledge Graph",
    ru: "Crypto Earn Knowledge Graph",
  },
  subtitle: {
    en: "Asset-first yield discovery for stablecoins and native tokens. Every page is SEO-ready and wired for 10,000+ programmatic expansion.",
    ru: "Поиск доходности по активам: стейблкоины и нативные токены. SEO-готовые страницы для масштабирования до 10 000+ URL.",
  },
  assetGridTitle: { en: "Earn by asset", ru: "Доходность по активу" },
  exploreLabel: { en: "Explore earn routes", ru: "Открыть маршруты" },
  breadcrumbEarn: { en: "Earn", ru: "Earn" },
} as const;

export function earnAssetMetaTitle(asset: Asset, lang: Locale): string {
  const name = asset.name[lang];
  return {
    en: `${asset.symbol} Earn — Best Yield Routes & APY | TJT`,
    ru: `${asset.symbol} Earn — лучшие маршруты и APY | TJT`,
  }[lang].replace(asset.symbol, `${name} (${asset.symbol})`);
}

export function earnAssetMetaDescription(asset: Asset, lang: Locale): string {
  return asset.description[lang];
}

/** Reusable AI content block keys for programmatic page generation. */
export const EARN_CONTENT_BLOCK_KEYS = [
  "hero_summary",
  "how_it_works",
  "risk_disclosure",
  "chain_landscape",
  "protocol_landscape",
  "top_opportunities",
  "trust_score_placeholder",
  "faq",
  "related_assets",
  "compare_teaser",
] as const;

export type EarnContentBlockKey = (typeof EARN_CONTENT_BLOCK_KEYS)[number];

export type EarnContentBlock = {
  key: EarnContentBlockKey;
  title: string;
  body: string;
  /** When true, block is a slot for future AI-generated prose. */
  aiSlot?: boolean;
};

/** Default content blocks for asset pages — AI slots marked for future injection. */
export function buildEarnAssetContentBlocks(
  asset: Asset,
  lang: Locale,
  trustScore: TrustScore,
): EarnContentBlock[] {
  const symbol = asset.symbol;
  const isStable = asset.category === "stablecoin";

  return [
    {
      key: "hero_summary",
      title: { en: `Earn on ${symbol}`, ru: `Доходность на ${symbol}` }[lang],
      body: asset.description[lang],
    },
    {
      key: "how_it_works",
      title: { en: "How it works", ru: "Как это работает" }[lang],
      body: {
        en: isStable
          ? `Supply ${symbol} to audited lending protocols. Yield comes from borrower demand — you keep self-custody and sign every transaction.`
          : `Stake or supply ${symbol} through liquid-staking and lending routes. Rewards accrue on-chain; positions stay composable across DeFi.`,
        ru: isStable
          ? `Поставьте ${symbol} в аудированные lending-протоколы. Доход от спроса заёмщиков — self-custody, каждая транзакция под вашей подписью.`
          : `Стейкайте или поставьте ${symbol} через liquid staking и lending. Награды накопляются on-chain; позиции композируются в DeFi.`,
      }[lang],
      aiSlot: true,
    },
    {
      key: "risk_disclosure",
      title: { en: "Risk disclosure", ru: "Раскрытие рисков" }[lang],
      body: {
        en: "TJT is a non-custodial information broker. APY figures are indicative snapshots, not guarantees. Smart-contract, bridge and liquidity risks apply.",
        ru: "TJT — некастодиальный информационный брокер. APY — ориентировочные снимки, не гарантии. Риски смарт-контрактов, мостов и ликвидности сохраняются.",
      }[lang],
    },
    {
      key: "trust_score_placeholder",
      title: {
        en: `TJT Trust Score v0.1 — ${symbol}`,
        ru: `TJT Trust Score v0.1 — ${symbol}`,
      }[lang],
      body: trustScore.explanation.detailed?.[lang] ?? trustScore.explanation.short[lang],
    },
    {
      key: "compare_teaser",
      title: { en: "Compare routes", ru: "Сравнение маршрутов" }[lang],
      body: {
        en: "Side-by-side protocol comparison pages are planned. This block reserves crawlable internal-link slots.",
        ru: "Страницы сравнения протоколов в разработке. Блок резервирует слоты для внутренних ссылок.",
      }[lang],
      aiSlot: true,
    },
  ];
}

