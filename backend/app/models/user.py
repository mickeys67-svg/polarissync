from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    telescope_model = Column(String, nullable=True)
    
    # 설정
    preferred_latitude = Column(Float, nullable=True)
    preferred_longitude = Column(Float, nullable=True)
    auto_alignment = Column(Boolean, default=False)
    
    # 메타정보
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # 관계
    missions = relationship("Mission", back_populates="user")
