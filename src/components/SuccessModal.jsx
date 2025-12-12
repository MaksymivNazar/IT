import React from 'react';

const PALETTE = { 
    primary: '#B76E79',
    secondary: '#D4B097',
    textDark: '#333333',
    textLight: '#F5F5F5',
    error: '#C62828',
    success: '#4CAF50',
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4000, 
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
};

const modalContentStyle = {
    backgroundColor: PALETTE.background,
    padding: '40px 30px',
    borderRadius: '15px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    transform: 'scale(1.0)',
    transition: 'transform 0.3s ease-out',
};

const iconContainerStyle = {
    marginBottom: '20px',
};

const successIconStyle = {
    fontSize: '4.5rem',
    color: PALETTE.success, // Використовуємо професійний зелений
};

const titleStyle = {
    color: PALETTE.primary, 
    marginBottom: '15px',
    fontWeight: '700',
    fontSize: '1.8rem',
};

const messageStyle = {
    color: PALETTE.textDark,
    marginBottom: '20px',
    lineHeight: 1.5,
    fontSize: '1rem',
};

const detailsContainerStyle = {
    background: PALETTE.secondary + '20',
    padding: '15px 25px',
    borderRadius: '10px',
    marginBottom: '30px',
    textAlign: 'left',
    borderLeft: `5px solid ${PALETTE.primary}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
};

const detailRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 0',
    borderBottom: `1px dashed ${PALETTE.secondary}`,
};

const labelStyle = {
    fontWeight: 'bold',
    color: PALETTE.textDark,
    minWidth: '100px',
};

const valueStyle = {
    fontWeight: 'bold',
    color: PALETTE.primary,
    textAlign: 'right',
};

const okButtonStyle = {
    background: PALETTE.primary, 
    color: PALETTE.textLight,
    border: 'none',
    padding: '14px 30px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const SuccessModal = ({ data, onClose }) => {
    if (!data) return null;
    const isCancellation = data.type === 'cancellation';
    const mainTitle = isCancellation ? 'Скасування Успішне' : 'Запис Успішно Оформлено!';
    const userMessage = isCancellation 
        ? `Дякуємо, **${data.user}**. Ваш візит було скасовано.`
        : `Вітаємо, **${data.user}**! Ви записані на:`;


    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                
                <div style={iconContainerStyle}>
                    <i className="fas fa-check-circle" style={successIconStyle}></i>
                </div>
                
                <h3 style={titleStyle}>{mainTitle}</h3>
                
                <p style={messageStyle} dangerouslySetInnerHTML={{ __html: userMessage.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />

                {!isCancellation && (
                    <div style={detailsContainerStyle}>
                        <div style={detailRowStyle}>
                            <span style={labelStyle}>Послуга:</span> 
                            <span style={valueStyle}>{data.service}</span>
                        </div>
                        <div style={detailRowStyle}>
                            <span style={labelStyle}>Майстер:</span> 
                            <span style={valueStyle}>{data.master}</span>
                        </div>
                        <div style={detailRowStyle}>
                            <span style={labelStyle}>Дата:</span> 
                            <span style={valueStyle}>{data.date}</span>
                        </div>
                        <div style={{...detailRowStyle, borderBottom: 'none'}}> 
                            <span style={labelStyle}>Час:</span> 
                            <span style={valueStyle}>{data.time}</span>
                        </div>
                    </div>
                )}
                
                {/* Для скасування показуємо просте повідомлення, якщо воно є */}
                {isCancellation && data.message && (
                     <p style={{...messageStyle, marginBottom: '30px', fontWeight: 'bold'}}>{data.message}</p>
                )}


                <button onClick={onClose} style={okButtonStyle}>
                    {isCancellation ? 'Закрити' : 'ПЕРЕЙТИ ДО ПРОФІЛЮ'}
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;