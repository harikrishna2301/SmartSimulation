from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os

app = FastAPI()

# -------------------------------------------------
# Allow React frontend to access backend
# -------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Project Paths
# -------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

TRAFFIC_MODEL_PATH = os.path.join(MODELS_DIR, "traffic_model.pkl")
POLLUTION_MODEL_PATH = os.path.join(MODELS_DIR, "pollution_model.pkl")

DATA_PATH = os.path.join(DATA_DIR, "final_dataset.csv")

# -------------------------------------------------
# Load ML Models
# -------------------------------------------------

traffic_model = joblib.load(TRAFFIC_MODEL_PATH)
pollution_model = joblib.load(POLLUTION_MODEL_PATH)

# -------------------------------------------------
# Health Check API
# -------------------------------------------------

@app.get("/")
def home():
    return {"message": "SmartSimulation Backend Running"}

# -------------------------------------------------
# Prediction API
# -------------------------------------------------

@app.get("/predict")
def predict(year: int, month: int, day: int, hour: int, weekday: int):

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

# -------------------------------------------------
# Dashboard Data API
# -------------------------------------------------

@app.get("/data")
def get_data():

    df = pd.read_csv(DATA_PATH)

    df["Datetime"] = pd.to_datetime(df["Datetime"])

    df["hour"] = df["Datetime"].dt.hour

    df = df.rename(columns={"PM2.5": "pm25"})

    if "traffic_flow" not in df.columns:
        df["traffic_flow"] = df["pm25"] * 3

    df = df.dropna(subset=["pm25", "traffic_flow"])

    # Average values per hour
    df = df.groupby("hour")[["traffic_flow","pm25"]].mean().reset_index()

    # Round values
    df["pm25"] = df["pm25"].round(2)
    df["traffic_flow"] = df["traffic_flow"].round(0)

    return df.to_dict(orient="records")