// src/pages/ServiceDetail.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 🔥 ІМПОРТУЄМО ВСЕ НЕОБХІДНЕ З AUTH.JSX
import { saveAppointment, servicesData, mastersData, addToCart } from './Auth'; 


const generateTimeSlots = (start = 10, end = 19, duration = 60) => {
    const slots = [];
    for (let h = start; h < end; h++) {
        for (let m = 0; m < 60; m += duration) {
            if (h * 60 + m < end * 60) {
                const hour = String(h).padStart(2, '0');
                const minute = String(m).padStart(2, '0');
                slots.push(`${hour}:${minute}`);
            }
        }
    }
    return slots;
};

// 🚨 ОНОВЛЕНО: Додано onCartUpdate
const ServiceDetail = ({ user, onCartUpdate }) => { 
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const service = servicesData.find(s => s.slug === slug);
    
    const availableMasters = service 
        ? mastersData.filter(m => m.services.includes(service.id)) 
        : [];

    const [selectedMaster, setSelectedMaster] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        if (service) {
            const duration = service.minDuration;
            setAvailableTimes(generateTimeSlots(10, 19, duration)); 
        }
    }, [service]);

    if (!service) return <h2 style={{ padding: '50px', textAlign: 'center' }}>Послуга не знайдена. Перевірте slug.</h2>;

    const handleMasterSelect = (master) => {
        setSelectedMaster(master);
        setSelectedDate('');
        setSelectedTime('');
    };
    
    const handleDateSelect = (e) => {
        setSelectedDate(e.target.value);
        setSelectedTime('');
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        if (!user) {
            alert("Будь ласка, увійдіть, щоб завершити запис.");
            navigate('/auth'); 
            return;
        }
    };

    const handleBookNow = () => {
        if (!selectedMaster || !selectedDate || !selectedTime) {
            alert("Будь ласка, оберіть майстра, дату та час.");
            return;
        }
        
        if (!user) {
            alert("Будь ласка, увійдіть, щоб завершити запис.");
            navigate('/auth');
            return;
        }

        const newAppointment = {
            userId: user.id,
            service: service.name,
            serviceImage: service.image, 
            master: selectedMaster.name,
            masterImage: selectedMaster.image, 
            date: selectedDate,
            time: selectedTime,
            price: service.price,
            status: 'pending'
        };

        saveAppointment(newAppointment); 
        alert(`Ви успішно записані на ${service.name} до ${selectedMaster.name} ${selectedDate} о ${selectedTime}!`);
        navigate('/profile'); 
    };
    
    // 🚨🚨🚨 ОНОВЛЕНО: ДОДАТИ ПОСЛУГУ ДО КОШИКА 🚨🚨🚨
    const handleAddToCart = () => {
        const added = addToCart(service);
        if (added) {
            alert(`Послугу "${service.name}" додано до кошика!`);
            // 🔥 КЛЮЧОВА ЛОГІКА: Викликаємо оновлення лічильника
            if (onCartUpdate) {
                onCartUpdate(); 
            }
        } else {
            alert(`Послуга "${service.name}" вже є в кошику.`);
        }
    };
    
    // --- Стилі для компонентів ---
    const pageContainerStyle = { padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' };
    const sectionTitleStyle = { color: '#d81b60', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', marginTop: '40px' };
    
    // 🔥 ВИПРАВЛЕНО: Зменшено maxHeigh з 400px до 300px
    const serviceImageStyle = { 
        width: '100%', 
        maxHeight: '300px', 
        objectFit: 'cover', 
        borderRadius: '15px', 
        marginBottom: '30px' 
    }; 
    
    const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' };
    const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' };
    const slotButtonStyle = { padding: '10px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
    const selectedSlotStyle = { ...slotButtonStyle, background: '#d81b60', color: 'white' };
    const availableSlotStyle = { ...slotButtonStyle, background: '#f0f0f0', color: '#333' };
    const masterCardStyle = (master) => ({
        border: `3px solid ${selectedMaster && selectedMaster.id === master.id ? '#d81b60' : '#ddd'}`, 
        borderRadius: '12px',
        padding: '15px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: selectedMaster && selectedMaster.id === master.id ? '0 5px 15px rgba(216, 27, 96, 0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
    });
    const masterImageStyle = {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '10px',
    };
    const bookButtonStyle = {
        background: '#d81b60',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '30px',
        width: '100%',
        fontSize: '1.2rem',
    };
    
    // 🔥 ВИПРАВЛЕНО: Зменшено розмір кнопки кошика
    const cartButtonMainStyle = {
        background: '#333', 
        color: 'white',
        border: 'none',
        padding: '10px 20px', // Було 12px 25px
        borderRadius: '6px', // Трохи менший радіус
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '20px',
        width: '100%',
        fontSize: '1.0rem', // Було 1.2rem
        maxWidth: '350px', // Додаємо обмеження ширини для кращого вигляду
        margin: '20px auto', // Центруємо
        display: 'block', // Робимо блоковим для центрування через margin: auto
    };

    return (
        <div style={pageContainerStyle}>
            {/* 1. Деталі Послуги */}
            <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '10px' }}>{service.name}</h1>
            <p style={{ textAlign: 'center', color: '#d81b60', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {service.price} грн
            </p>
            
            {service.image && <img src={service.image} alt={service.name} style={serviceImageStyle} />}

            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6, marginBottom: '40px' }}>
                {service.description}
            </p>
            
            {/* 🚨 КНОПКА ДОДАТИ ДО КОШИКА (Тепер менша) */}
            <button 
                onClick={handleAddToCart} 
                style={cartButtonMainStyle}
            >
                🛍️ ДОДАТИ ПОСЛУГУ ДО КОШИКА
            </button>
            
            <h2 style={{ ...sectionTitleStyle, marginTop: '30px' }}>Оформити Запис (Майстер/Дата)</h2>

            {/* 2. Вибір Майстра */}
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Оберіть Майстра</h3>
            <div style={cardGridStyle}>
                {availableMasters.map(master => (
                    <div 
                        key={master.id} 
                        style={masterCardStyle(master)} 
                        onClick={() => handleMasterSelect(master)}
                    >
                        <img src={master.image} alt={master.name} style={masterImageStyle} /> 
                        <h4 style={{ margin: '5px 0' }}>{master.name}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#777' }}>{master.role}</p>
                    </div>
                ))}
            </div>

            {selectedMaster && (
                <>
                    {/* 3. Вибір Дати */}
                    <h3 style={{ ...sectionTitleStyle, color: '#333' }}>Оберіть Дату</h3>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={handleDateSelect}
                        min={new Date().toISOString().split('T')[0]} 
                        style={inputStyle}
                    />
                    
                    {selectedDate && (
                        <>
                            {/* 4. Вибір Часу */}
                            <h3 style={{ ...sectionTitleStyle, color: '#333' }}>Оберіть Час</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {availableTimes.map(time => (
                                    <button
                                        key={time}
                                        style={selectedTime === time ? selectedSlotStyle : availableSlotStyle}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* 5. Кнопка Запису (показується при повному виборі) */}
            {selectedMaster && selectedDate && selectedTime && (
                <button 
                    onClick={handleBookNow} 
                    style={bookButtonStyle}
                >
                    ПІДТВЕРДИТИ ЗАПИС НА {selectedTime}
                </button>
            )}
        </div>
    );
};

export default ServiceDetail;