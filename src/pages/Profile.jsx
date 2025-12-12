import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/Profile.css';

import { saveCurrentUser } from '../api/auth';
import { getMyBookingsApi, cancelBookingApi } from '../api/bookings';
import { updateProfileApi } from '../api/user';

const Profile = ({
 user,
 onLogout,
 onUpdateUser,
 setSuccessModalData,
 openInfoModal,
}) => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [avatarUrl, setAvatarUrl] = useState(
        user?.avatarUrl || user?.avatar || 'https://i.ibb.co/L5r0sLw/default-avatar.png',
    );

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [modalData, setModalData] = useState(null);

    const mapStatusToText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Заплановано';
            case 'CONFIRMED':
                return 'Підтверджено';
            case 'CANCELLED':
            case 'CANCELLED_BY_CLIENT':
                return 'Скасовано вами';
            case 'CANCELLED_BY_MASTER':
                return 'Скасовано майстром';
            case 'COMPLETED':
                return 'Виконано';
            default:
                return status || 'Заплановано';
        }
    };

    const getAppointmentStartDate = (app) => {
        if (app.startTime) {
            const d = new Date(app.startTime);
            if (!Number.isNaN(d.getTime())) return d;
        }

        if (app.date && app.time) {
            const d = new Date(`${app.date}T${app.time}`);
            if (!Number.isNaN(d.getTime())) return d;
        }

        return null;
    };

    const loadAppointments = useCallback(async () => {
        if (!user) return;

        try {
            const allAppointments = await getMyBookingsApi();
            const now = new Date();

            const enrichedAppointments = allAppointments
                .map((app) => {
                    // ✅ беремо дату з startTime, якщо є
                    let appointmentDateTime;

                    if (app.startTime) {
                        appointmentDateTime = new Date(app.startTime);
                    } else if (app.date && app.time) {
                        appointmentDateTime = new Date(`${app.date}T${app.time}`);
                    } else {
                        return null;
                    }

                    if (Number.isNaN(appointmentDateTime.getTime())) return null;

                    const statusUpper = (app.status || '').toUpperCase();
                    const timeDifferenceHours =
                        (appointmentDateTime.getTime() - now.getTime()) / 3600000;

                    const isCancelled =
                        statusUpper === 'CANCELLED' ||
                        statusUpper === 'CANCELLED_BY_CLIENT' ||
                        statusUpper === 'CANCELLED_BY_MASTER';

                    return {
                        ...app,
                        // нормалізуємо date/time, щоб було що рендерити в картці
                        date:
                            app.date || appointmentDateTime.toISOString().split('T')[0],
                        time:
                            app.time ||
                            `${String(appointmentDateTime.getHours()).padStart(2, '0')}:${String(
                                appointmentDateTime.getMinutes()
                            ).padStart(2, '0')}`,
                        statusText: mapStatusToText(statusUpper),
                        isUpcoming: appointmentDateTime > now && !isCancelled,
                        isCancellable:
                            !isCancelled && statusUpper !== 'COMPLETED' && timeDifferenceHours > 4,
                    };
                })
                .filter(Boolean)
                .filter((app) => app.isUpcoming);

            setUpcomingAppointments(enrichedAppointments);
        } catch (e) {
            console.error('Помилка завантаження записів:', e);
            if (openInfoModal) {
                openInfoModal({
                    title: 'Помилка завантаження візитів',
                    message: 'Не вдалося завантажити ваші записи. Спробуйте оновити сторінку.',
                });
            }
        }
    }, [user, openInfoModal]);

    useEffect(() => {
        if (!user) return;

        loadAppointments();

        setEditFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
            email: user.email || '',
        });
        setAvatarUrl(
            user.avatarUrl || user.avatar || 'https://i.ibb.co/L5r0sLw/default-avatar.png',
        );
    }, [user, loadAppointments]);

    if (!user) {
        navigate('/auth');
        return null;
    }

    const handleEditToggle = () => {
        if (isEditing) {
            setEditFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                email: user.email || '',
            });
        }
        setIsEditing((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('firstName', editFormData.firstName || '');
            formData.append('lastName', editFormData.lastName || '');
            formData.append('phone', editFormData.phone || '');

            const updatedFromServer = await updateProfileApi(formData);
            const updatedUser = {
                ...user,
                ...updatedFromServer,
            };

            saveCurrentUser(updatedUser);
            if (onUpdateUser) {
                onUpdateUser(updatedUser);
            }

            setIsEditing(false);

            if (openInfoModal) {
                openInfoModal({
                    title: 'Профіль оновлено',
                    message: 'Дані профілю успішно оновлено.',
                });
            }
        } catch (error) {
            console.error('Помилка при збереженні профілю:', error);
            if (openInfoModal) {
                openInfoModal({
                    title: 'Помилка',
                    message: error.message || 'Помилка при збереженні профілю.',
                    type: 'error',
                });
            }
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newAvatarUrl = URL.createObjectURL(file);
        setAvatarUrl(newAvatarUrl);

        try {
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('firstName', editFormData.firstName || '');
            formData.append('lastName', editFormData.lastName || '');
            formData.append('phone', editFormData.phone || '');

            const updatedFromServer = await updateProfileApi(formData);
            const updatedUser = {
                ...user,
                ...updatedFromServer,
            };

            saveCurrentUser(updatedUser);
            if (onUpdateUser) {
                onUpdateUser(updatedUser);
            }

            setAvatarUrl(
                updatedFromServer.avatarUrl ||
                updatedFromServer.avatar ||
                newAvatarUrl,
            );

            if (openInfoModal) {
                openInfoModal({
                    title: 'Аватар оновлено',
                    message: 'Фото профілю успішно оновлено.',
                });
            }
        } catch (error) {
            console.error('Помилка при зміні аватарки:', error);
            if (openInfoModal) {
                openInfoModal({
                    title: 'Помилка',
                    message:
                        error.message ||
                        'Помилка при зміні аватарки. Спробуйте ще раз.',
                    type: 'error',
                });
            }
        }
    };

    const handleCancelAttempt = (appointmentId) => {
        setModalData({
            title: 'Скасувати Запис?',
            message:
                'Ви впевнені, що хочете скасувати цей візит? Цю дію не можна буде скасувати.',
            appointmentId,
        });
    };

    const handleConfirmCancel = async () => {
        if (!modalData?.appointmentId) return;

        try {
            await cancelBookingApi(modalData.appointmentId);
            setModalData(null);
            await loadAppointments();

            if (setSuccessModalData) {
                setSuccessModalData({
                    user: user.firstName || user.email,
                    message: 'Ваш візит було успішно скасовано.',
                    type: 'cancellation',
                });
            }
        } catch (e) {
            console.error('Помилка скасування запису:', e);
            if (openInfoModal) {
                openInfoModal({
                    title: 'Помилка',
                    message: 'Не вдалося скасувати візит. Спробуйте ще раз.',
                });
            }
        }
    };

    const handleCancelModal = () => {
        setModalData(null);
    };

    const isMaster = user.role === 'MASTER' || user.role === 'master';
    const isAdmin = user.role === 'ADMIN' || user.role === 'admin';

    return (
        <div className="profile-page-background">
            <div className="profile-page-container">
                <h1 className="profile-header">
                    {isAdmin
                        ? `Панель Адміністратора: ${user.firstName || user.email}`
                        : isMaster
                            ? `Панель Майстра: ${user.firstName || user.email}`
                            : `Профіль Користувача: ${user.firstName || user.email}`}
                </h1>

                {/* Аватар */}
                <div className="profile-avatar-container">
                    <div className="profile-avatar-wrapper">
                        <img
                            src={avatarUrl}
                            alt="Аватар"
                            className="profile-avatar-img"
                        />
                    </div>
                    <label className="profile-avatar-upload-label">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                        {user.avatar || user.avatarUrl
                            ? '✏️ Змінити Аватарку'
                            : '➕ Додати Аватарку'}
                    </label>
                </div>

                {/* Особисті дані */}
                <h2 className="profile-section-title">Особисті Дані</h2>
                <div className="profile-info-card">
                    {!isEditing && (
                        <button
                            type="button"
                            className="profile-edit-button"
                            onClick={handleEditToggle}
                        >
                            ✏️ Редагувати
                        </button>
                    )}

                    <div className="profile-field">
                        <label className="profile-label">Ім&apos;я</label>
                        <input
                            type="text"
                            name="firstName"
                            value={editFormData.firstName || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            placeholder="Введіть ім&apos;я"
                            className={`profile-input ${
                                !isEditing ? 'profile-input-readonly' : ''
                            }`}
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-label">Прізвище</label>
                        <input
                            type="text"
                            name="lastName"
                            value={editFormData.lastName || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            placeholder="Введіть прізвище"
                            className={`profile-input ${
                                !isEditing ? 'profile-input-readonly' : ''
                            }`}
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-label">Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={editFormData.phone || ''}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            placeholder="+380 XX XXX XX XX"
                            className={`profile-input ${
                                !isEditing ? 'profile-input-readonly' : ''
                            }`}
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editFormData.email || ''}
                            readOnly
                            className="profile-input profile-input-email-readonly"
                        />
                    </div>

                    {isEditing && (
                        <div className="profile-actions-row">
                            <button
                                type="button"
                                className="profile-btn profile-btn-save"
                                onClick={handleSave}
                            >
                                ✅ ЗБЕРЕГТИ ЗМІНИ
                            </button>
                            <button
                                type="button"
                                className="profile-btn profile-btn-cancel"
                                onClick={handleEditToggle}
                            >
                                ❌ Скасувати
                            </button>
                        </div>
                    )}
                </div>

                {/* Візити */}
                <h2 className="profile-section-title">Мої Заплановані Візити</h2>

                {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((app) => (
                        <AppointmentCard
                            key={app.id}
                            app={app}
                            onCancelAttempt={handleCancelAttempt}
                            isCancellable={app.isCancellable}
                        />
                    ))
                ) : (
                    <p className="profile-empty-appointments">
                        Час для краси! У вас поки немає запланованих візитів.
                    </p>
                )}

                {/* Вихід */}
                <div className="profile-logout-wrapper">
                    <button
                        type="button"
                        className="profile-btn profile-btn-logout"
                        onClick={onLogout}
                    >
                        Вийти з Облікового Запису
                    </button>
                </div>

                <ConfirmationModal
                    isOpen={!!modalData}
                    title={modalData?.title || ''}
                    message={modalData?.message || ''}
                    onConfirm={handleConfirmCancel}
                    onCancel={handleCancelModal}
                />
            </div>
        </div>
    );
};

export default Profile;
