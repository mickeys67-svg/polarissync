from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models.mission import Mission, SensorReading
from app.schemas.mission import (
    MissionCreate,
    MissionResponse,
    SensorDataBatch,
    MissionComplete
)
from app.services.ra_calculator import RACalculator
from app.services.confidence_calc import ConfidenceCalculator

router = APIRouter()

@router.post("/start", response_model=MissionResponse)
def start_mission(
    mission_data: MissionCreate,
    db: Session = Depends(get_db)
):
    """미션 시작"""
    mission_id = str(uuid.uuid4())
    
    mission = Mission(
        mission_id=mission_id,
        user_id=mission_data.user_id,
        device_id=mission_data.device_id,
        status="started",
        initial_alpha=mission_data.initial_alpha,
        initial_beta=mission_data.initial_beta,
        initial_gamma=mission_data.initial_gamma,
        gps_latitude=mission_data.gps_location.latitude,
        gps_longitude=mission_data.gps_location.longitude,
        gps_accuracy=mission_data.gps_location.accuracy
    )
    
    db.add(mission)
    db.commit()
    db.refresh(mission)
    
    return {
        "mission_id": mission_id,
        "status": "started",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/{mission_id}/sensor-data")
def receive_sensor_data(
    mission_id: str,
    sensor_data: SensorDataBatch,
    db: Session = Depends(get_db)
):
    """센서 데이터 수신 (실시간)"""
    mission = db.query(Mission).filter(
        Mission.mission_id == mission_id
    ).first()
    
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    # 센서 데이터 저장
    for reading in sensor_data.readings:
        db_reading = SensorReading(
            mission_id=mission_id,
            timestamp=reading.timestamp,
            alpha=reading.alpha,
            beta=reading.beta,
            gamma=reading.gamma
        )
        db.add(db_reading)
    
    db.commit()
    
    # 신뢰도 계산
    all_readings = db.query(SensorReading).filter(
        SensorReading.mission_id == mission_id
    ).all()
    
    confidence = ConfidenceCalculator.calculate(all_readings)
    
    return {
        "received": len(sensor_data.readings),
        "total_readings": len(all_readings),
        "confidence": confidence,
        "feedback": _generate_feedback(confidence)
    }

@router.post("/{mission_id}/complete")
def complete_mission(
    mission_id: str,
    complete_data: MissionComplete,
    db: Session = Depends(get_db)
):
    """미션 완료 및 최종 계산"""
    mission = db.query(Mission).filter(
        Mission.mission_id == mission_id
    ).first()
    
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    # RA축 오프셋 계산
    ra_offset = RACalculator.calculate(
        initial_alpha=mission.initial_alpha,
        final_alpha=complete_data.final_alpha,
        latitude=mission.gps_latitude,
        final_beta=complete_data.final_beta
    )
    
    # 품질 점수 계산
    quality_score = _calculate_quality_score(
        confidence=complete_data.confidence,
        duration=complete_data.duration,
        ra_offset=ra_offset
    )
    
    # 미션 업데이트
    mission.final_alpha = complete_data.final_alpha
    mission.final_beta = complete_data.final_beta
    mission.final_gamma = complete_data.final_gamma
    mission.ra_offset = ra_offset
    mission.confidence = complete_data.confidence
    mission.quality_score = quality_score
    mission.status = "completed"
    mission.completed_at = datetime.utcnow()
    mission.duration_seconds = complete_data.duration
    
    db.commit()
    
    return {
        "success": True,
        "mission_id": mission_id,
        "ra_offset": ra_offset,
        "confidence": complete_data.confidence,
        "quality_score": quality_score,
        "recommendation": _get_recommendation(quality_score)
    }

@router.get("/{mission_id}/result")
def get_mission_result(mission_id: str, db: Session = Depends(get_db)):
    """미션 결과 조회"""
    mission = db.query(Mission).filter(
        Mission.mission_id == mission_id
    ).first()
    
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    return {
        "mission_id": mission_id,
        "status": mission.status,
        "ra_offset": mission.ra_offset,
        "confidence": mission.confidence,
        "quality_score": mission.quality_score,
        "created_at": mission.created_at.isoformat(),
        "completed_at": mission.completed_at.isoformat() if mission.completed_at else None,
        "duration_seconds": mission.duration_seconds
    }

def _generate_feedback(confidence: int) -> str:
    """신뢰도에 따른 피드백"""
    if confidence < 30:
        return "센서 데이터가 불안정합니다"
    elif confidence < 60:
        return "센서 데이터가 수집 중입니다"
    elif confidence < 90:
        return "정렬 진행 중입니다"
    else:
        return "정렬이 거의 완료되었습니다"

def _calculate_quality_score(confidence: int, duration: int, ra_offset: float) -> int:
    """품질 점수 계산"""
    # 간단한 품질 점수 (실제로는 더 복잡할 수 있음)
    base_score = confidence
    
    # 시간 패널티 (너무 빠르거나 느리면 감점)
    if duration < 30:
        base_score -= 10
    elif duration > 120:
        base_score -= 5
    
    # RA 오프셋이 너무 크면 감점
    if abs(ra_offset) > 10:
        base_score -= 15
    
    return max(0, min(100, base_score))

def _get_recommendation(quality_score: int) -> str:
    """품질 점수에 따른 권장사항"""
    if quality_score >= 90:
        return "매우 좋은 정렬입니다. 망원경을 사용해도 됩니다."
    elif quality_score >= 70:
        return "좋은 정렬입니다. 관찰에 문제없습니다."
    elif quality_score >= 50:
        return "보통 정렬입니다. 더 정확한 정렬을 권장합니다."
    else:
        return "정렬 품질이 낮습니다. 다시 정렬해주세요."
