import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ServiceDetail.css';

import { addToCart } from '../api/cart.js';
import { getServicesApi } from '../api/services';
import { getMastersApi } from '../api/masters';
import { createBookingApi } from '../api/bookings.js';

const generateTimeSlots = (start = 10, end = 19, duration = 60) => {
    const slots = [];
    for (let h = start; h < end; h++) {
        for (let m = 0; m < 60; m += duration) {
            if (h * 60 + m < end * 60) {
                const hour = String(h).padStart(2, '0');
                const minute = String(m).padStart(2, '0');
                slots.push(`${hour}:${minute}`);
            }
        }
    }
    return slots;
};

const ServiceDetail = ({ user, onCartUpdate, openInfoModal }) => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [selectedMasterId, setSelectedMasterId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setLoadError('');

                const [servicesData, mastersData] = await Promise.all([
                    getServicesApi(),
                    getMastersApi(),
                ]);

                const foundService =
                    servicesData.find((s) => s.slug === slug) || null;

                if (!foundService) {
                    setService(null);
                    setLoadError('Послуга не знайдена. Перевірте посилання.');
                    return;
                }

                setService(foundService);

                const serviceMasters = mastersData.filter((m) => {
                    if (!Array.isArray(m.services)) return false;
                    return m.services.some((srv) => {
                        if (srv && typeof srv === 'object') {
                            return String(srv.id) === String(foundService.id);
                        }
                        return String(srv) === String(foundService.id);
                    });
                });

                setMasters(serviceMasters);
            } catch (e) {
                console.error(e);
                setLoadError('Не вдалося завантажити дані. Спробуйте пізніше.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [slug]);

    useEffect(() => {
        if (!service) {
            setAvailableTimes([]);
            return;
        }
        const duration =
            service.durationMinutes || service.minDuration || 60;
        setAvailableTimes(generateTimeSlots(10, 19, duration));
    }, [service]);

    const selectedMaster = useMemo(
        () =>
            masters.find((m) => String(m.id) === String(selectedMasterId)) ||
            null,
        [masters, selectedMasterId]
    );

    const handleRequireAuth = () => {
        if (openInfoModal) {
            openInfoModal({
                title: 'Потрібна авторизація',
                message: 'Увійдіть у свій акаунт, щоб оформити запис.',
            });
        }
        navigate('/auth');
    };

    const handleMasterSelect = (masterId) => {
        setSelectedMasterId(String(masterId));
        setSelectedDate('');
        setSelectedTime('');
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedTime('');
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleBookNow = async () => {
        if (!service || !selectedMasterId || !selectedDate || !selectedTime) {
            window.alert('Будь ласка, оберіть майстра, дату та час.');
            return;
        }

        if (!user) {
            handleRequireAuth();
            return;
        }

        try {
            const payload = {
                userId: user.id,
                serviceId: service.id,
                masterId: selectedMasterId,
                date: selectedDate,
                time: selectedTime,
            };

            await createBookingApi(payload);

            if (openInfoModal) {
                openInfoModal({
                    title: 'Запис оформлено',
                    message: `Ви успішно записані на «${service.name}» ${selectedDate} о ${selectedTime}.`,
                });
            }

            navigate('/profile');
        } catch (e) {
            console.error(e);
            window.alert('Не вдалося створити запис. Спробуйте ще раз.');
        }
    };

    const handleAddToCart = () => {
        if (!service) return;
        const added = addToCart(service);

        if (added) {
            if (openInfoModal) {
                openInfoModal({
                    title: 'Додано до кошика',
                    message: `Послугу «${service.name}» додано до кошика.`,
                });
            }
            if (onCartUpdate) {
                onCartUpdate();
            }
        } else {
            if (openInfoModal) {
                openInfoModal({
                    title: 'Послуга вже в кошику',
                    message: `Послуга «${service.name}» уже є у вашому кошику.`,
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="service-detail-background">
                <div className="service-detail-container">
                    <p className="service-detail-loading">
                        Завантаження даних послуги...
                    </p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="service-detail-background">
                <div className="service-detail-container">
                    <p className="service-detail-error">{loadError}</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="service-detail-background">
                <div className="service-detail-container">
                    <h2 className="service-detail-not-found">
                        Послуга не знайдена. Перевірте посилання.
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="service-detail-background">
            <div className="service-detail-container">
                <h1 className="service-detail-title">{service.name}</h1>
                <p className="service-detail-price">{service.price} грн</p>

                {service.image && (
                    <img
                        src={service.image}
                        alt={service.name}
                        className="service-detail-image"
                    />
                )}

                <p className="service-detail-description">
                    {service.description}
                </p>

                <button
                    type="button"
                    className="service-detail-cart-btn"
                    onClick={handleAddToCart}
                >
                    Додати послугу до кошика
                </button>

                <h2 className="service-detail-section-title">
                    Оформити запис
                </h2>

                <h3 className="service-detail-subtitle">Оберіть майстра</h3>
                <div className="service-detail-masters-grid">
                    {masters.map((master) => (
                        <div
                            key={master.id}
                            className={`service-detail-master-card${
                                String(selectedMasterId) === String(master.id)
                                    ? ' selected'
                                    : ''
                            }`}
                            onClick={() => handleMasterSelect(master.id)}
                        >
                            <img
                                src={master.photoUrl || master.image}
                                alt={master.fullName || master.name}
                                className="service-detail-master-image"
                            />
                            <h4 className="service-detail-master-name">
                                {master.fullName || master.name}
                            </h4>
                            <p className="service-detail-master-role">{master.role}</p>
                        </div>
                    ))}
                </div>

                {selectedMaster && (
                    <>
                        <h3 className="service-detail-subtitle">Оберіть дату</h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="service-detail-input"
                        />

                        {selectedDate && (
                            <>
                                <h3 className="service-detail-subtitle">
                                    Оберіть час
                                </h3>
                                <div className="service-detail-slots">
                                    {availableTimes.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            className={`service-detail-slot${
                                                selectedTime === time ? ' selected' : ''
                                            }`}
                                            onClick={() => handleTimeSelect(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {selectedMaster && selectedDate && selectedTime && (
                    <button
                        type="button"
                        className="service-detail-book-btn"
                        onClick={handleBookNow}
                    >
                        Підтвердити запис на {selectedTime}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;
