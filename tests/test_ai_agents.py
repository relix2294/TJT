"""Tests for the AI content factory helpers and compliance guarantees."""

from __future__ import annotations

from pathlib import Path

import pytest

import ai_agents


@pytest.fixture()
def cfg() -> dict:
    return ai_agents.load_config()


# ---------------------------------------------------------------------------
# Capability detection
# ---------------------------------------------------------------------------
@pytest.mark.parametrize(
    "value,expected",
    [
        ("", False),
        ("   ", False),
        ("your-key-here", False),
        ("sk-xxx-placeholder", False),
        ("changeme", False),
        ("sk-realLookingKey123", True),
    ],
)
def test_has_api_key(monkeypatch: pytest.MonkeyPatch, value: str, expected: bool) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", value)
    assert ai_agents._has_api_key() is expected


def test_live_mode_disabled_without_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    assert ai_agents.live_mode_enabled() is False


# ---------------------------------------------------------------------------
# Markdown extraction
# ---------------------------------------------------------------------------
def test_extract_title_from_markdown() -> None:
    md = "intro\n\n# Real Title\n\nbody"
    assert ai_agents._extract_title_from_markdown(md) == "Real Title"


def test_extract_title_returns_empty_when_absent() -> None:
    assert ai_agents._extract_title_from_markdown("no heading here") == ""


def test_extract_description_skips_headings_and_markup() -> None:
    md = "# Title\n\n## Sub\n\nThe **first** real paragraph."
    desc = ai_agents._extract_description_from_markdown(md)
    assert desc == "The first real paragraph."


# ---------------------------------------------------------------------------
# Publish envelope
# ---------------------------------------------------------------------------
def test_build_article_publish_data_shape() -> None:
    md = "# BTC заголовок\n\nПервый абзац про доходность."
    data = ai_agents.build_article_publish_data("btc", md, lang="ru")
    assert data["slug"].startswith("btc-ai-seo-")
    assert set(data["title"].keys()) == {"ru", "en"}
    assert set(data["content"].keys()) == {"ru", "en"}
    assert data["content"]["ru"] == md
    assert data["category"] in ai_agents.NEWS_CATEGORIES
    assert data["seo_keywords"]["ru"][0] == "BTC"


def test_build_article_publish_data_rejects_unknown_category() -> None:
    data = ai_agents.build_article_publish_data("eth", "# t\n\nx", category="Bogus")
    assert data["category"] == "Аналитика"


# ---------------------------------------------------------------------------
# Compliance regression guard (locks in the 1A de-risking pass)
# ---------------------------------------------------------------------------
BANNED_SUBSTRINGS = [
    "горит",
    "тлеют",
    "скрытый убыток",
    "инфляционное выгорание",
    "хватит кормить",
    "недополучаете",
]


def test_demo_article_has_no_fear_framing(cfg: dict) -> None:
    text = ai_agents._demo_seo_article("SOL", cfg).lower()
    for banned in BANNED_SUBSTRINGS:
        assert banned not in text, f"fear framing leaked back in: {banned!r}"


def test_demo_article_marks_yield_not_guaranteed(cfg: dict) -> None:
    text = ai_agents._demo_seo_article("SOL", cfg).lower()
    assert "не гарантирован" in text
    assert "не является" in text  # not investment advice disclaimer


def test_demo_video_has_no_fear_framing(cfg: dict) -> None:
    text = ai_agents._demo_video_script("SOL", cfg).lower()
    for banned in BANNED_SUBSTRINGS:
        assert banned not in text, f"fear framing leaked back in: {banned!r}"
    assert "не является инвестиционной рекомендацией" in text


# ---------------------------------------------------------------------------
# Registry counters (isolated temp registry)
# ---------------------------------------------------------------------------
@pytest.fixture()
def temp_registry(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> Path:
    reg = tmp_path / "sys_registry.json"
    monkeypatch.setattr(ai_agents, "REGISTRY_PATH", reg)
    return reg


def test_increment_metric(temp_registry: Path) -> None:
    assert ai_agents.increment_metric("generated_articles_count") == 1
    assert ai_agents.increment_metric("generated_articles_count") == 1 + 1


def test_log_agent_run_appends_and_caps(temp_registry: Path) -> None:
    for _ in range(205):
        ai_agents.log_agent_run("seo_article", "BTC", "demo")
    with ai_agents.locked_json_transaction(temp_registry, ai_agents._empty_registry()) as reg:
        assert len(reg["agent_run_log"]) == 200


def test_log_outbound_click_increments_total(temp_registry: Path) -> None:
    offer = {"id": "x", "protocol": "Aave", "network": "Arbitrum", "apy": 11.8}
    assert ai_agents.log_outbound_click(offer) == 1
    assert ai_agents.log_outbound_click(offer) == 2
