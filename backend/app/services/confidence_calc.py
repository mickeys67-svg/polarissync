from typing import List
from app.models.mission import SensorReading

class ConfidenceCalculator:
    """센서 데이터 신뢰도 및 정렬 품질 계산"""
    
    @staticmethod
    def calculate(readings: List[SensorReading]) -> int:
        """
        수집된 센서 데이터를 바탕으로 신뢰도(0-100) 계산
        """
        if not readings:
            return 0
            
        if len(readings) < 10:
            return 20
            
        # 안정도 분석 (단순 예시)
        # 실제로는 지자기 센서와 자이로스코프의 오차 범위를 분석
        alphas = [r.alpha for r in readings[-20:]]
        if not alphas:
            return 0
            
        mean = sum(alphas) / len(alphas)
        variance = sum((x - mean) ** 2 for x in alphas) / len(alphas)
        std_dev = variance ** 0.5
        
        # 표준편차가 작을수록 높은 점수
        # 0.5도 이내를 매우 안정적으로 간주
        stability_score = max(0, 100 - (std_dev * 50))
        
        return int(min(100, stability_score))
