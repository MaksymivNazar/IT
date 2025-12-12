import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal';
import { getMastersApi } from '../api/masters';
import { getServicesApi } from '../api/services';
import '../styles/Header.css';

const Header = ({ user, cartCount, openCart }) => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState({ masters: [], services: [] });

    const [masters, setMasters] = useState([]);
    const [services, setServices] = useState([]);
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    const handleProfileClick = () => {
        navigate(user ? '/profile' : '/auth');
    };

    const handleCartClick = () => {
        if (openCart) {
            openCart();
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [mastersRes, servicesRes] = await Promise.all([
                    getMastersApi(),
                    getServicesApi(),
                ]);
                setMasters(mastersRes || []);
                setServices(servicesRes || []);
            } catch (e) {
                console.error('Помилка завантаження даних для пошуку в Header:', e);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            const query = searchQuery.toLowerCase().trim();

            const mastersFiltered = masters
                .filter(
                    (m) =>
                        m.name?.toLowerCase().includes(query) ||
                        m.role?.toLowerCase().includes(query),
                )
                .slice(0, 3);

            const servicesFiltered = services
                .filter(
                    (s) =>
                        s.name?.toLowerCase().includes(query) ||
                        s.description?.toLowerCase().includes(query) ||
                        s.category?.toLowerCase().includes(query),
                )
                .slice(0, 3);

            setSearchResults({
                masters: mastersFiltered,
                services: servicesFiltered,
            });
            setShowSearchResults(
                mastersFiltered.length > 0 || servicesFiltered.length > 0,
            );
        } else {
            setShowSearchResults(false);
        }
    }, [searchQuery, masters, services]);

    // Закриваємо результати при кліку поза пошуком
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            setIsSearchOpen(true);
        }
    };

    const handleSearchResultClick = (type, id, slug) => {
        setSearchQuery('');
        setShowSearchResults(false);
        if (type === 'service') {
            navigate(`/service/${slug}`);
        } else if (type === 'master') {
            navigate(`/master/${id}`);
        }
    };

    const iconTextStyle = {
        fontSize: '1.05rem',
        color: '#555',
        lineHeight: 1,
    };

    return (
        <>
            <header className="header">
                <div className="container header-wrapper">
                    <div className="logo">
                        <Link to="/" className="logo-link">
                            <img
                                src="/logo.png"
                                alt="TOP BEAUTY"
                                className="logo-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const fallback = e.target.nextElementSibling;
                                    if (fallback) {
                                        fallback.style.display = 'flex';
                                    }
                                }}
                            />
                            <div className="logo-fallback" style={{ display: 'none' }}>
                                <div className="logo-icon-fallback">
                                    <svg
                                        width="50"
                                        height="50"
                                        viewBox="0 0 50 50"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            cx="25"
                                            cy="18"
                                            r="6"
                                            fill="#FFD700"
                                            opacity="0.95"
                                        />
                                        <path
                                            d="M19 18 Q25 12 31 18 Q25 15 19 18"
                                            fill="#FFD700"
                                            opacity="0.95"
                                        />
                                        <path
                                            d="M15 15 Q12 10 10 12 Q12 14 15 15"
                                            stroke="#FFD700"
                                            strokeWidth="1.5"
                                            fill="none"
                                            opacity="0.9"
                                        />
                                        <path
                                            d="M35 15 Q38 10 40 12 Q38 14 35 15"
                                            stroke="#FFD700"
                                            strokeWidth="1.5"
                                            fill="none"
                                            opacity="0.9"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="1.5"
                                            fill="#FFD700"
                                            opacity="0.9"
                                        />
                                        <circle
                                            cx="38"
                                            cy="12"
                                            r="1.5"
                                            fill="#FFD700"
                                            opacity="0.9"
                                        />
                                    </svg>
                                </div>
                                <span className="logo-text">TOP BEAUTY</span>
                            </div>
                        </Link>
                    </div>

                    <nav>
                        <ul className="nav-links">
                            <li>
                                <Link to="/">Головна</Link>
                            </li>
                            <li>
                                <Link to="/services">Послуги</Link>
                            </li>
                            <li>
                                <Link to="/masters">Команда</Link>
                            </li>
                            <li>
                                <Link to="/gallery">Галерея</Link>
                            </li>
                            <li>
                                <Link to="/contact">Контакти</Link>
                            </li>
                            {user && user.role === 'master' && (
                                <li>
                                    <Link to="/master-dashboard">Дашборд</Link>
                                </li>
                            )}
                        </ul>
                    </nav>

                    <div className="icon-nav">
                        <div
                            onClick={handleProfileClick}
                            className="icon-item icon-item-light"
                            title={
                                user ? `Профіль: ${user.firstName}` : 'Увійти'
                            }
                        >
                            <span style={iconTextStyle}>👤</span>
                        </div>

                        <div
                            onClick={handleCartClick}
                            className="icon-item icon-item-light"
                            title="Кошик"
                        >
                            <span style={iconTextStyle}>🛍️</span>
                            {cartCount > 0 && (
                                <span className="icon-badge icon-badge-pink">
                                    {cartCount}
                                </span>
                            )}
                        </div>

                        <div
                            onClick={() => setIsSearchOpen(true)}
                            className="icon-item icon-item-light"
                            title="Розширений пошук"
                        >
                            <span style={iconTextStyle}>🔍</span>
                        </div>
                    </div>

                    <div
                        className="search-container"
                        ref={searchContainerRef}
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            className="search-form"
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="search-input"
                                placeholder="Пошук..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                onFocus={() => {
                                    if (searchQuery.trim().length >= 2) {
                                        setShowSearchResults(true);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                className="search-button"
                                title="Пошук"
                            >
                                🔍
                            </button>
                        </form>

                        {showSearchResults && (
                            <div className="search-results-dropdown">
                                {searchResults.masters.length > 0 && (
                                    <div className="search-results-section">
                                        <div className="search-results-title">
                                            Майстри
                                        </div>
                                        {searchResults.masters.map((master) => (
                                            <div
                                                key={master.id}
                                                className="search-result-item"
                                                onClick={() =>
                                                    handleSearchResultClick(
                                                        'master',
                                                        master.id,
                                                    )
                                                }
                                            >
                                                <span className="search-result-icon">
                                                    🧑‍🎨
                                                </span>
                                                <div className="search-result-content">
                                                    <div className="search-result-name">
                                                        {master.name}
                                                    </div>
                                                    <div className="search-result-desc">
                                                        {master.role}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {searchResults.services.length > 0 && (
                                    <div className="search-results-section">
                                        <div className="search-results-title">
                                            Послуги
                                        </div>
                                        {searchResults.services.map(
                                            (service) => (
                                                <div
                                                    key={service.id}
                                                    className="search-result-item"
                                                    onClick={() =>
                                                        handleSearchResultClick(
                                                            'service',
                                                            service.id,
                                                            service.slug,
                                                        )
                                                    }
                                                >
                                                    <span className="search-result-icon">
                                                        💅
                                                    </span>
                                                    <div className="search-result-content">
                                                        <div className="search-result-name">
                                                            {service.name}
                                                        </div>
                                                        <div className="search-result-desc">
                                                            {service.price} грн
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}

                                {searchResults.masters.length === 0 &&
                                    searchResults.services.length === 0 && (
                                        <div className="search-no-results">
                                            Нічого не знайдено
                                        </div>
                                    )}
                            </div>
                        )}
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
