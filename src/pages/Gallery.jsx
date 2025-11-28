// src/pages/Gallery.jsx

import React from 'react';

// 🔥 ФІКТИВНІ ДАНІ ДЛЯ ГАЛЕРЕЇ З ОНОВЛЕНИМИ ЗОБРАЖЕННЯМИ
const galleryImages = [
    // 1. Манікюр з дизайном
    { id: 1, url: 'https://img.tsn.ua/cached/348/tsn-e4d2bbace79d9196864837254e47d00a/thumbs/1200x630/9a/d5/657cbf92001de86d39e8cb7d6fb2d59a.jpeg', alt: 'Манікюр з дизайном', title: 'Манікюр з дизайном' },
    // 2. Складне фарбування волосся (наприклад, мелірування)
    { id: 2, url: 'https://bloomnails.com.ua/var/upload/hair-melirovanie.jpg', alt: 'Складне фарбування волосся', title: 'Складне фарбування' },
    // 3. Жіноча стрижка (коротке волосся)
    { id: 3, url: 'https://zachiska.pp.ua/wp-content/uploads/2022/01/zhenskie-strizhki-na-korotkie-volosy-aktualnye-foto-novinki-i-trendy-018fa91.jpg', alt: 'Сучасна жіноча стрижка', title: 'Жіноча стрижка' },
    // 4. Макіяж (яскравий вечірній)
    { id: 4, url: 'https://barb.ua/uploads/2025_/07/03/1729859/c/post.jpg', alt: 'Яскравий вечірній макіяж', title: 'Яскравий макіяж' }, 
    // 5. Брови (ламінування)
    { id: 5, url: 'https://5element.ua/i/content/1342/1_0014___large.jpg', alt: 'Ламінування брів', title: 'Ламінування брів' }, 
    // 6. Педикюр (SPA-догляд)
    { id: 6, url: 'https://primelaser.com.ua/wp-content/uploads/2021/05/1-44.jpg', alt: 'SPA-педикюр з доглядом', title: 'SPA-педикюр' }, 
];

const Gallery = () => {
    
    const galleryGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px',
    };

    const imageWrapperStyle = {
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '10px', // Змінено для місця під назву
    };
    
    const imageStyle = {
        width: '100%',
        height: '350px', 
        objectFit: 'cover', 
        display: 'block',
        transition: 'transform 0.5s ease-in-out',
    };
    
    const titleStyle = {
        fontSize: '1.2rem',
        color: '#333',
        fontWeight: 'bold',
        marginTop: '10px',
        marginBottom: '20px',
        textAlign: 'left', // Щоб назва була не по центру картки
    };

    return (
        <div className="container animate" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h1 style={{ color: '#d81b60', marginBottom: '10px' }}>Галерея Робіт</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>Натхнення та докази нашої майстерності.</p>
            
            <div style={galleryGridStyle}>
                {galleryImages.map((image) => (
                    <div 
                        key={image.id} 
                        style={{ textAlign: 'left' }} // Контейнер для фото + назва
                    >
                        **<h4 style={titleStyle}>{image.title}</h4>**
                        <div style={imageWrapperStyle}>
                            <img 
                                src={image.url} 
                                alt={image.alt} 
                                style={imageStyle} 
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {galleryImages.length === 0 && (
                 <p style={{ marginTop: '50px', fontSize: '1.5rem', color: '#aaa' }}>🖼️ Фотографії завантажуються...</p>
            )}
        </div>
    );
};

export default Gallery;