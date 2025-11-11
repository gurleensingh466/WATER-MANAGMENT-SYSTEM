from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional, List
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(title="Water Monitoring System API")

# CORS middleware configuration
origins = os.getenv("CORS_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from api.routes import sensors, weather, hazards, alerts, auth, irrigation, dashboard, water_usage, pump_stats

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(sensors.router, prefix="/api/sensors", tags=["Sensors"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(hazards.router, prefix="/api/hazards", tags=["Hazards"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(irrigation.router, prefix="/api", tags=["Irrigation"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(water_usage.router, tags=["Water Usage"])
app.include_router(pump_stats.router, tags=["Pump Stats"])

@app.get("/")
async def root():
    return {"message": "Water Monitoring System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)