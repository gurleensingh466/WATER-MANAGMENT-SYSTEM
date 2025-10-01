from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.database import get_db
from api.models import models, schemas
from api.routes.auth import get_current_user
from api.routes.alerts import send_alert

router = APIRouter()

def analyze_water_quality(sensor_data: models.SensorData) -> dict:
    hazards = []
    severity = "Safe"

    # Temperature check (°C)
    if sensor_data.temperature > 30:
        hazards.append("High temperature")
        severity = "Warning"
    elif sensor_data.temperature > 35:
        hazards.append("Critical temperature")
        severity = "Critical"

    # pH level check
    if sensor_data.ph_level < 6.5 or sensor_data.ph_level > 8.5:
        hazards.append("Abnormal pH level")
        severity = "Warning"
    elif sensor_data.ph_level < 6.0 or sensor_data.ph_level > 9.0:
        hazards.append("Critical pH level")
        severity = "Critical"

    # Turbidity check (NTU)
    if sensor_data.turbidity > 5:
        hazards.append("High turbidity")
        severity = "Warning"
    elif sensor_data.turbidity > 10:
        hazards.append("Critical turbidity")
        severity = "Critical"

    # Dissolved oxygen check (mg/L)
    if sensor_data.dissolved_oxygen < 5:
        hazards.append("Low dissolved oxygen")
        severity = "Warning"
    elif sensor_data.dissolved_oxygen < 3:
        hazards.append("Critical dissolved oxygen")
        severity = "Critical"

    return {
        "severity": severity,
        "hazards": hazards
    }

@router.post("/analyze", response_model=schemas.HazardLog)
async def analyze_hazards(
    sensor_data: schemas.SensorDataCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Save sensor data
    db_sensor_data = models.SensorData(**sensor_data.dict())
    db.add(db_sensor_data)
    db.commit()
    db.refresh(db_sensor_data)

    # Analyze hazards
    analysis = analyze_water_quality(db_sensor_data)
    
    # Create hazard log
    hazard_log = models.HazardLog(
        severity=analysis["severity"],
        description=", ".join(analysis["hazards"]) if analysis["hazards"] else "No hazards detected",
        sensor_data_id=db_sensor_data.id
    )
    db.add(hazard_log)
    db.commit()
    db.refresh(hazard_log)

    # Send alert if severity is Warning or Critical
    if analysis["severity"] in ["Warning", "Critical"]:
        await send_alert(
            hazard_log.severity,
            hazard_log.description,
            current_user.phone_number
        )

    return hazard_log

@router.get("/", response_model=List[schemas.HazardLog])
def read_hazard_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    hazard_logs = db.query(models.HazardLog)\
        .order_by(models.HazardLog.timestamp.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return hazard_logs