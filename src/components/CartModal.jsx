// src/components/CartModal.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД)

import React from 'react';
import { useNavigate } from 'react-router-dom';
// 🔥 ІМПОРТ ФУНКЦІЙ: Потрібні для видалення та очищення кошика послуг (припускаємо, що вони в Auth)
import { removeFromCart, clearCart } from '../pages/Auth'; 


// 🚨 onCartUpdate - це функція, яка оновлює лічильник у Header
const CartModal = ({ isOpen, onClose, cartItems, onCartUpdate }) => { 
    const navigate = useNavigate();
    // onRemoveItem та onCheckout замінено на внутрішню логіку, 
    // щоб CartModal міг сам викликати оновлення лічильника через onCartUpdate
    if (!isOpen) return null;

    const handleRemove = (itemId) => {
        removeFromCart(itemId);
        // 🔥 Оновлюємо лічильник після видалення
        if (onCartUpdate) { 
            onCartUpdate(); 
        }
    };
    
    const handleClearCart = () => {
        clearCart();
        if (onCartUpdate) {
            onCartUpdate();
        }
    }

    const handleCheckout = () => {
        onClose();
        // Переходимо на сторінку загального запису, де можна обрати майстра/дату
        navigate('/appointment'); 
    };

    const handleReturnToShop = () => {
        onClose();
        navigate('/services'); 
    };
    
    // Розрахунок загальної ціни послуг
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h2 style={{ color: 'white', fontWeight: 600 }}>Кошик ({cartItems.length})</h2>
                    <button onClick={onClose} style={closeButtonStyle}>✕ Закрити</button>
                </div>
                
                {cartItems.length === 0 ? (
                    // Стан "Кошик порожній"
                    <div style={emptyStateStyle}>
                        <div style={emptyIconStyle}>
                            {/* ВИПРАВЛЕНО: Замінено Font Awesome на емодзі для надійності */}
                            <span style={{...cartIconStyle, fontSize: '5.5rem'}}>🛍️</span>
                            {/* Приховано непотрібний хрестик */}
                            <i className="fas fa-times" style={timesIconStyle}></i>
                        </div>
                        <p style={emptyMessageStyle}>У кошику немає послуг для запису.</p>
                        
                        <button onClick={handleReturnToShop} style={returnToShopButtonStyle}> 
                            ПЕРЕГЛЯНУТИ ПОСЛУГИ
                        </button>
                        
                        <div style={onlineBookingContainerStyle}>
                            <button onClick={handleReturnToShop} style={onlineBookingButtonStyle}>
                                ОНЛАЙН ЗАПИС
                            </button>
                        </div>
                    </div>
                ) : (
                    // Стан "Послуги є в кошику"
                    <div style={fullStateStyle}>
                        <h3 style={{color: 'white', marginBottom: '15px'}}>Обрані послуги:</h3>
                        
                        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px', flexShrink: 0 }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={cartItemStyle}>
                                    {/* Додано зображення, якщо воно є в даних послуги */}
                                    {item.image && <img src={item.image} alt={item.name} style={itemImageStyle} />} 
                                    
                                    <div style={{flexGrow: 1}}>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
                                        <p style={{ margin: '5px 0 0', color: '#d81b60', fontWeight: 'bold' }}>
                                            {item.price} грн
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(item.id)} 
                                        style={removeItemButtonStyle}
                                        title="Видалити послугу"
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {/* Підсумок */}
                        <div style={{ borderTop: '1px solid #555', paddingTop: '15px', marginTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span>Разом:</span>
                                <span style={{ color: '#d81b60' }}>{totalPrice} грн</span>
                            </div>
                        </div>
                        
                        {/* Кнопки Оформлення */}
                        <div style={{marginTop: 'auto', paddingBottom: '20px'}}>
                            <button onClick={handleCheckout} style={checkoutButtonStyle}>
                                ПЕРЕЙТИ ДО ЗАПИСУ
                            </button>
                            <button onClick={handleClearCart} style={{...checkoutButtonStyle, background: '#777', marginTop: '10px'}}>
                                ОЧИСТИТИ КОШИК
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Стилі для CartModal.jsx (ЗБЕРЕЖЕННЯ ВАШИХ СТИЛІВ + ДОДАВАННЯ НЕОБХІДНИХ) ---
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 3000, 
};

const modalContentStyle = {
    backgroundColor: '#1a1a1a', 
    width: '400px', 
    maxWidth: '100%',
    height: '100%',
    boxShadow: '-5px 0 20px rgba(0,0,0,0.5)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #444',
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    opacity: 0.8,
};

const emptyStateStyle = {
    padding: '50px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    gap: '25px', 
};

const emptyIconStyle = {
    width: '100px',
    height: '100px',
    marginBottom: '20px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const cartIconStyle = {
    color: '#333', 
    opacity: 0.7, 
};

const timesIconStyle = { 
    display: 'none', // Приховуємо, оскільки використовуємо єдиний емодзі
};


const emptyMessageStyle = {
    color: '#ddd',
    fontSize: '1.2rem',
    marginBottom: '30px',
};

const returnToShopButtonStyle = {
    background: '#6d6a66', 
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    marginBottom: '20px',
};

const onlineBookingContainerStyle = {
    marginTop: 'auto',
    width: '100%',
    textAlign: 'center',
    paddingBottom: '20px',
};

const onlineBookingButtonStyle = {
    background: '#777', 
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    width: '90%', 
    maxWidth: '300px',
};

const fullStateStyle = {
    padding: '20px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};

const cartItemStyle = { 
    background: '#333', 
    padding: '15px', 
    borderRadius: '8px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    color: 'white' 
};

const itemImageStyle = {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '15px',
    flexShrink: 0,
};

const removeItemButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    fontSize: '1.2rem',
    cursor: 'pointer',
};

const checkoutButtonStyle = {
    marginTop: 'auto', 
    background: '#d81b60',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
    width: '100%',
};

export default CartModal;