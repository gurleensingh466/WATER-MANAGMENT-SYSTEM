from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.database import get_db
from api.models import models, schemas
from api.routes.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.SensorData)
def create_sensor_data(
    sensor_data: schemas.SensorDataCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_sensor_data = models.SensorData(**sensor_data.dict())
    db.add(db_sensor_data)
    db.commit()
    db.refresh(db_sensor_data)
    return db_sensor_data

@router.get("/", response_model=List[schemas.SensorData])
def read_sensor_data(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    sensor_data = db.query(models.SensorData).offset(skip).limit(limit).all()
    return sensor_data

@router.get("/{sensor_id}/latest", response_model=schemas.SensorData)
def read_latest_sensor_data(
    sensor_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    sensor_data = db.query(models.SensorData)\
        .filter(models.SensorData.sensor_id == sensor_id)\
        .order_by(models.SensorData.timestamp.desc())\
        .first()
    if sensor_data is None:
        raise HTTPException(status_code=404, detail="Sensor data not found")
    return sensor_data