import type { Locale } from "@/lib/i18n";
import { L, type SeoPilotPage } from "@/lib/seo-pilot/types";

function compareHref(lang: Locale, slug: string) {
  return `/${lang}/compare/${slug}`;
}
function protocolHref(lang: Locale, slug: string) {
  return `/${lang}/protocols/${slug}`;
}
function earnHref(lang: Locale, asset: string) {
  return `/${lang}/earn/${asset}`;
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

export const WAVE1_REVIEW_PAGES: SeoPilotPage[] = [
  {
    slug: "spark-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Spark Protocol Review — SparkLend & MakerDAO Lending Overview | TJT",
      "Обзор протокола Spark — SparkLend и lending MakerDAO | TJT",
    ),
    metaDescription: L(
      "Educational Spark protocol overview: SparkLend lending markets, MakerDAO ecosystem context, use cases, benefits, risks, and TJT Compare links for stablecoin yield research.",
      "Образовательный обзор Spark: рынки SparkLend, контекст экосистемы MakerDAO, сценарии, преимущества, риски и ссылки TJT Compare для исследования stablecoin yield.",
    ),
    h1: L("Spark Protocol Review", "Обзор протокола Spark"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Spark is a lending protocol in the MakerDAO ecosystem, operating SparkLend markets for stablecoins and ETH on Ethereum. This review provides educational information and market context — not financial advice.",
      "Spark — lending-протокол экосистемы MakerDAO с рынками SparkLend для стейблкоинов и ETH на Ethereum. Обзор даёт образовательную информацию и рыночный контекст, а не финансовый совет.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Spark extends MakerDAO's DAI-centric liquidity infrastructure into general-purpose DeFi lending via SparkLend. Suppliers earn variable APY from borrower demand; borrowers post collateral against algorithmic rates.\n\nFrom a TJT perspective, Spark sits in the lending category alongside Aave, Compound, and Morpho. MakerDAO ecosystem backing, audit coverage, and TVL depth are primary Trust Score inputs — with governance coupling and younger deployment history as residual risk context.\n\nSparkLend risk parameters can change via MakerDAO-aligned governance processes.",
          "Spark расширяет DAI-инфраструктуру MakerDAO в универсальный DeFi lending через SparkLend. Поставщики получают переменный APY от спроса заёмщиков; заёмщики вносят залог под алгоритмические ставки.\n\nВ контексте TJT Spark — lending рядом с Aave, Compound и Morpho. Поддержка MakerDAO, аудиты и TVL — ключевые входы Trust Score — с governance-связью и более короткой историей как остаточный risk context.\n\nПараметры риска SparkLend могут меняться через governance, связанный с MakerDAO.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Users supply assets into SparkLend pools and receive interest-bearing positions. Borrowers draw liquidity against collateral subject to loan-to-value limits and liquidation thresholds.\n\nInterest rates adjust with pool utilization — higher borrow demand typically raises supplier APY.\n\nSpark integrates with MakerDAO liquidity flows, meaning DAI and stablecoin market conditions can influence pool depth and utilization patterns.",
          "Пользователи вносят активы в пулы SparkLend и получают позиции с начислением процентов. Заёмщики берут ликвидность под залог с LTV и порогами ликвидации.\n\nСтавки меняются с utilization — высокий спрос на заём обычно повышает APY поставщиков.\n\nSpark интегрирован с ликвидностью MakerDAO — условия рынков DAI и стейблкоинов влияют на глубину пулов и utilization.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "Stablecoin supply: Users seeking variable APY on USDC, USDT, or DAI within the MakerDAO ecosystem.\n\nETH collateral borrowing: Traders and DeFi strategists posting ETH collateral for stablecoin liquidity.\n\nEcosystem alignment: Participants already active in MakerDAO governance or DAI infrastructure seeking unified lending exposure.",
          "Поставка стейблкоинов: пользователи ищут переменный APY на USDC, USDT или DAI в экосистеме MakerDAO.\n\nЗалоговое кредитование ETH: трейдеры и DeFi-стратеги вносят ETH под ликвидность стейблкоинов.\n\nСвязь с экосистемой: участники MakerDAO governance или DAI-инфраструктуры, ищущие единую lending-экспозицию.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "MakerDAO ecosystem backing provides liquidity infrastructure context beyond standalone lending deployments.\n\nDocumented audit coverage and public risk disclosures support independent verification.\n\nTransparent on-chain metrics for utilization and pool parameters enable market research.",
          "Поддержка экосистемы MakerDAO даёт контекст ликвидности сверх standalone lending.\n\nДокументированные аудиты и публичные раскрытия рисков поддерживают независимую проверку.\n\nПрозрачные on-chain метрики utilization и параметров пулов помогают исследованию рынка.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Governance risk: MakerDAO-aligned governance can alter SparkLend parameters, collateral factors, or pause markets.\n\nLiquidity risk: High utilization slows withdrawals; DAI and stablecoin stress affects pool health.\n\nSmart contract risk: Audits reduce but do not eliminate exploit potential.\n\nOracle risk: Price feeds drive liquidations; stale data can trigger wrongful liquidations.",
          "Риск governance: governance MakerDAO может менять параметры SparkLend, collateral factors или останавливать рынки.\n\nРиск ликвидности: высокий utilization замедляет вывод; стресс DAI и стейблкоинов влияет на пулы.\n\nРиск смарт-контрактов: аудиты снижают, но не устраняют эксплойты.\n\nРиск оракулов: ценовые фиды управляют ликвидациями.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Aave, Compound, and Morpho offer competing lending routes with different governance models and chain coverage.\n\nFor ETH-native yield without lending exposure, liquid staking via Lido or Rocket Pool presents a different risk profile.\n\nTJT Compare pages for Spark vs Aave and best USDC yield help evaluate Spark alongside peers using Trust Score context.",
          "Aave, Compound и Morpho — конкурирующие lending-маршруты с разными governance и покрытием сетей.\n\nДля ETH-yield без lending liquid staking через Lido или Rocket Pool — другой профиль риска.\n\nTJT Compare Spark vs Aave и best USDC yield оценивает Spark рядом с аналогами через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Spark vs Aave provides side-by-side lending comparison with Trust Score v0.1 indicators.\n\nBest USDC and USDT yield comparisons aggregate stablecoin routes where Spark deployments may appear in catalog data.",
          "Spark vs Aave даёт side-by-side сравнение lending с индикаторами Trust Score v0.1.\n\nBest USDC и USDT yield агрегируют stablecoin-маршруты, где Spark может появиться в каталоге.",
        ),
      },
    ],
    faq: [
      {
        question: L("What is SparkLend?", "Что такое SparkLend?"),
        answer: L(
          "SparkLend is Spark's lending market deployment on Ethereum, offering supply and borrow for stablecoins and ETH within the MakerDAO ecosystem.",
          "SparkLend — lending-развёртывание Spark на Ethereum с supply и borrow стейблкоинов и ETH в экосистеме MakerDAO.",
        ),
      },
      {
        question: L("Is Spark the same as MakerDAO?", "Spark — то же, что MakerDAO?"),
        answer: L(
          "No. Spark is a lending protocol within the MakerDAO ecosystem with aligned governance links, but distinct contracts and market parameters.",
          "Нет. Spark — lending-протокол в экосистеме MakerDAO со связанным governance, но с отдельными контрактами и параметрами рынков.",
        ),
      },
      {
        question: L("Can I lose funds supplying to Spark?", "Можно ли потерять средства при supply в Spark?"),
        answer: L(
          "Yes. Smart contract exploits, oracle failures, and high utilization are among the risks. This page is a risk overview, not a safety guarantee.",
          "Да. Эксплойты, сбои oracle и высокий utilization — среди рисков. Страница — risk overview, а не гарантия безопасности.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "spark-vs-aave"), label: L("Spark vs Aave comparison", "Сравнение Spark vs Aave"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdt-yield"), label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"), type: "compare" },
      { href: (lang) => protocolHref(lang, "spark"), label: L("Spark protocol hub", "Хаб протокола Spark"), type: "protocols" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: (lang) => learnHref(lang, "what-is-protocol-tvl"), label: L("What is protocol TVL?", "Что такое TVL протокола?"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-spark-safe"), label: L("Is Spark safe?", "Безопасен ли Spark?"), type: "safety" },
      { href: reviewsHubHref, label: L("Reviews hub", "Хаб обзоров"), type: "reviews" },
    ],
    ctaHref: (lang) => compareHref(lang, "spark-vs-aave"),
    keywords: ["spark review", "sparklend", "makerdao lending", "spark defi", "spark risks"],
  },
  {
    slug: "pendle-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Pendle Protocol Review — Yield Trading & PT/YT Overview | TJT",
      "Обзор протокола Pendle — торговля yield и PT/YT | TJT",
    ),
    metaDescription: L(
      "Educational Pendle protocol overview: yield-token markets, PT/YT mechanics, fixed yield trading, use cases, risks, and TJT Compare links.",
      "Образовательный обзор Pendle: рынки yield-токенов, механика PT/YT, торговля фиксированным yield, сценарии, риски и ссылки TJT Compare.",
    ),
    h1: L("Pendle Protocol Review", "Обзор протокола Pendle"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Pendle is a yield-trading protocol that splits future yield from underlying assets into principal tokens (PT) and yield tokens (YT). This review provides educational information and market context — not financial advice.",
      "Pendle — протокол торговли доходностью, разделяющий будущий yield базовых активов на principal tokens (PT) и yield tokens (YT). Обзор даёт образовательную информацию и рыночный контекст, а не финансовый совет.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Pendle enables users to trade yield exposure separately from principal on Ethereum and L2 networks. Markets exist for liquid staking tokens, stablecoins, restaking receipts, and other yield-bearing assets.\n\nFrom a TJT perspective, Pendle sits in the yield-trading category. TVL in PT/YT markets, audit coverage, and underlying-asset issuer risk are primary Trust Score inputs.\n\nImplied fixed yields are market-derived prices — not principal guarantees at maturity.",
          "Pendle позволяет торговать yield-экспозицией отдельно от principal на Ethereum и L2. Рынки есть для LST, стейблкоинов, restaking receipt и других yield-активов.\n\nВ контексте TJT Pendle — yield-trading. TVL в PT/YT, аудиты и риск эмитента базовых активов — ключевые входы Trust Score.\n\nПодразумеваемая фиксированная доходность — рыночная цена, не гарантия principal при погашении.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Users deposit yield-bearing assets into Pendle and receive standardized yield tokens (SY). SY is split into PT (principal, redeemable at maturity) and YT (yield rights until maturity).\n\nTraders buy PT to lock in implied fixed yield or sell YT to monetize future yield upfront.\n\nEach market has a maturity date — liquidity and pricing dynamics vary by time to expiry.",
          "Пользователи вносят yield-активы в Pendle и получают standardized yield tokens (SY). SY делится на PT (principal, погашаемый при maturity) и YT (права на yield до maturity).\n\nТрейдеры покупают PT для фиксации implied yield или продают YT для монетизации будущего yield.\n\nУ каждого рынка дата погашения — ликвидность и ценообразование зависят от срока.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "Fixed yield locking: Users buying PT to express a view on implied fixed rates versus variable underlying yield.\n\nYield speculation: Traders buying or selling YT to bet on future yield levels.\n\nPortfolio hedging: Institutions or DAOs managing yield exposure across maturities without exiting underlying positions.",
          "Фиксация yield: покупка PT для выражения взгляда на implied фиксированные ставки vs переменный базовый yield.\n\nСпекуляция на yield: покупка или продажа YT для ставок на будущий yield.\n\nХеджирование портфеля: управление yield-экспозицией по срокам без выхода из базовых позиций.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Separates principal and yield exposure — enabling strategies unavailable in plain lending or staking.\n\nIntegrated across LST, stablecoin, and restaking markets on multiple chains.\n\nTransparent market pricing of implied yields supports independent rate research.",
          "Разделяет principal и yield — открывая стратегии, недоступные в plain lending или staking.\n\nИнтеграции в LST, стейблкоины и restaking на нескольких сетях.\n\nПрозрачное рыночное ценообразование implied yield поддерживает независимое исследование ставок.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Underlying-asset risk: PT/YT positions inherit smart-contract and issuer risk from source assets (LSTs, restaking tokens, stablecoins).\n\nMaturity liquidity risk: PT/YT markets can thin for newer or distant maturities.\n\nImplied-yield risk: Market pricing can shift before maturity — fixed yield is not guaranteed.\n\nSmart contract risk: Pendle core contracts have been audited but composability extends blast radius.",
          "Риск базового актива: PT/YT наследуют риски смарт-контрактов и эмитента (LST, restaking, стейблкоины).\n\nРиск ликвидности по срокам: рынки PT/YT истончаются для новых или дальних maturity.\n\nРиск implied yield: рыночное ценообразование меняется до погашения — фиксированный yield не гарантирован.\n\nРиск смарт-контрактов: core Pendle аудирован, но композируемость расширяет радиус.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Direct liquid staking or restaking via Lido, Rocket Pool, or EtherFi provides simpler ETH yield without yield-trading mechanics.\n\nLending markets on Aave or Spark offer variable stablecoin APY without maturity segmentation.\n\nTJT Pendle vs EtherFi Compare helps contrast yield-trading vs liquid restaking with Trust Score context.",
          "Прямой liquid staking или restaking через Lido, Rocket Pool или EtherFi даёт более простой ETH-yield без yield-trading.\n\nLending на Aave или Spark — переменный stablecoin APY без сегментации по срокам.\n\nTJT Pendle vs EtherFi Compare сопоставляет yield-trading и liquid restaking через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Pendle vs EtherFi contrasts yield-trading markets with direct liquid restaking exposure.\n\nBest USDC yield and best ETH staking comparisons add market context for underlying assets in Pendle markets.",
          "Pendle vs EtherFi сопоставляет yield-trading и прямую liquid restaking-экспозицию.\n\nBest USDC yield и best ETH staking добавляют контекст для базовых активов в рынках Pendle.",
        ),
      },
    ],
    faq: [
      {
        question: L("What are PT and YT?", "Что такое PT и YT?"),
        answer: L(
          "PT (Principal Token) represents the principal redeemable at maturity. YT (Yield Token) represents rights to yield accrued until maturity.",
          "PT (Principal Token) — principal, погашаемый при maturity. YT (Yield Token) — права на yield до maturity.",
        ),
      },
      {
        question: L("Does Pendle guarantee fixed yield?", "Гарантирует ли Pendle фиксированный yield?"),
        answer: L(
          "No. PT implied yields are market-derived prices at purchase time. Underlying asset and smart-contract risks remain throughout the position.",
          "Нет. Implied yield PT — рыночная цена на момент покупки. Риски базовых активов и смарт-контрактов сохраняются.",
        ),
      },
      {
        question: L("Can I lose funds using Pendle?", "Можно ли потерять средства в Pendle?"),
        answer: L(
          "Yes. Underlying-asset exploits, maturity liquidity stress, and pricing shifts are among the risks. This page is a risk overview, not a safety guarantee.",
          "Да. Эксплойты базовых активов, стресс ликвидности по срокам и сдвиги цен — среди рисков. Страница — risk overview, а не гарантия безопасности.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "pendle-vs-etherfi"), label: L("Pendle vs EtherFi comparison", "Сравнение Pendle vs EtherFi"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-eth-staking"), label: L("Best ETH staking comparison", "Сравнение лучшего ETH staking"), type: "compare" },
      { href: (lang) => protocolHref(lang, "pendle"), label: L("Pendle protocol hub", "Хаб протокола Pendle"), type: "protocols" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
      { href: (lang) => learnHref(lang, "what-is-restaking"), label: L("What is restaking?", "Что такое restaking?"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-pendle-safe"), label: L("Is Pendle safe?", "Безопасен ли Pendle?"), type: "safety" },
      { href: reviewsHubHref, label: L("Reviews hub", "Хаб обзоров"), type: "reviews" },
    ],
    ctaHref: (lang) => compareHref(lang, "pendle-vs-etherfi"),
    keywords: ["pendle review", "pendle pt yt", "yield trading", "pendle defi", "pendle risks"],
  },
  {
    slug: "etherfi-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "EtherFi Protocol Review — Liquid Restaking & eETH Overview | TJT",
      "Обзор протокола EtherFi — liquid restaking и eETH | TJT",
    ),
    metaDescription: L(
      "Educational EtherFi protocol overview: liquid restaking, eETH mechanics, AVS yield, use cases, risks, and TJT Compare links for ETH restaking research.",
      "Образовательный обзор EtherFi: liquid restaking, механика eETH, AVS yield, сценарии, риски и ссылки TJT Compare для исследования ETH restaking.",
    ),
    h1: L("EtherFi Protocol Review", "Обзор протокола EtherFi"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "EtherFi is a liquid restaking and staking protocol on Ethereum. eETH and related tokens accrue staking and restaking rewards while staying composable across DeFi. This review provides educational information — not financial advice.",
      "EtherFi — протокол liquid restaking и staking на Ethereum. eETH и связанные токены начисляют staking и restaking rewards, оставаясь композируемыми в DeFi. Обзор даёт образовательную информацию, а не финансовый совет.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "EtherFi pools ETH deposits, operates validators, and mints eETH — a liquid restaking receipt token. Restaking extends staking rewards with AVS (Actively Validated Service) incentives through EigenLayer-aligned infrastructure.\n\nFrom a TJT perspective, EtherFi sits in the liquid restaking category. Protocol age, restaking complexity, and AVS-dependent yield are elevated Trust Score risk context factors.\n\nYounger deployment history versus Lido or Rocket Pool requires independent verification.",
          "EtherFi пулит ETH-депозиты, управляет валидаторами и минтит eETH — liquid restaking receipt. Restaking расширяет staking rewards AVS incentives через инфраструктуру EigenLayer.\n\nВ контексте TJT EtherFi — liquid restaking. Возраст протокола, сложность restaking и AVS-зависимый yield — повышенные факторы risk context в Trust Score.\n\nБолее короткая история vs Lido или Rocket Pool требует самостоятельной проверки.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Users deposit ETH and receive eETH representing a share of the pooled stake plus accruing rewards.\n\neETH integrates with DeFi — lending, DEX swaps, and Pendle yield markets — while underlying validators continue earning.\n\nWithdrawal paths may involve queues or secondary-market exits depending on network conditions and protocol parameters.",
          "Пользователи вносят ETH и получают eETH как долю пула stake с начислением наград.\n\neETH интегрируется в DeFi — lending, DEX, рынки Pendle — пока валидаторы продолжают зарабатывать.\n\nВывод может включать очереди или выход на вторичном рынке в зависимости от условий сети и параметров протокола.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "Liquid restaking: Users seeking ETH staking plus AVS yield without running validators.\n\nDeFi composability: Holding eETH while using it as collateral or in yield strategies.\n\nRestaking research: Comparing EtherFi against plain LSTs and yield-trading alternatives.",
          "Liquid restaking: пользователи ищут ETH staking плюс AVS yield без запуска валидаторов.\n\nКомпозируемость DeFi: держать eETH как залог или в yield-стратегиях.\n\nИсследование restaking: сравнение EtherFi с plain LST и yield-trading альтернативами.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Combines staking and restaking yield in a single liquid receipt token.\n\nGrowing DeFi integrations for eETH across lending and yield-trading markets.\n\nLower operational burden versus solo validator setup (32 ETH minimum on Ethereum).",
          "Объединяет staking и restaking yield в одном liquid receipt.\n\nРастущие DeFi-интеграции eETH в lending и yield-trading.\n\nМеньше операционной нагрузки vs solo validator (минимум 32 ETH на Ethereum).",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Restaking slashing: AVS misbehavior can impose penalties beyond base Ethereum staking slashing.\n\nPeg and liquidity risk: eETH may trade at a discount during market stress; withdrawal queues can delay exits.\n\nSmart contract risk: Restaking adds contract layers and operator dependencies.\n\nYield variability: AVS incentive programs change, affecting yield composition over time.",
          "Restaking slashing: misbehavior AVS может налагать штрафы сверх базового Ethereum slashing.\n\nРиск пега и ликвидности: eETH может торговаться с дисконтом в стрессе; очереди вывода задерживают exit.\n\nРиск смарт-контрактов: restaking добавляет слои контрактов и зависимости операторов.\n\nВолатильность yield: AVS incentives меняются, влияя на состав доходности.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Plain liquid staking via Lido stETH or Rocket Pool rETH avoids restaking slashing vectors.\n\nPendle yield-trading markets offer fixed or variable yield exposure on ETH-based assets without direct restaking.\n\nTJT best ETH restaking and Pendle vs EtherFi Compare pages help evaluate routes with Trust Score context.",
          "Plain liquid staking через Lido stETH или Rocket Pool rETH избегает restaking slashing.\n\nРынки Pendle дают фиксированный или переменный yield на ETH-активах без прямого restaking.\n\nTJT best ETH restaking и Pendle vs EtherFi Compare оценивают маршруты через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Pendle vs EtherFi contrasts yield-trading with direct liquid restaking.\n\nBest ETH restaking and best liquid staking comparisons aggregate catalog routes with Trust Score v0.1 indicators.",
          "Pendle vs EtherFi сопоставляет yield-trading и прямой liquid restaking.\n\nBest ETH restaking и best liquid staking агрегируют маршруты каталога с Trust Score v0.1.",
        ),
      },
    ],
    faq: [
      {
        question: L("What is eETH?", "Что такое eETH?"),
        answer: L(
          "eETH is EtherFi's liquid restaking receipt token representing pooled ETH stake plus accruing staking and restaking rewards.",
          "eETH — liquid restaking receipt EtherFi, представляющий пул ETH stake плюс начисляемые staking и restaking rewards.",
        ),
      },
      {
        question: L("Is restaking riskier than liquid staking?", "Restaking рискованнее liquid staking?"),
        answer: L(
          "Restaking adds AVS slashing vectors and additional contract layers beyond plain validator staking. Risk tolerance and research depth should increase accordingly.",
          "Restaking добавляет AVS slashing и дополнительные слои контрактов сверх plain validator staking. Толерантность к риску и глубина исследования должны расти соответственно.",
        ),
      },
      {
        question: L("Can I lose funds with EtherFi?", "Можно ли потерять средства в EtherFi?"),
        answer: L(
          "Yes. Slashing, smart contract exploits, and peg discounts are among the risks. This page is a risk overview, not a safety guarantee.",
          "Да. Slashing, эксплойты и дисконты пега — среди рисков. Страница — risk overview, а не гарантия безопасности.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "pendle-vs-etherfi"), label: L("Pendle vs EtherFi comparison", "Сравнение Pendle vs EtherFi"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-eth-restaking"), label: L("Best ETH restaking comparison", "Сравнение лучшего ETH restaking"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-liquid-staking"), label: L("Best liquid staking comparison", "Сравнение лучшего liquid staking"), type: "compare" },
      { href: (lang) => protocolHref(lang, "etherfi"), label: L("EtherFi protocol hub", "Хаб протокола EtherFi"), type: "protocols" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
      { href: (lang) => learnHref(lang, "what-is-liquid-restaking"), label: L("What is liquid restaking?", "Что такое liquid restaking?"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-etherfi-safe"), label: L("Is EtherFi safe?", "Безопасен ли EtherFi?"), type: "safety" },
      { href: reviewsHubHref, label: L("Reviews hub", "Хаб обзоров"), type: "reviews" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-restaking"),
    keywords: ["etherfi review", "eeth", "liquid restaking", "eth restaking", "etherfi risks"],
  },
  {
    slug: "ethena-review",
    type: "review",
    hubSegment: "reviews",
    metaTitle: L(
      "Ethena Protocol Review — USDe Synthetic Dollar Overview | TJT",
      "Обзор протокола Ethena — синтетический доллар USDe | TJT",
    ),
    metaDescription: L(
      "Educational Ethena protocol overview: USDe synthetic dollar, delta-neutral hedging, funding-rate yield, use cases, risks, and TJT Compare links.",
      "Образовательный обзор Ethena: синтетический доллар USDe, delta-neutral хеджирование, yield от funding rates, сценарии, риски и ссылки TJT Compare.",
    ),
    h1: L("Ethena Protocol Review", "Обзор протокола Ethena"),
    eyebrow: L("Protocol overview", "Обзор протокола"),
    intro: L(
      "Ethena is a synthetic-dollar protocol issuing USDe backed by delta-neutral hedging strategies. Yield comes from funding rates and staking components — distinct from traditional lending markets. Educational information only — not financial advice.",
      "Ethena — протокол синтетического доллара, выпускающий USDe под delta-neutral хеджирование. Доходность от funding rates и staking-компонентов — отличная от классического lending. Только образовательная информация, не финансовый совет.",
    ),
    sections: [
      {
        key: "overview",
        title: L("Protocol overview", "Обзор протокола"),
        body: L(
          "Ethena mints USDe by combining spot crypto collateral with short perpetual hedges to maintain a delta-neutral position. Holders can earn yield from funding rates paid by perpetual traders plus staking components on collateral.\n\nFrom a TJT perspective, Ethena sits in the synthetic-dollar / vault category. Hedging dependency, funding-rate variability, and younger protocol age are elevated Trust Score risk context factors.\n\nUSDe is not a fiat-backed stablecoin — stability depends on hedging infrastructure and market conditions.",
          "Ethena минтит USDe, сочетая spot-залог с short perpetual хеджами для delta-neutral позиции. Держатели получают yield от funding rates, платимых трейдерами perpetual, плюс staking на залоге.\n\nВ контексте TJT Ethena — synthetic-dollar / vault. Зависимость от хеджирования, волатильность funding rates и молодой возраст — повышенные факторы risk context в Trust Score.\n\nUSDe не fiat-backed стейблкоин — стабильность зависит от хеджирующей инфраструктуры и рынка.",
        ),
      },
      {
        key: "how_it_works",
        title: L("How it works", "Как это работает"),
        body: L(
          "Users deposit approved collateral (typically ETH or liquid staking tokens) and receive USDe.\n\nThe protocol maintains delta-neutral exposure via short perpetual positions on centralized exchanges, aiming to keep USDe near $1.\n\nYield accrues to sUSDe (staked USDe) holders from funding rate income and staking rewards on underlying collateral.",
          "Пользователи вносят одобренный залог (обычно ETH или LST) и получают USDe.\n\nПротокол поддерживает delta-neutral экспозицию через short perpetual на CEX, стремясь удержать USDe около $1.\n\nYield начисляется держателям sUSDe от funding rates и staking rewards на залоге.",
        ),
      },
      {
        key: "use_cases",
        title: L("Main use cases", "Основные сценарии"),
        body: L(
          "Synthetic dollar holding: Users seeking a dollar-denominated token with on-chain yield beyond traditional stablecoin lending.\n\nDeFi collateral: USDe and sUSDe integrate as collateral in lending and yield protocols.\n\nFunding-rate yield research: Comparing Ethena yield against Aave, Spark, or Morpho stablecoin supply routes.",
          "Держание synthetic dollar: пользователи ищут долларовый токен с on-chain yield сверх классического stablecoin lending.\n\nЗалог DeFi: USDe и sUSDe интегрируются как залог в lending и yield-протоколах.\n\nИсследование funding-rate yield: сравнение yield Ethena с supply стейблкоинов в Aave, Spark или Morpho.",
        ),
      },
      {
        key: "benefits",
        title: L("Benefits", "Преимущества"),
        body: L(
          "Yield sourced from funding rates can exceed traditional stablecoin lending APY during favorable market conditions.\n\nOn-chain composability for USDe and sUSDe across DeFi integrations.\n\nTransparent reserve and hedging disclosures in protocol documentation support research.",
          "Yield от funding rates может превышать классический stablecoin lending APY в благоприятных условиях.\n\nOn-chain композируемость USDe и sUSDe в DeFi-интеграциях.\n\nПрозрачные раскрытия резервов и хеджирования в документации поддерживают исследование.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Hedging dependency: USDe stability relies on perpetual hedging and custodial exchange infrastructure.\n\nFunding-rate risk: Yield compresses or turns negative during adverse market conditions.\n\nDepeg risk: Hedging failures or exchange disruptions can impair USDe peg stability.\n\nSmart contract and custody risk: Collateral management and hedging operations introduce operational attack surfaces.",
          "Зависимость от хеджирования: стабильность USDe опирается на perpetual хеджи и кастодиальную биржевую инфраструктуру.\n\nРиск funding rates: yield сжимается или становится отрицательным в неблагоприятных условиях.\n\nРиск depeg: сбои хеджирования или бирж вредят пегу USDe.\n\nРиск смарт-контрактов и кастоди: управление залогом и хеджирование добавляют операционные attack surface.",
        ),
      },
      {
        key: "alternatives",
        title: L("Alternatives", "Альтернативы"),
        body: L(
          "Traditional stablecoin supply on Aave, Spark, or Morpho offers variable APY without synthetic-dollar hedging complexity.\n\nFiat-backed stablecoins (USDC, USDT) carry different issuer and regulatory risk profiles.\n\nTJT best USDT and USDC yield Compare pages help evaluate lending routes alongside Ethena with Trust Score context.",
          "Классический supply стейблкоинов в Aave, Spark или Morpho даёт переменный APY без сложности synthetic-dollar хеджирования.\n\nFiat-backed стейблкоины (USDC, USDT) несут другие риски эмитента и регулирования.\n\nTJT best USDT и USDC yield Compare оценивает lending-маршруты рядом с Ethena через Trust Score.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDT and USDC yield comparisons aggregate stablecoin lending routes for contrast with funding-rate-based USDe yield.\n\nUSDC yield risks learn guide adds structured risk context for stablecoin research.",
          "Best USDT и USDC yield агрегируют stablecoin lending для контраста с funding-rate yield USDe.\n\nLearn-гид USDC yield risks добавляет структурированный risk context для исследования стейблкоинов.",
        ),
      },
    ],
    faq: [
      {
        question: L("What is USDe?", "Что такое USDe?"),
        answer: L(
          "USDe is Ethena's synthetic dollar token, backed by delta-neutral hedging of crypto collateral rather than fiat reserves.",
          "USDe — синтетический доллар Ethena, обеспеченный delta-neutral хеджированием крипто-залога, а не fiat-резервами.",
        ),
      },
      {
        question: L("Is USDe the same as USDC?", "USDe — то же, что USDC?"),
        answer: L(
          "No. USDC is fiat-backed by Circle; USDe uses hedging strategies with distinct stability, custody, and yield mechanics.",
          "Нет. USDC fiat-backed от Circle; USDe использует хеджирование с другой стабильностью, кастодией и механикой yield.",
        ),
      },
      {
        question: L("Can USDe depeg?", "Может ли USDe потерять пег?"),
        answer: L(
          "Yes. Hedging failures, funding stress, or exchange disruptions can impair peg stability. Research reserve transparency and risk disclosures independently.",
          "Да. Сбои хеджирования, стресс funding или бирж могут ухудшить пег. Изучайте прозрачность резервов и раскрытия рисков самостоятельно.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-usdt-yield"), label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => protocolHref(lang, "ethena"), label: L("Ethena protocol hub", "Хаб протокола Ethena"), type: "protocols" },
      { href: (lang) => earnHref(lang, "usdt"), label: L("USDT earn hub", "Earn-хаб USDT"), type: "earn" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: (lang) => learnHref(lang, "usdc-yield-risks"), label: L("USDC yield risks guide", "Гид по рискам USDC yield"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-ethena-safe"), label: L("Is Ethena safe?", "Безопасна ли Ethena?"), type: "safety" },
      { href: reviewsHubHref, label: L("Reviews hub", "Хаб обзоров"), type: "reviews" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdc-yield"),
    keywords: ["ethena review", "usde", "synthetic dollar", "ethena yield", "ethena risks"],
  },
];
