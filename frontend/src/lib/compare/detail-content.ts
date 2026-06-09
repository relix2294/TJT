import type {
  CompareDetailEditorial,
  CompareSlug,
  LocalizedString,
  ProtocolCompareSlug,
} from "@/lib/compare/types";
import { PROTOCOL_COMPARE_SLUGS } from "@/lib/compare/types";

function L(en: string, ru: string): LocalizedString {
  return { en, ru };
}

const MORPHO_VS_AAVE: CompareDetailEditorial = {
  slug: "morpho-vs-aave",
  leftOverview: {
    protocolName: "Morpho",
    title: L("Morpho — protocol overview", "Morpho — обзор протокола"),
    body: L(
      "Morpho is a decentralized lending optimizer that matches suppliers and borrowers peer-to-peer on top of base liquidity markets such as Aave and Compound. Morpho Blue adds permissionless, curator-governed markets with isolated collateral parameters. Educational information only — Morpho inherits underlying-market smart-contract and oracle dependencies.",
      "Morpho — децентрализованный lending optimizer с P2P-сопоставлением поверх базовых рынков Aave и Compound. Morpho Blue добавляет permissionless рынки с изолированным залогом под управлением кураторов. Только образовательная информация — Morpho наследует зависимости смарт-контрактов и oracle базовых рынков.",
    ),
  },
  rightOverview: {
    protocolName: "Aave",
    title: L("Aave — protocol overview", "Aave — обзор протокола"),
    body: L(
      "Aave is a multi-chain decentralized lending protocol where suppliers earn variable APY from borrower demand across pooled markets. Aave V3 introduces efficiency modes, isolation for newer assets, and cross-chain deployments. Educational information only — utilization, oracle, and governance risks apply to all lending positions.",
      "Aave — multi-chain децентрализованный lending, где поставщики получают переменный APY от спроса заёмщиков в пулах. Aave V3 добавляет e-mode, isolation и cross-chain развёртывания. Только образовательная информация — риски utilization, oracle и governance применимы ко всем lending-позициям.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Stablecoin supply: Both Morpho and Aave support USDC and USDT supply routes. Morpho may improve matched-rate efficiency during high borrow demand; Aave offers direct pooled-market exposure with longer operational history.\n\nETH collateral: Aave supports ETH collateralized borrowing natively. Morpho can route ETH-related markets through optimizers or Morpho Blue deployments — verify specific market parameters.\n\nMarket context: Researchers comparing lending optimizers vs core money markets should weigh Trust Score profiles, curator configuration risk (Morpho), and governance breadth (Aave) — not headline APY alone.",
      "Поставка стейблкоинов: Morpho и Aave поддерживают USDC и USDT. Morpho может улучшать matched-ставки при высоком спросе; Aave даёт прямую экспозицию пулов с более длинной историей.\n\nЗалог ETH: Aave поддерживает залоговое кредитование ETH. Morpho маршрутизирует ETH-рынки через optimizer или Morpho Blue — проверяйте параметры конкретного рынка.\n\nРыночный контекст: при сравнении optimizer и core money markets учитывайте Trust Score, риск конфигурации кураторов (Morpho) и governance (Aave) — не только headline APY.",
    ),
  },
  faq: [
    {
      question: L("Is Morpho a fork of Aave?", "Morpho — форк Aave?"),
      answer: L(
        "No. Morpho optimizes or creates markets that may route through Aave and other base protocols. Contract addresses, risk parameters, and dependencies differ by deployment.",
        "Нет. Morpho оптимизирует или создаёт рынки, маршрутизирующиеся через Aave и другие базовые протоколы. Адреса контрактов, параметры риска и зависимости различаются.",
      ),
    },
    {
      question: L("Which has higher Trust Score in TJT v0.1?", "У кого выше Trust Score в TJT v0.1?"),
      answer: L(
        "TJT Trust Score v0.1 is an educational framework — not a safety certification. Compare the factor breakdown cards on this page for informational risk context.",
        "TJT Trust Score v0.1 — образовательная рамка, не сертификат безопасности. Сравните карточки факторов на этой странице для информационного risk context.",
      ),
    },
    {
      question: L("Does TJT rank Morpho above Aave?", "Ранжирует ли TJT Morpho выше Aave?"),
      answer: L(
        "No. This page provides side-by-side market context and Trust Score indicators for independent research — not a ranking or financial advice.",
        "Нет. Страница даёт side-by-side рыночный контекст и индикаторы Trust Score для самостоятельного исследования — не рейтинг и не финансовый совет.",
      ),
    },
  ],
};

const COMPOUND_VS_AAVE: CompareDetailEditorial = {
  slug: "compound-vs-aave",
  leftOverview: {
    protocolName: "Compound",
    title: L("Compound — protocol overview", "Compound — обзор протокола"),
    body: L(
      "Compound is a pioneer decentralized lending protocol on Ethereum and L2 networks. Suppliers receive cTokens that accrue interest; borrowers post collateral against algorithmic rates. Compound III (Comet) uses focused single-borrowable-asset markets. Educational information only — governance and oracle risks apply.",
      "Compound — pioneer децентрализованного lending на Ethereum и L2. Поставщики получают cTokens с начислением процентов; заёмщики вносят залог под алгоритмические ставки. Compound III (Comet) фокусируется на одном borrowable активе. Только образовательная информация — риски governance и oracle применимы.",
    ),
  },
  rightOverview: {
    protocolName: "Aave",
    title: L("Aave — protocol overview", "Aave — обзор протокола"),
    body: L(
      "Aave operates multi-asset lending pools across Ethereum, Arbitrum, Base, Polygon, and Optimism. Suppliers earn aTokens with variable APY driven by utilization. Aave V3 adds modular risk controls including e-mode and isolation mode. Educational information only — cross-chain deployments add bridge and oracle dependencies.",
      "Aave управляет multi-asset lending pools на Ethereum, Arbitrum, Base, Polygon и Optimism. Поставщики получают aTokens с переменным APY от utilization. Aave V3 добавляет e-mode и isolation mode. Только образовательная информация — cross-chain добавляет зависимости мостов и oracle.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Stablecoin supply: Both protocols offer USDC and USDT supply routes on Ethereum. APY varies with borrow utilization and incentive programs — verify live rates independently.\n\nGovernance models: COMP token holders govern Compound parameters; AAVE holders govern Aave markets. Governance concentration and proposal latency are risk context factors for both.\n\nChain coverage: Aave has broader multi-chain deployments today. Compound III extends to select L2s with deployment-specific parameters. Researchers should compare Trust Score profiles and chain-specific oracle stacks.",
      "Поставка стейблкоинов: оба протокола предлагают USDC и USDT на Ethereum. APY зависит от utilization и incentives — проверяйте live-ставки.\n\nGovernance: COMP управляет Compound; AAVE — Aave. Концентрация governance и задержки предложений — факторы risk context.\n\nПокрытие сетей: Aave шире на multi-chain. Compound III на select L2 с параметрами развёртывания. Сравнивайте Trust Score и oracle по сетям.",
    ),
  },
  faq: [
    {
      question: L("Is Compound older than Aave?", "Compound старше Aave?"),
      answer: L(
        "Both are among the earliest DeFi lending protocols. Compound launched earlier on Ethereum mainnet; Aave expanded aggressively across chains. Protocol age is one Trust Score factor — see the cards below.",
        "Оба — среди ранних DeFi lending. Compound раньше на Ethereum mainnet; Aave активнее на multi-chain. Возраст протокола — один фактор Trust Score — см. карточки ниже.",
      ),
    },
    {
      question: L("Can I use both for the same asset?", "Можно ли использовать оба для одного актива?"),
      answer: L(
        "Yes, on overlapping assets like USDC. Positions are separate per protocol with distinct contract addresses, parameters, and risk profiles. This comparison provides market context only.",
        "Да, на пересекающихся активах вроде USDC. Позиции разделены по протоколам с разными адресами, параметрами и профилями риска. Сравнение — только рыночный контекст.",
      ),
    },
    {
      question: L("Does higher Trust Score mean lower risk?", "Более высокий Trust Score означает меньший риск?"),
      answer: L(
        "No. Trust Score v0.1 is an estimated educational framework for risk context. Smart-contract, liquidity, and market risks remain for all DeFi lending positions.",
        "Нет. Trust Score v0.1 — оценочная образовательная рамка для risk context. Риски смарт-контрактов, ликвидности и рынка сохраняются для всех DeFi lending-позиций.",
      ),
    },
  ],
};

const LIDO_VS_ROCKET_POOL: CompareDetailEditorial = {
  slug: "lido-vs-rocket-pool",
  leftOverview: {
    protocolName: "Lido",
    title: L("Lido — protocol overview", "Lido — обзор протокола"),
    body: L(
      "Lido is the dominant Ethereum liquid-staking protocol issuing stETH — a rebasing token representing staked ETH plus accrued validator rewards. A curated operator set manages pooled validators with LDO governance. Educational information only — concentration, slashing, and withdrawal-queue risks apply.",
      "Lido — доминирующий протокол liquid staking на Ethereum, выпускающий rebasing stETH как застейканный ETH плюс награды валидаторов. Курируемый operator set с governance LDO. Только образовательная информация — риски концентрации, slashing и withdrawal queue.",
    ),
  },
  rightOverview: {
    protocolName: "Rocket Pool",
    title: L("Rocket Pool — protocol overview", "Rocket Pool — обзор протокола"),
    body: L(
      "Rocket Pool is a decentralized liquid-staking protocol issuing rETH with an exchange-rate model (non-rebasing). Independent node operators run minipools bonded with RPL collateral. Educational information only — slashing, rETH peg, and operator-set variance are structural risk context factors.",
      "Rocket Pool — децентрализованный liquid staking с rETH по exchange-rate модели (non-rebasing). Независимые node operators запускают minipools с залогом RPL. Только образовательная информация — slashing, пег rETH и разброс операторов — структурные факторы risk context.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "ETH staking with liquidity: Both protocols let users stake ETH while holding a liquid token (stETH or rETH) composable in DeFi. stETH rebases daily; rETH appreciates via exchange rate.\n\nDecentralization trade-off: Rocket Pool emphasizes a distributed minipool operator network. Lido uses a curated operator set with deeper TVL and DEX liquidity. Researchers should compare operator models alongside Trust Score and secondary-market peg dynamics.\n\nDeFi composability: stETH has broader lending and DEX integrations today. rETH liquidity is meaningful but typically thinner during market stress. Verify current integration lists before building strategies.",
      "Staking ETH с ликвидностью: оба протокола позволяют стейкать ETH, держа ликвидный токен (stETH или rETH) для DeFi. stETH rebase ежедневно; rETH растёт через exchange rate.\n\nКомпромисс децентрализации: Rocket Pool делает акцент на распределённых minipool operators. Lido — курируемый operator set с глубоким TVL и DEX-ликвидностью. Сравнивайте модели операторов с Trust Score и динамикой пега.\n\nКомпозируемость DeFi: stETH имеет более широкие интеграции в lending и DEX. Ликвидность rETH значима, но тоньше в стрессе. Проверяйте актуальные интеграции.",
    ),
  },
  faq: [
    {
      question: L("Is stETH the same as rETH?", "stETH — то же, что rETH?"),
      answer: L(
        "No. stETH uses a rebasing balance model; rETH uses an appreciating exchange rate against ETH. Tax, accounting, and DeFi integration behavior differ.",
        "Нет. stETH использует rebasing баланс; rETH — растущий exchange rate к ETH. Налоговый, учётный и DeFi контекст различаются.",
      ),
    },
    {
      question: L("Which has deeper liquidity?", "У кого глубже ликвидность?"),
      answer: L(
        "Lido stETH generally has deeper DEX and lending market liquidity today. Liquidity depth varies with market conditions — verify on-chain before exiting positions.",
        "Lido stETH обычно имеет более глубокую DEX и lending ликвидность. Глубина меняется с рынком — проверяйте on-chain перед выходом.",
      ),
    },
    {
      question: L("Does TJT prefer Lido over Rocket Pool?", "TJT предпочитает Lido Rocket Pool?"),
      answer: L(
        "No. TJT publishes informational comparisons and Trust Score context for market research — not financial advice or protocol preference.",
        "Нет. TJT публикует информационные сравнения и контекст Trust Score для исследования рынка — не финансовые советы и не предпочтение протокола.",
      ),
    },
  ],
};

const SPARK_VS_AAVE: CompareDetailEditorial = {
  slug: "spark-vs-aave",
  leftOverview: {
    protocolName: "Spark",
    title: L("Spark — protocol overview", "Spark — обзор протокола"),
    body: L(
      "Spark is a lending protocol in the MakerDAO ecosystem, operating SparkLend markets for stablecoins and ETH on Ethereum. Supply and borrow mechanics extend DAI-centric liquidity infrastructure into general-purpose DeFi lending. Educational information only — governance coupling with MakerDAO and younger deployment history are risk context factors.",
      "Spark — lending-протокол экосистемы MakerDAO с рынками SparkLend для стейблкоинов и ETH на Ethereum. Механика supply и borrow расширяет DAI-инфраструктуру в универсальный DeFi lending. Только образовательная информация — governance-связь с MakerDAO и более короткая история развёртывания — факторы risk context.",
    ),
  },
  rightOverview: {
    protocolName: "Aave",
    title: L("Aave — protocol overview", "Aave — обзор протокола"),
    body: L(
      "Aave is a multi-chain decentralized lending protocol with pooled markets across Ethereum, Arbitrum, Base, Polygon, and Optimism. Suppliers earn aTokens with variable APY from borrower utilization. Educational information only — oracle, governance, and cross-chain bridge dependencies apply.",
      "Aave — multi-chain децентрализованный lending с пулами на Ethereum, Arbitrum, Base, Polygon и Optimism. Поставщики получают aTokens с переменным APY от utilization. Только образовательная информация — зависимости oracle, governance и cross-chain мостов.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Stablecoin supply: Both Spark and Aave offer USDC and USDT supply routes on Ethereum. Spark pools benefit from MakerDAO ecosystem liquidity flows; Aave offers broader multi-chain deployments and longer operational history.\n\nETH collateral: Both support ETH-related lending markets with distinct risk parameters and oracle stacks. Researchers should compare utilization, withdrawal conditions, and governance responsiveness.\n\nMarket context: Spark carries MakerDAO-aligned governance coupling; Aave has independent AAVE governance with wider chain coverage. Compare Trust Score profiles and TVL depth — not headline APY alone.",
      "Поставка стейблкоинов: Spark и Aave предлагают USDC и USDT на Ethereum. Пулы Spark связаны с ликвидностью MakerDAO; Aave — шире на multi-chain и с более длинной историей.\n\nЗалог ETH: оба поддерживают ETH-lending с разными параметрами и oracle. Сравнивайте utilization, вывод и governance.\n\nРыночный контекст: Spark связан с governance MakerDAO; Aave — независимый AAVE governance и больше сетей. Сравнивайте Trust Score и TVL — не только headline APY.",
    ),
  },
  faq: [
    {
      question: L("Is Spark part of MakerDAO?", "Spark — часть MakerDAO?"),
      answer: L(
        "Spark operates within the MakerDAO ecosystem with aligned governance links. Risk parameters and SparkLend upgrades can be influenced by MakerDAO governance processes.",
        "Spark работает в экосистеме MakerDAO со связанным governance. Параметры риска и апгрейды SparkLend могут влияться процессами governance MakerDAO.",
      ),
    },
    {
      question: L("Which has higher Trust Score in TJT v0.1?", "У кого выше Trust Score в TJT v0.1?"),
      answer: L(
        "TJT Trust Score v0.1 is an educational framework — not a safety certification. Compare the factor breakdown cards on this page for informational risk context.",
        "TJT Trust Score v0.1 — образовательная рамка, не сертификат безопасности. Сравните карточки факторов на этой странице для информационного risk context.",
      ),
    },
    {
      question: L("Does TJT prefer Spark over Aave?", "TJT предпочитает Spark Aave?"),
      answer: L(
        "No. This page provides side-by-side market context and Trust Score indicators for independent research — not a ranking or financial advice.",
        "Нет. Страница даёт side-by-side рыночный контекст и индикаторы Trust Score для самостоятельного исследования — не рейтинг и не финансовый совет.",
      ),
    },
  ],
};

const PENDLE_VS_ETHERFI: CompareDetailEditorial = {
  slug: "pendle-vs-etherfi",
  leftOverview: {
    protocolName: "Pendle",
    title: L("Pendle — protocol overview", "Pendle — обзор протокола"),
    body: L(
      "Pendle is a yield-trading protocol that splits future yield from underlying assets into principal tokens (PT) and yield tokens (YT). Users can lock in implied fixed yields or trade yield exposure across maturities on Ethereum and L2s. Educational information only — underlying-asset and maturity-specific liquidity risks apply.",
      "Pendle — протокол торговли доходностью, разделяющий будущий yield на principal tokens (PT) и yield tokens (YT). Пользователи фиксируют implied yield или торгуют yield-экспозицией по срокам на Ethereum и L2. Только образовательная информация — риски базовых активов и ликвидности по срокам.",
    ),
  },
  rightOverview: {
    protocolName: "EtherFi",
    title: L("EtherFi — protocol overview", "EtherFi — обзор протокола"),
    body: L(
      "EtherFi is a liquid restaking protocol on Ethereum issuing eETH and related tokens that accrue staking and restaking rewards while staying composable in DeFi. Educational information only — restaking adds AVS slashing vectors and younger protocol age versus plain liquid staking.",
      "EtherFi — протокол liquid restaking на Ethereum, выпускающий eETH и связанные токены с начислением staking и restaking rewards при композируемости в DeFi. Только образовательная информация — restaking добавляет AVS slashing и более молодой возраст vs plain liquid staking.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "ETH yield exposure: EtherFi provides direct liquid restaking receipt tokens with variable staking plus AVS yield. Pendle lets users trade fixed or variable yield on ETH-based assets (including LSTs and restaking tokens) via PT/YT markets.\n\nRisk profile: EtherFi concentrates restaking and operator risk in one protocol layer. Pendle adds maturity, implied-yield pricing, and underlying-issuer risk from source assets — users may hold Pendle positions backed by EtherFi or other LSTs.\n\nMarket context: Researchers should compare Trust Score profiles, withdrawal complexity, and whether they want direct restaking exposure (EtherFi) or yield-trading mechanics (Pendle) — not headline APY alone.",
      "ETH yield-экспозиция: EtherFi даёт прямые liquid restaking receipt-токены с переменным staking и AVS yield. Pendle позволяет торговать фиксированным или переменным yield на ETH-активах (LST, restaking) через PT/YT.\n\nПрофиль риска: EtherFi концентрирует restaking и operator risk в одном слое. Pendle добавляет сроки, implied-yield pricing и риск эмитента базовых активов — позиции Pendle могут быть обеспечены EtherFi или другими LST.\n\nРыночный контекст: сравнивайте Trust Score, сложность вывода и нужна ли прямая restaking-экспозиция (EtherFi) или yield-trading (Pendle) — не только headline APY.",
    ),
  },
  faq: [
    {
      question: L("Can Pendle markets use EtherFi as underlying?", "Могут ли рынки Pendle использовать EtherFi как базовый актив?"),
      answer: L(
        "Yes. Pendle supports markets on various yield-bearing ETH assets including liquid staking and restaking tokens. Verify the specific market's underlying asset before entering a position.",
        "Да. Pendle поддерживает рынки на различных ETH-активах с yield, включая liquid staking и restaking. Проверяйте базовый актив конкретного рынка перед входом.",
      ),
    },
    {
      question: L("Is restaking riskier than yield trading?", "Restaking рискованнее торговли yield?"),
      answer: L(
        "They carry different risk vectors. Restaking adds AVS slashing exposure; yield trading adds maturity liquidity and implied-yield pricing risk. Neither is risk-free.",
        "У них разные векторы риска. Restaking добавляет AVS slashing; yield trading — ликвидность по срокам и риск implied-yield pricing. Ни то ни другое не безрисково.",
      ),
    },
    {
      question: L("Does TJT rank Pendle above EtherFi?", "Ранжирует ли TJT Pendle выше EtherFi?"),
      answer: L(
        "No. TJT publishes informational comparisons and Trust Score context for market research — not financial advice or protocol preference.",
        "Нет. TJT публикует информационные сравнения и контекст Trust Score для исследования рынка — не финансовые советы и не предпочтение протокола.",
      ),
    },
  ],
};

const COMPOUND_VS_MORPHO: CompareDetailEditorial = {
  slug: "compound-vs-morpho",
  leftOverview: {
    protocolName: "Compound",
    title: L("Compound — protocol overview", "Compound — обзор протокола"),
    body: L(
      "Compound is a pioneer decentralized lending protocol on Ethereum and L2 networks. Suppliers receive cTokens accruing interest; Compound III (Comet) uses focused single-borrowable-asset markets. Educational information only — governance and oracle risks apply.",
      "Compound — pioneer децентрализованного lending на Ethereum и L2. Поставщики получают cTokens с начислением процентов; Compound III (Comet) фокусируется на одном borrowable активе. Только образовательная информация — риски governance и oracle.",
    ),
  },
  rightOverview: {
    protocolName: "Morpho",
    title: L("Morpho — protocol overview", "Morpho — обзор протокола"),
    body: L(
      "Morpho is a decentralized lending optimizer matching suppliers and borrowers peer-to-peer on top of base markets, plus Morpho Blue permissionless isolated markets curated by risk managers. Educational information only — underlying-protocol and curator configuration risks apply.",
      "Morpho — децентрализованный lending optimizer с P2P-сопоставлением поверх базовых рынков и Morpho Blue — permissionless изолированными рынками под кураторами. Только образовательная информация — риски базовых протоколов и конфигурации кураторов.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Stablecoin supply: Both Compound and Morpho support USDC supply routes. Compound offers direct pooled-market exposure with ~6+ years of mainnet history. Morpho may improve matched-rate efficiency and adds Morpho Blue isolated markets with curator-defined parameters.\n\nArchitecture: Compound is a standalone money market; Morpho layers on or creates markets that may route through Compound, Aave, or other base protocols. Morpho inherits underlying smart-contract dependencies.\n\nMarket context: Compare Trust Score profiles, governance models (COMP vs curator + Morpho governance), and whether you prefer direct pool exposure or optimizer-layer efficiency — not headline APY alone.",
      "Поставка стейблкоинов: Compound и Morpho поддерживают USDC. Compound — прямые пулы с ~6+ годами mainnet. Morpho может улучшать matched-ставки и добавляет изолированные рынки Morpho Blue.\n\nАрхитектура: Compound — standalone money market; Morpho накладывается на или создаёт рынки через Compound, Aave и др. Morpho наследует зависимости базовых протоколов.\n\nРыночный контекст: сравнивайте Trust Score, governance (COMP vs кураторы + Morpho) и предпочитаете ли прямые пулы или optimizer-слой — не только headline APY.",
    ),
  },
  faq: [
    {
      question: L("Does Morpho replace Compound?", "Morpho заменяет Compound?"),
      answer: L(
        "No. Morpho can optimize liquidity that routes through Compound markets but does not replace Compound's standalone pools. Users may interact with either or both depending on market parameters.",
        "Нет. Morpho может оптимизировать ликвидность через рынки Compound, но не заменяет standalone-пулы Compound. Пользователи могут взаимодействовать с одним или обоими в зависимости от параметров.",
      ),
    },
    {
      question: L("Which has higher Trust Score in TJT v0.1?", "У кого выше Trust Score в TJT v0.1?"),
      answer: L(
        "TJT Trust Score v0.1 is an educational framework — not a safety certification. Compare the factor breakdown cards on this page for informational risk context.",
        "TJT Trust Score v0.1 — образовательная рамка, не сертификат безопасности. Сравните карточки факторов на этой странице для информационного risk context.",
      ),
    },
    {
      question: L("Does TJT prefer Compound over Morpho?", "TJT предпочитает Compound Morpho?"),
      answer: L(
        "No. This page provides side-by-side market context and Trust Score indicators for independent research — not a ranking or financial advice.",
        "Нет. Страница даёт side-by-side рыночный контекст и индикаторы Trust Score для самостоятельного исследования — не рейтинг и не финансовый совет.",
      ),
    },
  ],
};

const AAVE_VS_LIDO: CompareDetailEditorial = {
  slug: "aave-vs-lido",
  leftOverview: {
    protocolName: "Aave",
    title: L("Aave — protocol overview", "Aave — обзор протокола"),
    body: L(
      "Aave is a multi-chain decentralized lending protocol where suppliers earn variable APY from borrower demand across pooled markets. Aave V3 supports stablecoin supply, ETH collateral, and cross-chain deployments on Arbitrum, Base, Polygon, and Optimism. Educational information only — utilization, oracle, and governance risks apply.",
      "Aave — multi-chain децентрализованный lending, где поставщики получают переменный APY от спроса заёмщиков в пулах. Aave V3 поддерживает supply стейблкоинов, залог ETH и cross-chain развёртывания. Только образовательная информация — риски utilization, oracle и governance.",
    ),
  },
  rightOverview: {
    protocolName: "Lido",
    title: L("Lido — protocol overview", "Lido — обзор протокола"),
    body: L(
      "Lido is the dominant Ethereum liquid-staking protocol issuing stETH — a rebasing token representing staked ETH plus validator rewards. A curated operator set manages pooled validators with LDO governance. Educational information only — slashing, withdrawal-queue, and peg risks apply.",
      "Lido — доминирующий протокол liquid staking на Ethereum, выпускающий rebasing stETH как застейканный ETH плюс награды валидаторов. Курируемый operator set с governance LDO. Только образовательная информация — риски slashing, withdrawal queue и пега.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Different yield categories: Aave supplies variable APY from lending borrow demand on assets like USDC or ETH. Lido supplies ETH staking rewards via stETH — a fundamentally different risk profile focused on validator, slashing, and peg dynamics.\n\nETH exposure overlap: Both can feature in ETH-centric portfolios — Aave for supply/lending yield, Lido for native staking yield with DeFi composability. Researchers should not compare headline APY directly without mapping yield sources.\n\nMarket context: Aave Trust Score reflects lending-market maturity; Lido Trust Score reflects liquid-staking depth. Use best ETH staking and best USDC yield Compare pages alongside this cross-category comparison.",
      "Разные категории yield: Aave даёт переменный APY от lending на USDC или ETH. Lido даёт staking rewards через stETH — другой профиль риска с фокусом на validator, slashing и пег.\n\nПересечение ETH-экспозиции: оба могут быть в ETH-портфеле — Aave для lending yield, Lido для native staking с DeFi-композируемостью. Не сравнивайте headline APY без mapping источников yield.\n\nРыночный контекст: Trust Score Aave отражает зрелость lending; Lido — глубину liquid staking. Используйте Compare best ETH staking и best USDC yield вместе с этим кросс-категорийным сравнением.",
    ),
  },
  faq: [
    {
      question: L("Can I use Aave and Lido together?", "Можно ли использовать Aave и Lido вместе?"),
      answer: L(
        "Yes. Many strategies supply stETH as collateral on Aave while earning staking rewards — but this layers composability and liquidation risk. Evaluate each protocol independently.",
        "Да. Многие стратегии используют stETH как залог в Aave, получая staking rewards — но это добавляет composability и риск ликвидации. Оценивайте каждый протокол отдельно.",
      ),
    },
    {
      question: L("Which has higher Trust Score in TJT v0.1?", "У кого выше Trust Score в TJT v0.1?"),
      answer: L(
        "TJT Trust Score v0.1 is an educational framework — not a safety certification. Compare factor breakdown cards on this page for informational risk context.",
        "TJT Trust Score v0.1 — образовательная рамка, не сертификат безопасности. Сравните карточки факторов на этой странице для информационного risk context.",
      ),
    },
    {
      question: L("Does TJT prefer Aave over Lido?", "TJT предпочитает Aave Lido?"),
      answer: L(
        "No. This page provides side-by-side market context for cross-category research — not a ranking or financial advice.",
        "Нет. Страница даёт side-by-side рыночный контекст для кросс-категорийного исследования — не рейтинг и не финансовый совет.",
      ),
    },
  ],
};

const AAVE_VS_JITO: CompareDetailEditorial = {
  slug: "aave-vs-jito",
  leftOverview: {
    protocolName: "Aave",
    title: L("Aave — protocol overview", "Aave — обзор протокола"),
    body: L(
      "Aave operates multi-chain lending pools where suppliers earn variable APY from borrower utilization. Deployments span Ethereum, Arbitrum, Base, Polygon, and Optimism with audited smart contracts. Educational information only — lending risks apply across all markets.",
      "Aave управляет multi-chain lending pools, где поставщики получают переменный APY от utilization. Развёртывания на Ethereum, Arbitrum, Base, Polygon и Optimism с аудированными контрактами. Только образовательная информация — риски lending применимы ко всем рынкам.",
    ),
  },
  rightOverview: {
    protocolName: "Jito",
    title: L("Jito — protocol overview", "Jito — обзор протокола"),
    body: L(
      "Jito is the leading Solana liquid-staking protocol issuing jitoSOL — an exchange-rate LST accruing validator rewards plus MEV tips. Educational information only — Solana network liveness, slashing, and jitoSOL peg risks apply.",
      "Jito — ведущий протокол liquid staking на Solana, выпускающий jitoSOL — exchange-rate LST с наградами валидаторов и MEV tips. Только образовательная информация — риски liveness Solana, slashing и пега jitoSOL.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Chain scope: Aave is primarily Ethereum and EVM L2 lending; Jito is Solana-native liquid staking. They serve different ecosystems — comparison is portfolio-contextual, not direct product substitution.\n\nYield mechanics: Aave USDC/USDT supply yields organic borrow-demand APY. Jito jitoSOL yields staking plus MEV-boosted rewards — different sustainability and volatility profiles.\n\nMarket context: Researchers building multi-chain portfolios should compare Trust Score indicators per chain, verify bridge risks when moving capital, and use asset-specific earn hubs (USDC vs SOL) for structured research.",
      "Охват сетей: Aave — Ethereum и EVM L2 lending; Jito — Solana-native liquid staking. Разные экосистемы — сравнение для портфельного контекста, не прямая замена продуктов.\n\nМеханика yield: Aave USDC/USDT — органический APY от заёма. Jito jitoSOL — staking плюс MEV-boosted rewards — другая устойчивость и волатильность.\n\nРыночный контекст: при multi-chain портфеле сравнивайте Trust Score по сетям, проверяйте bridge-риски и используйте earn-хабы USDC vs SOL.",
    ),
  },
  faq: [
    {
      question: L("Is Aave available on Solana?", "Доступен ли Aave на Solana?"),
      answer: L(
        "Aave's core deployments are EVM chains. Jito serves Solana staking — they are complementary across chains, not competing on the same network.",
        "Core-развёртывания Aave — EVM-сети. Jito обслуживает staking Solana — они дополняют друг друга на разных сетях, а не конкурируют в одной.",
      ),
    },
    {
      question: L("Which is better for stablecoin yield?", "Что лучше для stablecoin yield?"),
      answer: L(
        "Aave supports stablecoin supply on EVM chains. Jito focuses on SOL staking — not stablecoin lending. Compare best USDC yield for Aave context and best SOL staking for Jito.",
        "Aave поддерживает supply стейблкоинов на EVM. Jito фокусируется на SOL staking — не stablecoin lending. Сравните best USDC yield для Aave и best SOL staking для Jito.",
      ),
    },
    {
      question: L("Does TJT rank Aave above Jito?", "Ранжирует ли TJT Aave выше Jito?"),
      answer: L(
        "No. TJT publishes informational comparisons and Trust Score context — not financial advice or cross-chain rankings.",
        "Нет. TJT публикует информационные сравнения и контекст Trust Score — не финансовые советы и не кросс-чейн рейтинги.",
      ),
    },
  ],
};

const LIDO_VS_JITO: CompareDetailEditorial = {
  slug: "lido-vs-jito",
  leftOverview: {
    protocolName: "Lido",
    title: L("Lido — protocol overview", "Lido — обзор протокола"),
    body: L(
      "Lido is the dominant Ethereum liquid-staking protocol with stETH — a rebasing LST with deep DeFi integrations and years of mainnet history. Educational information only — operator concentration, slashing, and withdrawal-queue risks apply.",
      "Lido — доминирующий протокол liquid staking на Ethereum со stETH — rebasing LST с глубокими DeFi-интеграциями и годами mainnet. Только образовательная информация — риски концентрации операторов, slashing и withdrawal queue.",
    ),
  },
  rightOverview: {
    protocolName: "Jito",
    title: L("Jito — protocol overview", "Jito — обзор протокола"),
    body: L(
      "Jito is the leading Solana liquid-staking protocol with jitoSOL — an exchange-rate LST earning validator rewards plus MEV tips. Educational information only — Solana network, slashing, and peg risks apply.",
      "Jito — ведущий протокол liquid staking на Solana с jitoSOL — exchange-rate LST с наградами валидаторов и MEV tips. Только образовательная информация — риски сети Solana, slashing и пега.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Cross-ecosystem liquid staking: Lido serves Ethereum (stETH rebasing); Jito serves Solana (jitoSOL exchange-rate). Both unlock staking yield with transferable receipt tokens — but on different chains with distinct consensus and DeFi ecosystems.\n\nToken mechanics: stETH rebases daily in wallet balance; jitoSOL appreciates via exchange rate. Tax, accounting, and integration behavior differ — verify implications independently.\n\nMarket context: Compare Trust Score profiles (Lido ~88, Jito ~79 in TJT v0.1), secondary-market liquidity depth, and best ETH staking vs best SOL staking Compare pages for asset-scoped research.",
      "Кросс-экосистемный liquid staking: Lido — Ethereum (rebasing stETH); Jito — Solana (exchange-rate jitoSOL). Оба открывают staking yield с receipt-токенами — но на разных сетях с разным консенсусом и DeFi.\n\nМеханика токенов: stETH rebase ежедневно; jitoSOL растёт через exchange rate. Налоговый, учётный и интеграционный контекст различается — проверяйте самостоятельно.\n\nРыночный контекст: сравните Trust Score (Lido ~88, Jito ~79 в TJT v0.1), ликвидность вторичного рынка и Compare best ETH staking vs best SOL staking.",
    ),
  },
  faq: [
    {
      question: L("Is stETH the same as jitoSOL?", "stETH — то же, что jitoSOL?"),
      answer: L(
        "No. They are liquid staking tokens on different chains with different rebasing vs exchange-rate mechanics and distinct risk profiles.",
        "Нет. Это LST на разных сетях с разной механикой rebasing vs exchange-rate и разными профилями риска.",
      ),
    },
    {
      question: L("Which has higher staking APY?", "У кого выше staking APY?"),
      answer: L(
        "Jito often shows higher headline APY due to MEV tips on Solana; Lido ETH staking reflects validator economics. APY varies — verify live rates and risk-adjust for chain-specific factors.",
        "Jito часто показывает более высокий headline APY из-за MEV tips на Solana; Lido ETH staking отражает экономику валидаторов. APY меняется — проверяйте live-ставки и risk-adjust по сетям.",
      ),
    },
    {
      question: L("Does TJT prefer Lido over Jito?", "TJT предпочитает Lido Jito?"),
      answer: L(
        "No. TJT provides informational cross-chain liquid-staking context — not financial advice or protocol preference.",
        "Нет. TJT даёт информационный кросс-чейн контекст liquid staking — не финансовые советы и не предпочтение протокола.",
      ),
    },
  ],
};

const ETHENA_VS_AAVE: CompareDetailEditorial = {
  slug: "ethena-vs-aave",
  leftOverview: {
    protocolName: "Ethena",
    title: L("Ethena — protocol overview", "Ethena — обзор протокола"),
    body: L(
      "Ethena is a synthetic-dollar protocol issuing USDe backed by delta-neutral hedging strategies. Yield for sUSDe holders comes from funding rates and staking components — distinct from traditional lending markets. Educational information only — hedging dependency and younger protocol age are elevated risk context.",
      "Ethena — протокол синтетического доллара, выпускающий USDe под delta-neutral хеджирование. Yield для держателей sUSDe от funding rates и staking — отличный от классического lending. Только образовательная информация — зависимость от хеджирования и молодой возраст — повышенный risk context.",
    ),
  },
  rightOverview: {
    protocolName: "Aave",
    title: L("Aave — protocol overview", "Aave — обзор протокола"),
    body: L(
      "Aave is a multi-chain decentralized lending protocol where suppliers earn variable APY from organic borrower demand on pooled USDC, USDT, and ETH markets. Educational information only — utilization, oracle, and governance risks apply.",
      "Aave — multi-chain децентрализованный lending, где поставщики получают переменный APY от органического спроса заёмщиков в пулах USDC, USDT и ETH. Только образовательная информация — риски utilization, oracle и governance.",
    ),
  },
  useCaseComparison: {
    title: L("Use case comparison", "Сравнение сценариев"),
    body: L(
      "Stablecoin yield paths: Aave USDC supply earns borrow-demand-driven variable APY with mature lending infrastructure. Ethena sUSDe earns funding-rate-based yield on a synthetic dollar — different stability mechanics (hedging vs pooled lending).\n\nRisk profile: Aave carries classic lending risks — smart contracts, utilization, oracles. Ethena adds hedging-dependency, funding-rate variability, and synthetic-dollar depeg context. Trust Score: Aave ~85 vs Ethena ~70 in TJT v0.1 — informational only.\n\nMarket context: Researchers comparing stablecoin yield should read usdc-yield-risks learn guide, best USDC yield Compare, and ethena-review / is-ethena-safe pages — not headline APY alone.",
      "Маршруты stablecoin yield: Aave USDC supply — переменный APY от спроса на заём с зрелой lending-инфраструктурой. Ethena sUSDe — yield от funding rates на synthetic dollar — другая механика стабильности (хеджирование vs пулы lending).\n\nПрофиль риска: Aave — классические риски lending. Ethena добавляет зависимость от хеджирования, волатильность funding rates и depeg synthetic dollar. Trust Score: Aave ~85 vs Ethena ~70 в TJT v0.1 — только информация.\n\nРыночный контекст: при сравнении stablecoin yield читайте usdc-yield-risks, Compare best USDC yield и ethena-review / is-ethena-safe — не только headline APY.",
    ),
  },
  faq: [
    {
      question: L("Is USDe the same as supplying USDC on Aave?", "USDe — то же, что supply USDC в Aave?"),
      answer: L(
        "No. USDe is a synthetic dollar with hedging-based stability; Aave USDC supply is pooled lending with fiat-backed USDC. Yield sources, risks, and exit mechanics differ materially.",
        "Нет. USDe — synthetic dollar со стабильностью через хеджирование; Aave USDC supply — pooled lending с fiat-backed USDC. Источники yield, риски и механика выхода существенно различаются.",
      ),
    },
    {
      question: L("Which has higher Trust Score in TJT v0.1?", "У кого выше Trust Score в TJT v0.1?"),
      answer: L(
        "Aave scores higher in TJT's educational framework (~85 vs ~70), reflecting lending-market maturity vs younger synthetic-dollar design. Trust Score is not a safety certification — compare factor cards below.",
        "Aave выше в образовательной рамке TJT (~85 vs ~70), отражая зрелость lending vs более молодой synthetic-dollar дизайн. Trust Score не сертификат безопасности — сравните карточки факторов ниже.",
      ),
    },
    {
      question: L("Does TJT recommend Ethena or Aave?", "TJT рекомендует Ethena или Aave?"),
      answer: L(
        "No. TJT publishes informational comparisons and Trust Score context for independent research — not financial advice or product recommendations.",
        "Нет. TJT публикует информационные сравнения и контекст Trust Score для самостоятельного исследования — не финансовые советы и не рекомендации продуктов.",
      ),
    },
  ],
};

const EDITORIAL_BY_SLUG: Partial<Record<ProtocolCompareSlug, CompareDetailEditorial>> = {
  "morpho-vs-aave": MORPHO_VS_AAVE,
  "compound-vs-aave": COMPOUND_VS_AAVE,
  "lido-vs-rocket-pool": LIDO_VS_ROCKET_POOL,
  "spark-vs-aave": SPARK_VS_AAVE,
  "pendle-vs-etherfi": PENDLE_VS_ETHERFI,
  "compound-vs-morpho": COMPOUND_VS_MORPHO,
  "aave-vs-lido": AAVE_VS_LIDO,
  "aave-vs-jito": AAVE_VS_JITO,
  "lido-vs-jito": LIDO_VS_JITO,
  "ethena-vs-aave": ETHENA_VS_AAVE,
};

export function getCompareDetailEditorial(
  slug: CompareSlug,
): CompareDetailEditorial | null {
  if (!(PROTOCOL_COMPARE_SLUGS as readonly string[]).includes(slug)) return null;
  return EDITORIAL_BY_SLUG[slug as ProtocolCompareSlug] ?? null;
}

export function hasCompareDetailEditorial(slug: CompareSlug): boolean {
  return getCompareDetailEditorial(slug) != null;
}
