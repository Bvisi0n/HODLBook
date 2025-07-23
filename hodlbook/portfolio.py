import os
import json

DATA_DIR = "data"
PORTFOLIO_FILE = os.path.join(DATA_DIR, "portfolio.json")

def _load_portfolio():
    if not os.path.exists(PORTFOLIO_FILE):
        return []
    with open(PORTFOLIO_FILE, "r") as f:
        return json.load(f)

def _save_portfolio(data):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(PORTFOLIO_FILE, "w") as f:
        json.dump(data, f, indent=2)

def add_token(symbol: str, amount: float):
    symbol = symbol.upper()
    portfolio = _load_portfolio()

    for entry in portfolio:
        if entry["symbol"] == symbol:
            entry["amount"] = amount
            _save_portfolio(portfolio)
            return

    portfolio.append({
        "symbol": symbol,
        "amount": amount
    })
    _save_portfolio(portfolio)

def get_portfolio():
    return _load_portfolio()

def update_token(symbol: str, amount: float):
    symbol = symbol.upper()
    portfolio = _load_portfolio()

    for entry in portfolio:
        if entry["symbol"] == symbol:
            entry["amount"] = amount
            _save_portfolio(portfolio)
            return

def delete_token(symbol: str):
    symbol = symbol.upper()
    portfolio = _load_portfolio()
    new_portfolio = [entry for entry in portfolio if entry["symbol"] != symbol]
    _save_portfolio(new_portfolio)
