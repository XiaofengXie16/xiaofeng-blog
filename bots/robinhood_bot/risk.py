"""Risk controls for the trading bot."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, List, Literal

from .config import RiskConfig

AssetType = Literal["stock", "option"]


@dataclass
class Position:
    """Represents an open position in the portfolio."""

    symbol: str
    quantity: float
    average_price: float
    asset_type: AssetType = "stock"

    @property
    def market_value(self) -> float:
        return self.quantity * self.average_price


@dataclass
class PortfolioState:
    """Simplified view of the account."""

    cash: float
    positions: List[Position] = field(default_factory=list)

    def equity(self) -> float:
        return self.cash + sum(position.market_value for position in self.positions)

    def count_open_positions(self, asset_type: AssetType | None = None) -> int:
        if asset_type:
            return sum(1 for position in self.positions if position.asset_type == asset_type)
        return len(self.positions)


class RiskManager:
    """Applies portfolio-level constraints before trades execute."""

    def __init__(self, config: RiskConfig, state: PortfolioState) -> None:
        self._config = config
        self._state = state

    def max_position_allocation(self) -> float:
        """Maximum dollar amount allowed per new trade."""

        equity = self._state.equity()
        return equity * self._config.max_equity_fraction_per_trade

    def can_add_position(self) -> bool:
        """Return `True` when the bot can open another position."""

        return self._state.count_open_positions() < self._config.max_open_positions

    def position_size_for_price(self, price: float) -> float:
        """Compute the quantity of shares to buy given the risk cap."""

        if price <= 0:
            raise ValueError("price must be positive")
        allocation = min(self.max_position_allocation(), self._state.cash)
        return max(allocation / price, 0)

    def apply_stop_loss(self, entry_price: float) -> float:
        """Return the stop loss price level."""

        return entry_price * (1 - self._config.stop_loss_fraction)

    def apply_take_profit(self, entry_price: float) -> float:
        """Return the take profit price level."""

        return entry_price * (1 + self._config.take_profit_fraction)

    def update_on_fill(self, symbol: str, quantity: float, price: float, asset_type: AssetType = "stock") -> None:
        """Update the in-memory portfolio after a fill."""

        if quantity == 0:
            return
        self._state.cash -= quantity * price
        self._state.positions.append(
            Position(symbol=symbol, quantity=quantity, average_price=price, asset_type=asset_type)
        )

    def load_positions(self, positions: Iterable[Position]) -> None:
        """Replace tracked positions with the provided iterable."""

        self._state.positions = list(positions)


__all__ = [
    "AssetType",
    "PortfolioState",
    "Position",
    "RiskManager",
]
