import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getMasterByIdApi } from '../api/masters';
import {
    getMyBookingsApi,
    cancelBookingApi,
} from '../api/bookings';
import {
    fetchMasterSchedule,
    updateMasterSchedule,
} from '../api/schedule.js';

import ConfirmationModal from '../components/ConfirmationModal';
import '../styles/MasterDashboard.css';

const DAY_LABELS = {
    1: 'Понеділок',
    2: 'Вівторок',
    3: 'Середа',
    4: 'Четвер',
    5: 'Пʼятниця',
    6: 'Субота',
    7: 'Неділя',
};

const DAYS = [1, 2, 3, 4, 5, 6, 7];

const buildEmptySchedule = () => ({
    1: { start: '10:00', end: '19:00', isWorking: true },
    2: { start: '10:00', end: '19:00', isWorking: true },
    3: { start: '10:00', end: '19:00', isWorking: true },
    4: { start: '10:00', end: '19:00', isWorking: true },
    5: { start: '10:00', end: '19:00', isWorking: true },
    6: { start: '11:00', end: '16:00', isWorking: true },
    7: { start: '11:00', end: '16:00', isWorking: false },
});

// 👇 адаптуємо під те, що бекенд може повертати або масив, або { days: [...] }
const mapSlotsToState = (slotsResponse) => {
    const base = buildEmptySchedule();

    if (!slotsResponse) return base;

    const slots = Array.isArray(slotsResponse)
        ? slotsResponse
        : Array.isArray(slotsResponse.days)
            ? slotsResponse.days
            : [];

    if (!slots.length) return base;

    slots.forEach((slot) => {
        const day = Number(slot.weekday);
        if (!day || !base[day]) return;
        base[day] = {
            start: slot.startTime || base[day].start,
            end: slot.endTime || base[day].end,
            isWorking: true,
        };
    });

    return base;
};

const mapStateToSlots = (state) =>
    Object.entries(state)
        .filter(([, v]) => v.isWorking)
        .map(([day, v]) => ({
            weekday: Number(day),
            startTime: v.start,
            endTime: v.end,
        }));

const statusToText = (status) => {
    if (!status) return 'Очікує підтвердження';
    switch (status) {
        case 'PENDING':
            return 'Очікує підтвердження';
        case 'CONFIRMED':
            return 'Підтверджено';
        case 'CANCELLED':
        case 'CANCELLED_BY_MASTER':
            return 'Скасовано';
        case 'COMPLETED':
            return 'Виконано';
        default:
            return status;
    }
};

const MasterDashboard = ({ user, openInfoModal, onUpdateAppointments }) => {
    const navigate = useNavigate();

    const [masterProfile, setMasterProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [schedule, setSchedule] = useState(buildEmptySchedule());
    const [loading, setLoading] = useState(true);
    const [savingSchedule, setSavingSchedule] = useState(false);
    const [error, setError] = useState('');
    const [cancelModalData, setCancelModalData] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'master') {
            setLoading(false);
            return;
        }
        if (!user.masterId) {
            setError(
                'У вашому профілі відсутній masterId. Перевірте відповідь бекенду /auth/login.',
            );
            setLoading(false);
            return;
        }

        const load = async () => {
            setLoading(true);
            setError('');

            try {
                const [masterData, myBookings, slotsResponse] = await Promise.all([
                    getMasterByIdApi(user.masterId),  // 👈 використовуємо реальний API
                    getMyBookingsApi(),               // 👈 використовуємо реальний API
                    fetchMasterSchedule(user.masterId),
                ]);

                setMasterProfile(masterData);

                const masterBookings = Array.isArray(myBookings)
                    ? myBookings.filter((b) => {
                        if (!b) return false;

                        if (b.master && b.master.id && String(b.master.id) === String(user.masterId)) {
                            return true;
                        }
                        if (b.masterId && String(b.masterId) === String(user.masterId)) {
                            return true;
                        }
                        return false;
                    })
                    : [];

                setBookings(masterBookings);
                setSchedule(mapSlotsToState(slotsResponse));
            } catch (err) {
                setError(
                    err.message || 'Не вдалося завантажити дані дашборду майстра',
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user]);

    const upcomingAppointments = useMemo(() => {
        const now = new Date();

        return bookings
            .filter((b) => {
                if (!b.startTime) return false;
                const start = new Date(b.startTime);
                if (Number.isNaN(start.getTime())) return true;

                if (
                    b.status === 'CANCELLED' ||
                    b.status === 'CANCELLED_BY_MASTER' ||
                    b.status === 'COMPLETED'
                ) {
                    return false;
                }

                return start >= now;
            })
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    }, [bookings]);

    const handleScheduleChange = (day, field, value) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value },
        }));
    };

    const handleToggleWorking = (day) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], isWorking: !prev[day].isWorking },
        }));
    };

    const handleSaveSchedule = async () => {
        if (!user || !user.masterId) return;
        try {
            setSavingSchedule(true);
            const slots = mapStateToSlots(schedule);
            await updateMasterSchedule(user.masterId, slots); // 👈 використовуємо updateMasterSchedule

            if (openInfoModal) {
                openInfoModal({
                    title: 'Графік збережено ✅',
                    message: 'Ваш графік роботи успішно оновлено на сервері.',
                    icon: '🗓️',
                });
            }
        } catch (err) {
            if (openInfoModal) {
                openInfoModal({
                    title: 'Помилка збереження графіка',
                    message: err.message || 'Спробуйте пізніше.',
                    type: 'error',
                });
            }
        } finally {
            setSavingSchedule(false);
        }
    };

    const handleConfirmAppointment = async (appointmentId) => {
        try {
            await confirmBookingApi(appointmentId);
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === appointmentId ? { ...b, status: 'CONFIRMED' } : b,
                ),
            );
            if (onUpdateAppointments) onUpdateAppointments();
            if (openInfoModal) {
                openInfoModal({
                    title: 'Запис підтверджено ✅',
                    message: 'Клієнт буде повідомлений про підтвердження.',
                });
            }
        } catch (err) {
            if (openInfoModal) {
                openInfoModal({
                    title: 'Помилка підтвердження',
                    message: err.message || 'Не вдалося підтвердити запис.',
                    type: 'error',
                });
            }
        }
    };

    const handleCancelAppointment = (appointmentId) => {
        setCancelModalData({
            appointmentId,
            title: 'Скасувати запис?',
            message: 'Ви впевнені, що хочете скасувати цей запис?',
        });
    };

    const handleConfirmCancel = async () => {
        if (!cancelModalData?.appointmentId) return;

        try {
            await cancelBookingApi(cancelModalData.appointmentId);
            setBookings((prev) =>
                prev.map((b) =>
                    b.id === cancelModalData.appointmentId
                        ? { ...b, status: 'CANCELLED_BY_MASTER' }
                        : b,
                ),
            );
            if (onUpdateAppointments) onUpdateAppointments();
            if (openInfoModal) {
                openInfoModal({
                    title: 'Запис скасовано',
                    message: 'Клієнт буде повідомлений про скасування.',
                });
            }
        } catch (err) {
            if (openInfoModal) {
                openInfoModal({
                    title: 'Помилка скасування',
                    message: err.message || 'Не вдалося скасувати запис.',
                    type: 'error',
                });
            }
        } finally {
            setCancelModalData(null);
        }
    };

    if (!user || user.role !== 'master') {
        return <h2 className="master-dashboard-denied">Доступ заборонено.</h2>;
    }

    if (loading) {
        return (
            <div className="master-dashboard-wrapper">
                <div className="master-dashboard-page container animate">
                    <p className="master-dashboard-status">
                        Завантаження дашборду майстра...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="master-dashboard-wrapper">
                <div className="master-dashboard-page container animate">
                    <p className="master-dashboard-error">{error}</p>
                    <button
                        type="button"
                        className="master-dashboard-back-btn"
                        onClick={() => navigate('/')}
                    >
                        На головну
                    </button>
                </div>
            </div>
        );
    }

    if (!masterProfile) {
        return (
            <div className="master-dashboard-wrapper">
                <div className="master-dashboard-page container animate">
                    <h2 className="master-dashboard-error">
                        Профіль майстра не знайдено.
                    </h2>
                </div>
            </div>
        );
    }

    const name =
        masterProfile.fullName ||
        masterProfile.name ||
        masterProfile.user?.email ||
        'Майстер салону';

    const role =
        masterProfile.specialization ||
        masterProfile.position ||
        'Майстер салону';

    const about =
        masterProfile.description ||
        'Спеціаліст високого рівня у своїй галузі. Використовує сучасні техніки та якісні матеріали.';

    const ratingValue =
        typeof masterProfile.rating === 'number'
            ? masterProfile.rating.toFixed(1)
            : '5.0';

    const experienceText = masterProfile.experienceYears
        ? `${masterProfile.experienceYears} років досвіду`
        : 'Досвід не вказано';

    const avatar =
        masterProfile.photoUrl ||
        masterProfile.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name,
        )}&background=B76E79&color=fff&bold=true&size=256`;

    return (
        <div className="master-dashboard-wrapper">
            <div className="master-dashboard-page container animate">
                <div className="master-dashboard-card master-dashboard-profile-card">
                    <img
                        src={avatar}
                        alt={name}
                        className="master-dashboard-avatar"
                    />
                    <h2 className="master-dashboard-name">{name}</h2>
                    <p className="master-dashboard-role">{role}</p>
                    <p className="master-dashboard-about">{about}</p>
                    <p className="master-dashboard-rating">
                        Рейтинг: {ratingValue} ⭐
                    </p>
                    <p className="master-dashboard-experience">{experienceText}</p>
                    {masterProfile.phone && (
                        <p className="master-dashboard-contact">
                            📞 {masterProfile.phone}
                        </p>
                    )}
                    {masterProfile.email && (
                        <p className="master-dashboard-contact">
                            ✉️ {masterProfile.email}
                        </p>
                    )}
                </div>

                <div className="master-dashboard-card master-dashboard-appointments-card">
                    <h3 className="master-dashboard-section-title">
                        Майбутні записи ({upcomingAppointments.length})
                    </h3>
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((app) => {
                            const start = app.startTime
                                ? new Date(app.startTime)
                                : null;
                            const dateStr = start
                                ? start.toLocaleDateString('uk-UA', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                                : '';
                            const timeStr = start
                                ? start.toLocaleTimeString('uk-UA', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : '';

                            const clientName =
                                app.client?.fullName ||
                                app.client?.email ||
                                'Клієнт';
                            const serviceName = app.service?.name || 'Послуга';

                            const statusTextValue = statusToText(app.status);
                            const canConfirm = app.status === 'PENDING';

                            return (
                                <div
                                    key={app.id}
                                    className="master-dashboard-appointment-card"
                                >
                                    <div className="master-dashboard-appointment-info">
                                        <p className="master-dashboard-appointment-service">
                                            {serviceName}
                                        </p>
                                        <p className="master-dashboard-appointment-datetime">
                                            🗓️ {dateStr} ⏰ {timeStr}
                                        </p>
                                        <p className="master-dashboard-appointment-client">
                                            👤 {clientName}
                                        </p>
                                        <p className="master-dashboard-appointment-status">
                                            Статус: {statusTextValue}
                                        </p>
                                    </div>
                                    <div className="master-dashboard-appointment-actions">
                                        {canConfirm && (
                                            <button
                                                type="button"
                                                className="master-dashboard-confirm-btn"
                                                onClick={() =>
                                                    handleConfirmAppointment(app.id)
                                                }
                                            >
                                                Підтвердити
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="master-dashboard-cancel-btn"
                                            onClick={() =>
                                                handleCancelAppointment(app.id)
                                            }
                                        >
                                            Скасувати
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="master-dashboard-empty">
                            🎉 На сьогодні немає запланованих записів.
                        </p>
                    )}
                </div>

                <div className="master-dashboard-card master-dashboard-schedule-card">
                    <h3 className="master-dashboard-section-title">
                        Редагування графіка
                    </h3>
                    <div className="master-dashboard-schedule-grid">
                        <span className="master-dashboard-day-header">День</span>
                        <span className="master-dashboard-day-header">Робочий</span>
                        <span className="master-dashboard-day-header">Початок</span>
                        <span className="master-dashboard-day-header">Кінець</span>

                        {DAYS.map((day) => {
                            const dayData = schedule[day];
                            return (
                                <React.Fragment key={day}>
                                    <span className="master-dashboard-day-label">
                                        {DAY_LABELS[day]}
                                    </span>
                                    <div className="master-dashboard-day-working">
                                        <input
                                            type="checkbox"
                                            checked={dayData.isWorking}
                                            onChange={() => handleToggleWorking(day)}
                                        />
                                    </div>
                                    {dayData.isWorking ? (
                                        <>
                                            <input
                                                type="time"
                                                value={dayData.start}
                                                onChange={(e) =>
                                                    handleScheduleChange(
                                                        day,
                                                        'start',
                                                        e.target.value,
                                                    )
                                                }
                                                className="master-dashboard-time-input"
                                            />
                                            <input
                                                type="time"
                                                value={dayData.end}
                                                onChange={(e) =>
                                                    handleScheduleChange(
                                                        day,
                                                        'end',
                                                        e.target.value,
                                                    )
                                                }
                                                className="master-dashboard-time-input"
                                            />
                                        </>
                                    ) : (
                                        <span className="master-dashboard-day-off">
                                            Вихідний
                                        </span>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        className="master-dashboard-save-btn"
                        onClick={handleSaveSchedule}
                        disabled={savingSchedule}
                    >
                        {savingSchedule ? 'Збереження...' : 'Зберегти графік'}
                    </button>
                </div>

                <ConfirmationModal
                    isOpen={!!cancelModalData}
                    title={cancelModalData?.title || ''}
                    message={cancelModalData?.message || ''}
                    onConfirm={handleConfirmCancel}
                    onCancel={() => setCancelModalData(null)}
                />
            </div>
        </div>
    );
};

export default MasterDashboard;
