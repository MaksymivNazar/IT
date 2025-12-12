import { API_BASE_URL } from './config';
import { getErrorMessageFromResponse } from './httpUtils';
import { getToken } from './auth';

const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchMasterSchedule = async (masterId) => {
    const res = await fetch(
        `${API_BASE_URL}/masters/${encodeURIComponent(masterId)}/schedule`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
        },
    );

    if (!res.ok) {
        const msg = await getErrorMessageFromResponse(res);
        throw new Error(msg || 'Не вдалося завантажити графік');
    }

    return res.json();
};

export const updateMasterSchedule = async (masterId, days) => {
    const res = await fetch(
        `${API_BASE_URL}/masters/${encodeURIComponent(masterId)}/schedule`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
            body: JSON.stringify({ days }),
        },
    );

    if (!res.ok) {
        const msg = await getErrorMessageFromResponse(res);
        throw new Error(msg || 'Не вдалося зберегти графік');
    }

    return res.json(); // оновлений графік
};
