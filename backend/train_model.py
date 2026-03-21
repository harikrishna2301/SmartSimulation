import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# -----------------------------
# LOAD DATA
# -----------------------------
df = pd.read_csv("data/final_dataset.csv")

df["Datetime"] = pd.to_datetime(df["Datetime"], errors="coerce")

# -----------------------------
# BASIC FEATURES
# -----------------------------
df["year"] = df["Datetime"].dt.year
df["month"] = df["Datetime"].dt.month
df["day"] = df["Datetime"].dt.day
df["hour"] = df["Datetime"].dt.hour
df["weekday"] = df["Datetime"].dt.weekday

# Rename pollution column
if "PM2.5" in df.columns:
    df = df.rename(columns={"PM2.5": "pm25"})

# -----------------------------
# CLEAN DATA
# -----------------------------
df = df.dropna()
df = df[df["traffic_flow"] > 0]
df = df[df["pm25"] > 0]

# -----------------------------
# ADVANCED FEATURES
# -----------------------------
df["is_weekend"] = (df["weekday"] >= 5).astype(int)

df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)

# -----------------------------
# TIME SERIES FEATURES (IMPORTANT)
# -----------------------------
df["traffic_avg_3"] = df["traffic_flow"].rolling(3).mean()
df["traffic_avg_6"] = df["traffic_flow"].rolling(6).mean()
df["pm25_avg_3"] = df["pm25"].rolling(3).mean()
df["pm25_avg_6"] = df["pm25"].rolling(6).mean()

df = df.dropna()

# -----------------------------
# TRAFFIC MODEL
# -----------------------------
X1 = df[["year", "month", "day", "hour", "weekday"]]
y1 = df["traffic_flow"]

X1 = X1.astype("float32")
y1 = y1.astype("float32")

X_train, X_test, y_train, y_test = train_test_split(X1, y1, test_size=0.2, random_state=42)

traffic_model = RandomForestRegressor(
    n_estimators=40,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    n_jobs=-1,
    random_state=42
)

traffic_model.fit(X_train, y_train)

pred1 = traffic_model.predict(X_test)
print("Traffic R2:", r2_score(y_test, pred1))

joblib.dump(traffic_model, "models/traffic_model.pkl", compress=5)

# -----------------------------
# POLLUTION MODEL (IMPROVED)
# -----------------------------
X2 = df[[
    "traffic_flow",
    "traffic_avg_3",
    "traffic_avg_6",
    "pm25_avg_3",
    "pm25_avg_6",
    "year",
    "month",
    "day",
    "hour",
    "weekday",
    "is_weekend",
    "hour_sin",
    "hour_cos"
]]

y2 = df["pm25"]

X2 = X2.astype("float32")
y2 = y2.astype("float32")

X_train, X_test, y_train, y_test = train_test_split(X2, y2, test_size=0.2, random_state=42)

pollution_model = RandomForestRegressor(
    n_estimators=120,
    max_depth=20,
    min_samples_split=3,
    min_samples_leaf=1,
    n_jobs=-1,
    random_state=42
)

pollution_model.fit(X_train, y_train)

pred2 = pollution_model.predict(X_test)
print("Pollution R2:", r2_score(y_test, pred2))

joblib.dump(pollution_model, "models/pollution_model.pkl", compress=5)

print("✅ Models saved successfully")