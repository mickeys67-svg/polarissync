import React from 'react';
import { useNavigate } from 'react-router-dom';
import PermissionGateway from '../../components/PermissionGateway';
import { translations } from '../../translations';

const PermissionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <PermissionGateway
            onComplete={() => navigate('/sensor-check')}
            t={translations.ko.permissions}
        />
    );
};

export default PermissionPage;
