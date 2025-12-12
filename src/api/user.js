// src/api/user.js
import { API_BASE_URL } from './config';
import { getToken } from './auth';

export const updateProfileApi = async (formData) => {
    const token = getToken();
    if (!token) {
        throw new Error('Користувач не авторизований.');
    }

    const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Не вдалося оновити профіль');
    }

    return res.json();
};
