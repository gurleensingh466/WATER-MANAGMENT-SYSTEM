from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import aiohttp
import os
from api.database import get_db
from api.models import models
from api.routes.auth import get_current_user

router = APIRouter()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
WEATHER_API_URL = "http://api.openweathermap.org/data/2.5/weather"

async def fetch_weather_data(lat: float, lon: float):
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.get(WEATHER_API_URL, params=params) as response:
            if response.status == 200:
                return await response.json()
            else:
                raise HTTPException(status_code=response.status, detail="Weather API error")

@router.get("/{lat}/{lon}")
async def get_weather(
    lat: float,
    lon: float,
    current_user: models.User = Depends(get_current_user)
):
    weather_data = await fetch_weather_data(lat, lon)
    return {
        "temperature": weather_data["main"]["temp"],
        "humidity": weather_data["main"]["humidity"],
        "weather_condition": weather_data["weather"][0]["main"],
        "description": weather_data["weather"][0]["description"],
        "wind_speed": weather_data["wind"]["speed"]
    }