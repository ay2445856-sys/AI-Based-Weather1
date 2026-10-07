"""
Launcher script for ForecastGuard AI: AI-Based Forecast Bust Detection.
Runs FastAPI with Uvicorn on http://127.0.0.1:8000
"""

import uvicorn
import webbrowser
import threading
import time
import sys

def open_browser():
    time.sleep(1.5)
    print("\n>>> Launching ForecastGuard AI in your default web browser...")
    webbrowser.open("http://127.0.0.1:8000")

if __name__ == "__main__":
    print("=" * 70)
    print(" FORECASTGUARD AI: Medium-Range Weather Forecast Bust Detection ")
    print(" Smart India Hackathon (SIH) Intelligent Weather Platform ")
    print(" Server URL: http://127.0.0.1:8000 ")
    print("=" * 70)

    # Launch browser automatically
    threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
