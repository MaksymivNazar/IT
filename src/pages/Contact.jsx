// src/pages/Contact.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД З InfoModal)

import React from 'react';

// 🔥 ПРИЙМАЄМО openInfoModal ЯК ПРОПС
const Contact = ({ openInfoModal }) => { 
    // Стилі для форми
    const formStyle = { 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '30px', 
        background: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        textAlign: 'left'
    };
    const inputStyle = { 
        width: '100%', 
        padding: '12px', 
        marginBottom: '15px', 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        boxSizing: 'border-box'
    };
    const textareaStyle = { ...inputStyle, resize: 'vertical', height: '100px' };
    const submitButtonStyle = { 
        ...inputStyle, 
        background: '#d81b60', 
        color: 'white', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        marginTop: '10px'
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        // 🔥 ВИКОРИСТОВУЄМО InfoModal ЗАМІСТЬ alert()
        if (openInfoModal) {
            openInfoModal({
                title: "Повідомлення відправлено! ✨",
                message: "Дякуємо за ваш запит! Ми зв'яжемося з вами найближчим часом.",
                icon: '📩'
            });
        }
        
        // Тут повинна бути логіка відправки даних на бекенд
        // Після успішної відправки (або тут, як імітація), очищуємо форму
        e.target.reset(); 
    };

    return (
        <div className="container animate" style={{ padding: '40px 20px' }}>
            <h1 style={{ textAlign: 'center', color: '#d81b60', marginBottom: '10px' }}>Зв'яжіться з Нами</h1>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '50px' }}>Ми завжди раді вашому візиту!</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                
                {/* Інформаційний Блок */}
                <div style={{ flex: '1 1 300px', padding: '20px', textAlign: 'left' }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Наші Дані</h2>
                    <div style={{ fontSize: '1.1rem', lineHeight: 2.5 }}>
                        <p>📍 <strong>Адреса:</strong> м. Київ, вул. Хрещатик, 1</p>
                        <p>📞 <strong>Телефон:</strong> <a href="tel:+380987775533" style={{ color: '#d81b60', textDecoration: 'none' }}>(098) 777-55-33</a></p>
                        <p>📧 <strong>Email:</strong> <a href="mailto:contact@topbeautystudio.ua" style={{ color: '#d81b60', textDecoration: 'none' }}>contact@topbeautystudio.ua</a></p>
                        <p>⏰ <strong>Графік:</strong> Пн-Нд 09:00 - 21:00</p>
                    </div>
                </div>

                {/* Карта (Placeholder) */}
                <div style={{ flex: '2 1 500px', minHeight: '300px' }}>
                    <iframe 
                        title="Карта"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.098800913702!2d30.52220471573881!3d50.45010647947119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce256e4c78cd%3A0x7d0186938a1e2f7!2z0KHRgtGA0L7QstCw0L3QuNC5INCQ0LrQsNGI0LjRh9C60L7QstCw!5sHreschatyk%20St%2C%201%2C%20Kyiv!5e0!3m2!1suk!2sua!4v1660655843105!5m2!1suk!2sua" 
                        style={{ border: 0, width: '100%', height: '100%', borderRadius: '10px' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            {/* Форма Зворотного Зв'язку */}
            <div style={{ padding: '50px 20px', textAlign: 'center', marginTop: '30px' }}>
                <h2 style={{ color: '#333', marginBottom: '30px' }}>Напишіть нам</h2>
                <form onSubmit={handleFormSubmit} style={formStyle}>
                    <input type="text" placeholder="Ваше Ім'я" style={inputStyle} required />
                    <input type="email" placeholder="Email" style={inputStyle} required />
                    <input type="tel" placeholder="Телефон" style={inputStyle} />
                    <textarea placeholder="Ваше повідомлення" style={textareaStyle} required></textarea>
                    <button type="submit" style={submitButtonStyle}>ВІДПРАВИТИ ПОВІДОМЛЕННЯ</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;