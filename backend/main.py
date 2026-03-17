from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
import download_data

app = FastAPI()

# -------------------------------------------------
# CORS (allow frontend)
# -------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Paths
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

TRAFFIC_MODEL_PATH = os.path.join(MODELS_DIR, "traffic_model.pkl")
POLLUTION_MODEL_PATH = os.path.join(MODELS_DIR, "pollution_model.pkl")
DATA_PATH = os.path.join(DATA_DIR, "final_dataset.csv")

# -------------------------------------------------
# SAFE MODEL LOADING (IMPORTANT FIX)
# -------------------------------------------------

traffic_model = None
pollution_model = None

try:
    traffic_model = joblib.load(TRAFFIC_MODEL_PATH)
    pollution_model = joblib.load(POLLUTION_MODEL_PATH)
    print("✅ Models loaded successfully")

except Exception as e:
    print("❌ Error loading models:", e)

# -------------------------------------------------
# Health Check
# -------------------------------------------------

@app.get("/")
def home():
    return {"message": "SmartSimulation Backend Running"}

# -------------------------------------------------
# Prediction API
# -------------------------------------------------

@app.get("/predict")
def predict(year: int, month: int, day: int, hour: int, weekday: int):

    if traffic_model is None or pollution_model is None:
        return {"error": "Models not loaded properly"}

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
# Dashboard Data API
# -------------------------------------------------

@app.get("/data")
def get_data():

    try:
        df = pd.read_csv(DATA_PATH)

        # Convert datetime safely
        df["Datetime"] = pd.to_datetime(df["Datetime"], errors="coerce")

        df["hour"] = df["Datetime"].dt.hour

        # Rename column safely
        if "PM2.5" in df.columns:
            df = df.rename(columns={"PM2.5": "pm25"})

        # Create traffic if missing
        if "traffic_flow" not in df.columns:
            df["traffic_flow"] = df["pm25"] * 3

        # Clean data
        df = df.dropna(subset=["pm25", "traffic_flow", "hour"])

        # Group properly
        df = df.groupby("hour")[["traffic_flow", "pm25"]].mean().reset_index()

        # Ensure full 0–23 hours (IMPORTANT FIX for your chart issue)
        full_hours = pd.DataFrame({"hour": list(range(24))})
        df = pd.merge(full_hours, df, on="hour", how="left")

        df["traffic_flow"] = df["traffic_flow"].fillna(0).round(0)
        df["pm25"] = df["pm25"].fillna(0).round(2)

        return df.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}