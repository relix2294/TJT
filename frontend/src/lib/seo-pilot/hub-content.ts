import { L, type LocalizedString, type SeoPilotFaqItem, type SeoPilotHubSegment } from "@/lib/seo-pilot/types";

export type SeoPilotHubCopy = {
  metaTitle: LocalizedString;
  metaDescription: LocalizedString;
  eyebrow: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  gridTitle: LocalizedString;
  exploreLabel: LocalizedString;
  faqTitle: LocalizedString;
  faq: SeoPilotFaqItem[];
};

export const SEO_PILOT_HUB_COPY: Record<
  Exclude<SeoPilotHubSegment, "earn">,
  SeoPilotHubCopy
> = {
  reviews: {
    metaTitle: L(
      "DeFi Protocol Reviews — Educational Overviews | TJT",
      "Обзоры DeFi-протоколов — образовательные материалы | TJT",
    ),
    metaDescription: L(
      "Educational DeFi protocol reviews for Aave, Lido, Jito, Morpho, Rocket Pool, Compound, and more. How each protocol works, use cases, benefits, risks, and links to compare opportunities on TJT — not financial advice.",
      "Образовательные обзоры DeFi-протоколов Aave, Lido, Jito, Morpho, Rocket Pool, Compound и др.: как работают, сценарии, преимущества, риски и ссылки на сравнение возможностей на TJT — не финансовый совет.",
    ),
    eyebrow: L("Protocol reviews", "Обзоры протоколов"),
    title: L("DeFi Protocol Reviews", "Обзоры DeFi-протоколов"),
    subtitle: L(
      "Educational protocol overviews covering lending, liquid staking, and MEV-boosted staking. Each review links to Compare tables, safety pages, and earn routes for structured market context.",
      "Образовательные обзоры протоколов: lending, liquid staking и MEV-стейкинг. Каждый обзор связан с Compare, safety-страницами и earn-маршрутами для структурированного рыночного контекста.",
    ),
    gridTitle: L("Protocol review pages", "Страницы обзоров протоколов"),
    exploreLabel: L("Read review", "Читать обзор"),
    faqTitle: L("Reviews FAQ", "FAQ по обзорам"),
    faq: [
      {
        question: L("Are TJT protocol reviews financial advice?", "Являются ли обзоры TJT финансовыми советами?"),
        answer: L(
          "No. Reviews are educational information and market context. Always verify live rates, contract addresses, and risks independently before acting.",
          "Нет. Обзоры — образовательная информация и рыночный контекст. Всегда проверяйте live-ставки, адреса контрактов и риски самостоятельно.",
        ),
      },
      {
        question: L("Which protocols are reviewed?", "Какие протоколы охвачены?"),
        answer: L(
          "The reviews hub covers Aave, Compound, and Morpho (lending), Lido and Rocket Pool (ETH liquid staking), and Jito (SOL liquid staking). Protocol hub pages exist for Spark, EtherFi, Pendle, and Ethena — with more SEO reviews planned.",
          "Хаб охватывает Aave, Compound и Morpho (lending), Lido и Rocket Pool (ETH liquid staking) и Jito (SOL liquid staking). Хабы протоколов есть для Spark, EtherFi, Pendle и Ethena — больше SEO-обзоров запланировано.",
        ),
      },
      {
        question: L("How do reviews connect to Compare pages?", "Как обзоры связаны со страницами Compare?"),
        answer: L(
          "Each review links to relevant Compare tables — for example Aave vs Lido or best yield comparisons — so you can move from narrative context to side-by-side data.",
          "Каждый обзор ссылается на релевантные таблицы Compare — например Aave vs Lido или сравнения yield — чтобы перейти от контекста к данным.",
        ),
      },
    ],
  },
  safety: {
    metaTitle: L(
      "DeFi Protocol Safety — Risk & Security Guides | TJT",
      "Безопасность DeFi-протоколов — гиды по рискам | TJT",
    ),
    metaDescription: L(
      "Educational safety guides for Aave, Lido, Jito, Morpho, Rocket Pool, and Compound. Smart contract risk, governance, audit history, exploit context, and TJT Trust Score factors — informational only.",
      "Образовательные гиды по безопасности Aave, Lido, Jito, Morpho, Rocket Pool и Compound: риски смарт-контрактов, governance, аудиты, контекст эксплойтов и факторы TJT Trust Score — только информация.",
    ),
    eyebrow: L("Safety analysis", "Анализ безопасности"),
    title: L("DeFi Protocol Safety", "Безопасность DeFi-протоколов"),
    subtitle: L(
      "Structured safety context for major yield protocols. Understand smart contract risk, governance models, audit coverage, and historical incidents before comparing opportunities.",
      "Структурированный контекст безопасности для ключевых yield-протоколов. Поймите риски смарт-контрактов, governance, аудиты и исторические инциденты перед сравнением возможностей.",
    ),
    gridTitle: L("Safety guides", "Гиды по безопасности"),
    exploreLabel: L("Read safety guide", "Читать гид"),
    faqTitle: L("Safety FAQ", "FAQ по безопасности"),
    faq: [
      {
        question: L("Does TJT certify protocol safety?", "Сертифицирует ли TJT безопасность протоколов?"),
        answer: L(
          "No. Safety pages provide educational risk context and TJT Trust Score indicators. They do not guarantee safety or predict future incidents.",
          "Нет. Safety-страницы дают образовательный контекст рисков и индикаторы TJT Trust Score. Они не гарантируют безопасность и не прогнозируют инциденты.",
        ),
      },
      {
        question: L("How should I use safety pages with reviews?", "Как использовать safety-страницы вместе с обзорами?"),
        answer: L(
          "Start with a protocol review for how the system works, then read the matching safety page for risk factors. Cross-check with Compare tables and on-chain verification.",
          "Начните с обзора протокола, затем прочитайте соответствующую safety-страницу. Сверьте с таблицами Compare и on-chain проверкой.",
        ),
      },
      {
        question: L("What is TJT Trust Score v0.1?", "Что такое TJT Trust Score v0.1?"),
        answer: L(
          "Trust Score v0.1 combines audit status, TVL depth, contract age, governance, exploit history, and liquidity exit speed into a structured indicator — not a safety certification.",
          "Trust Score v0.1 объединяет аудиты, TVL, возраст контрактов, governance, историю эксплойтов и скорость выхода — это не сертификат безопасности.",
        ),
      },
    ],
  },
  learn: {
    metaTitle: L(
      "DeFi Learning Hub — Yield, Staking & Risk Education | TJT",
      "Обучение DeFi — доходность, стейкинг и риски | TJT",
    ),
    metaDescription: L(
      "Educational DeFi guides on yield mechanics, liquid staking, and crypto yield risks. Build foundational knowledge before comparing protocols on TJT.",
      "Образовательные гиды по механике yield, liquid staking и рискам crypto yield. Базовые знания перед сравнением протоколов на TJT.",
    ),
    eyebrow: L("DeFi education", "Обучение DeFi"),
    title: L("DeFi Learning Hub", "Обучение DeFi"),
    subtitle: L(
      "Foundational guides on how DeFi yield works, liquid staking mechanics, and the risks that APY alone does not capture. Educational information wired to Compare and earn routes.",
      "Базовые гиды: как работает DeFi yield, механика liquid staking и риски, которые APY не отражает. Образовательная информация со связями с Compare и earn.",
    ),
    gridTitle: L("Learning guides", "Обучающие гиды"),
    exploreLabel: L("Read guide", "Читать гид"),
    faqTitle: L("Learning FAQ", "FAQ по обучению"),
    faq: [
      {
        question: L("Who are these guides for?", "Для кого эти гиды?"),
        answer: L(
          "Anyone comparing DeFi yield opportunities who wants structured context before reading protocol reviews, safety pages, or Compare tables.",
          "Для тех, кто сравнивает DeFi yield и хочет структурированный контекст перед обзорами, safety-страницами или Compare.",
        ),
      },
      {
        question: L("Do learn pages replace protocol reviews?", "Заменяют ли learn-страницы обзоры протоколов?"),
        answer: L(
          "No. Learn pages explain concepts. Protocol reviews and safety guides cover specific systems like Aave, Lido, and Jito in depth.",
          "Нет. Learn-страницы объясняют концепции. Обзоры и safety-гайды углубляются в конкретные системы — Aave, Lido, Jito.",
        ),
      },
      {
        question: L("What should I read after the learning hub?", "Что читать после learning-хаба?"),
        answer: L(
          "Move to earn guides for asset-specific yield comparison, then open Compare tables for side-by-side APY and Trust Score context.",
          "Перейдите к earn-гидам для сравнения yield по активам, затем откройте Compare для APY и Trust Score.",
        ),
      },
    ],
  },
};
