// src/pages/Appointment.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Appointment.css';

import { getCart } from '../api/cart.js';
import { getServicesApi } from '../api/services';
import {
    getMastersApi,
    fetchMasterSchedule,
    saveMasterSchedule,
} from '../api/masters';
import {
    getBookingsApi,
    createBookingApi,
} from '../api/bookings.js';

const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const buildDefaultSlots = () => [
    { weekday: 1, startTime: '10:00', endTime: '19:00' },
    { weekday: 2, startTime: '10:00', endTime: '19:00' },
    { weekday: 3, startTime: '10:00', endTime: '19:00' },
    { weekday: 4, startTime: '10:00', endTime: '19:00' },
    { weekday: 5, startTime: '10:00', endTime: '19:00' },
    { weekday: 6, startTime: '11:00', endTime: '16:00' },
];

const generateTimeSlots = (
    master,
    masterSlots,
    selectedDate,
    existingAppointments = [],
) => {
    if (!master || !selectedDate) return [];

    const date = new Date(selectedDate);
    if (Number.isNaN(date.getTime())) return [];

    const jsDay = date.getDay(); // 0..6, 0 = Sunday
    const weekday = jsDay === 0 ? 7 : jsDay; // 1..7 як у бекенді

    let startMinutes = null;
    let endMinutes = null;

    // 1) Основний варіант — графік з бекенду (schedule API)
    if (Array.isArray(masterSlots) && masterSlots.length > 0) {
        const slotForDay = masterSlots.find(
            (s) => Number(s.weekday) === Number(weekday),
        );

        // якщо на цей день слотів нема — майстер не працює
        if (!slotForDay) {
            return [];
        }

        const [startHour, startMin] = slotForDay.startTime.split(':').map(Number);
        const [endHour, endMin] = slotForDay.endTime.split(':').map(Number);
        startMinutes = startHour * 60 + startMin;
        endMinutes = endHour * 60 + endMin;
    } else {
        // якщо графік з бекенду відсутній — просто не будуємо слоти
        return [];
    }

    const slots = [];
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        const timeSlot = `${String(hour).padStart(2, '0')}:${String(
            min,
        ).padStart(2, '0')}`;
        slots.push(timeSlot);
    }

    // 🔒 Блокуємо вже зайняті слоти
    const bookedSlots = existingAppointments
        .filter((app) => {
            const appMasterId =
                app.masterId ||
                (app.master && app.master.id) ||
                (app.master && app.masterId);

            if (String(appMasterId) !== String(master.id)) return false;

            let appDate = app.date;
            let appTime = app.time;

            if (app.startTime) {
                const start = new Date(app.startTime);
                if (!Number.isNaN(start.getTime())) {
                    appDate = start.toISOString().split('T')[0];
                    appTime = `${String(start.getHours()).padStart(
                        2,
                        '0',
                    )}:${String(start.getMinutes()).padStart(2, '0')}`;
                }
            }

            if (appDate !== selectedDate) return false;

            const status = (app.status || '').toUpperCase();
            if (status === 'CANCELLED' || status === 'CANCELLED_BY_MASTER') {
                return false;
            }

            return true;
        })
        .map((app) => {
            if (app.time) return app.time;
            if (app.startTime) {
                const start = new Date(app.startTime);
                if (!Number.isNaN(start.getTime())) {
                    return `${String(start.getHours()).padStart(
                        2,
                        '0',
                    )}:${String(start.getMinutes()).padStart(2, '0')}`;
                }
            }
            return null;
        })
        .filter(Boolean);

    return slots.filter((slot) => !bookedSlots.includes(slot));
};

const Appointment = ({ user, onBookingSuccess }) => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [selectedCartItem, setSelectedCartItem] = useState('');

    const [services, setServices] = useState([]);
    const [masters, setMasters] = useState([]);
    const [existingAppointments, setExistingAppointments] = useState([]);

    const [masterSlotsMap, setMasterSlotsMap] = useState({}); // { [masterId]: slots[] }

    const [currentService, setCurrentService] = useState(null);
    const [availableMasters, setAvailableMasters] = useState([]);
    const [selectedMasterId, setSelectedMasterId] = useState('');
    const [selectedMaster, setSelectedMaster] = useState(null); // 🔥 окремо зберігаємо обʼєкт майстра
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setLoadError('');

                const items = getCart() || [];
                setCartItems(items);
                if (items.length > 0) {
                    setSelectedCartItem(String(items[0].id));
                }

                const [servicesData, mastersData, appointmentsData] =
                    await Promise.all([
                        getServicesApi(),
                        getMastersApi(),
                        getBookingsApi().catch(() => []), // якщо немає GET /bookings — не валимо сторінку
                    ]);

                setServices(servicesData || []);
                setMasters(mastersData || []);
                setExistingAppointments(appointmentsData || []);
            } catch (e) {
                console.error(e);
                setLoadError('Не вдалося завантажити дані для запису. Спробуйте пізніше.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    useEffect(() => {
        if (!selectedCartItem || services.length === 0 || masters.length === 0) {
            setCurrentService(null);
            setAvailableMasters([]);
            setSelectedMasterId('');
            setSelectedMaster(null);
            setSelectedDate('');
            setSelectedTime('');
            return;
        }

        const service = services.find(
            (s) => String(s.id) === String(selectedCartItem),
        );
        setCurrentService(service || null);

        if (service) {
            const mastersForService = masters.filter((m) => {
                if (!Array.isArray(m.services)) return false;
                return m.services.some((srv) => {
                    if (srv && typeof srv === 'object') {
                        return String(srv.id) === String(service.id);
                    }
                    return String(srv) === String(service.id);
                });
            });
            setAvailableMasters(mastersForService);
        } else {
            setAvailableMasters([]);
        }

        setSelectedMasterId('');
        setSelectedMaster(null);
        setSelectedDate('');
        setSelectedTime('');
    }, [selectedCartItem, services, masters]);


    useEffect(() => {
        if (!selectedMasterId) return;

        const loadSchedule = async () => {
            try {
                let slots = await fetchMasterSchedule(selectedMasterId);
                if (!Array.isArray(slots) || slots.length === 0) {
                    const defaultSlots = buildDefaultSlots();
                    try {
                        await saveMasterSchedule(selectedMasterId, defaultSlots);
                        slots = defaultSlots;
                    } catch (err) {
                        console.error(
                            'Не вдалося створити дефолтний графік майстра:',
                            err,
                        );
                    }
                }

                setMasterSlotsMap((prev) => ({
                    ...prev,
                    [String(selectedMasterId)]: Array.isArray(slots) ? slots : [],
                }));
            } catch (e) {
                console.error('Помилка завантаження графіка майстра:', e);
                setMasterSlotsMap((prev) => ({
                    ...prev,
                    [String(selectedMasterId)]: [],
                }));
            }
        };

        loadSchedule();
    }, [selectedMasterId]);

    // доступні слоти часу на основі schedule API + існуючих записів
    const availableTimes = useMemo(() => {
        if (!selectedMaster || !selectedDate) return [];

        const slotsForMaster =
            masterSlotsMap[String(selectedMasterId)] || [];

        return generateTimeSlots(
            selectedMaster,
            slotsForMaster,
            selectedDate,
            existingAppointments,
        );
    }, [
        selectedMaster,
        selectedDate,
        existingAppointments,
        masterSlotsMap,
        selectedMasterId,
    ]);

    const handleBooking = async () => {
        if (!currentService || !selectedMasterId || !selectedDate || !selectedTime) {
            window.alert('Будь ласка, оберіть послугу, майстра, дату та час.');
            return;
        }

        try {
            const payload = {
                userId: user.id,
                serviceId: currentService.id,
                masterId: selectedMasterId,
                date: selectedDate,
                time: selectedTime,
            };

            const created = await createBookingApi(payload);

            if (onBookingSuccess) {
                onBookingSuccess({
                    message: `Ви записалися на "${currentService.name}" ${selectedDate} о ${selectedTime}.`,
                    bookingId: created.id,
                });
            }

            navigate('/profile');
        } catch (e) {
            console.error(e);
            window.alert('Не вдалося створити запис. Спробуйте ще раз.');
        }
    };

    if (!user) {
        navigate('/auth');
        return null;
    }

    if (cartItems.length === 0 && !loading) {
        return (
            <div className="appointment-empty-page">
                <div className="appointment-empty-card">
                    <h2 className="appointment-empty-title">Кошик порожній</h2>
                    <p className="appointment-empty-text">
                        Додайте послуги, щоб продовжити запис.
                    </p>
                    <button
                        type="button"
                        className="appointment-btn-primary"
                        onClick={() => navigate('/services')}
                    >
                        Перейти до послуг
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="appointment-page-background">
            <div className="container appointment-page-container">
                <h1 className="appointment-title">
                    Оформлення запису ({cartItems.length}{' '}
                    {cartItems.length === 1 ? 'послуга' : 'послуги'})
                </h1>

                {loading && (
                    <p className="appointment-loading">Завантаження даних для запису...</p>
                )}
                {loadError && <p className="appointment-error">{loadError}</p>}

                {!loading && !loadError && (
                    <>
                        {step >= 1 && (
                            <div className="appointment-step-card">
                                <h2 className="appointment-section-title">
                                    Крок 1: Оберіть послугу
                                </h2>

                                {cartItems.length > 1 ? (
                                    <select
                                        value={selectedCartItem || ''}
                                        onChange={(e) => {
                                            setSelectedCartItem(e.target.value);
                                            setStep(1);
                                        }}
                                        className="appointment-input"
                                    >
                                        {cartItems.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} ({item.price} грн)
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="appointment-service-text">
                                        Обрана послуга:{' '}
                                        <span className="appointment-service-name">
                                            {currentService?.name}
                                        </span>
                                    </p>
                                )}

                                {currentService && (
                                    <div className="appointment-step-footer">
                                        <button
                                            type="button"
                                            className="appointment-btn-primary"
                                            onClick={() => setStep(2)}
                                        >
                                            Далі: вибір майстра
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {step >= 2 && currentService && (
                            <div className="appointment-step-card">
                                <h2 className="appointment-section-title">
                                    Крок 2: Майстер та час
                                </h2>

                                <h3 className="appointment-subtitle">Оберіть майстра</h3>
                                <div className="appointment-masters-grid">
                                    {availableMasters.map((master) => (
                                        <div
                                            key={master.id}
                                            className={`appointment-master-card${
                                                String(selectedMasterId) === String(master.id)
                                                    ? ' selected'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                setSelectedMasterId(String(master.id));
                                                setSelectedMaster(master); // 🔥 тут зберігаємо обʼєкт
                                            }}
                                        >
                                            <img
                                                src={master.photoUrl || master.image}
                                                alt={master.fullName || master.name}
                                                className="appointment-master-image"
                                            />
                                            <p className="appointment-master-name">
                                                {master.fullName || master.name}
                                            </p>
                                            <p className="appointment-master-role">
                                                {master.role}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {selectedMasterId && (
                                    <>
                                        <h3 className="appointment-subtitle">Оберіть дату</h3>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => {
                                                setSelectedDate(e.target.value);
                                                setSelectedTime('');
                                            }}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="appointment-input"
                                        />

                                        {selectedDate && (
                                            <>
                                                <h3 className="appointment-subtitle">
                                                    Оберіть час
                                                </h3>
                                                {availableTimes.length > 0 ? (
                                                    <div className="appointment-slots">
                                                        {availableTimes.map((time) => (
                                                            <button
                                                                key={time}
                                                                type="button"
                                                                className={`appointment-slot${
                                                                    selectedTime === time
                                                                        ? ' selected'
                                                                        : ''
                                                                }`}
                                                                onClick={() =>
                                                                    setSelectedTime(time)
                                                                }
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="appointment-no-slots">
                                                        На жаль, вільних слотів на цю дату немає.
                                                        Оберіть іншу дату.
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                                <div className="appointment-step-nav">
                                    <button
                                        type="button"
                                        className="appointment-btn-secondary"
                                        onClick={() => setStep(1)}
                                    >
                                        ← Назад
                                    </button>
                                    {selectedMaster && selectedDate && selectedTime && (
                                        <button
                                            type="button"
                                            className="appointment-btn-primary"
                                            onClick={() => setStep(3)}
                                        >
                                            Далі: підтвердження
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {step >= 3 &&
                            currentService &&
                            selectedMaster &&
                            selectedDate &&
                            selectedTime && (
                                <div className="appointment-step-card">
                                    <h2 className="appointment-section-title">
                                        Крок 3: Підтвердження
                                    </h2>
                                    <div className="appointment-summary">
                                        <p>
                                            <span>Послуга:</span> {currentService.name}
                                        </p>
                                        <p>
                                            <span>Майстер:</span>{' '}
                                            {selectedMaster.fullName || selectedMaster.name}
                                        </p>
                                        <p>
                                            <span>Дата:</span> {selectedDate}
                                        </p>
                                        <p>
                                            <span>Час:</span> {selectedTime}
                                        </p>
                                        <p className="appointment-summary-price">
                                            До оплати: {currentService.price} грн
                                        </p>
                                    </div>

                                    <div className="appointment-summary-actions">
                                        <button
                                            type="button"
                                            className="appointment-btn-primary"
                                            onClick={handleBooking}
                                        >
                                            Підтвердити запис
                                        </button>
                                        <button
                                            type="button"
                                            className="appointment-btn-secondary"
                                            onClick={() => setStep(2)}
                                        >
                                            ← Змінити
                                        </button>
                                    </div>
                                </div>
                            )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Appointment;
