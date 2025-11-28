// src/components/Header.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal'; 
import './Header.css';

// 🚨 ВИПРАВЛЕНО: Додано cartCount та openCart у пропси
const Header = ({ user, cartCount, openCart }) => { 
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false); 

    const handleProfileClick = () => {
        navigate(user ? '/profile' : '/auth');
    };
    
    // 🔥 ВИПРАВЛЕНО: Ця функція відкриває CartModal
    const handleCartClick = () => {
        if (openCart) {
            openCart();
        }
    };

    // Стиль для текстових іконок, щоб вони були помітними та візуально схожими на іконки.
    const iconTextStyle = {
        fontSize: '1.2rem',
        color: '#333', // Гарантуємо темний колір
        lineHeight: 1,
    };

    return (
        <>
            <header className="header">
                <div className="container header-wrapper">
                    <div className="logo">
                        <Link to="/">✨ TOP BEAUTY</Link>
                    </div>
                    
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/">Головна</Link></li>
                            <li><Link to="/services">Послуги</Link></li>
                            <li><Link to="/masters">Команда</Link></li>
                            <li><Link to="/gallery">Галерея</Link></li>
                            <li><Link to="/contact">Контакти</Link></li>
                            {/* Якщо користувач - майстер, показуємо дашборд */}
                            {user && user.role === 'master' && (
                                <li><Link to="/master-dashboard">Дашборд</Link></li>
                            )}
                        </ul>
                    </nav>
                    
                    {/* 🔥 БЛОК ІКОНОК (Світлі кола) */}
                    <div className="icon-nav">
                        
                        {/* 1. Іконка Профілю */}
                        <div onClick={handleProfileClick} className="icon-item icon-item-light" title={user ? `Профіль: ${user.firstName}` : 'Увійти'}>
                            <span style={iconTextStyle}>👤</span>
                            {/* Імітація індикатора входу */}
                            {user && <span className="icon-badge icon-badge-green"></span>}
                        </div>
                        
                        {/* 2. Іконка Кошика */}
                        <div onClick={handleCartClick} className="icon-item icon-item-light" title="Кошик">
                            <span style={iconTextStyle}>🛍️</span>
                            {/* 🔥 ВИПРАВЛЕНО: Відображаємо cartCount */}
                            {cartCount > 0 && <span className="icon-badge icon-badge-pink">{cartCount}</span>}
                        </div>
                        
                        {/* 3. Іконка Пошуку */}
                        <div onClick={() => setIsSearchOpen(true)} className="icon-item icon-item-light" title="Пошук">
                            <span style={iconTextStyle}>🔍</span>
                        </div>
                        
                    </div>
                </div>
            </header>
            
            <SearchModal 
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
};
export default Header;