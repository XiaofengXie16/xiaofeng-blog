"""Trading strategies for stocks and options."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional

from .config import OptionsStrategyConfig, StockStrategyConfig
from .data import (
    Candle,
    IndicatorError,
    closing_prices,
    momentum,
    moving_average,
    percent_change,
    relative_strength_index,
)
from .risk import RiskManager


class SignalType(str, Enum):
    """Signal types returned by strategies."""

    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"


@dataclass
class StockSignal:
    """Decision for a stock symbol."""

    symbol: str
    signal: SignalType
    confidence: float
    price: float
    note: str


@dataclass
class OptionSpreadPlan:
    """Represents a directional debit spread idea."""

    symbol: str
    direction: str
    expiration: str
    long_strike: float
    short_strike: float
    limit_debit: float
    contracts: int
    confidence: float
    note: str


class StockStrategy:
    """Moving-average crossover combined with RSI confirmation."""

    def __init__(self, config: StockStrategyConfig) -> None:
        self._config = config

    def evaluate(self, symbol: str, candles: list[Candle]) -> StockSignal:
        prices = closing_prices(candles)
        price = prices[-1]
        try:
            fast_ma = moving_average(prices, self._config.fast_window)
            slow_ma = moving_average(prices, self._config.slow_window)
            rsi = relative_strength_index(prices, self._config.rsi_window)
            mom = momentum(prices, lookback=self._config.fast_window)
        except IndicatorError:
            return StockSignal(
                symbol=symbol,
                signal=SignalType.HOLD,
                confidence=0.0,
                price=price,
                note="Insufficient history for indicators",
            )

        ma_spread = (fast_ma - slow_ma) / slow_ma if slow_ma else 0.0
        rsi_distance = abs(rsi - 50) / 50
        mom_bias = 1 if mom > 0 else -1 if mom < 0 else 0

        if fast_ma > slow_ma and rsi >= self._config.rsi_buy_threshold and mom > 0:
            confidence = min(max(ma_spread * 5 + rsi_distance * 0.6, 0.1), 1.0)
            note = f"Fast MA cross up; RSI {rsi:.1f}; momentum positive"
            return StockSignal(symbol, SignalType.BUY, confidence, price, note)

        if fast_ma < slow_ma and rsi <= self._config.rsi_sell_threshold and mom < 0:
            confidence = min(max(abs(ma_spread) * 5 + rsi_distance * 0.6, 0.1), 1.0)
            note = f"Fast MA cross down; RSI {rsi:.1f}; momentum negative"
            return StockSignal(symbol, SignalType.SELL, confidence, price, note)

        bias = "mild bullish" if mom_bias > 0 else "mild bearish" if mom_bias < 0 else "neutral"
        note = f"No clear edge; MA spread {ma_spread:.4f}; RSI {rsi:.1f}; momentum {bias}"
        return StockSignal(symbol, SignalType.HOLD, 0.0, price, note)


class OptionsStrategy:
    """Directional debit spreads aligned to the stock strategy bias."""

    def __init__(self, config: OptionsStrategyConfig) -> None:
        self._config = config

    def build_spread(
        self,
        signal: StockSignal,
        candles: list[Candle],
        client,
        risk_manager: RiskManager,
    ) -> Optional[OptionSpreadPlan]:
        if signal.signal is SignalType.HOLD:
            return None

        direction = "bull_call_debit" if signal.signal is SignalType.BUY else "bear_put_debit"
        option_type = "call" if signal.signal is SignalType.BUY else "put"

        # Determine budget reserved for options
        per_trade_budget = risk_manager.max_position_allocation() * self._config.premium_budget_fraction
        if per_trade_budget <= 0:
            return None

        chain = client.fetch_option_chain(signal.symbol)
        expirations = chain.get("expiration_dates", [])
        if not expirations:
            return None

        chosen_expiration = self._select_expiration(expirations)
        if not chosen_expiration:
            return None

        contracts = client.fetch_options_by_expiration(signal.symbol, chosen_expiration, option_type)
        if not contracts:
            return None

        long_leg = self._select_long_leg(contracts, option_type)
        if not long_leg:
            return None

        spread = self._match_short_leg(contracts, long_leg)
        if not spread:
            return None

        long_strike, short_strike, long_price, short_price = spread
        debit = max(long_price - short_price, 0.01)
        contract_value = debit * 100
        max_contracts = int(per_trade_budget // contract_value)
        if max_contracts <= 0:
            return None

        confidence = min(signal.confidence + 0.2, 1.0)
        note = (
            f"Target delta ~{self._config.target_delta}; debit ${debit:.2f}; "
            f"uses expiration {chosen_expiration}"
        )

        return OptionSpreadPlan(
            symbol=signal.symbol,
            direction=direction,
            expiration=chosen_expiration,
            long_strike=long_strike,
            short_strike=short_strike,
            limit_debit=round(debit, 2),
            contracts=max_contracts,
            confidence=confidence,
            note=note,
        )

    def _select_expiration(self, expirations: list[str]) -> Optional[str]:
        today = datetime.utcnow().date()
        window = []
        for exp in expirations:
            try:
                exp_date = datetime.strptime(exp, "%Y-%m-%d").date()
            except ValueError:
                continue
            days_to_expiry = (exp_date - today).days
            if self._config.min_days_to_expiry <= days_to_expiry <= self._config.max_days_to_expiry:
                window.append((days_to_expiry, exp))
        if not window:
            return None
        window.sort(key=lambda item: item[0])
        return window[0][1]

    def _select_long_leg(self, contracts: list[dict], option_type: str) -> Optional[dict]:
        target = self._config.target_delta
        best: tuple[float, dict] | None = None
        for contract in contracts:
            try:
                delta_raw = float(contract.get("delta", 0))
                ask_price = float(contract.get("ask_price") or contract.get("last_trade_price"))
                strike = float(contract["strike_price"])
            except (TypeError, ValueError, KeyError):
                continue
            if ask_price <= 0:
                continue
            delta = abs(delta_raw)
            distance = abs(delta - target)
            if option_type == "put" and delta_raw > 0:
                continue
            if option_type == "call" and delta_raw < 0:
                continue
            if best is None or distance < best[0]:
                best = (distance, contract)
        return best[1] if best else None

    def _match_short_leg(self, contracts: list[dict], long_leg: dict) -> Optional[tuple[float, float, float, float]]:
        try:
            long_strike = float(long_leg["strike_price"])
            long_price = float(long_leg.get("ask_price") or long_leg.get("last_trade_price"))
        except (KeyError, TypeError, ValueError):
            return None

        target_short_strike = long_strike + self._config.spread_width if long_leg["type"] == "call" else long_strike - self._config.spread_width
        best: tuple[float, dict] | None = None
        for contract in contracts:
            try:
                strike = float(contract["strike_price"])
                bid_price = float(contract.get("bid_price") or contract.get("last_trade_price") or 0)
            except (KeyError, TypeError, ValueError):
                continue
            if contract["expiration_date"] != long_leg["expiration_date"]:
                continue
            if contract["type"] != long_leg["type"]:
                continue
            distance = abs(strike - target_short_strike)
            if best is None or distance < best[0]:
                best = (distance, contract)
        if best is None:
            return None
        short_leg = best[1]
        try:
            short_strike = float(short_leg["strike_price"])
            short_price = float(short_leg.get("bid_price") or short_leg.get("last_trade_price") or 0)
        except (KeyError, TypeError, ValueError):
            return None
        return long_strike, short_strike, long_price, short_price


__all__ = [
    "OptionSpreadPlan",
    "OptionsStrategy",
    "SignalType",
    "StockSignal",
    "StockStrategy",
]
