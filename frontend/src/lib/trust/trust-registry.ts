import {
  buildTrustFactor,
  computeCompositeScore,
  scoreToCategory,
  TRUST_CATEGORY_LABELS,
  TRUST_SCORE_DISCLAIMER,
} from "@/lib/trust/trust-score";
import type {
  ProtocolTrustProfile,
  TrustProtocolSlug,
} from "@/lib/trust/trust-types";

const LAST_REVIEWED = "2026-06-10";

function buildProfile(
  slug: TrustProtocolSlug,
  protocolName: string,
  factorInputs: Parameters<typeof buildTrustFactor>[0][],
  explanation: ProtocolTrustProfile["explanation"],
  riskNotes: ProtocolTrustProfile["riskNotes"],
  dataStatus: ProtocolTrustProfile["dataStatus"],
): ProtocolTrustProfile {
  const factors = factorInputs.map(buildTrustFactor);
  const score = computeCompositeScore(factors);
  const category = scoreToCategory(score);

  return {
    protocolName,
    slug,
    score,
    category,
    categoryLabel: TRUST_CATEGORY_LABELS[category],
    factors,
    explanation,
    riskNotes,
    lastReviewed: LAST_REVIEWED,
    dataStatus,
    disclaimer: TRUST_SCORE_DISCLAIMER,
    version: "0.1",
  };
}

const AAVE_PROFILE = buildProfile(
  "aave",
  "Aave",
  [
    {
      key: "tvl",
      score: 95,
      dataStatus: "estimated",
      note: {
        en: "Multi-billion TVL tier across Ethereum and L2 deployments — estimated from public DeFi aggregates, pending live feed.",
        ru: "Уровень TVL в миллиарды долларов на Ethereum и L2 — оценка по публичным DeFi-агрегатам, ожидает live-фид.",
      },
    },
    {
      key: "protocol_age",
      score: 92,
      dataStatus: "estimated",
      note: {
        en: "~5 years of mainnet operation since early lending market launch — launch date pending verified on-chain anchor.",
        ru: "~5 лет работы в mainnet с раннего запуска lending market — дата запуска ожидает on-chain верификации.",
      },
    },
    {
      key: "audits",
      score: 90,
      dataStatus: "placeholder",
      note: {
        en: "Multiple third-party audit cycles reported in public docs — no audit registry API connected yet.",
        ru: "Несколько циклов аудита зафиксировано в публичной документации — API реестра аудитов не подключён.",
      },
    },
    {
      key: "exploit_history",
      score: 78,
      dataStatus: "placeholder",
      note: {
        en: "Historical governance and market-stress events noted — no verified incident feed connected.",
        ru: "Зафиксированы события governance и рыночного стресса — верифицированный фид инцидентов не подключён.",
      },
    },
    {
      key: "liquidity",
      score: 88,
      dataStatus: "estimated",
      note: {
        en: "Deep lending pool liquidity on major assets — withdrawal conditions vary by market utilization.",
        ru: "Глубокая ликвидность lending pools на основных активах — условия вывода зависят от utilization рынка.",
      },
    },
    {
      key: "yield_sustainability",
      score: 82,
      dataStatus: "estimated",
      note: {
        en: "Borrow-demand-driven APY on stablecoins and ETH — rates shift with utilization and incentives.",
        ru: "APY от спроса на заём для stablecoins и ETH — ставки меняются с utilization и incentives.",
      },
    },
    {
      key: "protocol_adoption",
      score: 93,
      dataStatus: "estimated",
      note: {
        en: "Widely integrated across DeFi composability layers and institutional research coverage.",
        ru: "Широкая интеграция в DeFi composability и освещение в institutional research.",
      },
    },
    {
      key: "documentation_quality",
      score: 88,
      dataStatus: "verified",
      note: {
        en: "Structured technical docs, risk disclosures, and governance forum references publicly available.",
        ru: "Структурированная техническая документация, раскрытие рисков и governance forum доступны публично.",
      },
    },
  ],
  {
    en: "Aave receives an educational score of 89/100 in TJT's estimated framework. The trust overview reflects strong TVL depth, mature lending markets, broad adoption, and documented audit history — with residual smart-contract, oracle, and utilization risks that require independent verification.",
    ru: "Aave получает образовательный балл 89/100 в оценочной рамке TJT. Trust overview отражает сильный TVL, зрелые lending markets, широкое принятие и документированную историю аудитов — с остаточными рисками смарт-контрактов, oracle и utilization, требующими самостоятельной проверки.",
  },
  [
    {
      en: "Variable APY and liquidation mechanics apply to all lending positions.",
      ru: "Переменный APY и механика ликвидаций применимы ко всем lending-позициям.",
    },
    {
      en: "Cross-chain deployments add bridge and oracle dependency risk beyond Ethereum core markets.",
      ru: "Cross-chain развёртывания добавляют риски bridge и oracle помимо core-рынков Ethereum.",
    },
  ],
  "estimated",
);

const LIDO_PROFILE = buildProfile(
  "lido",
  "Lido",
  [
    {
      key: "tvl",
      score: 96,
      dataStatus: "estimated",
      note: {
        en: "Among the largest liquid-staking TVL on Ethereum — estimated tier pending live oracle feed.",
        ru: "Один из крупнейших TVL liquid staking на Ethereum — оценочный уровень до live oracle-фида.",
      },
    },
    {
      key: "protocol_age",
      score: 88,
      dataStatus: "estimated",
      note: {
        en: "~4 years of stETH mainnet history — verified launch anchor pending.",
        ru: "~4 года истории stETH в mainnet — верифицированная дата запуска ожидается.",
      },
    },
    {
      key: "audits",
      score: 92,
      dataStatus: "placeholder",
      note: {
        en: "Multiple audit reports cited in protocol documentation — registry API not connected.",
        ru: "Несколько аудитов указано в документации протокола — API реестра не подключён.",
      },
    },
    {
      key: "exploit_history",
      score: 85,
      dataStatus: "placeholder",
      note: {
        en: "No major protocol-level exploit in public record — incident feed verification pending.",
        ru: "Крупных protocol-level эксплойтов в публичных записях нет — верификация фида инцидентов ожидается.",
      },
    },
    {
      key: "liquidity",
      score: 85,
      dataStatus: "estimated",
      note: {
        en: "stETH deep DEX and lending market liquidity — withdrawal queue dynamics apply during stress.",
        ru: "Глубокая DEX и lending ликвидность stETH — динамика withdrawal queue при стрессе.",
      },
    },
    {
      key: "yield_sustainability",
      score: 80,
      dataStatus: "estimated",
      note: {
        en: "Staking rewards track validator yields minus protocol fee — not fixed APY.",
        ru: "Staking rewards следуют доходности валидаторов минус fee протокола — не фиксированный APY.",
      },
    },
    {
      key: "protocol_adoption",
      score: 95,
      dataStatus: "estimated",
      note: {
        en: "Dominant Ethereum liquid-staking share with broad DeFi composability for stETH.",
        ru: "Доминирующая доля liquid staking на Ethereum с широкой DeFi composability для stETH.",
      },
    },
    {
      key: "documentation_quality",
      score: 90,
      dataStatus: "verified",
      note: {
        en: "Technical docs cover node operator set, slashing, and governance — publicly accessible.",
        ru: "Техдоки покрывают node operators, slashing и governance — публично доступны.",
      },
    },
  ],
  {
    en: "Lido receives an educational score of 90/100 in TJT's estimated framework. The trust overview reflects dominant Ethereum liquid-staking adoption, deep TVL, and documented audit coverage — with concentration, slashing, and withdrawal-queue risks that users should verify independently.",
    ru: "Lido получает образовательный балл 90/100 в оценочной рамке TJT. Trust overview отражает доминирующее принятие liquid staking на Ethereum, глубокий TVL и документированное покрытие аудитами — с рисками концентрации, slashing и withdrawal queue для самостоятельной проверки.",
  },
  [
    {
      en: "Validator set concentration and slashing exposure are structural liquid-staking risks.",
      ru: "Концентрация validator set и slashing — структурные риски liquid staking.",
    },
    {
      en: "stETH price can deviate from ETH during market stress — not a guaranteed peg.",
      ru: "Цена stETH может отклоняться от ETH при рыночном стрессе — не гарантированный peg.",
    },
  ],
  "estimated",
);

const JITO_PROFILE = buildProfile(
  "jito",
  "Jito",
  [
    {
      key: "tvl",
      score: 72,
      dataStatus: "estimated",
      note: {
        en: "Growing Solana liquid-staking TVL — smaller absolute scale vs Ethereum leaders, estimated tier.",
        ru: "Растущий TVL liquid staking на Solana — меньший абсолютный масштаб vs лидеры Ethereum, оценочный уровень.",
      },
    },
    {
      key: "protocol_age",
      score: 58,
      dataStatus: "estimated",
      note: {
        en: "~2 years of jitoSOL mainnet history — younger protocol relative to Ethereum DeFi leaders.",
        ru: "~2 года истории jitoSOL в mainnet — более молодой протокол относительно лидеров Ethereum DeFi.",
      },
    },
    {
      key: "audits",
      score: 72,
      dataStatus: "placeholder",
      note: {
        en: "Audit reports referenced in Solana ecosystem docs — full registry verification pending.",
        ru: "Аудиты упомянуты в документации Solana-экосистемы — полная верификация реестра ожидается.",
      },
    },
    {
      key: "exploit_history",
      score: 80,
      dataStatus: "placeholder",
      note: {
        en: "No major jitoSOL protocol exploit in public record — incident feed not connected.",
        ru: "Крупных эксплойтов jitoSOL в публичных записях нет — фид инцидентов не подключён.",
      },
    },
    {
      key: "liquidity",
      score: 68,
      dataStatus: "estimated",
      note: {
        en: "jitSOL DEX liquidity improving but thinner vs stETH on Ethereum — Solana-specific exit paths.",
        ru: "DEX-ликвидность jitoSOL растёт, но тоньше vs stETH на Ethereum — exit paths специфичны для Solana.",
      },
    },
    {
      key: "yield_sustainability",
      score: 65,
      dataStatus: "estimated",
      note: {
        en: "MEV-augmented staking yields vary with network activity and validator performance.",
        ru: "Staking yield с MEV зависит от активности сети и performance валидаторов.",
      },
    },
    {
      key: "protocol_adoption",
      score: 62,
      dataStatus: "estimated",
      note: {
        en: "Leading Solana liquid-staking share but narrower composability vs mature Ethereum DeFi.",
        ru: "Лидирующая доля liquid staking на Solana, но уже composability vs зрелого Ethereum DeFi.",
      },
    },
    {
      key: "documentation_quality",
      score: 70,
      dataStatus: "estimated",
      note: {
        en: "Docs cover MEV staking model and risks — less extensive historical archive than older protocols.",
        ru: "Доки покрывают MEV staking model и риски — менее обширный исторический архив vs старых протоколов.",
      },
    },
  ],
  {
    en: "Jito receives an educational score of 69/100 in TJT's estimated framework. The trust overview reflects meaningful Solana liquid-staking adoption with MEV-enhanced yields — but younger protocol age, thinner liquidity depth, and ecosystem-specific risks warrant elevated risk context.",
    ru: "Jito получает образовательный балл 69/100 в оценочной рамке TJT. Trust overview отражает значимое принятие liquid staking на Solana с MEV-yield — но молодой возраст протокола, меньшая глубина ликвидности и риски экосистемы требуют повышенного risk context.",
  },
  [
    {
      en: "Solana network outages and congestion can affect staking operations and exit timing.",
      ru: "Outages и congestion сети Solana могут влиять на staking operations и timing выхода.",
    },
    {
      en: "MEV yield components add complexity beyond baseline validator rewards.",
      ru: "Компоненты MEV-yield добавляют сложность сверх базовых validator rewards.",
    },
  ],
  "estimated",
);

const MORPHO_PROFILE = buildProfile(
  "morpho",
  "Morpho",
  [
    { key: "tvl", score: 84, dataStatus: "estimated", note: { en: "Growing TVL across Morpho Blue and legacy optimizer markets — estimated from public aggregates.", ru: "Растущий TVL в Morpho Blue и legacy optimizer — оценка по публичным агрегатам." } },
    { key: "protocol_age", score: 72, dataStatus: "estimated", note: { en: "~3 years of mainnet optimizer history; Morpho Blue is newer — launch anchors pending verification.", ru: "~3 года optimizer в mainnet; Morpho Blue новее — даты запуска ожидают верификации." } },
    { key: "audits", score: 86, dataStatus: "placeholder", note: { en: "Multiple audit cycles reported for core contracts — audit registry API not connected.", ru: "Несколько циклов аудита core-контрактов — API реестра не подключён." } },
    { key: "exploit_history", score: 82, dataStatus: "placeholder", note: { en: "No major Morpho core exploit in public record — incident feed verification pending.", ru: "Крупных эксплойтов core Morpho в публичных записях нет — верификация фида ожидается." } },
    { key: "liquidity", score: 80, dataStatus: "estimated", note: { en: "P2P matching can improve rates but withdrawal paths depend on underlying market liquidity.", ru: "P2P matching улучшает ставки, но вывод зависит от ликвидности базовых рынков." } },
    { key: "yield_sustainability", score: 78, dataStatus: "estimated", note: { en: "Rates track underlying borrow demand and incentive programs — variable by market.", ru: "Ставки следуют спросу на заём и incentives — переменны по рынкам." } },
    { key: "protocol_adoption", score: 82, dataStatus: "estimated", note: { en: "Integrated with major lending markets and growing curator ecosystem on Morpho Blue.", ru: "Интеграция с крупными lending-рынками и растущей экосистемой кураторов Morpho Blue." } },
    { key: "documentation_quality", score: 84, dataStatus: "verified", note: { en: "Technical docs cover market creation, oracle dependencies, and risk parameters.", ru: "Техдоки покрывают создание рынков, oracle и параметры риска." } },
  ],
  {
    en: "Morpho receives an educational score of 81/100 in TJT's estimated framework. The trust overview reflects strong lending-optimizer adoption and documented audits — with underlying-market, oracle, and curator-configuration risks requiring independent verification.",
    ru: "Morpho получает образовательный балл 81/100 в оценочной рамке TJT. Trust overview отражает принятие lending-optimizer и документированные аудиты — с рисками базовых рынков, oracle и конфигурации кураторов для самостоятельной проверки.",
  },
  [
    { en: "Morpho markets inherit smart-contract and liquidity risk from underlying lending protocols.", ru: "Рынки Morpho наследуют риски смарт-контрактов и ликвидности базовых lending-протоколов." },
    { en: "Permissionless market creation adds curator and parameter misconfiguration risk.", ru: "Permissionless создание рынков добавляет риск ошибок кураторов и параметров." },
  ],
  "estimated",
);

const SPARK_PROFILE = buildProfile(
  "spark",
  "Spark",
  [
    { key: "tvl", score: 82, dataStatus: "estimated", note: { en: "Meaningful TVL within MakerDAO-adjacent lending — estimated tier pending live feed.", ru: "Значимый TVL в lending экосистемы MakerDAO — оценочный уровень до live-фида." } },
    { key: "protocol_age", score: 68, dataStatus: "estimated", note: { en: "~2 years since SparkLend mainnet launch — younger than legacy lending leaders.", ru: "~2 года с запуска SparkLend — моложе legacy lending-лидеров." } },
    { key: "audits", score: 88, dataStatus: "placeholder", note: { en: "Audit reports cited in Spark and Maker ecosystem docs — registry API not connected.", ru: "Аудиты указаны в документации Spark и Maker — API реестра не подключён." } },
    { key: "exploit_history", score: 84, dataStatus: "placeholder", note: { en: "No major SparkLend exploit in public record — incident feed verification pending.", ru: "Крупных эксплойтов SparkLend в публичных записях нет — верификация фида ожидается." } },
    { key: "liquidity", score: 78, dataStatus: "estimated", note: { en: "Stablecoin pool depth tied to MakerDAO liquidity flows and borrow utilization.", ru: "Глубина стейблкоин-пулов связана с ликвидностью MakerDAO и utilization." } },
    { key: "yield_sustainability", score: 76, dataStatus: "estimated", note: { en: "Supply APY driven by borrow demand and Spark incentive programs.", ru: "Supply APY от спроса на заём и incentive-программ Spark." } },
    { key: "protocol_adoption", score: 80, dataStatus: "estimated", note: { en: "Backed by MakerDAO ecosystem integrations and DAI liquidity infrastructure.", ru: "Поддержка экосистемой MakerDAO и DAI-инфраструктурой ликвидности." } },
    { key: "documentation_quality", score: 86, dataStatus: "verified", note: { en: "Docs cover SparkLend parameters, governance links, and risk disclosures.", ru: "Доки покрывают параметры SparkLend, governance и раскрытие рисков." } },
  ],
  {
    en: "Spark receives an educational score of 80/100 in TJT's estimated framework. The trust overview reflects MakerDAO ecosystem backing and audit coverage — with governance coupling, utilization, and younger deployment history as residual risk context.",
    ru: "Spark получает образовательный балл 80/100 в оценочной рамке TJT. Trust overview отражает поддержку экосистемы MakerDAO и аудиты — с governance-связью, utilization и более короткой историей развёртывания как остаточный risk context.",
  },
  [
    { en: "SparkLend risk parameters can change via MakerDAO-aligned governance.", ru: "Параметры риска SparkLend могут меняться через governance, связанный с MakerDAO." },
    { en: "DAI and stablecoin market stress can affect Spark pool utilization and exits.", ru: "Стресс рынков DAI и стейблкоинов влияет на utilization и выход из пулов Spark." },
  ],
  "estimated",
);

const ROCKET_POOL_PROFILE = buildProfile(
  "rocket-pool",
  "Rocket Pool",
  [
    { key: "tvl", score: 78, dataStatus: "estimated", note: { en: "Established but smaller TVL vs dominant Ethereum LST leaders — estimated tier.", ru: "Устоявшийся, но меньший TVL vs доминирующих LST на Ethereum — оценочный уровень." } },
    { key: "protocol_age", score: 86, dataStatus: "estimated", note: { en: "~4+ years of rETH mainnet history — among earlier decentralized LST designs.", ru: "~4+ года rETH в mainnet — среди ранних децентрализованных LST." } },
    { key: "audits", score: 88, dataStatus: "placeholder", note: { en: "Multiple audits across node-deposit and minipool contracts — registry API not connected.", ru: "Несколько аудитов node-deposit и minipool — API реестра не подключён." } },
    { key: "exploit_history", score: 84, dataStatus: "placeholder", note: { en: "No major Rocket Pool core exploit in public record — incident feed pending.", ru: "Крупных эксплойтов core Rocket Pool в публичных записях нет — фид ожидается." } },
    { key: "liquidity", score: 76, dataStatus: "estimated", note: { en: "rETH DEX and lending liquidity is meaningful but thinner than stETH during stress.", ru: "DEX и lending ликвидность rETH значима, но тоньше stETH в стрессе." } },
    { key: "yield_sustainability", score: 78, dataStatus: "estimated", note: { en: "Staking rewards track validator yields minus protocol and node-operator fees.", ru: "Staking rewards следуют доходности валидаторов минус fee протокола и операторов." } },
    { key: "protocol_adoption", score: 80, dataStatus: "estimated", note: { en: "Decentralized operator model with meaningful DeFi integrations for rETH.", ru: "Децентрализованная модель операторов со значимыми DeFi-интеграциями rETH." } },
    { key: "documentation_quality", score: 86, dataStatus: "verified", note: { en: "Docs cover minipool mechanics, RPL collateral, and slashing rules.", ru: "Доки покрывают minipool, залог RPL и правила slashing." } },
  ],
  {
    en: "Rocket Pool receives an educational score of 82/100 in TJT's estimated framework. The trust overview reflects a mature decentralized LST design with documented audits — with slashing, rETH peg, and operator-set risks requiring independent verification.",
    ru: "Rocket Pool получает образовательный балл 82/100 в оценочной рамке TJT. Trust overview отражает зрелый децентрализованный LST с документированными аудитами — с рисками slashing, пега rETH и operator set для самостоятельной проверки.",
  },
  [
    { en: "Slashing penalties can affect rETH exchange rate and node-operator collateral.", ru: "Slashing может влиять на курс rETH и залог node operators." },
    { en: "rETH secondary-market discounts can widen during ETH market stress.", ru: "Дисконты rETH на вторичном рынке расширяются при стрессе ETH." },
  ],
  "estimated",
);

const ETHERFI_PROFILE = buildProfile(
  "etherfi",
  "EtherFi",
  [
    { key: "tvl", score: 76, dataStatus: "estimated", note: { en: "Rapid TVL growth in liquid restaking segment — estimated tier pending live feed.", ru: "Быстрый рост TVL в сегменте liquid restaking — оценочный уровень до live-фида." } },
    { key: "protocol_age", score: 62, dataStatus: "estimated", note: { en: "~2 years of mainnet liquid staking and restaking products — younger protocol age.", ru: "~2 года mainnet liquid staking и restaking — более молодой протокол." } },
    { key: "audits", score: 82, dataStatus: "placeholder", note: { en: "Audit reports referenced in protocol docs — full registry verification pending.", ru: "Аудиты указаны в документации — полная верификация реестра ожидается." } },
    { key: "exploit_history", score: 78, dataStatus: "placeholder", note: { en: "No major EtherFi core exploit in public record — incident feed not connected.", ru: "Крупных эксплойтов core EtherFi в публичных записях нет — фид не подключён." } },
    { key: "liquidity", score: 72, dataStatus: "estimated", note: { en: "eETH liquidity improving but restaking exit paths add complexity vs plain LSTs.", ru: "Ликвидность eETH растёт, но exit paths restaking сложнее vs простых LST." } },
    { key: "yield_sustainability", score: 68, dataStatus: "estimated", note: { en: "Yield combines staking and restaking components — variable with AVS incentives and network activity.", ru: "Доходность объединяет staking и restaking — переменна с AVS incentives и активностью сети." } },
    { key: "protocol_adoption", score: 74, dataStatus: "estimated", note: { en: "Growing integrations across restaking and DeFi — narrower history than Lido or Rocket Pool.", ru: "Растущие интеграции в restaking и DeFi — уже история vs Lido или Rocket Pool." } },
    { key: "documentation_quality", score: 78, dataStatus: "estimated", note: { en: "Docs cover restaking mechanics and withdrawal flows — evolving with product iterations.", ru: "Доки покрывают restaking и withdrawal — развиваются с итерациями продукта." } },
  ],
  {
    en: "EtherFi receives an educational score of 73/100 in TJT's estimated framework. The trust overview reflects meaningful liquid restaking adoption — with younger protocol age, restaking complexity, and AVS-dependent yield as elevated risk context.",
    ru: "EtherFi получает образовательный балл 73/100 в оценочной рамке TJT. Trust overview отражает принятие liquid restaking — с молодым возрастом протокола, сложностью restaking и AVS-зависимым yield как повышенный risk context.",
  },
  [
    { en: "Restaking exposes capital to additional slashing vectors beyond base Ethereum staking.", ru: "Restaking добавляет векторы slashing сверх базового Ethereum staking." },
    { en: "AVS incentive programs can change, affecting yield composition over time.", ru: "AVS incentive-программы меняются, влияя на состав доходности." },
  ],
  "estimated",
);

const PENDLE_PROFILE = buildProfile(
  "pendle",
  "Pendle",
  [
    { key: "tvl", score: 78, dataStatus: "estimated", note: { en: "Meaningful TVL in yield-trading markets — estimated from public DeFi aggregates.", ru: "Значимый TVL в yield-trading рынках — оценка по публичным DeFi-агрегатам." } },
    { key: "protocol_age", score: 76, dataStatus: "estimated", note: { en: "~3 years of mainnet yield-token markets — established but still evolving product surface.", ru: "~3 года yield-token рынков в mainnet — устоявшийся, но развивающийся продукт." } },
    { key: "audits", score: 84, dataStatus: "placeholder", note: { en: "Multiple audits reported for core Pendle contracts — registry API not connected.", ru: "Несколько аудитов core Pendle — API реестра не подключён." } },
    { key: "exploit_history", score: 80, dataStatus: "placeholder", note: { en: "No major Pendle core exploit in public record — incident feed verification pending.", ru: "Крупных эксплойтов core Pendle в публичных записях нет — верификация фида ожидается." } },
    { key: "liquidity", score: 74, dataStatus: "estimated", note: { en: "PT/YT markets have dedicated liquidity but can thin for newer maturities.", ru: "Рынки PT/YT имеют ликвидность, но она истончается для новых сроков погашения." } },
    { key: "yield_sustainability", score: 70, dataStatus: "estimated", note: { en: "Implied yields reflect market pricing of future yield — not guaranteed fixed returns.", ru: "Подразумеваемая доходность отражает рыночную оценку будущего yield — не гарантированная фиксированная доходность." } },
    { key: "protocol_adoption", score: 78, dataStatus: "estimated", note: { en: "Integrated across LST, stablecoin, and points-yield markets on Ethereum and L2s.", ru: "Интеграции в LST, стейблкоины и points-yield на Ethereum и L2." } },
    { key: "documentation_quality", score: 82, dataStatus: "verified", note: { en: "Docs explain PT/YT mechanics, maturity dates, and underlying asset risks.", ru: "Доки объясняют механику PT/YT, даты погашения и риски базовых активов." } },
  ],
  {
    en: "Pendle receives an educational score of 77/100 in TJT's estimated framework. The trust overview reflects established yield-trading infrastructure — with maturity-specific liquidity, underlying-asset, and implied-yield pricing risks as key context.",
    ru: "Pendle получает образовательный балл 77/100 в оценочной рамке TJT. Trust overview отражает устоявшуюся yield-trading инфраструктуру — с ликвидностью по срокам, рисками базовых активов и ценообразованием implied yield как ключевой контекст.",
  },
  [
    { en: "PT/YT positions carry underlying smart-contract and issuer risk from source assets.", ru: "Позиции PT/YT несут риски смарт-контрактов и эмитента базовых активов." },
    { en: "Implied fixed yields are market-derived — not principal guarantees at maturity.", ru: "Подразумеваемая фиксированная доходность рыночная — не гарантия principal при погашении." },
  ],
  "estimated",
);

const ETHENA_PROFILE = buildProfile(
  "ethena",
  "Ethena",
  [
    { key: "tvl", score: 74, dataStatus: "estimated", note: { en: "Rapid USDe supply growth — estimated TVL tier pending live oracle feed.", ru: "Быстрый рост supply USDe — оценочный TVL до live oracle-фида." } },
    { key: "protocol_age", score: 55, dataStatus: "estimated", note: { en: "~1 year of mainnet USDe history — among newer synthetic-dollar designs.", ru: "~1 год истории USDe в mainnet — среди новых synthetic-dollar дизайнов." } },
    { key: "audits", score: 80, dataStatus: "placeholder", note: { en: "Audit reports cited in Ethena documentation — registry API not connected.", ru: "Аудиты указаны в документации Ethena — API реестра не подключён." } },
    { key: "exploit_history", score: 76, dataStatus: "placeholder", note: { en: "No major Ethena core exploit in public record — incident feed verification pending.", ru: "Крупных эксплойтов core Ethena в публичных записях нет — верификация фида ожидается." } },
    { key: "liquidity", score: 72, dataStatus: "estimated", note: { en: "USDe DEX and CEX liquidity growing but peg stability depends on hedging infrastructure.", ru: "DEX и CEX ликвидность USDe растёт, но стабильность пега зависит от хеджирующей инфраструктуры." } },
    { key: "yield_sustainability", score: 62, dataStatus: "estimated", note: { en: "Yield from funding rates and staking components — highly variable with market conditions.", ru: "Доходность от funding rates и staking — сильно переменна с рыночными условиями." } },
    { key: "protocol_adoption", score: 72, dataStatus: "estimated", note: { en: "Integrated into DeFi collateral and CeFi partnerships — shorter track record than legacy stables.", ru: "Интеграции в залог DeFi и CeFi-партнёрства — короче track record vs legacy stables." } },
    { key: "documentation_quality", score: 76, dataStatus: "estimated", note: { en: "Docs cover delta-neutral mechanics and reserve transparency — evolving disclosures.", ru: "Доки покрывают delta-neutral механику и прозрачность резервов — развивающиеся раскрытия." } },
  ],
  {
    en: "Ethena receives an educational score of 70/100 in TJT's estimated framework. The trust overview reflects growing synthetic-dollar adoption — with hedging-dependency, funding-rate variability, and younger protocol age as elevated risk context.",
    ru: "Ethena получает образовательный балл 70/100 в оценочной рамке TJT. Trust overview отражает рост synthetic-dollar — с зависимостью от хеджирования, волатильностью funding rates и молодым возрастом протокола как повышенный risk context.",
  },
  [
    { en: "USDe stability depends on perpetual hedging and custodial exchange infrastructure.", ru: "Стабильность USDe зависит от perpetual-хеджирования и кастодиальной биржевой инфраструктуры." },
    { en: "Funding-rate yield can compress or turn negative during market stress.", ru: "Доходность от funding rates может сжиматься или становиться отрицательной в стрессе." },
  ],
  "estimated",
);

const COMPOUND_PROFILE = buildProfile(
  "compound",
  "Compound",
  [
    { key: "tvl", score: 86, dataStatus: "estimated", note: { en: "Multi-billion historical TVL tier on Ethereum and L2 deployments — estimated pending live feed.", ru: "Исторический TVL в миллиарды на Ethereum и L2 — оценка до live-фида." } },
    { key: "protocol_age", score: 94, dataStatus: "estimated", note: { en: "~6+ years of mainnet lending history — among earliest DeFi money markets.", ru: "~6+ лет lending в mainnet — среди ранних DeFi money markets." } },
    { key: "audits", score: 90, dataStatus: "placeholder", note: { en: "Extensive audit history across v2 and v3 deployments — registry API not connected.", ru: "Обширная история аудитов v2 и v3 — API реестра не подключён." } },
    { key: "exploit_history", score: 74, dataStatus: "placeholder", note: { en: "Historical governance and market events noted — verified incident feed not connected.", ru: "Зафиксированы события governance и рынков — верифицированный фид не подключён." } },
    { key: "liquidity", score: 84, dataStatus: "estimated", note: { en: "Deep pools on major assets — withdrawal timing varies with utilization.", ru: "Глубокие пулы на основных активах — timing вывода зависит от utilization." } },
    { key: "yield_sustainability", score: 80, dataStatus: "estimated", note: { en: "Borrow-demand-driven APY on stablecoins and ETH — rates shift with utilization.", ru: "APY от спроса на заём для stablecoins и ETH — ставки меняются с utilization." } },
    { key: "protocol_adoption", score: 88, dataStatus: "estimated", note: { en: "Long-standing DeFi integrations and institutional research coverage.", ru: "Долгие DeFi-интеграции и освещение в institutional research." } },
    { key: "documentation_quality", score: 88, dataStatus: "verified", note: { en: "Structured docs, governance forum, and risk parameter references publicly available.", ru: "Структурированные доки, governance forum и параметры риска доступны публично." } },
  ],
  {
    en: "Compound receives an educational score of 85/100 in TJT's estimated framework. The trust overview reflects pioneer lending-market maturity, deep TVL history, and documented audits — with governance, oracle, and utilization risks requiring independent verification.",
    ru: "Compound получает образовательный балл 85/100 в оценочной рамке TJT. Trust overview отражает зрелость pioneer lending, глубокую историю TVL и документированные аудиты — с рисками governance, oracle и utilization для самостоятельной проверки.",
  },
  [
    { en: "Variable APY and liquidation mechanics apply to all lending positions.", ru: "Переменный APY и механика ликвидаций применимы ко всем lending-позициям." },
    { en: "Cross-chain v3 deployments add bridge and oracle dependency beyond Ethereum core.", ru: "Cross-chain v3 добавляет зависимость от мостов и oracle помимо core Ethereum." },
  ],
  "estimated",
);

/** Static v0.1 Trust Score registry — 10 protocols (3 original + 7 expansion). */
export const TRUST_PROTOCOL_REGISTRY: Record<
  TrustProtocolSlug,
  ProtocolTrustProfile
> = {
  aave: AAVE_PROFILE,
  lido: LIDO_PROFILE,
  jito: JITO_PROFILE,
  morpho: MORPHO_PROFILE,
  spark: SPARK_PROFILE,
  "rocket-pool": ROCKET_POOL_PROFILE,
  etherfi: ETHERFI_PROFILE,
  pendle: PENDLE_PROFILE,
  ethena: ETHENA_PROFILE,
  compound: COMPOUND_PROFILE,
};

export const TRUST_PROTOCOL_SLUGS = Object.keys(
  TRUST_PROTOCOL_REGISTRY,
) as TrustProtocolSlug[];

export function isTrustProtocolSlug(
  slug: string,
): slug is TrustProtocolSlug {
  return slug in TRUST_PROTOCOL_REGISTRY;
}

export function getTrustProfile(
  slug: TrustProtocolSlug,
): ProtocolTrustProfile {
  return TRUST_PROTOCOL_REGISTRY[slug];
}

export function getTrustProfileOrNull(
  slug: string,
): ProtocolTrustProfile | null {
  return isTrustProtocolSlug(slug) ? TRUST_PROTOCOL_REGISTRY[slug] : null;
}
