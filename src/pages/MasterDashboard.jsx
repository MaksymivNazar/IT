// src/pages/MasterDashboard.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД З InfoModal)

import React, { useState } from 'react';
import { mastersData } from '../pages/Auth'; // 🔥 ІМПОРТ ДАНИХ МАЙСТРІВ

// Допоміжна функція для пошуку даних Майстра
const findMasterData = (userId) => mastersData.find(m => String(m.userId) === String(userId));

// =================================================================
// ✨ ДИЗАЙН: СТИЛІ ДЛЯ ДАШБОРДУ МАЙСТРА
// =================================================================

const PALETTE = {
    primary: '#d81b60',
    secondary: '#333333',
    background: '#f8f8f8',
    cardBackground: '#ffffff',
    textLight: '#f0f0f0',
};

const pageStyle = {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gap: '30px',
    gridTemplateAreas: `'profile appointments' 'schedule appointments'`,
    gridTemplateColumns: '1fr 2fr',
    backgroundColor: PALETTE.background,
    minHeight: '80vh',
    fontFamily: 'Arial, sans-serif',
};

const cardStyle = {
    background: PALETTE.cardBackground,
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    textAlign: 'left',
};

const sectionTitleStyle = {
    color: PALETTE.primary,
    marginBottom: '25px',
    fontSize: '1.5rem',
    borderBottom: `2px solid ${PALETTE.primary}`,
    paddingBottom: '10px',
};

const appointmentCardStyle = {
    background: '#fff',
    borderLeft: `5px solid ${PALETTE.primary}`,
    padding: '15px 20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const scheduleGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    fontSize: '1rem',
};

const dayHeaderStyle = {
    fontWeight: 'bold',
    color: PALETTE.secondary,
    padding: '10px 0',
    borderBottom: `2px solid ${PALETTE.background}`,
    textAlign: 'center',
};

// =================================================================
// ✨ КОМПОНЕНТ DASHBOARD
// =================================================================

// 🚨 КРИТИЧНЕ ВИПРАВЛЕННЯ: Додаємо openInfoModal у пропси
const MasterDashboard = ({ user, appointments, openInfoModal }) => { 
    // Перевіряємо, чи має користувач права майстра та дані
    if (user.role !== 'master') return <h2>Доступ заборонено.</h2>;

    const masterProfile = findMasterData(user.id); 
    
    // Якщо дані майстра не знайдені, виводимо заглушку або помилку
    if (!masterProfile) return <h2 style={{ padding: '50px', textAlign: 'center' }}>Помилка: Профіль майстра не знайдено.</h2>;

    // 1. Імітація графіка роботи (поки немає бекенду)
    const [schedule, setSchedule] = useState({
        Monday: { start: '10:00', end: '19:00', isWorking: true },
        Tuesday: { start: '10:00', end: '19:00', isWorking: true },
        Wednesday: { start: '10:00', end: '19:00', isWorking: false }, // Вихідний
        Thursday: { start: '10:00', end: '19:00', isWorking: true },
        Friday: { start: '10:00', end: '19:00', isWorking: true },
        Saturday: { start: '11:00', end: '16:00', isWorking: true },
        Sunday: { start: '11:00', end: '16:00', isWorking: false },
    });

    const handleScheduleChange = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value },
        }));
    };

    const handleToggleWorking = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], isWorking: !prev[day].isWorking },
        }));
    };
    
    // 🔥 ФУНКЦІЯ ЗБЕРЕЖЕННЯ ГРАФІКА
    const handleSaveSchedule = () => {
        // Тут буде логіка збереження на бекенд...
        
        // 🔥 ВИКОРИСТОВУЄМО InfoModal ЗАМІСТЬ alert()
        if (openInfoModal) {
            openInfoModal({
                title: "Графік збережено! ✅",
                message: "Ваші зміни в графіку роботи успішно оновлено.",
                icon: '🗓️'
            });
        }
    };

    const daysOfWeek = Object.keys(schedule);

    return (
        <div className="container animate" style={pageStyle}>
            
            {/* 1. Картка Профілю */}
            <div style={{ ...cardStyle, gridArea: 'profile', textAlign: 'center' }}>
                <img 
                    src={masterProfile.image} 
                    alt={masterProfile.name} 
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px', border: `3px solid ${PALETTE.primary}` }} 
                />
                <h2 style={{ color: PALETTE.secondary, margin: '10px 0' }}>{masterProfile.name}</h2>
                <p style={{ color: PALETTE.primary, fontWeight: 'bold', margin: '0 0 20px 0' }}>{masterProfile.role}</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{masterProfile.about}</p>
                <p style={{ marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>Рейтинг: {masterProfile.rating} ⭐</p>
            </div>

            {/* 2. Картка Майбутніх Записів */}
            <div style={{ ...cardStyle, gridArea: 'appointments' }}>
                <h3 style={sectionTitleStyle}>Майбутні Записи ({appointments.length})</h3>
                {appointments.length > 0 ? (
                    appointments.map(app => (
                        <div key={app.id} style={appointmentCardStyle}>
                            <div>
                                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: PALETTE.secondary }}>
                                    {app.serviceName}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                                    🗓️ {app.date} о ⏰ {app.time}
                                </p>
                            </div>
                            <span style={{ fontWeight: 'bold', color: PALETTE.primary }}>
                                {app.clientName || 'Клієнт'}
                            </span>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                        🎉 На сьогодні немає запланованих записів.
                    </p>
                )}
            </div>
            
            {/* 3. Картка Редагування Графіка */}
            <div style={{ ...cardStyle, gridArea: 'schedule' }}>
                <h3 style={sectionTitleStyle}>Редагування Графіка</h3>
                <div style={scheduleGridStyle}>
                    {/* Заголовки */}
                    <span style={dayHeaderStyle}>День</span>
                    <span style={dayHeaderStyle}>Робочий</span>
                    <span style={dayHeaderStyle}>Початок</span>
                    <span style={dayHeaderStyle}>Кінець</span>

                    {/* Рядки для кожного дня */}
                    {daysOfWeek.map(day => (
                        <React.Fragment key={day}>
                            <span style={{ padding: '10px 0', borderBottom: '1px dotted #f0f0f0', fontWeight: 'bold' }}>
                                {day}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px dotted #f0f0f0' }}>
                                <input
                                    type="checkbox"
                                    checked={schedule[day].isWorking}
                                    onChange={() => handleToggleWorking(day)}
                                />
                            </div>
                            
                            {schedule[day].isWorking ? (
                                <React.Fragment>
                                    <input 
                                        type="time" 
                                        value={schedule[day].start} 
                                        onChange={(e) => handleScheduleChange(day, 'start', e.target.value)} 
                                        style={{ borderBottom: '1px dotted #f0f0f0', padding: '5px' }}
                                    />
                                    <input 
                                        type="time" 
                                        value={schedule[day].end} 
                                        onChange={(e) => handleScheduleChange(day, 'end', e.target.value)} 
                                        style={{ borderBottom: '1px dotted #f0f0f0', padding: '5px' }}
                                    />
                                </React.Fragment>
                            ) : (
                                <span style={{ color: '#aaa', gridColumn: 'span 2', padding: '10px 0', borderBottom: '1px dotted #f0f0f0' }}>Вихідний</span>
                            )}
                        </React.Fragment>
                    ))}
                    
                    <button 
                        className="btn" 
                        style={{ marginTop: '20px', background: '#d81b60', gridColumn: 'span 4' }} 
                        // 🔥 ВИКЛИКАЄМО НОВУ ФУНКЦІЮ handleSaveSchedule
                        onClick={handleSaveSchedule} 
                    >
                        Зберегти Графік
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MasterDashboard;