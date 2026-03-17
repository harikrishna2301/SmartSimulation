from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os

# -------------------------------------------------
# APP INIT
# -------------------------------------------------

app = FastAPI()

# -------------------------------------------------
# CORS
# -------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# PATHS
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

TRAFFIC_MODEL_PATH = os.path.join(MODELS_DIR, "traffic_model.pkl")
POLLUTION_MODEL_PATH = os.path.join(MODELS_DIR, "pollution_model.pkl")
DATA_PATH = os.path.join(DATA_DIR, "final_dataset.csv")

# -------------------------------------------------
# STEP 1 — DOWNLOAD FILES (FORCE EXECUTION)
# -------------------------------------------------

print("📥 Starting file download...")

try:
    import download_data
    print("✅ Download script executed")
except Exception as e:
    print("❌ Download failed:", e)

# -------------------------------------------------
# STEP 2 — WAIT UNTIL FILES EXIST (CRITICAL FIX)
# -------------------------------------------------

import time

for i in range(10):  # wait up to ~10 seconds
    if (
        os.path.exists(TRAFFIC_MODEL_PATH)
        and os.path.exists(POLLUTION_MODEL_PATH)
        and os.path.exists(DATA_PATH)
    ):
        print("✅ All files found")
        break
    print("⏳ Waiting for files...")
    time.sleep(1)
else:
    raise Exception("❌ Files not downloaded properly")

# -------------------------------------------------
# STEP 3 — LOAD MODELS SAFELY
# -------------------------------------------------

try:
    traffic_model = joblib.load(TRAFFIC_MODEL_PATH)
    pollution_model = joblib.load(POLLUTION_MODEL_PATH)
    print("✅ Models loaded successfully")
except Exception as e:
    raise Exception(f"❌ Model loading failed: {e}")

# -------------------------------------------------
# HEALTH CHECK
# -------------------------------------------------

@app.get("/")
def home():
    return {"message": "SmartSimulation Backend Running"}

# -------------------------------------------------
# PREDICTION API
# -------------------------------------------------

@app.get("/predict")
def predict(year: int, month: int, day: int, hour: int, weekday: int):

    try:
        traffic_input = pd.DataFrame({
            "year": [year],
            "month": [month],
            "day": [day],
            "hour": [hour],
            "weekday": [weekday]
        })

        predicted_traffic = traffic_model.predict(traffic_input)[0]

        pollution_input = pd.DataFrame({
            "traffic_flow": [predicted_traffic],
            "year": [year],
            "month": [month],
            "day": [day],
            "hour": [hour]
        })

        predicted_pm25 = pollution_model.predict(pollution_input)[0]

        return {
            "traffic": int(predicted_traffic),
            "pm25": float(predicted_pm25)
        }

    except Exception as e:
        return {"error": str(e)}

# -------------------------------------------------
# DASHBOARD DATA API
# -------------------------------------------------

@app.get("/data")
def get_data():

    try:
        df = pd.read_csv(DATA_PATH)

        df["Datetime"] = pd.to_datetime(df["Datetime"], errors="coerce")
        df["hour"] = df["Datetime"].dt.hour

        if "PM2.5" in df.columns:
            df = df.rename(columns={"PM2.5": "pm25"})

        if "traffic_flow" not in df.columns:
            df["traffic_flow"] = df["pm25"] * 3

        df = df.dropna(subset=["pm25", "traffic_flow", "hour"])

        df = df.groupby("hour")[["traffic_flow", "pm25"]].mean().reset_index()

        # FIX: Ensure full 24 hours
        full_hours = pd.DataFrame({"hour": list(range(24))})
        df = pd.merge(full_hours, df, on="hour", how="left")

        df["traffic_flow"] = df["traffic_flow"].fillna(0).round(0)
        df["pm25"] = df["pm25"].fillna(0).round(2)

        return df.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}