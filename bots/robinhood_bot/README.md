# Robinhood Trading Bot Prototype

> ⚠️ **Educational use only.** Automating a Robinhood account can
> violate the platform's Terms of Service or applicable regulations.
> Review the legal implications and operate at your own risk.

This folder contains a Python reference implementation for evaluating a
moving-average stock strategy with optional debit spread follow-ups. The
bot avoids placing orders by default; it exports signals to
`signals.json` so you can manually review the plan.

## Features

- Moving-average crossover with RSI confirmation for stocks
- Optional directional debit spread builder aligned to the stock bias
- Simple position sizing and stop/take-profit helper
- JSON export for downstream automation or manual review

## Prerequisites

- Python 3.10+
- Robinhood account with API session enabled (Subject to Robinhood TOS)
- `robin-stocks` dependency (`pip install -r requirements.txt`)

Export your credentials as environment variables before running:

```bash
export ROBINHOOD_USERNAME="your-email@example.com"
export ROBINHOOD_PASSWORD="your-password"
# optional: MFA code if enabled
export ROBINHOOD_MFA="123456"
```

The bot stores the Robinhood device token in
`~/.config/robinhood/device_token` to maintain session continuity.

## Quick Start

```bash
cd bots/robinhood_bot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m bots.robinhood_bot.bot
```

The CLI will fetch data, evaluate signals, and write `signals.json`. The
`--live` flag is intentionally disabled—extend `TradingBot.run` if you
want to place orders after adding additional safety checks (order
validation, rate limiting, logging, etc.).

## Strategy Parameters

All tunable settings live in `config.py` and are rolled into the
`BotConfig` dataclass. Defaults:

- **Universe**: `SPY`, `AAPL`, `MSFT`, `QQQ` (stocks) with options
  unlocked for `SPY` and `AAPL`
- **Stock strategy**: 10/30 SMA crossover with RSI confirmation
- **Options strategy**: 15–45 day debit spreads targeting ~0.30 delta
- **Risk**: 20% of equity per position, max four concurrent positions,
  7% stop loss, 12% take profit

Update these numbers to match your risk tolerance and market outlook.

## Next Steps

1. Integrate historical data caching to reduce API calls.
2. Add portfolio sync (e.g., `robin_stocks.build_holdings`) to size sells accurately.
3. Implement logging + alerting for produced signals.
4. Thoroughly backtest the strategy before committing real capital.
