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

TRAFFIC_MODEL_PATH = os.path.join(BASE_DIR, "../models/traffic_model.pkl")
POLLUTION_MODEL_PATH = os.path.join(BASE_DIR, "../models/pollution_model.pkl")
DATA_PATH = os.path.join(BASE_DIR, "../data/final_dataset.csv")

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

    # Clean dataset
    df = df.dropna(subset=["PM2.5", "traffic_flow"])

    # Rename columns for frontend
    df = df.rename(columns={
        "PM2.5": "pm25"
    })

    df = df[["hour", "traffic_flow", "pm25"]]

    return df.head(200).to_dict(orient="records")