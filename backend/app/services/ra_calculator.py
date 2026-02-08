import math

class RACalculator:
    """RA축(적경축) 오프셋 계산"""
    
    @staticmethod
    def calculate(
        initial_alpha: float,
        final_alpha: float,
        latitude: float,
        final_beta: float = 0.0
    ) -> float:
        """
        RA축 오프셋 계산
        
        공식:
        RA_offset = ΔAlpha × sin(latitude) + ΔBeta × cos(latitude)
        
        Args:
            initial_alpha: 초기 방위각 (도)
            final_alpha: 최종 방위각 (도)
            latitude: 관측지 위도 (도)
            final_beta: 최종 피치 (도)
        
        Returns:
            RA축 오프셋 (도)
        """
        # 방위각 변화 계산
        delta_alpha = final_alpha - initial_alpha
        
        # 360도 경계 처리
        if delta_alpha > 180:
            delta_alpha -= 360
        elif delta_alpha < -180:
            delta_alpha += 360
        
        # 위도를 라디안으로 변환
        lat_rad = math.radians(latitude)
        
        # RA축 오프셋 계산
        ra_offset = (
            delta_alpha * math.sin(lat_rad) +
            final_beta * math.cos(lat_rad)
        )
        
        return round(ra_offset, 2)
    
    @staticmethod
    def calculate_ra_offset_minutes(ra_offset_degrees: float) -> float:
        """
        RA축 오프셋을 분(minutes) 단위로 변환
        1도 = 4분
        """
        return ra_offset_degrees * 4
    
    @staticmethod
    def calculate_error_bounds(
        sensor_stability: float,
        gps_accuracy: float
    ) -> tuple:
        """
        오차 범위 계산
        
        Args:
            sensor_stability: 센서 안정도 (표준편차, 도)
            gps_accuracy: GPS 정확도 (미터)
        
        Returns:
            (lower_bound, upper_bound) 튜플
        """
        # 간단한 오차 계산
        sensor_error = sensor_stability * 0.5
        gps_error = gps_accuracy * 0.0001  # 대략적인 변환
        
        total_error = math.sqrt(sensor_error**2 + gps_error**2)
        
        return (-total_error, total_error)
