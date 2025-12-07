// src/pages/Services.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД З ЕЛЕГАНТНИМИ ФІЛЬТРАМИ)

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { servicesData, addToCart } from './Auth'; 


// Визначаємо унікальні категорії для фільтрації
const allCategories = ['Усі послуги', ...new Set(servicesData.map(s => s.category))];

const Services = ({ onCartUpdate, openInfoModal }) => { 
    // Стан для обраної категорії
    const [selectedCategory, setSelectedCategory] = useState('Усі послуги');

    // Стан для розширених фільтрів
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');


    // Фільтрація послуг
    const filteredServices = useMemo(() => {
        let currentServices = servicesData;

        // 1. Фільтрація за Категорією
        if (selectedCategory !== 'Усі послуги') {
            currentServices = currentServices.filter(service => service.category === selectedCategory);
        }

        // 2. Фільтрація за Пошуковим Терміном (Назва або Опис)
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentServices = currentServices.filter(service =>
                service.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                service.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        // 3. Фільтрація за Ціною (від/до)
        const minP = parseInt(minPrice) || 0;
        const maxP = parseInt(maxPrice) || Infinity;

        currentServices = currentServices.filter(service =>
            service.price >= minP && service.price <= maxP
        );

        return currentServices;
    }, [selectedCategory, searchTerm, minPrice, maxPrice]);


    const handleAddToCart = (e, service) => {
        e.preventDefault();
        const added = addToCart(service);
        
        if (added && openInfoModal) {
            openInfoModal({
                title: "Додано до Кошика! 🛍️",
                message: `Послуга **${service.name}** додана до вашого кошика.`,
                icon: '🛒'
            });
        } else if (openInfoModal) {
            openInfoModal({
                title: "Послуга вже в Кошику",
                message: `Послуга **${service.name}** вже очікує на запис у вашому кошику.`,
                icon: '⚠️'
            });
        }
        
        if (onCartUpdate) {
            onCartUpdate();
        }
    };


    // --- Стилі (ОНОВЛЕНО ДЛЯ ЕЛЕГАНТНОСТІ ТА КОМПАКТНОСТІ) ---
    const pageStyle = {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundImage: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 240, 245, 0.85) 50%, rgba(255, 230, 245, 0.9) 100%), url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
    };

    // ✅ КОМПАКТНИЙ ТА ЕЛЕГАНТНИЙ КОНТЕЙНЕР ФІЛЬТРІВ
    const filterPanelStyle = {
        background: '#fff', 
        border: '1px solid #eee', 
        padding: '15px', // Зменшено
        borderRadius: '10px', 
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    };
    
    const categoriesContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // Вирівнювання по лівому краю
        gap: '8px', // Зменшено відступ
        marginBottom: '20px',
    };
    
    // ✅ КОМПАКТНИЙ ІНПУТ (форма "пігулки")
    const inputStyle = {
        width: '100%',
        padding: '8px 12px', // Зменшено
        border: '1px solid #ddd', 
        borderRadius: '20px', // Більш округлий
        boxSizing: 'border-box',
        fontSize: '0.95rem', // Зменшено
        transition: 'all 0.3s',
        // Додано імітацію focus/hover
        ':focus': { borderColor: '#d81b60', boxShadow: '0 0 0 2px rgba(216, 27, 96, 0.1)' }
    };

    const inputLabelStyle = {
        fontWeight: '500', // Менш жирний
        color: '#666',
        marginBottom: '5px',
        display: 'block',
        fontSize: '0.9rem' // Зменшено
    };

    // ✅ КОМПАКТНА КНОПКА КАТЕГОРІЇ
    const categoryButtonStyle = (category) => ({
        background: selectedCategory === category ? '#d81b60' : '#fff',
        color: selectedCategory === category ? 'white' : '#555',
        border: selectedCategory === category ? '1px solid #d81b60' : '1px solid #ccc',
        padding: '8px 15px', // Зменшено
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: selectedCategory === category ? 'bold' : 'normal',
        transition: 'all 0.3s',
        whiteSpace: 'nowrap',
        boxShadow: selectedCategory === category ? '0 3px 6px rgba(216, 27, 96, 0.2)' : 'none',
        flexShrink: 0
    });
    
    // Стилі для картки послуги та сітки залишаються без змін
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
    };
    
    const serviceCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: '#333',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };

    const cardContentStyle = {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    };
    
    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderBottom: '1px solid #eee',
    };

    const cartButtonStyle = {
        background: '#333',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
        marginBottom: '10px',
    };

    const detailButtonStyle = {
        textAlign: 'center',
        color: '#d81b60',
        fontWeight: 'bold',
        padding: '5px 0',
        border: '1px solid #d81b60',
        borderRadius: '5px',
    };


    return (
        <div style={{ 
            width: '100%', 
            minHeight: '100vh',
            backgroundImage: `url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className="container animate" style={pageStyle}>
            <h1 style={{ color: '#d81b60', textAlign: 'center', marginBottom: '10px' }}>Наші Послуги</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '1.2rem' }}>
                Оберіть свою процедуру, щоб стати ще чарівнішою.
            </p>

            {/* БЛОК ЕЛЕГАНТНИХ ФІЛЬТРІВ */}
            <div style={filterPanelStyle}>
                
                <h2 style={{ color: '#333', fontSize: '1.2rem', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #eee' }}>
                    🔎 Фільтри
                </h2>

                {/* 1. Фільтр за Категоріями */}
                <div style={{ marginBottom: '20px' }}>
                    <span style={inputLabelStyle}>Оберіть категорію:</span>
                    <div style={categoriesContainerStyle}>
                        {allCategories.map(category => (
                            <button
                                key={category}
                                style={categoryButtonStyle(category)}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>


                {/* 2. Фільтр за Пошуковим Терміном */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="search" style={inputLabelStyle}>
                        Пошук за назвою:
                    </label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Стрижка, манікюр, фарбування..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* 3. Фільтр за Ціновим Діапазоном */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    {/* Мін. Ціна */}
                    <div style={{ flex: 1 }}>
                        <label htmlFor="minPrice" style={inputLabelStyle}>
                            Ціна від (грн):
                        </label>
                        <input
                            id="minPrice"
                            type="number"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    
                    {/* Макс. Ціна */}
                    <div style={{ flex: 1 }}>
                        <label htmlFor="maxPrice" style={inputLabelStyle}>
                            Ціна до (грн):
                        </label>
                        <input
                            id="maxPrice"
                            type="number"
                            placeholder="3000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

            </div>


            {/* 4. Сітка Послуг */}
            <div style={gridStyle}>
                {filteredServices.map(service => (
                    <Link 
                        to={`/service/${service.slug}`} 
                        key={service.id} 
                        style={serviceCardStyle}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <img src={service.image} alt={service.name} style={imageStyle} />
                        <div style={cardContentStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <span style={{ color: '#777', fontSize: '0.9rem' }}>{service.category}</span>
                                <span style={{ color: '#d81b60', fontWeight: 'bold', fontSize: '1.4rem' }}>{service.price} грн</span>
                            </div>
                            <h3 style={{ margin: '0 0 10px 0' }}>{service.name}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', flexGrow: 1 }}>{service.description.substring(0, 70)}...</p>
                            
                            {/* КНОПКА: Додати до Кошика */}
                            <button 
                                onClick={(e) => handleAddToCart(e, service)} 
                                style={cartButtonStyle}
                            >
                                Додати до Кошика
                            </button>
                            
                            {/* Кнопка "Деталі та Запис" */}
                            <div style={detailButtonStyle}>
                                Деталі та Запис
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {filteredServices.length === 0 && (
                <p style={{ textAlign: 'center', color: '#d81b60', fontSize: '1.2rem', marginTop: '40px' }}>
                    На жаль, не знайдено послуг за вказаними критеріями фільтрації.
                </p>
            )}
            </div>
        </div>
    );
};

export default Services;