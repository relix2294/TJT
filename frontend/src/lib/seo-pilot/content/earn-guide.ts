import type { Locale } from "@/lib/i18n";
import { L, type SeoPilotPage } from "@/lib/seo-pilot/types";

function compareHref(lang: Locale, slug: string) {
  return `/${lang}/compare/${slug}`;
}

function earnHref(lang: Locale, asset: string) {
  return `/${lang}/earn/${asset}`;
}

function marketHref(lang: Locale, slug: string) {
  return `/${lang}/market/${slug}`;
}

export const EARN_GUIDE_PAGES: SeoPilotPage[] = [
  {
    slug: "how-to-compare-usdt-yield",
    type: "earn_guide",
    hubSegment: "earn",
    metaTitle: L(
      "How to Compare USDT Yield — Educational Guide | TJT",
      "Как сравнивать USDT yield — образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn how USDT yield comparison works on TJT: APY, TVL, Trust Score, protocol factors, and Compare workflows. Educational information — compare opportunities, not financial advice.",
      "Как работает сравнение USDT yield на TJT: APY, TVL, Trust Score, факторы протоколов и workflow Compare. Образовательная информация — сравнивайте opportunities.",
    ),
    h1: L("How to Compare USDT Yield", "Как сравнивать USDT yield"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "USDT yield varies by chain, protocol, utilization, and incentive design. TJT helps you compare opportunities using structured tables, Trust Score indicators, and market context — without ranking products as financial advice.",
      "USDT yield зависит от сети, протокола, utilization и инсентивов. TJT помогает сравнивать opportunities через таблицы, Trust Score и рыночный контекст — без ранжирования продуктов как финансовых советов.",
    ),
    sections: [
      {
        key: "how_comparison_works",
        title: L("How USDT yield comparison works", "Как работает сравнение USDT yield"),
        body: L(
          "TJT aggregates catalogued earn routes and protocol knowledge into Compare pages and the USDT earn hub. Each row typically shows protocol, chain, indicative APY, TVL context, and Trust Score v0.1 factors.\n\nComparison is informational: you evaluate differences side by side, then verify live rates and contract addresses independently.\n\nThe best USDT yield Compare page is the primary entry point; this guide explains how to read it critically.",
          "TJT агрегирует earn-маршруты каталога и knowledge graph в Compare и earn-хаб USDT. Каждая строка показывает протокол, сеть, ориентировочный APY, TVL и факторы Trust Score v0.1.\n\nСравнение информационное: вы оцениваете различия, затем проверяете live-ставки и адреса контрактов самостоятельно.\n\nCompare best USDT yield — основная точка входа; этот гид объясняет критическое чтение.",
        ),
      },
      {
        key: "what_apy_means",
        title: L("What APY means", "Что означает APY"),
        body: L(
          "APY (Annual Percentage Yield) expresses a one-year return assumption often with compounding. DeFi lending APY moves with utilization; incentive APY may include token emissions that decline.\n\nTJT displays indicative APY from CPA catalog and registry data — not live on-chain snapshots refreshed every block.\n\nAlways cross-check the protocol app before acting on any figure. APY alone is insufficient for risk-adjusted comparison.",
          "APY (Annual Percentage Yield) — годовая доходность с учётом компаундинга. Lending APY движется с utilization; incentive APY может включать эмиссию токенов.\n\nTJT показывает ориентировочный APY из каталога — не live on-chain каждый блок.\n\nСверяйте приложение протокола перед действиями. APY недостаточен для сравнения с учётом риска.",
        ),
      },
      {
        key: "why_tvl_matters",
        title: L("Why TVL matters", "Почему важен TVL"),
        body: L(
          "Total Value Locked approximates how much capital sits in a protocol or pool. Deeper TVL often correlates with more liquid exits and battle-tested operations — but not always safety.\n\nThin TVL pools can show attractive APY while exposing suppliers to withdrawal delays or slippage on exit.\n\nTJT includes TVL labels where available as market context, sourced from registry placeholders or catalog metadata.",
          "TVL приближённо показывает капитал в протоколе или пуле. Глубокий TVL часто коррелирует с более ликвидным выходом — но не всегда с безопасностью.\n\nТонкие пулы могут показывать привлекательный APY при риске задержек вывода или slippage.\n\nTJT включает TVL как рыночный контекст из registry или метаданных каталога.",
        ),
      },
      {
        key: "why_trust_score_matters",
        title: L("Why Trust Score matters", "Почему важен Trust Score"),
        body: L(
          "TJT Trust Score v0.1 combines informational factors — audit status, TVL depth, contract age, governance, exploit history, liquidity exit speed — into a structured indicator.\n\nIt helps compare opportunities beyond APY but does not certify safety or predict returns.\n\nUse Trust Score alongside protocol reviews, safety pages, and on-chain verification for a fuller risk overview.",
          "TJT Trust Score v0.1 объединяет аудиты, TVL, возраст контрактов, governance, историю эксплойтов и скорость выхода в структурированный индикатор.\n\nОн помогает сравнивать opportunities сверх APY, но не сертифицирует безопасность и не прогнозирует доходность.\n\nИспользуйте Trust Score вместе с обзорами, safety-страницами и on-chain проверкой для полного risk overview.",
        ),
      },
      {
        key: "how_to_compare_protocols",
        title: L("How to compare protocols", "Как сравнивать протоколы"),
        body: L(
          "Step 1 — Filter by chain: Arbitrum, Ethereum, Polygon, and other deployments carry different gas costs and bridge risks.\n\nStep 2 — Identify yield source: organic borrow demand vs token incentives.\n\nStep 3 — Read risk tier and Trust Score explanation on protocol review pages.\n\nStep 4 — Open linked offers for catalogued CPA routes when you want outbound protocol context.\n\nStep 5 — Use Compare opportunities CTA to revisit tables after your shortlist.",
          "Шаг 1 — Фильтр по сети: Arbitrum, Ethereum, Polygon и др. несут разные gas и bridge-риски.\n\nШаг 2 — Источник yield: органический заём vs токен-инсентивы.\n\nШаг 3 — Risk tier и объяснение Trust Score в обзорах протоколов.\n\nШаг 4 — Связанные офферы для контекста CPA-маршрутов.\n\nШаг 5 — CTA Compare opportunities для повторного просмотра таблиц после шортлиста.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDT yield — primary comparison table for stablecoin suppliers.\n\nAave vs Lido — contextualizes lending vs liquid staking when USDT yield is part of a broader portfolio.\n\nUSDT earn hub — asset-scoped opportunities and internal links to market tether page.",
          "Best USDT yield — основная таблица для поставщиков стейблкоинов.\n\nAave vs Lido — контекст lending vs liquid staking в более широком портфеле.\n\nEarn-хаб USDT — возможности по активу и ссылки на market tether.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is highest APY always best?", "Всегда ли лучший — максимальный APY?"),
        answer: L(
          "No. Higher APY may reflect higher utilization risk, thinner TVL, or temporary incentives. Compare multiple factors on TJT.",
          "Нет. Более высокий APY может отражать риск utilization, тонкий TVL или временные инсентивы. Сравнивайте несколько факторов на TJT.",
        ),
      },
      {
        question: L("Does TJT execute USDT deposits?", "Выполняет ли TJT депозиты USDT?"),
        answer: L(
          "No. TJT is a non-custodial information broker. Outbound links may route to CPA offers; you sign transactions in your own wallet.",
          "Нет. TJT — некастодиальный информационный брокер. Исходящие ссылки могут вести на CPA-офферы; транзакции подписываете в своём кошельке.",
        ),
      },
      {
        question: L("How often should I re-compare?", "Как часто пересравнивать?"),
        answer: L(
          "Utilization and incentives change frequently. Revisit Compare pages when market volatility rises or before resizing positions.",
          "Utilization и инсентивы меняются часто. Возвращайтесь к Compare при росте волатильности или перед изменением размера позиций.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => compareHref(lang, "best-usdt-yield"),
        label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "best-usdc-yield"),
        label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"),
        type: "compare",
      },
      {
        href: (lang) => earnHref(lang, "usdt"),
        label: L("USDT earn hub", "Earn-хаб USDT"),
        type: "earn",
      },
      {
        href: (lang) => marketHref(lang, "tether"),
        label: L("Tether market context", "Рыночный контекст Tether"),
        type: "market",
      },
      {
        href: (lang) => `/${lang}/learn/what-is-defi-yield`,
        label: L("What is DeFi yield?", "Что такое DeFi yield?"),
        type: "learn",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdt-yield"),
    keywords: [
      "usdt yield",
      "compare usdt yield",
      "stablecoin yield",
      "usdt apy comparison",
    ],
  },
];
