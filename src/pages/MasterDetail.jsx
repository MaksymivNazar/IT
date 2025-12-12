import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMasterByIdApi } from '../api/masters';
import { fetchServicesByMaster } from '../api/services';
import { addToCart } from '../api/cart';
import '../styles/MasterDetail.css';

const MasterDetail = ({ onCartUpdate, openInfoModal }) => {
    const { masterId } = useParams();
    const navigate = useNavigate();

    const [master, setMaster] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');

            try {
                const [masterData, servicesData] = await Promise.all([
                    getMasterByIdApi(masterId),
                    fetchServicesByMaster(masterId),
                ]);

                setMaster(masterData);
                setServices(servicesData);
            } catch (err) {
                setError(err.message || 'Помилка завантаження даних майстра');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [masterId]);

    const handleAddToCart = (service) => {
        const added = addToCart(service);

        if (added) {
            if (openInfoModal) {
                openInfoModal({
                    title: 'Додано до кошика 🛍️',
                    message: `Послугу «${service.name}» додано до кошика.`,
                    type: 'success',
                });
            }
            if (onCartUpdate) onCartUpdate();
        } else {
            if (openInfoModal) {
                openInfoModal({
                    title: 'Послуга вже в кошику',
                    message: `Послуга «${service.name}» вже є в кошику.`,
                    type: 'info',
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="master-detail-wrapper">
                <div className="master-detail-page container animate">
                    <p className="master-detail-status">Завантаження даних майстра...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="master-detail-wrapper">
                <div className="master-detail-page container animate">
                    <p className="master-detail-error">{error}</p>
                    <button
                        type="button"
                        className="master-detail-back-btn"
                        onClick={() => navigate('/masters')}
                    >
                        До команди
                    </button>
                </div>
            </div>
        );
    }

    if (!master) {
        return (
            <div className="master-detail-wrapper">
                <div className="master-detail-page container animate">
                    <h1 className="master-detail-not-found-title">Майстра не знайдено 😢</h1>
                    <p className="master-detail-not-found-text">
                        Перевірте посилання або поверніться на сторінку команди.
                    </p>
                    <button
                        type="button"
                        className="master-detail-back-btn"
                        onClick={() => navigate('/masters')}
                    >
                        До команди
                    </button>
                </div>
            </div>
        );
    }

    const name =
        master.fullName || master.name || master.user?.email || 'Майстер салону';

    const role =
        master.specialization || master.position || 'Майстер салону';

    const about =
        master.description ||
        'Спеціаліст високого рівня у своїй галузі. Використовує сучасні техніки та якісні матеріали.';

    const experienceText = master.experienceYears
        ? `${master.experienceYears} років досвіду`
        : 'Досвід не вказано';

    const ratingText =
        typeof master.rating === 'number'
            ? `${master.rating.toFixed(1)} / 5.0`
            : 'Оцінка буде додана згодом';

    const photo =
        master.photoUrl ||
        master.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name,
        )}&background=B76E79&color=fff&bold=true&size=256`;

    return (
        <div className="master-detail-wrapper">
            <div className="master-detail-page container animate">
                <div className="master-detail-header">
                    <img
                        src={photo}
                        alt={name}
                        className="master-detail-photo"
                    />

                    <div className="master-detail-info">
                        <h1 className="master-detail-name">{name}</h1>
                        <h2 className="master-detail-role">{role}</h2>

                        <p className="master-detail-about">{about}</p>

                        <div className="master-detail-meta">
                            <p>
                                <span className="master-detail-meta-label">⭐ Рейтинг:</span>{' '}
                                {ratingText}
                            </p>
                            <p>
                                <span className="master-detail-meta-label">📅 Досвід:</span>{' '}
                                {experienceText}
                            </p>
                            {master.phone && (
                                <p>
                                    <span className="master-detail-meta-label">📞 Телефон:</span>{' '}
                                    {master.phone}
                                </p>
                            )}
                            {master.email && (
                                <p>
                                    <span className="master-detail-meta-label">✉️ Email:</span>{' '}
                                    {master.email}
                                </p>
                            )}
                            {master.user?.email && !master.email && (
                                <p>
                                    <span className="master-detail-meta-label">✉️ Email:</span>{' '}
                                    {master.user.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <h2 className="master-detail-section-title">
                    Послуги, які надає {name} ({services.length})
                </h2>

                <div className="master-detail-services">
                    {services.length > 0 ? (
                        services.map((service) => (
                            <div
                                key={service.id}
                                className="master-detail-service-card"
                            >
                                <div className="master-detail-service-main">
                                    <h4 className="master-detail-service-name">
                                        {service.name}
                                    </h4>
                                    <p className="master-detail-service-description">
                                        {service.description
                                            ? service.description.length > 100
                                                ? `${service.description.slice(0, 100)}...`
                                                : service.description
                                            : 'Опис послуги буде додано пізніше.'}
                                    </p>
                                </div>
                                <div className="master-detail-service-meta">
                                    <p className="master-detail-service-price">
                                        {service.price} грн
                                    </p>
                                    <button
                                        type="button"
                                        className="master-detail-book-btn"
                                        onClick={() => handleAddToCart(service)}
                                    >
                                        Записатися / Кошик
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="master-detail-empty-services">
                            На жаль, послуги для цього майстра не знайдено.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MasterDetail;
