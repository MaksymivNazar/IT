// src/components/AppointmentCard.jsx

import React from 'react';
import { mastersData } from '../pages/Auth'; 
import { PALETTE, STYLES } from '../pages/Profile'; 

// URL-плейсхолдер для майстра, якщо фото не знайдено
const defaultMasterImage = 'https://i.ibb.co/6y4V83V/default-master.png';

const AppointmentCard = ({ app, onCancelAttempt, isCancellable }) => {
    const master = mastersData.find(m => String(m.id) === String(app.masterId));
    const masterImage = master?.image || defaultMasterImage;
    
    // Кастомні стилі для картки (використовують PALETTE та STYLES)
    const cardStyles = {
        // Контейнер з сіткою: Фото (80px) | Деталі (1fr) | Статус (auto)
        container: {
            background: PALETTE.background,
            border: `1px solid ${PALETTE.secondary}`,
            borderRadius: '12px',
            marginBottom: '20px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '80px 1fr auto', 
            alignItems: 'start', 
            gap: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s',
        },
        photo: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `3px solid ${PALETTE.primary}`,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingTop: '5px',
        },
        statusWrapper: {
            alignSelf: 'flex-start', 
            paddingTop: '5px',
        }
    };

    return (
        <div style={cardStyles.container}>
            
            {/* 1. Фото Майстра */}
            <div>
                <img 
                    src={masterImage} 
                    alt={app.master?.name || 'Майстер'} 
                    style={cardStyles.photo} 
                />
            </div>
            
            {/* 2. Деталі Запису (ЧИСТИЙ ТЕКСТ ТА СТИЛІ) */}
            <div style={cardStyles.details}>
                {/* Назва Послуги */}
                <h3 style={{...STYLES.appointmentTitle, margin: '0', color: PALETTE.textDark, fontSize: '1.3rem'}}>
                    {app.service?.name || app.service} 
                </h3>
                
                {/* Дата та Час */}
                <p style={{...STYLES.appointmentInfo, fontSize: '1rem'}}>
                    <span style={{color: PALETTE.primary, fontWeight: 'bold', marginRight: '5px'}}>Дата:</span> <b>{app.date}</b>, 
                    <span style={{color: PALETTE.primary, fontWeight: 'bold', marginLeft: '15px', marginRight: '5px'}}>Час:</span> <b>{app.time}</b>
                </p>
                
                {/* Майстер */}
                <p style={{...STYLES.appointmentInfo, fontSize: '1rem'}}>
                    <span style={{color: PALETTE.primary, fontWeight: 'bold', marginRight: '5px'}}>Майстер:</span> 
                    <b style={{color: PALETTE.primary}}>{app.master?.name || app.master}</b>
                </p>
                
                {/* Ціна */}
                <p style={{ ...STYLES.appointmentInfo, fontWeight: 'bold', marginTop: '5px' }}>
                    <span style={{color: PALETTE.primary, marginRight: '5px'}}>Ціна:</span> 
                    <b style={{ color: PALETTE.primary, fontSize: '1.2rem' }}>{app.service?.price} грн</b>
                </p>

                {/* Блок Скасування */}
                {app.statusText === 'Скасовано' ? (
                    <p style={{ ...STYLES.cancellationImpossibleText, color: PALETTE.error, fontSize: '0.9rem', marginTop: '10px', textAlign: 'left' }}>
                        **Скасовано користувачем**
                    </p>
                ) : isCancellable ? (
                    <button 
                        onClick={() => onCancelAttempt(app.id)}
                        style={{ ...STYLES.baseButton, ...STYLES.cancelAppointmentButton, marginTop: '10px', alignSelf: 'flex-start', padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                        Скасувати Запис
                    </button>
                ) : (
                    <p style={{ ...STYLES.cancellationImpossibleText, color: PALETTE.error, fontSize: '0.9rem', marginTop: '10px', textAlign: 'left' }}>
                        Скасування неможливе (менше 4 год до візиту)
                    </p>
                )}
            </div>
            
            {/* 3. Статус */}
            <div style={cardStyles.statusWrapper}>
                <span style={{
                    ...STYLES.appointmentStatus(app.statusText), 
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    minWidth: '110px',
                    textAlign: 'center',
                }}>{app.statusText}</span>
            </div>
        </div>
    );
};

export default AppointmentCard;