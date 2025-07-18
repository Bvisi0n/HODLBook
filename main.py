from flask import Flask, send_from_directory
import threading
import webbrowser
import time
import os
import logging

logging.basicConfig(
    level=logging.DEBUG,  # Default level — show debug output
    format="%(levelname)s: %(message)s"
)

app = Flask(__name__, static_folder="web", static_url_path="")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

def launch_browser():
    logging.debug("launch_browser function started")
    time.sleep(1)
    webbrowser.open("http://localhost:5000")

if __name__ == "__main__":
    logging.debug("Entering main block")
    threading.Thread(target=launch_browser).start()
    logging.debug("Starting Flask server")
    app.run(port=5000, debug=True)
    