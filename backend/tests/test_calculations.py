import pytest
from app.services.ra_calculator import RACalculator

def test_ra_calculation_basic():
    # Example: 60 deg azimuth rotation at 37.77 deg latitude
    initial_alpha = 0.0
    final_alpha = 60.0
    latitude = 37.7749
    final_beta = 0.0
    
    # RA_offset = ΔAlpha × sin(latitude)
    # 60 * sin(37.77) = 60 * 0.612 = 36.75
    result = RACalculator.calculate(initial_alpha, final_alpha, latitude, final_beta)
    
    assert isinstance(result, float)
    assert 36.0 <= result <= 37.0

def test_ra_calculation_with_beta():
    initial_alpha = 0.0
    final_alpha = 60.0
    latitude = 37.7749
    final_beta = -2.3
    
    # 60 * sin(37.77) + (-2.3) * cos(37.77)
    # 36.75 + (-2.3 * 0.790) = 36.75 - 1.817 = 34.93
    result = RACalculator.calculate(initial_alpha, final_alpha, latitude, final_beta)
    
    assert result < 36.0
    assert result > 34.0

def test_ra_offset_minutes():
    degrees = 1.0
    minutes = RACalculator.calculate_ra_offset_minutes(degrees)
    assert minutes == 4.0
