from flask import Flask, send_from_directory, request, redirect, render_template_string
import threading
import webbrowser
import time
import os
import logging
import json
from hodlbook.portfolio import add_token

logging.basicConfig(
    level=logging.DEBUG,
    format="%(levelname)s: %(message)s"
)

app = Flask(__name__, static_folder="web", static_url_path="")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

@app.route("/add_token", methods=["POST"])
def add_token_route():
    symbol = request.form.get("symbol", "").upper()
    try:
        amount = float(request.form.get("amount", ""))
    except ValueError:
        return "Invalid input", 400

    add_token(symbol, amount)
    return redirect("/portfolio")

@app.route("/portfolio")
def portfolio_view():
    try:
        with open("data/portfolio.json") as f:
            portfolio = json.load(f)
    except:
        portfolio = []

    return render_template_string("""
        <h3>Current Portfolio</h3>
        <ul>
            {% for token in portfolio %}
              <li>{{ token['symbol'] }} — {{ token['amount'] }}</li>
            {% endfor %}
        </ul>
        <p><a href="/">Back</a></p>
    """, portfolio=portfolio)

def launch_browser():
    logging.debug("launch_browser function started")
    time.sleep(1)
    webbrowser.open("http://localhost:5000")

if __name__ == "__main__":
    logging.debug("Entering main block")
    threading.Thread(target=launch_browser).start()
    logging.debug("Starting Flask server")
    app.run(port=5000, debug=True)
