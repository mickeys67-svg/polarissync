import React from 'react';
import { useNavigate } from 'react-router-dom';

import { OrbitDance } from '../../components/mission/OrbitDance';
import FullScreenLayout from '../../components/layout/FullScreenLayout';

export const OrbitDancePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <FullScreenLayout>
            <OrbitDance onComplete={() => navigate('/result')} />
        </FullScreenLayout>
    );
};

export default OrbitDancePage;
