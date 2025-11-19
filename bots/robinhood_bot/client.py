"""Thin wrapper around `robin_stocks` for login and order placement.

The official Robinhood API is private and subject to change. This module
uses the popular reverse-engineered `robin_stocks` package. You should
review Robinhood's terms of service and ensure that automated access is
permitted for your account before enabling this bot."""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Optional

try:
    import robin_stocks.robinhood as rhood
except ImportError as exc:  # pragma: no cover - covered via docs/tests
    raise RuntimeError(
        "robin_stocks is required. Install dependencies with `pip install -r bots/robinhood_bot/requirements.txt`."
    ) from exc

from .config import AuthConfig


@dataclass
class LoginResult:
    """Stores details about an authenticated Robinhood session."""

    challenge_type: Optional[str]
    mfa_required: bool
    access_token: Optional[str]


class RobinhoodClient:
    """Handles authentication and simple order entry."""

    def __init__(self, auth_config: AuthConfig) -> None:
        self._auth_config = auth_config
        self._logged_in = False

    def login(self) -> LoginResult:
        """Authenticate with Robinhood using environment variables."""

        username = os.getenv(self._auth_config.username_env)
        password = os.getenv(self._auth_config.password_env)
        mfa_code = (
            os.getenv(self._auth_config.mfa_env) if self._auth_config.mfa_env else None
        )

        if not username or not password:
            raise RuntimeError(
                "Missing Robinhood credentials. Set the username and password environment variables."
            )

        challenge_type = None
        device_token = _load_device_token(self._auth_config.device_token_path)

        response = rhood.login(
            username=username,
            password=password,
            expiresIn=24 * 60 * 60,
            by_sms=not bool(mfa_code),
            mfa_code=mfa_code,
            store_session=True,
            device_token=device_token,
        )

        if isinstance(response, dict):
            challenge_type = response.get("challenge_type")
            mfa_required = bool(response.get("mfa_required"))
            access_token = response.get("access_token")
        else:
            challenge_type = None
            mfa_required = False
            access_token = None

        if device_token is None:
            generated = rhood.get_device_token()
            _persist_device_token(self._auth_config.device_token_path, generated)

        self._logged_in = True
        return LoginResult(
            challenge_type=challenge_type,
            mfa_required=mfa_required,
            access_token=access_token,
        )

    def ensure_login(self) -> None:
        """Login only if not already authenticated."""

        if not self._logged_in:
            self.login()

    def fetch_quotes(self, symbols: list[str]) -> list[Dict[str, Any]]:
        """Return latest quotes for the given symbols."""

        self.ensure_login()
        return rhood.get_quotes(symbols)

    def fetch_stock_history(self, symbol: str, interval: str = "day", span: str = "year") -> list[Dict[str, Any]]:
        """Retrieve historical candles for the stock."""

        self.ensure_login()
        return rhood.get_stock_historicals(symbol, interval=interval, span=span)

    def fetch_option_chain(self, symbol: str) -> Dict[str, Any]:
        """Return the option chain metadata for the underlying."""

        self.ensure_login()
        return rhood.get_options_chain(symbol)

    def fetch_options_by_expiration(
        self,
        symbol: str,
        expiration_date: str,
        option_type: str,
    ) -> list[Dict[str, Any]]:
        """Retrieve options filtered by expiration and type."""

        self.ensure_login()
        return rhood.find_options_by_expiration(
            inputSymbols=symbol,
            expirationDate=expiration_date,
            optionType=option_type,
        )

    def place_market_order(self, symbol: str, quantity: float, side: str) -> Dict[str, Any]:
        """Submit a market order for stock shares."""

        self.ensure_login()
        if side not in {"buy", "sell"}:
            raise ValueError("side must be 'buy' or 'sell'")
        return rhood.order(symbol=symbol, quantity=quantity, side=side, effect="close" if side == "sell" else "open")

    def place_options_order(
        self,
        symbol: str,
        quantity: int,
        strike: float,
        expiration_date: str,
        option_type: str,
        side: str,
        price: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Place a simple single-leg options order."""

        self.ensure_login()
        if option_type not in {"call", "put"}:
            raise ValueError("option_type must be 'call' or 'put'")
        if side not in {"buy", "sell"}:
            raise ValueError("side must be 'buy' or 'sell'")

        return rhood.order_buy_option_limit(
            position_effect="open" if side == "buy" else "close",
            credit_or_debit="debit" if side == "buy" else "credit",
            symbol=symbol,
            quantity=quantity,
            expiration_date=expiration_date,
            strike=strike,
            option_type=option_type,
            price=price or 0.05,
            time_in_force="gfd",
        )

    def cancel_all_open_orders(self) -> list[Any]:
        """Cancel every open order for the account."""

        self.ensure_login()
        return rhood.cancel_all_open_orders()


def _load_device_token(path: Path) -> Optional[str]:
    """Try to load the stored device token so Robinhood trusts the session."""

    if not path.exists():
        return None
    try:
        return path.read_text().strip()
    except OSError:
        return None


def _persist_device_token(path: Path, token: str) -> None:
    """Persist the device token for future logins."""

    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(token)
    except OSError:
        pass


__all__ = ["LoginResult", "RobinhoodClient"]
