import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMastersApi } from '../api/masters';
import '../styles/Masters.css';

const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMastersApi();
                setMasters(data);
            } catch (err) {
                setError(err.message || 'Помилка завантаження майстрів');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="masters-wrapper">
                <div className="masters-page">
                    <p className="masters-status">Завантаження майстрів...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="masters-wrapper">
                <div className="masters-page">
                    <p className="masters-error">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="masters-wrapper">
            <div className="masters-page">
                <h1 className="masters-title">Наша Команда</h1>
                <p className="masters-subtitle">
                    Познайомтеся з нашими найкращими фахівцями.
                </p>

                <div className="masters-grid">
                    {masters.map((master) => {
                        const name =
                            master.fullName || master.name || master.user?.email || 'Майстер салону';

                        const role =
                            master.specialization || master.position || 'Майстер салону';

                        const about = master.description || '';

                        const rating =
                            typeof master.rating === 'number' ? master.rating : null;

                        const image =
                            master.photoUrl ||
                            master.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                name,
                            )}&background=B76E79&color=fff&bold=true&size=256`;

                        return (
                            <Link
                                to={`/master/${master.id}`}
                                key={master.id}
                                className="master-card"
                            >
                                <img
                                    src={image}
                                    alt={name}
                                    className="master-card__image"
                                />
                                <div className="master-card__content">
                                    <h3 className="master-card__name">{name}</h3>
                                    <p className="master-card__role">{role}</p>
                                    <p className="master-card__about">
                                        {about
                                            ? about.length > 80
                                                ? `${about.slice(0, 80)}...`
                                                : about
                                            : 'Деталі про майстра будуть доступні найближчим часом.'}
                                    </p>
                                    <div className="master-card__rating">
                                        {rating ? (
                                            <>
                                                ⭐ {rating.toFixed(1)} / 5.0
                                            </>
                                        ) : (
                                            '⭐ 5.0 / 5.0'
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Masters;
