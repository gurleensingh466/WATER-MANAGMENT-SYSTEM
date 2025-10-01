from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
from api.database import get_db
from api.models import models, schemas
from api.routes.auth import get_current_user
import aiohttp
import os

router = APIRouter()

# Constants for calculations
CROP_WATER_REQUIREMENTS = {
    "rice": 1200,  # mm per season
    "wheat": 450,
    "corn": 500,
    "cotton": 700,
    "sugarcane": 1500,
    "potato": 350,
    "tomato": 400,
    "soybean": 450
}

SOIL_MOISTURE_FACTOR = {
    "clay": 0.9,
    "loam": 1.0,
    "sandy": 1.2
}

PUMP_POWER_RATINGS = {
    "0.5hp": 0.373,  # kW
    "1hp": 0.746,
    "2hp": 1.492,
    "3hp": 2.238,
    "5hp": 3.73
}

ELECTRICITY_RATE = 8.50  # Rs per kWh

async def fetch_weather_data(lat: float, lon: float):
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    url = f"http://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise HTTPException(status_code=response.status, detail="Weather API error")

@router.get("/weather/{lat}/{lon}")
async def get_weather_data(lat: float, lon: float):
    weather_data = await fetch_weather_data(lat, lon)
    return {
        "temperature": weather_data["main"]["temp"],
        "humidity": weather_data["main"]["humidity"],
        "rainfall": weather_data.get("rain", {}).get("1h", 0),
        "wind_speed": weather_data["wind"]["speed"],
        "description": weather_data["weather"][0]["description"]
    }

@router.post("/calculate-water-requirement")
async def calculate_water_requirement(
    crop_type: str,
    land_size: float,
    land_unit: str,
    soil_type: str = "loam",
    weather_data: dict = Depends(get_weather_data)
):
    # Convert land size to hectares
    size_in_hectares = convert_to_hectares(land_size, land_unit)
    
    # Base water requirement
    base_requirement = CROP_WATER_REQUIREMENTS.get(crop_type.lower(), 500)
    
    # Adjust for soil type
    soil_factor = SOIL_MOISTURE_FACTOR.get(soil_type.lower(), 1.0)
    
    # Adjust for weather conditions
    weather_factor = calculate_weather_factor(weather_data)
    
    # Calculate daily water requirement (liters)
    daily_requirement = (
        base_requirement * size_in_hectares * 10000 * soil_factor * weather_factor / 90
    )  # Assuming 90 days growing season
    
    return {
        "daily_requirement_liters": round(daily_requirement, 2),
        "daily_requirement_cubic_meters": round(daily_requirement / 1000, 2),
        "factors": {
            "soil_factor": soil_factor,
            "weather_factor": weather_factor
        }
    }

@router.get("/pump-usage")
async def get_pump_usage(
    start_date: str,
    end_date: str,
    pump_power: str = "2hp",
    db: Session = Depends(get_db)
):
    # Calculate electricity usage and cost
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    # Get pump running hours from database
    pump_logs = get_pump_logs(db, start, end)
    
    # Calculate electricity consumption
    power_rating = PUMP_POWER_RATINGS.get(pump_power.lower(), 1.492)  # Default to 2hp
    total_hours = sum(log.duration for log in pump_logs)
    electricity_consumed = power_rating * total_hours  # kWh
    electricity_cost = electricity_consumed * ELECTRICITY_RATE
    
    return {
        "total_hours": total_hours,
        "electricity_consumed_kwh": round(electricity_consumed, 2),
        "electricity_cost_rs": round(electricity_cost, 2),
        "logs": pump_logs
    }

@router.get("/leakage-detection")
async def check_leakage(db: Session = Depends(get_db)):
    # Get recent sensor readings
    recent_readings = get_recent_flow_readings(db)
    
    # Analyze for anomalies
    anomalies = detect_flow_anomalies(recent_readings)
    
    return {
        "has_leakage": len(anomalies) > 0,
        "anomalies": anomalies,
        "recommendations": generate_leakage_recommendations(anomalies)
    }

@router.get("/optimal-schedule")
async def get_optimal_schedule(
    crop_type: str,
    land_size: float,
    land_unit: str,
    db: Session = Depends(get_db)
):
    # Get weather forecast
    weather_data = await get_weather_forecast()
    
    # Calculate optimal watering times
    schedule = calculate_optimal_schedule(
        crop_type,
        land_size,
        land_unit,
        weather_data
    )
    
    return {
        "schedule": schedule,
        "weather_forecast": weather_data
    }

# Helper functions
def convert_to_hectares(size: float, unit: str) -> float:
    conversions = {
        "acre": 0.404686,
        "hectare": 1,
        "killa": 0.404686,  # Same as acre in many regions
        "gaj": 0.000008361,
        "sqmeter": 0.0001
    }
    return size * conversions.get(unit.lower(), 1)

def calculate_weather_factor(weather_data: dict) -> float:
    temperature = weather_data["temperature"]
    humidity = weather_data["humidity"]
    rainfall = weather_data["rainfall"]
    
    # Base factor
    factor = 1.0
    
    # Temperature adjustment
    if temperature > 35:
        factor *= 1.2
    elif temperature < 20:
        factor *= 0.8
    
    # Humidity adjustment
    if humidity < 40:
        factor *= 1.2
    elif humidity > 80:
        factor *= 0.8
    
    # Rainfall adjustment
    if rainfall > 0:
        factor *= max(0.5, 1 - (rainfall * 0.1))
    
    return factor

def get_pump_logs(db: Session, start_date: datetime, end_date: datetime):
    return db.query(models.PumpLog).filter(
        models.PumpLog.timestamp.between(start_date, end_date)
    ).all()

def get_recent_flow_readings(db: Session):
    # Get last 24 hours of readings
    yesterday = datetime.now() - timedelta(days=1)
    return db.query(models.SensorData).filter(
        models.SensorData.timestamp >= yesterday
    ).all()

def detect_flow_anomalies(readings: List[models.SensorData]):
    anomalies = []
    if not readings:
        return anomalies
    
    # Calculate average flow
    avg_flow = sum(r.flow_rate for r in readings) / len(readings)
    
    # Detect significant deviations
    for reading in readings:
        if reading.flow_rate > avg_flow * 1.5:  # 50% above average
            anomalies.append({
                "timestamp": reading.timestamp,
                "flow_rate": reading.flow_rate,
                "type": "high_flow"
            })
        elif reading.flow_rate < avg_flow * 0.5:  # 50% below average
            anomalies.append({
                "timestamp": reading.timestamp,
                "flow_rate": reading.flow_rate,
                "type": "low_flow"
            })
    
    return anomalies

def generate_leakage_recommendations(anomalies: List[dict]):
    recommendations = []
    for anomaly in anomalies:
        if anomaly["type"] == "high_flow":
            recommendations.append(
                "Possible pipe burst or major leak detected. Check pipes and connections."
            )
        elif anomaly["type"] == "low_flow":
            recommendations.append(
                "Possible blockage or minor leak detected. Check for clogged filters or damaged pipes."
            )
    return recommendations

async def get_weather_forecast():
    # Implement 5-day weather forecast fetch from OpenWeather API
    pass

def calculate_optimal_schedule(crop_type: str, land_size: float, land_unit: str, weather_forecast: dict):
    # Implementation for optimal schedule calculation
    pass