"""Configuration helpers for the Robinhood trading bot.

This module keeps strategy, risk, and authentication settings in one
place so the rest of the bot can remain focused on behavior."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import time
from pathlib import Path
from typing import List, Sequence


@dataclass
class AuthConfig:
    """Holds Robinhood authentication information.

    For security, credentials should be supplied through environment
    variables or a `.env` file that is excluded from version control.
    """

    username_env: str = "ROBINHOOD_USERNAME"
    password_env: str = "ROBINHOOD_PASSWORD"
    mfa_env: str | None = "ROBINHOOD_MFA"
    device_token_path: Path = Path.home() / ".config" / "robinhood" / "device_token"


@dataclass
class UniverseConfig:
    """Symbols available for the bot to trade."""

    stocks: Sequence[str] = ("SPY", "AAPL", "MSFT", "QQQ")
    option_underlyings: Sequence[str] = ("SPY", "AAPL")


@dataclass
class StockStrategyConfig:
    """Parameters for the moving-average crossover strategy."""

    fast_window: int = 10
    slow_window: int = 30
    rsi_window: int = 14
    rsi_buy_threshold: float = 55.0
    rsi_sell_threshold: float = 45.0


@dataclass
class OptionsStrategyConfig:
    """Parameters for the directional debit spread strategy."""

    min_days_to_expiry: int = 15
    max_days_to_expiry: int = 45
    target_delta: float = 0.3
    spread_width: float = 5.0
    premium_budget_fraction: float = 0.15


@dataclass
class RiskConfig:
    """Risk controls applied by the bot."""

    max_equity_fraction_per_trade: float = 0.2
    max_open_positions: int = 4
    stop_loss_fraction: float = 0.07
    take_profit_fraction: float = 0.12


@dataclass
class ScheduleConfig:
    """Trading schedule controls."""

    market_open: time = time(hour=9, minute=30)
    market_close: time = time(hour=15, minute=45)
    cooldown_minutes: int = 5


@dataclass
class BotConfig:
    """Top-level configuration for the trading bot."""

    cash_budget: float = 1_000.0
    auth: AuthConfig = field(default_factory=AuthConfig)
    universe: UniverseConfig = field(default_factory=UniverseConfig)
    stock_strategy: StockStrategyConfig = field(default_factory=StockStrategyConfig)
    options_strategy: OptionsStrategyConfig = field(default_factory=OptionsStrategyConfig)
    risk: RiskConfig = field(default_factory=RiskConfig)
    schedule: ScheduleConfig = field(default_factory=ScheduleConfig)
    export_path: Path = Path("bots") / "robinhood_bot" / "signals.json"


DEFAULT_CONFIG = BotConfig()


def pretty_symbols(symbols: Sequence[str]) -> str:
    """Return a comma-separated string representation of symbols."""

    return ", ".join(symbols)


__all__ = [
    "AuthConfig",
    "BotConfig",
    "DEFAULT_CONFIG",
    "OptionsStrategyConfig",
    "RiskConfig",
    "ScheduleConfig",
    "StockStrategyConfig",
    "UniverseConfig",
    "pretty_symbols",
]
