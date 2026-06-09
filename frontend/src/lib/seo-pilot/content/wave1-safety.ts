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
function learnHref(lang: Locale, slug: string) {
  return `/${lang}/learn/${slug}`;
}
function earnHref(lang: Locale, asset: string) {
  return `/${lang}/earn/${asset}`;
}
function safetyHubHref(lang: Locale) {
  return `/${lang}/safety`;
}

export const WAVE1_SAFETY_PAGES: SeoPilotPage[] = [
  {
    slug: "is-spark-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Spark Safe? Lending Risk Overview | TJT",
      "Безопасен ли Spark? Обзор рисков lending | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Spark: MakerDAO governance coupling, smart contracts, liquidity, oracle risk, and TJT Trust Score context — not a safety guarantee.",
      "Образовательный обзор безопасности Spark: governance-связь с MakerDAO, смарт-контракты, ликвидность, риск oracle и контекст TJT Trust Score — не гарантия безопасности.",
    ),
    h1: L("Is Spark Safe?", "Безопасен ли Spark?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Spark is a MakerDAO ecosystem lending protocol with documented audits and meaningful TVL, yet all DeFi lending carries smart contract, liquidity, and governance risks. This is educational information, not a safety rating.",
      "Краткий ответ: Spark — lending-протокол экосистемы MakerDAO с аудитами и значимым TVL, но весь DeFi lending несёт риски смарт-контрактов, ликвидности и governance. Это образовательная информация, а не рейтинг безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "MakerDAO-aligned governance can change SparkLend risk parameters, collateral factors, and pause controls.\n\nDAI and stablecoin market stress propagates into Spark pool utilization and withdrawal timing.\n\nUser position structure — collateral ratios, asset selection, and composability — layers risk beyond core SparkLend contracts.",
          "Governance, связанный с MakerDAO, меняет параметры риска SparkLend, collateral factors и паузы.\n\nСтресс рынков DAI и стейблкоинов распространяется на utilization и timing вывода пулов Spark.\n\nСтруктура позиции — залог, выбор актива и композируемость — добавляет риск поверх core SparkLend.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "SparkLend contracts have audit reports cited in Spark and Maker ecosystem documentation.\n\nUpgradeable components and governance-approved changes require ongoing monitoring.\n\nUsers must verify official contract addresses — not phishing interfaces mimicking Spark.",
          "Контракты SparkLend имеют аудиты в документации Spark и Maker.\n\nАпгрейдируемые компоненты и governance-изменения требуют мониторинга.\n\nПроверяйте официальные адреса контрактов — не фишинговые интерфейсы.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "High pool utilization can delay supplier withdrawals until borrowers repay or new liquidity arrives.\n\nStablecoin stress events may spike utilization across MakerDAO-adjacent pools simultaneously.\n\nUsing supplied assets as collateral in external protocols locks exit paths indirectly.",
          "Высокий utilization задерживает вывод поставщиков до погашений или новой ликвидности.\n\nСтресс стейблкоинов может одновременно повышать utilization в пулах MakerDAO.\n\nИспользование supplied активов как залога в других протоколах косвенно блокирует выход.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Governance coupling with MakerDAO means Spark parameters may shift with broader ecosystem decisions.\n\nOracle dependencies drive liquidations — stale or manipulated feeds can harm borrowers and stress pools.\n\nYounger deployment history versus Aave or Compound is a Trust Score context factor.",
          "Governance-связь с MakerDAO означает, что параметры Spark могут меняться с решениями экосистемы.\n\nЗависимости oracle управляют ликвидациями — устаревшие фиды вредят заёмщикам и нагружают пулы.\n\nБолее короткая история vs Aave или Compound — фактор Trust Score context.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "Variable supply APY compresses when borrow demand falls.\n\nCorrelated asset crashes trigger liquidations across DeFi, stressing Spark pools.\n\nIncentive programs can temporarily boost APY without changing structural risk.",
          "Переменный supply APY сжимается при падении спроса на заём.\n\nКоррелированные обвалы вызывают ликвидации в DeFi, нагружая пулы Spark.\n\nIncentive-программы временно повышают APY без изменения структурного риска.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Confirm SparkLend contract addresses and market parameters on the official Spark interface.\n\nReview utilization, oracle sources, and collateral factors for your chosen asset.\n\nCross-check TJT Trust Score v0.1 (educational score: 80/100) and Spark vs Aave Compare — then validate on-chain.",
          "Подтвердите адреса SparkLend и параметры рынка в официальном интерфейсе Spark.\n\nИзучите utilization, oracle и collateral factors для выбранного актива.\n\nСверьте TJT Trust Score v0.1 (образовательный балл: 80/100) и Spark vs Aave Compare — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Spark vs Aave adds side-by-side lending comparison with Trust Score indicators.\n\nBest USDC yield comparison provides stablecoin market context for Spark supply routes.",
          "Spark vs Aave даёт side-by-side сравнение lending с индикаторами Trust Score.\n\nBest USDC yield добавляет рыночный контекст для supply-маршрутов Spark.",
        ),
      },
    ],
    faq: [
      {
        question: L("Does MakerDAO governance affect Spark safety?", "Влияет ли governance MakerDAO на безопасность Spark?"),
        answer: L(
          "Yes. SparkLend risk parameters can change via MakerDAO-aligned governance processes. Monitor active proposals affecting your markets.",
          "Да. Параметры риска SparkLend могут меняться через governance MakerDAO. Мониторьте активные предложения по вашим рынкам.",
        ),
      },
      {
        question: L("Is Spark safer than Aave?", "Spark безопаснее Aave?"),
        answer: L(
          "TJT does not rank protocol safety. Compare Trust Score factor cards and risk disclosures independently — both carry lending risks.",
          "TJT не ранжирует безопасность протоколов. Сравнивайте карточки факторов Trust Score и раскрытия рисков самостоятельно — у обоих есть lending-риски.",
        ),
      },
      {
        question: L("Does TJT certify Spark as safe?", "Сертифицирует ли TJT Spark как безопасный?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "spark-vs-aave"), label: L("Spark vs Aave comparison", "Сравнение Spark vs Aave"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => protocolHref(lang, "spark"), label: L("Spark protocol hub", "Хаб протокола Spark"), type: "protocols" },
      { href: (lang) => reviewHref(lang, "spark-review"), label: L("Spark protocol review", "Обзор протокола Spark"), type: "reviews" },
      { href: (lang) => learnHref(lang, "what-is-protocol-tvl"), label: L("What is protocol TVL?", "Что такое TVL протокола?"), type: "learn" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: safetyHubHref, label: L("Safety hub", "Хаб безопасности"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "spark-vs-aave"),
    keywords: ["is spark safe", "spark risks", "sparklend safety", "makerdao lending safety"],
  },
  {
    slug: "is-pendle-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Pendle Safe? Yield Trading Risk Overview | TJT",
      "Безопасен ли Pendle? Обзор рисков yield trading | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Pendle: PT/YT risks, underlying-asset exposure, maturity liquidity, smart contracts, and TJT Trust Score context — not a safety guarantee.",
      "Образовательный обзор безопасности Pendle: риски PT/YT, экспозиция базовых активов, ликвидность по срокам, смарт-контракты и контекст TJT Trust Score — не гарантия безопасности.",
    ),
    h1: L("Is Pendle Safe?", "Безопасен ли Pendle?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Pendle is an established yield-trading protocol with multiple audits and meaningful TVL, yet PT/YT positions carry underlying-asset, maturity liquidity, and implied-yield pricing risks. This is educational information, not a safety rating.",
      "Краткий ответ: Pendle — устоявшийся протокол yield-trading с аудитами и значимым TVL, но позиции PT/YT несут риски базовых активов, ликвидности по срокам и implied-yield pricing. Это образовательная информация, а не рейтинг безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Underlying asset issuer risk propagates into every PT/YT position — LST exploits or depegs impair Pendle holdings.\n\nMaturity-specific liquidity varies — distant or new markets can have thin exit liquidity.\n\nImplied fixed yields are market prices, not guarantees — pricing can shift before maturity.",
          "Риск эмитента базового актива распространяется на каждую позицию PT/YT — эксплойты LST или depeg вредят holdings Pendle.\n\nЛиквидность по срокам различается — дальние или новые рынки могут иметь тонкий выход.\n\nПодразумеваемый фиксированный yield — рыночные цены, не гарантии — ценообразование меняется до maturity.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Pendle core contracts have multiple audit reports in protocol documentation.\n\nComposability with underlying yield assets extends blast radius of adjacent contract bugs.\n\nVerify you interact with official Pendle contracts for your chosen market and chain.",
          "Core-контракты Pendle имеют несколько аудитов в документации.\n\nКомпозируемость с базовыми yield-активами расширяет радиус багов смежных контрактов.\n\nПроверяйте официальные контракты Pendle для выбранного рынка и сети.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "PT/YT secondary markets can thin during volatility — exiting before maturity may require accepting discounts.\n\nUnderlying asset withdrawal queues (LST or restaking) delay redemption independent of Pendle liquidity.\n\nConcentrated liquidity in specific maturities creates exit timing risk.",
          "Вторичные рынки PT/YT истончаются в волатильности — выход до maturity может требовать дисконта.\n\nОчереди вывода базовых активов (LST, restaking) задерживают redemption независимо от ликвидности Pendle.\n\nКонцентрация ликвидности в конкретных сроках создаёт риск timing выхода.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "New market listings can introduce unfamiliar underlying assets with distinct risk profiles.\n\nGovernance and parameter changes affect supported assets and fee structures.\n\nPendle does not control underlying protocol safety — due diligence on source assets is required.",
          "Новые листинги рынков могут вводить незнакомые базовые активы с отличными профилями риска.\n\nGovernance и изменения параметров влияют на поддерживаемые активы и fee.\n\nPendle не контролирует безопасность базовых протоколов — нужна проверка source assets.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "Implied yield pricing shifts with rate expectations — PT holders face mark-to-market volatility.\n\nUnderlying asset price moves affect collateral value in integrated DeFi strategies.\n\nPoints or incentive programs on underlying assets can end abruptly, collapsing effective yield.",
          "Ценообразование implied yield меняется с ожиданиями ставок — держатели PT сталкиваются с mark-to-market волатильностью.\n\nДвижение цен базовых активов влияет на залог в DeFi-стратегиях.\n\nPoints или incentives на базовых активах могут резко закончиться, обрушивая эффективный yield.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Identify the underlying asset and issuer for your PT/YT market before entering.\n\nCheck maturity date, current PT/YT liquidity depth, and implied yield assumptions.\n\nCross-check TJT Trust Score v0.1 (educational score: 77/100) and Pendle vs EtherFi Compare — then validate on-chain.",
          "Определите базовый актив и эмитента для вашего рынка PT/YT перед входом.\n\nПроверьте дату maturity, глубину ликвидности PT/YT и допущения implied yield.\n\nСверьте TJT Trust Score v0.1 (образовательный балл: 77/100) и Pendle vs EtherFi Compare — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Pendle vs EtherFi contrasts yield-trading with direct liquid restaking exposure.\n\nBest ETH staking comparison adds context for underlying LST assets in Pendle markets.",
          "Pendle vs EtherFi сопоставляет yield-trading и прямую liquid restaking-экспозицию.\n\nBest ETH staking добавляет контекст для базовых LST в рынках Pendle.",
        ),
      },
    ],
    faq: [
      {
        question: L("Does Pendle guarantee fixed yield on PT?", "Гарантирует ли Pendle фиксированный yield на PT?"),
        answer: L(
          "No. PT implied yields are market-derived at purchase. Underlying-asset and smart-contract risks remain throughout the position.",
          "Нет. Implied yield PT — рыночная цена при покупке. Риски базовых активов и смарт-контрактов сохраняются.",
        ),
      },
      {
        question: L("Can underlying asset risk affect Pendle positions?", "Может ли риск базового актива влиять на позиции Pendle?"),
        answer: L(
          "Yes. PT/YT positions inherit smart-contract, depeg, and slashing risk from underlying LSTs, stablecoins, or restaking tokens.",
          "Да. PT/YT наследуют риски смарт-контрактов, depeg и slashing от базовых LST, стейблкоинов или restaking-токенов.",
        ),
      },
      {
        question: L("Does TJT certify Pendle as safe?", "Сертифицирует ли TJT Pendle как безопасный?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "pendle-vs-etherfi"), label: L("Pendle vs EtherFi comparison", "Сравнение Pendle vs EtherFi"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-eth-staking"), label: L("Best ETH staking comparison", "Сравнение лучшего ETH staking"), type: "compare" },
      { href: (lang) => protocolHref(lang, "pendle"), label: L("Pendle protocol hub", "Хаб протокола Pendle"), type: "protocols" },
      { href: (lang) => reviewHref(lang, "pendle-review"), label: L("Pendle protocol review", "Обзор протокола Pendle"), type: "reviews" },
      { href: (lang) => learnHref(lang, "what-is-smart-contract-risk"), label: L("Smart contract risk guide", "Гид по рискам смарт-контрактов"), type: "learn" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
      { href: safetyHubHref, label: L("Safety hub", "Хаб безопасности"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "pendle-vs-etherfi"),
    keywords: ["is pendle safe", "pendle risks", "pt yt safety", "yield trading safety"],
  },
  {
    slug: "is-etherfi-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is EtherFi Safe? Liquid Restaking Risk Overview | TJT",
      "Безопасен ли EtherFi? Обзор рисков liquid restaking | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for EtherFi: restaking slashing, eETH peg, AVS yield variability, smart contracts, and TJT Trust Score context — not a safety guarantee.",
      "Образовательный обзор безопасности EtherFi: restaking slashing, пег eETH, волатильность AVS yield, смарт-контракты и контекст TJT Trust Score — не гарантия безопасности.",
    ),
    h1: L("Is EtherFi Safe?", "Безопасен ли EtherFi?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: EtherFi has meaningful liquid restaking adoption with cited audits, yet restaking adds AVS slashing vectors, younger protocol age, and eETH peg risks beyond plain liquid staking. This is educational information, not a safety rating.",
      "Краткий ответ: EtherFi имеет значимое принятие liquid restaking с указанными аудитами, но restaking добавляет AVS slashing, молодой возраст протокола и риски пега eETH сверх plain liquid staking. Это образовательная информация, а не рейтинг безопасности.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Restaking exposes capital to AVS slashing penalties beyond base Ethereum validator slashing.\n\neETH peg dynamics on secondary markets determine exit value during stress.\n\nAVS incentive programs change yield composition — sustainability is not guaranteed.",
          "Restaking подвергает капитал AVS slashing сверх базового Ethereum validator slashing.\n\nДинамика пега eETH на вторичных рынках определяет стоимость выхода в стрессе.\n\nAVS incentive-программы меняют состав yield — устойчивость не гарантирована.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "EtherFi deposit, withdrawal, and restaking contracts have audit reports in protocol documentation.\n\nRestaking adds contract layers and operator dependencies versus plain LST protocols.\n\nVerify official eETH contract addresses before depositing.",
          "Контракты deposit, withdrawal и restaking EtherFi имеют аудиты в документации.\n\nRestaking добавляет слои контрактов и зависимости операторов vs plain LST.\n\nПроверяйте официальные адреса eETH перед депозитом.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "Protocol withdrawal queues may delay ETH redemption during high exit demand.\n\neETH DEX liquidity can thin during market crashes, widening discounts to ETH.\n\nUsing eETH as lending collateral ties exit timing to market health and liquidation thresholds.",
          "Очереди вывода могут задерживать redemption ETH при высоком спросе на выход.\n\nDEX-ликвидность eETH истончается в крашах, расширяя дисконты к ETH.\n\nИспользование eETH как залога связывает выход со здоровьем рынка и ликвидацией.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Younger protocol age (~2 years mainnet) versus Lido or Rocket Pool is an elevated risk context factor.\n\nOperator performance and restaking delegation choices affect pooled returns.\n\nGovernance changes can alter fees, withdrawal policies, or supported AVS allocations.",
          "Молодой возраст протокола (~2 года mainnet) vs Lido или Rocket Pool — повышенный фактор risk context.\n\nPerformance операторов и выбор restaking delegation влияют на доход пула.\n\nИзменения governance меняют комиссии, политику вывода или AVS allocations.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "ETH price volatility affects collateralized eETH strategies in lending markets.\n\nAVS reward variability compresses effective APY when incentive programs adjust.\n\nCorrelated DeFi stress can simultaneously impair eETH liquidity and lending integrations.",
          "Волатильность ETH влияет на залоговые eETH-стратегии в lending.\n\nВолатильность AVS rewards сжимает эффективный APY при изменении incentives.\n\nКоррелированный DeFi-стресс одновременно вредит ликвидности eETH и lending-интеграциям.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Confirm eETH contract addresses and current withdrawal queue status on the official EtherFi app.\n\nReview AVS allocations, operator set, and restaking slashing rules in documentation.\n\nCross-check TJT Trust Score v0.1 (educational score: 73/100) and best ETH restaking Compare — then validate on-chain.",
          "Подтвердите адреса eETH и статус withdrawal queue в официальном приложении EtherFi.\n\nИзучите AVS allocations, operator set и правила restaking slashing в документации.\n\nСверьте TJT Trust Score v0.1 (образовательный балл: 73/100) и best ETH restaking Compare — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best ETH restaking comparison aggregates catalog routes with Trust Score context.\n\nPendle vs EtherFi contrasts yield-trading with direct restaking exposure.",
          "Best ETH restaking агрегирует маршруты каталога с контекстом Trust Score.\n\nPendle vs EtherFi сопоставляет yield-trading и прямую restaking-экспозицию.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is restaking riskier than liquid staking?", "Restaking рискованнее liquid staking?"),
        answer: L(
          "Generally yes — restaking adds AVS slashing vectors and additional contract layers. Evaluate risk tolerance before choosing eETH over plain LSTs.",
          "Как правило да — restaking добавляет AVS slashing и дополнительные слои контрактов. Оцените толерантность к риску перед выбором eETH vs plain LST.",
        ),
      },
      {
        question: L("Can eETH trade below ETH?", "Может ли eETH торговаться ниже ETH?"),
        answer: L(
          "Yes. Secondary market discounts can widen during liquidity stress — verify current eETH/ETH pricing before relying on instant exits.",
          "Да. Дисконты на вторичном рынке расширяются в стрессе ликвидности — проверяйте текущий курс eETH/ETH перед расчётом на мгновенный выход.",
        ),
      },
      {
        question: L("Does TJT certify EtherFi as safe?", "Сертифицирует ли TJT EtherFi как безопасный?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-eth-restaking"), label: L("Best ETH restaking comparison", "Сравнение лучшего ETH restaking"), type: "compare" },
      { href: (lang) => compareHref(lang, "pendle-vs-etherfi"), label: L("Pendle vs EtherFi comparison", "Сравнение Pendle vs EtherFi"), type: "compare" },
      { href: (lang) => protocolHref(lang, "etherfi"), label: L("EtherFi protocol hub", "Хаб протокола EtherFi"), type: "protocols" },
      { href: (lang) => reviewHref(lang, "etherfi-review"), label: L("EtherFi protocol review", "Обзор протокола EtherFi"), type: "reviews" },
      { href: (lang) => learnHref(lang, "what-is-liquid-restaking"), label: L("What is liquid restaking?", "Что такое liquid restaking?"), type: "learn" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
      { href: safetyHubHref, label: L("Safety hub", "Хаб безопасности"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-restaking"),
    keywords: ["is etherfi safe", "etherfi risks", "eeth safety", "liquid restaking safety"],
  },
  {
    slug: "is-ethena-safe",
    type: "safety",
    hubSegment: "safety",
    metaTitle: L(
      "Is Ethena Safe? Synthetic Dollar Risk Overview | TJT",
      "Безопасна ли Ethena? Обзор рисков synthetic dollar | TJT",
    ),
    metaDescription: L(
      "Educational safety overview for Ethena: USDe hedging dependency, funding-rate risk, depeg context, smart contracts, and TJT Trust Score — not a safety guarantee.",
      "Образовательный обзор безопасности Ethena: зависимость USDe от хеджирования, риск funding rates, контекст depeg, смарт-контракты и TJT Trust Score — не гарантия безопасности.",
    ),
    h1: L("Is Ethena Safe?", "Безопасна ли Ethena?"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "Short answer: Ethena has growing USDe adoption with cited audits, yet synthetic-dollar stability depends on hedging infrastructure, funding rates, and custodial exchange operations — with younger protocol age as elevated risk context. Educational information only.",
      "Краткий ответ: Ethena имеет растущее принятие USDe с указанными аудитами, но стабильность synthetic dollar зависит от хеджирующей инфраструктуры, funding rates и кастодиальных биржевых операций — с молодым возрастом протокола как повышенный risk context. Только образовательная информация.",
    ),
    sections: [
      {
        key: "what_affects_safety",
        title: L("What affects safety", "Что влияет на безопасность"),
        body: L(
          "Delta-neutral hedging via perpetual contracts ties USDe stability to exchange infrastructure uptime and custody practices.\n\nFunding-rate yield variability means sUSDe APY can compress or turn negative.\n\nCollateral composition (ETH, LSTs) introduces market and slashing exposure beneath the hedging layer.",
          "Delta-neutral хеджирование через perpetual связывает стабильность USDe с uptime биржевой инфраструктуры и кастодией.\n\nВолатильность funding-rate yield означает, что APY sUSDe может сжиматься или становиться отрицательным.\n\nСостав залога (ETH, LST) вносит рыночную и slashing-экспозицию под слоем хеджирования.",
        ),
      },
      {
        key: "smart_contract_risk",
        title: L("Smart contract risk", "Риск смарт-контрактов"),
        body: L(
          "Ethena minting, staking, and custody contracts have audit reports in protocol documentation.\n\nOff-chain hedging operations introduce operational risk beyond on-chain contract security.\n\nVerify official USDe and sUSDe contract addresses before depositing.",
          "Контракты minting, staking и custody Ethena имеют аудиты в документации.\n\nOff-chain хеджирование вносит операционный риск сверх on-chain безопасности.\n\nПроверяйте официальные адреса USDe и sUSDe перед депозитом.",
        ),
      },
      {
        key: "liquidity_risk",
        title: L("Liquidity risk", "Риск ликвидности"),
        body: L(
          "USDe DEX and CEX liquidity affects exit timing during depeg or redemption stress.\n\nsUSDe unstaking may involve cooldown periods depending on protocol parameters.\n\nUsing USDe as DeFi collateral ties exit to lending market health.",
          "DEX и CEX ликвидность USDe влияет на timing выхода при depeg или стрессе redemption.\n\nUnstaking sUSDe может включать cooldown в зависимости от параметров протокола.\n\nИспользование USDe как залога DeFi связывает выход со здоровьем lending.",
        ),
      },
      {
        key: "protocol_risk",
        title: L("Protocol risk", "Протокольный риск"),
        body: L(
          "Younger protocol age (~1 year mainnet USDe) versus legacy stablecoin issuers is an elevated Trust Score factor.\n\nHedging strategy changes, collateral whitelist updates, and reserve disclosures evolve with governance.\n\nDependency on centralized exchange hedging is a structural difference from fiat-backed stablecoins.",
          "Молодой возраст (~1 год USDe в mainnet) vs legacy эмитенты стейблкоинов — повышенный фактор Trust Score.\n\nИзменения стратегии хеджирования, whitelist залога и раскрытия резервов развиваются с governance.\n\nЗависимость от CEX-хеджирования — структурное отличие от fiat-backed стейблкоинов.",
        ),
      },
      {
        key: "market_risk",
        title: L("Market risk", "Рыночный риск"),
        body: L(
          "Negative or compressed funding rates reduce sUSDe yield during adverse market conditions.\n\nETH and LST price crashes stress collateral backing hedging positions.\n\nDepeg events can widen if hedging fails or exchange disruptions occur.",
          "Отрицательные или сжатые funding rates снижают yield sUSDe в неблагоприятных условиях.\n\nОбвалы ETH и LST нагружают залог, обеспечивающий хеджи.\n\nDepeg может расшириться при сбоях хеджирования или бирж.",
        ),
      },
      {
        key: "verify_independently",
        title: L("What users should verify independently", "Что проверить самостоятельно"),
        body: L(
          "Review latest reserve attestations, hedging disclosures, and collateral composition in Ethena documentation.\n\nMonitor USDe peg on DEX and CEX venues; check sUSDe cooldown and unstaking parameters.\n\nCross-check TJT Trust Score v0.1 (educational score: 70/100) and best USDC yield Compare — then validate on-chain.",
          "Изучите актуальные аттестации резервов, раскрытия хеджирования и состав залога в документации Ethena.\n\nМониторьте пег USDe на DEX и CEX; проверьте cooldown и параметры unstaking sUSDe.\n\nСверьте TJT Trust Score v0.1 (образовательный балл: 70/100) и best USDC yield Compare — затем проверьте on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDT and USDC yield comparisons contrast lending-route APY with funding-rate-based USDe yield.\n\nUSDC yield risks learn guide adds structured stablecoin risk context.",
          "Best USDT и USDC yield сопоставляют APY lending-маршрутов с funding-rate yield USDe.\n\nLearn-гид USDC yield risks добавляет структурированный risk context для стейблкоинов.",
        ),
      },
    ],
    faq: [
      {
        question: L("Can USDe lose its peg?", "Может ли USDe потерять пег?"),
        answer: L(
          "Yes. Hedging failures, funding stress, or exchange disruptions can impair peg stability. USDe is not equivalent to fiat-backed stablecoins.",
          "Да. Сбои хеджирования, стресс funding или бирж могут ухудшить пег. USDe не эквивалентен fiat-backed стейблкоинам.",
        ),
      },
      {
        question: L("Is Ethena yield sustainable?", "Устойчив ли yield Ethena?"),
        answer: L(
          "Funding-rate yield is highly variable with market conditions. Past APY does not predict future returns — verify live rates independently.",
          "Yield от funding rates сильно переменен с рыночными условиями. Прошлый APY не прогнозирует будущую доходность — проверяйте live-ставки самостоятельно.",
        ),
      },
      {
        question: L("Does TJT certify Ethena as safe?", "Сертифицирует ли TJT Ethena как безопасную?"),
        answer: L(
          "No. TJT publishes educational information and Trust Score indicators. Users must perform independent due diligence.",
          "Нет. TJT публикует образовательную информацию и Trust Score. Пользователи обязаны проводить собственную проверку.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-usdt-yield"), label: L("Best USDT yield comparison", "Сравнение лучшего USDT yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => protocolHref(lang, "ethena"), label: L("Ethena protocol hub", "Хаб протокола Ethena"), type: "protocols" },
      { href: (lang) => reviewHref(lang, "ethena-review"), label: L("Ethena protocol review", "Обзор протокола Ethena"), type: "reviews" },
      { href: (lang) => learnHref(lang, "usdc-yield-risks"), label: L("USDC yield risks guide", "Гид по рискам USDC yield"), type: "learn" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: safetyHubHref, label: L("Safety hub", "Хаб безопасности"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdc-yield"),
    keywords: ["is ethena safe", "ethena risks", "usde safety", "synthetic dollar risks"],
  },
];
