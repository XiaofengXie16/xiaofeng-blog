"""Data ingestion and indicator calculations for the trading bot."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from statistics import mean
from typing import Iterable, List, Sequence


@dataclass
class Candle:
    """Represents a single OHLCV bar."""

    begins_at: datetime
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: float


class IndicatorError(RuntimeError):
    """Raised when indicator calculations cannot be completed."""


def parse_historicals(raw: Sequence[dict]) -> List[Candle]:
    """Convert Robinhood historical data into `Candle`s."""

    candles: List[Candle] = []
    for entry in raw:
        try:
            begins_at = datetime.fromisoformat(entry["begins_at"].replace("Z", "+00:00"))
            open_price = float(entry["open_price"])
            high_price = float(entry["high_price"])
            low_price = float(entry["low_price"])
            close_price = float(entry["close_price"])
            volume = float(entry.get("volume", 0.0))
        except (KeyError, TypeError, ValueError) as exc:
            raise IndicatorError("Malformed candle data from Robinhood API") from exc
        candles.append(
            Candle(
                begins_at=begins_at,
                open_price=open_price,
                high_price=high_price,
                low_price=low_price,
                close_price=close_price,
                volume=volume,
            )
        )
    return candles


def closing_prices(candles: Sequence[Candle]) -> List[float]:
    """Extract closing prices from candles."""

    return [candle.close_price for candle in candles]


def moving_average(values: Sequence[float], window: int) -> float:
    """Return the simple moving average for the trailing window."""

    if window <= 0:
        raise ValueError("window must be positive")
    if len(values) < window:
        raise IndicatorError("Not enough data for moving average")
    window_slice = values[-window:]
    return mean(window_slice)


def relative_strength_index(values: Sequence[float], window: int = 14) -> float:
    """Compute the RSI for the trailing window of values."""

    if window <= 0:
        raise ValueError("window must be positive")
    if len(values) <= window:
        raise IndicatorError("Not enough data for RSI")

    gains: List[float] = []
    losses: List[float] = []
    for previous, current in zip(values[-window - 1 : -1], values[-window:]):
        change = current - previous
        if change >= 0:
            gains.append(change)
            losses.append(0.0)
        else:
            gains.append(0.0)
            losses.append(abs(change))

    average_gain = sum(gains) / window
    average_loss = sum(losses) / window

    if average_loss == 0:
        return 100.0

    relative_strength = average_gain / average_loss
    return 100 - (100 / (1 + relative_strength))


def momentum(values: Sequence[float], lookback: int = 10) -> float:
    """Compute the simple momentum (price difference) from `lookback` periods ago."""

    if lookback <= 0:
        raise ValueError("lookback must be positive")
    if len(values) <= lookback:
        raise IndicatorError("Not enough data for momentum")
    return values[-1] - values[-lookback - 1]


def percent_change(old: float, new: float) -> float:
    """Compute percentage change between old and new values."""

    if old == 0:
        raise ZeroDivisionError("old value must not be zero")
    return (new - old) / old


def tail(values: Iterable[float], size: int) -> List[float]:
    """Return the last `size` values from an iterable."""

    buffer: List[float] = []
    for value in values:
        buffer.append(value)
        if len(buffer) > size:
            buffer.pop(0)
    return buffer


__all__ = [
    "Candle",
    "IndicatorError",
    "closing_prices",
    "momentum",
    "moving_average",
    "parse_historicals",
    "percent_change",
    "relative_strength_index",
    "tail",
]
