import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getServicesApi } from '../api/services';
import { getMastersApi } from '../api/masters';

const SearchModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState([]);
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        const loadData = async () => {
            try {
                setLoading(true);
                setError('');
                const [mastersRes, servicesRes] = await Promise.all([
                    getMastersApi(),
                    getServicesApi(),
                ]);
                setMasters(mastersRes || []);
                setServices(servicesRes || []);
            } catch (e) {
                setError(e.message || 'Помилка завантаження даних для пошуку');
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const searchResults = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (query.length < 2) return { masters: [], services: [] };

        const mastersResults = masters
            .filter(
                (master) =>
                    master.name?.toLowerCase().includes(query) ||
                    master.role?.toLowerCase().includes(query),
            )
            .slice(0, 5)
            .map((m) => ({
                id: m.id,
                name: m.name,
                role: m.role,
                type: 'master',
                link: `/master/${m.id}`,
            }));

        const servicesResults = services
            .filter(
                (service) =>
                    service.name?.toLowerCase().includes(query) ||
                    service.description?.toLowerCase().includes(query) ||
                    service.category?.toLowerCase().includes(query),
            )
            .slice(0, 5)
            .map((s) => ({
                id: s.id,
                name: s.name,
                price: s.price,
                type: 'service',
                link: `/service/${s.slug}`,
            }));

        return { masters: mastersResults, services: servicesResults };
    }, [searchTerm, masters, services]);

    const handleResultClick = () => {
        onClose();
    };

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '10vh',
        zIndex: 2000,
    };

    const modalContentStyle = {
        backgroundColor: '#333',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
        maxWidth: '650px',
        width: '90%',
        position: 'relative',
        maxHeight: '70vh',
        overflowY: 'auto',
    };

    const inputStyle = {
        padding: '15px 20px',
        border: '1px solid #d81b60',
        borderRadius: '8px',
        fontSize: '1.2rem',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '20px',
        background: '#444',
        color: 'white',
    };

    const sectionTitleStyle = {
        color: '#d81b60',
        borderBottom: '1px solid #555',
        paddingBottom: '10px',
        marginTop: '15px',
        marginBottom: '15px',
        fontSize: '1.2rem',
    };

    const resultItemStyle = {
        padding: '12px',
        background: '#444',
        borderRadius: '6px',
        marginBottom: '8px',
        transition: 'background 0.2s',
        display: 'block',
        textDecoration: 'none',
        color: 'white',
    };

    const resultItemHoverStyle = {
        background: '#d81b60',
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        color: '#ccc',
        cursor: 'pointer',
    };

    const renderResults = () => {
        if (loading) {
            return (
                <p style={{ color: '#ccc', textAlign: 'center' }}>
                    Завантаження даних...
                </p>
            );
        }

        if (error) {
            return (
                <p style={{ color: '#ff6b6b', textAlign: 'center' }}>
                    {error}
                </p>
            );
        }

        const { masters: mastersResults, services: servicesResults } =
            searchResults;
        const totalResults =
            mastersResults.length + servicesResults.length;

        if (searchTerm.trim().length < 2) {
            return (
                <p style={{ color: '#ccc', textAlign: 'center' }}>
                    Введіть мінімум 2 символи для початку пошуку.
                </p>
            );
        }

        if (totalResults === 0) {
            return (
                <p style={{ color: '#ccc', textAlign: 'center' }}>
                    За запитом "{searchTerm}" нічого не знайдено.
                </p>
            );
        }

        return (
            <div>
                {mastersResults.length > 0 && (
                    <>
                        <h4 style={sectionTitleStyle}>
                            Майстри ({mastersResults.length})
                        </h4>
                        {mastersResults.map((m) => (
                            <Link
                                to={m.link}
                                key={`m-${m.id}`}
                                style={resultItemStyle}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        resultItemHoverStyle.background)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        resultItemStyle.background)
                                }
                                onClick={handleResultClick}
                            >
                                <strong>🧑‍🎨 {m.name}</strong> —{' '}
                                <span style={{ color: '#ccc' }}>
                                    {m.role}
                                </span>
                            </Link>
                        ))}
                    </>
                )}

                {servicesResults.length > 0 && (
                    <>
                        <h4 style={sectionTitleStyle}>
                            Послуги ({servicesResults.length})
                        </h4>
                        {servicesResults.map((s) => (
                            <Link
                                to={s.link}
                                key={`s-${s.id}`}
                                style={resultItemStyle}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        resultItemHoverStyle.background)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        resultItemStyle.background)
                                }
                                onClick={handleResultClick}
                            >
                                💅 <strong>{s.name}</strong> —{' '}
                                <span style={{ color: '#ffc107' }}>
                                    {s.price} грн
                                </span>
                            </Link>
                        ))}
                    </>
                )}
            </div>
        );
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div
                style={modalContentStyle}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} style={closeButtonStyle}>
                    ✕
                </button>
                <h3
                    style={{
                        color: 'white',
                        marginBottom: '20px',
                        textAlign: 'center',
                    }}
                >
                    Пошук послуг та майстрів
                </h3>

                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Введіть назву послуги чи ім'я майстра..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={inputStyle}
                        autoFocus
                    />
                </form>

                <div
                    style={{
                        maxHeight: 'calc(70vh - 180px)',
                        overflowY: 'auto',
                        paddingRight: '10px',
                    }}
                >
                    {renderResults()}
                </div>

                <p
                    style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: '#ccc',
                    }}
                >
                    Натисніть ESC або поза вікном, щоб закрити
                </p>
            </div>
        </div>
    );
};

export default SearchModal;
