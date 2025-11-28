// src/pages/Auth.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД З InfoModal та РОЗШИРЕНИМИ ДАНИМИ)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Допоміжні функції
const areIdsEqual = (id1, id2) => String(id1) === String(id2); 
const generateUniqueId = () => Date.now(); 

// =================================================================
// 🔥🔥🔥 ЦЕНТРАЛІЗОВАНІ ДАНІ ПОСЛУГ ТА МАЙСТРІВ (РОЗШИРЕНО) 🔥🔥🔥
// =================================================================

export const servicesData = [ 
    { 
        id: 1, 
        name: "Жіноча стрижка", 
        category: "Волосся", 
        slug: "zhinocha-strizhka", 
        price: 600, 
        image: "https://charivnamoda.com/wp-content/uploads/2024/11/41390f82652f925f827870d40716cecb.jpg",
        description: "Професійна стрижка з індивідуальним підбором форми. Новітні техніки для образу, що ідеально пасує до вашого типу обличчя та структури волосся.", 
        priceList: [ 
            { name: "Коротка довжина", time: "60 хв", price: 600 },
            { name: "Середня довжина", time: "75 хв", price: 750 },
            { name: "Довге волосся", time: "90 хв", price: 900 }
        ],
        masters: [1, 4] // Олена, Анастасія
    },
    { 
        id: 2, 
        name: "Корекція та фарбування брів", 
        category: "Брови/Вії", 
        slug: "korektsiya-farbuvannya-briv", 
        price: 400, 
        image: "https://img.tsn.ua/cached/348/tsn-e4d2bbace79d9196864837254e47d00a/thumbs/1200x630/9a/d5/657cbf92001de86d39e8cb7d6fb2d59a.jpeg",
        description: "Індивідуальний підбір форми та кольору, використовуючи професійні фарби. Створюємо ідеальний вигин, що підкреслює природну красу.",
        priceList: [
            { name: "Хна/Фарба", time: "45 хв", price: 400 },
            { name: "Ламінування", time: "60 хв", price: 600 }
        ],
        masters: [4] // Анастасія
    },
    { 
        id: 3, 
        name: "Манікюр з покриттям гель-лаком", 
        category: "Нігті", 
        slug: "manikyur-gel-lak", 
        price: 750, 
        image: "https://fastlinestudio.pl/wp-content/webp-express/webp-images/uploads/2023/12/paznokcie-hybrydowe-5.jpg.webp",
        description: "Комбінований манікюр та стійке покриття, що тримається до трьох тижнів. Велика палітра кольорів та сучасні дизайни.",
        priceList: [
            { name: "Однотонне покриття", time: "90 хв", price: 750 },
            { name: "Френч/Дизайн", time: "120 хв", price: 900 }
        ],
        masters: [2, 4] // Ірина, Анастасія
    },
    { 
        id: 4, 
        name: "Чоловіча стрижка", 
        category: "Волосся", 
        slug: "cholovicha-strizhka", 
        price: 500, 
        image: "https://syndicatebarbershop.com.ua/wp-content/uploads/2024/10/Layered-Cut.jpg",
        description: "Класичні та креативні стрижки. Ідеально підібрана форма, що не вимагає складної укладки.",
        priceList: [
            { name: "Класична", time: "45 хв", price: 500 },
            { name: "З миттям", time: "60 хв", price: 600 }
        ],
        masters: [3] // Максим
    },
    { 
        id: 5, 
        name: "Ламінування Брів", 
        category: "Брови/Вії", 
        slug: "laminuvannya-briv",
        price: 600, 
        image: "https://staleks.ua/upload/medialibrary/1d0/8il44j6lkz37cdgnneg6rbsixovqj76y.png", 
        description: "Процедура для створення ідеальної форми, фіксації неслухняних волосків та надання бровам доглянутого вигляду. Ефект тримається до 6 тижнів.",
        priceList: [ 
          { name: "Ламінування", time: "60 хв", price: 600 },
          { name: "Корекція + Фарбування", time: "45 хв", price: 400 }
        ],
        masters: [4] // Анастасія
    },
    // ====================== НОВІ ПОСЛУГИ =========================
    { 
        id: 6, 
        name: "Складне фарбування (AirTouch/Balayage)", 
        category: "Волосся", 
        slug: "airtouch-farbuvannya", 
        price: 3500, 
        image: "https://bloomnails.com.ua/var/upload/hair-melirovanie.jpg",
        description: "Найпопулярніша техніка фарбування для створення м'яких переходів та ефекту вигорілого на сонці волосся. Використовуємо Olaplex/K18.", 
        priceList: [ 
            { name: "Середня довжина", time: "240 хв", price: 5000 },
            { name: "Довге волосся", time: "300 хв", price: 6500 }
        ],
        masters: [1] // Олена
    },
    { 
        id: 7, 
        name: "Нарощування нігтів (Гель/Полігель)", 
        category: "Нігті", 
        slug: "naroshhuvannya-nigtev",
        price: 1100, 
        image: "https://kika-style.com.ua/image/uploads/manicure/naraschivanie-nogtei.jpg",
        description: "Створення ідеальної довжини та форми за допомогою сучасних матеріалів. Корекція будь-якої складності.",
        priceList: [ 
            { name: "Нарощування", time: "150 хв", price: 1100 },
            { name: "Корекція", time: "120 хв", price: 900 }
        ],
        masters: [2] // Ірина
    },
    { 
        id: 8, 
        name: "Ламінування та фарбування вій", 
        category: "Брови/Вії", 
        slug: "laminuvannya-vij",
        price: 700, 
        image: "https://barb.ua/uploads/content/images/articles/0205/1-laminuvannya-viy.jpg", // ФІКТИВНЕ ЗОБРАЖЕННЯ
        description: "Процедура, що піднімає, потовщує та фарбує ваші вії, роблячи погляд більш виразним без туші.",
        priceList: [ 
            { name: "Комплекс", time: "60 хв", price: 700 }
        ],
        masters: [4] // Анастасія
    },
    { 
        id: 9, 
        name: "Стрижка бороди та гоління", 
        category: "Волосся", 
        slug: "strizhka-borody",
        price: 350, 
        image: "https://cdn-ua.bodo.gift/resize/upload/files/cm-experience/103/102288/images_file/all_all_big-t1542032693-r1w768h425q90zc1.jpg",
        description: "Моделювання бороди гарячим рушником та професійним голінням. Ідеальна чіткість ліній.",
        priceList: [ 
            { name: "Моделювання", time: "30 хв", price: 350 },
            { name: "Небезпечне гоління", time: "45 хв", price: 500 }
        ],
        masters: [3] // Максим
    },
    { 
        id: 10, 
        name: "Процедура 'Щастя для волосся'", 
        category: "Волосся", 
        slug: "shchastya-dlya-volossya",
        price: 1500, 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAh6rRZpRtUwJb7vwKgL2RyDwuKEojFVDkA&s", // ФІКТИВНЕ ЗОБРАЖЕННЯ
        description: "Глибоке відновлення структури волосся, повернення блиску, сили та еластичності. Японський догляд.",
        priceList: [ 
            { name: "Коротке/Середнє", time: "90 хв", price: 1500 },
            { name: "Довге", time: "120 хв", price: 2000 }
        ],
        masters: [1] // Олена
    },
    { 
        id: 11, 
        name: "СПА-Педикюр", 
        category: "Нігті", 
        slug: "spa-pedikyur",
        price: 1200, 
        image: "https://dailybeauty.com.ua/images/blog/25_12_19/spa-pedikur.jpg",
        description: "Преміальний догляд за стопами, пілінг, маска та масаж. Повне розслаблення та ідеальний результат.",
        priceList: [ 
            { name: "СПА-педикюр з покриттям", time: "120 хв", price: 1200 }
        ],
        masters: [2] // Ірина
    },
];

export const mastersData = [
    { 
        id: 1, 
        userId: 102, // master@test.ua
        name: "Олена Петрівна", 
        role: "Перукар-стиліст (Жіночий зал)", 
        image: "https://accent.family/glide/index?path=%2F1%2FjKNpj-qTgKBk3wzhfedWBG3rEp7oi1LZ.jpg&w=432&h=268&fit=crop&fm=jpeg&s=b1fa23910fc10f55ece8de7ead93e959", 
        services: [1, 6, 10], // ОНОВЛЕНО: Стрижка, Складне фарбування, Щастя для волосся
        about: "Спеціалізується на складних фарбуваннях (AirTouch, Balayage) та креативних стрижках. Досвід 10 років.",
        rating: 4.9 
    },
    { 
        id: 2, 
        userId: 103, // master2@test.ua
        name: "Ірина Сахно", 
        role: "Майстер манікюру/педикюру", 
        image: "https://www.manicure.uz.ua/images/news/2023/majster-manikjuru3.jpg", 
        services: [3, 7, 11], // ОНОВЛЕНО: Манікюр, Нарощування, СПА-Педикюр
        about: "Творчий підхід до дизайну нігтів, працює лише з преміум-матеріалами. Швидкість та якість – її візитівка.",
        rating: 4.8 
    },
    { 
        id: 3, 
        userId: 104, // master3@test.ua
        name: "Максим Горовий", 
        role: "Барбер (Чоловічий зал)", 
        image: "https://frisor.ua/wp-content/uploads/2022/12/kov00774-scaled.jpg", 
        services: [4, 9], // ОНОВЛЕНО: Чоловіча стрижка, Борода/Гоління
        about: "Класичні та сучасні чоловічі стрижки, корекція бороди. Завжди ідеальний фейд. Справжній барбер.",
        rating: 4.7 
    },
    { 
        id: 4, 
        userId: 105, // master4@test.ua
        name: "Анастасія Світла", 
        role: "Бровист / Універсал", 
        image: "https://framerusercontent.com/images/csZGAcb8FTeRpGY244aaxdPpE8.jpg?width=2000&height=1333", 
        services: [1, 2, 3, 5, 8], // ОНОВЛЕНО: Універсал + Брови/Вії
        about: "Універсальний майстер, який володіє всіма техніками. Швидкий запис, висока якість. Спеціалізується на бровах/віях.",
        rating: 5.0 
    },
];


// =================================================================
// 🚀 ЛОГІКА ІМІТАЦІЇ БЕКЕНДУ (User, Cart, Appointments)
// =================================================================

const INITIAL_USERS = [
    { id: 101, email: 'client@test.ua', password: '123', role: 'client', firstName: 'Іван', masterId: null },
    { id: 102, email: 'master@test.ua', password: '123', role: 'master', firstName: 'Олена', masterId: 1 },
    { id: 103, email: 'master2@test.ua', password: '123', role: 'master', firstName: 'Ірина', masterId: 2 },
    { id: 104, email: 'master3@test.ua', password: '123', role: 'master', firstName: 'Максим', masterId: 3 },
    { id: 105, email: 'master4@test.ua', password: '123', role: 'master', firstName: 'Анастасія', masterId: 4 },
];

let usersDB = JSON.parse(localStorage.getItem('usersDB')) || INITIAL_USERS;
let appointmentsDB = JSON.parse(localStorage.getItem('appointmentsDB')) || [];
let cartDB = JSON.parse(localStorage.getItem('cartDB')) || [];

export const getUsersDB = () => usersDB;
export const saveUsersDB = (newUsers) => {
    usersDB = newUsers;
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
};

export const getAppointmentsDB = () => appointmentsDB;
export const saveAppointmentsDB = (newAppointments) => {
    appointmentsDB = newAppointments;
    localStorage.setItem('appointmentsDB', JSON.stringify(appointmentsDB));
};

export const getCartDB = () => cartDB;
export const saveCartDB = (newCart) => {
    cartDB = newCart;
    localStorage.setItem('cartDB', JSON.stringify(cartDB));
};

// --- ФУНКЦІЇ КОРЗИНИ ---
export const addToCart = (service) => {
    // Перевіряємо, чи вже є ця послуга в кошику (за ID)
    const existingIndex = cartDB.findIndex(item => areIdsEqual(item.id, service.id));
    
    if (existingIndex !== -1) {
        // Якщо вже є, нічого не робимо (послуги не множаться)
        return false;
    } else {
        // Додаємо послугу
        // 🚨 ВАЖЛИВО: Додаємо повну інформацію про послугу, включаючи slug, для навігації на сторінці Appointment
        cartDB.push(service); 
        saveCartDB(cartDB);
        return true;
    }
};

export const removeFromCart = (itemId) => {
    cartDB = cartDB.filter(item => !areIdsEqual(item.id, itemId));
    saveCartDB(cartDB);
};

export const clearCart = () => {
    cartDB = [];
    saveCartDB(cartDB);
};

// --- ФУНКЦІЇ ЗАПИСУ ---
export const saveAppointment = (appointmentData) => {
    const newAppointment = {
        ...appointmentData,
        id: generateUniqueId(),
        status: 'Confirmed', // Або Pending
        createdAt: new Date().toISOString(),
    };
    appointmentsDB.push(newAppointment);
    saveAppointmentsDB(appointmentsDB);
    return newAppointment;
};

export const updateAppointmentStatus = (appointmentId, newStatus) => {
    const index = appointmentsDB.findIndex(app => areIdsEqual(app.id, appointmentId));
    if (index !== -1) {
        appointmentsDB[index].status = newStatus;
        saveAppointmentsDB(appointmentsDB);
        return true;
    }
    return false;
};

// =================================================================
// ✨ КОМПОНЕНТ АВТЕНТИФІКАЦІЇ
// =================================================================

// 1. СТИЛІ
const pageStyle = {
    padding: '60px 20px',
    maxWidth: '450px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
};

const formContainerStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontSize: '1rem',
};

const mainButtonStyle = {
    background: '#d81b60',
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginTop: '10px',
    transition: 'background 0.3s',
};

const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#d81b60',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px',
    textDecoration: 'underline',
};


// 2. КОМПОНЕНТ AUTH
const Auth = ({ onLogin, openInfoModal }) => { 
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 4. Обробка форми
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Імітація: Перевірка email/password для існуючого користувача
        const user = usersDB.find(u => u.email === formData.email && u.password === formData.password);

        if (isRegistering) {
            // Імітація: Реєстрація нового користувача
            if (usersDB.some(u => u.email === formData.email)) {
                // 🔥 ВИКОРИСТОВУЄМО InfoModal для помилки
                if (openInfoModal) {
                    openInfoModal({
                        title: "Помилка Реєстрації ❌",
                        message: `Користувач з email **${formData.email}** вже зареєстрований.`,
                        icon: '⚠️'
                    });
                }
                return;
            }

            const newUser = { 
                id: generateUniqueId(), 
                email: formData.email, 
                password: formData.password, 
                role: 'client', // За замовчуванням
                firstName: formData.firstName || 'Новий Клієнт',
                masterId: null, // Якщо це клієнт
            };
            
            // Зберігаємо та оновлюємо стан
            usersDB.push(newUser);
            localStorage.setItem('usersDB', JSON.stringify(usersDB));
            onLogin(newUser); 

            // 🔥 ВИКОРИСТОВУЄМО InfoModal для успіху
            if (openInfoModal) {
                openInfoModal({
                    title: "Реєстрація Успішна! 🎉",
                    message: `Ласкаво просимо, **${newUser.firstName}**! Ви можете починати запис.`,
                    icon: '✅'
                });
            }
            navigate('/profile'); 
            
        } else {
            // Імітація: Вхід існуючого користувача
            if (user) {
                onLogin(user); 

                // 🔥 ВИКОРИСТОВУЄМО InfoModal для успіху
                if (openInfoModal) {
                    openInfoModal({
                        title: "Вхід Успішний! 👋",
                        message: `Раді бачити Вас, **${user.firstName}**!`,
                        icon: '🚪'
                    });
                }
                // Навігація на профіль або дашборд майстра
                const targetPath = user.role === 'master' ? '/master-dashboard' : '/profile';
                navigate(targetPath);
            } else {
                // 🔥 ВИКОРИСТОВУЄМО InfoModal для помилки
                if (openInfoModal) {
                    openInfoModal({
                        title: "Помилка Входу 🚫",
                        message: "Невірний email або пароль.",
                        icon: '🛑'
                    });
                }
            }
        }
    };


    return (
        <div className="container animate" style={pageStyle}>
            <h1 style={{ color: '#d81b60', textAlign: 'center', marginBottom: '30px' }}>
                {isRegistering ? 'Реєстрація' : 'Вхід'}
            </h1>
            <div style={formContainerStyle}>
                <form onSubmit={handleFormSubmit}>
                    {isRegistering && (
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName}
                            onChange={handleInputChange} 
                            placeholder="Ваше Ім'я (необов'язково)" 
                            style={inputStyle}
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
                    />
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange} 
                        placeholder="Пароль (напр. 123)" 
                        required 
                        style={inputStyle}
                    />
                    <button type="submit" style={mainButtonStyle}>
                        {isRegistering ? 'ЗАРЕЄСТРУВАТИСЯ' : 'УВІЙТИ'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#666', textAlign: 'center' }}>
                    {isRegistering ? 'Вже маєте акаунт?' : 'Не маєте акаунту?'}
                    <button 
                        type="button" 
                        onClick={() => setIsRegistering(!isRegistering)}
                        style={toggleButtonStyle}
                    >
                        {isRegistering ? 'Увійти' : 'Реєстрація'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;