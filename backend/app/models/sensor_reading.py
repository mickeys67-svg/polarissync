from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, ForeignKey("missions.mission_id"))
    timestamp = Column(Float)  # 상대 시간 (ms)
    alpha = Column(Float)
    beta = Column(Float)
    gamma = Column(Float)
    
    # 관계
    mission = relationship("Mission", back_populates="sensor_readings")
Sync
