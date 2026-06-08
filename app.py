"""
TJT :: Premium Frontend Workspace
=================================

Monolithic Streamlit control script for the autonomous Web3 info-broker TJT.

Implements, top to bottom:
    1. Premium dark-fintech UI via deep custom CSS injection.
    2. Interactive Loss Calculator (Банки.ру layer) — reactive math.
    3. Streaming Market Monitor (CoinMarketCap layer) with a self-healing
       CoinGecko -> static_fallback_data pipeline.
    4. Robot Control Terminal (tabs) wiring the CrewAI pipelines.
    5. CPA Yield Leaderboard with outbound click-tracking (O-CTR).
    6. Constitutional Legal Shield footer.

Run:  streamlit run app.py
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Tuple

import pandas as pd
import requests
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

import ai_agents

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config.json"

DEFAULT_THEME = {
    "bg_deep": "#070d18",
    "bg_card": "#0f172a",
    "border": "#1e293b",
    "accent_neon": "#38bdf8",
    "text_muted": "#94a3b8",
    "profit_green": "#22c55e",
    "loss_red": "#ef4444",
}

DEFAULT_COINGECKO = {
    "markets_endpoint": "https://api.coingecko.com/api/v3/coins/markets",
    "ping_endpoint": "https://api.coingecko.com/api/v3/ping",
    "vs_currency": "usd",
    "ids": ["bitcoin", "ethereum", "tether", "solana", "usd-coin"],
    "timeout_seconds": 10,
}


# ---------------------------------------------------------------------------
# Configuration loader (cached for the session)
# ---------------------------------------------------------------------------
@st.cache_data(show_spinner=False)
def load_config() -> Dict[str, Any]:
    with CONFIG_PATH.open("r", encoding="utf-8") as fh:
        return json.load(fh)


CFG = load_config()
THEME = CFG.get("theme", DEFAULT_THEME)
COINGECKO_CFG = {**DEFAULT_COINGECKO, **CFG.get("coingecko", {})}


def _market_fallback_rows() -> List[Dict[str, Any]]:
    """Last known market snapshot from config.json (self-healing fallback)."""
    return CFG.get("static_fallback_data") or CFG.get("market_snapshot", [])


def _platform_tagline() -> str:
    platform = CFG.get("platform", {})
    if isinstance(platform.get("tagline"), str):
        return platform["tagline"]
    ui_tagline = CFG.get("ui", {}).get("site", {}).get("tagline", {})
    if isinstance(ui_tagline, dict):
        return ui_tagline.get("ru") or ui_tagline.get("en") or "TJT"
    return str(ui_tagline or "TJT")


def _legal_disclaimer() -> str:
    legal = CFG.get("legal", {})
    if isinstance(legal.get("disclaimer"), str):
        return legal["disclaimer"]
    paragraphs = CFG.get("ui", {}).get("risk", {}).get("paragraphs", [])
    if paragraphs:
        first = paragraphs[0]
        if isinstance(first, dict):
            return first.get("ru") or first.get("en") or ""
        return str(first)
    return "Материалы носят информационный характер и не являются инвестиционной рекомендацией."


def _coingecko_headers() -> Dict[str, str]:
    headers = {"Accept": "application/json"}
    api_key = os.environ.get("COINGECKO_API_KEY", "").strip()
    if api_key:
        headers["x-cg-demo-api-key"] = api_key
    return headers


def check_openai_connectivity() -> bool:
    """Quick micro-request to gpt-4o-mini to verify OpenAI API access."""
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        return False
    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Return only the word True"}],
            max_tokens=8,
        )
        text = (response.choices[0].message.content or "").strip().lower()
        return "true" in text
    except Exception:
        return False


def check_coingecko_connectivity() -> bool:
    """Ping CoinGecko demo/pro API with the configured key."""
    cg = COINGECKO_CFG
    try:
        resp = requests.get(
            cg.get("ping_endpoint", DEFAULT_COINGECKO["ping_endpoint"]),
            headers=_coingecko_headers(),
            timeout=cg.get("timeout_seconds", 10),
        )
        resp.raise_for_status()
        return True
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Page setup + premium CSS injection
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="TJT — Autonomous Web3 Info-Broker",
    page_icon="◆",
    layout="wide",
    initial_sidebar_state="expanded",
)


def inject_css() -> None:
    """Visually destroy the default Streamlit look with a dark-fintech skin."""
    st.markdown(
        f"""
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

            .stApp {{
                background: radial-gradient(1200px 600px at 80% -10%, #15233f 0%, {THEME['bg_deep']} 55%);
                color: #e2e8f0;
                font-family: 'Inter', sans-serif;
            }}
            #MainMenu, header, footer {{ visibility: hidden; }}
            .block-container {{ padding-top: 2rem; max-width: 1280px; }}

            .tjt-hero {{
                border: 1px solid {THEME['border']};
                border-radius: 20px;
                padding: 34px 40px;
                background: linear-gradient(135deg, {THEME['bg_card']} 0%, #16233d 100%);
                margin-bottom: 28px;
            }}
            .tjt-hero h1 {{
                font-size: 2.6rem; font-weight: 800; margin: 0;
                color: {THEME['accent_neon']};
                letter-spacing: -1px;
            }}
            .tjt-hero p {{ color: {THEME['text_muted']}; font-size: 1.05rem; margin: 8px 0 0; }}
            .tjt-badge {{
                display: inline-block; margin-top: 14px; padding: 6px 14px;
                border: 1px solid {THEME['accent_neon']}; border-radius: 999px;
                color: {THEME['accent_neon']}; font-size: .78rem; font-weight: 600;
                letter-spacing: .5px; text-transform: uppercase;
            }}

            .tjt-section {{
                font-size: 1.5rem; font-weight: 800; color: #f8fafc;
                margin: 30px 0 14px; border-left: 4px solid {THEME['accent_neon']};
                padding-left: 12px;
            }}

            .tjt-metric {{
                background: {THEME['bg_card']};
                border: 1px solid {THEME['border']};
                border-radius: 16px; padding: 22px 24px; height: 100%;
                transition: transform .18s ease, border-color .18s ease;
            }}
            .tjt-metric:hover {{ transform: translateY(-6px); border-color: {THEME['accent_neon']}; }}
            .tjt-metric .label {{ color: {THEME['text_muted']}; font-size: .82rem; text-transform: uppercase; letter-spacing: .5px; }}
            .tjt-metric .value {{ font-size: 2rem; font-weight: 800; margin-top: 8px; }}
            .tjt-metric .sub {{ color: {THEME['text_muted']}; font-size: .82rem; margin-top: 4px; }}
            .val-green {{ color: {THEME['profit_green']}; }}
            .val-red {{ color: {THEME['loss_red']}; }}
            .val-neon {{ color: {THEME['accent_neon']}; }}

            .tjt-result {{
                margin-top: 16px; padding: 22px 28px; border-radius: 16px;
                background: linear-gradient(135deg, rgba(34,197,94,.14) 0%, {THEME['bg_card']} 70%);
                border: 1px solid {THEME['profit_green']};
                display: flex; align-items: baseline; justify-content: space-between;
                flex-wrap: wrap; gap: 8px;
            }}
            .tjt-result .cap {{ color: {THEME['text_muted']}; font-size: .95rem; }}
            .tjt-result .big {{ font-size: 2.4rem; font-weight: 800; color: {THEME['profit_green']}; }}

            .tjt-offer {{
                background: {THEME['bg_card']};
                border: 1px solid {THEME['border']};
                border-radius: 16px; padding: 20px 22px; margin-bottom: 8px;
                transition: transform .18s ease, border-color .18s ease;
            }}
            .tjt-offer:hover {{ transform: translateY(-6px); border-color: {THEME['profit_green']}; }}
            .tjt-offer .rating {{
                display: inline-block; padding: 3px 10px; border-radius: 8px;
                background: rgba(56,189,248,.12); color: {THEME['accent_neon']};
                font-weight: 700; font-size: .75rem; letter-spacing: .5px;
            }}
            .tjt-offer .pool {{ font-size: 1.15rem; font-weight: 700; margin: 10px 0 2px; color: #f8fafc; }}
            .tjt-offer .net {{ color: {THEME['text_muted']}; font-size: .82rem; }}
            .tjt-offer .apy {{ font-size: 2.1rem; font-weight: 800; color: {THEME['profit_green']}; margin: 8px 0; }}

            .stButton > button {{
                background: {THEME['accent_neon']}; color: #07111f;
                border: none; border-radius: 10px; font-weight: 700;
                padding: 8px 16px; width: 100%;
            }}
            .stButton > button:hover {{ background: #7dd3fc; color: #07111f; }}

            .tjt-legal {{
                margin-top: 48px; padding: 26px 30px;
                background: #0b1322; border: 1px solid {THEME['border']};
                border-radius: 16px; color: {THEME['text_muted']};
                font-size: .85rem; line-height: 1.6;
            }}
            .tjt-legal h4 {{ color: #cbd5e1; margin: 0 0 10px; }}

            .stDataFrame {{ border-radius: 12px; overflow: hidden; }}
        </style>
        """,
        unsafe_allow_html=True,
    )


inject_css()


# ---------------------------------------------------------------------------
# SIDEBAR — external systems status
# ---------------------------------------------------------------------------
with st.sidebar:
    st.markdown("### Статус внешних систем")
    if st.button("Проверить коннект", key="check_connectivity"):
        st.session_state["connectivity_check"] = {
            "openai": check_openai_connectivity(),
            "coingecko": check_coingecko_connectivity(),
        }

    check = st.session_state.get("connectivity_check")
    if check:
        openai_ok = check["openai"]
        cg_ok = check["coingecko"]
        st.markdown(
            f"**ИИ-Мозг (OpenAI):** {'Подключен ✅' if openai_ok else 'Ошибка ❌'}"
        )
        st.markdown(
            f"**Поток данных (CoinGecko):** {'Активен ✅' if cg_ok else 'Fallback-режим ⚠️'}"
        )
    else:
        st.caption("Нажмите «Проверить коннект» для диагностики API.")


# ---------------------------------------------------------------------------
# HERO
# ---------------------------------------------------------------------------
st.markdown(
    f"""
    <div class="tjt-hero">
        <h1>◆ TJT</h1>
        <p>{_platform_tagline()}</p>
        <span class="tjt-badge">Non-Custodial · CPA / RevShare · AI-Driven Traffic</span>
    </div>
    """,
    unsafe_allow_html=True,
)


# ===========================================================================
# MODULE 1 — INTERACTIVE LOSS CALCULATOR (Банки.ру layer)
# ===========================================================================
st.markdown('<div class="tjt-section">Калькулятор упущенной выгоды</div>', unsafe_allow_html=True)

b = CFG["fintech_benchmarks"]
default_capital = b.get("default_capital", b.get("default_capital_usd", 10000))
capital = st.number_input(
    "Ваш капитал ($)",
    min_value=0.0,
    value=float(default_capital),
    step=500.0,
    format="%.2f",
)

# Reactive math — recomputed on every rerun.
bank_gain = capital * b["bank_deposit_apr"] / 100.0
inflation_loss = capital * b["real_inflation_rate"] / 100.0
web3_gain = capital * b["web3_aggregator_apy"] / 100.0
missed_yield = web3_gain - bank_gain  # «Открытая упущенная выгода»

c1, c2, c3 = st.columns(3)
with c1:
    st.markdown(
        f"""
        <div class="tjt-metric">
            <div class="label">Банк · {b['bank_deposit_apr']}% APR</div>
            <div class="value val-neon">${bank_gain:,.0f}</div>
            <div class="sub">Номинальная прибыль за год</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
with c2:
    st.markdown(
        f"""
        <div class="tjt-metric">
            <div class="label">Инфляция · {b['real_inflation_rate']}%</div>
            <div class="value val-red">−${inflation_loss:,.0f}</div>
            <div class="sub">Эрозия покупательной способности</div>
        </div>
        """,
        unsafe_allow_html=True,
    )
with c3:
    st.markdown(
        f"""
        <div class="tjt-metric">
            <div class="label">Web3-пулы TJT · {b['web3_aggregator_apy']}% APY</div>
            <div class="value val-green">${web3_gain:,.0f}</div>
            <div class="sub">Потенциальный доход за год</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

# Final value — «Открытая упущенная выгода» (разница между Web3 и банком).
st.markdown(
    f"""
    <div class="tjt-result">
        <span class="cap">Открытая упущенная выгода — сколько вы недополучаете,
        держа капитал в банке вместо Web3-пулов TJT</span>
        <span class="big">${missed_yield:,.0f}</span>
    </div>
    """,
    unsafe_allow_html=True,
)


# ===========================================================================
# MODULE 2 — STREAMING MARKET MONITOR (CoinMarketCap layer + Self-Healing)
# ===========================================================================
st.markdown('<div class="tjt-section">Потоковый мониторинг рынка</div>', unsafe_allow_html=True)


def _ai_sentiment(symbol: str, change_24h: float) -> str:
    """
    Lightweight AI-style sentiment index derived from 24h momentum.
    Stablecoins are pinned to Neutral; everything else maps to a
    Fear / Neutral / Greed band by price action.
    """
    if symbol in ("USDT", "USDC", "DAI", "BUSD"):
        return "Neutral"
    if change_24h >= 2.5:
        return "Extreme Greed"
    if change_24h >= 0.5:
        return "Greed"
    if change_24h <= -2.5:
        return "Extreme Fear"
    if change_24h <= -0.5:
        return "Fear"
    return "Neutral"


@st.cache_data(ttl=120, show_spinner=False)
def fetch_market_data() -> Tuple[List[Dict[str, Any]], bool]:
    """
    Try the live CoinGecko markets endpoint. On ANY failure (rate limit, block,
    timeout, malformed payload) silently self-heal to the config.json snapshot.

    Returns (rows, is_live).
    """
    cg = COINGECKO_CFG
    try:
        resp = requests.get(
            cg["markets_endpoint"],
            params={
                "vs_currency": cg["vs_currency"],
                "ids": ",".join(cg["ids"]),
                "order": "market_cap_desc",
                "per_page": len(cg["ids"]),
                "page": 1,
            },
            timeout=cg["timeout_seconds"],
            headers=_coingecko_headers(),
        )
        resp.raise_for_status()
        payload = resp.json()
        if not isinstance(payload, list) or not payload:
            raise ValueError("Empty or malformed CoinGecko payload")

        rows: List[Dict[str, Any]] = []
        for i, coin in enumerate(payload, start=1):
            symbol = str(coin.get("symbol", "")).upper()
            change_24h = float(coin.get("price_change_percentage_24h") or 0.0)
            rows.append(
                {
                    "rank": coin.get("market_cap_rank") or i,
                    "symbol": symbol,
                    "name": coin.get("name", symbol),
                    "price": float(coin.get("current_price") or 0.0),
                    "market_cap": float(coin.get("market_cap") or 0.0),
                    "change_24h": change_24h,
                    "ai_sentiment": _ai_sentiment(symbol, change_24h),
                }
            )
        rows.sort(key=lambda r: r["market_cap"], reverse=True)
        return rows, True

    except Exception:
        # Self-Healing Matrix — fail closed to the static config snapshot.
        return _market_fallback_rows(), False


rows, is_live = fetch_market_data()
status = (
    f"<span class='val-green'>● LIVE · CoinGecko</span>"
    if is_live
    else f"<span class='val-neon'>● SELF-HEALING · локальный снимок</span>"
)
st.markdown(f"<div style='margin-bottom:8px'>{status}</div>", unsafe_allow_html=True)

df = pd.DataFrame(rows)
df_display = pd.DataFrame(
    {
        "#": df["rank"],
        "Актив": df["symbol"] + " · " + df["name"],
        "Цена": df["price"].map(lambda v: f"${v:,.2f}"),
        "Капитализация": df["market_cap"].map(lambda v: f"${v/1e9:,.1f}B"),
        "24ч %": df["change_24h"].map(lambda v: f"{v:+.2f}%"),
        "ИИ-Индекс тональности": df["ai_sentiment"],
    }
)
st.dataframe(df_display, hide_index=True, use_container_width=True)


# ===========================================================================
# MODULE 3 — ROBOT CONTROL TERMINAL (CrewAI pipelines)
# ===========================================================================
st.markdown('<div class="tjt-section">Терминал управления ИИ-роботами</div>', unsafe_allow_html=True)

st.markdown("#### Статус внешних систем")
conn_cols = st.columns([2, 2, 1])
with conn_cols[0]:
    openai_live = ai_agents.live_mode_enabled()
    st.markdown(
        f"**ИИ-Мозг (OpenAI):** {'Подключен ✅' if openai_live else 'Ошибка ❌'}"
    )
with conn_cols[1]:
    st.markdown(
        f"**Поток данных (CoinGecko):** {'Активен ✅' if is_live else 'Fallback-режим ⚠️'}"
    )
with conn_cols[2]:
    if st.button("Проверить коннект", key="check_connectivity_header"):
        st.session_state["connectivity_check"] = {
            "openai": check_openai_connectivity(),
            "coingecko": check_coingecko_connectivity(),
        }
        st.rerun()

mode_note = (
    "🟢 Live-режим: подключён OPENAI_API_KEY и CrewAI."
    if ai_agents.live_mode_enabled()
    else "🟡 Demo Mode Shield активен: генерируются статические демонстрации (ключ/CrewAI недоступны)."
)
st.caption(mode_note)

token_choices = [r["symbol"] for r in _market_fallback_rows()]
sel_token = st.selectbox("Токен для генерации", token_choices, index=0)

tab_seo, tab_video = st.tabs(["📝 Генератор SEO-статей", "🎬 Генератор Shorts-сценариев"])

with tab_seo:
    if st.button("Сгенерировать SEO-статью", key="gen_seo"):
        with st.spinner("ИИ-конвейер строит статью (SEO → Copy → Compliance)…"):
            article = ai_agents.generate_seo_article(sel_token)
            new_count = ai_agents.increment_metric("generated_articles_count")
        st.success(f"Готово. Всего сгенерировано статей: {new_count}")
        st.markdown(article)

with tab_video:
    if st.button("Сгенерировать Shorts-сценарий", key="gen_video"):
        with st.spinner("Growth-агент пишет посекундную раскадровку…"):
            script = ai_agents.generate_video_script(sel_token)
            new_count = ai_agents.increment_metric("generated_video_scripts_count")
        st.success(f"Готово. Всего сгенерировано сценариев: {new_count}")
        st.markdown(script)


# ===========================================================================
# MODULE 4 — CPA YIELD LEADERBOARD (outbound click-tracking / O-CTR)
# ===========================================================================
st.markdown('<div class="tjt-section">Витрина лидеров доходности (CPA)</div>', unsafe_allow_html=True)

offers = CFG["cpa_offers"]
offer_cols = st.columns(min(len(offers), 4) or 1)
for idx, offer in enumerate(offers):
    col = offer_cols[idx % len(offer_cols)]
    with col:
        st.markdown(
            f"""
            <div class="tjt-offer">
                <span class="rating">{offer['risk_rating']}</span>
                <div class="pool">{offer['name']}</div>
                <div class="net">{offer['protocol']} · {offer['network']} · мин. ${offer['min_entry_usd']}</div>
                <div class="apy">{offer['apy']}% APY</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
        if st.button("Открыть депозит", key=f"cpa_{offer['id']}"):
            total = ai_agents.log_outbound_click(offer)
            st.toast(
                f"Безопасный реферальный переход на смарт-контракт {offer['protocol']} "
                f"({offer['network']}). O-CTR зафиксирован (#{total}).",
                icon="🔗",
            )
            st.link_button("Перейти к протоколу →", offer["referral_url"])


# ===========================================================================
# MODULE 5 — CONSTITUTIONAL LEGAL SHIELD (footer)
# ===========================================================================
st.markdown(
    f"""
    <div class="tjt-legal">
        <h4>⚖️ Юридический дисклеймер</h4>
        {CFG.get('legal', {}).get('disclaimer') or _legal_disclaimer()}
    </div>
    """,
    unsafe_allow_html=True,
)
