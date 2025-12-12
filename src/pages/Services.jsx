import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Service.css';
import { getServicesApi } from '../api/services';

const Services = ({ onCartUpdate, openInfoModal }) => {
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setLoadError('');
                const data = await getServicesApi();
                setServices(data || []);
            } catch (e) {
                console.error(e);
                setLoadError('Не вдалося завантажити послуги. Спробуйте пізніше.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const categories = useMemo(() => {
        const base = [{ value: 'all', label: 'Усі послуги' }];

        const fromServices = Array.from(
            new Map(
                services
                    .map((s) => {
                        const name =
                            s.category?.name || s.categoryName || s.category || 'Інше';
                        const id = s.categoryId ?? name;
                        return [String(id), { value: String(id), label: name }];
                    })
                    .filter(Boolean)
            ).values()
        );

        return [...base, ...fromServices];
    }, [services]);

    const filteredServices = useMemo(() => {
        let current = services;

        if (selectedCategory !== 'all') {
            current = current.filter(
                (service) =>
                    String(service.categoryId ?? service.category?.id) ===
                    String(selectedCategory)
            );
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            current = current.filter(
                (service) =>
                    service.name.toLowerCase().includes(q) ||
                    (service.description || '').toLowerCase().includes(q)
            );
        }

        const min = minPrice ? parseInt(minPrice, 10) : 0;
        const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;

        current = current.filter(
            (service) => service.price >= min && service.price <= max
        );

        return current;
    }, [services, selectedCategory, searchTerm, minPrice, maxPrice]);

    const handleAddToCart = (e, service) => {
        e.preventDefault();
        const added = addToCart(service);

        if (openInfoModal) {
            if (added) {
                openInfoModal({
                    title: 'Додано до кошика',
                    message: `Послуга «${service.name}» додана до вашого кошика.`,
                });
            } else {
                openInfoModal({
                    title: 'Послуга вже в кошику',
                    message: `Послуга «${service.name}» вже є у вашому кошику.`,
                });
            }
        }

        if (onCartUpdate) {
            onCartUpdate();
        }
    };

    return (
        <div className="services-page-background">
            <div className="container animate services-page">
                <h1 className="services-title">Наші Послуги</h1>
                <p className="services-subtitle">
                    Оберіть свою процедуру, щоб стати ще чарівнішою.
                </p>

                <div className="services-filter-panel">
                    <h2 className="services-filter-title">Фільтри</h2>

                    <div className="services-filter-block">
                        <span className="services-input-label">Оберіть категорію:</span>
                        <div className="services-categories">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`services-category-btn${
                                        selectedCategory === cat.value ? ' active' : ''
                                    }`}
                                    onClick={() => setSelectedCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="services-filter-block">
                        <label htmlFor="services-search" className="services-input-label">
                            Пошук за назвою:
                        </label>
                        <input
                            id="services-search"
                            type="text"
                            placeholder="Стрижка, манікюр, фарбування..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="services-input"
                        />
                    </div>

                    <div className="services-price-row">
                        <div className="services-price-field">
                            <label htmlFor="minPrice" className="services-input-label">
                                Ціна від (грн):
                            </label>
                            <input
                                id="minPrice"
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="services-input"
                            />
                        </div>

                        <div className="services-price-field">
                            <label htmlFor="maxPrice" className="services-input-label">
                                Ціна до (грн):
                            </label>
                            <input
                                id="maxPrice"
                                type="number"
                                placeholder="3000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="services-input"
                            />
                        </div>
                    </div>
                </div>

                {loading && <p className="services-loading">Завантаження послуг...</p>}
                {loadError && <p className="services-error">{loadError}</p>}

                {!loading && !loadError && (
                    <>
                        <div className="services-grid">
                            {filteredServices.map((service) => (
                                <Link
                                    to={`/service/${service.slug}`}
                                    key={service.id}
                                    className="services-card"
                                >
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="services-card-image"
                                    />
                                    <div className="services-card-content">
                                        <div className="services-card-meta">
                      <span className="services-card-category">
                        {service.category?.name ||
                            service.categoryName ||
                            ''}
                      </span>
                                            <span className="services-card-price">
                        {service.price} грн
                      </span>
                                        </div>
                                        <h3 className="services-card-name">{service.name}</h3>
                                        <p className="services-card-description">
                                            {(service.description || '').substring(0, 70)}...
                                        </p>

                                        <button
                                            type="button"
                                            className="services-cart-btn"
                                            onClick={(e) => handleAddToCart(e, service)}
                                        >
                                            Додати до кошика
                                        </button>

                                        <div className="services-detail-btn">
                                            Деталі та запис
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredServices.length === 0 && (
                            <p className="services-empty">
                                На жаль, не знайдено послуг за вказаними критеріями фільтрації.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Services;
