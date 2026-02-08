-- Mission Records: Main alignment sessions
CREATE TABLE IF NOT EXISTS missions (
    id SERIAL PRIMARY KEY,
    mission_id VARCHAR(36) UNIQUE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    device_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'started', -- started, completed, failed
    
    -- Initial orientation (Kalman filtered)
    initial_alpha FLOAT,
    initial_beta FLOAT,
    initial_gamma FLOAT,
    
    -- Final orientation (Kalman filtered)
    final_alpha FLOAT,
    final_beta FLOAT,
    final_gamma FLOAT,
    
    -- GPS Context
    gps_latitude FLOAT,
    gps_longitude FLOAT,
    gps_accuracy FLOAT,
    
    -- Results
    ra_offset_degrees FLOAT,
    ra_offset_minutes FLOAT,
    confidence INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER
);

-- Sensor Telemetry: High-frequency time-series data
CREATE TABLE IF NOT EXISTS sensor_readings (
    id SERIAL PRIMARY KEY,
    mission_id VARCHAR(36) NOT NULL REFERENCES missions(mission_id) ON DELETE CASCADE,
    timestamp_ms BIGINT NOT NULL, -- Relative time from mission start
    alpha FLOAT,
    beta FLOAT,
    gamma FLOAT,
    
    CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(mission_id)
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_created_at ON missions(created_at);
CREATE INDEX IF NOT EXISTS idx_readings_mission_id ON sensor_readings(mission_id);
