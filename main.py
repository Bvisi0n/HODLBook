from flask import Flask, send_from_directory
import threading
import webbrowser
import time
import os

app = Flask(__name__, static_folder="web", static_url_path="")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

def launch_browser():
    time.sleep(1)
    webbrowser.open("http://localhost:5000")

if __name__ == "__main__":
    try:
        print("[DEBUG] __main__ block entered")
        threading.Thread(target=launch_browser).start()
        print("[DEBUG] Starting Flask server at http://localhost:5000")
        app.run(port=5000)
    except Exception as e:
        import traceback
        traceback.print_exc()
        input("❌ Error occurred — press Enter to close...")
