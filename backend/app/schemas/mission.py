from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GPSLocation(BaseModel):
    latitude: float
    longitude: float
    accuracy: float

class MissionCreate(BaseModel):
    user_id: int
    device_id: str
    initial_alpha: float
    initial_beta: float
    initial_gamma: float
    gps_location: GPSLocation

class MissionResponse(BaseModel):
    mission_id: str
    status: str
    timestamp: str

class SensorReadingSchema(BaseModel):
    timestamp: float
    alpha: float
    beta: float
    gamma: float

class SensorDataBatch(BaseModel):
    readings: List[SensorReadingSchema]

class MissionComplete(BaseModel):
    final_alpha: float
    final_beta: float
    final_gamma: float
    confidence: int
    duration: int
