// src/pages/Profile.jsx (ОНОВЛЕНИЙ КОД БЕЗ ЗАЙВИХ ЕМОДЗІ)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import AppointmentCard from '../components/AppointmentCard'; 
import { 
    getUsersDB, 
    saveUsersDB, 
    getAppointmentsDB, 
    updateAppointmentStatus, 
    servicesData, 
    mastersData   
} from './Auth'; 


// =================================================================
// ✨ ДИЗАЙН: СТИЛІ ДЛЯ САЛОНУ КРАСИ (Luxury/Glam)
// =================================================================

export const PALETTE = { 
    primary: '#B76E79',     
    secondary: '#D4B097',   
    accent: '#B8860B',      
    textDark: '#333333',
    textLight: '#F5F5F5',
    background: '#FFFFFF',
    error: '#C62828',
};

export const STYLES = { 
    pageContainer: {
        padding: '60px 20px',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: PALETTE.background,
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
    },
    header: {
        color: PALETTE.primary,
        fontSize: '2.5rem',
        textAlign: 'center',
        marginBottom: '40px',
    },
    sectionTitle: {
        color: PALETTE.textDark,
        fontSize: '1.8rem',
        marginTop: '50px',
        marginBottom: '20px',
        borderBottom: `2px solid ${PALETTE.secondary}`,
        paddingBottom: '10px',
    },
    profileInfo: {
        background: '#fcfcfc',
        border: `1px solid ${PALETTE.secondary}`,
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        position: 'relative',
    },
    label: {
        fontWeight: 'bold',
        color: PALETTE.textDark,
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: `1px solid ${PALETTE.secondary}`,
        borderRadius: '6px',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    baseButton: {
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        border: 'none',
    },
    logoutButton: {
        backgroundColor: PALETTE.error,
        color: PALETTE.textLight,
        fontSize: '1.1rem',
    },
    editButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: PALETTE.secondary,
        color: PALETTE.textDark,
        padding: '8px 15px',
        borderRadius: '6px',
        cursor: 'pointer',
        border: 'none',
        fontWeight: 'bold', // 💡 ДОДАНО: Для кращого вигляду без іконки
    },
    saveButton: {
        background: PALETTE.primary,
        color: PALETTE.textLight,
        marginTop: '20px',
        alignSelf: 'flex-start',
    },
    cancelAppointmentButton: { 
        background: PALETTE.error,
        color: PALETTE.textLight,
        padding: '8px 15px',
        borderRadius: '6px',
        cursor: 'pointer',
        border: 'none',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    },
    cancellationImpossibleText: { 
        color: PALETTE.error, 
        fontSize: '0.9rem', 
        textAlign: 'center',
        marginTop: '10px'
    },
    appointmentTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: PALETTE.primary,
        margin: 0,
        gridColumn: '1 / 3',
    },
    appointmentInfo: {
        margin: '5px 0',
        color: PALETTE.textDark,
    },
    appointmentStatus: (status) => ({
        margin: '5px 0 5px 0', 
        fontWeight: 'bold',
        fontSize: '0.9rem',
        padding: '2px 8px',
        borderRadius: '4px',
        display: 'inline-block',
        backgroundColor: status === 'Заплановано' ? PALETTE.secondary : (status === 'Скасовано' ? PALETTE.error : (status === 'Виконано' ? '#4CAF50' : 'transparent')),
        color: status === 'Заплановано' ? PALETTE.textDark : (status === 'Скасовано' ? PALETTE.textLight : (status === 'Виконано' ? PALETTE.textLight : PALETTE.textDark)),
    }),
    appointmentItem: {
         border: `1px solid ${PALETTE.secondary}`,
         padding: '20px',
         borderRadius: '12px',
         marginBottom: '15px',
         display: 'grid',
         gridTemplateColumns: '1fr 150px',
         gap: '10px',
         alignItems: 'center',
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
    },
    avatar: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: `4px solid ${PALETTE.primary}`,
        marginBottom: '15px',
    },
    avatarUploadLabel: {
        cursor: 'pointer',
        color: PALETTE.primary,
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
};


const Profile = ({ user, onLogout, onUpdateUser, setSuccessModalData }) => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || 'https://i.ibb.co/L5r0sLw/default-avatar.png');

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [modalData, setModalData] = useState(null); 

    // Функції пошуку даних
    const findService = (id) => servicesData.find(s => s.id === id);
    const findMaster = (id) => mastersData.find(m => m.id === id);


    const loadAppointments = useCallback(() => {
        if (user) {
            const allAppointments = getAppointmentsDB();
            const userAppointments = allAppointments
                .filter(app => String(app.userId) === String(user.id))
                .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
            
            // Збагачуємо дані про візити
            const enrichedAppointments = userAppointments.map(app => {
                const service = findService(app.serviceId);
                const master = findMaster(app.masterId);
                
                const appointmentDateTime = new Date(`${app.date} ${app.time}`);
                const now = new Date();
                const timeDifferenceHours = (appointmentDateTime.getTime() - now.getTime()) / 3600000; 

                return {
                    ...app,
                    service: service,
                    master: master,
                    statusText: app.status || 'Заплановано', 
                    isUpcoming: appointmentDateTime > now,
                    // Можливість скасування лише, якщо до візиту > 4 годин
                    isCancellable: timeDifferenceHours > 4, 
                };
            }).filter(app => app.isUpcoming && app.status !== 'Скасовано'); // Фільтруємо лише майбутні та нескасовані

            setUpcomingAppointments(enrichedAppointments);
        }
    }, [user]);

    useEffect(() => {
        loadAppointments();
        if (user) {
             setEditFormData({
                 firstName: user.firstName || '',
                 lastName: user.lastName || '',
                 phone: user.phone || '',
                 email: user.email || '',
               });
             setAvatarUrl(user.avatar || 'https://i.ibb.co/L5r0sLw/default-avatar.png');
        }
    }, [user, loadAppointments]);


    if (!user) {
        navigate('/auth');
        return null;
    }
    
    // --- ЛОГІКА РЕДАГУВАННЯ ДАНИХ ---
    const handleEditToggle = () => {
        if (isEditing) {
            setEditFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                email: user.email || '',
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSave = () => {
        const updatedUser = { ...user, ...editFormData, avatar: avatarUrl };
        saveUsersDB(updatedUser);
        if (onUpdateUser) {
            onUpdateUser(updatedUser);
        }
        setIsEditing(false);
        alert("Дані профілю успішно оновлено!");
    };
    
    // --- ЛОГІКА АВАТАРКИ ---
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newAvatarUrl = URL.createObjectURL(file);
            setAvatarUrl(newAvatarUrl); 
            const updatedUser = { ...user, avatar: newAvatarUrl };
            saveUsersDB(updatedUser);
            if (onUpdateUser) {
                onUpdateUser(updatedUser);
            }
            alert("Аватарку оновлено! (Імітація)"); 
        }
    };


    // --- ЛОГІКА СКАСУВАННЯ ВІЗИТУ ---
    const handleCancelAttempt = (appointmentId) => {
        setModalData({
            title: "Скасувати Запис?",
            message: "Ви впевнені, що хочете скасувати цей візит? Цю дію не можна буде скасувати.",
            appointmentId: appointmentId,
        });
    };

    const handleConfirmCancel = () => {
        if (modalData?.appointmentId) {
            updateAppointmentStatus(modalData.appointmentId, 'Скасовано'); 
            setModalData(null); 
            loadAppointments(); 
            
            if (setSuccessModalData) {
                setSuccessModalData({
                    user: user.firstName, 
                    message: "Ваш візит було успішно скасовано.",
                    type: 'cancellation'
                });
            }
        }
    };

    const handleCancelModal = () => {
        setModalData(null);
    };

    const isMaster = user.role === 'master';

    return (
        <div style={STYLES.pageContainer}>
            <h1 style={STYLES.header}>
                {isMaster ? `Панель Майстра: ${user.firstName}` : `Профіль Користувача: ${user.firstName}`}
            </h1>
            
            {/* БЛОК АВАТАРКИ */}
            <div style={STYLES.avatarContainer}>
                <img src={avatarUrl} alt="Аватар" style={STYLES.avatar} />
                <label style={STYLES.avatarUploadLabel}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        style={{ display: 'none' }}
                    />
                    {user.avatar ? 'Змінити Аватарку' : 'Додати Аватарку'}
                </label>
            </div>


            {/* Блок Редагування Даних */}
            <h2 style={STYLES.sectionTitle}>Особисті Дані</h2>
            <div style={STYLES.profileInfo}>
                
                {!isEditing && (
                    <button onClick={handleEditToggle} style={STYLES.editButton} title="Редагувати">
                                Редагувати
                    </button>
                )}

                {/* Поля форми */}
                <div>
                    <label style={STYLES.label}>Ім'я:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        style={{ ...STYLES.input, ...(isEditing ? {} : { border: 'none', background: 'none' }) }}
                    />
                </div>
                <div>
                    <label style={STYLES.label}>Прізвище:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        style={{ ...STYLES.input, ...(isEditing ? {} : { border: 'none', background: 'none' }) }}
                    />
                </div>
                <div>
                    <label style={STYLES.label}>Телефон:</label>
                    <input
                        type="text"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        style={{ ...STYLES.input, ...(isEditing ? {} : { border: 'none', background: 'none' }) }}
                    />
                </div>
                <div>
                    <label style={STYLES.label}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        readOnly
                        style={{ ...STYLES.input, border: 'none', background: 'none' }}
                    />
                </div>
                
                {/* Кнопки Зберегти / Скасувати */}
                {isEditing && (
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button onClick={handleSave} style={{ ...STYLES.baseButton, ...STYLES.saveButton }}>
                            ЗБЕРЕГТИ ЗМІНИ
                        </button>
                        <button onClick={handleEditToggle} style={{ ...STYLES.baseButton, background: '#ccc', color: '#333' }}>
                            Скасувати
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Блок Мої Візити */}
            <h2 style={STYLES.sectionTitle}>Мої Заплановані Візити</h2>

            {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => (
                    <AppointmentCard 
                        key={app.id}
                        app={app}
                        onCancelAttempt={handleCancelAttempt} 
                        isCancellable={app.isCancellable}
                    />
                ))
            ) : (
                <p style={{
                    textAlign: 'center',
                    color: PALETTE.primary,
                    padding: '30px',
                    border: `2px dashed ${PALETTE.secondary}`,
                    borderRadius: '8px',
                    fontSize: '1.1rem'
                }}>
                    Час для краси! У вас поки немає запланованих візитів.
                </p>
            )}

            {/* 3. Кнопка Виходу */}
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <button
                    onClick={onLogout}
                    style={{ ...STYLES.baseButton, ...STYLES.logoutButton }}
                >
                    Вийти з Облікового Запису
                </button>
            </div>

            {/* Модальне вікно підтвердження */}
            <ConfirmationModal
                isOpen={!!modalData}
                title={modalData?.title || ''}
                message={modalData?.message || ''}
                onConfirm={handleConfirmCancel}
                onCancel={handleCancelModal}
            />

        </div>
    );
};

export default Profile;