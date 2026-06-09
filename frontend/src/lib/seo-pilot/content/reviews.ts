import type { Locale } from "@/lib/i18n";
import { L, type SeoPilotPage } from "@/lib/seo-pilot/types";
import { WAVE1_REVIEW_PAGES } from "@/lib/seo-pilot/content/wave1-reviews";

function compareHref(lang: Locale, slug: string) {
  return `/${lang}/compare/${slug}`;
}

function protocolHref(lang: Locale, slug: string) {
  return `/${lang}/protocols/${slug}`;
}

function earnHref(lang: Locale, asset: string) {
  return `/${lang}/earn/${asset}`;
}

function marketHref(lang: Locale, slug: string) {
  return `/${lang}/market/${slug}`;
}

function offerHref(lang: Locale, slug: string) {
  return `/${lang}/offers/${slug}`;
}

function learnHref(lang: Locale, slug: string) {
  return `/${lang}/learn/${slug}`;
}

function reviewsHubHref(lang: Locale) {
  return `/${lang}/reviews`;
}

function safetyHref(lang: Locale, slug: string) {
  return `/${lang}/safety/${slug}`;
}

export const REVIEW_PAGES: SeoPilotPage[] = [
  {
    slug: "aave-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Aave Protocol Review — Lending, Liquidity & Risk Overview | TJT",
      "Обзор протокола Aave — кредитование, ликвидность и риски | TJT",
    ),
    metaDescription: L(
      "Educational Aave protocol overview: how lending pools work, main use cases, benefits, risks, alternatives, and links to compare DeFi opportunities on TJT.",
      "Образовательный обзор протокола Aave: как работают пулы кредитования, сценарии использования, преимущества, риски, альтернативы и ссылки на сравнение DeFi-возможностей на TJT.",
    ),
    h1: L("Aave Protocol Review", "Обзор протокола Aave"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Aave is a decentralized lending protocol where users supply assets to liquidity pools and borrowers draw variable or stable-rate loans against collateral. This review provides educational information and market context — not financial advice.",
      "Aave — децентрализованный протокол кредитования, где пользователи вносят активы в пулы ликвидности, а заёмщики берут займы под залог. Этот обзор даёт образовательную информацию и рыночный контекст, а не финансовую консультацию.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Aave launched as one of the earliest open-source liquidity protocols on Ethereum and expanded across multiple EVM chains including Arbitrum, Polygon, Optimism, and Base. The protocol aggregates supplier liquidity into pooled markets per asset, enabling permissionless borrowing and flash loans without traditional intermediaries.\n\nFrom a TJT perspective, Aave sits in the lending category of the Earn Knowledge Graph. It connects stablecoin suppliers, ETH collateral users, and cross-chain liquidity seekers. TVL depth, utilization rates, and oracle dependencies are primary inputs for any risk overview.\n\nAave V3 introduced efficiency modes (e-mode), isolation mode for newer assets, and improved capital efficiency. These design choices affect how collateral factors, liquidation thresholds, and interest-rate curves behave under stress.",
          "Aave — один из первых open-source протоколов ликвидности на Ethereum, позже развернутый на Arbitrum, Polygon, Optimism и Base. Протокол объединяет ликвидность поставщиков в пулы по каждому активу, обеспечивая permissionless-заём и flash loans без традиционных посредников.\n\nВ контексте TJT Aave относится к категории lending в Earn Knowledge Graph. Он связывает поставщиков стейблкоинов, пользователей залога ETH и кросс-чейн ликвидность. Глубина TVL, utilization и зависимость от оракулов — ключевые входы для risk overview.\n\nAave V3 добавил e-mode, isolation mode для новых активов и улучшенную капитальную эффективность. Эти решения влияют на коэффициенты залога, пороги ликвидации и кривые процентных ставок в стрессовых условиях.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Suppliers deposit tokens into Aave markets and receive interest-bearing aTokens (or equivalent receipt tokens on some deployments). Interest accrues from borrower demand; rates adjust algorithmically based on pool utilization.\n\nBorrowers post collateral, select a variable or stable borrow rate where available, and maintain a health factor above liquidation thresholds. If collateral value falls or debt grows, partial liquidations can occur to restore solvency.\n\nGovernance token AAVE holders vote on risk parameters, asset listings, and treasury actions. Risk councils and service providers may propose parameter updates. Users should verify current parameters on the official app before any transaction.",
          "Поставщики вносят токены в рынки Aave и получают процентные aTokens. Проценты начисляются от спроса заёмщиков; ставки меняются алгоритмически в зависимости от utilization пула.\n\nЗаёмщики вносят залог, выбирают переменную или стабильную ставку (где доступна) и поддерживают health factor выше порога ликвидации. При падении залога или росте долга возможны частичные ликвидации.\n\nДержатели AAVE голосуют за параметры риска, листинг активов и действия казны. Risk councils могут предлагать обновления. Проверяйте актуальные параметры в официальном приложении перед транзакциями.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "Stablecoin supply: Users seeking variable APY on USDC, USDT, or DAI may supply to Aave pools when borrow demand is elevated. APY is not fixed and compresses when utilization falls.\n\nCollateralized borrowing: ETH or LST holders may borrow stablecoins for liquidity without exiting long positions, subject to liquidation risk and rate volatility.\n\nDeFi composability: aTokens integrate with other protocols as collateral or routing liquidity, creating layered exposure that amplifies both yield and risk.\n\nFlash loans: Developers and arbitrageurs use uncollateralized single-block loans for refinancing, liquidations, or collateral swaps — a feature unique to advanced lending protocols.",
          "Поставка стейблкоинов: пользователи ищут переменный APY на USDC, USDT или DAI в пулах Aave при высоком спросе на заём. APY не фиксирован и снижается при падении utilization.\n\nЗалоговое кредитование: держатели ETH или LST могут занимать стейблкоины для ликвидности без выхода из позиции — с риском ликвидации и волатильностью ставок.\n\nКомпозируемость DeFi: aTokens используются как залог или маршрутная ликвидность в других протоколах, создавая многослойную экспозицию.\n\nFlash loans: разработчики и арбитражёры используют беззалоговые займы в одном блоке для рефинансирования, ликвидаций или смены залога.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Deep liquidity on major assets across several chains reduces friction for large suppliers relative to smaller lending markets.\n\nBattle-tested smart contracts and multiple security audits over years of mainnet operation provide a longer operational track record than many newer protocols.\n\nTransparent on-chain metrics — utilization, supply APY, borrow APY, and reserve factors — allow independent verification without trusting a centralized statement.\n\nModular V3 risk controls (isolation, e-mode) let governance segment riskier assets from core markets, though misconfiguration or oracle failures remain possible.",
          "Глубокая ликвидность по основным активам на нескольких сетях снижает трение для крупных поставщиков по сравнению с мелкими рынками.\n\nПроверенные смарт-контракты и множественные аудиты за годы mainnet-работы дают более длинную операционную историю, чем у многих новых протоколов.\n\nПрозрачные on-chain метрики — utilization, supply APY, borrow APY — позволяют независимую проверку без доверия к централизованным заявлениям.\n\nМодульные контроли риска V3 (isolation, e-mode) позволяют governance отделять рискованные активы от core-рынков, хотя ошибки конфигурации или оракулов остаются возможными.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Smart contract risk: Despite audits, undiscovered vulnerabilities or governance exploits could affect pooled funds.\n\nLiquidity risk: High utilization can slow withdrawals; suppliers may wait for repayments or new deposits during stress.\n\nOracle risk: Price feeds drive liquidations; stale or manipulated oracle data can trigger wrongful liquidations or insolvency.\n\nRate risk: Variable supply APY can fall sharply when borrow demand declines; stable borrow rates may carry rebalancing costs.\n\nRegulatory and bridge risk: Cross-chain deployments depend on bridges and local compliance contexts that evolve independently.",
          "Риск смарт-контрактов: несмотря на аудиты, неизвестные уязвимости или эксплойты governance могут затронуть пулы.\n\nРиск ликвидности: высокий utilization замедляет вывод; поставщики могут ждать погашений или новых депозитов в стрессе.\n\nРиск оракулов: ценовые фиды управляют ликвидациями; устаревшие или манипулированные данные могут вызвать ошибочные ликвидации.\n\nРиск ставок: переменный supply APY резко падает при снижении спроса на заём.\n\nРегуляторный и мостовой риск: кросс-чейн развёртывания зависят от мостов и локального compliance.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Compound, Morpho, Spark, and other lending markets offer competing supply routes with different governance models, oracle stacks, and incentive programs.\n\nFor ETH-native yield without lending exposure, liquid staking protocols such as Lido or restaking stacks present a different risk profile focused on validator and slashing risk rather than borrow utilization.\n\nCentralized yield products exist outside DeFi with distinct custody and counterparty models — they are not equivalent substitutes and carry separate risk dimensions.\n\nTJT Compare pages help you evaluate protocol differences side by side using Trust Score indicators and market context rather than headline APY alone.",
          "Compound, Morpho, Spark и другие lending-рынки предлагают конкурирующие маршруты с разными моделями governance, оракулами и инсентивами.\n\nДля ETH-yield без lending-экспозиции liquid staking (Lido и др.) даёт другой профиль риска — валидаторный и slashing вместо utilization.\n\nЦентрализованные продукты вне DeFi имеют отдельные модели кастоди и контрагента.\n\nСтраницы TJT Compare помогают сравнивать протоколы по Trust Score и рыночному контексту, а не только по headline APY.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Use TJT Compare to place Aave next to Lido or Jito when evaluating whether lending, liquid staking, or Solana staking fits your research scope.\n\nThe best USDT yield comparison aggregates stablecoin routes across protocols and chains, including Aave deployments where catalogued.\n\nCompare opportunities on TJT surfaces APY, TVL context, chain coverage, and Trust Score v0.1 indicators — all framed as educational information.",
          "Используйте TJT Compare, чтобы сопоставить Aave с Lido или Jito при выборе между lending, liquid staking и стейкингом Solana.\n\nСравнение best USDT yield агрегирует маршруты стейблкоинов по протоколам и сетям, включая развёртывания Aave из каталога.\n\nCompare opportunities на TJT показывает APY, TVL, покрытие сетей и Trust Score v0.1 — как образовательную информацию.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is Aave audited?", "Проходил ли Aave аудит?"),
        answer: L(
          "Aave has undergone multiple third-party security audits across versions and chains. Audit history does not eliminate smart contract risk; users should review the latest audit reports and bug bounty scope on official Aave documentation.",
          "Aave прошёл множественные аудиты безопасности по версиям и сетям. Аудиты не устраняют риск смарт-контрактов; изучайте актуальные отчёты и bug bounty в официальной документации.",
        ),
      },
      {
        question: L("How is Aave APY determined?", "Как определяется APY Aave?"),
        answer: L(
          "Supply APY is a function of borrow demand and reserve factors set by governance. It changes block by block as utilization shifts. TJT displays indicative figures sourced from catalog data and on-chain context — always verify live rates in the app.",
          "Supply APY зависит от спроса на заём и reserve factors governance. Меняется по мере utilization. TJT показывает ориентировочные значения из каталога — проверяйте live-ставки в приложении.",
        ),
      },
      {
        question: L("Can I lose funds supplying to Aave?", "Можно ли потерять средства при supply в Aave?"),
        answer: L(
          "Yes. Smart contract exploits, insolvency events, or prolonged high utilization affecting withdrawals are among the risks. This page provides a risk overview, not a safety guarantee.",
          "Да. Эксплойты, неплатёжеспособность или длительный высокий utilization влияют на вывод. Эта страница — risk overview, а не гарантия безопасности.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => compareHref(lang, "morpho-vs-aave"),
        label: L("Morpho vs Aave comparison", "Сравнение Morpho vs Aave"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "compound-vs-aave"),
        label: L("Compound vs Aave comparison", "Сравнение Compound vs Aave"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "aave-vs-lido"),
        label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "aave-vs-jito"),
        label: L("Aave vs Jito comparison", "Сравнение Aave vs Jito"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "best-usdt-yield"),
        label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"),
        type: "compare",
      },
      {
        href: (lang) => protocolHref(lang, "aave"),
        label: L("Aave protocol hub", "Хаб протокола Aave"),
        type: "protocols",
      },
      {
        href: (lang) => earnHref(lang, "usdt"),
        label: L("USDT earn hub", "Earn-хаб USDT"),
        type: "earn",
      },
      {
        href: (lang) => offerHref(lang, "aave-v3-usdc-arbitrum"),
        label: L("Aave V3 USDC on Arbitrum offer", "Оффер Aave V3 USDC на Arbitrum"),
        type: "offers",
      },
      {
        href: (lang) => marketHref(lang, "ethereum"),
        label: L("Ethereum market context", "Рыночный контекст Ethereum"),
        type: "market",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdt-yield"),
    keywords: [
      "aave review",
      "aave protocol",
      "defi lending",
      "aave risks",
      "compare defi opportunities",
    ],
  },
  {
    slug: "lido-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Lido Protocol Review — Liquid Staking & Risk Overview | TJT",
      "Обзор протокола Lido — liquid staking и риски | TJT",
    ),
    metaDescription: L(
      "Educational Lido protocol overview covering stETH mechanics, use cases, benefits, risks, alternatives, and TJT Compare links for liquid staking research.",
      "Образовательный обзор Lido: механика stETH, сценарии, преимущества, риски, альтернативы и ссылки TJT Compare для исследования liquid staking.",
    ),
    h1: L("Lido Protocol Review", "Обзор протокола Lido"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Lido is a liquid staking protocol that tokenizes staked ETH (and other assets on supported networks) into receipt tokens such as stETH. This review offers educational information and market context for researchers comparing staking routes.",
      "Lido — протокол liquid staking, токенизирующий застейканный ETH (и другие активы) в receipt-токены вроде stETH. Обзор даёт образовательную информацию и рыночный контекст для сравнения маршрутов стейкинга.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Lido operates pooled validators that stake user deposits and issue liquid staking tokens (LSTs) representing a claim on staked principal plus accrued rewards. stETH on Ethereum is the dominant LST by TVL and DeFi integrations.\n\nThe protocol delegates stake to a curated operator set and charges a fee on staking rewards. Governance via the LDO token influences operator additions, fee changes, and treasury allocations.\n\nLido also supports liquid staking on other networks (e.g., Solana via stSOL historically, Polygon stMATIC). Each deployment carries chain-specific validator, custody, and smart contract considerations.",
          "Lido управляет пулом валидаторов, стейкает депозиты и выпускает LST как claim на principal плюс награды. stETH на Ethereum — доминирующий LST по TVL и интеграциям в DeFi.\n\nПротокол делегирует stake операторам и берёт комиссию с наград. Governance через LDO влияет на операторов, комиссии и казну.\n\nLido поддерживает liquid staking на других сетях. Каждое развёртывание несёт специфичные риски валидаторов, кастоди и смарт-контрактов.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Users deposit ETH into Lido and receive stETH at a 1:1 minting ratio that rebases daily as validator rewards accrue. The rebasing model increases wallet balances rather than token price.\n\nstETH can be transferred, used as DeFi collateral, or swapped on secondary markets. The peg to ETH may deviate during market stress, creating arbitrage and liquidity dynamics.\n\nWithdrawals after Ethereum’s Shanghai upgrade flow through an exit queue subject to validator unbonding times and protocol-level withdrawal buffers. Instant liquidity often depends on DEX or lending market depth rather than protocol guarantees.",
          "Пользователи вносят ETH в Lido и получают stETH 1:1; баланс rebase-ится ежедневно по мере наград валидаторов.\n\nstETH передаётся, используется как залог в DeFi или меняется на вторичных рынках. Пег к ETH может отклоняться в стрессе.\n\nВывод после Shanghai проходит через очередь с учётом unbonding валидаторов. Мгновенная ликвидность часто зависит от глубины DEX или lending, а не от гарантий протокола.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "ETH staking with liquidity: Holders earn validator rewards while retaining a transferable token for DeFi strategies.\n\nCollateral in lending markets: stETH is widely accepted as collateral on Aave and other protocols, layering staking yield with borrow utility — and liquidation risk.\n\nYield stacking: Users may loop stETH through lending or liquidity pools, amplifying exposure to peg, rate, and smart contract risks.\n\nInstitutional routing: Custody partners and ETF-related flows may interact with Lido infrastructure, affecting stake concentration and governance debates.",
          "Стейкинг ETH с ликвидностью: держатели получают награды валидаторов, сохраняя передаваемый токен для DeFi.\n\nЗалог в lending: stETH принимается на Aave и др., добавляя utility заёма к staking yield — и риск ликвидации.\n\nСтекинг yield: loop stETH через lending или пулы усиливает экспозицию к пегу, ставкам и смарт-контрактам.\n\nИнституциональные потоки: кастоди и ETF-связанные потоки влияют на концентрацию stake и governance-дискуссии.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Low minimum deposit compared to solo staking’s 32 ETH requirement democratizes validator yield access.\n\nDeep liquidity and integrations make stETH one of the most composable LSTs in DeFi.\n\nNon-custodial smart contract architecture — users retain token claims rather than IOUs from a centralized broker.\n\nLong operational history since 2020 provides extensive mainnet data for risk researchers.",
          "Низкий минимальный депозит против 32 ETH solo staking расширяет доступ к yield валидаторов.\n\nГлубокая ликвидность и интеграции делают stETH одним из самых композируемых LST.\n\nНекастодиальная архитектура — пользователи держат токен-claim, а не IOU брокера.\n\nДлинная история с 2020 даёт обширные mainnet-данные для исследователей рисков.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Validator slashing: Operator misbehavior or downtime can reduce pooled rewards or principal; socialized losses may apply.\n\nCentralization concerns: Large Lido stake share raises Ethereum consensus decentralization debates.\n\nstETH peg risk: Secondary market discounts can emerge during liquidity crunches.\n\nSmart contract risk: Core contracts and withdrawal infrastructure remain exploit targets despite audits.\n\nGovernance risk: LDO voting power concentration may influence fee and operator decisions.",
          "Slashing валидаторов: ошибки операторов снижают награды или principal; возможны социализированные потери.\n\nЦентрализация: большая доля stake Lido вызывает дискуссии о децентрализации консенсуса Ethereum.\n\nРиск пега stETH: дисконты на вторичном рынке в кризис ликвидности.\n\nРиск смарт-контрактов: core и withdrawal остаются целями эксплойтов.\n\nРиск governance: концентрация LDO влияет на комиссии и операторов.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Rocket Pool (rETH), Coinbase cbETH, Frax sfrxETH, and native restaking wrappers offer different decentralization trade-offs and fee structures.\n\nSolo staking and centralized staking services provide non-DeFi paths with distinct custody models.\n\nOn Solana, Jito and native stake accounts compete for MEV-aware staking yield with separate slashing frameworks.\n\nTJT Compare pages including best ETH staking and Aave vs Lido help contextualize alternatives with Trust Score indicators.",
          "Rocket Pool, cbETH, sfrxETH и restaking-обёртки дают другие компромиссы децентрализации и комиссий.\n\nSolo staking и централизованные сервисы — отдельные модели кастоди.\n\nНа Solana Jito и native stake конкурируют за MEV-aware yield.\n\nTJT Compare, включая best ETH staking и Aave vs Lido, контекстуализирует альтернативы через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Compare Lido against Aave when deciding between lending stablecoins and staking ETH for yield exposure.\n\nThe best ETH staking page aggregates liquid and native routes with market context.\n\nLido vs Jito highlights cross-ecosystem staking differences between Ethereum and Solana.",
          "Сравните Lido с Aave при выборе между lending стейблкоинов и staking ETH.\n\nBest ETH staking агрегирует liquid и native маршруты с рыночным контекстом.\n\nLido vs Jito показывает различия стейкинга Ethereum и Solana.",
        ),
      },
    ],
    faq: [
      {
        question: L("What is stETH?", "Что такое stETH?"),
        answer: L(
          "stETH is Lido’s rebasing liquid staking token on Ethereum. Its balance grows as staking rewards accrue. It is not a fixed-APY product; rewards vary with validator performance and fees.",
          "stETH — rebasing LST Lido на Ethereum. Баланс растёт с наградами стейкинга. Это не продукт с фиксированным APY.",
        ),
      },
      {
        question: L("Can stETH be redeemed instantly?", "Можно ли мгновенно вывести stETH?"),
        answer: L(
          "Protocol withdrawals follow an exit queue. Many users obtain liquidity by swapping stETH on DEXs or using lending markets — each path carries separate liquidity and peg risks.",
          "Вывод через протокол идёт по очереди. Ликвидность часто получают через DEX или lending — с отдельными рисками пега и ликвидности.",
        ),
      },
      {
        question: L("How does Lido relate to TJT Trust Score?", "Как Lido связан с TJT Trust Score?"),
        answer: L(
          "TJT Trust Score v0.1 provides informational indicators derived from audit status, TVL depth, and other factors. It does not certify safety or predict returns.",
          "TJT Trust Score v0.1 — информационные индикаторы из аудитов, TVL и др. Он не сертифицирует безопасность и не прогнозирует доходность.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => compareHref(lang, "lido-vs-rocket-pool"),
        label: L("Lido vs Rocket Pool comparison", "Сравнение Lido vs Rocket Pool"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "lido-vs-jito"),
        label: L("Lido vs Jito comparison", "Сравнение Lido vs Jito"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "aave-vs-lido"),
        label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "best-eth-staking"),
        label: L("Best ETH staking comparison", "Сравнение лучшего ETH staking"),
        type: "compare",
      },
      {
        href: (lang) => protocolHref(lang, "lido"),
        label: L("Lido protocol hub", "Хаб протокола Lido"),
        type: "protocols",
      },
      {
        href: (lang) => earnHref(lang, "eth"),
        label: L("ETH earn hub", "Earn-хаб ETH"),
        type: "earn",
      },
      {
        href: (lang) => offerHref(lang, "lido-steth-ethereum"),
        label: L("Lido stETH Ethereum offer", "Оффер Lido stETH Ethereum"),
        type: "offers",
      },
      {
        href: (lang) => marketHref(lang, "ethereum"),
        label: L("Ethereum market context", "Рыночный контекст Ethereum"),
        type: "market",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-staking"),
    keywords: [
      "lido review",
      "steth",
      "liquid staking",
      "lido risks",
      "eth staking comparison",
    ],
  },
  {
    slug: "jito-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Jito Protocol Review — Solana Liquid Staking & MEV | TJT",
      "Обзор протокола Jito — liquid staking Solana и MEV | TJT",
    ),
    metaDescription: L(
      "Educational Jito protocol overview: jitoSOL mechanics, MEV-boosted staking, use cases, risks, alternatives, and Compare links for Solana yield research.",
      "Образовательный обзор Jito: механика jitoSOL, MEV-boosted staking, сценарии, риски, альтернативы и Compare для исследования yield на Solana.",
    ),
    h1: L("Jito Protocol Review", "Обзор протокола Jito"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Jito is a Solana liquid staking protocol that issues jitoSOL, combining validator staking rewards with MEV (Maximal Extractable Value) tips routed through Jito’s block engine. This page provides protocol overview and risk context for Solana earn research.",
      "Jito — протокол liquid staking на Solana, выпускающий jitoSOL и объединяющий награды валидаторов с MEV-чаевыми через block engine Jito. Страница даёт обзор протокола и контекст рисков для earn-исследований на Solana.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Jito launched as infrastructure for Solana validators to capture MEV responsibly and share proceeds with stakers. The liquid staking token jitoSOL represents a claim on staked SOL plus accumulated staking and MEV yield.\n\nUnlike rebasing Ethereum LSTs, jitoSOL uses an exchange-rate model: the SOL-per-jitoSOL ratio increases over time as rewards compound.\n\nJito’s ecosystem includes the block engine, stake pools, and governance via the JTO token. Solana’s high throughput and low fees attract active DeFi users, but network outages and validator performance remain systemic considerations.",
          "Jito начался как инфраструктура для захвата MEV на Solana с распределением дохода стейкерам. jitoSOL — claim на SOL плюс staking и MEV yield.\n\nВ отличие от rebasing LST Ethereum, jitoSOL использует exchange-rate модель: соотношение SOL/jitoSOL растёт со временем.\n\nЭкосистема включает block engine, stake pools и governance JTO. Высокая пропускная способность Solana привлекает DeFi, но outages и производительность валидаторов — системные факторы.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Users deposit SOL into Jito stake pools and receive jitoSOL. Validators connected to Jito’s infrastructure prioritize bundles and MEV opportunities, distributing a portion of tips to the pool.\n\njitoSOL remains transferable and composable across Solana DeFi — lending, liquidity pools, and structured products may accept it as collateral.\n\nUnstaking follows Solana’s native cooldown epochs. Instant exit often requires swapping jitoSOL on Jupiter or other aggregators, subject to liquidity and slippage.",
          "Пользователи вносят SOL в stake pools Jito и получают jitoSOL. Валидаторы с инфраструктурой Jito приоритизируют bundles и MEV, распределяя чаевые в пул.\n\njitoSOL передаётся и композируется в Solana DeFi — lending, пулы, структурные продукты.\n\nUnstaking следует cooldown эпохам Solana. Мгновенный выход часто через swap на Jupiter — с риском ликвидности и slippage.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "SOL staking with MEV uplift: Users seek higher effective yield versus vanilla staking when MEV tips are robust.\n\nDeFi collateral: jitoSOL in lending protocols enables borrow utility while maintaining staking exposure.\n\nPortfolio diversification: Solana-native yield complements Ethereum LST and stablecoin lending positions in multi-chain research.\n\nValidator decentralization support: Delegating through liquid pools can lower operational barriers versus running a validator node.",
          "Staking SOL с MEV uplift: пользователи ищут более высокий effective yield при активных MEV-чаевых.\n\nЗалог DeFi: jitoSOL в lending даёт utility заёма при сохранении staking-экспозиции.\n\nДиверсификация: Solana-yield дополняет Ethereum LST и stablecoin lending.\n\nПоддержка децентрализации: делегирование через пулы снижает барьер против собственной ноды.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "MEV-aware staking can improve reward composition beyond base inflationary staking yields alone.\n\nLiquid token format avoids long unbonding lock for users who exit via secondary markets.\n\nIntegration with Solana’s DeFi stack (Jupiter, Kamino, marginfi, etc.) supports composable strategies.\n\nAudited smart contracts and visible on-chain stake accounts aid independent verification.",
          "MEV-aware staking улучшает состав наград сверх базового inflationary yield.\n\nЛиквидный токен снижает lock unbonding при выходе через вторичный рынок.\n\nИнтеграции с DeFi Solana поддерживают композируемые стратегии.\n\nАудированные контракты и on-chain stake accounts помогают независимой проверке.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Solana network risk: Historical outages and congestion can halt transactions or affect DeFi positions.\n\nMEV variability: Tip income fluctuates with market activity; past MEV boosts do not project future yields.\n\nSmart contract and program risk: Solana program upgrades and dependencies require ongoing monitoring.\n\njitoSOL liquidity risk: DEX depth may thin during volatility, widening swap spreads.\n\nGovernance and centralization: Stake concentration among top validators and Jito infrastructure providers is a research topic.",
          "Риск сети Solana: outages и congestion останавливают транзакции или влияют на DeFi.\n\nВолатильность MEV: чаевые зависят от активности рынка; прошлые бусты не проецируют будущее.\n\nРиск программ Solana: апгрейды требуют мониторинга.\n\nЛиквидность jitoSOL: глубина DEX истончается в волатильности.\n\nGovernance и централизация: концентрация stake — предмет исследований.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Marinade (mSOL), BlazeStake (bSOL), and native Solana staking offer competing liquid or illiquid routes.\n\nEthereum liquid staking via Lido, Rocket Pool, or restaking protocols targets a different chain risk set.\n\nCentralized exchange staking products trade custody for simplicity.\n\nUse TJT best SOL staking and Lido vs Jito Compare pages for structured side-by-side market context.",
          "Marinade, BlazeStake и native staking — конкурирующие маршруты.\n\nEthereum liquid staking через Lido и др. — другой набор рисков сети.\n\nСтейкинг на CEX — кастоди за простоту.\n\nИспользуйте TJT best SOL staking и Lido vs Jito для структурированного сравнения.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Aave vs Jito contrasts EVM lending with Solana liquid staking — useful when mapping cross-chain portfolios.\n\nBest SOL staking ranks Solana routes including Jito with Trust Score context.\n\nCompare opportunities on TJT emphasize educational tables, not ranked financial advice.",
          "Aave vs Jito сопоставляет EVM lending и Solana liquid staking.\n\nBest SOL staking ранжирует маршруты Solana с Trust Score.\n\nCompare opportunities на TJT — образовательные таблицы, а не финансовые советы.",
        ),
      },
    ],
    faq: [
      {
        question: L("What is jitoSOL?", "Что такое jitoSOL?"),
        answer: L(
          "jitoSOL is Jito’s liquid staking receipt token on Solana. Its SOL exchange rate increases as staking and MEV rewards accrue.",
          "jitoSOL — receipt-токен liquid staking Jito на Solana. Курс SOL/jitoSOL растёт с наградами staking и MEV.",
        ),
      },
      {
        question: L("Does Jito guarantee higher APY?", "Гарантирует ли Jito более высокий APY?"),
        answer: L(
          "No. MEV tips and staking rewards vary. TJT displays indicative APY from catalog data for comparison research only.",
          "Нет. MEV и staking rewards меняются. TJT показывает ориентировочный APY из каталога только для сравнительных исследований.",
        ),
      },
      {
        question: L("Is Jito only on Solana?", "Jito только на Solana?"),
        answer: L(
          "The core Jito liquid staking product discussed here operates on Solana. Always verify supported networks on official Jito documentation before depositing.",
          "Основной продукт liquid staking Jito здесь — на Solana. Проверяйте поддерживаемые сети в официальной документации.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => compareHref(lang, "lido-vs-jito"),
        label: L("Lido vs Jito comparison", "Сравнение Lido vs Jito"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "aave-vs-jito"),
        label: L("Aave vs Jito comparison", "Сравнение Aave vs Jito"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "best-sol-staking"),
        label: L("Best SOL staking comparison", "Сравнение лучшего SOL staking"),
        type: "compare",
      },
      {
        href: (lang) => protocolHref(lang, "jito"),
        label: L("Jito protocol hub", "Хаб протокола Jito"),
        type: "protocols",
      },
      {
        href: (lang) => earnHref(lang, "sol"),
        label: L("SOL earn hub", "Earn-хаб SOL"),
        type: "earn",
      },
      {
        href: (lang) => offerHref(lang, "jito-liquid-staking-solana"),
        label: L("Jito liquid staking offer", "Оффер Jito liquid staking"),
        type: "offers",
      },
      {
        href: (lang) => marketHref(lang, "solana"),
        label: L("Solana market context", "Рыночный контекст Solana"),
        type: "market",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-sol-staking"),
    keywords: [
      "jito review",
      "jitosol",
      "solana staking",
      "mev staking",
      "sol yield comparison",
    ],
  },
  {
    slug: "morpho-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Morpho Protocol Review — Lending Optimizer & Risk Overview | TJT",
      "Обзор протокола Morpho — оптимизатор кредитования и риски | TJT",
    ),
    metaDescription: L(
      "Educational Morpho protocol overview: P2P lending optimization, Morpho Blue markets, use cases, benefits, risks, and TJT Compare links for stablecoin yield research.",
      "Образовательный обзор Morpho: P2P-оптимизация кредитования, рынки Morpho Blue, сценарии, преимущества, риски и ссылки TJT Compare для исследования stablecoin yield.",
    ),
    h1: L("Morpho Protocol Review", "Обзор протокола Morpho"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Morpho is a decentralized lending optimizer that improves capital efficiency by matching suppliers and borrowers peer-to-peer on top of base liquidity markets. This review provides educational information and market context — not financial advice.",
      "Morpho — децентрализованный оптимизатор кредитования, повышающий капитальную эффективность через P2P-сопоставление поставщиков и заёмщиков поверх базовых рынков ликвидности. Обзор даёт образовательную информацию и рыночный контекст, а не финансовый совет.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Morpho started as an optimizer layer on Aave and Compound, routing matched liquidity to improve supplier APY and borrower rates. Morpho Blue extends this with permissionless, isolated lending markets curated by risk managers.\n\nFrom a TJT perspective, Morpho sits in the lending category. It connects stablecoin suppliers and ETH collateral users across Ethereum and L2 deployments. Underlying-market dependencies, oracle feeds, and curator parameters are primary risk inputs.\n\nMorpho markets can be created for specific collateral pairs with custom loan-to-value ratios, oracle providers, and interest-rate models — increasing flexibility but also configuration risk.",
          "Morpho начинался как optimizer-слой на Aave и Compound, направляя matched liquidity для улучшения APY поставщиков и ставок заёмщиков. Morpho Blue расширяет это permissionless изолированными рынками под управлением risk managers.\n\nВ контексте TJT Morpho относится к lending. Он связывает поставщиков стейблкоинов и залог ETH на Ethereum и L2. Зависимости от базовых рынков, oracle и параметров кураторов — ключевые входы риска.\n\nРынки Morpho создаются для конкретных пар залога с custom LTV, oracle и моделями ставок — гибкость растёт, но и риск конфигурации.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Suppliers deposit into Morpho vaults or markets and earn yield from matched borrower demand. In optimizer mode, idle liquidity falls through to underlying protocols; matched portions earn improved rates.\n\nBorrowers post collateral against Morpho or Morpho Blue markets and pay interest based on utilization and IRM parameters. Liquidations follow market-specific thresholds.\n\nCurators propose risk parameters for Morpho Blue markets. Governance and curator decisions affect oracle selection, caps, and pause controls.",
          "Поставщики вносят средства в vaults или рынки Morpho и получают yield от matched спроса заёмщиков. В режиме optimizer неиспользованная ликвидность уходит в базовые протоколы; matched части получают улучшенные ставки.\n\nЗаёмщики вносят залог в рынки Morpho или Morpho Blue и платят проценты по utilization и IRM. Ликвидации следуют порогам конкретного рынка.\n\nКураторы предлагают параметры риска для Morpho Blue. Governance и решения кураторов влияют на oracle, caps и паузы.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "Stablecoin supply: Users seeking improved APY on USDC or USDT via P2P matching when borrow demand is elevated.\n\nIsolated markets: Curators deploy markets for specific collateral types with segmented risk from core lending pools.\n\nDeFi composability: Morpho vault shares integrate with aggregators and strategy vaults, layering exposure beyond base markets.",
          "Поставка стейблкоинов: пользователи ищут улучшенный APY на USDC или USDT через P2P matching при высоком спросе на заём.\n\nИзолированные рынки: кураторы разворачивают рынки для конкретных типов залога с сегментированным риском.\n\nКомпозируемость DeFi: доли vaults Morpho интегрируются с агрегаторами и strategy vaults.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Capital efficiency improvements can raise supplier APY versus passive underlying-market deposits during high matching rates.\n\nMorpho Blue enables permissionless market creation with isolated risk parameters.\n\nTransparent on-chain metrics for utilization, matching rates, and market parameters support independent verification.",
          "Улучшение капитальной эффективности может повышать APY поставщиков vs пассивные депозиты в базовых рынках при высоком matching.\n\nMorpho Blue позволяет permissionless создание рынков с изолированными параметрами риска.\n\nПрозрачные on-chain метрики utilization, matching и параметров рынков поддерживают независимую проверку.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Underlying protocol risk: Morpho inherits smart-contract and liquidity risk from base markets like Aave and Compound.\n\nCurator and configuration risk: Incorrect oracle selection, LTV settings, or caps can harm suppliers.\n\nLiquidity risk: High utilization on isolated markets can slow withdrawals.\n\nOracle risk: Price feeds drive liquidations; stale data can trigger wrongful liquidations.",
          "Риск базового протокола: Morpho наследует риски смарт-контрактов и ликвидности Aave, Compound и др.\n\nРиск куратора и конфигурации: неверный oracle, LTV или caps вредят поставщикам.\n\nРиск ликвидности: высокий utilization на изолированных рынках замедляет вывод.\n\nРиск оракулов: ценовые фиды управляют ликвидациями.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Aave, Compound, and Spark offer direct lending-market exposure without optimizer layering.\n\nFor ETH-native yield, liquid staking via Lido or Rocket Pool presents a different risk profile.\n\nTJT Compare pages for best USDC and USDT yield help evaluate Morpho alongside other lending routes using Trust Score context.",
          "Aave, Compound и Spark дают прямую экспозицию lending без optimizer-слоя.\n\nДля ETH-yield liquid staking через Lido или Rocket Pool — другой профиль риска.\n\nTJT Compare best USDC и USDT yield помогает оценить Morpho рядом с другими lending-маршрутами через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDC yield and best USDT yield comparisons aggregate stablecoin routes where Morpho deployments may appear in catalog data.\n\nAave vs Lido provides cross-category context when Morpho supply sits alongside ETH staking research.",
          "Сравнения best USDC yield и best USDT yield агрегируют stablecoin-маршруты, где развёртывания Morpho могут появиться в каталоге.\n\nAave vs Lido даёт кросс-категорийный контекст, когда supply Morpho сочетается с исследованием ETH staking.",
        ),
      },
    ],
    faq: [
      {
        question: L("What is Morpho Blue?", "Что такое Morpho Blue?"),
        answer: L(
          "Morpho Blue is a permissionless lending primitive where curators deploy isolated markets with custom collateral, oracle, and interest-rate parameters.",
          "Morpho Blue — permissionless lending-примитив, где кураторы разворачивают изолированные рынки с custom залогом, oracle и ставками.",
        ),
      },
      {
        question: L("Is Morpho the same as Aave?", "Morpho — это то же, что Aave?"),
        answer: L(
          "No. Morpho optimizes or creates markets that may route through or sit alongside protocols like Aave. Underlying contracts and risks differ by deployment.",
          "Нет. Morpho оптимизирует или создаёт рынки, которые могут маршрутизироваться через Aave и др. Контракты и риски различаются по развёртыванию.",
        ),
      },
      {
        question: L("Can I lose funds supplying to Morpho?", "Можно ли потерять средства при supply в Morpho?"),
        answer: L(
          "Yes. Smart contract exploits, oracle failures, and underlying-market insolvency are among the risks. This page is a risk overview, not a safety guarantee.",
          "Да. Эксплойты, сбои oracle и неплатёжеспособность базовых рынков — среди рисков. Страница — risk overview, а не гарантия безопасности.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "morpho-vs-aave"), label: L("Morpho vs Aave comparison", "Сравнение Morpho vs Aave"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdt-yield"), label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "aave-vs-lido"), label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"), type: "compare" },
      { href: (lang) => protocolHref(lang, "morpho"), label: L("Morpho protocol hub", "Хаб протокола Morpho"), type: "protocols" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: (lang) => learnHref(lang, "what-is-defi-yield"), label: L("What is DeFi yield?", "Что такое DeFi yield?"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-morpho-safe"), label: L("Is Morpho safe?", "Безопасен ли Morpho?"), type: "safety" },
      { href: reviewsHubHref, label: L("Reviews hub", "Хаб обзоров"), type: "reviews" },
    ],
    ctaHref: (lang) => compareHref(lang, "morpho-vs-aave"),
    keywords: ["morpho review", "morpho blue", "defi lending optimizer", "morpho risks"],
  },
  {
    slug: "rocket-pool-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Rocket Pool Protocol Review — Decentralized Liquid Staking | TJT",
      "Обзор протокола Rocket Pool — децентрализованный liquid staking | TJT",
    ),
    metaDescription: L(
      "Educational Rocket Pool overview: rETH mechanics, decentralized node operators, use cases, benefits, risks, and TJT Compare links for ETH staking research.",
      "Образовательный обзор Rocket Pool: механика rETH, децентрализованные node operators, сценарии, преимущества, риски и ссылки TJT Compare для исследования ETH staking.",
    ),
    h1: L("Rocket Pool Protocol Review", "Обзор протокола Rocket Pool"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Rocket Pool is a decentralized liquid-staking protocol on Ethereum that issues rETH while distributing validation across independent node operators. This review provides educational information and market context — not financial advice.",
      "Rocket Pool — децентрализованный протокол liquid staking на Ethereum, выпускающий rETH при распределении валидации между независимыми node operators. Обзор даёт образовательную информацию и рыночный контекст, а не финансовый совет.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Rocket Pool allows users to stake ETH and receive rETH, a liquid staking token whose exchange rate accrues validator rewards. Unlike fully pooled designs, Rocket Pool emphasizes a distributed minipool and node-operator network secured by RPL collateral.\n\nFrom a TJT perspective, Rocket Pool sits in the liquid-staking category alongside Lido. Validator decentralization, slashing rules, and rETH secondary-market liquidity are primary risk inputs.\n\nRocket Pool governance via RPL holders influences fees, operator requirements, and protocol upgrades.",
          "Rocket Pool позволяет стейкать ETH и получать rETH — LST с растущим курсом от наград валидаторов. В отличие от полностью пуловых дизайнов, Rocket Pool делает акцент на распределённой сети minipool и node operators с залогом RPL.\n\nВ контексте TJT Rocket Pool — liquid staking рядом с Lido. Децентрализация валидаторов, slashing и ликвидность rETH — ключевые входы риска.\n\nGovernance через RPL влияет на комиссии, требования к операторам и апгрейды.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Users deposit ETH and receive rETH at the current exchange rate. Rewards increase the rETH/ETH ratio over time minus protocol and node-operator fees.\n\nNode operators run minipools with bonded RPL collateral. Slashing penalties can affect operator collateral and, in extreme cases, pool participants.\n\nrETH trades on DEXs and is accepted as collateral in lending protocols, enabling composable DeFi strategies.",
          "Пользователи вносят ETH и получают rETH по текущему курсу. Награды увеличивают соотношение rETH/ETH за вычетом комиссий.\n\nNode operators запускают minipools с залогом RPL. Slashing влияет на залог операторов и в крайних случаях на участников пула.\n\nrETH торгуется на DEX и принимается как залог в lending, обеспечивая композируемые DeFi-стратегии.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "ETH staking with liquidity: Hold rETH instead of illiquid staked ETH while earning validator rewards.\n\nDeFi collateral: Use rETH in lending markets for borrow utility while maintaining staking exposure.\n\nDecentralization preference: Users seeking a more distributed operator model versus single-curator liquid staking.",
          "Staking ETH с ликвидностью: держать rETH вместо неликвидного staked ETH с наградами валидаторов.\n\nЗалог DeFi: использовать rETH в lending для utility заёма при сохранении staking-экспозиции.\n\nПредпочтение децентрализации: пользователи, ищущие более распределённую модель операторов.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Distributed node-operator network aims to reduce single-curator concentration versus some pooled LST designs.\n\nrETH composability across DeFi lending and DEX markets supports flexible portfolio construction.\n\nYears of mainnet operation and multiple audits provide a longer track record than many newer LST protocols.",
          "Распределённая сеть node operators снижает концентрацию одного куратора vs некоторых пуловых LST.\n\nКомпозируемость rETH в lending и DEX поддерживает гибкое построение портфеля.\n\nГоды mainnet и множественные аудиты дают более длинную историю vs многих новых LST.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Slashing risk: Validator penalties can affect rETH exchange rate and operator collateral.\n\nPeg and liquidity risk: rETH can trade below ETH during market stress; DEX depth may thin.\n\nSmart contract risk: Minipool, deposit, and withdrawal contracts carry exploit exposure despite audits.\n\nGovernance risk: RPL holder votes can change fees, collateral requirements, or upgrade paths.",
          "Риск slashing: штрафы валидаторов влияют на курс rETH и залог операторов.\n\nРиск пега и ликвидности: rETH может торговаться ниже ETH в стрессе; глубина DEX истончается.\n\nРиск смарт-контрактов: minipool, deposit и withdrawal несут экспозицию эксплойтов.\n\nРиск governance: голоса RPL меняют комиссии, залог и апгрейды.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Lido stETH offers deeper liquidity and broader DeFi integrations with a different governance and operator model.\n\nEtherFi and restaking protocols add AVS yield layers with distinct complexity.\n\nNative solo staking and centralized staking services provide non-DeFi paths with separate custody models.\n\nTJT best ETH staking Compare helps evaluate Rocket Pool alongside Lido with Trust Score context.",
          "Lido stETH даёт более глубокую ликвидность и интеграции с другой моделью governance.\n\nEtherFi и restaking добавляют AVS-yield со своей сложностью.\n\nSolo staking и CEX-сервисы — отдельные модели кастоди.\n\nTJT best ETH staking Compare оценивает Rocket Pool рядом с Lido через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best ETH staking ranks Ethereum liquid-staking routes including Rocket Pool and Lido.\n\nAave vs Lido contrasts lending with liquid staking when ETH yield research spans categories.",
          "Best ETH staking ранжирует маршруты liquid staking Ethereum, включая Rocket Pool и Lido.\n\nAave vs Lido сопоставляет lending и liquid staking при кросс-категорийном исследовании ETH yield.",
        ),
      },
    ],
    faq: [
      {
        question: L("What is rETH?", "Что такое rETH?"),
        answer: L(
          "rETH is Rocket Pool's liquid staking token. Its ETH exchange rate increases as staking rewards accrue minus protocol fees.",
          "rETH — LST Rocket Pool. Курс к ETH растёт с наградами staking за вычетом комиссий протокола.",
        ),
      },
      {
        question: L("How is Rocket Pool different from Lido?", "Чем Rocket Pool отличается от Lido?"),
        answer: L(
          "Rocket Pool emphasizes a distributed minipool operator network with RPL collateral. Lido uses a curated operator set with different governance and liquidity characteristics.",
          "Rocket Pool делает акцент на распределённых minipool operators с залогом RPL. Lido использует курируемый operator set с другим governance и ликвидностью.",
        ),
      },
      {
        question: L("Does Rocket Pool guarantee ETH staking yield?", "Гарантирует ли Rocket Pool yield от ETH staking?"),
        answer: L(
          "No. Validator rewards, slashing, and fees vary. TJT displays indicative context for comparison research only.",
          "Нет. Награды валидаторов, slashing и комиссии меняются. TJT показывает ориентировочный контекст только для сравнительных исследований.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "lido-vs-rocket-pool"), label: L("Lido vs Rocket Pool comparison", "Сравнение Lido vs Rocket Pool"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-eth-staking"), label: L("Best ETH staking comparison", "Сравнение лучшего ETH staking"), type: "compare" },
      { href: (lang) => compareHref(lang, "aave-vs-lido"), label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"), type: "compare" },
      { href: (lang) => protocolHref(lang, "rocket-pool"), label: L("Rocket Pool protocol hub", "Хаб протокола Rocket Pool"), type: "protocols" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
      { href: (lang) => learnHref(lang, "what-is-liquid-staking"), label: L("What is liquid staking?", "Что такое liquid staking?"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-rocket-pool-safe"), label: L("Is Rocket Pool safe?", "Безопасен ли Rocket Pool?"), type: "safety" },
      { href: reviewsHubHref, label: L("Reviews hub", "Хаб обзоров"), type: "reviews" },
    ],
    ctaHref: (lang) => compareHref(lang, "lido-vs-rocket-pool"),
    keywords: ["rocket pool review", "reth", "decentralized staking", "eth liquid staking"],
  },
  {
    slug: "compound-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Compound Protocol Review — Lending Markets & Risk Overview | TJT",
      "Обзор протокола Compound — lending-рынки и риски | TJT",
    ),
    metaDescription: L(
      "Educational Compound protocol overview: cToken lending, use cases, benefits, risks, alternatives, and TJT Compare links for stablecoin yield research.",
      "Образовательный обзор Compound: cToken lending, сценарии, преимущества, риски, альтернативы и ссылки TJT Compare для исследования stablecoin yield.",
    ),
    h1: L("Compound Protocol Review", "Обзор протокола Compound"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Compound is a pioneer decentralized lending protocol where suppliers earn interest via cTokens and borrowers draw loans against collateral. This review provides educational information and market context — not financial advice.",
      "Compound — пионер децентрализованного lending, где поставщики получают проценты через cTokens, а заёмщики берут займы под залог. Обзор даёт образовательную информацию и рыночный контекст, а не финансовый совет.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Compound launched among the earliest DeFi money markets on Ethereum and expanded to L2 networks with Compound III (Comet) deployments. Suppliers receive cTokens representing their pool share; interest accrues automatically.\n\nFrom a TJT perspective, Compound sits in the lending category alongside Aave, Morpho, and Spark. TVL depth, utilization, governance proposals, and oracle dependencies are primary risk inputs.\n\nCompound III focuses on single borrowable asset markets per deployment, simplifying risk parameters versus multi-asset legacy pools.",
          "Compound — один из первых DeFi money markets на Ethereum, расширившийся на L2 с Compound III (Comet). Поставщики получают cTokens как долю пула; проценты начисляются автоматически.\n\nВ контексте TJT Compound — lending рядом с Aave, Morpho и Spark. TVL, utilization, governance и oracle — ключевые входы риска.\n\nCompound III фокусируется на одном borrowable активе на развёртывание, упрощая параметры риска vs legacy multi-asset пулы.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Suppliers deposit assets and receive cTokens that appreciate in value as interest accrues from borrower demand.\n\nBorrowers post collateral, maintain health factors, and pay variable interest rates algorithmically tied to utilization.\n\nCOMP governance token holders vote on protocol upgrades, market listings, and parameter changes.",
          "Поставщики вносят активы и получают cTokens, растущие в цене по мере начисления процентов от спроса заёмщиков.\n\nЗаёмщики вносят залог, поддерживают health factor и платят переменные ставки, привязанные к utilization.\n\nДержатели COMP голосуют за апгрейды, листинг рынков и изменение параметров.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "Stablecoin supply: Earn variable APY on USDC or USDT when borrow demand is elevated.\n\nCollateralized borrowing: ETH holders borrow stablecoins for liquidity without exiting positions.\n\nDeFi composability: cTokens and collateral positions integrate with external protocols, layering exposure.",
          "Поставка стейблкоинов: переменный APY на USDC или USDT при высоком спросе на заём.\n\nЗалоговое кредитование: держатели ETH занимают стейблкоины для ликвидности без выхода из позиции.\n\nКомпозируемость DeFi: cTokens и залоговые позиции интегрируются с внешними протоколами.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Long operational history since early DeFi provides extensive mainnet track record.\n\nTransparent on-chain utilization and rate curves enable independent verification.\n\nCompound III simplifies market structure with focused collateral sets per deployment.",
          "Длинная операционная история с раннего DeFi даёт обширный mainnet track record.\n\nПрозрачные on-chain utilization и кривые ставок позволяют независимую проверку.\n\nCompound III упрощает структуру рынков с фокусированными наборами залога.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Smart contract risk: Despite audits, vulnerabilities or governance exploits could affect pooled funds.\n\nLiquidity risk: High utilization can slow withdrawals during stress.\n\nOracle risk: Price feeds drive liquidations; oracle failures can trigger wrongful liquidations.\n\nGovernance risk: Parameter changes and market listings affect supplier and borrower risk profiles.",
          "Риск смарт-контрактов: несмотря на аудиты, уязвимости или эксплойты governance могут затронуть пулы.\n\nРиск ликвидности: высокий utilization замедляет вывод в стрессе.\n\nРиск оракулов: ценовые фиды управляют ликвидациями.\n\nРиск governance: изменения параметров и листинг влияют на профили риска.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Aave, Morpho, and Spark offer competing lending routes with different governance and market structures.\n\nFor ETH yield without lending, liquid staking via Lido or Rocket Pool presents a different risk profile.\n\nTJT Compare pages for best USDC and USDT yield help evaluate Compound alongside peers using Trust Score context.",
          "Aave, Morpho и Spark — конкурирующие lending-маршруты с разными governance и структурами рынков.\n\nДля ETH-yield без lending liquid staking через Lido или Rocket Pool — другой профиль риска.\n\nTJT Compare best USDC и USDT yield оценивает Compound рядом с аналогами через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDC yield and best USDT yield comparisons aggregate stablecoin routes where Compound deployments may appear.\n\nAave vs Lido provides cross-category context when Compound supply sits alongside ETH staking research.",
          "Сравнения best USDC yield и best USDT yield агрегируют stablecoin-маршруты с развёртываниями Compound.\n\nAave vs Lido даёт кросс-категорийный контекст при сочетании Compound supply и ETH staking.",
        ),
      },
    ],
    faq: [
      {
        question: L("What are cTokens?", "Что такое cTokens?"),
        answer: L(
          "cTokens represent your share in a Compound market. Their exchange rate increases as interest accrues from borrower demand.",
          "cTokens представляют вашу долю в рынке Compound. Их курс растёт по мере начисления процентов от спроса заёмщиков.",
        ),
      },
      {
        question: L("Is Compound V3 the same as legacy Compound?", "Compound V3 — то же, что legacy Compound?"),
        answer: L(
          "Compound III (Comet) uses a different market architecture focused on single borrowable assets per deployment. Legacy v2 markets still exist on Ethereum with separate parameters.",
          "Compound III (Comet) использует другую архитектуру с одним borrowable активом на развёртывание. Legacy v2 рынки на Ethereum сохраняются с отдельными параметрами.",
        ),
      },
      {
        question: L("Can I lose funds supplying to Compound?", "Можно ли потерять средства при supply в Compound?"),
        answer: L(
          "Yes. Smart contract exploits, insolvency events, or prolonged high utilization are among the risks. This page is a risk overview, not a safety guarantee.",
          "Да. Эксплойты, неплатёжеспособность или длительный высокий utilization — среди рисков. Страница — risk overview, а не гарантия безопасности.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "compound-vs-aave"), label: L("Compound vs Aave comparison", "Сравнение Compound vs Aave"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdt-yield"), label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "aave-vs-lido"), label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"), type: "compare" },
      { href: (lang) => protocolHref(lang, "compound"), label: L("Compound protocol hub", "Хаб протокола Compound"), type: "protocols" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: (lang) => learnHref(lang, "crypto-yield-risks"), label: L("Crypto yield risks guide", "Гид по рискам crypto yield"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-compound-safe"), label: L("Is Compound safe?", "Безопасен ли Compound?"), type: "safety" },
      { href: reviewsHubHref, label: L("Reviews hub", "Хаб обзоров"), type: "reviews" },
    ],
    ctaHref: (lang) => compareHref(lang, "compound-vs-aave"),
    keywords: ["compound review", "compound finance", "defi lending", "compound risks"],
  },
  ...WAVE1_REVIEW_PAGES,
];
