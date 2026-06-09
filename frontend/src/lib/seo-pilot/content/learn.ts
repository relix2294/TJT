import type { Locale } from "@/lib/i18n";
import { L, type SeoPilotPage } from "@/lib/seo-pilot/types";

function compareHref(lang: Locale, slug: string) {
  return `/${lang}/compare/${slug}`;
}

function earnHref(lang: Locale, asset: string) {
  return `/${lang}/earn/${asset}`;
}

function learnHref(lang: Locale, slug: string) {
  return `/${lang}/learn/${slug}`;
}

export const LEARN_PAGES: SeoPilotPage[] = [
  {
    slug: "what-is-defi-yield",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "What Is DeFi Yield? Educational Guide | TJT",
      "Что такое DeFi yield? Образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn what DeFi yield means, why it matters, common mistakes, examples across lending and staking, and risks. Educational information with Compare links on TJT.",
      "Узнайте, что такое DeFi yield, почему это важно, типичные ошибки, примеры lending и staking и риски. Образовательная информация со ссылками Compare на TJT.",
    ),
    h1: L("What Is DeFi Yield?", "Что такое DeFi yield?"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "DeFi yield is return generated from on-chain protocols — lending interest, staking rewards, liquidity fees, or incentive programs — minus costs and risks. It is not a bank deposit rate and carries no principal guarantee.",
      "DeFi yield — доход от on-chain протоколов: проценты lending, награды стейкинга, комиссии ликвидности или инсентивы — минус издержки и риски. Это не ставка банковского вклада и без гарантии principal.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "When you supply USDC to a lending pool, borrowers pay interest that flows to suppliers as variable APY. When you stake ETH through a liquid staking protocol, validator rewards accrue to your receipt token.\n\nYield sources differ: organic borrow demand, inflationary staking emissions, trading fees, or token incentives. Each source has distinct sustainability and risk characteristics.\n\nTJT organizes yield opportunities by asset, protocol, and chain so researchers can compare opportunities with market context instead of chasing headline numbers alone.",
          "Когда вы вносите USDC в lending pool, заёмщики платят проценты поставщикам как переменный APY. При стейкинге ETH через liquid staking награды валидаторов начисляются на receipt-токен.\n\nИсточники yield различаются: органический спрос на заём, inflationary emissions стейкинга, торговые комиссии или токен-инсентивы. У каждого источника своя устойчивость и риски.\n\nTJT организует возможности по активу, протоколу и сети, чтобы сравнивать opportunities с рыночным контекстом, а не только headline APY.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Understanding yield composition helps separate durable borrow demand from temporary incentive farming.\n\nRisk-adjusted comparison matters: higher APY often correlates with higher smart contract, liquidity, or peg risk.\n\nTax, accounting, and regulatory treatment of DeFi yield varies by jurisdiction — outside TJT scope but part of real-world planning.",
          "Понимание состава yield отделяет устойчивый спрос на заём от временного incentive farming.\n\nСравнение с учётом риска важно: более высокий APY часто коррелирует с большим риском контрактов, ликвидности или пега.\n\nНалоги и регулирование DeFi yield зависят от юрисдикции — вне scope TJT, но часть реального планирования.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Chasing peak APY without reading utilization, TVL depth, or withdrawal conditions.\n\nIgnoring composability risk when looping receipt tokens through multiple protocols.\n\nTreating audit badges as elimination of all smart contract risk.\n\nConfusing promotional CPA landing pages with neutral educational information.",
          "Погоня за пиковым APY без чтения utilization, TVL и условий вывода.\n\nИгнорирование composability risk при loop receipt-токенов через несколько протоколов.\n\nВосприятие аудитов как устранения всех рисков смарт-контрактов.\n\nПутаница промо CPA-лендингов с нейтральной образовательной информацией.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "Stablecoin supply on Aave V3 Arbitrum: variable APY from borrow utilization on USDC pools.\n\nLiquid staking via Lido stETH: validator rewards reflected in rebasing balances.\n\nSolana jitoSOL: exchange-rate appreciation from staking plus MEV tips.\n\nEach example maps to TJT protocol reviews, earn hubs, and Compare tables for structured research.",
          "Поставка стейблкоинов в Aave V3 Arbitrum: переменный APY от utilization USDC.\n\nLiquid staking Lido stETH: награды валидаторов в rebasing балансе.\n\nSolana jitoSOL: рост exchange rate от staking и MEV.\n\nКаждый пример связан с обзорами протоколов, earn-хабами и Compare на TJT.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Smart contract exploits, oracle failures, and governance errors can impair funds.\n\nLiquidity crunches delay withdrawals or force discounted exits on secondary markets.\n\nToken incentive yields may collapse when emissions end.\n\nMarket risk affects collateralized strategies and pegged assets simultaneously.",
          "Эксплойты, сбои оракулов и ошибки governance могут ухудшить средства.\n\nКризисы ликвидности задерживают вывод или вынуждают к дисконтному выходу.\n\nIncentive yield может обрушиться при окончании эмиссии.\n\nРыночный риск затрагивает залоговые стратегии и пеговые активы одновременно.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Explore crypto yield risks for a dedicated risk overview, liquid staking guide for ETH/SOL receipt tokens, and USDT comparison guide for stablecoin research.\n\nUse Compare opportunities pages to align yield types with Trust Score indicators.",
          "Изучите crypto yield risks для risk overview, гид по liquid staking для ETH/SOL receipt-токенов и гид сравнения USDT для стейблкоинов.\n\nИспользуйте Compare opportunities с индикаторами Trust Score.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is DeFi yield guaranteed?", "Гарантирован ли DeFi yield?"),
        answer: L(
          "No. Rates fluctuate and principal can be impaired by protocol or market events.",
          "Нет. Ставки меняются, principal может пострадать от событий протокола или рынка.",
        ),
      },
      {
        question: L("How is APY different from APR?", "Чем APY отличается от APR?"),
        answer: L(
          "APY includes compounding effects; APR is simple annual rate. DeFi interfaces may use either — verify assumptions.",
          "APY включает компаундинг; APR — простая годовая ставка. Интерфейсы DeFi могут использовать любой — проверяйте допущения.",
        ),
      },
      {
        question: L("Where should I start on TJT?", "С чего начать на TJT?"),
        answer: L(
          "Pick an asset earn hub (USDT, ETH, SOL), read protocol reviews, then Compare opportunities for side-by-side market context.",
          "Выберите earn-хаб актива, прочитайте обзоры протоколов, затем Compare opportunities для сравнительного контекста.",
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
        href: (lang) => earnHref(lang, "usdt"),
        label: L("USDT earn hub", "Earn-хаб USDT"),
        type: "earn",
      },
      {
        href: (lang) => learnHref(lang, "crypto-yield-risks"),
        label: L("Crypto yield risks", "Риски crypto yield"),
        type: "learn",
      },
      {
        href: (lang) => learnHref(lang, "what-is-liquid-staking"),
        label: L("What is liquid staking?", "Что такое liquid staking?"),
        type: "learn",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdt-yield"),
    keywords: ["defi yield", "what is defi yield", "crypto yield explained", "defi apy"],
  },
  {
    slug: "what-is-liquid-staking",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "What Is Liquid Staking? Educational Guide | TJT",
      "Что такое liquid staking? Образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn how liquid staking works, why it matters, rebasing vs exchange-rate tokens, examples (stETH, jitoSOL), risks, and TJT Compare links.",
      "Как работает liquid staking, зачем он нужен, rebasing vs exchange-rate токены, примеры stETH и jitoSOL, риски и ссылки TJT Compare.",
    ),
    h1: L("What Is Liquid Staking?", "Что такое liquid staking?"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "Liquid staking lets users deposit a native stake asset (ETH, SOL) and receive a transferable receipt token while validators earn network rewards. The model unlocks composability but introduces peg, slashing, and liquidity risks.",
      "Liquid staking позволяет внести нативный stake-актив (ETH, SOL) и получить передаваемый receipt-токен, пока валидаторы зарабатывают сетевые награды. Модель открывает композируемость, но добавляет риски пега, slashing и ликвидности.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "Traditional staking locks assets for unbonding periods. Liquid staking protocols pool deposits, operate validators, and mint receipt tokens representing a share of the pool.\n\nReceipt tokens trade on markets and integrate with DeFi — users can lend, swap, or collateralize them while underlying stake continues.\n\nRewards accrue either via rebasing balances (stETH) or increasing exchange rate (jitoSOL).",
          "Классический стейкинг блокирует активы на unbonding. Liquid staking пулы депозиты, управляют валидаторами и минтят receipt-токены как долю пула.\n\nReceipt-токены торгуются и интегрируются в DeFi — можно занимать, менять или залоговать их, пока stake продолжается.\n\nНаграды начисляются через rebasing (stETH) или рост exchange rate (jitoSOL).",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Capital efficiency: staking yield plus DeFi utility on the same exposure.\n\nLower minimums versus solo validator requirements (32 ETH on Ethereum).\n\nMarket context: LST depth affects how safely you can exit during volatility.\n\nComparison research: liquid staking competes with lending and native stake — TJT Compare pages help evaluate trade-offs.",
          "Эффективность капитала: staking yield плюс DeFi utility на той же экспозиции.\n\nНиже минимумы против solo validator (32 ETH на Ethereum).\n\nРыночный контекст: глубина LST влияет на безопасность выхода в волатильности.\n\nСравнительные исследования: liquid staking конкурирует с lending и native stake — TJT Compare помогает оценить компромиссы.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Assuming receipt tokens always trade 1:1 with native assets.\n\nIgnoring withdrawal queues and relying solely on instant DEX exits.\n\nStacking LST leverage in lending without monitoring liquidation thresholds.\n\nComparing LST APY across chains without adjusting for MEV, fees, and slashing history.",
          "Предположение, что receipt-токены всегда 1:1 с нативным активом.\n\nИгнорирование очередей вывода и расчёт только на мгновенный DEX-выход.\n\nНакопление плеча на LST в lending без мониторинга ликвидации.\n\nСравнение APY LST между сетями без учёта MEV, комиссий и slashing.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "Lido stETH on Ethereum — rebasing LST with deep DeFi integrations.\n\nJito jitoSOL on Solana — exchange-rate LST with MEV-boosted rewards.\n\nRocket Pool rETH — decentralized operator set with different governance dynamics.\n\nTJT hosts protocol reviews and best ETH/SOL staking Compare pages for each ecosystem.",
          "Lido stETH на Ethereum — rebasing LST с глубокими DeFi-интеграциями.\n\nJito jitoSOL на Solana — exchange-rate LST с MEV-boosted наградами.\n\nRocket Pool rETH — децентрализованный набор операторов.\n\nTJT содержит обзоры протоколов и Compare best ETH/SOL staking для каждой экосистемы.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Slashing and operator underperformance reduce pool returns.\n\nPeg discounts on secondary markets during liquidity stress.\n\nSmart contract risk in stake pool and withdrawal contracts.\n\nGovernance changes to fees or operator sets affecting long-term yield.",
          "Slashing и слабые операторы снижают доход пула.\n\nДисконты пега на вторичных рынках в стрессе ликвидности.\n\nРиск смарт-контрактов stake pool и withdrawal.\n\nИзменения governance комиссий и операторов влияют на долгосрочный yield.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Read Lido and Jito protocol reviews, safety pages (is-lido-safe, is-jito-safe), and best ETH/SOL staking comparisons.\n\nPair with what-is-defi-yield and crypto-yield-risks for complete educational context.",
          "Читайте обзоры Lido и Jito, safety-страницы и best ETH/SOL staking.\n\nСочетайте с what-is-defi-yield и crypto-yield-risks для полного образовательного контекста.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is liquid staking the same as staking ETFs?", "Liquid staking то же, что staking ETF?"),
        answer: L(
          "No. LSTs are on-chain receipt tokens with DeFi composability; ETFs are securities with brokerage custody — different risk models.",
          "Нет. LST — on-chain receipt с DeFi-композируемостью; ETF — ценные бумаги с брокерской кастодией — разные модели риска.",
        ),
      },
      {
        question: L("rebasing vs exchange-rate LST?", "rebasing vs exchange-rate LST?"),
        answer: L(
          "Rebasing increases wallet token quantity; exchange-rate models increase SOL/ETH per token. Tax and UI treatment differ — consult qualified professionals for tax questions.",
          "Rebasing увеличивает количество токенов в кошельке; exchange-rate — SOL/ETH на токен. Налоговый и UI учёт различается — консультируйтесь со специалистами по налогам.",
        ),
      },
      {
        question: L("How does TJT compare liquid staking options?", "Как TJT сравнивает liquid staking?"),
        answer: L(
          "Compare opportunities pages show APY, TVL context, chain, and Trust Score v0.1 indicators side by side as educational information.",
          "Страницы Compare opportunities показывают APY, TVL, сеть и Trust Score v0.1 как образовательную информацию.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => compareHref(lang, "best-eth-staking"),
        label: L("Best ETH staking comparison", "Сравнение лучшего ETH staking"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "best-sol-staking"),
        label: L("Best SOL staking comparison", "Сравнение лучшего SOL staking"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "lido-vs-jito"),
        label: L("Lido vs Jito comparison", "Сравнение Lido vs Jito"),
        type: "compare",
      },
      {
        href: (lang) => earnHref(lang, "eth"),
        label: L("ETH earn hub", "Earn-хаб ETH"),
        type: "earn",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-staking"),
    keywords: ["liquid staking", "steth", "jitosol", "lst explained"],
  },
  {
    slug: "crypto-yield-risks",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "Crypto Yield Risks — Educational Risk Overview | TJT",
      "Риски crypto yield — образовательный обзор | TJT",
    ),
    metaDescription: L(
      "Understand smart contract, liquidity, protocol, market, and operational risks in crypto yield strategies. Educational information with Compare and safety page links.",
      "Поймите риски смарт-контрактов, ликвидности, протокола, рынка и операций в crypto yield. Образовательная информация со ссылками на Compare и safety.",
    ),
    h1: L("Crypto Yield Risks", "Риски crypto yield"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Every yield route — lending, staking, liquidity provision, or incentives — bundles multiple risk layers. This guide explains common risk categories so you can compare opportunities with clearer market context.",
      "Каждый маршрут yield — lending, staking, LP или инсентивы — несёт несколько слоёв риска. Гид объясняет категории рисков для сравнения opportunities с более ясным рыночным контекстом.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "Yield is compensation for taking risk. Higher displayed APY often signals higher exposure to smart contract bugs, liquidity stress, peg instability, or governance failure.\n\nRisks compound when strategies nest protocols — for example, staking to an LST, depositing it in lending, and borrowing stablecoins to loop again.\n\nTJT Trust Score v0.1 summarizes informational factors; it does not remove the need for independent verification.",
          "Yield — компенсация за риск. Более высокий APY часто сигнализирует о большей экспозиции к багам, стрессу ликвидности, нестабильности пега или сбою governance.\n\nРиски накапливаются при вложенности протоколов — stake в LST, депозит в lending, заём стейблкоинов для loop.\n\nTJT Trust Score v0.1 суммирует информационные факторы; он не заменяет самостоятельную проверку.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Risk literacy prevents mistaking promotional APY for durable income.\n\nPortfolio construction improves when you map correlated exposures (ETH price, stablecoin depeg, Solana liveness).\n\nRegulatory and tax outcomes may depend on how risks materialize — another reason to treat yield as research, not certainty.",
          "Грамотность по рискам предотвращает путаницу промо APY с устойчивым доходом.\n\nКонструирование портфеля улучшается при карте коррелированных экспозиций (цена ETH, depeg стейблкоина, liveness Solana).\n\nРегуляторные и налоговые исходы зависят от материализации рисков — ещё одна причина рассматривать yield как исследование.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Single-factor decisions based only on APY rank.\n\nUnderestimating withdrawal friction during market crashes.\n\nTrusting unaudited forks or phishing interfaces mimicking known protocols.\n\nIgnoring chain-specific risks (bridge wrappers, oracle differences across L2s).",
          "Решения только по рангу APY.\n\nНедооценка трения вывода в крашах рынка.\n\nДоверие неаудированным форкам или фишинговым интерфейсам.\n\nИгнорирование рисков сети (bridge wrappers, различия оракулов на L2).",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "High utilization on Aave stablecoin pools → withdrawal delays (liquidity risk).\n\nstETH discount during market stress → impaired exit value (peg + market risk).\n\nSolana outage → frozen DeFi actions including jitoSOL swaps (network risk).\n\nEnded token emissions on a farm → APY collapse (incentive risk).",
          "Высокий utilization в Aave → задержки вывода (ликвидность).\n\nДисконт stETH в стрессе → ухудшенный выход (пег + рынок).\n\nOutage Solana → заморозка DeFi включая swap jitoSOL (сеть).\n\nОкончание эмиссии на фарме → обвал APY (инсентивы).",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Smart contract risk: code vulnerabilities and upgrade paths.\n\nLiquidity risk: inability to exit at fair value promptly.\n\nProtocol risk: governance, oracle, and parameter misconfiguration.\n\nMarket risk: asset price moves, correlation shocks, depegs.\n\nOperational risk: user error, key management, phishing.",
          "Риск смарт-контрактов: уязвимости и апгрейды.\n\nРиск ликвидности: невозможность выйти по справедливой цене быстро.\n\nПротокольный риск: governance, оракулы, параметры.\n\nРыночный риск: движение цен, корреляционные шоки, depeg.\n\nОперационный риск: ошибки пользователя, ключи, фишинг.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Protocol safety pages for Aave, Lido, and Jito provide focused risk overviews.\n\nCompare opportunities and earn guides help apply this framework to USDT, ETH, and SOL research on TJT.",
          "Safety-страницы Aave, Lido и Jito дают фокусный risk overview.\n\nCompare opportunities и earn-гиды помогают применить framework к USDT, ETH и SOL на TJT.",
        ),
      },
    ],
    faq: [
      {
        question: L("Can diversification remove DeFi risk?", "Устраняет ли диверсификация риск DeFi?"),
        answer: L(
          "Diversification spreads exposure but does not eliminate systemic events affecting multiple protocols or assets simultaneously.",
          "Диверсификация распределяет экспозицию, но не устраняет системные события, затрагивающие несколько протоколов или активов.",
        ),
      },
      {
        question: L("What is the biggest yield risk for beginners?", "Главный риск yield для новичков?"),
        answer: L(
          "Operational risk — interacting with wrong contracts or unmanaged wallet security — plus misunderstanding liquidity constraints.",
          "Операционный риск — взаимодействие с неверными контрактами и слабая безопасность кошелька — плюс непонимание ограничений ликвидности.",
        ),
      },
      {
        question: L("Does TJT rank risks for me?", "Ранжирует ли TJT риски за меня?"),
        answer: L(
          "TJT publishes educational information and Compare tables. You remain responsible for independent verification.",
          "TJT публикует образовательную информацию и таблицы Compare. Вы отвечаете за самостоятельную проверку.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => `/${lang}/safety/is-aave-safe`,
        label: L("Is Aave safe?", "Безопасен ли Aave?"),
        type: "safety",
      },
      {
        href: (lang) => `/${lang}/safety/is-lido-safe`,
        label: L("Is Lido safe?", "Безопасен ли Lido?"),
        type: "safety",
      },
      {
        href: (lang) => compareHref(lang, "aave-vs-lido"),
        label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"),
        type: "compare",
      },
      {
        href: (lang) => learnHref(lang, "what-is-defi-yield"),
        label: L("What is DeFi yield?", "Что такое DeFi yield?"),
        type: "learn",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdt-yield"),
    keywords: ["crypto yield risks", "defi risks", "yield farming risks", "defi safety"],
  },
];
