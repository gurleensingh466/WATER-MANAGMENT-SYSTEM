"""
Pump Statistics API Routes
Handles all pump management operations including CRUD, live status, control, and analytics
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, date, timedelta
from enum import Enum

router = APIRouter(prefix="/api/pumps", tags=["pumps"])

# Enums
class PumpStatus(str, Enum):
    RUNNING = "running"
    IDLE = "idle"
    MAINTENANCE = "maintenance"
    ERROR = "error"

class ControlAction(str, Enum):
    START = "start"
    STOP = "stop"
    MAINTENANCE = "maintenance"

# Pydantic Models
class PumpBase(BaseModel):
    name: str = Field(..., description="Pump name/ID")
    location: str = Field(..., description="Physical location of pump")
    power_rating: float = Field(..., gt=0, description="Power rating in HP")
    max_flow_rate: float = Field(..., gt=0, description="Maximum flow rate in L/min")
    manufacturer: Optional[str] = Field(None, description="Manufacturer name")
    model_number: Optional[str] = Field(None, description="Model number")
    installation_date: date = Field(..., description="Installation date")
    maintenance_interval: int = Field(90, ge=1, description="Maintenance interval in days")
    notes: Optional[str] = Field(None, description="Additional notes")

class PumpCreate(PumpBase):
    pass

class PumpUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    power_rating: Optional[float] = Field(None, gt=0)
    max_flow_rate: Optional[float] = Field(None, gt=0)
    manufacturer: Optional[str] = None
    model_number: Optional[str] = None
    installation_date: Optional[date] = None
    maintenance_interval: Optional[int] = Field(None, ge=1)
    notes: Optional[str] = None

class PumpResponse(PumpBase):
    id: int
    status: PumpStatus
    flow_rate: float
    voltage: float
    current: float
    power_consumption: float
    runtime_today: float
    temperature: float
    efficiency: float
    last_maintenance: date
    next_maintenance: date
    energy_today: float
    total_runtime: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PumpControl(BaseModel):
    action: ControlAction
    pump_id: int

class SystemStats(BaseModel):
    total_pumps: int
    active_pumps: int
    idle_pumps: int
    maintenance_pumps: int
    error_pumps: int
    total_power_consumption: float
    total_flow_rate: float
    avg_runtime: float
    total_energy_today: float
    avg_efficiency: float

class PowerTrend(BaseModel):
    timestamps: List[str]
    values: List[float]

class RuntimeDistribution(BaseModel):
    labels: List[str]
    values: List[float]

class Alert(BaseModel):
    type: str  # error, warning, info
    pump_id: int
    pump_name: str
    title: str
    message: str
    timestamp: datetime

# In-memory storage (replace with database in production)
pumps_db: List[dict] = [
    {
        "id": 1,
        "name": "Pump-A01",
        "location": "North Field - Borewell",
        "status": "running",
        "power_rating": 5.0,
        "max_flow_rate": 180,
        "flow_rate": 150,
        "voltage": 415,
        "current": 8.5,
        "power_consumption": 5.2,
        "runtime_today": 6.5,
        "temperature": 45,
        "efficiency": 92,
        "last_maintenance": date.today() - timedelta(days=20),
        "next_maintenance": date.today() + timedelta(days=70),
        "manufacturer": "CRI Pumps",
        "model_number": "CR-500X",
        "installation_date": date(2023, 1, 15),
        "maintenance_interval": 90,
        "energy_today": 33.8,
        "total_runtime": 2340,
        "notes": "Primary borewell pump",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 2,
        "name": "Pump-B02",
        "location": "South Field - Main Tank",
        "status": "running",
        "power_rating": 7.5,
        "max_flow_rate": 250,
        "flow_rate": 200,
        "voltage": 415,
        "current": 12.2,
        "power_consumption": 7.8,
        "runtime_today": 5.2,
        "temperature": 48,
        "efficiency": 88,
        "last_maintenance": date.today() - timedelta(days=45),
        "next_maintenance": date.today() + timedelta(days=45),
        "manufacturer": "Kirloskar",
        "model_number": "KL-750",
        "installation_date": date(2023, 3, 10),
        "maintenance_interval": 90,
        "energy_today": 40.6,
        "total_runtime": 1980,
        "notes": "Main irrigation pump",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 3,
        "name": "Pump-C03",
        "location": "East Field - Canal",
        "status": "idle",
        "power_rating": 3.0,
        "max_flow_rate": 120,
        "flow_rate": 0,
        "voltage": 0,
        "current": 0,
        "power_consumption": 0,
        "runtime_today": 2.8,
        "temperature": 28,
        "efficiency": 90,
        "last_maintenance": date.today() - timedelta(days=34),
        "next_maintenance": date.today() + timedelta(days=56),
        "manufacturer": "Havells",
        "model_number": "HV-300",
        "installation_date": date(2023, 5, 22),
        "maintenance_interval": 90,
        "energy_today": 8.4,
        "total_runtime": 1560,
        "notes": "Canal water pump",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 4,
        "name": "Pump-D04",
        "location": "West Field - Rainwater",
        "status": "maintenance",
        "power_rating": 4.0,
        "max_flow_rate": 150,
        "flow_rate": 0,
        "voltage": 0,
        "current": 0,
        "power_consumption": 0,
        "runtime_today": 0,
        "temperature": 25,
        "efficiency": 0,
        "last_maintenance": date.today() - timedelta(days=4),
        "next_maintenance": date.today() + timedelta(days=10),
        "manufacturer": "Crompton",
        "model_number": "CP-400",
        "installation_date": date(2023, 7, 8),
        "maintenance_interval": 90,
        "energy_today": 0,
        "total_runtime": 1245,
        "notes": "Under maintenance",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 5,
        "name": "Pump-E05",
        "location": "Central Field - Borewell",
        "status": "running",
        "power_rating": 6.0,
        "max_flow_rate": 200,
        "flow_rate": 175,
        "voltage": 415,
        "current": 10.5,
        "power_consumption": 6.4,
        "runtime_today": 7.2,
        "temperature": 52,
        "efficiency": 85,
        "last_maintenance": date.today() - timedelta(days=80),
        "next_maintenance": date.today() + timedelta(days=10),
        "manufacturer": "CRI Pumps",
        "model_number": "CR-600X",
        "installation_date": date(2022, 11, 20),
        "maintenance_interval": 90,
        "energy_today": 46.1,
        "total_runtime": 3120,
        "notes": "High usage pump",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    },
    {
        "id": 6,
        "name": "Pump-F06",
        "location": "North Field - Secondary",
        "status": "error",
        "power_rating": 5.5,
        "max_flow_rate": 170,
        "flow_rate": 0,
        "voltage": 380,
        "current": 15.2,
        "power_consumption": 0,
        "runtime_today": 1.5,
        "temperature": 68,
        "efficiency": 0,
        "last_maintenance": date.today() - timedelta(days=55),
        "next_maintenance": date.today() + timedelta(days=35),
        "manufacturer": "Kirloskar",
        "model_number": "KL-550",
        "installation_date": date(2023, 2, 14),
        "maintenance_interval": 90,
        "energy_today": 8.3,
        "total_runtime": 1890,
        "notes": "Voltage fluctuation detected",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
]

next_id = 7

# Helper Functions
def calculate_next_maintenance(last_maintenance: date, interval_days: int) -> date:
    """Calculate next maintenance date"""
    return last_maintenance + timedelta(days=interval_days)

def validate_pump_status_change(current_status: PumpStatus, action: ControlAction) -> bool:
    """Validate if status change is allowed"""
    if action == ControlAction.START:
        return current_status == PumpStatus.IDLE
    elif action == ControlAction.STOP:
        return current_status == PumpStatus.RUNNING
    elif action == ControlAction.MAINTENANCE:
        return current_status in [PumpStatus.IDLE, PumpStatus.RUNNING, PumpStatus.ERROR]
    return False

# API Endpoints

@router.get("/status", response_model=List[PumpResponse])
async def get_all_pumps(
    status: Optional[PumpStatus] = Query(None, description="Filter by status"),
    location: Optional[str] = Query(None, description="Filter by location"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records"),
    skip: int = Query(0, ge=0, description="Number of records to skip")
):
    """
    Get all pumps with optional filters
    """
    filtered_pumps = pumps_db.copy()
    
    # Apply filters
    if status:
        filtered_pumps = [p for p in filtered_pumps if p["status"] == status]
    
    if location:
        filtered_pumps = [p for p in filtered_pumps if location.lower() in p["location"].lower()]
    
    # Apply pagination
    paginated_pumps = filtered_pumps[skip:skip + limit]
    
    return paginated_pumps

@router.get("/live", response_model=List[PumpResponse])
async def get_live_pump_data():
    """
    Get live data for all pumps (for real-time monitoring)
    """
    return pumps_db

@router.get("/{pump_id}", response_model=PumpResponse)
async def get_pump_by_id(pump_id: int):
    """
    Get a specific pump by ID
    """
    pump = next((p for p in pumps_db if p["id"] == pump_id), None)
    
    if not pump:
        raise HTTPException(status_code=404, detail="Pump not found")
    
    return pump

@router.post("/add", response_model=PumpResponse, status_code=201)
async def create_pump(pump: PumpCreate):
    """
    Add a new pump to the system
    """
    global next_id
    
    # Calculate maintenance dates
    next_maintenance = calculate_next_maintenance(pump.installation_date, pump.maintenance_interval)
    
    new_pump = {
        "id": next_id,
        **pump.dict(),
        "status": PumpStatus.IDLE,
        "flow_rate": 0,
        "voltage": 0,
        "current": 0,
        "power_consumption": 0,
        "runtime_today": 0,
        "temperature": 25,
        "efficiency": 0,
        "last_maintenance": pump.installation_date,
        "next_maintenance": next_maintenance,
        "energy_today": 0,
        "total_runtime": 0,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    pumps_db.append(new_pump)
    next_id += 1
    
    return new_pump

@router.put("/update/{pump_id}", response_model=PumpResponse)
async def update_pump(pump_id: int, pump: PumpUpdate):
    """
    Update an existing pump's details
    """
    existing_pump = next((p for p in pumps_db if p["id"] == pump_id), None)
    
    if not existing_pump:
        raise HTTPException(status_code=404, detail="Pump not found")
    
    # Update only provided fields
    update_data = pump.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        existing_pump[field] = value
    
    # Recalculate next maintenance if interval changed
    if "maintenance_interval" in update_data:
        existing_pump["next_maintenance"] = calculate_next_maintenance(
            existing_pump["last_maintenance"], 
            existing_pump["maintenance_interval"]
        )
    
    existing_pump["updated_at"] = datetime.now()
    
    return existing_pump

@router.delete("/delete/{pump_id}")
async def delete_pump(pump_id: int):
    """
    Delete a pump from the system
    """
    global pumps_db
    
    pump = next((p for p in pumps_db if p["id"] == pump_id), None)
    
    if not pump:
        raise HTTPException(status_code=404, detail="Pump not found")
    
    pumps_db = [p for p in pumps_db if p["id"] != pump_id]
    
    return {"message": "Pump deleted successfully", "id": pump_id}

@router.post("/control")
async def control_pump(control: PumpControl):
    """
    Control pump operations (start, stop, maintenance)
    """
    pump = next((p for p in pumps_db if p["id"] == control.pump_id), None)
    
    if not pump:
        raise HTTPException(status_code=404, detail="Pump not found")
    
    current_status = PumpStatus(pump["status"])
    
    # Validate status change
    if not validate_pump_status_change(current_status, control.action):
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot {control.action.value} pump from {current_status.value} state"
        )
    
    # Apply control action
    if control.action == ControlAction.START:
        pump["status"] = PumpStatus.RUNNING
        pump["flow_rate"] = pump["max_flow_rate"] * 0.85  # 85% of max
        pump["voltage"] = 415
        pump["current"] = pump["power_rating"] * 1.7
        pump["power_consumption"] = pump["power_rating"] * 1.2
        pump["temperature"] = 35
        pump["efficiency"] = 88 + (pump["power_rating"] / 10)
        
    elif control.action == ControlAction.STOP:
        pump["status"] = PumpStatus.IDLE
        pump["flow_rate"] = 0
        pump["voltage"] = 0
        pump["current"] = 0
        pump["power_consumption"] = 0
        pump["temperature"] = 28
        pump["efficiency"] = 0
        
    elif control.action == ControlAction.MAINTENANCE:
        pump["status"] = PumpStatus.MAINTENANCE
        pump["flow_rate"] = 0
        pump["voltage"] = 0
        pump["current"] = 0
        pump["power_consumption"] = 0
        pump["efficiency"] = 0
        pump["last_maintenance"] = date.today()
        pump["next_maintenance"] = calculate_next_maintenance(
            date.today(), 
            pump["maintenance_interval"]
        )
    
    pump["updated_at"] = datetime.now()
    
    return {
        "message": f"Pump {control.action.value} command executed successfully",
        "pump_id": control.pump_id,
        "new_status": pump["status"]
    }

@router.get("/stats/system", response_model=SystemStats)
async def get_system_stats():
    """
    Get overall system statistics
    """
    total_pumps = len(pumps_db)
    active_pumps = len([p for p in pumps_db if p["status"] == "running"])
    idle_pumps = len([p for p in pumps_db if p["status"] == "idle"])
    maintenance_pumps = len([p for p in pumps_db if p["status"] == "maintenance"])
    error_pumps = len([p for p in pumps_db if p["status"] == "error"])
    
    total_power = sum(p["power_consumption"] for p in pumps_db if p["status"] == "running")
    total_flow = sum(p["flow_rate"] for p in pumps_db if p["status"] == "running")
    avg_runtime = sum(p["runtime_today"] for p in pumps_db) / total_pumps if total_pumps > 0 else 0
    total_energy = sum(p["energy_today"] for p in pumps_db)
    
    # Calculate average efficiency of running pumps
    running_pumps = [p for p in pumps_db if p["status"] == "running"]
    avg_efficiency = sum(p["efficiency"] for p in running_pumps) / len(running_pumps) if running_pumps else 0
    
    return {
        "total_pumps": total_pumps,
        "active_pumps": active_pumps,
        "idle_pumps": idle_pumps,
        "maintenance_pumps": maintenance_pumps,
        "error_pumps": error_pumps,
        "total_power_consumption": round(total_power, 2),
        "total_flow_rate": round(total_flow, 2),
        "avg_runtime": round(avg_runtime, 2),
        "total_energy_today": round(total_energy, 2),
        "avg_efficiency": round(avg_efficiency, 2)
    }

@router.get("/stats/power-trend", response_model=PowerTrend)
async def get_power_trend(hours: int = Query(24, ge=1, le=168, description="Number of hours")):
    """
    Get power consumption trend for specified hours
    """
    from datetime import datetime, timedelta
    
    timestamps = []
    values = []
    
    # Generate mock hourly data
    for i in range(hours):
        time = datetime.now() - timedelta(hours=hours - i - 1)
        timestamps.append(time.strftime("%Y-%m-%d %H:%M"))
        
        # Calculate total power at that time (with some variation)
        base_power = sum(p["power_consumption"] for p in pumps_db if p["status"] == "running")
        import random
        variation = random.uniform(-2, 2)
        values.append(round(max(0, base_power + variation), 2))
    
    return {
        "timestamps": timestamps,
        "values": values
    }

@router.get("/stats/runtime-distribution", response_model=RuntimeDistribution)
async def get_runtime_distribution():
    """
    Get runtime distribution across all pumps
    """
    labels = [p["name"] for p in pumps_db]
    values = [round(p["runtime_today"], 2) for p in pumps_db]
    
    return {
        "labels": labels,
        "values": values
    }

@router.get("/alerts", response_model=List[Alert])
async def get_pump_alerts():
    """
    Get current pump alerts and warnings
    """
    alerts = []
    
    for pump in pumps_db:
        # Error status
        if pump["status"] == "error":
            alerts.append({
                "type": "error",
                "pump_id": pump["id"],
                "pump_name": pump["name"],
                "title": f"{pump['name']} Error",
                "message": f"Pump has stopped unexpectedly. Check voltage and current readings.",
                "timestamp": datetime.now()
            })
        
        # High temperature
        if pump["temperature"] > 60:
            alerts.append({
                "type": "warning",
                "pump_id": pump["id"],
                "pump_name": pump["name"],
                "title": "High Temperature Alert",
                "message": f"{pump['name']} temperature is {pump['temperature']}°C. Normal operation is below 55°C.",
                "timestamp": datetime.now()
            })
        
        # Maintenance due
        days_until_maintenance = (pump["next_maintenance"] - date.today()).days
        if days_until_maintenance < 7 and pump["status"] != "maintenance":
            alerts.append({
                "type": "warning",
                "pump_id": pump["id"],
                "pump_name": pump["name"],
                "title": "Maintenance Due Soon",
                "message": f"{pump['name']} maintenance scheduled for {pump['next_maintenance'].strftime('%d %b %Y')}.",
                "timestamp": datetime.now()
            })
        
        # Low efficiency
        if pump["status"] == "running" and pump["efficiency"] < 85:
            alerts.append({
                "type": "info",
                "pump_id": pump["id"],
                "pump_name": pump["name"],
                "title": "Low Efficiency",
                "message": f"{pump['name']} operating at {pump['efficiency']}% efficiency. Consider inspection.",
                "timestamp": datetime.now()
            })
    
    return alerts

@router.post("/maintenance/complete/{pump_id}")
async def complete_maintenance(pump_id: int):
    """
    Mark maintenance as completed for a pump
    """
    pump = next((p for p in pumps_db if p["id"] == pump_id), None)
    
    if not pump:
        raise HTTPException(status_code=404, detail="Pump not found")
    
    if pump["status"] != "maintenance":
        raise HTTPException(status_code=400, detail="Pump is not in maintenance mode")
    
    pump["status"] = PumpStatus.IDLE
    pump["last_maintenance"] = date.today()
    pump["next_maintenance"] = calculate_next_maintenance(date.today(), pump["maintenance_interval"])
    pump["efficiency"] = 95  # Reset to high efficiency after maintenance
    pump["updated_at"] = datetime.now()
    
    return {
        "message": "Maintenance completed successfully",
        "pump_id": pump_id,
        "next_maintenance": pump["next_maintenance"]
    }

@router.post("/bulk-delete")
async def bulk_delete_pumps(ids: List[int]):
    """
    Delete multiple pumps
    """
    global pumps_db
    
    deleted_count = 0
    for pump_id in ids:
        initial_length = len(pumps_db)
        pumps_db = [p for p in pumps_db if p["id"] != pump_id]
        if len(pumps_db) < initial_length:
            deleted_count += 1
    
    return {
        "message": f"Deleted {deleted_count} pumps",
        "deleted_count": deleted_count
    }

@router.get("/export/report")
async def export_pump_report():
    """
    Export comprehensive pump report
    """
    report = {
        "generated_at": datetime.now().isoformat(),
        "system_stats": await get_system_stats(),
        "pumps": pumps_db,
        "alerts": await get_pump_alerts()
    }
    
    return report
