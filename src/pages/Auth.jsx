// src/pages/Auth.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД З ПОКРАЩЕНОЮ ОБРОБКОЮ ПОМИЛОК)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Допоміжні функції
const areIdsEqual = (id1, id2) => String(id1) === String(id2); 
const generateUniqueId = () => Date.now(); 

// =================================================================
// 🔥🔥🔥 ЦЕНТРАЛІЗОВАНІ ДАНІ ПОСЛУГ ТА МАЙСТРІВ 🔥🔥🔥
// =================================================================

// Дані послуг 
export const servicesData = [ 
    { 
        id: 1, 
        name: "Жіноча стрижка", 
        category: "Волосся", 
        slug: "zhinocha-strizhka", 
        price: 600, 
        // ➡️ ВСТАВТЕ ВАШЕ ПОСИЛАННЯ 1 
        image: "https://www.tufishop.com.ua/images/thumbnails/1000/1000/detailed/146/245%D0%B0%D0%B56__34_.webp", 
        description: "Професійна стрижка..." 
    },
    { 
        id: 2, 
        name: "Чоловіча стрижка", 
        category: "Волосся", 
        slug: "cholovicha-strizhka", 
        price: 400, 
        // ➡️ ВСТАВТЕ ВАШЕ ПОСИЛАННЯ 2
        image: "https://syndicatebarbershop.com.ua/wp-content/uploads/2024/10/Layered-Cut.jpg", 
        description: "Ідеальний фейд..." 
    },
    { 
        id: 3, 
        name: "Манікюр класичний", 
        category: "Нігті", 
        slug: "manikyur-klasichny", 
        price: 500, 
        // ➡️ ВСТАВТЕ ВАШЕ ПОСИЛАННЯ 3
        image: "https://beauty.vogdog.com/wp-content/uploads/sites/4/2025/01/Klasyka-1264x1264.jpg", 
        description: "Догляд за руками..." 
    },
    { 
        id: 4, 
        name: "Фарбування (AirTouch)", 
        category: "Волосся", 
        slug: "farbuvannya-airtouch", 
        price: 3500, 
        // ➡️ ВСТАВТЕ ВАШЕ ПОСИЛАННЯ 4
        image: "https://od.p-de-p.com/wp-content/uploads/2021/06/img_7432-e1622976515640.jpg", 
        description: "Складні техніки фарбування..." 
    },
    { 
        id: 5, 
        name: "Ламінування Брів", 
        category: "Брови", 
        slug: "laminuvannya-briv", 
        price: 600, 
        // ➡️ ВСТАВТЕ ВАШЕ ПОСИЛАННЯ 5
        image: "https://staleks.ua/upload/medialibrary/1d0/8il44j6lkz37cdgnneg6rbsixovqj76y.png", 
        description: "Ідеальна форма..." 
    },
];

// Дані майстрів з повною інформацією
export const mastersData = [
    { 
        id: 1, 
        userId: 102, 
        name: "Олена Петрівна", 
        role: "Топ-стиліст", 
        image: "https://kafo.kiev.ua/uploads/p_139_61321742.jpg", 
        services: [1, 2, 4], 
        about: "Спеціалізується на складних фарбуваннях (AirTouch, Balayage) та стрижках. Досвід 10 років.",
        experience: "10 років",
        phone: "+380 50 123 4567",
        email: "olena.petrivna@salon.ua",
        rating: 5.0,
        schedule: {
            Monday: { start: '10:00', end: '19:00', isWorking: true },
            Tuesday: { start: '10:00', end: '19:00', isWorking: true },
            Wednesday: { start: '10:00', end: '19:00', isWorking: true },
            Thursday: { start: '10:00', end: '19:00', isWorking: true },
            Friday: { start: '10:00', end: '19:00', isWorking: true },
            Saturday: { start: '11:00', end: '16:00', isWorking: true },
            Sunday: { start: '11:00', end: '16:00', isWorking: false },
        }
    },
    { 
        id: 2, 
        userId: 103, 
        name: "Марина Іванова", 
        role: "Nail-майстер", 
        image: "https://kafo.kiev.ua/uploads/p_140_35639904.jpg", 
        services: [3, 4], 
        about: "Творчий підхід до дизайну нігтів, працює лише з преміум-матеріалами. Швидкість та якість.",
        experience: "7 років",
        phone: "+380 50 234 5678",
        email: "marina.ivanova@salon.ua",
        rating: 4.9,
        schedule: {
            Monday: { start: '10:00', end: '19:00', isWorking: true },
            Tuesday: { start: '10:00', end: '19:00', isWorking: true },
            Wednesday: { start: '10:00', end: '19:00', isWorking: false },
            Thursday: { start: '10:00', end: '19:00', isWorking: true },
            Friday: { start: '10:00', end: '19:00', isWorking: true },
            Saturday: { start: '11:00', end: '16:00', isWorking: true },
            Sunday: { start: '11:00', end: '16:00', isWorking: false },
        }
    },
    { 
        id: 3, 
        userId: 104, 
        name: "Аліна Кравець", 
        role: "Візажист", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT4dmjRBIUpC6TnSSjgKrsaC9j-8X7J6du2g&s", 
        services: [5, 6], 
        about: "Створюю образи для червоних доріжок. Професійний макіяж для будь-яких подій.",
        experience: "5 років",
        phone: "+380 50 345 6789",
        email: "alina.kravets@salon.ua",
        rating: 4.8,
        schedule: {
            Monday: { start: '10:00', end: '19:00', isWorking: true },
            Tuesday: { start: '10:00', end: '19:00', isWorking: true },
            Wednesday: { start: '10:00', end: '19:00', isWorking: true },
            Thursday: { start: '10:00', end: '19:00', isWorking: true },
            Friday: { start: '10:00', end: '19:00', isWorking: true },
            Saturday: { start: '11:00', end: '16:00', isWorking: true },
            Sunday: { start: '11:00', end: '16:00', isWorking: false },
        }
    },
];

const initialUsers = [
    { id: 101, firstName: 'Ірина', email: 'client@test.ua', password: '123', role: 'client', image: 'https://i.ibb.co/L8K0j2b/client-irina.jpg' },
    { id: 102, firstName: 'Олена', email: 'master@test.ua', password: '123', role: 'master', masterId: 1, image: 'https://i.ibb.co/6y4V83V/default-master.png' },
    { id: 104, firstName: 'Максим', email: 'master2@test.ua', password: '123', role: 'master', masterId: 3, image: 'https://i.ibb.co/6y4V83V/default-master.png' },
    { id: 105, firstName: 'Адміністратор', email: 'admin@test.ua', password: '123', role: 'admin', image: 'https://i.ibb.co/6y4V83V/default-master.png' },
];

const initialAppointments = [
    { id: 1, userId: 101, masterId: 1, serviceId: 1, date: '2025-12-10', time: '14:00', status: 'upcoming', statusText: 'Заплановано' },
    { id: 2, userId: 101, masterId: 2, serviceId: 4, date: '2025-12-01', time: '11:00', status: 'completed', statusText: 'Виконано' },
];

let cartItems = []; // Змінна для зберігання кошика

// =================================================================
// ⚙️ СИМУЛЯЦІЯ БАЗИ ДАНИХ (LOCAL STORAGE)
// =================================================================

// 1. Користувачі (Users)
export const getUsersDB = () => JSON.parse(localStorage.getItem('users')) || initialUsers;
export const saveUsersDB = (users) => localStorage.setItem('users', JSON.stringify(users));
// Функція для очищення бази даних користувачів (залишаємо лише початкових)
export const clearUsersDB = () => {
    localStorage.setItem('users', JSON.stringify(initialUsers));
    // Також очищаємо токени та інші дані
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    console.log('✅ База даних користувачів очищена. Залишено лише початкових користувачів.');
};

// Функція для повного очищення всієї бази даних
export const clearAllDB = () => {
    try {
        localStorage.removeItem('users');
        localStorage.removeItem('appointments');
        localStorage.removeItem('cart');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        // Повністю очищаємо localStorage
        localStorage.clear();
        console.log('✅ Вся база даних очищена!');
        // Перезавантажуємо сторінку
        window.location.reload();
    } catch (error) {
        console.error('❌ Помилка при очищенні бази даних:', error);
    }
};

// 2. Записи (Appointments)
export const getAppointmentsDB = () => JSON.parse(localStorage.getItem('appointments')) || initialAppointments;
export const saveAppointmentsDB = (apps) => localStorage.setItem('appointments', JSON.stringify(apps));

// 3. Кошик (Cart)
export const getCartDB = () => cartItems; 

// =================================================================
// 🔐 JWT ТОКЕН УТИЛІТИ (ІМІТАЦІЯ БЕЗ БЕКЕНДУ)
// =================================================================

/**
 * Безпечне кодування в Base64 для Unicode символів
 */
const base64Encode = (str) => {
    try {
        // Використовуємо encodeURIComponent для Unicode, потім btoa
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        }));
    } catch (e) {
        // Fallback: використовуємо Unicode-safe метод
        return btoa(unescape(encodeURIComponent(str)));
    }
};

/**
 * Генерує простий JWT токен (імітація, без реального підпису)
 * Формат: header.payload.signature (всі частини в Base64)
 */
const generateJWT = (user) => {
    // Header (завжди однаковий для JWT)
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    // Payload (дані користувача + час випуску та термін дії)
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatar: user.avatar || user.image || '',
        iat: now, // Issued At (час випуску)
        exp: now + (7 * 24 * 60 * 60) // Expiration (термін дії - 7 днів)
    };
    
    // Кодуємо header та payload в Base64 (безпечно для Unicode)
    const encodedHeader = base64Encode(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = base64Encode(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    // Імітація підпису (в реальності тут був би HMAC-SHA256)
    // Для фронтенду без бекенду просто об'єднуємо header та payload
    const signature = base64Encode(`${encodedHeader}.${encodedPayload}`).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    // Формуємо повний JWT токен
    const token = `${encodedHeader}.${encodedPayload}.${signature}`;
    
    return token;
};

/**
 * Безпечне декодування з Base64 для Unicode символів
 */
const base64Decode = (str) => {
    try {
        return decodeURIComponent(atob(str).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (e) {
        // Fallback
        return decodeURIComponent(escape(atob(str)));
    }
};

/**
 * Декодує JWT токен та повертає payload
 */
export const decodeJWT = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        
        // Декодуємо payload (безпечно для Unicode)
        const decoded = base64Decode(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(decoded);
        
        // Перевіряємо термін дії
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            console.warn('JWT токен прострочений');
            return null;
        }
        
        return payload;
    } catch (error) {
        console.error('Помилка декодування JWT:', error);
        return null;
    }
};

/**
 * Перевіряє чи токен валідний
 */
export const validateJWT = (token) => {
    if (!token) return false;
    
    const payload = decodeJWT(token);
    if (!payload) return false;
    
    // Перевіряємо термін дії
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
        return false;
    }
    
    return true;
};

/**
 * Отримує збережений токен з localStorage
 * Використовуйте цю функцію для отримання токена для API запитів:
 * 
 * const token = getStoredToken();
 * fetch('https://api.example.com/endpoint', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * })
 */
export const getStoredToken = () => {
    return localStorage.getItem('jwt_token');
};

/**
 * Зберігає токен в localStorage
 */
export const saveToken = (token) => {
    localStorage.setItem('jwt_token', token);
};

/**
 * Видаляє токен з localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('jwt_token');
};

/**
 * Отримує користувача з токена
 */
export const getUserFromToken = () => {
    const token = getStoredToken();
    if (!token) return null;
    
    const payload = decodeJWT(token);
    if (!payload) return null;
    
    // Отримуємо повні дані користувача з бази
    const users = getUsersDB();
    const user = users.find(u => String(u.id) === String(payload.userId));
    
    // Оновлюємо дані з токена, якщо вони є
    if (user && payload) {
        return {
            ...user,
            firstName: payload.firstName || user.firstName,
            lastName: payload.lastName || user.lastName,
            phone: payload.phone || user.phone,
            avatar: payload.avatar || user.avatar || user.image,
        };
    }
    
    return user || null;
};

/**
 * Оновлює JWT токен з новими даними користувача
 */
export const updateJWTToken = (user) => {
    const token = generateJWT(user);
    saveToken(token);
    return token;
};

// =================================================================
// 🔐 АВТЕНТИФІКАЦІЯ (З JWT ТОКЕНОМ)
// =================================================================

/**
 * Функція для входу користувача.
 * @param {string} email 
 * @param {string} password 
 * @returns {object} Об'єкт з користувачем та токеном
 * @throws {Error} Якщо вхід не вдалий, викидає помилку з описом.
 */
export const login = (email, password) => {
    const users = getUsersDB();
    const user = users.find(u => u.email === email);

    if (!user) {
        // 🔥 ВИПРАВЛЕННЯ: Помилка з детальним описом
        throw new Error("Користувача з таким Email не знайдено. Спробуйте інший Email або зареєструйтесь.");
    }
    
    // В реальності тут була б хешована перевірка пароля
    if (user.password !== password) {
        // 🔥 ВИПРАВЛЕННЯ: Помилка з детальним описом
        throw new Error("Невірний пароль. Спробуйте ще раз.");
    }

    // Генеруємо JWT токен
    const token = generateJWT(user);
    
    // Зберігаємо токен
    saveToken(token);

    return { user, token };
};

/**
 * Функція для реєстрації нового користувача.
 * @param {string} firstName 
 * @param {string} email 
 * @param {string} password 
 * @returns {object} Об'єкт з новим користувачем та токеном
 * @throws {Error} Якщо реєстрація не вдала, викидає помилку з описом.
 */
export const register = (firstName, email, password) => {
    const users = getUsersDB();

    if (!firstName || !email || !password) {
          // 🔥 ВИПРАВЛЕННЯ: Перевірка на заповненість полів
        throw new Error("Будь ласка, заповніть усі обов'язкові поля.");
    }
    
    if (users.find(u => u.email === email)) {
          // 🔥 ВИПРАВЛЕННЯ: Помилка з детальним описом
        throw new Error("Користувач з таким Email вже існує. Спробуйте увійти.");
    }

    const newUser = {
        id: generateUniqueId(),
        firstName,
        email,
        password,
        role: 'client', // За замовчуванням завжди клієнт (адміністратор створюється вручну)
        // Генерація простого аватара
        image: `https://ui-avatars.com/api/?name=${firstName}+${firstName.substring(0,1)}&background=B76E79&color=fff&bold=true&size=128`, 
    };

    saveUsersDB([...users, newUser]);
    
    // Генеруємо JWT токен для нового користувача
    const token = generateJWT(newUser);
    
    // Зберігаємо токен
    saveToken(token);

    return { user: newUser, token };
};

export const logout = () => {
    // Видаляємо токен при виході
    removeToken();
    return null;
};

// =================================================================
// 🛒 УПРАВЛІННЯ КОШИКОМ
// =================================================================

// Додає послугу до кошика (в пам'яті)
export const addToCart = (service) => {
    if (!cartItems.find(item => areIdsEqual(item.id, service.id))) {
        cartItems.push(service);
        return true; 
    }
    return false;
};

// Видаляє послугу з кошика
export const removeFromCart = (serviceId) => {
    cartItems = cartItems.filter(item => !areIdsEqual(item.id, serviceId));
};

// Очищає кошик (після успішного запису)
export const clearCart = () => {
    cartItems = [];
};

// =================================================================
// 📅 УПРАВЛІННЯ ЗАПИСАМИ
// =================================================================

// Зберігає новий запис
export const saveAppointment = (appData) => {
    const appointments = getAppointmentsDB();
    const newAppointment = {
        id: generateUniqueId(),
        ...appData,
        status: 'upcoming',
        statusText: 'Заплановано',
    };
    saveAppointmentsDB([...appointments, newAppointment]);
    return newAppointment;
};

// Оновлює статус запису (для скасування)
export const updateAppointmentStatus = (id, newStatus, newStatusText) => {
    const appointments = getAppointmentsDB();
    const updatedAppointments = appointments.map(app => 
        areIdsEqual(app.id, id) ? { ...app, status: newStatus, statusText: newStatusText } : app
    );
    saveAppointmentsDB(updatedAppointments);
};


// =================================================================
// 🎨 КОМПОНЕНТ AUTH
// =================================================================

const Auth = ({ onLogin, openInfoModal }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', email: '', password: '' });
    const [error, setError] = useState(''); // Стан для помилок
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    // Плавна анімація при перемиканні між реєстрацією та входом
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [isRegistering]);

    // --- Стилі (залишено в кінці файлу для компактності) ---

    const PALETTE = {
        primary: '#d81b60',     // Малиновий акцент
        secondary: '#f0f0f0',   // Світло-сірий фон
        textDark: '#333333',
        error: '#C62828',
    };

    const pageStyle = {
        padding: '60px 20px',
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundImage: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 240, 250, 0.85) 50%, rgba(255, 230, 245, 0.9) 100%), url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        width: '100%',
    };

    const cardStyle = {
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        borderTop: `5px solid ${PALETTE.primary}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isAnimating ? 0.7 : 1,
        transform: isAnimating ? 'translateY(-10px)' : 'translateY(0)',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        outline: 'none',
    };

    const mainButtonStyle = {
        background: PALETTE.primary,
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginTop: '10px',
        transform: 'scale(1)',
    };

    const toggleButtonStyle = {
        background: 'none',
        border: 'none',
        color: PALETTE.primary,
        fontWeight: 'bold',
        cursor: 'pointer',
        marginLeft: '5px',
        textDecoration: 'underline',
    };

    const errorStyle = {
        color: PALETTE.error,
        backgroundColor: '#fee',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
    };

    // --- Логіка компонента ---

    // Обробка змін у формі
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Обробка відправки форми
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Очищаємо попередні помилки
        
        try {
            let result;
            if (isRegistering) {
                // Реєстрація
                result = register(formData.firstName, formData.email, formData.password);
                if (openInfoModal) {
                    openInfoModal({
                        title: 'Реєстрація успішна! 🎉',
                        message: `Ласкаво просимо, ${result.user.firstName}! Ви успішно зареєстровані. JWT токен збережено.`,
                        type: 'success',
                    });
                }
            } else {
                // Вхід
                result = login(formData.email, formData.password);
            }

            // Успішний вхід/реєстрація
            // Токен вже збережено в localStorage через функції login/register
            onLogin(result.user);
            
            // Перенаправлення: майстер -> дашборд, клієнт -> профіль
            navigate(result.user.role === 'master' ? '/master-dashboard' : '/profile');
            
        } catch (err) {
            // 🔥 ВИПРАВЛЕНО: Виводимо повідомлення про помилку з функції
            setError(err.message); 
            console.error('Auth Error:', err);
        }
    };

    return (
        <div style={{ 
            width: '100%', 
            minHeight: '100vh',
            backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
        }}>
            <div style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={{ color: PALETTE.primary, textAlign: 'center', marginBottom: '30px' }}>
                    {isRegistering ? 'Реєстрація' : 'Вхід'}
                </h1>
                
                {/* 🔥 ВИПРАВЛЕНО: Відображення помилки */}
                {error && <p style={errorStyle}>{error}</p>} 

                <form onSubmit={handleSubmit}>
                    {/* Поле для імені - лише для реєстрації */}
                    {isRegistering && (
                    <input 
                        type="text" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleInputChange} 
                        placeholder="Ім'я (напр. Ірина)" 
                        required 
                        style={{
                            ...inputStyle,
                            ':focus': { borderColor: PALETTE.primary, boxShadow: `0 0 0 3px rgba(216, 27, 96, 0.1)` }
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = PALETTE.primary;
                            e.target.style.boxShadow = '0 0 0 3px rgba(216, 27, 96, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    )}

                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange} 
                        placeholder="Email (напр. client@test.ua)" 
                        required 
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = PALETTE.primary;
                            e.target.style.boxShadow = '0 0 0 3px rgba(216, 27, 96, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange} 
                        placeholder="Пароль (напр. 123)" 
                        required 
                        style={inputStyle}
                        onFocus={(e) => {
                            e.target.style.borderColor = PALETTE.primary;
                            e.target.style.boxShadow = '0 0 0 3px rgba(216, 27, 96, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#ccc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <button 
                        type="submit" 
                        style={mainButtonStyle}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#b8154f';
                            e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = PALETTE.primary;
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {isRegistering ? 'ЗАРЕЄСТРУВАТИСЯ' : 'УВІЙТИ'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#666', textAlign: 'center' }}>
                    {isRegistering ? 'Вже маєте акаунт?' : 'Не маєте акаунту?'}
                    <button 
                        type="button" 
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError(''); // Очищаємо помилку при перемиканні
                            setFormData({ firstName: '', email: '', password: '' }); // Очищаємо форму
                        }}
                        style={toggleButtonStyle}
                    >
                        {isRegistering ? 'Увійти' : 'Реєстрація'}
                    </button>
                </p>
            </div>
            </div>
        </div>
    );
};

export default Auth;