from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for dashboard cards
class DashboardCardBase(BaseModel):
    cardId: str
    title: str
    value: str
    cardType: str  # water-usage, active-fields, moisture-avg, etc.
    progress: Optional[int] = None
    trend: Optional[str] = None
    icon: Optional[str] = None
    gradient: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class DashboardCardCreate(DashboardCardBase):
    pass

class DashboardCardUpdate(BaseModel):
    title: Optional[str] = None
    value: Optional[str] = None
    progress: Optional[int] = None
    trend: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class DashboardCard(DashboardCardBase):
    id: int
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        orm_mode = True

# In-memory storage
dashboard_cards_db = {}
card_id_counter = 1

# Initialize default cards
def initialize_default_cards():
    global card_id_counter
    default_cards = [
        {
            "cardId": "water-usage",
            "title": "Total Water Used Today",
            "value": "12,450 L",
            "cardType": "water-usage",
            "progress": 68,
            "trend": "12% from yesterday",
            "icon": "fa-tint",
            "gradient": "linear-gradient(135deg, #2196F3, #1976D2)"
        },
        {
            "cardId": "active-fields",
            "title": "Active Fields",
            "value": "12/15",
            "cardType": "active-fields",
            "progress": 80,
            "trend": "3 fields harvested",
            "icon": "fa-leaf",
            "gradient": "linear-gradient(135deg, #4CAF50, #388E3C)"
        },
        {
            "cardId": "moisture-avg",
            "title": "Moisture Average",
            "value": "58%",
            "cardType": "moisture-avg",
            "progress": 58,
            "trend": "Within normal range",
            "icon": "fa-droplet",
            "gradient": "linear-gradient(135deg, #FF9800, #F57C00)"
        },
        {
            "cardId": "pending-irrigation",
            "title": "Pending Irrigations",
            "value": "5",
            "cardType": "pending-irrigation",
            "progress": 38,
            "trend": "2 urgent",
            "icon": "fa-clock",
            "gradient": "linear-gradient(135deg, #9C27B0, #7B1FA2)"
        },
        {
            "cardId": "weather-update",
            "title": "Weather Update",
            "value": "Partly Cloudy",
            "cardType": "weather-update",
            "icon": "fa-cloud-sun",
            "gradient": "linear-gradient(135deg, #FFC107, #FFA000)",
            "metadata": {
                "temperature": "25°C",
                "humidity": "65%",
                "wind": "12 km/h",
                "visibility": "10 km"
            }
        },
        {
            "cardId": "power-consumption",
            "title": "Power Consumption",
            "value": "23.5 kWh",
            "cardType": "power-consumption",
            "progress": 47,
            "trend": "5% less than yesterday",
            "icon": "fa-bolt",
            "gradient": "linear-gradient(135deg, #F44336, #D32F2F)"
        }
    ]
    
    for card_data in default_cards:
        card = DashboardCard(
            id=card_id_counter,
            **card_data,
            createdAt=datetime.now(),
            updatedAt=datetime.now()
        )
        dashboard_cards_db[card_id_counter] = card
        card_id_counter += 1

# Initialize on module load
initialize_default_cards()

@router.get("/dashboard/cards", response_model=List[DashboardCard])
async def get_all_cards():
    """
    Get all dashboard cards
    """
    return list(dashboard_cards_db.values())

@router.get("/dashboard/cards/{card_id}", response_model=DashboardCard)
async def get_card(card_id: int):
    """
    Get a specific dashboard card by ID
    """
    if card_id not in dashboard_cards_db:
        raise HTTPException(status_code=404, detail="Card not found")
    
    return dashboard_cards_db[card_id]

@router.get("/dashboard/cards/by-type/{card_type}", response_model=DashboardCard)
async def get_card_by_type(card_type: str):
    """
    Get a dashboard card by type
    """
    for card in dashboard_cards_db.values():
        if card.cardType == card_type:
            return card
    
    raise HTTPException(status_code=404, detail="Card not found")

@router.post("/dashboard/cards", response_model=DashboardCard)
async def create_card(card: DashboardCardCreate):
    """
    Create a new dashboard card
    """
    global card_id_counter
    
    new_card = DashboardCard(
        id=card_id_counter,
        **card.dict(),
        createdAt=datetime.now(),
        updatedAt=datetime.now()
    )
    
    dashboard_cards_db[card_id_counter] = new_card
    card_id_counter += 1
    
    return new_card

@router.put("/dashboard/cards/{card_id}", response_model=DashboardCard)
async def update_card(card_id: int, card_update: DashboardCardUpdate):
    """
    Update an existing dashboard card
    """
    if card_id not in dashboard_cards_db:
        raise HTTPException(status_code=404, detail="Card not found")
    
    existing_card = dashboard_cards_db[card_id]
    update_data = card_update.dict(exclude_unset=True)
    
    # Update only provided fields
    for field, value in update_data.items():
        setattr(existing_card, field, value)
    
    existing_card.updatedAt = datetime.now()
    
    return existing_card

@router.delete("/dashboard/cards/{card_id}")
async def delete_card(card_id: int):
    """
    Delete a dashboard card
    """
    if card_id not in dashboard_cards_db:
        raise HTTPException(status_code=404, detail="Card not found")
    
    deleted_card = dashboard_cards_db.pop(card_id)
    
    return {
        "message": "Card deleted successfully",
        "deleted_card": deleted_card
    }

@router.get("/dashboard/stats")
async def get_dashboard_stats():
    """
    Get aggregated dashboard statistics
    """
    # This would typically query your database for real-time stats
    return {
        "water_used_today": 12450,
        "active_fields": 12,
        "total_fields": 15,
        "moisture_average": 58,
        "pending_irrigations": 5,
        "weather": {
            "condition": "Partly Cloudy",
            "temperature": 25,
            "humidity": 65,
            "wind_speed": 12,
            "visibility": 10
        },
        "power_consumption": 23.5,
        "power_budget": 50.0
    }

@router.post("/dashboard/refresh")
async def refresh_dashboard():
    """
    Refresh all dashboard card data
    """
    # This would typically fetch fresh data from various sources
    # For now, we'll simulate with random variations
    import random
    
    for card in dashboard_cards_db.values():
        if card.progress:
            # Add small random variation
            variation = random.randint(-5, 5)
            card.progress = max(0, min(100, card.progress + variation))
        card.updatedAt = datetime.now()
    
    return {
        "message": "Dashboard refreshed successfully",
        "updated_at": datetime.now()
    }
