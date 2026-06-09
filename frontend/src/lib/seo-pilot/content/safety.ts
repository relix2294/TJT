import type { Locale } from "@/lib/i18n";
import { L, type SeoPilotPage } from "@/lib/seo-pilot/types";

function compareHref(lang: Locale, slug: string) {
  return `/${lang}/compare/${slug}`;
}

function protocolHref(lang: Locale, slug: string) {
  return `/${lang}/protocols/${slug}`;
}

function reviewHref(lang: Locale, slug: string) {
  return `/${lang}/reviews/${slug}`;
}

function safetyHref(lang: Locale, slug: string) {
  return `/${lang}/safety/${slug}`;
}

export const SAFETY_PAGES: SeoPilotPage[] = [
  {
    slug: "is-aave-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Aave Safe? Smart Contract & Liquidity Risk Overview | TJT",
      "Безопасен ли Aave? Обзор рисков смарт-контрактов и ликвидности | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Aave: what affects protocol safety, smart contract, liquidity, governance, and market risks. Independent verification checklist — not a safety guarantee.",
      "Образовательный обзор безопасности Aave: факторы риска, смарт-контракты, ликвидность, governance и рынок. Чеклист самостоятельной проверки — не гарантия безопасности.",
    ),
    h1: L("Is Aave Safe?", "Безопасен ли Aave?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Aave is a mature, widely used lending protocol with extensive audits and deep TVL, but no DeFi deployment is risk-free. Safety depends on smart contracts, liquidity conditions, oracle integrity, governance decisions, and your own position structure. This page provides educational information — not a certification of safety.",
      "Краткий ответ: Aave — зрелый широко используемый lending-протокол с аудитами и глубоким TVL, но ни одно DeFi-развёртывание не безрисково. Безопасность зависит от смарт-контрактов, ликвидности, оракулов, governance и структуры вашей позиции. Страница даёт образовательную информацию, а не сертификат безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Protocol safety is multidimensional. Code quality and audit coverage address exploit risk but cannot eliminate unknown vulnerabilities.\n\nTVL depth and utilization patterns affect whether suppliers can exit promptly. Governance quality influences how quickly risky assets are isolated or parameters adjusted.\n\nUser behavior matters: collateral ratios, chain selection, and composability with other protocols layer additional exposures beyond the core Aave contracts.",
          "Безопасность протокола многомерна. Качество кода и аудиты снижают риск эксплойтов, но не устраняют неизвестные уязвимости.\n\nTVL и utilization влияют на скорость вывода поставщиков. Governance определяет изоляцию рискованных активов и корректировку параметров.\n\nПоведение пользователя важно: залог, выбор сети и композируемость с другими протоколами добавляют экспозицию поверх core-контрактов Aave.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Aave V2 and V3 contracts have been audited by multiple firms. Bug bounty programs incentivize responsible disclosure.\n\nHistorical DeFi exploits elsewhere demonstrate that composability and upgrade paths can introduce regressions. Cross-chain deployments use bridge adapters with their own attack surfaces.\n\nUsers should confirm they interact with official contract addresses listed in Aave documentation, not phishing frontends.",
          "Контракты Aave V2 и V3 аудированы несколькими фирмами. Bug bounty стимулирует ответственное раскрытие.\n\nЭксплойты в других DeFi показывают, что композируемость и апгрейды могут вносить регрессии. Кросс-чейн развёртывания используют мосты со своими attack surface.\n\nПодтверждайте официальные адреса контрактов в документации Aave, а не фишинговые фронтенды.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "When pool utilization approaches 100%, new withdrawals may queue until borrowers repay or suppliers add liquidity.\n\nStablecoin pools during market stress can experience rapid utilization spikes as borrowers draw defensive liquidity.\n\naToken integrations in external protocols may lock liquidity indirectly — exiting Aave exposure may require unwinding nested positions first.",
          "При utilization близком к 100% вывод может ждать погашений заёмщиков или новых депозитов.\n\nСтейблкоин-пулы в стрессе рынка видят скачки utilization при оборонительном заимствовании.\n\nИнтеграции aToken в других протоколах косвенно блокируют ликвидность — выход может требовать размотки вложенных позиций.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Governance can list new assets, adjust collateral factors, or pause markets. Parameter errors or delayed responses to incidents can harm suppliers.\n\nIsolation mode and e-mode reduce contagion but require correct configuration per asset.\n\nDependency on external oracle providers ties protocol safety to third-party infrastructure uptime and accuracy.",
          "Governance листит активы, меняет collateral factors или останавливает рынки. Ошибки параметров или задержки реакции на инциденты вредят поставщикам.\n\nIsolation mode и e-mode снижают заражение при корректной конфигурации.\n\nЗависимость от оракулов связывает безопасность с uptime и точностью сторонней инфраструктуры.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "Variable APY compresses when borrow demand falls — suppliers face income volatility, not principal guarantees.\n\nCorrelated asset crashes can trigger cascading liquidations across DeFi, temporarily stressing Aave pools.\n\nRegulatory developments affecting stablecoins or wrapped assets may impact listed markets independently of Aave code security.",
          "Переменный APY сжимается при падении спроса на заём — поставщики сталкиваются с волатильностью дохода, не с гарантией principal.\n\nКоррелированные обвалы активов вызывают каскадные ликвидации в DeFi, временно нагружая пулы Aave.\n\nРегуляторные изменения по стейблкоинам влияют на рынки независимо от безопасности кода Aave.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Confirm contract addresses and market parameters on the official Aave app for your chosen chain.\n\nReview current utilization, supply cap, and oracle sources for the asset you plan to supply.\n\nRead the latest audit reports and any active governance proposals affecting your market.\n\nCross-check TJT Trust Score v0.1 indicators and Compare tables as educational context — then validate on-chain.",
          "Подтвердите адреса контрактов и параметры рынка в официальном приложении Aave для выбранной сети.\n\nИзучите utilization, supply cap и источники оракулов для актива.\n\nПрочитайте актуальные аудиты и governance-предложения по вашему рынку.\n\nСверьте Trust Score v0.1 и таблицы Compare на TJT как образовательный контекст — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Compare Aave with Lido and Jito to understand how lending safety differs from liquid staking risk profiles.\n\nBest USDT yield comparison adds market context for stablecoin suppliers evaluating Aave routes.",
          "Сравните Aave с Lido и Jito, чтобы понять различия рисков lending и liquid staking.\n\nBest USDT yield добавляет рыночный контекст для поставщиков стейблкоинов.",
        ),
      },
    ],
    faq: [
      {
        question: L("Has Aave been hacked?", "Был ли взломан Aave?"),
        answer: L(
          "Aave has faced attempted exploits and ecosystem stress events; research historical incident reports for specifics. Past survival does not guarantee future resilience.",
          "Aave сталкивался с попытками эксплойтов и стрессом экосистемы; изучайте отчёты об инцидентах. Прошлое выживание не гарантирует будущую устойчивость.",
        ),
      },
      {
        question: L("Is supplying stablecoins on Aave lower risk than borrowing?", "Поставка стейблкоинов на Aave менее рискованна, чем заём?"),
        answer: L(
          "Supply and borrow carry different risk vectors. Suppliers face smart contract and liquidity risk; borrowers add liquidation and rate risk. Neither is risk-free.",
          "Supply и borrow имеют разные векторы риска. Поставщики — смарт-контракты и ликвидность; заёмщики — ликвидация и ставки. Ничто не безрисково.",
        ),
      },
      {
        question: L("Does TJT certify Aave as safe?", "Сертифицирует ли TJT Aave как безопасный?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и индикаторы Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => compareHref(lang, "aave-vs-lido"),
        label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"),
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
        href: (lang) => reviewHref(lang, "aave-review"),
        label: L("Aave protocol review", "Обзор протокола Aave"),
        type: "reviews",
      },
      {
        href: (lang) => safetyHref(lang, "is-lido-safe"),
        label: L("Is Lido safe?", "Безопасен ли Lido?"),
        type: "safety",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "aave-vs-lido"),
    keywords: ["is aave safe", "aave risks", "aave security", "defi lending safety"],
  },
  {
    slug: "is-lido-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Lido Safe? Liquid Staking Risk Overview | TJT",
      "Безопасен ли Lido? Обзор рисков liquid staking | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Lido liquid staking: slashing, peg, governance, smart contract, and market risks. What to verify before using stETH.",
      "Образовательный обзор безопасности Lido: slashing, пег, governance, смарт-контракты и рыночные риски. Что проверить перед использованием stETH.",
    ),
    h1: L("Is Lido Safe?", "Безопасен ли Lido?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Lido is the largest liquid staking protocol on Ethereum with years of operation and multiple audits, yet staking always carries slashing, peg, and governance risks. No liquid staking token eliminates market or smart contract exposure. This is educational information, not a safety rating.",
      "Краткий ответ: Lido — крупнейший протокол liquid staking на Ethereum с годами работы и аудитами, но стейкинг всегда несёт slashing, пег и governance-риски. Ни один LST не устраняет рыночную или контрактную экспозицию. Это образовательная информация, а не рейтинг безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Validator operator quality, slashing penalties, and withdrawal queue mechanics directly affect stETH holders.\n\nSecondary market liquidity determines how closely stETH tracks ETH during stress.\n\nEthereum consensus changes and Lido governance votes can alter fees, operators, or withdrawal policies.",
          "Качество операторов, slashing и механика очереди вывода напрямую влияют на держателей stETH.\n\nЛиквидность вторичного рынка определяет, насколько stETH следует за ETH в стрессе.\n\nИзменения консенсуса Ethereum и голосования Lido меняют комиссии, операторов и политику вывода.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Lido core contracts and withdrawal infrastructure have been audited. Upgradeable components require monitoring for governance-approved changes.\n\nIntegrations with DeFi protocols that accept stETH extend the blast radius of any contract bug in adjacent systems.\n\nUsers must verify they hold genuine stETH from official Lido contracts.",
          "Core-контракты и withdrawal-инфраструктура Lido аудированы. Апгрейдируемые компоненты требуют мониторинга governance-изменений.\n\nИнтеграции DeFi, принимающие stETH, расширяют радиус поражения багов в смежных системах.\n\nПроверяйте, что вы держите настоящий stETH с официальных контрактов Lido.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "Protocol withdrawal queues may delay ETH redemption during high exit demand.\n\nDEX pools for stETH/ETH can deplete during crashes, widening discounts.\n\nUsing stETH as collateral ties exit timing to lending market health and liquidation thresholds.",
          "Очереди вывода протокола могут задерживать redemption ETH при высоком спросе на выход.\n\nDEX-пулы stETH/ETH истощаются в крашах, расширяя дисконты.\n\nИспользование stETH как залога связывает выход со здоровьем lending и порогами ликвидации.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Operator set curation and socialized slashing rules define how losses propagate across the pool.\n\nLDO governance concentration may influence decisions affecting all stakers.\n\nRegulatory scrutiny of large staking pools is an evolving external factor.",
          "Курация операторов и правила социализированного slashing определяют распространение потерь по пулу.\n\nКонцентрация LDO governance влияет на решения для всех стейкеров.\n\nРегуляторное внимание к крупным пулам — развивающийся внешний фактор.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "stETH trades at variable premium or discount to ETH; arbitrageurs usually restore peg but not instantly.\n\nETH price volatility affects collateralized positions built on stETH.\n\nStaking reward rates change with validator yields and Lido fees — not fixed APY products.",
          "stETH торгуется с переменной премией или дисконтом к ETH; арбитражёры обычно восстанавливают пег, но не мгновенно.\n\nВолатильность ETH влияет на залоговые позиции на stETH.\n\nСтавки стейкинга меняются с yield валидаторов и комиссиями Lido.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Check operator performance dashboards and slashing history on Lido analytics tools.\n\nMonitor stETH/ETH pool depth on major DEXs before relying on instant exit.\n\nReview withdrawal queue estimates on official interfaces.\n\nUse TJT Compare and Trust Score as supplementary educational context.",
          "Проверьте дашборды операторов и историю slashing в аналитике Lido.\n\nМониторьте глубину пулов stETH/ETH на DEX перед расчётом на мгновенный выход.\n\nИзучите оценки очереди вывода в официальных интерфейсах.\n\nИспользуйте TJT Compare и Trust Score как дополнительный образовательный контекст.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best ETH staking and Lido vs Jito pages frame how liquid staking safety compares across ecosystems.\n\nAave vs Lido helps separate lending liquidity risk from validator slashing risk.",
          "Best ETH staking и Lido vs Jito показывают сравнение безопасности liquid staking между экосистемами.\n\nAave vs Lido разделяет риск ликвидности lending и slashing валидаторов.",
        ),
      },
    ],
    faq: [
      {
        question: L("Can stETH lose its peg permanently?", "Может ли stETH потерять пег навсегда?"),
        answer: L(
          "Extended discounts have occurred during past stress events. Recovery depends on arbitrage, withdrawal flows, and market confidence — not a protocol guarantee.",
          "Длительные дисконты случались в прошлых стрессах. Восстановление зависит от арбитража, выводов и доверия рынка — не от гарантии протокола.",
        ),
      },
      {
        question: L("What happens if a Lido validator is slashed?", "Что если валидатор Lido получит slashing?"),
        answer: L(
          "Penalties may be socialized across the pool, reducing rewards or principal for stETH holders. Review Lido documentation for current slashing policies.",
          "Штрафы могут социализироваться по пулу, снижая награды или principal для держателей stETH. Изучите актуальную политику slashing в документации Lido.",
        ),
      },
      {
        question: L("Is Lido safer than centralized staking?", "Безопаснее ли Lido централизованного стейкинга?"),
        answer: L(
          "They differ: Lido is non-custodial on-chain but introduces smart contract and peg risks; centralized options introduce counterparty and custody risks. Neither is objectively safer in all scenarios.",
          "Они различаются: Lido некастодиальный on-chain, но с рисками контрактов и пега; централизованные — контрагент и кастоди. Ни один не объективно безопаснее во всех сценариях.",
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
        href: (lang) => compareHref(lang, "lido-vs-jito"),
        label: L("Lido vs Jito comparison", "Сравнение Lido vs Jito"),
        type: "compare",
      },
      {
        href: (lang) => protocolHref(lang, "lido"),
        label: L("Lido protocol hub", "Хаб протокола Lido"),
        type: "protocols",
      },
      {
        href: (lang) => reviewHref(lang, "lido-review"),
        label: L("Lido protocol review", "Обзор протокола Lido"),
        type: "reviews",
      },
      {
        href: (lang) => safetyHref(lang, "is-aave-safe"),
        label: L("Is Aave safe?", "Безопасен ли Aave?"),
        type: "safety",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-staking"),
    keywords: ["is lido safe", "steth risks", "liquid staking safety", "lido slashing"],
  },
  {
    slug: "is-jito-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Jito Safe? Solana Staking Risk Overview | TJT",
      "Безопасен ли Jito? Обзор рисков стейкинга Solana | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Jito on Solana: MEV, validator, smart contract, liquidity, and network risks. Independent verification checklist.",
      "Образовательный обзор безопасности Jito на Solana: MEV, валидаторы, смарт-контракты, ликвидность и сетевые риски. Чеклист самостоятельной проверки.",
    ),
    h1: L("Is Jito Safe?", "Безопасен ли Jito?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Jito is a prominent Solana liquid staking protocol with audited contracts and MEV infrastructure, but Solana network stability, MEV variability, and jitoSOL liquidity conditions all affect practical safety. This page offers a risk overview — not an assurance of safety.",
      "Краткий ответ: Jito — заметный протокол liquid staking на Solana с аудированными контрактами и MEV-инфраструктурой, но стабильность сети Solana, волатильность MEV и ликвидность jitoSOL влияют на практическую безопасность. Страница — risk overview, а не заверение в безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Solana liveness and validator performance underpin any staking position.\n\nMEV tip flows are market-dependent and can decline in quiet periods.\n\njitoSOL secondary liquidity on DEXs determines exit options under volatility.",
          "Liveness Solana и производительность валидаторов — основа любой staking-позиции.\n\nПотоки MEV-чаевых зависят от рынка и падают в тихие периоды.\n\nВторичная ликвидность jitoSOL на DEX определяет варианты выхода в волатильности.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Jito stake pool programs have undergone security review. Solana program upgrades and dependencies on other on-chain programs create composability risk.\n\nPhishing sites and fake jitoSOL tokens are user-facing threats — verify mint addresses from official Jito sources.",
          "Программы stake pool Jito прошли security review. Апгрейды программ Solana и зависимости от других on-chain программ создают composability risk.\n\nФишинг и поддельные jitoSOL — угрозы для пользователей; проверяйте mint-адреса из официальных источников Jito.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "Native unstaking requires waiting through Solana cooldown epochs.\n\nSwap routes via Jupiter depend on pool depth; thin liquidity increases slippage during sell pressure.\n\nUsing jitoSOL in lending protocols may block simple exits until positions are closed.",
          "Native unstaking требует ожидания cooldown эпох Solana.\n\nSwap через Jupiter зависит от глубины пулов; тонкая ликвидность увеличивает slippage при давлении продаж.\n\njitoSOL в lending может блокировать простой выход до закрытия позиций.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "JTO governance influences fee splits, operator incentives, and treasury allocations.\n\nConcentration of stake with Jito-connected validators raises decentralization questions on Solana.\n\nChanges to MEV auction rules can alter reward distribution for stakers.",
          "Governance JTO влияет на fee splits, инсентивы операторов и казну.\n\nКонцентрация stake у валидаторов Jito поднимает вопросы децентрализации Solana.\n\nИзменения правил MEV-аукционов меняют распределение наград стейкерам.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "SOL price volatility affects both jitoSOL NAV and any collateralized strategies.\n\nMEV income correlates with on-chain trading activity — not stable over time.\n\nSolana ecosystem contagion during protocol failures can widen jitoSOL spreads temporarily.",
          "Волатильность SOL влияет на NAV jitoSOL и залоговые стратегии.\n\nДоход MEV коррелирует с on-chain активностью — нестабилен во времени.\n\nЗаражение экосистемы Solana при сбоях протоколов временно расширяет спреды jitoSOL.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Confirm jitoSOL mint address and stake pool IDs on Jito’s official documentation.\n\nReview validator performance and stake distribution dashboards.\n\nCheck Jupiter swap quotes for realistic exit slippage at your position size.\n\nCross-reference TJT best SOL staking Compare page for educational market context.",
          "Подтвердите mint jitoSOL и ID stake pool в официальной документации Jito.\n\nИзучите дашборды производительности валидаторов и распределения stake.\n\nПроверьте котировки Jupiter для реалистичного slippage при вашем размере позиции.\n\nСверьте TJT best SOL staking Compare для образовательного рыночного контекста.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best SOL staking aggregates Jito alongside alternatives with Trust Score context.\n\nAave vs Jito illustrates how EVM lending risks differ from Solana staking exposures.",
          "Best SOL staking агрегирует Jito с альтернативами и Trust Score.\n\nAave vs Jito показывает различие рисков EVM lending и стейкинга Solana.",
        ),
      },
    ],
    faq: [
      {
        question: L("Does MEV make Jito risk-free?", "Делает ли MEV Jito безрисковым?"),
        answer: L(
          "No. MEV adds reward variability and introduces dependence on block engine infrastructure. It does not remove slashing or smart contract risks.",
          "Нет. MEV добавляет волатильность наград и зависимость от block engine. Он не устраняет slashing или риски смарт-контрактов.",
        ),
      },
      {
        question: L("How does Solana network downtime affect Jito?", "Как downtime Solana влияет на Jito?"),
        answer: L(
          "Network halts pause deposits, withdrawals, and DeFi interactions until consensus resumes. Historical outages are documented — factor liveness risk into research.",
          "Остановки сети приостанавливают депозиты, выводы и DeFi до возобновления консенсуса. Исторические outages задокументированы — учитывайте liveness risk.",
        ),
      },
      {
        question: L("Can I trust TJT’s Jito APY display?", "Можно ли доверять APY Jito на TJT?"),
        answer: L(
          "TJT shows indicative catalog APY for comparison research. Always verify live staking and MEV yields on-chain and via official Jito interfaces.",
          "TJT показывает ориентировочный APY каталога для сравнения. Проверяйте live staking и MEV yields on-chain и в официальных интерфейсах Jito.",
        ),
      },
    ],
    relatedLinks: [
      {
        href: (lang) => compareHref(lang, "best-sol-staking"),
        label: L("Best SOL staking comparison", "Сравнение лучшего SOL staking"),
        type: "compare",
      },
      {
        href: (lang) => compareHref(lang, "aave-vs-jito"),
        label: L("Aave vs Jito comparison", "Сравнение Aave vs Jito"),
        type: "compare",
      },
      {
        href: (lang) => protocolHref(lang, "jito"),
        label: L("Jito protocol hub", "Хаб протокола Jito"),
        type: "protocols",
      },
      {
        href: (lang) => reviewHref(lang, "jito-review"),
        label: L("Jito protocol review", "Обзор протокола Jito"),
        type: "reviews",
      },
      {
        href: (lang) => safetyHref(lang, "is-lido-safe"),
        label: L("Is Lido safe?", "Безопасен ли Lido?"),
        type: "safety",
      },
    ],
    ctaHref: (lang) => compareHref(lang, "best-sol-staking"),
    keywords: ["is jito safe", "jitosol risks", "solana staking safety", "jito mev risk"],
  },
];
