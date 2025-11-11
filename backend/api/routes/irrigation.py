from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for irrigation schedule
class IrrigationScheduleBase(BaseModel):
    cropName: str
    fieldLocation: str
    moistureLevel: int
    startTime: str
    endTime: str
    waterUsed: int
    date: str
    weather: str
    nextSchedule: Optional[str] = None
    workerName: str
    status: str
    notes: Optional[str] = None

class IrrigationScheduleCreate(IrrigationScheduleBase):
    pass

class IrrigationScheduleUpdate(IrrigationScheduleBase):
    pass

class IrrigationSchedule(IrrigationScheduleBase):
    id: int
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        orm_mode = True

# In-memory storage (replace with database in production)
irrigation_schedules_db = {}
schedule_id_counter = 1

@router.get("/irrigation-schedules", response_model=List[IrrigationSchedule])
async def get_all_schedules(
    status: Optional[str] = None,
    cropType: Optional[str] = None,
    startDate: Optional[str] = None,
    endDate: Optional[str] = None
):
    """
    Get all irrigation schedules with optional filters
    """
    schedules = list(irrigation_schedules_db.values())
    
    # Apply filters
    if status:
        schedules = [s for s in schedules if s.status.lower() == status.lower()]
    
    if cropType:
        schedules = [s for s in schedules if s.cropName.lower() == cropType.lower()]
    
    if startDate:
        schedules = [s for s in schedules if s.date >= startDate]
    
    if endDate:
        schedules = [s for s in schedules if s.date <= endDate]
    
    return schedules

@router.get("/irrigation-schedules/{schedule_id}", response_model=IrrigationSchedule)
async def get_schedule(schedule_id: int):
    """
    Get a specific irrigation schedule by ID
    """
    if schedule_id not in irrigation_schedules_db:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    return irrigation_schedules_db[schedule_id]

@router.post("/irrigation-schedules", response_model=IrrigationSchedule)
async def create_schedule(schedule: IrrigationScheduleCreate):
    """
    Create a new irrigation schedule
    """
    global schedule_id_counter
    
    new_schedule = IrrigationSchedule(
        id=schedule_id_counter,
        **schedule.dict(),
        createdAt=datetime.now(),
        updatedAt=datetime.now()
    )
    
    irrigation_schedules_db[schedule_id_counter] = new_schedule
    schedule_id_counter += 1
    
    return new_schedule

@router.put("/irrigation-schedules/{schedule_id}", response_model=IrrigationSchedule)
async def update_schedule(schedule_id: int, schedule: IrrigationScheduleUpdate):
    """
    Update an existing irrigation schedule
    """
    if schedule_id not in irrigation_schedules_db:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    updated_schedule = IrrigationSchedule(
        id=schedule_id,
        **schedule.dict(),
        createdAt=irrigation_schedules_db[schedule_id].createdAt,
        updatedAt=datetime.now()
    )
    
    irrigation_schedules_db[schedule_id] = updated_schedule
    
    return updated_schedule

@router.delete("/irrigation-schedules/{schedule_id}")
async def delete_schedule(schedule_id: int):
    """
    Delete an irrigation schedule
    """
    if schedule_id not in irrigation_schedules_db:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    deleted_schedule = irrigation_schedules_db.pop(schedule_id)
    
    return {
        "message": "Schedule deleted successfully",
        "deleted_schedule": deleted_schedule
    }

@router.get("/irrigation-schedules/stats/today")
async def get_today_stats():
    """
    Get statistics for today's irrigation schedules
    """
    today = date.today().isoformat()
    today_schedules = [s for s in irrigation_schedules_db.values() if s.date == today]
    
    completed = len([s for s in today_schedules if s.status.lower() == "completed"])
    pending = len([s for s in today_schedules if s.status.lower() == "pending"])
    in_progress = len([s for s in today_schedules if s.status.lower() == "in progress"])
    total_water = sum(s.waterUsed for s in today_schedules if s.status.lower() == "completed")
    
    return {
        "date": today,
        "total_schedules": len(today_schedules),
        "completed": completed,
        "pending": pending,
        "in_progress": in_progress,
        "total_water_used": total_water
    }

@router.get("/irrigation-schedules/stats/summary")
async def get_summary_stats():
    """
    Get summary statistics for all irrigation schedules
    """
    all_schedules = list(irrigation_schedules_db.values())
    
    total = len(all_schedules)
    completed = len([s for s in all_schedules if s.status.lower() == "completed"])
    pending = len([s for s in all_schedules if s.status.lower() == "pending"])
    in_progress = len([s for s in all_schedules if s.status.lower() == "in progress"])
    
    # Calculate total water usage
    total_water = sum(s.waterUsed for s in all_schedules if s.status.lower() == "completed")
    
    # Get unique fields and crops
    unique_fields = len(set(s.fieldLocation for s in all_schedules))
    unique_crops = len(set(s.cropName for s in all_schedules))
    
    return {
        "total_schedules": total,
        "completed": completed,
        "pending": pending,
        "in_progress": in_progress,
        "total_water_used": total_water,
        "unique_fields": unique_fields,
        "unique_crops": unique_crops
    }
