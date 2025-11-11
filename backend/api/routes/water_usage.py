"""
Water Usage API Routes
Handles all water usage related operations including CRUD, statistics, and analytics
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, date, timedelta
from enum import Enum

router = APIRouter(prefix="/api/water-usage", tags=["water-usage"])

# Enums
class UsageStatus(str, Enum):
    OPTIMAL = "optimal"
    OVERUSED = "overused"
    UNDERUSED = "underused"

class WaterSource(str, Enum):
    TANK = "Tank"
    BOREWELL = "Borewell"
    RAINWATER = "Rainwater"
    CANAL = "Canal"

# Pydantic Models
class WaterUsageBase(BaseModel):
    field_name: str = Field(..., description="Name of the field")
    crop_type: str = Field(..., description="Type of crop")
    date: date = Field(..., description="Date of water usage")
    water_used: float = Field(..., gt=0, description="Amount of water used in liters")
    start_time: str = Field(..., description="Start time of irrigation (HH:MM)")
    end_time: str = Field(..., description="End time of irrigation (HH:MM)")
    flow_rate: float = Field(0.0, ge=0, description="Flow rate in L/min")
    source: WaterSource = Field(WaterSource.TANK, description="Water source")
    notes: Optional[str] = Field(None, description="Additional notes")

class WaterUsageCreate(WaterUsageBase):
    pass

class WaterUsageUpdate(BaseModel):
    field_name: Optional[str] = None
    crop_type: Optional[str] = None
    date: Optional[date] = None
    water_used: Optional[float] = Field(None, gt=0)
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    flow_rate: Optional[float] = Field(None, ge=0)
    source: Optional[WaterSource] = None
    notes: Optional[str] = None

class WaterUsageResponse(WaterUsageBase):
    id: int
    status: UsageStatus
    cost: float
    duration: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_water_today: float
    target_water: float
    avg_usage: float
    total_cost: float
    efficiency: float
    water_trend: float
    usage_trend: float
    cost_trend: float
    efficiency_trend: float

class SourceLevel(BaseModel):
    name: str
    level_percentage: int
    current_volume: float
    total_capacity: float
    status: str

class UsageTrend(BaseModel):
    dates: List[str]
    values: List[float]

class UsageDistribution(BaseModel):
    labels: List[str]
    values: List[float]

# In-memory storage (replace with database in production)
water_usage_db: List[dict] = [
    {
        "id": 1,
        "field_name": "Field A-01",
        "crop_type": "Wheat",
        "date": date.today() - timedelta(days=0),
        "water_used": 5200.0,
        "start_time": "06:00",
        "end_time": "08:30",
        "flow_rate": 45.5,
        "source": "Tank",
        "status": "optimal",
        "cost": 312.0,
        "duration": "2h 30m",
        "notes": "",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 2,
        "field_name": "Field B-03",
        "crop_type": "Rice",
        "date": date.today() - timedelta(days=0),
        "water_used": 8500.0,
        "start_time": "05:30",
        "end_time": "09:00",
        "flow_rate": 48.2,
        "source": "Borewell",
        "status": "optimal",
        "cost": 510.0,
        "duration": "3h 30m",
        "notes": "",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 3,
        "field_name": "Field C-02",
        "crop_type": "Corn",
        "date": date.today() - timedelta(days=0),
        "water_used": 3200.0,
        "start_time": "07:00",
        "end_time": "08:45",
        "flow_rate": 42.0,
        "source": "Rainwater",
        "status": "underused",
        "cost": 192.0,
        "duration": "1h 45m",
        "notes": "",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 4,
        "field_name": "Field A-02",
        "crop_type": "Cotton",
        "date": date.today() - timedelta(days=1),
        "water_used": 6800.0,
        "start_time": "06:15",
        "end_time": "09:30",
        "flow_rate": 50.5,
        "source": "Canal",
        "status": "overused",
        "cost": 408.0,
        "duration": "3h 15m",
        "notes": "",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 5,
        "field_name": "Field D-01",
        "crop_type": "Tomato",
        "date": date.today() - timedelta(days=1),
        "water_used": 4500.0,
        "start_time": "08:00",
        "end_time": "10:15",
        "flow_rate": 44.0,
        "source": "Tank",
        "status": "optimal",
        "cost": 270.0,
        "duration": "2h 15m",
        "notes": "",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
]

next_id = 6

# Helper functions
def calculate_duration(start_time: str, end_time: str) -> str:
    """Calculate duration between start and end time"""
    start_parts = list(map(int, start_time.split(':')))
    end_parts = list(map(int, end_time.split(':')))
    
    start_minutes = start_parts[0] * 60 + start_parts[1]
    end_minutes = end_parts[0] * 60 + end_parts[1]
    
    duration_minutes = end_minutes - start_minutes
    if duration_minutes < 0:
        duration_minutes += 24 * 60
    
    hours = duration_minutes // 60
    minutes = duration_minutes % 60
    
    return f"{hours}h {minutes}m"

def calculate_cost(water_used: float) -> float:
    """Calculate cost based on water usage"""
    cost_per_liter = 0.06  # ₹0.06 per liter
    return round(water_used * cost_per_liter, 2)

def determine_status(water_used: float, crop_type: str) -> UsageStatus:
    """Determine usage status based on crop requirements"""
    # Simplified logic - should use actual crop requirements
    thresholds = {
        "Rice": (7000, 10000),
        "Wheat": (4000, 6000),
        "Corn": (3000, 5000),
        "Cotton": (5000, 7500),
        "Tomato": (3500, 5500)
    }
    
    if crop_type not in thresholds:
        return UsageStatus.OPTIMAL
    
    min_water, max_water = thresholds[crop_type]
    
    if water_used < min_water:
        return UsageStatus.UNDERUSED
    elif water_used > max_water:
        return UsageStatus.OVERUSED
    else:
        return UsageStatus.OPTIMAL

# API Endpoints

@router.get("", response_model=List[WaterUsageResponse])
async def get_water_usage(
    field_name: Optional[str] = Query(None, description="Filter by field name"),
    crop_type: Optional[str] = Query(None, description="Filter by crop type"),
    status: Optional[UsageStatus] = Query(None, description="Filter by status"),
    date_from: Optional[date] = Query(None, description="Filter from date"),
    date_to: Optional[date] = Query(None, description="Filter to date"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records"),
    skip: int = Query(0, ge=0, description="Number of records to skip")
):
    """
    Get all water usage records with optional filters
    """
    filtered_records = water_usage_db.copy()
    
    # Apply filters
    if field_name:
        filtered_records = [r for r in filtered_records if field_name.lower() in r["field_name"].lower()]
    
    if crop_type:
        filtered_records = [r for r in filtered_records if crop_type.lower() == r["crop_type"].lower()]
    
    if status:
        filtered_records = [r for r in filtered_records if r["status"] == status]
    
    if date_from:
        filtered_records = [r for r in filtered_records if r["date"] >= date_from]
    
    if date_to:
        filtered_records = [r for r in filtered_records if r["date"] <= date_to]
    
    # Sort by date descending
    filtered_records.sort(key=lambda x: x["date"], reverse=True)
    
    # Apply pagination
    paginated_records = filtered_records[skip:skip + limit]
    
    return paginated_records

@router.get("/{usage_id}", response_model=WaterUsageResponse)
async def get_water_usage_by_id(usage_id: int):
    """
    Get a specific water usage record by ID
    """
    record = next((r for r in water_usage_db if r["id"] == usage_id), None)
    
    if not record:
        raise HTTPException(status_code=404, detail="Water usage record not found")
    
    return record

@router.post("/add", response_model=WaterUsageResponse, status_code=201)
async def create_water_usage(usage: WaterUsageCreate):
    """
    Create a new water usage record
    """
    global next_id
    
    # Calculate derived fields
    duration = calculate_duration(usage.start_time, usage.end_time)
    cost = calculate_cost(usage.water_used)
    status = determine_status(usage.water_used, usage.crop_type)
    
    new_record = {
        "id": next_id,
        **usage.dict(),
        "status": status,
        "cost": cost,
        "duration": duration,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    water_usage_db.append(new_record)
    next_id += 1
    
    return new_record

@router.put("/update/{usage_id}", response_model=WaterUsageResponse)
async def update_water_usage(usage_id: int, usage: WaterUsageUpdate):
    """
    Update an existing water usage record
    """
    record = next((r for r in water_usage_db if r["id"] == usage_id), None)
    
    if not record:
        raise HTTPException(status_code=404, detail="Water usage record not found")
    
    # Update only provided fields
    update_data = usage.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        record[field] = value
    
    # Recalculate derived fields if relevant fields were updated
    if "start_time" in update_data or "end_time" in update_data:
        record["duration"] = calculate_duration(record["start_time"], record["end_time"])
    
    if "water_used" in update_data:
        record["cost"] = calculate_cost(record["water_used"])
        record["status"] = determine_status(record["water_used"], record["crop_type"])
    
    record["updated_at"] = datetime.now()
    
    return record

@router.delete("/delete/{usage_id}")
async def delete_water_usage(usage_id: int):
    """
    Delete a water usage record
    """
    global water_usage_db
    
    record = next((r for r in water_usage_db if r["id"] == usage_id), None)
    
    if not record:
        raise HTTPException(status_code=404, detail="Water usage record not found")
    
    water_usage_db = [r for r in water_usage_db if r["id"] != usage_id]
    
    return {"message": "Water usage record deleted successfully", "id": usage_id}

@router.get("/stats/dashboard", response_model=DashboardStats)
async def get_dashboard_stats():
    """
    Get dashboard statistics including today's usage, trends, and efficiency
    """
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    # Today's stats
    today_records = [r for r in water_usage_db if r["date"] == today]
    total_water_today = sum(r["water_used"] for r in today_records)
    total_cost = sum(r["cost"] for r in today_records)
    
    # Yesterday's stats for trends
    yesterday_records = [r for r in water_usage_db if r["date"] == yesterday]
    total_water_yesterday = sum(r["water_used"] for r in yesterday_records)
    total_cost_yesterday = sum(r["cost"] for r in yesterday_records)
    
    # Calculate trends (percentage change)
    water_trend = ((total_water_today - total_water_yesterday) / total_water_yesterday * 100) if total_water_yesterday > 0 else 0
    cost_trend = ((total_cost - total_cost_yesterday) / total_cost_yesterday * 100) if total_cost_yesterday > 0 else 0
    
    # Calculate efficiency (optimal usage percentage)
    optimal_count = len([r for r in today_records if r["status"] == "optimal"])
    efficiency = (optimal_count / len(today_records) * 100) if today_records else 0
    
    yesterday_optimal = len([r for r in yesterday_records if r["status"] == "optimal"])
    yesterday_efficiency = (yesterday_optimal / len(yesterday_records) * 100) if yesterday_records else 0
    efficiency_trend = efficiency - yesterday_efficiency
    
    # Average usage per field
    total_fields = len(set(r["field_name"] for r in today_records)) or 1
    avg_usage = total_water_today / total_fields
    
    return {
        "total_water_today": round(total_water_today, 2),
        "target_water": 30000.0,  # Should come from configuration
        "avg_usage": round(avg_usage, 2),
        "total_cost": round(total_cost, 2),
        "efficiency": round(efficiency, 1),
        "water_trend": round(water_trend, 1),
        "usage_trend": round(water_trend, 1),
        "cost_trend": round(cost_trend, 1),
        "efficiency_trend": round(efficiency_trend, 1)
    }

@router.get("/stats/sources", response_model=List[SourceLevel])
async def get_source_levels():
    """
    Get current water source levels
    """
    # Mock data - should come from actual sensors/database
    sources = [
        {
            "name": "Main Tank",
            "level_percentage": 75,
            "current_volume": 6000.0,
            "total_capacity": 8000.0,
            "status": "good"
        },
        {
            "name": "Borewell",
            "level_percentage": 45,
            "current_volume": 2250.0,
            "total_capacity": 5000.0,
            "status": "warning"
        },
        {
            "name": "Rainwater Harvesting",
            "level_percentage": 90,
            "current_volume": 5400.0,
            "total_capacity": 6000.0,
            "status": "excellent"
        },
        {
            "name": "Canal Supply",
            "level_percentage": 60,
            "current_volume": 4800.0,
            "total_capacity": 8000.0,
            "status": "good"
        }
    ]
    
    return sources

@router.get("/stats/trend", response_model=UsageTrend)
async def get_usage_trend(days: int = Query(7, ge=1, le=90, description="Number of days")):
    """
    Get water usage trend for specified number of days
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)
    
    dates = []
    values = []
    
    current_date = start_date
    while current_date <= end_date:
        date_records = [r for r in water_usage_db if r["date"] == current_date]
        total = sum(r["water_used"] for r in date_records)
        
        dates.append(current_date.strftime("%Y-%m-%d"))
        values.append(round(total, 2))
        
        current_date += timedelta(days=1)
    
    return {
        "dates": dates,
        "values": values
    }

@router.get("/stats/distribution", response_model=UsageDistribution)
async def get_usage_distribution():
    """
    Get water usage distribution by crop type
    """
    # Group by crop type
    distribution = {}
    
    for record in water_usage_db:
        crop = record["crop_type"]
        distribution[crop] = distribution.get(crop, 0) + record["water_used"]
    
    return {
        "labels": list(distribution.keys()),
        "values": [round(v, 2) for v in distribution.values()]
    }

@router.post("/bulk-delete")
async def bulk_delete_usage(ids: List[int]):
    """
    Delete multiple water usage records
    """
    global water_usage_db
    
    deleted_count = 0
    for usage_id in ids:
        initial_length = len(water_usage_db)
        water_usage_db = [r for r in water_usage_db if r["id"] != usage_id]
        if len(water_usage_db) < initial_length:
            deleted_count += 1
    
    return {
        "message": f"Deleted {deleted_count} water usage records",
        "deleted_count": deleted_count
    }

@router.get("/export/csv")
async def export_usage_csv():
    """
    Export water usage data as CSV
    """
    # Mock response - implement actual CSV generation
    return {
        "message": "CSV export endpoint",
        "data": "Implement CSV generation here"
    }
