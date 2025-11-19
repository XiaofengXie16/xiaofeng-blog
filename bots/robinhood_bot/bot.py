"""Top-level orchestration for the Robinhood trading bot.

The bot is designed to operate conservatively:

* Evaluate a moving-average crossover strategy for the configured stock universe.
* Generate stock and (optional) options debit spread playbooks.
* Enforce basic risk limits before sizing trades.
* Export the signals to JSON and optionally place live orders.

By default the script runs in dry-run mode and simply writes the plan to
`signals.json`. Carefully test with paper trading or very small size
before placing real orders."""
from __future__ import annotations

import argparse
import json
from dataclasses import asdict
from datetime import datetime
from math import floor
from pathlib import Path
from typing import Any, Dict, List

from .client import RobinhoodClient
from .config import BotConfig, DEFAULT_CONFIG
from .data import parse_historicals
from .risk import PortfolioState, RiskManager
from .strategy import OptionSpreadPlan, OptionsStrategy, SignalType, StockSignal, StockStrategy


class TradingBot:
    """Coordinates data fetching, strategy execution, and risk checks."""

    def __init__(
        self,
        config: BotConfig = DEFAULT_CONFIG,
        client: RobinhoodClient | None = None,
        portfolio: PortfolioState | None = None,
    ) -> None:
        self.config = config
        self.client = client or RobinhoodClient(config.auth)
        self.portfolio = portfolio or PortfolioState(cash=config.cash_budget)
        self.risk_manager = RiskManager(config.risk, self.portfolio)
        self.stock_strategy = StockStrategy(config.stock_strategy)
        self.options_strategy = OptionsStrategy(config.options_strategy)

    def run(self, dry_run: bool = True, export: bool = True) -> Dict[str, Any]:
        """Execute the trading cycle and optionally export signals."""

        insights: Dict[str, Any] = {
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "cash_budget": self.config.cash_budget,
            "dry_run": dry_run,
            "stocks": [],
            "options": [],
            "notes": [
                "Educational use only. Verify compliance with Robinhood TOS before enabling automation."
            ],
        }

        for symbol in self.config.universe.stocks:
            stock_plan = self._evaluate_stock(symbol)
            if stock_plan:
                insights["stocks"].append(stock_plan)

        for symbol in self.config.universe.option_underlyings:
            option_plan = self._evaluate_option(symbol)
            if option_plan:
                insights["options"].append(option_plan)

        if export:
            self._export_signals(insights)

        return insights

    def _evaluate_stock(self, symbol: str) -> Dict[str, Any] | None:
        history = self.client.fetch_stock_history(symbol, interval="day", span="year")
        candles = parse_historicals(history)
        signal = self.stock_strategy.evaluate(symbol, candles)

        result = {
            "symbol": symbol,
            "signal": signal.signal.value,
            "confidence": round(signal.confidence, 3),
            "price": round(signal.price, 2),
            "note": signal.note,
        }

        if signal.signal is SignalType.BUY:
            if not self.risk_manager.can_add_position():
                result["sizing"] = "Blocked by max position limit"
                return result
            quantity = floor(self.risk_manager.position_size_for_price(signal.price))
            if quantity <= 0:
                result["sizing"] = "Insufficient cash for minimum size"
            else:
                result["action"] = {
                    "type": "market_buy",
                    "quantity": quantity,
                    "est_cost": round(quantity * signal.price, 2),
                    "stop_loss": round(self.risk_manager.apply_stop_loss(signal.price), 2),
                    "take_profit": round(self.risk_manager.apply_take_profit(signal.price), 2),
                }
        elif signal.signal is SignalType.SELL:
            result["action"] = {"type": "review_open_position", "plan": "Consider trimming or closing"}

        return result

    def _evaluate_option(self, symbol: str) -> Dict[str, Any] | None:
        history = self.client.fetch_stock_history(symbol, interval="day", span="year")
        candles = parse_historicals(history)
        stock_signal = self.stock_strategy.evaluate(symbol, candles)
        plan = self.options_strategy.build_spread(stock_signal, candles, self.client, self.risk_manager)
        if not plan:
            return None
        return self._option_plan_to_dict(plan)

    def _option_plan_to_dict(self, plan: OptionSpreadPlan) -> Dict[str, Any]:
        payload = asdict(plan)
        payload["limit_debit"] = float(plan.limit_debit)
        payload["confidence"] = round(plan.confidence, 3)
        return payload

    def _export_signals(self, insights: Dict[str, Any]) -> None:
        path = self.config.export_path
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(insights, indent=2))
        except OSError as exc:
            raise RuntimeError(f"Could not export signals to {path}: {exc}")


def run_from_cli(argv: List[str] | None = None) -> Dict[str, Any]:
    parser = argparse.ArgumentParser(description="Robinhood trading bot prototype")
    parser.add_argument("--live", action="store_true", help="Place live orders (default false)")
    parser.add_argument("--no-export", action="store_true", help="Do not write signals.json")
    args = parser.parse_args(argv)

    bot = TradingBot()
    insights = bot.run(dry_run=not args.live, export=not args.no_export)

    if args.live:
        raise NotImplementedError(
            "Live mode is disabled by default. Extend `TradingBot` to place orders after additional safeguards."
        )

    return insights


if __name__ == "__main__":  # pragma: no cover - manual runs only
    run_from_cli()
