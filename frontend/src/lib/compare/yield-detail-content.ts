import type {
  CompareEditorialFaqItem,
  CompareSlug,
  LocalizedString,
} from "@/lib/compare/types";

function L(en: string, ru: string): LocalizedString {
  return { en, ru };
}

type YieldCompareFaq = {
  slug: CompareSlug;
  faq: CompareEditorialFaqItem[];
};

const BEST_USDT_YIELD: YieldCompareFaq = {
  slug: "best-usdt-yield",
  faq: [
    {
      question: L("Where can I earn the most on USDT right now?", "Где сейчас больше всего заработать на USDT?"),
      answer: L(
        "Rates change daily, but Aave, Morpho, Compound, and Spark typically lead for USDT supply. Use the table above to compare current APY, which chain each route uses, and the Trust Score — then pick what fits your risk tolerance.",
        "Ставки меняются ежедневно, но Aave, Morpho, Compound и Spark обычно лидируют по supply USDT. Сравните в таблице текущий APY, сеть и Trust Score — и выберите под свой риск.",
      ),
    },
    {
      question: L("Is higher USDT APY always better?", "Более высокий APY на USDT всегда лучше?"),
      answer: L(
        "No. A higher rate often means a newer protocol, a riskier chain, or temporary token rewards that will disappear. Check the Trust Score and risk tier before chasing the top number.",
        "Нет. Более высокая ставка часто означает новый протокол, рискованную сеть или временные токен-награды. Проверьте Trust Score и уровень риска, прежде чем гнаться за цифрой.",
      ),
    },
    {
      question: L("Can I lose my USDT in DeFi lending?", "Могу ли я потерять USDT в DeFi lending?"),
      answer: L(
        "Yes. Smart contract bugs, oracle failures, or protocol exploits can impair funds — even on established platforms. TJT shows risk scores to help you compare, but you should never deposit more than you can afford to lose.",
        "Да. Баги смарт-контрактов, сбои оракулов или взломы протоколов могут затронуть средства — даже на известных платформах. TJT показывает оценки риска для сравнения, но не вкладывайте больше, чем готовы потерять.",
      ),
    },
  ],
};

const BEST_USDC_YIELD: YieldCompareFaq = {
  slug: "best-usdc-yield",
  faq: [
    {
      question: L("How does TJT compare USDC yield routes?", "Как TJT сравнивает USDC yield?"),
      answer: L(
        "Rows aggregate catalogued USDC supply opportunities with APY snapshots, supported chains, protocol Trust Score, and risk labels. Verify live rates on-chain before acting.",
        "Строки агрегируют USDC supply из каталога со снимками APY, сетями, Trust Score протокола и risk labels. Проверяйте live-ставки on-chain перед действием.",
      ),
    },
    {
      question: L("Are USDC yields the same across chains?", "USDC yield одинаков на всех сетях?"),
      answer: L(
        "No. APY, liquidity depth, bridge dependencies, and oracle stacks differ by deployment. Use chain columns in the table and linked safety guides for context.",
        "Нет. APY, ликвидность, мосты и oracle различаются по развёртываниям. Используйте колонку сети и safety-гиды для контекста.",
      ),
    },
    {
      question: L("Should I read USDC yield risks first?", "Стоит ли сначала прочитать риски USDC yield?"),
      answer: L(
        "Yes — TJT publishes a USDC yield risks learn guide linked from related pages. Educational context reduces surprise around depeg, utilization, and smart-contract risks.",
        "Да — TJT публикует learn-гид по рискам USDC yield. Образовательный контекст снижает сюрпризы по depeg, utilization и смарт-контрактам.",
      ),
    },
  ],
};

const BEST_ETH_STAKING: YieldCompareFaq = {
  slug: "best-eth-staking",
  faq: [
    {
      question: L("What counts as ETH staking on this page?", "Что считается ETH staking на этой странице?"),
      answer: L(
        "Catalogued liquid-staking and ETH-native yield routes — including Lido stETH, Rocket Pool rETH, EtherFi, and related lending supply where listed. Not solo validator operation.",
        "Маршруты liquid staking и ETH-native yield из каталога — Lido stETH, Rocket Pool rETH, EtherFi и lending supply где указано. Не solo validator.",
      ),
    },
    {
      question: L("How do liquid staking APYs compare?", "Как сравнивается APY liquid staking?"),
      answer: L(
        "APY reflects validator rewards minus protocol fees; restaking and incentive layers may differ. TJT shows catalog snapshots — verify live rates and slashing policies independently.",
        "APY отражает награды валидаторов минус комиссии протокола; restaking и incentives могут отличаться. TJT показывает снимки каталога — проверяйте live-ставки и slashing.",
      ),
    },
    {
      question: L("Does Trust Score replace slashing risk analysis?", "Trust Score заменяет анализ slashing?"),
      answer: L(
        "No. Trust Score v0.1 is an educational framework. Slashing, operator concentration, and LST peg risks remain — read linked safety and review pages.",
        "Нет. Trust Score v0.1 — образовательная рамка. Slashing, концентрация операторов и риски пега LST сохраняются — читайте safety и обзоры.",
      ),
    },
  ],
};

const BEST_SOL_STAKING: YieldCompareFaq = {
  slug: "best-sol-staking",
  faq: [
    {
      question: L("What SOL staking routes does TJT compare?", "Какие SOL staking маршруты сравнивает TJT?"),
      answer: L(
        "Primarily Jito liquid staking (jitoSOL) and catalogued Solana yield routes where available. APY may include MEV tips — mechanics differ from Ethereum LSTs.",
        "В основном Jito liquid staking (jitoSOL) и маршруты Solana из каталога. APY может включать MEV tips — механика отличается от Ethereum LST.",
      ),
    },
    {
      question: L("Is Solana staking risk the same as Ethereum?", "Риск стейкинга Solana такой же как Ethereum?"),
      answer: L(
        "No. Network uptime, validator economics, and DeFi composability differ. Compare Trust Score profiles and the is-jito-safe safety page for Solana-specific context.",
        "Нет. Uptime сети, экономика валидаторов и composability отличаются. Сравните Trust Score и is-jito-safe для контекста Solana.",
      ),
    },
    {
      question: L("Does TJT custody SOL for staking?", "TJT хранит SOL для стейкинга?"),
      answer: L(
        "No. TJT is a non-custodial information broker. Outbound links route to protocol interfaces where you sign transactions in your own wallet.",
        "Нет. TJT — некастодиальный информационный брокер. Исходящие ссылки ведут в интерфейсы протоколов, где вы подписываете транзакции в своём кошельке.",
      ),
    },
  ],
};

const BEST_ETH_RESTAKING: YieldCompareFaq = {
  slug: "best-eth-restaking",
  faq: [
    {
      question: L("What is ETH restaking in this comparison?", "Что такое ETH restaking в этом сравнении?"),
      answer: L(
        "Routes that extend Ethereum staking exposure into restaking layers (e.g. EtherFi eETH) with additional AVS and points mechanics. Higher complexity than vanilla liquid staking.",
        "Маршруты, расширяющие ETH staking в restaking-слои (напр. EtherFi eETH) с AVS и points. Выше сложность, чем vanilla liquid staking.",
      ),
    },
    {
      question: L("Is restaking yield more volatile?", "Yield restaking более волатилен?"),
      answer: L(
        "Often yes — incentive programs, AVS slashing exposure, and token mechanics can shift displayed APY. Treat catalog figures as snapshots, not promises.",
        "Часто да — incentives, AVS slashing и механика токенов меняют отображаемый APY. Считайте цифры каталога снимками, не обещаниями.",
      ),
    },
    {
      question: L("Who should avoid restaking routes?", "Кому лучше избегать restaking?"),
      answer: L(
        "Users prioritizing simplicity and minimal layered slashing exposure may prefer vanilla liquid staking Compare pages. TJT does not rank suitability — research independently.",
        "Пользователям, ценящим простоту и минимальную layered slashing-экспозицию, могут подойти vanilla liquid staking Compare. TJT не ранжирует пригодность — исследуйте самостоятельно.",
      ),
    },
  ],
};

const BEST_LIQUID_STAKING: YieldCompareFaq = {
  slug: "best-liquid-staking",
  faq: [
    {
      question: L("Which liquid staking tokens are compared?", "Какие liquid staking токены сравниваются?"),
      answer: L(
        "Ethereum LST routes in the TJT catalog — typically Lido stETH, Rocket Pool rETH, EtherFi eETH, and related entries. Rebasing vs exchange-rate mechanics differ by token.",
        "Ethereum LST из каталога TJT — обычно Lido stETH, Rocket Pool rETH, EtherFi eETH и связанные записи. Rebasing vs exchange-rate различается по токенам.",
      ),
    },
    {
      question: L("Why compare liquid staking instead of solo staking?", "Зачем сравнивать liquid staking вместо solo?"),
      answer: L(
        "Liquid staking unlocks composable DeFi exposure without running validators. Solo staking has different capital locks and operational burden — out of scope for this catalog table.",
        "Liquid staking открывает composable DeFi без валидаторов. Solo staking — другие блокировки капитала и операционная нагрузка — вне scope этой таблицы.",
      ),
    },
    {
      question: L("Does TJT guarantee LST peg stability?", "TJT гарантирует стабильность пега LST?"),
      answer: L(
        "No. Secondary-market discounts and liquidity crunches can affect LST prices. Trust Score and safety guides provide educational context only.",
        "Нет. Дисконты вторичного рынка и нехватка ликвидности влияют на цены LST. Trust Score и safety-гиды — только образовательный контекст.",
      ),
    },
  ],
};

const YIELD_FAQ_BY_SLUG: Partial<Record<CompareSlug, YieldCompareFaq>> = {
  "best-usdt-yield": BEST_USDT_YIELD,
  "best-usdc-yield": BEST_USDC_YIELD,
  "best-eth-staking": BEST_ETH_STAKING,
  "best-sol-staking": BEST_SOL_STAKING,
  "best-eth-restaking": BEST_ETH_RESTAKING,
  "best-liquid-staking": BEST_LIQUID_STAKING,
};

export function getCompareYieldFaq(
  slug: CompareSlug,
): CompareEditorialFaqItem[] | null {
  return YIELD_FAQ_BY_SLUG[slug]?.faq ?? null;
}
