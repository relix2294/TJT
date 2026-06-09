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

export const WAVE1_LEARN_PAGES: SeoPilotPage[] = [
  {
    slug: "what-is-restaking",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "What Is Restaking? Educational Guide | TJT",
      "Что такое restaking? Образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn how Ethereum restaking works, why it matters, AVS slashing risks, examples with EtherFi, and TJT Compare links for ETH restaking research.",
      "Как работает Ethereum restaking, зачем он нужен, риски AVS slashing, примеры с EtherFi и ссылки TJT Compare для исследования ETH restaking.",
    ),
    h1: L("What Is Restaking?", "Что такое restaking?"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "Restaking lets staked ETH secure additional services (AVSs) beyond Ethereum consensus, earning extra rewards — but adding slashing vectors and contract complexity. Educational information only.",
      "Restaking позволяет застейканному ETH обеспечивать дополнительные сервисы (AVS) сверх консенсуса Ethereum, получая дополнительные награды — но добавляя векторы slashing и сложность контрактов. Только образовательная информация.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "After Ethereum staking, restaking protocols let validators or pooled stake opt into securing Actively Validated Services — data availability, oracles, bridges, and other middleware.\n\nParticipants earn AVS rewards on top of base staking yield.\n\nRestaking reuses economic security from ETH stake but introduces additional slashing conditions if AVS rules are violated.",
          "После Ethereum staking протоколы restaking позволяют валидаторам или пулу stake подключаться к Actively Validated Services — data availability, oracles, мосты и другой middleware.\n\nУчастники получают AVS rewards поверх базового staking yield.\n\nRestaking переиспользует экономическую безопасность ETH stake, но вводит дополнительные условия slashing при нарушении правил AVS.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Restaking expands yield opportunities for ETH holders beyond plain validator rewards.\n\nRisk profile changes materially — slashing can occur from AVS misbehavior, not just validator faults.\n\nTJT Compare and Trust Score pages help researchers contrast restaking routes with plain liquid staking.",
          "Restaking расширяет yield-возможности для держателей ETH сверх наград валидаторов.\n\nПрофиль риска существенно меняется — slashing может происходить от misbehavior AVS, не только от ошибок валидатора.\n\nTJT Compare и Trust Score помогают сравнивать restaking-маршруты с plain liquid staking.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Treating restaking APY as durable without reading AVS incentive schedules.\n\nIgnoring additional slashing vectors when restaking is layered on liquid staking tokens.\n\nAssuming restaking receipt tokens always trade 1:1 with ETH during market stress.",
          "Восприятие restaking APY как устойчивого без чтения расписаний AVS incentives.\n\nИгнорирование дополнительных векторов slashing при restaking поверх LST.\n\nПредположение, что restaking receipt-токены всегда 1:1 с ETH в стрессе рынка.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "EtherFi eETH: liquid restaking receipt accruing staking plus AVS rewards — see EtherFi protocol review.\n\nEigenLayer native restaking: validators opt into AVS allocations directly.\n\nPendle markets on restaking tokens: yield-trading exposure without direct restaking deposits.",
          "EtherFi eETH: liquid restaking receipt с staking и AVS rewards — см. обзор EtherFi.\n\nEigenLayer native restaking: валидаторы подключаются к AVS напрямую.\n\nРынки Pendle на restaking-токенах: yield-trading без прямого restaking-депозита.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "AVS slashing penalties beyond base Ethereum staking slashing.\n\nSmart contract risk in restaking delegation and withdrawal paths.\n\nYield variability as AVS incentive programs change.\n\nLiquidity and peg risk on liquid restaking receipt tokens.",
          "AVS slashing сверх базового Ethereum staking slashing.\n\nРиск смарт-контрактов в delegation и withdrawal paths restaking.\n\nВолатильность yield при изменении AVS incentive-программ.\n\nРиск ликвидности и пега на liquid restaking receipt-токенах.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Read what-is-liquid-restaking for receipt-token mechanics, EtherFi review for protocol context, and best ETH restaking Compare for market data with Trust Score indicators.",
          "Читайте what-is-liquid-restaking для механики receipt-токенов, обзор EtherFi для контекста протокола и best ETH restaking Compare для рыночных данных с Trust Score.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is restaking the same as staking?", "Restaking — то же, что staking?"),
        answer: L(
          "No. Staking secures Ethereum consensus. Restaking reuses staked ETH to secure additional AVSs with extra rewards and extra slashing risk.",
          "Нет. Staking обеспечивает консенсус Ethereum. Restaking переиспользует застейканный ETH для AVS с дополнительными наградами и slashing-риском.",
        ),
      },
      {
        question: L("Can I restake without 32 ETH?", "Можно ли restake без 32 ETH?"),
        answer: L(
          "Yes, via liquid restaking protocols like EtherFi that pool deposits and issue receipt tokens such as eETH.",
          "Да, через liquid restaking-протоколы вроде EtherFi, пулящие депозиты и выпускающие receipt-токены вроде eETH.",
        ),
      },
      {
        question: L("How does TJT cover restaking?", "Как TJT охватывает restaking?"),
        answer: L(
          "Protocol reviews, safety pages, learn guides, and Compare tables provide educational context and Trust Score v0.1 indicators — not financial advice.",
          "Обзоры протоколов, safety-страницы, learn-гиды и Compare дают образовательный контекст и Trust Score v0.1 — не финансовый совет.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-eth-restaking"), label: L("Best ETH restaking comparison", "Сравнение лучшего ETH restaking"), type: "compare" },
      { href: (lang) => compareHref(lang, "pendle-vs-etherfi"), label: L("Pendle vs EtherFi comparison", "Сравнение Pendle vs EtherFi"), type: "compare" },
      { href: (lang) => learnHref(lang, "what-is-liquid-restaking"), label: L("What is liquid restaking?", "Что такое liquid restaking?"), type: "learn" },
      { href: (lang) => earnHref(lang, "eth"), label: L("ETH earn hub", "Earn-хаб ETH"), type: "earn" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-restaking"),
    keywords: ["restaking", "what is restaking", "eigenlayer", "avs staking", "eth restaking"],
  },
  {
    slug: "what-is-liquid-restaking",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "What Is Liquid Restaking? Educational Guide | TJT",
      "Что такое liquid restaking? Образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn how liquid restaking works, eETH-style receipt tokens, composability, risks vs plain LSTs, and TJT Compare links.",
      "Как работает liquid restaking, receipt-токены вроде eETH, композируемость, риски vs plain LST и ссылки TJT Compare.",
    ),
    h1: L("What Is Liquid Restaking?", "Что такое liquid restaking?"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "Liquid restaking combines liquid staking receipt tokens with restaking yield — letting users hold a transferable token (e.g. eETH) while earning staking plus AVS rewards. Composability comes with added slashing and complexity risk.",
      "Liquid restaking объединяет receipt-токены liquid staking с restaking yield — пользователь держит передаваемый токен (напр. eETH), получая staking и AVS rewards. Композируемость добавляет slashing и сложность.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "Users deposit ETH into a liquid restaking protocol. The protocol stakes ETH, opts into restaking AVSs, and mints a receipt token representing pooled stake plus rewards.\n\nReceipt tokens trade on markets and integrate with DeFi — lending, DEXs, Pendle yield markets.\n\nWithdrawal may involve queues or secondary-market exits depending on protocol design.",
          "Пользователи вносят ETH в liquid restaking-протокол. Протокол стейкает ETH, подключается к AVS restaking и минтит receipt-токен как пул stake плюс награды.\n\nReceipt-токены торгуются и интегрируются в DeFi — lending, DEX, рынки Pendle.\n\nВывод может включать очереди или выход на вторичном рынке в зависимости от дизайна протокола.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Capital efficiency: restaking yield plus DeFi utility on the same ETH exposure.\n\nLower minimums versus solo validator or direct EigenLayer operations.\n\nComparison research: liquid restaking competes with plain LSTs and yield-trading — TJT Compare helps evaluate trade-offs with Trust Score context.",
          "Эффективность капитала: restaking yield плюс DeFi utility на той же ETH-экспозиции.\n\nНиже минимумы vs solo validator или прямой EigenLayer.\n\nСравнительные исследования: liquid restaking конкурирует с plain LST и yield-trading — TJT Compare оценивает компромиссы через Trust Score.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Equating liquid restaking tokens with plain LST risk profiles.\n\nIgnoring AVS slashing when using eETH as lending collateral.\n\nChasing peak restaking APY without reading incentive program duration.",
          "Приравнивание liquid restaking-токенов к профилю риска plain LST.\n\nИгнорирование AVS slashing при использовании eETH как залога.\n\nПогоня за пиковым restaking APY без чтения срока incentive-программ.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "EtherFi eETH on Ethereum — liquid restaking with DeFi integrations; see EtherFi review and is-etherfi-safe.\n\nPendle PT/YT on restaking tokens — yield-trading layer atop liquid restaking exposure.\n\nContrast with Lido stETH — plain liquid staking without restaking slashing vectors.",
          "EtherFi eETH на Ethereum — liquid restaking с DeFi-интеграциями; см. обзор EtherFi и is-etherfi-safe.\n\nPendle PT/YT на restaking-токенах — yield-trading поверх liquid restaking.\n\nКонтраст с Lido stETH — plain liquid staking без restaking slashing.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "AVS slashing beyond base validator slashing.\n\nPeg discounts on secondary markets during liquidity stress.\n\nSmart contract and operator risk in restaking delegation.\n\nYounger protocol age for many liquid restaking deployments versus established LSTs.",
          "AVS slashing сверх базового validator slashing.\n\nДисконты пега на вторичных рынках в стрессе ликвидности.\n\nРиск смарт-контрактов и операторов в restaking delegation.\n\nМолодой возраст многих liquid restaking vs устоявшихся LST.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Pair with what-is-restaking for AVS concepts, best liquid staking and best ETH restaking Compare pages, and Pendle vs EtherFi for yield-trading contrast.",
          "Сочетайте с what-is-restaking для концепций AVS, Compare best liquid staking и best ETH restaking и Pendle vs EtherFi для контраста yield-trading.",
        ),
      },
    ],
    faq: [
      {
        question: L("How is liquid restaking different from liquid staking?", "Чем liquid restaking отличается от liquid staking?"),
        answer: L(
          "Liquid staking earns validator rewards via receipt tokens (stETH, rETH). Liquid restaking adds AVS rewards and AVS slashing risk on top of staking.",
          "Liquid staking даёт награды валидаторов через receipt-токены (stETH, rETH). Liquid restaking добавляет AVS rewards и AVS slashing поверх staking.",
        ),
      },
      {
        question: L("Is eETH a liquid restaking token?", "eETH — liquid restaking токен?"),
        answer: L(
          "Yes. eETH is EtherFi's liquid restaking receipt token — see the EtherFi protocol review for mechanics and risks.",
          "Да. eETH — liquid restaking receipt EtherFi — см. обзор EtherFi для механики и рисков.",
        ),
      },
      {
        question: L("Where should I compare liquid restaking on TJT?", "Где сравнить liquid restaking на TJT?"),
        answer: L(
          "Start with best ETH restaking and best liquid staking Compare pages, then read EtherFi safety and review pages for protocol-specific context.",
          "Начните с Compare best ETH restaking и best liquid staking, затем прочитайте safety и обзор EtherFi для контекста протокола.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-eth-restaking"), label: L("Best ETH restaking comparison", "Сравнение лучшего ETH restaking"), type: "compare" },
      { href: (lang) => compareHref(lang, "best-liquid-staking"), label: L("Best liquid staking comparison", "Сравнение лучшего liquid staking"), type: "compare" },
      { href: (lang) => learnHref(lang, "what-is-restaking"), label: L("What is restaking?", "Что такое restaking?"), type: "learn" },
      { href: (lang) => learnHref(lang, "what-is-liquid-staking"), label: L("What is liquid staking?", "Что такое liquid staking?"), type: "learn" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-eth-restaking"),
    keywords: ["liquid restaking", "eeth", "liquid restaking explained", "restaking tokens"],
  },
  {
    slug: "what-is-protocol-tvl",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "What Is Protocol TVL? Educational Guide | TJT",
      "Что такое TVL протокола? Образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn what Total Value Locked means in DeFi, why TVL matters for liquidity and trust research, common mistakes, and TJT Trust Score context.",
      "Что означает Total Value Locked в DeFi, почему TVL важен для ликвидности и trust research, типичные ошибки и контекст TJT Trust Score.",
    ),
    h1: L("What Is Protocol TVL?", "Что такое TVL протокола?"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "Total Value Locked (TVL) measures the dollar value of assets deposited in a DeFi protocol at a point in time. It is a liquidity and adoption signal — not a safety guarantee or yield predictor.",
      "Total Value Locked (TVL) измеряет долларовую стоимость активов, депонированных в DeFi-протоколе на момент времени. Это сигнал ликвидности и принятия — не гарантия безопасности и не предиктор yield.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "When users supply USDC to Aave, stake ETH in Lido, or deposit into SparkLend, those assets count toward protocol TVL.\n\nTVL aggregators sum deposits across chains and products — definitions vary by data provider.\n\nTJT Trust Score v0.1 uses TVL depth as one weighted factor among audits, age, exploit history, and liquidity.",
          "Когда пользователи вносят USDC в Aave, стейкают ETH в Lido или депонируют в SparkLend, эти активы учитываются в TVL протокола.\n\nАгрегаторы TVL суммируют депозиты по сетям и продуктам — определения различаются у провайдеров данных.\n\nTJT Trust Score v0.1 использует глубину TVL как один взвешенный фактор среди аудитов, возраста, эксплойтов и ликвидности.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Deeper TVL often correlates with more exit liquidity and broader DeFi integrations — but not immunity from exploits.\n\nTVL trends reveal adoption shifts — rising TVL may follow incentives; falling TVL may signal risk events or better alternatives.\n\nComparing TVL tiers alongside Trust Score on TJT Compare pages adds market context beyond APY alone.",
          "Более глубокий TVL часто коррелирует с большей ликвидностью выхода и интеграциями — но не с иммунитетом к эксплойтам.\n\nТренды TVL показывают сдвиги принятия — рост TVL может следовать за incentives; падение — сигнализировать о рисках или альтернативах.\n\nСравнение уровней TVL с Trust Score на Compare TJT добавляет контекст сверх APY.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Treating high TVL as proof of safety.\n\nIgnoring double-counting when the same assets loop through multiple protocols.\n\nComparing TVL across protocols without adjusting for chain, product type, or incentive-driven deposits.",
          "Восприятие высокого TVL как доказательства безопасности.\n\nИгнорирование двойного счёта при loop одних активов через несколько протоколов.\n\nСравнение TVL без учёта сети, типа продукта или incentive-депозитов.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "Aave multi-chain TVL across lending pools — see Aave review and morpho-vs-aave Compare.\n\nLido ETH stake TVL driving stETH liquidity depth — see best liquid staking Compare.\n\nSpark SparkLend TVL within MakerDAO ecosystem — see spark-review and spark-vs-aave Compare.",
          "Multi-chain TVL Aave в lending-пулах — см. обзор Aave и Compare morpho-vs-aave.\n\nTVL ETH stake Lido, определяющий ликвидность stETH — см. Compare best liquid staking.\n\nTVL SparkLend в экосистеме MakerDAO — см. spark-review и Compare spark-vs-aave.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "TVL can exit rapidly during exploits, depegs, or incentive sunsets — depth today does not guarantee depth tomorrow.\n\nIncentivized TVL may overstate organic adoption.\n\nWrapped or bridged assets in TVL counts may carry bridge risk not reflected in headline numbers.",
          "TVL может быстро уйти при эксплойтах, depeg или окончании incentives — глубина сегодня не гарантирует глубину завтра.\n\nIncentivized TVL может завышать органическое принятие.\n\nWrapped или bridged активы в TVL могут нести bridge risk, не отражённый в headline.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Read protocol reviews for TVL context per system, what-is-defi-audit for code-security factors, and Compare tables for side-by-side TVL tier labels with Trust Score.",
          "Читайте обзоры протоколов для TVL-контекста, what-is-defi-audit для факторов безопасности кода и Compare для side-by-side уровней TVL с Trust Score.",
        ),
      },
    ],
    faq: [
      {
        question: L("Does higher TVL mean safer?", "Более высокий TVL означает безопаснее?"),
        answer: L(
          "Not necessarily. TVL reflects deposited value, not code security. Large protocols have been exploited. Use TVL as one factor among many.",
          "Не обязательно. TVL отражает депонированную стоимость, не безопасность кода. Крупные протоколы подвергались эксплойтам. Используйте TVL как один фактор среди многих.",
        ),
      },
      {
        question: L("How does TJT use TVL?", "Как TJT использует TVL?"),
        answer: L(
          "Trust Score v0.1 includes a TVL factor with estimated tier labels on Compare and protocol pages. It is informational — not a certification.",
          "Trust Score v0.1 включает фактор TVL с оценочными уровнями на Compare и страницах протоколов. Это информация — не сертификация.",
        ),
      },
      {
        question: L("Can TVL be manipulated?", "Можно ли манипулировать TVL?"),
        answer: L(
          "Incentive programs, wash looping, and double-counting can inflate TVL metrics. Cross-check multiple sources and on-chain data.",
          "Incentive-программы, wash looping и двойной счёт могут раздувать метрики TVL. Сверяйте несколько источников и on-chain данные.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "spark-vs-aave"), label: L("Spark vs Aave comparison", "Сравнение Spark vs Aave"), type: "compare" },
      { href: (lang) => learnHref(lang, "what-is-defi-audit"), label: L("What is a DeFi audit?", "Что такое DeFi-аудит?"), type: "learn" },
      { href: (lang) => learnHref(lang, "crypto-yield-risks"), label: L("Crypto yield risks", "Риски crypto yield"), type: "learn" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
    ],
    ctaHref: (lang) => compareHref(lang, "spark-vs-aave"),
    keywords: ["protocol tvl", "what is tvl", "defi tvl explained", "total value locked"],
  },
  {
    slug: "what-is-smart-contract-risk",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "What Is Smart Contract Risk? Educational Guide | TJT",
      "Что такое риск смарт-контрактов? Образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn smart contract risk in DeFi: code vulnerabilities, upgrades, composability, audit limits, and links to protocol safety pages on TJT.",
      "Риск смарт-контрактов в DeFi: уязвимости кода, апгрейды, композируемость, ограничения аудитов и ссылки на safety-страницы TJT.",
    ),
    h1: L("What Is Smart Contract Risk?", "Что такое риск смарт-контрактов?"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "Smart contract risk is the possibility that on-chain code behaves unexpectedly — through bugs, exploits, upgrades, or composability failures — impairing deposited funds. Audits reduce but do not eliminate this risk.",
      "Риск смарт-контрактов — вероятность неожиданного поведения on-chain кода — через баги, эксплойты, апгрейды или сбои композируемости — с ущербом для депонированных средств. Аудиты снижают, но не устраняют этот риск.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "DeFi protocols run on immutable or upgradeable smart contracts. If code contains vulnerabilities, attackers can drain pools, manipulate oracles, or brick withdrawals.\n\nEven audited code can have undiscovered bugs — audits are point-in-time reviews, not perpetual guarantees.\n\nComposability means your position may depend on multiple contracts across protocols — expanding the attack surface.",
          "DeFi-протоколы работают на неизменяемых или апгрейдируемых смарт-контрактах. Уязвимости позволяют атакующим опустошать пулы, манипулировать оракулами или блокировать вывод.\n\nДаже аудированный код может иметь неизвестные баги — аудиты point-in-time, не вечные гарантии.\n\nКомпозируемость означает зависимость позиции от нескольких контрактов — расширяя attack surface.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Smart contract failures can cause total loss of deposited principal — unlike variable APY risk.\n\nTJT Trust Score v0.1 weights audits and exploit history as informational factors on reviews and safety pages.\n\nUnderstanding contract risk helps you read safety pages (is-aave-safe, is-spark-safe) with appropriate skepticism.",
          "Сбои смарт-контрактов могут вызвать полную потерю principal — в отличие от риска переменного APY.\n\nTJT Trust Score v0.1 взвешивает аудиты и историю эксплойтов как информационные факторы на reviews и safety.\n\nПонимание риска контрактов помогает читать safety-страницы (is-aave-safe, is-spark-safe) с должным скептицизмом.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Treating an audit badge as elimination of all exploit risk.\n\nInteracting with unaudited forks or phishing frontends mimicking known protocols.\n\nIgnoring upgrade keys and governance control over contract changes.",
          "Восприятие аудита как устранения всего exploit risk.\n\nВзаимодействие с неаудированными форками или фишинговыми фронтендами.\n\nИгнорирование upgrade keys и governance-контроля над изменениями контрактов.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "Lending pool exploits via reentrancy or oracle manipulation — relevant to Aave, Spark, Compound safety pages.\n\nLiquid staking withdrawal contract bugs — see is-lido-safe and is-etherfi-safe.\n\nYield-trading contract composability with underlying LSTs — see is-pendle-safe.",
          "Эксплойты lending-пулов через reentrancy или манипуляцию oracle — релевантно safety Aave, Spark, Compound.\n\nБаги withdrawal-контрактов liquid staking — см. is-lido-safe и is-etherfi-safe.\n\nКомпозируемость yield-trading с базовыми LST — см. is-pendle-safe.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Code vulnerabilities and logic errors.\n\nUpgrade and governance key compromise.\n\nOracle manipulation triggering wrongful liquidations.\n\nComposability cascade when adjacent protocols fail.",
          "Уязвимости кода и логические ошибки.\n\nКомпрометация upgrade и governance keys.\n\nМанипуляция oracle с wrongful liquidations.\n\nКаскад композируемости при сбое смежных протоколов.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Read what-is-defi-audit for how audits fit into risk research, protocol safety hubs, and crypto-yield-risks for the broader risk framework.",
          "Читайте what-is-defi-audit о роли аудитов в risk research, safety-хабы протоколов и crypto-yield-risks для широкой risk framework.",
        ),
      },
    ],
    faq: [
      {
        question: L("Do audits eliminate smart contract risk?", "Устраняют ли аудиты риск смарт-контрактов?"),
        answer: L(
          "No. Audits are point-in-time reviews. Unknown bugs, upgrades, and composability risks can remain after an audit.",
          "Нет. Аудиты — point-in-time обзоры. Неизвестные баги, апгрейды и риски композируемости могут остаться после аудита.",
        ),
      },
      {
        question: L("How can I reduce smart contract risk?", "Как снизить риск смарт-контрактов?"),
        answer: L(
          "Verify official contract addresses, read safety pages and audit reports, limit composability stacking, and diversify across protocols and risk types.",
          "Проверяйте официальные адреса, читайте safety-страницы и аудиты, ограничивайте stacking композируемости и диверсифицируйте по протоколам и типам риска.",
        ),
      },
      {
        question: L("Does TJT detect smart contract bugs?", "Обнаруживает ли TJT баги смарт-контрактов?"),
        answer: L(
          "No. TJT publishes educational risk context and Trust Score indicators. On-chain verification and audit review remain your responsibility.",
          "Нет. TJT публикует образовательный risk context и Trust Score. On-chain проверка и изучение аудитов остаются вашей ответственностью.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => `/${lang}/safety/is-spark-safe`, label: L("Is Spark safe?", "Безопасен ли Spark?"), type: "safety" },
      { href: (lang) => `/${lang}/safety/is-pendle-safe`, label: L("Is Pendle safe?", "Безопасен ли Pendle?"), type: "safety" },
      { href: (lang) => learnHref(lang, "what-is-defi-audit"), label: L("What is a DeFi audit?", "Что такое DeFi-аудит?"), type: "learn" },
      { href: (lang) => learnHref(lang, "crypto-yield-risks"), label: L("Crypto yield risks", "Риски crypto yield"), type: "learn" },
    ],
    ctaHref: (lang) => learnHref(lang, "what-is-defi-audit"),
    keywords: ["smart contract risk", "defi exploit risk", "contract security", "defi audits"],
  },
  {
    slug: "what-is-defi-audit",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "What Is a DeFi Audit? Educational Guide | TJT",
      "Что такое DeFi-аудит? Образовательный гид | TJT",
    ),
    metaDescription: L(
      "Learn what DeFi security audits cover, their limitations, how TJT Trust Score uses audit data, and links to protocol safety pages.",
      "Что покрывают аудиты безопасности DeFi, их ограничения, как TJT Trust Score использует данные аудитов и ссылки на safety-страницы.",
    ),
    h1: L("What Is a DeFi Audit?", "Что такое DeFi-аудит?"),
    eyebrow: L("Educational information", "Образовательная информация"),
    intro: L(
      "A DeFi audit is a professional security review of smart contract code, typically performed before or after deployment. Audits inform risk research but do not guarantee future safety — TJT Trust Score v0.1 treats audit coverage as one weighted factor.",
      "DeFi-аудит — профессиональный security review кода смарт-контрактов, обычно до или после развёртывания. Аудиты информируют risk research, но не гарантируют будущую безопасность — TJT Trust Score v0.1 рассматривает аудиты как один взвешенный фактор.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "Security firms analyze protocol code for vulnerabilities — reentrancy, access control flaws, oracle dependencies, and economic attack vectors.\n\nAuditors publish reports listing findings ranked by severity, with fixes verified in re-audits for critical issues.\n\nProtocols like Aave, Spark, Pendle, and EtherFi cite multiple audits in documentation — TJT references these in Trust Score audit factors.",
          "Security-фирмы анализируют код протокола на уязвимости — reentrancy, access control, зависимости oracle и экономические attack vectors.\n\nАудиторы публикуют отчёты с findings по severity, с верификацией исправлений в re-audits.\n\nПротоколы вроде Aave, Spark, Pendle и EtherFi указывают несколько аудитов в документации — TJT ссылается на них в факторах аудита Trust Score.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "Audit coverage distinguishes protocols that invested in professional review from unaudited deployments.\n\nReading audit scope helps you understand what was — and was not — reviewed (proxies, oracles, off-chain components).\n\nPair audit research with safety pages and Compare Trust Score cards for structured context.",
          "Покрытие аудитами отличает протоколы с профессиональным review от неаудированных развёртываний.\n\nИзучение scope аудита показывает, что было и не было проверено (прокси, oracle, off-chain).\n\nСочетайте аудиты с safety-страницами и карточками Trust Score на Compare для структурированного контекста.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Assuming any audit badge equals comprehensive coverage of all contracts.\n\nIgnoring audit date — code may have changed via upgrades since the last review.\n\nSkipping severity details — medium findings can compound in composable strategies.",
          "Предположение, что любой аудит означает полное покрытие всех контрактов.\n\nИгнорирование даты аудита — код мог измениться через апгрейды.\n\nПропуск severity — medium findings накапливаются в композируемых стратегиях.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "Aave V3 multi-firm audit history — high Trust Score audit factor on is-aave-safe.\n\nSpark SparkLend audits cited in Maker ecosystem docs — spark-review and is-spark-safe.\n\nPendle core contract audits — pendle-review with yield-trading-specific composability notes.",
          "История аудитов Aave V3 несколькими фирмами — высокий фактор аудита Trust Score на is-aave-safe.\n\nАудиты SparkLend в документации Maker — spark-review и is-spark-safe.\n\nАудиты core Pendle — pendle-review с заметками о композируемости yield-trading.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Audits cannot find all bugs — post-audit exploits remain possible.\n\nUpgradeable contracts can introduce regressions after audit completion.\n\nOff-chain components (hedging, custody) may fall outside audit scope — relevant for Ethena and similar protocols.",
          "Аудиты не находят все баги — post-audit эксплойты возможны.\n\nАпгрейдируемые контракты могут вносить регрессии после аудита.\n\nOff-chain компоненты (хеджирование, кастоди) могут быть вне scope аудита — релевантно для Ethena и подобных.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Pair with what-is-smart-contract-risk for the broader code-risk framework, protocol safety hubs, and reviews for per-protocol audit context.",
          "Сочетайте с what-is-smart-contract-risk для широкой code-risk framework, safety-хабами и обзорами для аудит-контекста по протоколам.",
        ),
      },
    ],
    faq: [
      {
        question: L("Does an audit guarantee safety?", "Гарантирует ли аудит безопасность?"),
        answer: L(
          "No. Audits are point-in-time reviews. Unknown vulnerabilities, upgrades, and market conditions can still cause losses.",
          "Нет. Аудиты — point-in-time обзоры. Неизвестные уязвимости, апгрейды и рыночные условия всё ещё могут вызвать потери.",
        ),
      },
      {
        question: L("How does TJT score audits?", "Как TJT оценивает аудиты?"),
        answer: L(
          "Trust Score v0.1 includes an audits factor (18% weight) using documented audit coverage with placeholder status until external registry APIs connect.",
          "Trust Score v0.1 включает фактор аудитов (18% вес) с документированным покрытием и placeholder-статусом до подключения внешних API реестра.",
        ),
      },
      {
        question: L("Where can I find audit reports?", "Где найти отчёты аудитов?"),
        answer: L(
          "Check official protocol documentation and security pages. TJT safety and review pages reference audit context — verify primary sources independently.",
          "Проверяйте официальную документацию и security-страницы протоколов. Safety и обзоры TJT ссылаются на контекст аудитов — верифицируйте первичные источники самостоятельно.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => learnHref(lang, "what-is-smart-contract-risk"), label: L("Smart contract risk guide", "Гид по рискам смарт-контрактов"), type: "learn" },
      { href: (lang) => `/${lang}/safety/is-etherfi-safe`, label: L("Is EtherFi safe?", "Безопасен ли EtherFi?"), type: "safety" },
      { href: (lang) => `/${lang}/reviews/spark-review`, label: L("Spark protocol review", "Обзор протокола Spark"), type: "reviews" },
      { href: (lang) => learnHref(lang, "what-is-protocol-tvl"), label: L("What is protocol TVL?", "Что такое TVL протокола?"), type: "learn" },
    ],
    ctaHref: (lang) => `/${lang}/safety/is-spark-safe`,
    keywords: ["defi audit", "smart contract audit", "security audit defi", "audit explained"],
  },
  {
    slug: "usdc-yield-risks",
    type: "learn",
    hubSegment: "learn",
    metaTitle: L(
      "USDC Yield Risks — Educational Risk Overview | TJT",
      "Риски USDC yield — образовательный обзор | TJT",
    ),
    metaDescription: L(
      "Understand risks when earning yield on USDC: smart contracts, depeg, utilization, synthetic dollars, and TJT Compare links for stablecoin research.",
      "Поймите риски при заработке yield на USDC: смарт-контракты, depeg, utilization, synthetic dollars и ссылки TJT Compare для исследования стейблкоинов.",
    ),
    h1: L("USDC Yield Risks", "Риски USDC yield"),
    eyebrow: L("Risk overview", "Обзор рисков"),
    intro: L(
      "USDC yield routes — lending supply, liquidity provision, synthetic-dollar products, and incentive farms — bundle distinct risk layers. This guide explains USDC-specific risk context for structured comparison on TJT.",
      "Маршруты USDC yield — lending supply, LP, synthetic-dollar продукты и incentive farms — несут разные слои риска. Гид объясняет USDC-специфичный risk context для структурированного сравнения на TJT.",
    ),
    sections: [
      {
        key: "simple_explanation",
        title: L("Simple explanation", "Простое объяснение"),
        body: L(
          "Supplying USDC to Aave, Spark, Morpho, or Compound earns variable APY from borrower demand — carrying smart contract, utilization, and oracle risks.\n\nUSDC is fiat-backed by Circle, but DeFi integrations add contract and liquidity layers beyond issuer risk.\n\nSynthetic-dollar products like Ethena USDe offer different yield mechanics (funding rates) with hedging-dependent stability — not equivalent to USDC lending.",
          "Поставка USDC в Aave, Spark, Morpho или Compound даёт переменный APY от спроса заёмщиков — с рисками смарт-контрактов, utilization и oracle.\n\nUSDC fiat-backed от Circle, но DeFi-интеграции добавляют слои контрактов и ликвидности сверх риска эмитента.\n\nSynthetic-dollar продукты вроде USDe Ethena предлагают другую механику yield (funding rates) с hedging-зависимой стабильностью — не эквивалент USDC lending.",
        ),
      },
      {
        key: "why_it_matters",
        title: L("Why it matters", "Почему это важно"),
        body: L(
          "USDC is a primary DeFi collateral and supply asset — high adoption means deep pools but also correlated stress during market crashes.\n\nComparing USDC yield requires separating issuer risk, protocol risk, and incentive risk — headline APY alone is insufficient.\n\nTJT best USDC yield Compare and spark-vs-aave pages add Trust Score context for side-by-side research.",
          "USDC — основной залог и supply-актив DeFi — высокое принятие означает глубокие пулы, но и коррелированный стресс в крашах.\n\nСравнение USDC yield требует разделения риска эмитента, протокола и incentives — headline APY недостаточен.\n\nTJT best USDC yield Compare и spark-vs-aave добавляют контекст Trust Score для side-by-side исследования.",
        ),
      },
      {
        key: "common_mistakes",
        title: L("Common mistakes", "Типичные ошибки"),
        body: L(
          "Assuming USDC cannot depeg because of Circle backing — DeFi integrations and bridge wrappers carry separate risks.\n\nIgnoring utilization when chasing peak supply APY on lending markets.\n\nConfusing USDC supply yield with USDe or other synthetic-dollar funding-rate yield without reading risk disclosures.",
          "Предположение, что USDC не может depeg из-за Circle — DeFi-интеграции и bridge wrappers несут отдельные риски.\n\nИгнорирование utilization при погоне за пиковым supply APY в lending.\n\nПутаница USDC supply yield с USDe или другим funding-rate yield без чтения раскрытий рисков.",
        ),
      },
      {
        key: "examples",
        title: L("Examples", "Примеры"),
        body: L(
          "High utilization on Aave USDC pools → withdrawal delays — see is-aave-safe.\n\nSpark USDC supply within MakerDAO ecosystem — governance coupling risk; see spark-review.\n\nMorpho USDC optimizer markets — underlying-protocol and curator configuration risk; see compound-vs-morpho Compare.",
          "Высокий utilization в Aave USDC → задержки вывода — см. is-aave-safe.\n\nSpark USDC supply в экосистеме MakerDAO — риск governance-связи; см. spark-review.\n\nUSDC optimizer-рынки Morpho — риск базового протокола и кураторов; см. Compare compound-vs-morpho.",
        ),
      },
      {
        key: "risks",
        title: L("Risks", "Риски"),
        body: L(
          "Smart contract and oracle risk on lending protocols.\n\nUSDC issuer and regulatory risk affecting Circle redemption.\n\nUtilization and liquidity risk delaying withdrawals.\n\nBridge and wrapper risk on L2 USDC deployments.\n\nIncentive risk when token emissions end.",
          "Риск смарт-контрактов и oracle в lending-протоколах.\n\nРиск эмитента и регулирования USDC, влияющий на redemption Circle.\n\nРиск utilization и ликвидности, задерживающий вывод.\n\nРиск мостов и wrappers на L2 USDC.\n\nРиск incentives при окончании эмиссии токенов.",
        ),
      },
      {
        key: "related_pages",
        title: L("Related pages", "Связанные страницы"),
        body: L(
          "Read crypto-yield-risks for general framework, best USDC yield Compare for market data, and safety pages for Aave, Spark, and Morpho for protocol-specific risk context.",
          "Читайте crypto-yield-risks для общей framework, best USDC yield Compare для рыночных данных и safety Aave, Spark и Morpho для протокольного risk context.",
        ),
      },
    ],
    faq: [
      {
        question: L("Is USDC yield safer than USDT yield?", "USDC yield безопаснее USDT yield?"),
        answer: L(
          "Issuer profiles differ, but DeFi protocol risks apply to both. Compare specific routes with Trust Score and safety pages — not asset ticker alone.",
          "Профили эмитентов различаются, но риски DeFi-протоколов применимы к обоим. Сравнивайте конкретные маршруты через Trust Score и safety — не только тикер актива.",
        ),
      },
      {
        question: L("Can I lose USDC supplying to DeFi?", "Можно ли потерять USDC при supply в DeFi?"),
        answer: L(
          "Yes. Smart contract exploits, insolvency events, and prolonged high utilization are among the risks. No yield route is principal-guaranteed.",
          "Да. Эксплойты, неплатёжеспособность и длительный высокий utilization — среди рисков. Ни один маршрут yield не гарантирует principal.",
        ),
      },
      {
        question: L("Where should I compare USDC yield on TJT?", "Где сравнить USDC yield на TJT?"),
        answer: L(
          "Start with the USDC earn hub and best USDC yield Compare page, then read relevant protocol reviews and safety guides for risk context.",
          "Начните с earn-хаба USDC и Compare best USDC yield, затем прочитайте обзоры и safety-гиды протоколов для risk context.",
        ),
      },
    ],
    relatedLinks: [
      { href: (lang) => compareHref(lang, "best-usdc-yield"), label: L("Best USDC yield comparison", "Сравнение лучшего USDC yield"), type: "compare" },
      { href: (lang) => compareHref(lang, "spark-vs-aave"), label: L("Spark vs Aave comparison", "Сравнение Spark vs Aave"), type: "compare" },
      { href: (lang) => earnHref(lang, "usdc"), label: L("USDC earn hub", "Earn-хаб USDC"), type: "earn" },
      { href: (lang) => learnHref(lang, "crypto-yield-risks"), label: L("Crypto yield risks", "Риски crypto yield"), type: "learn" },
      { href: (lang) => `/${lang}/safety/is-aave-safe`, label: L("Is Aave safe?", "Безопасен ли Aave?"), type: "safety" },
      { href: (lang) => `/${lang}/safety/is-spark-safe`, label: L("Is Spark safe?", "Безопасен ли Spark?"), type: "safety" },
    ],
    ctaHref: (lang) => compareHref(lang, "best-usdc-yield"),
    keywords: ["usdc yield risks", "usdc defi risks", "stablecoin yield risks", "usdc lending risks"],
  },
];
