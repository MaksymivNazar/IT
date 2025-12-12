import { API_BASE_URL } from './config';
import { getErrorMessageFromResponse } from './httpUtils';

const TOKEN_KEY = 'jwt_token';
const CURRENT_USER_KEY = 'current_user';

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const saveCurrentUser = (user) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = () => {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const logoutApi = () => {
    removeToken();
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const loginApi = async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const msg = await getErrorMessageFromResponse(response);
        throw new Error(msg || 'Не вдалося увійти');
    }

    const data = await response.json();
    const token = data.accessToken;
    const user = data.user;

    if (!token || !user) {
        throw new Error('Некоректна відповідь від сервера при вході.');
    }

    saveToken(token);
    saveCurrentUser(user);

    return { user, token };
};

export const registerApi = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Будь ласка, заповніть Email та пароль.');
    }

    const response = await fetch(`${API_BASE_URL}/auth/register/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const msg = await getErrorMessageFromResponse(response);
        throw new Error(msg || 'Не вдалося зареєструватися');
    }

    const userFromRegister = await response.json();
    return userFromRegister;
};
