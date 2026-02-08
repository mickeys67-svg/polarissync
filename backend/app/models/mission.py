from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Mission(Base):
    __tablename__ = "missions"
    
    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(String)
    status = Column(String)  # started, completed, failed
    
    # 초기 센서값
    initial_alpha = Column(Float)
    initial_beta = Column(Float)
    initial_gamma = Column(Float)
    
    # 최종 센서값
    final_alpha = Column(Float, nullable=True)
    final_beta = Column(Float, nullable=True)
    final_gamma = Column(Float, nullable=True)
    
    # GPS 정보
    gps_latitude = Column(Float)
    gps_longitude = Column(Float)
    gps_accuracy = Column(Float, nullable=True)
    
    # 계산 결과
    ra_offset = Column(Float, nullable=True)
    confidence = Column(Integer, nullable=True)
    quality_score = Column(Integer, nullable=True)
    
    # 메타정보
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    
    # 관계
    user = relationship("User", back_populates="missions")
    sensor_readings = relationship("SensorReading", back_populates="mission")
