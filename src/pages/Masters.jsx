// src/pages/Masters.jsx (ПОВНИЙ ОНОВЛЕНИЙ КОД З ПОСИЛАННЯМИ НА MasterDetail)

import React from 'react';
import { Link } from 'react-router-dom';
// 🔥 ІМПОРТУЄМО ОСНОВНІ ДАНІ МАЙСТРІВ З Auth.jsx
import { mastersData as authMastersData } from './Auth'; 

// 🔥 ДОДАТКОВІ ДЕТАЛІ, які ми використовуємо для MasterDetail
const masterDetails = {
    1: { about: "Спеціалізується на складних фарбуваннях (AirTouch, Balayage) та стрижках. Досвід 10 років.", rating: 4.9 },
    2: { about: "Творчий підхід до дизайну нігтів, працює лише з преміум-матеріалами. Швидкість та якість.", rating: 4.8 },
    3: { about: "Класичні та сучасні чоловічі стрижки, корекція бороди. Завжди ідеальний фейд. Справжній барбер.", rating: 4.7 },
    4: { about: "Універсальний майстер, який володіє всіма техніками. Швидкий запис, висока якість.", rating: 5.0 },
};

// Комбінуємо дані: беремо основу з Auth.jsx і додаємо деталі
const masters = authMastersData.map(master => {
    const detail = masterDetails[master.id] || {};
    return {
        ...master,
        ...detail,
    };
});


const Masters = () => {
    // --- Стилі тут не змінені ---
    const pageContainerStyle = { 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundImage: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(240, 250, 255, 0.85) 50%, rgba(230, 245, 255, 0.9) 100%), url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
    };
    const gridStyle = { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '30px', 
        marginTop: '30px' 
    };
    const masterCardStyle = { 
        borderRadius: '12px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: '#333',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    };
    const masterImageStyle = { 
        width: '100%', 
        height: '350px', 
        objectFit: 'cover',
    };
    const cardContentStyle = {
        padding: '20px',
        textAlign: 'center',
        background: 'white',
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
            <div className="container animate" style={pageContainerStyle}>
	      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>Наша Команда</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
                Познайомтеся з нашими найкращими фахівцями.
            </p>

      <div style={gridStyle}>
	       {masters.map(master => (
                // 🔥 ОБГОРТАЄМО КАРТКУ В <Link> для переходу на сторінку деталей
	          <Link to={`/master/${master.id}`} key={master.id} style={masterCardStyle}>
                        <img 
                            src={master.image} 
                            alt={master.name} 
                            style={masterImageStyle} 
                        />
                        <div style={cardContentStyle}>
                            <h3 style={{ margin: '0 0 5px 0', color: '#d81b60' }}>{master.name}</h3>
                            <p style={{ margin: '0 0 10px 0', color: '#777', fontWeight: 'bold' }}>{master.role}</p>
                            <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '0.9rem' }}>
                                {master.about ? master.about.substring(0, 70) + '...' : 'Деталі про майстра...'}
                            </p>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#d81b60' }}>
                                ⭐️ {master.rating || '5.0'} / 5.0
                            </div>
                        </div>
                    </Link>
	       ))}
            </div>
        </div>
        </div>
    );
};

export default Masters;