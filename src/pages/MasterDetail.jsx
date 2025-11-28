// src/pages/MasterDetail.jsx (НОВИЙ ФАЙЛ)

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// 🔥 ІМПОРТУЄМО ДАНІ З AUTH.JSX
import { mastersData, servicesData, addToCart } from './Auth'; 

const MasterDetail = ({ onCartUpdate }) => {
    const { masterId } = useParams();
    const navigate = useNavigate();
    
    // 1. Пошук Майстра
    const master = mastersData.find(m => String(m.id) === masterId);

    // Якщо майстра не знайдено
    if (!master) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1 style={{ color: '#d81b60' }}>Майстра не знайдено 😢</h1>
                <p>Перевірте посилання або поверніться на сторінку команди.</p>
                <button 
                    onClick={() => navigate('/masters')} 
                    style={{ padding: '10px 20px', background: '#d81b60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}
                >
                    До Команди
                </button>
            </div>
        );
    }
    
    // 2. Фільтрація послуг, які надає майстер
    const masterServices = servicesData.filter(service => 
        master.services.includes(service.id)
    );

    // 3. Допоміжні дані (імітація)
    const masterReviews = [
        { id: 1, text: "Робота виконана ідеально! Дуже уважний майстер.", author: "Анна К.", rating: 5 },
        { id: 2, text: "Швидко і якісно. Рекомендую!", author: "Сергій П.", rating: 5 },
    ];
    
    // 4. Логіка додавання послуги в кошик
    const handleAddToCart = (service) => {
        const added = addToCart(service);
        if (added) {
            alert(`Послугу "${service.name}" додано до кошика!`);
            if (onCartUpdate) onCartUpdate();
        } else {
            alert(`Послуга "${service.name}" вже є в кошику.`);
        }
    };
    
    // --- Стилі ---
    const pageContainerStyle = { padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' };
    const headerStyle = { display: 'flex', gap: '40px', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap' };
    const imageStyle = { width: '250px', height: '250px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' };
    const infoStyle = { flexGrow: 1, minWidth: '300px' };
    const sectionTitleStyle = { color: '#d81b60', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' };
    const serviceCardStyle = { 
        padding: '20px', 
        border: '1px solid #f0f0f0', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
    };
    const bookButtonStyle = {
        background: '#d81b60',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '25px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.9rem',
    };
    
    // Додаємо інформацію "about" та "rating" з імітаційних даних, якщо їх немає в Auth.jsx
    const masterDetails = {
        1: { about: "Спеціалізується на складних фарбуваннях (AirTouch, Balayage) та стрижках. Досвід 10 років. Завжди актуальна.", rating: 4.9, experience: '10 років' },
        2: { about: "Творчий підхід до дизайну нігтів, працює лише з преміум-матеріалами. Швидкість та якість.", rating: 4.8, experience: '7 років' },
        3: { about: "Класичні та сучасні чоловічі стрижки, корекція бороди. Завжди ідеальний фейд. Справжній барбер.", rating: 4.7, experience: '5 років' },
        4: { about: "Універсальний майстер, який володіє всіма техніками. Швидкий запис, висока якість.", rating: 5.0, experience: '8 років' },
    };
    const details = masterDetails[master.id] || {};


    return (
        <div className="container animate" style={pageContainerStyle}>
            <div style={headerStyle}>
                {/* 1. Фото Майстра */}
                <img src={master.image} alt={master.name} style={imageStyle} />
                
                {/* 2. Інформація */}
                <div style={infoStyle}>
                    <h1 style={{ marginBottom: '10px', color: '#333' }}>{master.name}</h1>
                    <h2 style={{ color: '#d81b60', margin: '0 0 20px 0', fontWeight: '400' }}>{master.role}</h2>
                    
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#555' }}>
                        {details.about || "Спеціаліст високого рівня у своїй галузі. Завжди слідкую за останніми трендами та використовую лише найкращі матеріали для досягнення ідеального результату."}
                    </p>
                    
                    <div style={{ marginTop: '20px', fontSize: '1rem' }}>
                        <p>⭐️ **Рейтинг:** {details.rating || '5.0'} / 5.0</p>
                        <p>📅 **Досвід:** {details.experience || 'від 5 років'}</p>
                    </div>
                </div>
            </div>
            
            {/* 3. Перелік Послуг Майстра */}
            <h2 style={sectionTitleStyle}>Послуги, які надає {master.name} ({masterServices.length})</h2>
            <div style={{ marginTop: '20px' }}>
                {masterServices.length > 0 ? (
                    masterServices.map(service => (
                        <div key={service.id} style={serviceCardStyle}>
                            <div>
                                <Link to={`/service/${service.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                                    <h4 style={{ margin: 0, color: '#d81b60' }}>{service.name}</h4>
                                </Link>
                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                                    {service.description.substring(0, 100)}...
                                </p>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '150px' }}>
                                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#333' }}>
                                    {service.price} грн
                                </p>
                                <button 
                                    onClick={() => handleAddToCart(service)} 
                                    style={bookButtonStyle}
                                >
                                    Записатися / Кошик
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>На жаль, послуги для цього майстра не знайдено.</p>
                )}
            </div>
            
            {/* 4. Відгуки (імітація) */}
            <h2 style={sectionTitleStyle}>Останні Відгуки</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {masterReviews.map(review => (
                    <div key={review.id} style={{ padding: '20px', borderLeft: '3px solid #d81b60', background: '#fcfcfc', borderRadius: '5px' }}>
                        <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#444' }}>"{review.text}"</p>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#d81b60' }}>{review.author}</p>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default MasterDetail;