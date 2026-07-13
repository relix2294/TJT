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
      "Educational DeFi protocol reviews for Aave, Lido, Jito, Morpho, Rocket Pool, Compound, Spark, Pendle, EtherFi, Ethena, and more. How each protocol works, use cases, benefits, risks, and links to compare opportunities on TJT — not financial advice.",
      "Образовательные обзоры DeFi-протоколов Aave, Lido, Jito, Morpho, Rocket Pool, Compound, Spark, Pendle, EtherFi, Ethena и др.: как работают, сценарии, преимущества, риски и ссылки на сравнение возможностей на TJT — не финансовый совет.",
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
          "The reviews hub covers Aave, Compound, Morpho, and Spark (lending), Lido and Rocket Pool (ETH liquid staking), Jito (SOL liquid staking), Pendle (yield trading), EtherFi (liquid restaking), and Ethena (synthetic dollar).",
          "Хаб охватывает Aave, Compound, Morpho и Spark (lending), Lido и Rocket Pool (ETH liquid staking), Jito (SOL liquid staking), Pendle (yield trading), EtherFi (liquid restaking) и Ethena (synthetic dollar).",
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
      "Is DeFi Safe? Aave, Lido, Morpho Security Checks | TJT",
      "Безопасен ли DeFi? Проверки Aave, Lido, Morpho | TJT",
    ),
    metaDescription: L(
      "Scared of losing money in DeFi? Check audit history, past hacks, and withdrawal risks for Aave, Lido, Morpho, Compound, and more — before you move USDT or ETH off your exchange.",
      "Боитесь потерять деньги в DeFi? Проверьте аудиты, взломы и риски вывода для Aave, Lido, Morpho, Compound и других — до перевода USDT или ETH с биржи.",
    ),
    eyebrow: L("Before you deposit", "Перед депозитом"),
    title: L("Can You Trust This Protocol?", "Можно ли доверять протоколу?"),
    subtitle: L(
      "Every DeFi protocol carries risk — even the big ones. These guides show you what was audited, what was hacked, and what could still go wrong with your USDT or ETH.",
      "Любой DeFi-протокол несёт риск — даже крупные. Эти гиды показывают, что аудировали, что взламывали и что ещё может пойти не так с вашим USDT или ETH.",
    ),
    gridTitle: L("Protocol safety checks", "Проверки безопасности протоколов"),
    exploreLabel: L("Read safety check", "Читать проверку"),
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
      "DeFi for Beginners — How Yield, Staking & Risk Work | TJT",
      "DeFi для начинающих — доходность, стейкинг и риски | TJT",
    ),
    metaDescription: L(
      "New to DeFi? Plain-language guides on how yield works, what liquid staking means, why protocols get hacked, and what TVL actually tells you. Read first, then compare real rates on TJT.",
      "Новичок в DeFi? Понятные гиды: как работает доходность, что такое liquid staking, почему взламывают протоколы и что значит TVL. Сначала читайте, потом сравнивайте ставки на TJT.",
    ),
    eyebrow: L("New to DeFi?", "Новичок в DeFi?"),
    title: L("Learn Before You Deposit", "Узнайте, прежде чем вносить"),
    subtitle: L(
      "Holding USDT or ETH on an exchange and curious about DeFi yield? Start here. Short guides explain how money actually moves on-chain — and what can go wrong.",
      "USDT или ETH на бирже и интересует DeFi-доходность? Начните здесь. Короткие гиды объясняют, как деньги движутся on-chain — и что может пойти не так.",
    ),
    gridTitle: L("Start with these guides", "Начните с этих гидов"),
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
