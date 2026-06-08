"""
TJT :: Multi-Agent Core Orchestrator
=====================================

CrewAI-based engine that drives the autonomous traffic factory of the TJT
platform. It exposes two production pipelines:

    * generate_seo_article(token)  -> long-form, compliance-cleared Markdown
    * generate_video_script(token) -> 30s second-by-second Shorts/TikTok script

FinOps protocol
---------------
To keep the OpenAI bill predictable, work is split across two model tiers:
    * heavy model  (gpt-4o)      -> creative copywriting + legal reasoning
    * light model  (gpt-4o-mini) -> cheap structural / semantic SEO tasks

Demo Mode Shield
----------------
If OPENAI_API_KEY is missing or blank, the orchestrator NEVER raises a fatal
error. It transparently falls back to a deterministic, beautifully formatted
static demonstration so the frontend always renders something useful.
"""

from __future__ import annotations

import os
import json
import logging
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

from dotenv import load_dotenv
import requests

from json_file_store import locked_json_transaction

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# ---------------------------------------------------------------------------
# Paths & environment
# ---------------------------------------------------------------------------
CONFIG_PATH = BASE_DIR / "config.json"
REGISTRY_PATH = BASE_DIR / "sys_registry.json"


def _empty_registry() -> Dict[str, Any]:
    return {
        "metrics": {
            "generated_articles_count": 0,
            "generated_video_scripts_count": 0,
            "outbound_ctr_clicks": 0,
        },
        "click_log": [],
        "agent_run_log": [],
        "last_updated": None,
    }

logger = logging.getLogger(__name__)

NEWS_CATEGORIES = ("Аналитика", "DeFi", "Новости")
DEFAULT_FRONTEND_URL = "http://localhost:3000"
PUBLISH_TIMEOUT_SEC = 30


# ---------------------------------------------------------------------------
# Configuration & registry helpers
# ---------------------------------------------------------------------------
def load_config() -> Dict[str, Any]:
    """Read the centralized configuration engine (config.json)."""
    with CONFIG_PATH.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def increment_metric(metric_key: str, amount: int = 1) -> int:
    """Increment a named counter in sys_registry.json and return the new value."""
    try:
        with locked_json_transaction(REGISTRY_PATH, _empty_registry()) as registry:
            registry.setdefault("metrics", {})
            registry["metrics"][metric_key] = (
                registry["metrics"].get(metric_key, 0) + amount
            )
            registry["last_updated"] = datetime.now(timezone.utc).isoformat()
            return registry["metrics"][metric_key]
    except (TimeoutError, ValueError) as exc:
        logger.error(
            "[ai_agents] increment_metric(%s) failed — registry locked or corrupt: %s",
            metric_key,
            exc,
        )
        raise


def log_agent_run(pipeline: str, token: str, mode: str) -> None:
    """Append a structured record of an agent pipeline execution."""
    try:
        with locked_json_transaction(REGISTRY_PATH, _empty_registry()) as registry:
            registry.setdefault("agent_run_log", [])
            registry["agent_run_log"].append(
                {
                    "pipeline": pipeline,
                    "token": token,
                    "mode": mode,  # "live" or "demo"
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
            registry["agent_run_log"] = registry["agent_run_log"][-200:]
            registry["last_updated"] = datetime.now(timezone.utc).isoformat()
    except (TimeoutError, ValueError) as exc:
        logger.error(
            "[ai_agents] log_agent_run(%s, %s) failed — registry locked or corrupt: %s",
            pipeline,
            token,
            exc,
        )
        raise


def log_outbound_click(offer: Dict[str, Any]) -> int:
    """Record a CPA outbound click (O-CTR) and return the new total."""
    try:
        with locked_json_transaction(REGISTRY_PATH, _empty_registry()) as registry:
            registry.setdefault("click_log", [])
            registry["click_log"].append(
                {
                    "offer_id": offer.get("id"),
                    "protocol": offer.get("protocol"),
                    "network": offer.get("network"),
                    "apy": offer.get("apy"),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
            registry["click_log"] = registry["click_log"][-500:]
            registry.setdefault("metrics", {})
            registry["metrics"]["outbound_ctr_clicks"] = (
                registry["metrics"].get("outbound_ctr_clicks", 0) + 1
            )
            registry["last_updated"] = datetime.now(timezone.utc).isoformat()
            return registry["metrics"]["outbound_ctr_clicks"]
    except (TimeoutError, ValueError) as exc:
        logger.error(
            "[ai_agents] log_outbound_click(%s) failed — registry locked or corrupt: %s",
            offer.get("id"),
            exc,
        )
        raise


# ---------------------------------------------------------------------------
# Capability detection — is a live CrewAI run possible right now?
# ---------------------------------------------------------------------------
def _has_api_key() -> bool:
    key = os.environ.get("OPENAI_API_KEY", "").strip()
    # Reject obvious placeholders so the demo shield kicks in during local dev.
    return bool(key) and not key.lower().startswith(("your", "sk-xxx", "changeme"))


def _crewai_available() -> bool:
    try:
        import crewai  # noqa: F401
        return True
    except Exception:
        return False


def live_mode_enabled() -> bool:
    """Live generation requires BOTH an API key and an importable CrewAI."""
    return _has_api_key() and _crewai_available()


# ===========================================================================
# CREW BUILDERS — full agent profiles (SEO / Growth / Compliance)
# ===========================================================================
def _build_agents(cfg: Dict[str, Any]):
    """
    Instantiate the three specialized CrewAI agents with hard role models,
    backstories and FinOps-tiered model assignment.

    Imported lazily so the module stays importable in Demo Mode (no CrewAI).
    """
    from crewai import LLM, Agent

    finops = cfg.get("finops", {})
    cliches = ", ".join(
        f'"{c}"'
        for c in finops.get(
            "banned_ai_cliches",
            ["в заключение", "важно отметить", "безусловно", "например"],
        )
    )

    openai_api_key = os.environ.get("OPENAI_API_KEY")

    # FinOps tiering: SEO + Compliance on gpt-4o, Growth on gpt-4o-mini.
    # crewai.LLM reads OPENAI_API_KEY from the environment when api_key is omitted.
    heavy_llm = LLM(
        model=finops.get("heavy_model", "gpt-4o"),
        temperature=finops.get("temperature_compliance", 0.2),
        api_key=openai_api_key,
    )
    seo_llm = LLM(
        model=finops.get("heavy_model", "gpt-4o"),
        temperature=finops.get("temperature_seo", 0.3),
        api_key=openai_api_key,
    )
    growth_llm = LLM(
        model=finops.get("light_model", "gpt-4o-mini"),
        temperature=finops.get("temperature_growth", 0.7),
        api_key=openai_api_key,
    )

    seo_agent = Agent(
        role="Архитектор семантики (SEO)",
        goal=(
            "Анализировать низкочастотный финтех-интент по заданному токену и "
            "проектировать логическую структуру: title, meta description, H1 и "
            "иерархию H2/H3, заточенную под органический поиск Яндекс/Google."
        ),
        backstory=(
            "Ты — холодный технический SEO-инженер. Ты мыслишь поисковым "
            "интентом и кластерами запросов, а не эмоциями. Ты не пишешь "
            "развёрнутый текст — ты строишь скелет страницы, который потом "
            "наполнит копирайтер."
        ),
        llm=seo_llm,
        allow_delegation=False,
        verbose=False,
    )

    growth_agent = Agent(
        role="Финтех-Копирайтер (Growth & Content)",
        goal=(
            "Писать хлёсткие, бескомпромиссные аналитические тексты, где цифры "
            "превыше слов. Доказывать читателю неэффективность хранения капитала "
            "в фиатной банковской системе через математику упущенной выгоды."
        ),
        backstory=(
            "Ты — экс-редактор Банки.ру, ушедший в Web3. Ты презираешь "
            "корпоративную воду и ИИ-штампы. Тебе СТРОГО запрещено использовать "
            f"фразы: {cliches}. Ты оперируешь терминами «эрозия капитала», "
            "«скрытый убыток» и «инфляционное выгорание». Каждый абзац бьёт в боль."
        ),
        llm=growth_llm,
        allow_delegation=False,
        verbose=False,
    )

    compliance_agent = Agent(
        role="Риск-аудитор (Compliance Shield)",
        goal=(
            "Юридически вычищать текст: удалять любые прямые инвест-советы и "
            "побуждения к инвестициям, подтверждать некостодиальный статус TJT и "
            "встраивать предупреждения о рисках смарт-контрактов."
        ),
        backstory=(
            "Ты — параноидальный юридический контролёр финтех-платформы. Твоя "
            "задача — чтобы ни одна формулировка не выглядела как индивидуальная "
            "инвестиционная рекомендация. Ты сохраняешь смысл и тон, но снимаешь "
            "юридические риски и оставляешь чистый Markdown без лишних обёрток."
        ),
        llm=heavy_llm,
        allow_delegation=False,
        verbose=False,
    )

    return seo_agent, growth_agent, compliance_agent


# ===========================================================================
# FRONTEND PUBLISHING — push generated articles to Next.js config.json
# ===========================================================================
def _extract_title_from_markdown(markdown: str) -> str:
    """Return the first H1 line from Markdown, without the leading hash marks."""
    for line in markdown.splitlines():
        stripped = line.strip()
        if stripped.startswith("# "):
            return stripped[2:].strip()
    return ""


def _extract_description_from_markdown(markdown: str, max_len: int = 160) -> str:
    """Build a meta description from the first substantive paragraph."""
    passed_h1 = False
    for line in markdown.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("# "):
            passed_h1 = True
            continue
        if stripped.startswith("#") or stripped.startswith(">") or stripped.startswith("---"):
            continue
        if passed_h1 or not stripped.startswith("#"):
            plain = re.sub(r"[*_`#\[\]()]", "", stripped).strip()
            if plain:
                return plain[:max_len].rstrip()
    return ""


def _secondary_locale_text(
    token: str,
    primary_title: str,
    locale: str,
) -> str:
    """Lightweight counterpart copy when only one language was generated."""
    if locale == "en":
        return (
            f"{token}: opportunity cost, bank deposit erosion, "
            "and non-custodial Web3 yield — TJT analysis."
        )
    return (
        f"{token}: упущенная выгода, эрозия депозита "
        "и некостодиальная Web3-доходность — аналитика TJT."
    )


def _secondary_content_stub(token: str, locale: str) -> str:
    """Placeholder body for the locale that was not generated by the pipeline."""
    if locale == "en":
        return (
            f"## {token}: yield vs bank deposit\n\n"
            "This article was auto-generated by the TJT AI pipeline in Russian. "
            "Switch to the RU locale for the full compliance-cleared analysis."
        )
    return (
        f"## {token}: доходность и депозит\n\n"
        "Статья сгенерирована англоязычным пайплайном. "
        "Полный текст доступен в EN-локали."
    )


def _build_seo_keywords(token: str) -> Dict[str, List[str]]:
    return {
        "en": [token, f"{token} yield", "DeFi", "opportunity cost", "non-custodial"],
        "ru": [token, f"{token} доходность", "DeFi", "упущенная выгода", "некостодиальный"],
    }


def build_article_publish_data(
    token: str,
    markdown: str,
    *,
    lang: str = "ru",
    category: str = "Аналитика",
) -> Dict[str, Any]:
    """
    Assemble the article envelope consumed by publish_article_to_frontend().

    The SEO pipeline currently writes Russian copy; ``lang`` marks the primary
    locale. A minimal EN/RU counterpart is synthesised for the other locale so
    the Next.js admin API receives the bilingual shape expected by config.json.
    """
    token = (token or "BTC").strip().upper()
    lang = "en" if lang == "en" else "ru"
    other = "en" if lang == "ru" else "ru"
    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    primary_title = _extract_title_from_markdown(markdown) or (
        f"{token}: анализ упущенной выгоды" if lang == "ru"
        else f"{token}: opportunity cost analysis"
    )
    primary_description = _extract_description_from_markdown(markdown) or primary_title[:160]
    secondary_title = _secondary_locale_text(token, primary_title, other)
    secondary_description = _secondary_locale_text(token, primary_title, other)

    slug = f"{token.lower()}-ai-seo-{date_str}"

    return {
        "slug": slug,
        "title": {lang: primary_title, other: secondary_title},
        "description": {lang: primary_description, other: secondary_description},
        "category": category if category in NEWS_CATEGORIES else "Аналитика",
        "date": date_str,
        "lang": lang,
        "content": {lang: markdown, other: _secondary_content_stub(token, other)},
        "seo_keywords": _build_seo_keywords(token),
    }


def publish_article_to_frontend(article_data: Dict[str, Any]) -> None:
    """
    POST the generated article to the Next.js admin endpoint.

    Failures are logged and swallowed so background / Streamlit runs never crash
    when the frontend is offline or misconfigured (graceful degradation).
    """
    site_url = os.environ.get("NEXT_PUBLIC_SITE_URL", DEFAULT_FRONTEND_URL).rstrip("/")
    secret = os.environ.get("ADMIN_API_SECRET", "").strip()

    if not secret:
        logger.warning(
            "[publish] ADMIN_API_SECRET is missing — skipping frontend publish."
        )
        return

    payload = {
        "slug": article_data["slug"],
        "title": article_data["title"],
        "category": article_data["category"],
        "date": article_data["date"],
        "lang": article_data.get("lang", "ru"),
        "content": article_data["content"],
        "seo_keywords": article_data.get("seo_keywords", {}),
        "description": article_data["description"],
    }

    url = f"{site_url}/api/admin/publish-article"
    headers = {
        "Authorization": f"Bearer {secret}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=PUBLISH_TIMEOUT_SEC,
        )
        if response.status_code == 200:
            logger.info("✅ Статья успешно опубликована на фронтенде!")
            print("✅ Статья успешно опубликована на фронтенде!", flush=True)
            return

        logger.error(
            "[publish] HTTP %s from %s — %s",
            response.status_code,
            url,
            response.text[:500],
        )
        print(
            f"⚠️ [publish] HTTP {response.status_code}: {response.text[:500]}",
            flush=True,
        )
    except requests.RequestException as exc:
        logger.exception("[publish] Network error while publishing article: %s", exc)
        print(f"⚠️ [publish] Ошибка сети: {exc}", flush=True)
    except Exception as exc:  # noqa: BLE001 — never break the agent pipeline
        logger.exception("[publish] Unexpected publish error: %s", exc)
        print(
            f"⚠️ [publish] Непредвиденная ошибка: {type(exc).__name__}: {exc}",
            flush=True,
        )


# ===========================================================================
# PIPELINE 1 — SEO ARTICLE (SEO -> Growth -> Compliance)
# ===========================================================================
def generate_seo_article(token: str) -> str:
    """
    Run the sequential SEO article pipeline for a given token symbol.

    Returns clean Markdown ready for the frontend. Falls back to a static demo
    payload whenever live mode is unavailable.
    """
    token = (token or "BTC").strip().upper()
    cfg = load_config()

    if not live_mode_enabled():
        log_agent_run("seo_article", token, "demo")
        return _demo_seo_article(token, cfg)

    try:
        from crewai import Crew, Process, Task

        seo_agent, growth_agent, compliance_agent = _build_agents(cfg)
        b = cfg["fintech_benchmarks"]

        task_seo = Task(
            description=(
                f"Спроектируй SEO-структуру лендинга по токену {token} для "
                "русскоязычного финтех-интента. Выдай: SEO Title (до 60 симв.), "
                "Meta Description (до 160 симв.), один H1 и 4-6 H2 с короткими "
                "пояснениями, что должно быть в каждом разделе. Делай упор на "
                "тему упущенной выгоды и сравнение с банковским вкладом."
            ),
            expected_output="Структурированный план страницы с тегами и заголовками.",
            agent=seo_agent,
        )

        task_growth = Task(
            description=(
                f"На основе SEO-структуры напиши развёрнутый аналитический обзор "
                f"токена {token} (900-1300 слов) в формате Markdown. Жёстко "
                "используй математику упущенной выгоды: банковский депозит "
                f"{b['bank_deposit_apr']}% APR против реальной инфляции "
                f"{b['real_inflation_rate']}% и Web3-доходности "
                f"{b['web3_aggregator_apy']}% APY. Тон хлёсткий, цифры превыше "
                "слов. Никаких ИИ-штампов."
            ),
            expected_output="Полный черновик статьи в Markdown.",
            agent=growth_agent,
            context=[task_seo],
        )

        task_compliance = Task(
            description=(
                "Проверь и вычисти статью: убери любые прямые инвест-советы и "
                "призывы вложить деньги, добавь корректное упоминание "
                "некостодиального статуса TJT и блок предупреждения о рисках "
                "смарт-контрактов в конце. Верни ТОЛЬКО финальный чистый Markdown."
            ),
            expected_output="Финальный безопасный Markdown-текст статьи.",
            agent=compliance_agent,
            context=[task_growth],
        )

        crew = Crew(
            agents=[seo_agent, growth_agent, compliance_agent],
            tasks=[task_seo, task_growth, task_compliance],
            process=Process.sequential,
            max_rpm=cfg.get("finops", {}).get("max_rpm", 10),
            verbose=False,
        )

        result = crew.kickoff(inputs={"token": token})
        markdown = str(result)
        log_agent_run("seo_article", token, "live")

        article_data = build_article_publish_data(token, markdown, lang="ru")
        publish_article_to_frontend(article_data)

        return markdown

    except Exception as exc:  # noqa: BLE001 — never let the factory crash the UI
        log_agent_run("seo_article", token, "demo")
        fallback = _demo_seo_article(token, cfg)
        return (
            f"> _Live-режим недоступен ({type(exc).__name__}). "
            f"Показан демонстрационный результат._\n\n{fallback}"
        )


# ===========================================================================
# PIPELINE 2 — VIRAL VIDEO SCRIPT (fast pass through Growth agent)
# ===========================================================================
def generate_video_script(token: str) -> str:
    """
    Run the fast single-agent pipeline that produces a 30-second Shorts/TikTok
    script with a strict second-by-second storyboard.
    """
    token = (token or "BTC").strip().upper()
    cfg = load_config()

    if not live_mode_enabled():
        log_agent_run("video_script", token, "demo")
        return _demo_video_script(token, cfg)

    try:
        from crewai import Crew, Process, Task

        _, growth_agent, _ = _build_agents(cfg)

        task_video = Task(
            description=(
                f"Напиши сценарий вертикального видео на 30 секунд про {token} для "
                "Shorts/TikTok с жёсткой посекундной раскадровкой:\n"
                "- 0-5 сек: Триггерный Хук (шокирующая цифра/вопрос).\n"
                "- 5-15 сек: Обострение боли банковских вкладов (математика потерь).\n"
                "- 15-25 сек: Разрушительное Web3-решение (доходность пулов).\n"
                "- 25-30 сек: Жёсткий призыв перейти по ссылке на TJT.\n"
                "Для каждого блока укажи [VISUAL] и [VOICEOVER]. Без ИИ-штампов."
            ),
            expected_output="Посекундный сценарий видео в Markdown.",
            agent=growth_agent,
        )

        crew = Crew(
            agents=[growth_agent],
            tasks=[task_video],
            process=Process.sequential,
            max_rpm=cfg.get("finops", {}).get("max_rpm", 10),
            verbose=False,
        )

        result = crew.kickoff(inputs={"token": token})
        log_agent_run("video_script", token, "live")
        return str(result)

    except Exception as exc:  # noqa: BLE001
        log_agent_run("video_script", token, "demo")
        fallback = _demo_video_script(token, cfg)
        return (
            f"> _Live-режим недоступен ({type(exc).__name__}). "
            f"Показан демонстрационный результат._\n\n{fallback}"
        )


# ===========================================================================
# DEMO MODE SHIELD — deterministic, pre-formatted static payloads
# ===========================================================================
def _demo_seo_article(token: str, cfg: Dict[str, Any]) -> str:
    b = cfg["fintech_benchmarks"]
    capital = b.get("default_capital", b.get("default_capital_usd", 10000))
    bank_gain = capital * b["bank_deposit_apr"] / 100
    inflation_loss = capital * b["real_inflation_rate"] / 100
    web3_gain = capital * b["web3_aggregator_apy"] / 100
    missed = web3_gain - bank_gain

    return f"""# {token}: скрытый убыток банковского вклада и арифметика упущенной выгоды

**Meta:** Разбираем на цифрах, почему {token} и некостодиальные DeFi-пулы
обгоняют классический депозит, и как инфляция запускает эрозию капитала.

## Точка отсчёта: ${capital:,.0f} на банковском депозите

Банк предлагает **{b['bank_deposit_apr']}% APR**. На дистанции в год это всего
**${bank_gain:,.0f}** номинальной прибыли. Звучит как «доход» — пока в кадр не
входит реальная инфляция.

## Инфляционное выгорание

Реальная инфляция капитала — **{b['real_inflation_rate']}% в год**. Это
**−${inflation_loss:,.0f}** покупательной способности с тех же ${capital:,.0f}.
Депозит не «приносит» — он **замедляет падение**. Это и есть скрытый убыток:
формально плюс на счёте, фактически минус в кошельке.

## Альтернатива: некостодиальные пулы агрегатора

Базовая Web3-доходность агрегатора — **{b['web3_aggregator_apy']}% APY**, то есть
**${web3_gain:,.0f}** за год с того же капитала. Разница с банком —
**${missed:,.0f}**. Именно столько стоит «спокойствие» фиатного депозита.

## Что такое некостодиальность

Платформа не хранит ваши средства и не имеет доступа к ключам. Вы
взаимодействуете со смарт-контрактом протокола напрямую — TJT лишь показывает
данные и маршрут.

---

### ⚠️ Предупреждение о рисках
Материал носит исключительно информационный характер и не является
индивидуальной инвестиционной рекомендацией. Взаимодействие со смарт-контрактами
сопряжено с рисками (уязвимости контрактов, волатильность, потеря капитала) и
осуществляется пользователем самостоятельно.
"""


def _demo_video_script(token: str, cfg: Dict[str, Any]) -> str:
    b = cfg["fintech_benchmarks"]
    return f"""# Shorts / TikTok сценарий — {token} (30 сек)

**[0-5 сек] ТРИГГЕРНЫЙ ХУК**
- [VISUAL] Крупный план: купюры тлеют по краям.
- [VOICEOVER] «Твой банковский вклад горит прямо сейчас. И ты это оплачиваешь.»

**[5-15 сек] БОЛЬ БАНКОВСКИХ ВКЛАДОВ**
- [VISUAL] График: {b['bank_deposit_apr']}% по вкладу против {b['real_inflation_rate']}% инфляции.
- [VOICEOVER] «{b['bank_deposit_apr']}% годовых? Инфляция съедает {b['real_inflation_rate']}%.
  Каждый год это скрытый убыток, а не доход.»

**[15-25 сек] WEB3-РЕШЕНИЕ**
- [VISUAL] Дашборд TJT, тикер {token}, индикатор {b['web3_aggregator_apy']}% APY горит зелёным.
- [VOICEOVER] «Некостодиальные пулы дают до {b['web3_aggregator_apy']}% APY. Ключи у тебя.
  Деньги — у тебя.»

**[25-30 сек] ЖЁСТКИЙ ПРИЗЫВ**
- [VISUAL] Логотип TJT, стрелка на ссылку в профиле.
- [VOICEOVER] «Хватит кормить инфляцию. Считай свою упущенную выгоду на TJT.»

---
_Информационный материал. Не является инвестиционной рекомендацией._
"""


# ---------------------------------------------------------------------------
# Manual smoke test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print(f"Live mode enabled: {live_mode_enabled()}")
    print("\n=== SEO ARTICLE ===\n")
    print(generate_seo_article("SOL"))
    print("\n=== VIDEO SCRIPT ===\n")
    print(generate_video_script("SOL"))
