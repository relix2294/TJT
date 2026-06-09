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

/** Static v0.1 Trust Score registry — Aave, Lido, Jito only. */
export const TRUST_PROTOCOL_REGISTRY: Record<
  TrustProtocolSlug,
  ProtocolTrustProfile
> = {
  aave: AAVE_PROFILE,
  lido: LIDO_PROFILE,
  jito: JITO_PROFILE,
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
