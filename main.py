from flask import (
    Flask,
    send_from_directory,
    request,
    redirect,
    render_template_string,
    jsonify
)
import threading
import webbrowser
import time
import os
import logging
import json
from hodlbook.portfolio import (
    add_token,
    get_portfolio,
    update_token,
    delete_token
)

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

@app.route("/portfolio")
def get_portfolio_json():
    return jsonify(get_portfolio())

@app.route("/add_token", methods=["POST"])
def add_token_route():
    data = request.get_json() or request.form
    symbol = data.get("symbol", "").upper()

    try:
        amount = float(data.get("amount"))
    except (ValueError, TypeError):
        return "Invalid amount", 400

    try:
        add_token(symbol, amount)
    except ValueError as e:
        return str(e), 409

    return "", 204

@app.route("/update_token", methods=["POST"])
def update_token_route():
    data = request.get_json()
    symbol = data.get("symbol", "").upper()
    try:
        amount = float(data.get("amount"))
    except (ValueError, TypeError):
        return "Invalid amount", 400

    update_token(symbol, amount)
    return "", 204

@app.route("/delete_token", methods=["POST"])
def delete_token_route():
    data = request.get_json()
    symbol = data.get("symbol", "").upper()
    delete_token(symbol)
    return "", 204

def launch_browser():
    logging.debug("launch_browser function started")
    time.sleep(1)
    webbrowser.open("http://localhost:5000")

if __name__ == "__main__":
    logging.debug("Entering main block")
    threading.Thread(target=launch_browser).start()
    logging.debug("Starting Flask server")
    app.run(port=5000, debug=True)
