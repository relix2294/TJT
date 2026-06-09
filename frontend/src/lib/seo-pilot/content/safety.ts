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

function learnHref(lang: Locale, slug: string) {
  return `/${lang}/learn/${slug}`;
}

function earnHref(lang: Locale, asset: string) {
  return `/${lang}/earn/${asset}`;
}

function safetyHubHref(lang: Locale) {
  return `/${lang}/safety`;
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
  {
    slug: "is-morpho-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Morpho Safe? Lending Optimizer Risk Overview | TJT",
      "Безопасен ли Morpho? Обзор рисков lending-optimizer | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Morpho: underlying-market risk, curator configuration, oracle dependencies, and TJT Trust Score context — not a safety guarantee.",
      "Образовательный обзор безопасности Morpho: риски базовых рынков, конфигурация кураторов, oracle и контекст TJT Trust Score — не гарантия безопасности.",
    ),
    h1: L("Is Morpho Safe?", "Безопасен ли Morpho?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Morpho is a widely adopted lending optimizer with documented audits and growing TVL, but no DeFi deployment is risk-free. Safety depends on underlying markets, curator parameters, oracle integrity, and your position structure. This page provides educational information — not a certification of safety.",
      "Краткий ответ: Morpho — широко принятый lending-optimizer с аудитами и растущим TVL, но ни одно DeFi-развёртывание не безрисково. Безопасность зависит от базовых рынков, параметров кураторов, oracle и структуры позиции. Страница даёт образовательную информацию, а не сертификат безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Morpho safety is layered: optimizer contracts, Morpho Blue market parameters, and underlying protocols like Aave or Compound each contribute risk.\n\nCurator quality affects oracle selection, loan-to-value ratios, and supply caps on isolated markets.\n\nUser composability with vault aggregators can add nested exposure beyond core Morpho contracts.",
          "Безопасность Morpho многослойна: контракты optimizer, параметры Morpho Blue и базовые протоколы вроде Aave или Compound вносят риск.\n\nКачество кураторов влияет на oracle, LTV и supply caps изолированных рынков.\n\nКомпозируемость с vault-агрегаторами добавляет вложенную экспозицию поверх core Morpho.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Morpho core and Morpho Blue contracts have undergone third-party audits. Bug bounty programs incentivize disclosure.\n\nUnderlying protocol upgrades or regressions can affect routed liquidity.\n\nUsers should confirm official contract addresses from Morpho documentation, not third-party frontends.",
          "Core Morpho и Morpho Blue прошли аудиты третьих сторон. Bug bounty стимулирует раскрытие.\n\nАпгрейды базовых протоколов влияют на маршрутизируемую ликвидность.\n\nПодтверждайте официальные адреса контрактов из документации Morpho.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "Matched P2P liquidity improves rates but unmatched portions rely on underlying market depth.\n\nIsolated Morpho Blue markets can experience high utilization, slowing supplier exits.\n\nVault share integrations in external protocols may require unwinding nested positions before exit.",
          "Matched P2P ликвидность улучшает ставки, но unmatched части зависят от глубины базовых рынков.\n\nИзолированные рынки Morpho Blue при высоком utilization замедляют вывод поставщиков.\n\nИнтеграции vault shares могут требовать размотки вложенных позиций.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Curators and governance can adjust market parameters, pause markets, or list new collateral types.\n\nOracle provider selection ties market safety to third-party price feed uptime and accuracy.\n\nMorpho Blue permissionless market creation increases the surface area for misconfigured markets.",
          "Кураторы и governance меняют параметры, останавливают рынки или листят новый залог.\n\nВыбор oracle связывает безопасность с uptime и точностью price feeds.\n\nPermissionless создание рынков Morpho Blue расширяет поверхность ошибок конфигурации.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "Variable supply APY compresses when borrow demand falls.\n\nCorrelated asset crashes can trigger liquidations across DeFi, stressing Morpho and underlying pools.\n\nIncentive programs can temporarily boost APY without changing structural risk.",
          "Переменный supply APY сжимается при падении спроса на заём.\n\nКоррелированные обвалы вызывают ликвидации в DeFi, нагружая Morpho и базовые пулы.\n\nIncentive-программы временно повышают APY без изменения структурного риска.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Confirm which Morpho market or vault you interact with and its underlying protocol dependencies.\n\nReview oracle sources, LTV parameters, and utilization for your chosen asset.\n\nCross-check TJT Trust Score v0.1 and Compare tables as educational context — then validate on-chain.",
          "Подтвердите, с каким рынком или vault Morpho вы взаимодействуете и какие базовые протоколы задействованы.\n\nИзучите oracle, LTV и utilization для выбранного актива.\n\nСверьте Trust Score v0.1 и Compare на TJT — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDC and USDT yield comparisons add market context for stablecoin suppliers evaluating Morpho routes.\n\nAave vs Lido contrasts lending with liquid staking for portfolio-level risk research.",
          "Best USDC и USDT yield добавляют контекст для поставщиков стейблкоинов, оценивающих Morpho.\n\nAave vs Lido сопоставляет lending и liquid staking для портфельного risk research.",
        ),
      },
    ],
    faq: [
      {
        question: L("Does Morpho inherit Aave or Compound risk?", "Наследует ли Morpho риски Aave или Compound?"),
        answer: L(
          "Yes, when liquidity routes through or depends on underlying markets. Optimizer layering does not eliminate base-protocol smart contract or liquidity risk.",
          "Да, когда ликвидность маршрутизируется через базовые рынки. Optimizer-слой не устраняет риски смарт-контрактов и ликвидности базового протокола.",
        ),
      },
      {
        question: L("Are Morpho Blue markets riskier than optimizer mode?", "Рискованнее ли рынки Morpho Blue, чем optimizer?"),
        answer: L(
          "Isolated markets can have different collateral, oracle, and curator risk than established underlying pools. Evaluate each market independently.",
          "Изолированные рынки могут иметь другой залог, oracle и риск куратора vs устоявшихся базовых пулов. Оценивайте каждый рынок отдельно.",
        ),
      },
      {
        question: L("Does TJT certify Morpho as safe?", "Сертифицирует ли TJT Morpho как безопасный?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdt-yield"), label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"), type: "compare" },
      { href: (lang) => protocolHref(lang, "morpho"), label: L("Morpho protocol hub", "Хаб протокола Morpho"), type: "protocols" },
      { href: (lang) => reviewHref(lang, "morpho-review"), label: L("Morpho protocol review", "Обзор протокола Morpho"), type: "reviews" },
      { href: (lang) => learnHref(lang, "crypto-yield-risks"), label: L("Crypto yield risks guide", "Гид по рискам crypto yield"), type: "learn" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: safetyHubHref, label: L("Safety hub", "Хаб безопасности"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdc-yield"),
    keywords: ["is morpho safe", "morpho risks", "morpho blue safety", "defi lending safety"],
  },
  {
    slug: "is-rocket-pool-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Rocket Pool Safe? Liquid Staking Risk Overview | TJT",
      "Безопасен ли Rocket Pool? Обзор рисков liquid staking | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Rocket Pool: slashing, rETH peg, node-operator risk, smart contracts, and TJT Trust Score context — not a safety guarantee.",
      "Образовательный обзор безопасности Rocket Pool: slashing, пег rETH, риск node operators, смарт-контракты и контекст TJT Trust Score — не гарантия безопасности.",
    ),
    h1: L("Is Rocket Pool Safe?", "Безопасен ли Rocket Pool?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Rocket Pool is an established decentralized liquid-staking protocol with years of mainnet operation and multiple audits, yet staking always carries slashing, peg, and smart contract risks. This is educational information, not a safety rating.",
      "Краткий ответ: Rocket Pool — устоявшийся децентрализованный протокол liquid staking с годами mainnet и аудитами, но стейкинг всегда несёт slashing, пег и риски смарт-контрактов. Это образовательная информация, а не рейтинг безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Node operator quality, minipool mechanics, and RPL collateral rules directly affect rETH holders.\n\nSecondary market liquidity determines how closely rETH tracks ETH during stress.\n\nEthereum consensus changes and Rocket Pool governance can alter fees, collateral requirements, or withdrawal policies.",
          "Качество node operators, механика minipool и правила залога RPL напрямую влияют на держателей rETH.\n\nЛиквидность вторичного рынка определяет, насколько rETH следует за ETH в стрессе.\n\nИзменения консенсуса Ethereum и governance Rocket Pool меняют комиссии, залог и политику вывода.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Rocket Pool deposit, minipool, and withdrawal contracts have been audited. Upgradeable components require monitoring for governance-approved changes.\n\nDeFi integrations accepting rETH extend blast radius of adjacent contract bugs.\n\nUsers must verify they hold genuine rETH from official Rocket Pool contracts.",
          "Контракты deposit, minipool и withdrawal Rocket Pool аудированы. Апгрейдируемые компоненты требуют мониторинга governance-изменений.\n\nDeFi-интеграции, принимающие rETH, расширяют радиус багов смежных контрактов.\n\nПроверяйте, что вы держите настоящий rETH с официальных контрактов Rocket Pool.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "Protocol withdrawal queues may delay ETH redemption during high exit demand.\n\nDEX pools for rETH/ETH can deplete during crashes, widening discounts.\n\nUsing rETH as collateral ties exit timing to lending market health and liquidation thresholds.",
          "Очереди вывода могут задерживать redemption ETH при высоком спросе на выход.\n\nDEX-пулы rETH/ETH истощаются в крашах, расширяя дисконты.\n\nИспользование rETH как залога связывает выход со здоровьем lending и порогами ликвидации.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Distributed operator set reduces single-curator concentration but introduces operator performance variance.\n\nRPL governance concentration may influence decisions affecting all stakers.\n\nSocialized slashing rules define how validator penalties propagate across the pool.",
          "Распределённый operator set снижает концентрацию куратора, но вносит разброс performance операторов.\n\nКонцентрация RPL governance влияет на решения для всех стейкеров.\n\nПравила социализированного slashing определяют распространение штрафов валидаторов.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "Staking rewards vary with validator performance and network conditions — not fixed APY.\n\nrETH price can deviate from ETH during market stress — not a guaranteed peg.\n\nRegulatory scrutiny of staking products is an evolving external factor.",
          "Staking rewards меняются с performance валидаторов и условиями сети — не фиксированный APY.\n\nЦена rETH может отклоняться от ETH в стрессе — не гарантированный пег.\n\nРегуляторное внимание к staking-продуктам — развивающийся внешний фактор.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Confirm contract addresses and current rETH exchange rate on the official Rocket Pool app.\n\nReview operator set health, slashing history, and withdrawal queue status.\n\nCross-check TJT Trust Score v0.1 and best ETH staking Compare as educational context — then validate on-chain.",
          "Подтвердите адреса контрактов и текущий курс rETH в официальном приложении Rocket Pool.\n\nИзучите здоровье operator set, историю slashing и статус очереди вывода.\n\nСверьте Trust Score v0.1 и best ETH staking Compare — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best ETH staking ranks Rocket Pool alongside Lido and other routes with Trust Score context.\n\nAave vs Lido helps contrast lending safety with liquid staking when building ETH yield research.",
          "Best ETH staking ранжирует Rocket Pool рядом с Lido и другими маршрутами с Trust Score.\n\nAave vs Lido помогает сопоставить безопасность lending и liquid staking при исследовании ETH yield.",
        ),
      },
    ],
    faq: [
      {
        question: L("Has Rocket Pool been slashed?", "Был ли Rocket Pool подвержен slashing?"),
        answer: L(
          "Research historical validator slashing events affecting Rocket Pool minipools. Past outcomes do not guarantee future resilience.",
          "Изучайте исторические события slashing валидаторов, затрагивающие minipools Rocket Pool. Прошлые исходы не гарантируют будущую устойчивость.",
        ),
      },
      {
        question: L("Is rETH safer than stETH?", "Безопаснее ли rETH, чем stETH?"),
        answer: L(
          "Neither token eliminates staking or smart contract risk. They differ in operator model, liquidity depth, and governance — compare independently.",
          "Ни один токен не устраняет staking или риск смарт-контрактов. Они различаются моделью операторов, ликвидностью и governance — сравнивайте самостоятельно.",
        ),
      },
      {
        question: L("Does TJT certify Rocket Pool as safe?", "Сертифицирует ли TJT Rocket Pool как безопасный?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-eth-staking"), label: L("Best ETH staking comparison", "Сравнение лучшего ETH staking"), type: "compare" },
      { href: (lang) => compareHref(lang, "aave-vs-lido"), label: L("Aave vs Lido comparison", "Сравнение Aave vs Lido"), type: "compare" },
      { href: (lang) => protocolHref(lang, "rocket-pool"), label: L("Rocket Pool protocol hub", "Хаб протокола Rocket Pool"), type: "protocols" },
      { href: (lang) => reviewHref(lang, "rocket-pool-review"), label: L("Rocket Pool protocol review", "Обзор протокола Rocket Pool"), type: "reviews" },
      { href: (lang) => learnHref(lang, "what-is-liquid-staking"), label: L("What is liquid staking?", "Что такое liquid staking?"), type: "learn" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
      { href: safetyHubHref, label: L("Safety hub", "Хаб безопасности"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-staking"),
    keywords: ["is rocket pool safe", "reth risks", "rocket pool slashing", "liquid staking safety"],
  },
  {
    slug: "is-compound-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Compound Safe? Lending Protocol Risk Overview | TJT",
      "Безопасен ли Compound? Обзор рисков lending-протокола | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Compound: smart contract risk, governance, liquidity, oracle dependencies, and TJT Trust Score context — not a safety guarantee.",
      "Образовательный обзор безопасности Compound: риски смарт-контрактов, governance, ликвидность, oracle и контекст TJT Trust Score — не гарантия безопасности.",
    ),
    h1: L("Is Compound Safe?", "Безопасен ли Compound?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Compound is a mature pioneer lending protocol with extensive audits and years of mainnet operation, but no DeFi deployment is risk-free. Safety depends on smart contracts, liquidity conditions, oracle integrity, governance decisions, and your position structure. This page provides educational information — not a certification of safety.",
      "Краткий ответ: Compound — зрелый pioneer lending-протокол с обширными аудитами и годами mainnet, но ни одно DeFi-развёртывание не безрисково. Безопасность зависит от смарт-контрактов, ликвидности, oracle, governance и структуры позиции. Страница даёт образовательную информацию, а не сертификат безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Protocol safety spans legacy v2 markets and Compound III (Comet) deployments with different parameter sets.\n\nTVL depth and utilization patterns affect whether suppliers can exit promptly.\n\nGovernance via COMP influences market listings, collateral factors, and upgrade paths.",
          "Безопасность охватывает legacy v2 и развёртывания Compound III (Comet) с разными параметрами.\n\nTVL и utilization влияют на скорость вывода поставщиков.\n\nGovernance через COMP влияет на листинг, collateral factors и апгрейды.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Compound v2 and v3 contracts have been audited by multiple firms over years of operation.\n\nHistorical DeFi exploits demonstrate that upgrades and composability can introduce regressions.\n\nUsers should confirm official contract addresses listed in Compound documentation.",
          "Контракты Compound v2 и v3 аудированы несколькими фирмами за годы работы.\n\nЭксплойты в DeFi показывают, что апгрейды и композируемость вносят регрессии.\n\nПодтверждайте официальные адреса контрактов в документации Compound.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "When pool utilization approaches 100%, new withdrawals may queue until borrowers repay or suppliers add liquidity.\n\nStablecoin pools during market stress can experience rapid utilization spikes.\n\ncToken integrations in external protocols may lock liquidity indirectly.",
          "При utilization близком к 100% вывод может ждать погашений или новых депозитов.\n\nСтейблкоин-пулы в стрессе видят скачки utilization.\n\nИнтеграции cToken косвенно блокируют ликвидность.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Governance can list new assets, adjust collateral factors, or pause markets.\n\nCompound III simplifies markets but introduces deployment-specific oracle and bridge dependencies on L2s.\n\nDependency on external oracle providers ties protocol safety to third-party infrastructure.",
          "Governance листит активы, меняет collateral factors или останавливает рынки.\n\nCompound III упрощает рынки, но добавляет oracle и bridge-зависимости на L2.\n\nЗависимость от oracle связывает безопасность со сторонней инфраструктурой.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "Variable APY compresses when borrow demand falls — suppliers face income volatility.\n\nCorrelated asset crashes can trigger cascading liquidations across DeFi.\n\nRegulatory developments affecting stablecoins may impact listed markets independently of code security.",
          "Переменный APY сжимается при падении спроса — поставщики сталкиваются с волатильностью дохода.\n\nКоррелированные обвалы вызывают каскадные ликвидации.\n\nРегуляторные изменения по стейблкоинам влияют на рынки независимо от безопасности кода.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Confirm contract addresses and market parameters on the official Compound app for your chosen chain.\n\nReview current utilization, supply caps, and oracle sources for your asset.\n\nCross-check TJT Trust Score v0.1 and Compare tables as educational context — then validate on-chain.",
          "Подтвердите адреса и параметры рынка в официальном приложении Compound для выбранной сети.\n\nИзучите utilization, supply caps и oracle для актива.\n\nСверьте Trust Score v0.1 и Compare — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDC and USDT yield comparisons add market context for stablecoin suppliers evaluating Compound routes.\n\nAave vs Lido contrasts lending with liquid staking for portfolio-level research.",
          "Best USDC и USDT yield добавляют контекст для поставщиков стейблкоинов, оценивающих Compound.\n\nAave vs Lido сопоставляет lending и liquid staking для портфельного исследования.",
        ),
      },
    ],
    faq: [
      {
        question: L("Has Compound been hacked?", "Был ли взломан Compound?"),
        answer: L(
          "Compound has faced governance proposals and ecosystem stress events; research historical incident reports. Past survival does not guarantee future resilience.",
          "Compound сталкивался с governance-предложениями и стрессом экосистемы; изучайте отчёты об инцидентах. Прошлое выживание не гарантирует будущую устойчивость.",
        ),
      },
      {
        question: L("Is Compound III safer than legacy markets?", "Безопаснее ли Compound III, чем legacy рынки?"),
        answer: L(
          "Comet uses a different architecture with focused collateral sets. Safety depends on deployment-specific parameters — evaluate each market independently.",
          "Comet использует другую архитектуру с фокусированным залогом. Безопасность зависит от параметров развёртывания — оценивайте каждый рынок отдельно.",
        ),
      },
      {
        question: L("Does TJT certify Compound as safe?", "Сертифицирует ли TJT Compound как безопасный?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdt-yield"), label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"), type: "compare" },
      { href: (lang) => protocolHref(lang, "compound"), label: L("Compound protocol hub", "Хаб протокола Compound"), type: "protocols" },
      { href: (lang) => reviewHref(lang, "compound-review"), label: L("Compound protocol review", "Обзор протокола Compound"), type: "reviews" },
      { href: (lang) => learnHref(lang, "crypto-yield-risks"), label: L("Crypto yield risks guide", "Гид по рискам crypto yield"), type: "learn" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: safetyHubHref, label: L("Safety hub", "Хаб безопасности"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdc-yield"),
    keywords: ["is compound safe", "compound risks", "compound security", "defi lending safety"],
  },
];
