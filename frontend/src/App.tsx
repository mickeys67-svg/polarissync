import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PermissionPage from './pages/mission/PermissionPage';
import SensorCheckPage from './pages/mission/SensorCheckPage';
import OrbitDancePage from './pages/mission/OrbitDancePage';
import SuccessPage from './pages/mission/SuccessPage';
import CelestialBackground from './components/CelestialBackground';

const MissionFlow: React.FC = () => {
  return (
    <Routes>
      {/* 권한 요청 (Start Point) */}
      <Route path="/" element={<PermissionPage />} />

      {/* 센서 체크 */}
      <Route path="/sensor-check" element={<SensorCheckPage />} />

      {/* 미션 (Orbit Dance) */}
      <Route path="/mission" element={<OrbitDancePage />} />

      {/* 결과 */}
      <Route path="/result" element={<SuccessPage />} />

      {/* 잘못된 경로는 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-black overflow-hidden font-inter">
        <CelestialBackground />
        <MissionFlow />
      </div>
    </Router>
  );
}

export default App;
