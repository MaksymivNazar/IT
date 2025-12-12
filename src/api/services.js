// src/api/services.js
import { API_BASE_URL } from './config';
import { getErrorMessageFromResponse } from './httpUtils';

export const getServicesApi = async () => {
    const res = await fetch(`${API_BASE_URL}/services`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
        const msg = await getErrorMessageFromResponse(res);
        throw new Error(msg || 'Не вдалося завантажити послуги');
    }

    return res.json();
};

export const fetchServicesByMaster = async (masterId) => {
    const data = await getServicesApi();

    return data.filter((service) => {
        if (!service) return false;

        const byMasterId =
            service.masterId &&
            String(service.masterId) === String(masterId);

        const byMasterRelation =
            service.master &&
            service.master.id &&
            String(service.master.id) === String(masterId);

        return byMasterId || byMasterRelation;
    });
};
