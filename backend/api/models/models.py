from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from api.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_professional = Column(Boolean, default=False)
    phone_number = Column(String)

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String, index=True)
    temperature = Column(Float)
    ph_level = Column(Float)
    turbidity = Column(Float)
    dissolved_oxygen = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class HazardLog(Base):
    __tablename__ = "hazard_logs"

    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String)  # "Safe", "Warning", "Critical"
    description = Column(String)
    sensor_data_id = Column(Integer, ForeignKey("sensor_data.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    sensor_data = relationship("SensorData")

class Config(Base):
    __tablename__ = "config"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String)
    description = Column(String)

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    location = Column(String)
    size = Column(Float)
    size_unit = Column(String)
    soil_type = Column(String)
    current_crop = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

    user = relationship("User", back_populates="farms")
    pump_logs = relationship("PumpLog", back_populates="farm")

class PumpLog(Base):
    __tablename__ = "pump_logs"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    duration = Column(Float)  # hours
    power_rating = Column(String)  # e.g., "2hp"
    energy_consumed = Column(Float)  # kWh
    cost = Column(Float)  # in Rs
    
    farm = relationship("Farm", back_populates="pump_logs")

class WaterUsage(Base):
    __tablename__ = "water_usage"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float)  # in cubic meters
    source = Column(String)  # e.g., "irrigation", "rainfall"
    
    farm = relationship("Farm")

class CropSchedule(Base):
    __tablename__ = "crop_schedules"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    crop_type = Column(String)
    planting_date = Column(DateTime)
    expected_harvest_date = Column(DateTime)
    water_requirement = Column(Float)  # daily requirement in cubic meters
    
    farm = relationship("Farm")