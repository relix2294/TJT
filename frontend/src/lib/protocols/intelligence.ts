import type { CompareSlug } from "@/lib/compare/types";
import type { ProtocolSlug } from "@/lib/protocols/types";
import type { ProtocolIntelligenceSeed } from "@/lib/protocols/intelligence-types";

const TVL_TIER_LABELS = {
  tier_1: {
    en: "Tier 1 ($1B+)",
    ru: "Уровень 1 ($1B+)",
  },
  tier_2: {
    en: "Tier 2 ($100M–$1B)",
    ru: "Уровень 2 ($100M–$1B)",
  },
  tier_3: {
    en: "Tier 3 (<$100M)",
    ru: "Уровень 3 (<$100M)",
  },
} as const;

export { TVL_TIER_LABELS };

/** Per-protocol decision-support content — bilingual, slug-keyed. */
const PROTOCOL_INTELLIGENCE: Record<ProtocolSlug, ProtocolIntelligenceSeed> = {
  aave: {
    keyFacts: {
      launchYear: 2020,
      tvlTier: "tier_1",
      primaryUseCase: {
        en: "Supply assets to earn borrow-demand yield or borrow against collateral",
        ru: "Supply активов для yield от спроса на заём или borrow под залог",
      },
    },
    whyUsersChoose: [
      {
        en: "Largest decentralized lending protocol by TVL and market depth",
        ru: "Крупнейший децентрализованный lending-протокол по TVL и глубине рынка",
      },
      {
        en: "Deep liquidity across USDC, USDT, ETH, and major collateral markets",
        ru: "Глубокая ликвидность по USDC, USDT, ETH и основным залоговым рынкам",
      },
      {
        en: "Multi-chain deployments on Ethereum, Arbitrum, Polygon, Base, and Optimism",
        ru: "Multi-chain развёртывания на Ethereum, Arbitrum, Polygon, Base и Optimism",
      },
    ],
    mainRisks: [
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Lending markets carry smart-contract, oracle, and liquidation risk across deployments.",
          ru: "Lending markets несут риски смарт-контрактов, oracle и ликвидаций на всех развёртываниях.",
        },
      },
      {
        type: "governance",
        severity: "medium",
        description: {
          en: "AAVE governance controls risk parameters, oracle sources, and market listings.",
          ru: "Governance AAVE управляет параметрами риска, oracle и листингом рынков.",
        },
      },
      {
        type: "liquidity",
        severity: "low",
        description: {
          en: "High utilization can slow withdrawals and spike borrow rates on specific assets.",
          ru: "Высокий utilization может замедлить вывод и поднять borrow rates на отдельных активах.",
        },
      },
    ],
    bestFor: [
      { en: "Conservative yield seekers on stablecoins and ETH", ru: "Консервативные искатели yield на stablecoins и ETH" },
      { en: "Long-term holders seeking passive supply yield", ru: "Долгосрочные держатели, ищущие пассивный supply yield" },
      { en: "DeFi users who need deep, composable collateral markets", ru: "DeFi-пользователи, которым нужны глубокие composable collateral markets" },
    ],
    notIdealFor: [
      { en: "High-risk yield hunters chasing unsustainable APY", ru: "Охотники за высоким риском и неустойчивым APY" },
      { en: "Short-term traders who cannot tolerate variable rates", ru: "Краткосрочные трейдеры, не терпящие переменные ставки" },
      { en: "Users uncomfortable with cross-chain bridge dependencies", ru: "Пользователи, не готовые к зависимости от cross-chain мостов" },
    ],
    alternatives: ["morpho", "compound", "spark"],
    relatedComparisons: ["morpho-vs-aave", "compound-vs-aave", "spark-vs-aave", "ethena-vs-aave"],
    relatedOpportunitySlugs: ["aave-v3-usdc-arbitrum", "aave-v3-eth-ethereum"],
  },
  lido: {
    keyFacts: {
      launchYear: 2020,
      tvlTier: "tier_1",
      primaryUseCase: {
        en: "Stake ETH and receive liquid stETH for DeFi composability",
        ru: "Стейкинг ETH с получением ликвидного stETH для DeFi composability",
      },
    },
    whyUsersChoose: [
      {
        en: "Largest liquid staking provider on Ethereum by TVL and adoption",
        ru: "Крупнейший провайдер liquid staking на Ethereum по TVL и принятию",
      },
      {
        en: "Simple ETH staking without running validator infrastructure",
        ru: "Простой ETH staking без собственной validator-инфраструктуры",
      },
      {
        en: "Strong ecosystem integrations across lending, DEX, and restaking routes",
        ru: "Сильные интеграции в lending, DEX и restaking маршруты",
      },
    ],
    mainRisks: [
      {
        type: "validator",
        severity: "medium",
        description: {
          en: "Validator set concentration and slashing exposure are structural LST risks.",
          ru: "Концентрация validator set и slashing — структурные риски LST.",
        },
      },
      {
        type: "depeg",
        severity: "medium",
        description: {
          en: "stETH can trade below ETH during market stress — not a guaranteed 1:1 peg.",
          ru: "stETH может торговаться ниже ETH при рыночном стрессе — не гарантированный peg 1:1.",
        },
      },
      {
        type: "liquidity",
        severity: "low",
        description: {
          en: "Withdrawal queues can extend exit timelines during network congestion.",
          ru: "Withdrawal queues могут удлинить сроки выхода при загрузке сети.",
        },
      },
    ],
    bestFor: [
      { en: "ETH stakers seeking passive validator rewards", ru: "ETH-стейкеры, ищущие пассивные validator rewards" },
      { en: "Long-term holders who want composable staking exposure", ru: "Долгосрочные держатели с composable staking exposure" },
      { en: "Beginners who prefer established liquid staking infrastructure", ru: "Новички, предпочитающие зрелую liquid staking инфраструктуру" },
    ],
    notIdealFor: [
      { en: "Users who require immediate ETH redemption at all times", ru: "Пользователи, которым нужен мгновенный вывод ETH в любой момент" },
      { en: "Investors uncomfortable with validator concentration risk", ru: "Инвесторы, обеспокоенные риском концентрации валидаторов" },
      { en: "Short-term traders sensitive to stETH/ETH spread volatility", ru: "Краткосрочные трейдеры, чувствительные к волатильности спреда stETH/ETH" },
    ],
    alternatives: ["rocket-pool", "etherfi"],
    relatedComparisons: ["lido-vs-rocket-pool", "aave-vs-lido", "best-liquid-staking"],
    relatedOpportunitySlugs: ["lido-steth-ethereum"],
  },
  jito: {
    keyFacts: {
      launchYear: 2022,
      tvlTier: "tier_2",
      primaryUseCase: {
        en: "Stake SOL and earn MEV-boosted validator rewards via jitoSOL",
        ru: "Стейкинг SOL с MEV-бустом validator rewards через jitoSOL",
      },
    },
    whyUsersChoose: [
      {
        en: "Leading Solana liquid staking protocol with MEV-enhanced yields",
        ru: "Ведущий Solana liquid staking с MEV-усиленной доходностью",
      },
      {
        en: "Composable jitoSOL for Solana DeFi strategies",
        ru: "Композируемый jitoSOL для Solana DeFi стратегий",
      },
      {
        en: "Lower barrier to SOL staking vs running validators",
        ru: "Низкий порог SOL staking без собственных валидаторов",
      },
    ],
    mainRisks: [
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Solana program risk and ecosystem-specific exploit vectors apply.",
          ru: "Риски Solana-программ и специфичные для экосистемы векторы эксплойтов.",
        },
      },
      {
        type: "validator",
        severity: "medium",
        description: {
          en: "Validator performance and MEV distribution affect realized staking yield.",
          ru: "Performance валидаторов и распределение MEV влияют на фактический staking yield.",
        },
      },
      {
        type: "liquidity",
        severity: "medium",
        description: {
          en: "jitSOL DEX liquidity is thinner than mature Ethereum LST markets.",
          ru: "DEX-ликвидность jitoSOL тоньше зрелых Ethereum LST рынков.",
        },
      },
    ],
    bestFor: [
      { en: "SOL holders seeking liquid staking with MEV upside", ru: "Держатели SOL, ищущие liquid staking с MEV upside" },
      { en: "Solana-native DeFi users building composable positions", ru: "Solana-native DeFi пользователи с composable позициями" },
      { en: "Medium-term SOL stakers comfortable with ecosystem risk", ru: "Среднесрочные SOL-стейкеры, готовые к рискам экосистемы" },
    ],
    notIdealFor: [
      { en: "Ethereum-only investors unfamiliar with Solana risks", ru: "Ethereum-only инвесторы, не знакомые с рисками Solana" },
      { en: "Conservative yield seekers prioritizing longest track records", ru: "Консервативные искатели yield с приоритетом на длинную историю" },
      { en: "Users needing deepest secondary-market liquidity", ru: "Пользователи, которым нужна максимальная ликвидность вторичного рынка" },
    ],
    alternatives: ["lido"],
    relatedComparisons: ["aave-vs-jito", "lido-vs-jito", "best-sol-staking"],
    relatedOpportunitySlugs: ["jito-liquid-staking-solana"],
  },
  morpho: {
    keyFacts: {
      launchYear: 2021,
      tvlTier: "tier_1",
      primaryUseCase: {
        en: "Optimized lending rates via P2P matching and permissionless Morpho Blue markets",
        ru: "Оптимизированные lending rates через P2P matching и permissionless рынки Morpho Blue",
      },
    },
    whyUsersChoose: [
      {
        en: "Higher supply APY via peer-to-peer rate optimization on base markets",
        ru: "Более высокий supply APY через P2P оптимизацию ставок на базовых рынках",
      },
      {
        en: "Morpho Blue enables isolated, curator-governed lending markets",
        ru: "Morpho Blue позволяет изолированные curator-governed lending markets",
      },
      {
        en: "Integrates with Aave and Compound liquidity for deeper matching",
        ru: "Интеграция с ликвидностью Aave и Compound для глубокого matching",
      },
    ],
    mainRisks: [
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Optimizer and Blue market contracts add layers beyond base lending protocols.",
          ru: "Контракты optimizer и Blue markets добавляют слои поверх базовых lending протоколов.",
        },
      },
      {
        type: "governance",
        severity: "medium",
        description: {
          en: "Curator configurations and market parameters vary by Morpho Blue deployment.",
          ru: "Конфигурации curator и параметры рынков различаются по Morpho Blue deployments.",
        },
      },
      {
        type: "liquidity",
        severity: "low",
        description: {
          en: "Withdrawal paths depend on underlying market liquidity and matching depth.",
          ru: "Пути вывода зависят от ликвидности базовых рынков и глубины matching.",
        },
      },
    ],
    bestFor: [
      { en: "Stablecoin suppliers seeking optimized lending rates", ru: "Поставщики stablecoins, ищущие оптимизированные lending rates" },
      { en: "DeFi users comfortable with layered lending architecture", ru: "DeFi-пользователи, готовые к многослойной lending архитектуре" },
      { en: "Yield optimizers comparing rates across base markets", ru: "Yield-оптимизаторы, сравнивающие ставки на базовых рынках" },
    ],
    notIdealFor: [
      { en: "Beginners who prefer single-layer lending UX", ru: "Новички, предпочитающие однослойный lending UX" },
      { en: "Users who want the simplest possible withdrawal paths", ru: "Пользователи, которым нужны максимально простые пути вывода" },
      { en: "Risk-averse depositors avoiding curator-managed markets", ru: "Осторожные депозиторы, избегающие curator-managed markets" },
    ],
    alternatives: ["aave", "compound", "spark"],
    relatedComparisons: ["morpho-vs-aave", "compound-vs-morpho", "best-usdc-yield"],
    relatedOpportunitySlugs: ["morpho-blue-usdc-ethereum"],
  },
  spark: {
    keyFacts: {
      launchYear: 2023,
      tvlTier: "tier_2",
      primaryUseCase: {
        en: "Supply stablecoins and ETH on MakerDAO-aligned SparkLend markets",
        ru: "Supply stablecoins и ETH на MakerDAO-aligned рынках SparkLend",
      },
    },
    whyUsersChoose: [
      {
        en: "MakerDAO ecosystem backing with DAI-centric liquidity infrastructure",
        ru: "Поддержка экосистемы MakerDAO с DAI-centric ликвидностной инфраструктурой",
      },
      {
        en: "Competitive stablecoin supply rates on Ethereum",
        ru: "Конкурентные stablecoin supply rates на Ethereum",
      },
      {
        en: "Familiar Aave-fork UX with Spark-specific incentives",
        ru: "Знакомый Aave-fork UX со Spark-specific incentives",
      },
    ],
    mainRisks: [
      {
        type: "governance",
        severity: "medium",
        description: {
          en: "Spark risk parameters and incentives are tied to MakerDAO governance decisions.",
          ru: "Параметры риска и incentives Spark связаны с governance MakerDAO.",
        },
      },
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Lending market smart-contract and oracle risks apply to all supply positions.",
          ru: "Риски смарт-контрактов и oracle lending markets применимы ко всем supply позициям.",
        },
      },
      {
        type: "liquidity",
        severity: "low",
        description: {
          en: "Pool depth varies with borrow demand and MakerDAO liquidity flows.",
          ru: "Глубина пулов зависит от спроса на заём и ликвидностных потоков MakerDAO.",
        },
      },
    ],
    bestFor: [
      { en: "Stablecoin yield seekers aligned with MakerDAO ecosystem", ru: "Искатели stablecoin yield в экосистеме MakerDAO" },
      { en: "ETH and USDC suppliers on Ethereum mainnet", ru: "Поставщики ETH и USDC на Ethereum mainnet" },
      { en: "Users comparing Spark rates against Aave and Compound", ru: "Пользователи, сравнивающие ставки Spark с Aave и Compound" },
    ],
    notIdealFor: [
      { en: "Users seeking multi-chain lending in one protocol", ru: "Пользователи, ищущие multi-chain lending в одном протоколе" },
      { en: "Investors uncomfortable with MakerDAO governance coupling", ru: "Инвесторы, обеспокоенные связью с governance MakerDAO" },
      { en: "High-risk yield hunters chasing newest incentive programs only", ru: "Охотники за риском, гоняющиеся только за новыми incentive programs" },
    ],
    alternatives: ["aave", "compound", "morpho"],
    relatedComparisons: ["spark-vs-aave", "best-usdc-yield", "best-usdt-yield"],
    relatedOpportunitySlugs: ["sparklend-usdc-ethereum"],
  },
  "rocket-pool": {
    keyFacts: {
      launchYear: 2021,
      tvlTier: "tier_2",
      primaryUseCase: {
        en: "Decentralized ETH liquid staking via distributed node operators and rETH",
        ru: "Децентрализованный ETH liquid staking через распределённых node operators и rETH",
      },
    },
    whyUsersChoose: [
      {
        en: "More decentralized validator set vs centralized liquid staking leaders",
        ru: "Более децентрализованный validator set vs централизованных лидеров liquid staking",
      },
      {
        en: "rETH accrues staking rewards with permissionless node operator network",
        ru: "rETH начисляет staking rewards через permissionless сеть node operators",
      },
      {
        en: "Strong community governance via RPL staking and DAO votes",
        ru: "Сильное community governance через RPL staking и голосования DAO",
      },
    ],
    mainRisks: [
      {
        type: "validator",
        severity: "medium",
        description: {
          en: "Distributed node operators introduce performance and slashing variance.",
          ru: "Распределённые node operators создают variance performance и slashing.",
        },
      },
      {
        type: "depeg",
        severity: "medium",
        description: {
          en: "rETH can deviate from ETH NAV during liquidity stress — monitor secondary markets.",
          ru: "rETH может отклоняться от NAV ETH при ликвидностном стрессе — следите за вторичными рынками.",
        },
      },
      {
        type: "governance",
        severity: "low",
        description: {
          en: "RPL collateral requirements and DAO parameters affect operator economics.",
          ru: "Требования RPL collateral и параметры DAO влияют на экономику операторов.",
        },
      },
    ],
    bestFor: [
      { en: "ETH stakers prioritizing decentralization over maximum TVL", ru: "ETH-стейкеры с приоритетом децентрализации над максимальным TVL" },
      { en: "Long-term holders comfortable with rETH composability", ru: "Долгосрочные держатели, готовые к composability rETH" },
      { en: "Users comparing decentralized LST alternatives to Lido", ru: "Пользователи, сравнивающие децентрализованные LST альтернативы Lido" },
    ],
    notIdealFor: [
      { en: "Users needing the deepest stETH-level liquidity at all times", ru: "Пользователи, которым нужна максимальная ликвидность уровня stETH" },
      { en: "Beginners who prefer the simplest single-provider staking UX", ru: "Новички, предпочитающие простейший single-provider staking UX" },
      { en: "Short-term traders sensitive to rETH/ETH spread moves", ru: "Краткосрочные трейдеры, чувствительные к движениям спреда rETH/ETH" },
    ],
    alternatives: ["lido", "etherfi"],
    relatedComparisons: ["lido-vs-rocket-pool", "best-eth-staking", "best-liquid-staking"],
    relatedOpportunitySlugs: [],
  },
  etherfi: {
    keyFacts: {
      launchYear: 2023,
      tvlTier: "tier_2",
      primaryUseCase: {
        en: "Liquid staking and restaking via eETH with DeFi composability",
        ru: "Liquid staking и restaking через eETH с DeFi composability",
      },
    },
    whyUsersChoose: [
      {
        en: "Combines ETH staking with EigenLayer restaking exposure in one token",
        ru: "Объединяет ETH staking с EigenLayer restaking exposure в одном токене",
      },
      {
        en: "Growing adoption in liquid restaking and DeFi collateral markets",
        ru: "Растущее принятие в liquid restaking и DeFi collateral markets",
      },
      {
        en: "Competitive total yield vs plain liquid staking alternatives",
        ru: "Конкурентный суммарный yield vs простых liquid staking альтернатив",
      },
    ],
    mainRisks: [
      {
        type: "validator",
        severity: "high",
        description: {
          en: "Restaking adds AVS slashing and operator risk beyond base staking.",
          ru: "Restaking добавляет AVS slashing и риски операторов поверх базового staking.",
        },
      },
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Younger protocol with layered staking and restaking contract dependencies.",
          ru: "Более молодой протокол со слоистыми зависимостями staking и restaking контрактов.",
        },
      },
      {
        type: "liquidity",
        severity: "medium",
        description: {
          en: "eETH exit paths are more complex than mature plain LST markets.",
          ru: "Exit paths eETH сложнее зрелых plain LST рынков.",
        },
      },
    ],
    bestFor: [
      { en: "ETH holders seeking restaking yield on top of staking rewards", ru: "Держатели ETH, ищущие restaking yield поверх staking rewards" },
      { en: "DeFi-native users comfortable with EigenLayer exposure", ru: "DeFi-native пользователи, готовые к EigenLayer exposure" },
      { en: "Medium-term stakers comparing LST vs LRT trade-offs", ru: "Среднесрочные стейкеры, сравнивающие trade-offs LST vs LRT" },
    ],
    notIdealFor: [
      { en: "Conservative stakers avoiding restaking slashing vectors", ru: "Консервативные стейкеры, избегающие restaking slashing vectors" },
      { en: "Beginners who want the simplest ETH staking product", ru: "Новички, которым нужен простейший ETH staking продукт" },
      { en: "Users prioritizing longest operational track record", ru: "Пользователи с приоритетом на самую длинную operational history" },
    ],
    alternatives: ["lido", "rocket-pool", "pendle"],
    relatedComparisons: ["pendle-vs-etherfi", "best-eth-restaking", "best-liquid-staking"],
    relatedOpportunitySlugs: ["etherfi-eeth-ethereum"],
  },
  pendle: {
    keyFacts: {
      launchYear: 2021,
      tvlTier: "tier_2",
      primaryUseCase: {
        en: "Trade and lock in future yield via principal and yield token markets",
        ru: "Торговля и фиксация будущего yield через рынки principal и yield tokens",
      },
    },
    whyUsersChoose: [
      {
        en: "Unique yield-trading infrastructure for fixed and variable yield strategies",
        ru: "Уникальная yield-trading инфраструктура для fixed и variable yield стратегий",
      },
      {
        en: "Access to implied yields across ETH, stablecoins, and LST markets",
        ru: "Доступ к implied yields на ETH, stablecoins и LST рынках",
      },
      {
        en: "Composable PT/YT tokens for advanced DeFi portfolio construction",
        ru: "Композируемые PT/YT токены для продвинутого DeFi portfolio construction",
      },
    ],
    mainRisks: [
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Yield tokenization adds maturity, pricing, and underlying-asset contract layers.",
          ru: "Токенизация yield добавляет слои maturity, pricing и underlying-asset контрактов.",
        },
      },
      {
        type: "liquidity",
        severity: "medium",
        description: {
          en: "PT/YT market depth can thin for newer maturities and niche assets.",
          ru: "Глубина рынков PT/YT может истончаться для новых сроков и нишевых активов.",
        },
      },
      {
        type: "governance",
        severity: "low",
        description: {
          en: "Market listings and incentive programs affect available yield routes.",
          ru: "Листинг рынков и incentive programs влияют на доступные yield routes.",
        },
      },
    ],
    bestFor: [
      { en: "Advanced DeFi users managing yield curve exposure", ru: "Продвинутые DeFi пользователи, управляющие yield curve exposure" },
      { en: "Stablecoin holders seeking fixed-yield strategies", ru: "Держатели stablecoins, ищущие fixed-yield стратегии" },
      { en: "Portfolio managers hedging or amplifying future yield", ru: "Portfolio managers, хеджирующие или усиливающие будущий yield" },
    ],
    notIdealFor: [
      { en: "Beginners unfamiliar with yield token mechanics", ru: "Новички, не знакомые с механикой yield tokens" },
      { en: "Conservative depositors wanting simple supply-only UX", ru: "Консервативные депозиторы, желающие простой supply-only UX" },
      { en: "Short-term traders without liquidity depth awareness", ru: "Краткосрочные трейдеры без понимания глубины ликвидности" },
    ],
    alternatives: ["etherfi", "ethena", "aave"],
    relatedComparisons: ["pendle-vs-etherfi", "best-usdc-yield", "best-eth-staking"],
    relatedOpportunitySlugs: ["pendle-usdc-yield-ethereum"],
  },
  ethena: {
    keyFacts: {
      launchYear: 2024,
      tvlTier: "tier_2",
      primaryUseCase: {
        en: "Synthetic dollar (USDe) yield via delta-neutral hedging and staking components",
        ru: "Synthetic dollar (USDe) yield через delta-neutral хеджирование и staking компоненты",
      },
    },
    whyUsersChoose: [
      {
        en: "High headline yields on synthetic dollar products vs traditional lending",
        ru: "Высокие headline yields на synthetic dollar продуктах vs традиционного lending",
      },
      {
        en: "No direct lending-market exposure — yield from funding and staking",
        ru: "Без прямой lending-market экспозиции — yield от funding и staking",
      },
      {
        en: "Growing adoption as alternative stablecoin yield route",
        ru: "Растущее принятие как альтернативный stablecoin yield route",
      },
    ],
    mainRisks: [
      {
        type: "depeg",
        severity: "high",
        description: {
          en: "USDe peg stability depends on hedging infrastructure and collateral quality.",
          ru: "Стабильность пега USDe зависит от хеджирующей инфраструктуры и качества залога.",
        },
      },
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Delta-neutral strategies rely on derivatives, custody, and oracle systems.",
          ru: "Delta-neutral стратегии зависят от деривативов, custody и oracle систем.",
        },
      },
      {
        type: "liquidity",
        severity: "medium",
        description: {
          en: "Funding-rate-driven yields are highly variable with market conditions.",
          ru: "Доходность от funding rates сильно переменна с рыночными условиями.",
        },
      },
    ],
    bestFor: [
      { en: "Stablecoin yield seekers comfortable with synthetic dollar models", ru: "Искатели stablecoin yield, готовые к synthetic dollar моделям" },
      { en: "Users diversifying beyond lending-only yield routes", ru: "Пользователи, диверсифицирующие yield routes за пределы lending" },
      { en: "DeFi users monitoring funding-rate and hedging risk disclosures", ru: "DeFi-пользователи, отслеживающие funding-rate и hedging risk disclosures" },
    ],
    notIdealFor: [
      { en: "Conservative savers requiring battle-tested lending protocols only", ru: "Консервативные сберегатели, требующие только проверенные lending протоколы" },
      { en: "Users uncomfortable with derivatives-backed stablecoin designs", ru: "Пользователи, не готовые к stablecoin дизайнам на деривативах" },
      { en: "Beginners expecting fixed, predictable APY", ru: "Новички, ожидающие фиксированный предсказуемый APY" },
    ],
    alternatives: ["aave", "morpho", "spark"],
    relatedComparisons: ["ethena-vs-aave", "best-usdt-yield", "best-usdc-yield"],
    relatedOpportunitySlugs: ["ethena-susde-ethereum"],
  },
  compound: {
    keyFacts: {
      launchYear: 2018,
      tvlTier: "tier_1",
      primaryUseCase: {
        en: "Supply assets to pioneer algorithmic lending markets via cTokens",
        ru: "Supply активов на pioneer algorithmic lending markets через cTokens",
      },
    },
    whyUsersChoose: [
      {
        en: "Longest-operating decentralized lending protocol with deep track record",
        ru: "Самый долго работающий децентрализованный lending протокол с глубокой историей",
      },
      {
        en: "Established USDC and ETH markets on Ethereum with documented audits",
        ru: "Зрелые USDC и ETH рынки на Ethereum с документированными аудитами",
      },
      {
        en: "Familiar cToken model composable across DeFi integrations",
        ru: "Знакомая модель cToken, композируемая в DeFi интеграциях",
      },
    ],
    mainRisks: [
      {
        type: "smart_contract",
        severity: "medium",
        description: {
          en: "Lending positions carry smart-contract, oracle, and liquidation risk.",
          ru: "Lending позиции несут риски смарт-контрактов, oracle и ликвидаций.",
        },
      },
      {
        type: "governance",
        severity: "medium",
        description: {
          en: "COMP governance controls market listings, collateral factors, and upgrades.",
          ru: "Governance COMP управляет листингом рынков, collateral factors и апгрейдами.",
        },
      },
      {
        type: "liquidity",
        severity: "low",
        description: {
          en: "Utilization spikes can affect withdrawal speed and supply APY on specific assets.",
          ru: "Скачки utilization могут влиять на скорость вывода и supply APY на отдельных активах.",
        },
      },
    ],
    bestFor: [
      { en: "Conservative yield seekers on established lending markets", ru: "Консервативные искатели yield на зрелых lending markets" },
      { en: "Long-term DeFi users valuing operational track record", ru: "Долгосрочные DeFi пользователи, ценящие operational track record" },
      { en: "Stablecoin suppliers comparing rates against Aave and Morpho", ru: "Поставщики stablecoins, сравнивающие ставки с Aave и Morpho" },
    ],
    notIdealFor: [
      { en: "Users requiring the deepest multi-chain lending coverage", ru: "Пользователи, которым нужно максимальное multi-chain lending покрытие" },
      { en: "High-risk yield hunters chasing newest incentive programs", ru: "Охотники за риском, гоняющиеся за новейшими incentive programs" },
      { en: "Leverage-focused borrowers needing the widest collateral set", ru: "Заёмщики с фокусом на leverage, нуждающиеся в широчайшем наборе залога" },
    ],
    alternatives: ["aave", "morpho", "spark"],
    relatedComparisons: ["compound-vs-aave", "compound-vs-morpho", "best-usdc-yield"],
    relatedOpportunitySlugs: ["compound-v3-usdc-ethereum"],
  },
};

export function getProtocolIntelligenceSeed(
  slug: ProtocolSlug,
): ProtocolIntelligenceSeed {
  return PROTOCOL_INTELLIGENCE[slug];
}

export function getProtocolIntelligenceComparisons(
  slug: ProtocolSlug,
): CompareSlug[] {
  return PROTOCOL_INTELLIGENCE[slug].relatedComparisons;
}
