import { API_BASE_URL } from './config';
import { getToken } from './auth';

const getErrorMessageFromResponse = async (response) => {
    try {
        const data = await response.json();
        if (Array.isArray(data.message)) return data.message.join(' ');
        if (typeof data.message === 'string') return data.message;
        if (data.error) return data.error;
    } catch {
    }
    return `Помилка ${response.status}`;
};

export const getMastersApi = async () => {
    const res = await fetch(`${API_BASE_URL}/masters`, {
        method: 'GET',
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Не вдалося завантажити майстрів');
    }

    return res.json();
};

export const getMasterByIdApi = async (masterId) => {
    const res = await fetch(
        `${API_BASE_URL}/masters/${encodeURIComponent(masterId)}`,
        {
            method: 'GET',
        },
    );

    if (!res.ok) {
        const msg = await getErrorMessageFromResponse(res);
        throw new Error(msg || 'Не вдалося завантажити дані майстра');
    }

    return res.json();
};

export const fetchMasterSchedule = async (masterId) => {
    const res = await fetch(
        `${API_BASE_URL}/masters/${encodeURIComponent(masterId)}/schedule`,
        {
            method: 'GET',
        },
    );

    if (!res.ok) {
        const msg = await getErrorMessageFromResponse(res);
        throw new Error(msg || 'Не вдалося завантажити графік');
    }

    return res.json();
};

export const saveMasterSchedule = async (masterId, slots) => {
    const token = getToken();
    if (!token) {
        throw new Error('Не знайдено токен авторизації.');
    }

    const res = await fetch(
        `${API_BASE_URL}/masters/${encodeURIComponent(masterId)}/schedule`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(slots),
        },
    );

    if (!res.ok) {
        const msg = await getErrorMessageFromResponse(res);
        throw new Error(msg || 'Не вдалося зберегти графік');
    }

    return res.json().catch(() => null);
};
