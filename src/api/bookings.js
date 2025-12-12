import { API_BASE_URL } from './config';
import { getToken } from './auth';

const authFetch = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const body = JSON.stringify(options.body)
    const res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        body
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Помилка запиту до сервера');
    }

    return res;
};

export const getBookingsApi = async () => {
    const res = await fetch(`${API_BASE_URL}/bookings`);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Не вдалося завантажити записи');
    }
    return res.json();
};

export const getMyBookingsApi = async () => {
    const res = await authFetch('/bookings/my', { method: 'GET' });
    return res.json();
};

export const cancelBookingApi = async (bookingId) => {
    const res = await authFetch(`/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
    });
    return res.json();
};

export const createBookingApi = async (payload) => {
    console.log(payload)
    const res = await authFetch(`/bookings`, {
        method: 'POST',
        body: payload,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Не вдалося створити запис');
    }

    return res.json();
};

export const confirmBookingApi = async (bookingId) => {
    const res = await authFetch(`/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
    });
    return res.json();
};