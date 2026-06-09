import type { Locale } from "@/lib/i18n";
import { L, type SeoPilotPage } from "@/lib/seo-pilot/types";

function compareHref(lang: Locale, slug: string) {
  return `/${lang}/compare/${slug}`;
}
function earnHref(lang: Locale, asset: string) {
  return `/${lang}/earn/${asset}`;
}
function marketHref(lang: Locale, slug: string) {
  return `/${lang}/market/${slug}`;
}
function learnHref(lang: Locale, slug: string) {
  return `/${lang}/learn/${slug}`;
}
function safetyHref(lang: Locale, slug: string) {
  return `/${lang}/safety/${slug}`;
}

export const WAVE2_EARN_GUIDE_PAGES: SeoPilotPage[] = [
  {
    slug: "how-to-compare-usdc-yield",
    type: "earn_guide",
    hubSegment: "earn",
    metaTitle: L(
      "How to Compare USDC Yield — Educational Guide | TJT",
      "Как сравнивать USDC yield — образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn how USDC yield comparison works on TJT: APY, TVL, Trust Score, lending vs synthetic-dollar routes, and Compare workflows. Educational information only.",
      "Как работает сравнение USDC yield на TJT: APY, TVL, Trust Score, lending vs synthetic-dollar маршруты и workflow Compare. Только образовательная информация.",
    ),
    h1: L("How to Compare USDC Yield", "Как сравнивать USDC yield"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "USDC yield spans lending supply on Aave, Spark, Morpho, and Compound, plus synthetic-dollar routes like Ethena sUSDe. TJT helps you compare opportunities with Trust Score context — without ranking products as financial advice.",
      "USDC yield охватывает lending supply в Aave, Spark, Morpho и Compound, плюс synthetic-dollar маршруты вроде Ethena sUSDe. TJT помогает сравнивать opportunities с контекстом Trust Score — без ранжирования как финансовых советов.",
    ),
    sections: [
      {
        key: "how_comparison_works",
        title: L("How USDC yield comparison works", "Как работает сравнение USDC yield"),
        body: L(
          "TJT aggregates catalogued earn routes into the best USDC yield Compare page and the USDC earn hub. Each row shows protocol, chain, indicative APY, TVL tier, and Trust Score v0.1 factors.\n\nComparison is informational: evaluate differences side by side, then verify live rates and contract addresses on the official protocol app.\n\nRead usdc-yield-risks for USDC-specific risk context before acting on any figure.",
          "TJT агрегирует earn-маршруты в Compare best USDC yield и earn-хаб USDC. Каждая строка показывает протокол, сеть, ориентировочный APY, уровень TVL и факторы Trust Score v0.1.\n\nСравнение информационное: оценивайте различия, затем проверяйте live-ставки и адреса в официальном приложении протокола.\n\nЧитайте usdc-yield-risks для USDC-специфичного risk context.",
        ),
      },
      {
        key: "what_apy_means",
        title: L("What APY means", "Что означает APY"),
        body: L(
          "USDC lending APY moves with pool utilization — higher borrow demand raises supplier rates. Incentive programs can temporarily boost displayed APY.\n\nSynthetic-dollar yield (e.g. funding-rate based) follows different mechanics — not directly comparable to Aave supply APY without reading risk disclosures.\n\nTJT displays indicative catalog APY — cross-check on-chain before sizing positions.",
          "USDC lending APY меняется с utilization — высокий спрос на заём повышает ставки поставщиков. Incentive-программы временно повышают отображаемый APY.\n\nSynthetic-dollar yield (напр. от funding rates) следует другой механике — не сравнивайте напрямую с Aave supply APY без чтения раскрытий рисков.\n\nTJT показывает ориентировочный APY каталога — сверяйте on-chain перед изменением позиций.",
        ),
      },
      {
        key: "why_tvl_matters",
        title: L("Why TVL matters", "Почему важен TVL"),
        body: L(
          "Deeper TVL on USDC pools often supports more liquid exits during normal conditions — but high utilization can still delay withdrawals.\n\nCompare TVL tiers on spark-vs-aave and compound-vs-morpho pages for lending-market depth context.\n\nThin pools with attractive APY may carry elevated liquidity risk — see what-is-protocol-tvl learn guide.",
          "Более глубокий TVL в USDC-пулах часто поддерживает более ликвидный выход в нормальных условиях — но высокий utilization всё равно может задерживать вывод.\n\nСравните уровни TVL на spark-vs-aave и compound-vs-morpho для контекста глубины lending.\n\nТонкие пулы с привлекательным APY могут нести повышенный риск ликвидности — см. what-is-protocol-tvl.",
        ),
      },
      {
        key: "why_trust_score_matters",
        title: L("Why Trust Score matters", "Почему важен Trust Score"),
        body: L(
          "TJT Trust Score v0.1 weights audits, TVL, protocol age, exploit history, and liquidity factors. Aave (~85) and Compound (~85) score higher than Ethena (~70) in the educational framework — reflecting category and maturity differences.\n\nTrust Score helps risk-adjust USDC yield comparison but does not certify safety. Pair with is-aave-safe, is-spark-safe, and is-ethena-safe safety pages.",
          "TJT Trust Score v0.1 взвешивает аудиты, TVL, возраст, эксплойты и ликвидность. Aave (~85) и Compound (~85) выше Ethena (~70) в образовательной рамке — отражая категорию и зрелость.\n\nTrust Score помогает risk-adjust сравнение USDC yield, но не сертифицирует безопасность. Сочетайте с is-aave-safe, is-spark-safe и is-ethena-safe.",
        ),
      },
      {
        key: "how_to_compare_protocols",
        title: L("How to compare protocols", "Как сравнивать протоколы"),
        body: L(
          "Step 1 — Identify yield type: organic lending vs funding-rate synthetic dollar.\n\nStep 2 — Filter by chain: Ethereum L1 vs Arbitrum L2 carry different gas and bridge risks.\n\nStep 3 — Read protocol reviews (aave-review, spark-review, ethena-review).\n\nStep 4 — Open ethena-vs-aave Compare for synthetic-dollar vs lending context.\n\nStep 5 — Verify live utilization and withdrawal conditions on-chain.",
          "Шаг 1 — Тип yield: органический lending vs funding-rate synthetic dollar.\n\nШаг 2 — Фильтр по сети: Ethereum L1 vs Arbitrum L2 — разные gas и bridge-риски.\n\nШаг 3 — Обзоры протоколов (aave-review, spark-review, ethena-review).\n\nШаг 4 — Compare ethena-vs-aave для synthetic-dollar vs lending.\n\nШаг 5 — Проверьте live utilization и условия вывода on-chain.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best USDC yield — primary comparison table.\n\nEthena vs Aave — synthetic-dollar vs lending stablecoin yield.\n\nSpark vs Aave and Compound vs Morpho — lending-market depth comparisons with Trust Score.",
          "Best USDC yield — основная таблица сравнения.\n\nEthena vs Aave — synthetic-dollar vs lending stablecoin yield.\n\nSpark vs Aave и Compound vs Morpho — сравнения глубины lending с Trust Score.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is USDC yield safer than USDT yield?", "USDC yield безопаснее USDT yield?"),
        answer: L(
          "Issuer profiles differ (Circle vs Tether), but DeFi protocol risks apply to both. Compare specific routes with Trust Score — not the ticker alone.",
          "Профили эмитентов различаются (Circle vs Tether), но риски DeFi-протоколов применимы к обоим. Сравнивайте маршруты через Trust Score — не только тикер.",
        ),
      },
      {
        question: L("Does TJT execute USDC deposits?", "Выполняет ли TJT депозиты USDC?"),
        answer: L(
          "No. TJT is a non-custodial information broker. Outbound CPA links route to protocol apps; you sign transactions in your own wallet.",
          "Нет. TJT — некастодиальный информационный брокер. CPA-ссылки ведут в приложения протоколов; транзакции подписываете в своём кошельке.",
        ),
      },
      {
        question: L("Where should I start?", "С чего начать?"),
        answer: L(
          "Open the USDC earn hub, then best USDC yield Compare, then read usdc-yield-risks for structured risk context.",
          "Откройте earn-хаб USDC, затем Compare best USDC yield, затем usdc-yield-risks для структурированного risk context.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "ethena-vs-aave"), label: L("Ethena vs Aave comparison", "Сравнение Ethena vs Aave"), type: "compare" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: (lang) => marketHref(lang, "usd-coin"), label: L("USDC market context", "Рыночный контекст USDC"), type: "market" },
      { href: (lang) => learnHref(lang, "usdc-yield-risks"), label: L("USDC yield risks", "Риски USDC yield"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-aave-safe"), label: L("Is Aave safe?", "Безопасен ли Aave?"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdc-yield"),
    keywords: ["usdc yield", "compare usdc yield", "stablecoin yield", "usdc apy comparison"],
  },
  {
    slug: "how-to-compare-eth-yield",
    type: "earn_guide",
    hubSegment: "earn",
    metaTitle: L(
      "How to Compare ETH Yield — Educational Guide | TJT",
      "Как сравнивать ETH yield — образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn how ETH yield comparison works on TJT: liquid staking, restaking, lending supply, Trust Score, and Compare workflows. Educational information only.",
      "Как работает сравнение ETH yield на TJT: liquid staking, restaking, lending supply, Trust Score и workflow Compare. Только образовательная информация.",
    ),
    h1: L("How to Compare ETH Yield", "Как сравнивать ETH yield"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "ETH yield routes include liquid staking (Lido, Rocket Pool), liquid restaking (EtherFi), lending supply (Aave), and yield-trading layers (Pendle). TJT Compare pages and Trust Score indicators help structure research — not financial advice.",
      "Маршруты ETH yield включают liquid staking (Lido, Rocket Pool), liquid restaking (EtherFi), lending supply (Aave) и yield-trading (Pendle). Compare и Trust Score на TJT структурируют исследование — не финансовый совет.",
    ),
    sections: [
      {
        key: "how_comparison_works",
        title: L("How ETH yield comparison works", "Как работает сравнение ETH yield"),
        body: L(
          "TJT organizes ETH opportunities across best ETH staking, best liquid staking, and best ETH restaking Compare pages plus the ETH earn hub.\n\nEach route carries distinct risk: slashing for staking, AVS slashing for restaking, utilization for lending, maturity liquidity for Pendle PT/YT.\n\nUse this guide to map yield type before comparing headline APY figures.",
          "TJT организует ETH opportunities в Compare best ETH staking, best liquid staking, best ETH restaking и earn-хаб ETH.\n\nКаждый маршрут несёт свой риск: slashing для staking, AVS slashing для restaking, utilization для lending, ликвидность по срокам для Pendle PT/YT.\n\nИспользуйте гид для mapping типа yield перед сравнением headline APY.",
        ),
      },
      {
        key: "what_apy_means",
        title: L("What APY means", "Что означает APY"),
        body: L(
          "Liquid staking APY reflects validator rewards minus protocol fees. Restaking adds AVS incentive layers that can change over time. Lending supply APY reflects borrow demand on ETH or WETH pools.\n\nPendle implied yields are market-priced — not guaranteed fixed returns.\n\nTJT catalog APY is indicative — verify live rates on protocol interfaces.",
          "APY liquid staking отражает награды валидаторов минус fee протокола. Restaking добавляет AVS incentives, меняющиеся со временем. Lending supply APY — спрос на заём в ETH/WETH пулах.\n\nImplied yield Pendle — рыночная цена, не гарантированная фиксированная доходность.\n\nAPY каталога TJT ориентировочный — проверяйте live-ставки в интерфейсах протоколов.",
        ),
      },
      {
        key: "why_tvl_matters",
        title: L("Why TVL matters", "Почему важен TVL"),
        body: L(
          "Lido's deep stETH liquidity supports secondary-market exits; thinner rETH or eETH pools can widen discounts during stress.\n\nLending TVL affects withdrawal timing when utilization spikes.\n\nCompare TVL tiers on lido-vs-rocket-pool and pendle-vs-etherfi pages for context.",
          "Глубокая ликвидность stETH Lido поддерживает выход на вторичном рынке; более тонкие пулы rETH или eETH расширяют дисконты в стрессе.\n\nTVL lending влияет на timing вывода при скачках utilization.\n\nСравните уровни TVL на lido-vs-rocket-pool и pendle-vs-etherfi.",
        ),
      },
      {
        key: "why_trust_score_matters",
        title: L("Why Trust Score matters", "Почему важен Trust Score"),
        body: L(
          "Trust Score v0.1 helps distinguish mature liquid staking (Lido ~88, Rocket Pool ~82) from younger restaking (EtherFi ~73) and yield-trading (Pendle ~77).\n\nHigher APY from restaking or incentives often correlates with elevated risk context — not better risk-adjusted outcomes.\n\nRead is-etherfi-safe and is-lido-safe alongside Compare tables.",
          "Trust Score v0.1 отличает зрелый liquid staking (Lido ~88, Rocket Pool ~82) от молодого restaking (EtherFi ~73) и yield-trading (Pendle ~77).\n\nБолее высокий APY от restaking или incentives часто коррелирует с повышенным risk context — не с лучшим risk-adjusted исходом.\n\nЧитайте is-etherfi-safe и is-lido-safe вместе с таблицами Compare.",
        ),
      },
      {
        key: "how_to_compare_protocols",
        title: L("How to compare protocols", "Как сравнивать протоколы"),
        body: L(
          "Step 1 — Choose yield category: liquid staking vs restaking vs lending vs yield-trading.\n\nStep 2 — Open the matching Compare page (best liquid staking, best ETH restaking, or best ETH staking).\n\nStep 3 — Read what-is-liquid-staking and what-is-restaking learn guides.\n\nStep 4 — Check peg/slashing risk on safety pages.\n\nStep 5 — Verify withdrawal paths before committing capital.",
          "Шаг 1 — Категория yield: liquid staking vs restaking vs lending vs yield-trading.\n\nШаг 2 — Откройте соответствующий Compare (best liquid staking, best ETH restaking или best ETH staking).\n\nШаг 3 — Learn-гиды what-is-liquid-staking и what-is-restaking.\n\nШаг 4 — Риск пега/slashing на safety-страницах.\n\nШаг 5 — Проверьте пути вывода перед капиталом.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best ETH staking and best liquid staking — Lido, Rocket Pool, EtherFi catalog context.\n\nBest ETH restaking — restaking-focused routes with Trust Score.\n\nPendle vs EtherFi — yield-trading vs direct restaking exposure.\n\nAave vs Lido — lending vs liquid staking cross-category context.",
          "Best ETH staking и best liquid staking — контекст Lido, Rocket Pool, EtherFi.\n\nBest ETH restaking — restaking-маршруты с Trust Score.\n\nPendle vs EtherFi — yield-trading vs прямой restaking.\n\nAave vs Lido — кросс-категорийный контекст lending vs liquid staking.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is restaking yield higher than liquid staking?", "Restaking yield выше liquid staking?"),
        answer: L(
          "Often yes on headline APY, but restaking adds AVS slashing vectors. Compare risk-adjusted context on best ETH restaking and is-etherfi-safe.",
          "Часто да по headline APY, но restaking добавляет AVS slashing. Сравните risk-adjusted контекст на best ETH restaking и is-etherfi-safe.",
        ),
      },
      {
        question: L("Can I supply ETH on Aave and stake simultaneously?", "Можно ли supply ETH в Aave и стейкать одновременно?"),
        answer: L(
          "You typically choose one exposure per ETH unit — or use LST collateral in lending strategies that layer composability risk. Research liquidation thresholds independently.",
          "Обычно одна экспозиция на единицу ETH — или LST как залог в lending со слоённым composability risk. Изучайте пороги ликвидации самостоятельно.",
        ),
      },
      {
        question: L("Where should I start on TJT?", "С чего начать на TJT?"),
        answer: L(
          "ETH earn hub → best liquid staking Compare → etherfi-review if exploring restaking.",
          "Earn-хаб ETH → Compare best liquid staking → etherfi-review при исследовании restaking.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-liquid-staking"), label: L("Best liquid staking comparison", "Сравнение лучшего liquid staking"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-eth-restaking"), label: L("Best ETH restaking comparison", "Сравнение лучшего ETH restaking"), type: "compare" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
      { href: (lang) => marketHref(lang, "ethereum"), label: L("Ethereum market context", "Рыночный контекст Ethereum"), type: "market" },
      { href: (lang) => learnHref(lang, "what-is-liquid-restaking"), label: L("What is liquid restaking?", "Что такое liquid restaking?"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-lido-safe"), label: L("Is Lido safe?", "Безопасен ли Lido?"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-liquid-staking"),
    keywords: ["eth yield", "compare eth yield", "eth staking apy", "eth restaking comparison"],
  },
  {
    slug: "how-to-compare-sol-yield",
    type: "earn_guide",
    hubSegment: "earn",
    metaTitle: L(
      "How to Compare SOL Yield — Educational Guide | TJT",
      "Как сравнивать SOL yield — образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn how SOL yield comparison works on TJT: Jito liquid staking, MEV rewards, Trust Score, network risks, and Compare workflows. Educational information only.",
      "Как работает сравнение SOL yield на TJT: Jito liquid staking, MEV rewards, Trust Score, риски сети и workflow Compare. Только образовательная информация.",
    ),
    h1: L("How to Compare SOL Yield", "Как сравнивать SOL yield"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "SOL yield on TJT centers on liquid staking via Jito jitoSOL — earning validator rewards plus MEV tips. TJT helps compare opportunities with Trust Score context and Solana-specific risk factors — not financial advice.",
      "SOL yield на TJT центрируется на liquid staking через Jito jitoSOL — награды валидаторов плюс MEV tips. TJT помогает сравнивать opportunities с Trust Score и рисками Solana — не финансовый совет.",
    ),
    sections: [
      {
        key: "how_comparison_works",
        title: L("How SOL yield comparison works", "Как работает сравнение SOL yield"),
        body: L(
          "The best SOL staking Compare page aggregates catalogued Jito routes with APY, chain context, and Trust Score v0.1 indicators.\n\nSOL earn hub links to protocol reviews, safety pages, and market context for Solana.\n\nComparison is informational — verify live jitoSOL exchange rate and protocol parameters independently.",
          "Compare best SOL staking агрегирует маршруты Jito с APY, контекстом сети и Trust Score v0.1.\n\nEarn-хаб SOL связан с обзорами, safety и рыночным контекстом Solana.\n\nСравнение информационное — проверяйте live курс jitoSOL и параметры протокола самостоятельно.",
        ),
      },
      {
        key: "what_apy_means",
        title: L("What APY means", "Что означает APY"),
        body: L(
          "JitoSOL yield combines base Solana staking rewards with MEV tips distributed to stakers. Displayed APY fluctuates with network activity and MEV capture rates.\n\nExchange-rate LST models accrue yield via token appreciation vs wallet balance rebasing.\n\nTJT catalog APY is indicative — not a forward guarantee.",
          "Yield jitoSOL объединяет базовые награды стейкинга Solana с MEV tips для стейкеров. Отображаемый APY меняется с активностью сети и захватом MEV.\n\nExchange-rate LST начисляет yield через рост токена vs rebasing баланса.\n\nAPY каталога TJT ориентировочный — не гарантия будущей доходности.",
        ),
      },
      {
        key: "why_tvl_matters",
        title: L("Why TVL matters", "Почему важен TVL"),
        body: L(
          "Jito TVL depth affects jitoSOL DEX liquidity and exit options during market stress.\n\nSolana network outages can freeze DeFi actions — a distinct operational risk vs Ethereum LSTs.\n\nRead jito-review and is-jito-safe for protocol-specific TVL and liquidity context.",
          "Глубина TVL Jito влияет на DEX-ликвидность jitoSOL и варианты выхода в стрессе.\n\nOutage Solana может заморозить DeFi — отдельный операционный риск vs Ethereum LST.\n\nЧитайте jito-review и is-jito-safe для TVL и ликвидности Jito.",
        ),
      },
      {
        key: "why_trust_score_matters",
        title: L("Why Trust Score matters", "Почему важен Trust Score"),
        body: L(
          "Jito scores ~79/100 in TJT Trust Score v0.1 — strong Solana liquid-staking adoption with MEV complexity as a risk context factor.\n\nTrust Score does not eliminate slashing, network, or smart contract risks.\n\nPair with lido-vs-jito Compare for cross-chain liquid-staking perspective.",
          "Jito ~79/100 в TJT Trust Score v0.1 — сильное принятие liquid staking Solana со сложностью MEV как фактор risk context.\n\nTrust Score не устраняет slashing, сетевые и смарт-контрактные риски.\n\nСочетайте с Compare lido-vs-jito для кросс-чейн перспективы liquid staking.",
        ),
      },
      {
        key: "how_to_compare_protocols",
        title: L("How to compare SOL yield routes", "Как сравнивать маршруты SOL yield"),
        body: L(
          "Step 1 — Start at best SOL staking Compare for catalog APY and Trust Score.\n\nStep 2 — Read jito-review and is-jito-safe for Jito-specific mechanics.\n\nStep 3 — Review what-is-liquid-staking for LST fundamentals.\n\nStep 4 — Check Solana market page for price and sentiment context.\n\nStep 5 — Use outbound CPA offer link only after independent verification.",
          "Шаг 1 — Compare best SOL staking для APY каталога и Trust Score.\n\nШаг 2 — jito-review и is-jito-safe для механики Jito.\n\nШаг 3 — what-is-liquid-staking для основ LST.\n\nШаг 4 — Страница market Solana для цены и тональности.\n\nШаг 5 — CPA-оффер только после самостоятельной проверки.",
        ),
      },
      {
        key: "related_compare",
        title: L("Related Compare pages", "Связанные страницы Compare"),
        body: L(
          "Best SOL staking — primary SOL yield table.\n\nLido vs Jito — cross-chain liquid-staking comparison (ETH vs SOL).\n\nAave vs Jito — lending vs Solana staking portfolio context.",
          "Best SOL staking — основная таблица SOL yield.\n\nLido vs Jito — кросс-чейн сравнение liquid staking (ETH vs SOL).\n\nAave vs Jito — контекст lending vs staking Solana в портфеле.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is Jito the only SOL yield route on TJT?", "Jito — единственный маршрут SOL yield на TJT?"),
        answer: L(
          "Jito is the primary catalogued Solana liquid-staking protocol today. The Compare page updates as new CPA routes are added to config.json.",
          "Jito — основной catalogued протокол liquid staking Solana сегодня. Compare обновляется при добавлении новых CPA-маршрутов в config.json.",
        ),
      },
      {
        question: L("What is MEV-boosted staking?", "Что такое MEV-boosted staking?"),
        answer: L(
          "MEV (Maximal Extractable Value) tips from block production can supplement base validator rewards — a component of JitoSOL yield with its own variability.",
          "MEV tips от производства блоков дополняют базовые награды валидаторов — компонент yield jitoSOL со своей волатильностью.",
        ),
      },
      {
        question: L("Does TJT custody SOL for staking?", "Хранит ли TJT SOL для стейкинга?"),
        answer: L(
          "No. TJT is non-custodial. You interact with Jito or other protocols directly from your wallet via outbound links.",
          "Нет. TJT некастодиальный. Вы взаимодействуете с Jito и др. напрямую из кошелька через исходящие ссылки.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-sol-staking"), label: L("Best SOL staking comparison", "Сравнение лучшего SOL staking"), type: "compare" },
      { href: (lang) => compareHref(lang, "lido-vs-jito"), label: L("Lido vs Jito comparison", "Сравнение Lido vs Jito"), type: "compare" },
      { href: (lang) => earnHref(lang, "sol"), label: L("SOL earn hub", "Earn-хаб SOL"), type: "earn" },
      { href: (lang) => marketHref(lang, "solana"), label: L("Solana market context", "Рыночный контекст Solana"), type: "market" },
      { href: (lang) => learnHref(lang, "what-is-liquid-staking"), label: L("What is liquid staking?", "Что такое liquid staking?"), type: "learn" },
      { href: (lang) => safetyHref(lang, "is-jito-safe"), label: L("Is Jito safe?", "Безопасен ли Jito?"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-sol-staking"),
    keywords: ["sol yield", "compare sol yield", "jito staking", "solana liquid staking"],
  },
];
