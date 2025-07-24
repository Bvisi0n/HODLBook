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

def add_token(symbol, amount):
    filepath = "data/portfolio.json"
    if os.path.exists(filepath):
        with open(filepath) as f:
            portfolio = json.load(f)
    else:
        portfolio = []

    if any(token["symbol"] == symbol for token in portfolio):
        raise ValueError(f"Token '{symbol}' already exists")

    portfolio.append({"symbol": symbol, "amount": amount})

    with open(filepath, "w") as f:
        json.dump(portfolio, f, indent=2)


def get_portfolio():
    return _load_portfolio()

def update_token(symbol, amount):
    filepath = "data/portfolio.json"
    if os.path.exists(filepath):
        with open(filepath) as f:
            portfolio = json.load(f)
    else:
        portfolio = []

    found = False
    for token in portfolio:
        if token["symbol"] == symbol:
            token["amount"] = amount
            found = True
            break

    if not found:
        raise ValueError(f"Token '{symbol}' not found")

    with open(filepath, "w") as f:
        json.dump(portfolio, f, indent=2)

def delete_token(symbol):
    filepath = "data/portfolio.json"
    if os.path.exists(filepath):
        with open(filepath) as f:
            portfolio = json.load(f)
    else:
        portfolio = []

    new_portfolio = [t for t in portfolio if t["symbol"] != symbol]
    if len(new_portfolio) == len(portfolio):
        raise ValueError(f"Token '{symbol}' not found")

    with open(filepath, "w") as f:
        json.dump(new_portfolio, f, indent=2)
