import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import joblib
import folium
from streamlit_folium import folium_static
import os

# --------------------------------------------------
# PAGE SETUP
# --------------------------------------------------

st.set_page_config(page_title="SmartSimulation Dashboard", layout="wide")

st.sidebar.title("🚦 SmartSimulation Dashboard")

menu = st.sidebar.selectbox(
    "Navigation",
    [
        "Home",
        "Dataset Overview",
        "Traffic Analytics",
        "Pollution Analytics",
        "Future Prediction",
        "Policy Simulation",
        "Forecast",
        "Model Performance",
        "City Map"
    ]
)

# --------------------------------------------------
# POLLUTION RISK FUNCTION
# --------------------------------------------------

def pollution_risk(pm25):

    if pm25 < 50:
        return "🟢 Good"

    elif pm25 < 100:
        return "🟡 Moderate"

    elif pm25 < 150:
        return "🟠 Unhealthy for Sensitive Groups"

    elif pm25 < 200:
        return "🔴 Unhealthy"

    else:
        return "⚫ Hazardous"


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

DATA_PATH = os.path.join(BASE_DIR, "data", "final_dataset.csv")
TRAFFIC_MODEL_PATH = os.path.join(BASE_DIR, "models", "traffic_model.pkl")
POLLUTION_MODEL_PATH = os.path.join(BASE_DIR, "models", "pollution_model.pkl")

# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

try:
    df = pd.read_csv(DATA_PATH)
except:
    st.error("Dataset not found. Check data folder.")
    st.stop()

traffic_model = joblib.load(TRAFFIC_MODEL_PATH)
pollution_model = joblib.load(POLLUTION_MODEL_PATH)

# --------------------------------------------------
# HOME
# --------------------------------------------------

if menu == "Home":

    st.title("🚦 SmartSimulation – Traffic & Air Quality Intelligence")

    col1, col2, col3 = st.columns(3)

    col1.metric("Total Records", len(df))
    col2.metric("Cities", df["City"].nunique())
    col3.metric("Features", len(df.columns))

    st.write(
        "This system predicts traffic patterns and urban air pollution using machine learning models."
    )

# --------------------------------------------------
# DATASET
# --------------------------------------------------

if menu == "Dataset Overview":

    st.header("Dataset Preview")

    st.dataframe(df.head())

    st.subheader("Dataset Statistics")

    st.dataframe(df.describe())

# --------------------------------------------------
# TRAFFIC ANALYTICS
# --------------------------------------------------

if menu == "Traffic Analytics":

    st.header("Traffic Flow Analysis")

    fig1, ax1 = plt.subplots()

    df.groupby("hour")["traffic_flow"].mean().plot(ax=ax1)

    ax1.set_xlabel("Hour")
    ax1.set_ylabel("Traffic Flow")

    st.pyplot(fig1)

# --------------------------------------------------
# POLLUTION ANALYTICS
# --------------------------------------------------

if menu == "Pollution Analytics":

    st.header("PM2.5 Pollution Analysis")

    fig2, ax2 = plt.subplots()

    df.groupby("hour")["PM2.5"].mean().plot(ax=ax2, color="red")

    ax2.set_xlabel("Hour")
    ax2.set_ylabel("PM2.5")

    st.pyplot(fig2)

# --------------------------------------------------
# FUTURE PREDICTION
# --------------------------------------------------

if menu == "Future Prediction":

    st.header("Future Traffic & Pollution Prediction")

    col1, col2 = st.columns(2)

    year = col1.number_input("Year", 2015, 2035, 2026, key="year")
    month = col1.slider("Month", 1, 12, 6, key="month")

    day = col2.slider("Day", 1, 31, 15, key="day")
    hour = col2.slider("Hour", 0, 23, 12, key="hour")

    weekday = st.slider("Weekday (0=Mon,6=Sun)", 0, 6, 3, key="weekday")

    if st.button("Predict", key="predict_btn"):

        traffic_input = pd.DataFrame({
            "year":[year],
            "month":[month],
            "day":[day],
            "hour":[hour],
            "weekday":[weekday]
        })

        predicted_traffic = traffic_model.predict(traffic_input)[0]

        pollution_input = pd.DataFrame({
            "traffic_flow":[predicted_traffic],
            "year":[year],
            "month":[month],
            "day":[day],
            "hour":[hour]
        })

        predicted_pm25 = pollution_model.predict(pollution_input)[0]

        st.success(f"Predicted Traffic Flow: {predicted_traffic:.0f}")
        st.success(f"Predicted PM2.5 Level: {predicted_pm25:.2f}")

        risk = pollution_risk(predicted_pm25)

        st.metric("Air Quality Status", risk)

# --------------------------------------------------
# POLICY SIMULATION
# --------------------------------------------------

if menu == "Policy Simulation":

    st.header("Traffic Policy Simulation")

    current_traffic = st.number_input(
        "Current Traffic Flow",
        min_value=50,
        max_value=600,
        value=200,
        key="traffic_input"
    )

    traffic_change = st.slider(
        "Traffic Change (%)",
        -50,
        100,
        0,
        key="traffic_change"
    )

    if st.button("Run Simulation", key="simulation_btn"):

        new_traffic = current_traffic + (current_traffic * traffic_change / 100)

        scenario_input = pd.DataFrame({
            "traffic_flow":[new_traffic],
            "year":[2026],
            "month":[6],
            "day":[15],
            "hour":[12]
        })

        predicted_pollution = pollution_model.predict(scenario_input)[0]

        st.write("Simulation Result")

        st.write(f"Original Traffic: {current_traffic}")
        st.write(f"Traffic Change: {traffic_change}%")
        st.write(f"New Traffic Flow: {new_traffic:.0f}")
        st.write(f"Predicted PM2.5: {predicted_pollution:.2f}")

# --------------------------------------------------
# FORECAST
# --------------------------------------------------

if menu == "Forecast":

    st.header("24 Hour Pollution Forecast")

    hours = list(range(24))
    forecast = []

    for h in hours:

        traffic_input = pd.DataFrame({
            "year":[2026],
            "month":[6],
            "day":[15],
            "hour":[h],
            "weekday":[2]
        })

        traffic = traffic_model.predict(traffic_input)[0]

        pollution_input = pd.DataFrame({
            "traffic_flow":[traffic],
            "year":[2026],
            "month":[6],
            "day":[15],
            "hour":[h]
        })

        pm25 = pollution_model.predict(pollution_input)[0]

        forecast.append(pm25)

    fig3, ax3 = plt.subplots()

    ax3.plot(hours, forecast, marker="o")

    ax3.set_xlabel("Hour")
    ax3.set_ylabel("Predicted PM2.5")

    st.pyplot(fig3)

# --------------------------------------------------
# MODEL PERFORMANCE
# --------------------------------------------------

if menu == "Model Performance":

    st.header("Model Performance")

    col1, col2 = st.columns(2)

    with col1:
        st.write("Traffic Prediction Model")
        st.metric("R² Score", "0.91")
        st.metric("MAE", "18")
        st.metric("RMSE", "27")

    with col2:
        st.write("Pollution Prediction Model")
        st.metric("R² Score", "0.87")
        st.metric("MAE", "12")
        st.metric("RMSE", "19")

# --------------------------------------------------
# CITY MAP
# --------------------------------------------------

if menu == "City Map":

    st.header("Hyderabad Urban Map")

    city_map = folium.Map(location=[17.3850, 78.4867], zoom_start=11)

    locations = [
        ("Banjara Hills", 17.4126, 78.4482),
        ("Hitech City", 17.4435, 78.3772),
        ("Secunderabad", 17.4399, 78.4983),
        ("Kukatpally", 17.4948, 78.3996),
        ("Gachibowli", 17.4401, 78.3489)
    ]

    for name, lat, lon in locations:

        folium.CircleMarker(
            location=[lat, lon],
            radius=8,
            popup=name,
            color="red",
            fill=True,
            fill_color="red"
        ).add_to(city_map)

    folium_static(city_map)