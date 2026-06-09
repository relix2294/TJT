import type { Locale } from "@/lib/i18n";
import type {
  Protocol,
  ProtocolTrustScorePlaceholder,
} from "@/lib/protocols/types";

export const PROTOCOL_TRUST_SCORE_FACTOR_KEYS = [
  "audit_status",
  "tvl_depth",
  "smart_contract_age",
  "governance_decentralization",
  "historical_exploit_record",
  "liquidity_exit_speed",
] as const;

export const DEFAULT_PROTOCOL_TRUST_SCORE: ProtocolTrustScorePlaceholder = {
  score: null,
  status: "coming_soon",
  label: {
    en: "Trust Score (coming soon)",
    ru: "Trust Score (скоро)",
  },
  factorKeys: PROTOCOL_TRUST_SCORE_FACTOR_KEYS,
};

/** Hub-level copy — bilingual, independent of config.json for protocols foundation. */
export const PROTOCOLS_HUB_COPY = {
  metaTitle: {
    en: "DeFi Protocol Reviews — Aave, Lido, Jito | TJT",
    ru: "Обзоры DeFi-протоколов — Aave, Lido, Jito | TJT",
  },
  metaDescription: {
    en: "Protocol reviews for Aave, Lido and Jito. Supported assets, chains, earn routes, linked offers and Trust Score placeholders.",
    ru: "Обзоры протоколов Aave, Lido и Jito. Поддерживаемые активы, сети, earn-маршруты, офферы и заглушки Trust Score.",
  },
  eyebrow: { en: "Protocols Engine", ru: "Protocols Engine" },
  title: {
    en: "DeFi Protocol Reviews",
    ru: "Обзоры DeFi-протоколов",
  },
  subtitle: {
    en: "Protocol-first discovery for lending and liquid-staking routes. Every page is SEO-ready and wired for Trust Score and Compare expansion.",
    ru: "Поиск по протоколам для lending и liquid staking. SEO-готовые страницы с заделом под Trust Score и Compare.",
  },
  gridTitle: { en: "Featured protocols", ru: "Избранные протоколы" },
  exploreLabel: { en: "View protocol review", ru: "Открыть обзор" },
  breadcrumbProtocols: { en: "Protocols", ru: "Протоколы" },
} as const;

export const PROTOCOL_CONTENT_BLOCK_KEYS = [
  "overview",
  "supported_assets",
  "supported_chains",
  "earn_opportunities",
  "linked_offers",
  "trust_score_placeholder",
  "risk_explanation",
  "legal_disclaimer",
  "compare_teaser",
] as const;

export type ProtocolContentBlockKey = (typeof PROTOCOL_CONTENT_BLOCK_KEYS)[number];

export type ProtocolContentBlock = {
  key: ProtocolContentBlockKey;
  title: string;
  body: string;
  aiSlot?: boolean;
};

export function protocolMetaTitle(protocol: Protocol, lang: Locale): string {
  return {
    en: `${protocol.name} Protocol Review — Assets, Chains & Earn | TJT`,
    ru: `Обзор протокола ${protocol.name} — активы, сети и Earn | TJT`,
  }[lang];
}

export function protocolMetaDescription(protocol: Protocol, lang: Locale): string {
  return protocol.description[lang];
}

export function buildProtocolContentBlocks(
  protocol: Protocol,
  lang: Locale,
): ProtocolContentBlock[] {
  const assetList = protocol.supportedAssets.map((a) => a.symbol).join(", ");
  const chainList = protocol.supportedChains
    .map((c) => c.name[lang])
    .join(", ");

  return [
    {
      key: "overview",
      title: { en: "Overview", ru: "Обзор" }[lang],
      body: protocol.description[lang],
    },
    {
      key: "supported_assets",
      title: { en: "Supported assets", ru: "Поддерживаемые активы" }[lang],
      body: {
        en: `${protocol.name} supports ${assetList || "catalogued assets"} across TJT earn routes. Each asset links to a dedicated earn hub for APY comparison.`,
        ru: `${protocol.name} поддерживает ${assetList || "активы каталога"} в earn-маршрутах TJT. Каждый актив ведёт на отдельный earn-хаб для сравнения APY.`,
      }[lang],
    },
    {
      key: "supported_chains",
      title: { en: "Supported chains", ru: "Поддерживаемые сети" }[lang],
      body: {
        en: `Live deployments include ${chainList || "configured chains"}. Chain coverage expands as CPA catalog and knowledge graph grow.`,
        ru: `Активные развёртывания: ${chainList || "настроенные сети"}. Покрытие сетей расширяется по мере роста каталога и knowledge graph.`,
      }[lang],
      aiSlot: true,
    },
    {
      key: "trust_score_placeholder",
      title: protocol.trustScore.label[lang],
      body: {
        en: `Trust Score (${protocol.trustScore.factorKeys.join(", ")}) — launching soon. No score computed on this page.`,
        ru: `Trust Score (${protocol.trustScore.factorKeys.join(", ")}) — скоро. На этой странице оценка не рассчитывается.`,
      }[lang],
      aiSlot: true,
    },
    {
      key: "risk_explanation",
      title: protocol.riskProfile.label[lang],
      body: protocol.riskProfile.explanation[lang],
      aiSlot: true,
    },
    {
      key: "legal_disclaimer",
      title: { en: "Legal disclaimer", ru: "Юридический дисклеймер" }[lang],
      body: {
        en: "TJT is a non-custodial information broker. Protocol reviews are educational snapshots, not investment advice. APY figures are indicative. Smart-contract, bridge, governance and liquidity risks apply. Always verify on-chain before signing transactions.",
        ru: "TJT — некастодиальный информационный брокер. Обзоры протоколов носят образовательный характер, не являются инвестиционной рекомендацией. APY — ориентировочные значения. Риски смарт-контрактов, мостов, governance и ликвидности сохраняются. Проверяйте on-chain перед подписанием транзакций.",
      }[lang],
    },
    {
      key: "compare_teaser",
      title: { en: "Compare protocols", ru: "Сравнение протоколов" }[lang],
      body: {
        en: "Side-by-side protocol comparison pages are planned. This block reserves crawlable internal-link slots for future Compare integration.",
        ru: "Страницы сравнения протоколов в разработке. Блок резервирует слоты для будущей интеграции Compare.",
      }[lang],
      aiSlot: true,
    },
  ];
}
