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
    mastersData,
    updateJWTToken
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
        padding: '40px 20px',
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundImage: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 240, 250, 0.85) 50%, rgba(255, 230, 245, 0.9) 100%), url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: '100vh',
        position: 'relative',
        width: '100%',
    },
    header: {
        color: '#d81b60',
        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
        textAlign: 'center',
        marginBottom: '40px',
        fontWeight: 700,
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
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px',
        position: 'relative',
        transition: 'all 0.3s ease',
    },
    label: {
        fontWeight: 'bold',
        color: PALETTE.textDark,
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff',
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
        background: '#d81b60',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        border: 'none',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(216, 27, 96, 0.3)',
    },
    saveButton: {
        background: '#d81b60',
        color: 'white',
        marginTop: '20px',
        padding: '12px 30px',
        fontSize: '1rem',
        boxShadow: '0 4px 15px rgba(216, 27, 96, 0.4)',
        transition: 'all 0.3s ease',
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
        marginBottom: '40px',
        padding: '30px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    avatar: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid #d81b60',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(216, 27, 96, 0.3)',
        transition: 'transform 0.3s ease',
    },
    avatarUploadLabel: {
        cursor: 'pointer',
        color: '#d81b60',
        fontWeight: 600,
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #d81b60',
        transition: 'all 0.3s ease',
        display: 'inline-block',
    },
};


const Profile = ({ user, onLogout, onUpdateUser, setSuccessModalData, openInfoModal }) => {
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
        try {
            const updatedUser = { ...user, ...editFormData, avatar: avatarUrl };
            
            // Отримуємо всіх користувачів з бази
            const users = getUsersDB();
            
            // Знаходимо індекс поточного користувача
            const userIndex = users.findIndex(u => String(u.id) === String(user.id));
            
            if (userIndex !== -1) {
                // Оновлюємо користувача в масиві
                users[userIndex] = updatedUser;
                // Зберігаємо оновлений масив користувачів
                saveUsersDB(users);
            } else {
                // Якщо користувача не знайдено, додаємо його
                saveUsersDB([...users, updatedUser]);
            }
            
            // Оновлюємо JWT токен з новими даними
            updateJWTToken(updatedUser);
            
            // Оновлюємо localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            if (onUpdateUser) {
                onUpdateUser(updatedUser);
            }
            setIsEditing(false);
            
            // Використовуємо openInfoModal або window.alert
            if (openInfoModal) {
                openInfoModal({ 
                    title: "Профіль оновлено! ✅", 
                    message: "Дані профілю успішно оновлено та збережено в JWT токені!" 
                });
            } else if (window.alert) {
                window.alert("Дані профілю успішно оновлено та збережено в JWT токені!");
            }
        } catch (error) {
            console.error('Помилка при збереженні профілю:', error);
            if (openInfoModal) {
                openInfoModal({ 
                    title: "Помилка ❌", 
                    message: 'Помилка при збереженні профілю. Спробуйте ще раз.' 
                });
            } else if (window.alert) {
                window.alert('Помилка при збереженні профілю. Спробуйте ще раз.');
            }
        }
    };
    
    // --- ЛОГІКА АВАТАРКИ ---
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const newAvatarUrl = URL.createObjectURL(file);
                setAvatarUrl(newAvatarUrl); 
                const updatedUser = { ...user, avatar: newAvatarUrl };
                
                // Отримуємо всіх користувачів з бази
                const users = getUsersDB();
                
                // Знаходимо індекс поточного користувача
                const userIndex = users.findIndex(u => String(u.id) === String(user.id));
                
                if (userIndex !== -1) {
                    // Оновлюємо користувача в масиві
                    users[userIndex] = updatedUser;
                    // Зберігаємо оновлений масив користувачів
                    saveUsersDB(users);
                } else {
                    // Якщо користувача не знайдено, додаємо його
                    saveUsersDB([...users, updatedUser]);
                }
                
                // Оновлюємо JWT токен з новою аватаркою
                updateJWTToken(updatedUser);
                
                // Оновлюємо localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                if (onUpdateUser) {
                    onUpdateUser(updatedUser);
                }
                // Використовуємо openInfoModal або window.alert
                if (openInfoModal) {
                    openInfoModal({ 
                        title: "Аватар оновлено! 📸", 
                        message: "Аватарку оновлено та збережено в JWT токені!" 
                    });
                } else if (window.alert) {
                    window.alert("Аватарку оновлено та збережено в JWT токені!");
                }
            } catch (error) {
                console.error('Помилка при зміні аватарки:', error);
                if (window.alert) {
                    window.alert('Помилка при зміні аватарки. Спробуйте ще раз.');
                }
            }
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
    const isAdmin = user.role === 'admin';

    const marbleBackgroundUrl = 'https://abrakadabra.fun/uploads/posts/2022-01/1642320157_1-abrakadabra-fun-p-krasivii-mramornii-fon-1.jpg';

    return (
        <div style={{ 
            width: '100%', 
            minHeight: '100vh',
            backgroundImage: `url('${marbleBackgroundUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
        }}>
            <div style={STYLES.pageContainer}>
            <h1 style={STYLES.header}>
                {isAdmin ? `Панель Адміністратора: ${user.firstName}` : isMaster ? `Панель Майстра: ${user.firstName}` : `Профіль Користувача: ${user.firstName}`}
            </h1>
            
            {/* БЛОК АВАТАРКИ */}
            <div style={STYLES.avatarContainer}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                        src={avatarUrl} 
                        alt="Аватар" 
                        style={STYLES.avatar}
                        onMouseEnter={(e) => {
                            if (!isEditing) {
                                e.target.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    />
                    {isEditing && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: '50%',
                            width: '150px',
                            height: '150px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none'
                        }}>
                            <span style={{ color: 'white', fontSize: '0.9rem' }}>📷</span>
                        </div>
                    )}
                </div>
                <label 
                    style={{
                        ...STYLES.avatarUploadLabel,
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#d81b60';
                        e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#d81b60';
                    }}
                >
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        style={{ display: 'none' }}
                    />
                    {user.avatar ? '✏️ Змінити Аватарку' : '➕ Додати Аватарку'}
                </label>
            </div>


            {/* Блок Редагування Даних */}
            <h2 style={STYLES.sectionTitle}>Особисті Дані</h2>
            <div style={STYLES.profileInfo}>
                
                {!isEditing && (
                    <button 
                        onClick={handleEditToggle} 
                        style={STYLES.editButton} 
                        title="Редагувати"
                        onMouseEnter={(e) => {
                            e.target.style.background = '#a01346';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(216, 27, 96, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#d81b60';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(216, 27, 96, 0.3)';
                        }}
                    >
                        ✏️ Редагувати
                    </button>
                )}

                {/* Поля форми */}
                <div style={{ gridColumn: 'span 1' }}>
                    <label style={{ ...STYLES.label, marginBottom: '8px', display: 'block', fontSize: '0.9rem', color: '#666' }}>Ім'я</label>
                    <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Введіть ім'я"
                        style={{ 
                            ...STYLES.input, 
                            ...(isEditing ? { 
                                border: '2px solid #d81b60',
                                backgroundColor: '#fff',
                            } : { 
                                border: 'none', 
                                background: 'transparent',
                                padding: '8px 0',
                                cursor: 'default'
                            }) 
                        }}
                        onFocus={(e) => {
                            if (isEditing) {
                                e.target.style.borderColor = '#d81b60';
                                e.target.style.boxShadow = '0 0 0 3px rgba(216, 27, 96, 0.1)';
                            }
                        }}
                        onBlur={(e) => {
                            if (isEditing) {
                                e.target.style.borderColor = '#ddd';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                    <label style={{ ...STYLES.label, marginBottom: '8px', display: 'block', fontSize: '0.9rem', color: '#666' }}>Прізвище</label>
                    <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="Введіть прізвище"
                        style={{ 
                            ...STYLES.input, 
                            ...(isEditing ? { 
                                border: '2px solid #d81b60',
                                backgroundColor: '#fff',
                            } : { 
                                border: 'none', 
                                background: 'transparent',
                                padding: '8px 0',
                                cursor: 'default'
                            }) 
                        }}
                        onFocus={(e) => {
                            if (isEditing) {
                                e.target.style.borderColor = '#d81b60';
                                e.target.style.boxShadow = '0 0 0 3px rgba(216, 27, 96, 0.1)';
                            }
                        }}
                        onBlur={(e) => {
                            if (isEditing) {
                                e.target.style.borderColor = '#ddd';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                    <label style={{ ...STYLES.label, marginBottom: '8px', display: 'block', fontSize: '0.9rem', color: '#666' }}>Телефон</label>
                    <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        placeholder="+380 XX XXX XX XX"
                        style={{ 
                            ...STYLES.input, 
                            ...(isEditing ? { 
                                border: '2px solid #d81b60',
                                backgroundColor: '#fff',
                            } : { 
                                border: 'none', 
                                background: 'transparent',
                                padding: '8px 0',
                                cursor: 'default'
                            }) 
                        }}
                        onFocus={(e) => {
                            if (isEditing) {
                                e.target.style.borderColor = '#d81b60';
                                e.target.style.boxShadow = '0 0 0 3px rgba(216, 27, 96, 0.1)';
                            }
                        }}
                        onBlur={(e) => {
                            if (isEditing) {
                                e.target.style.borderColor = '#ddd';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    />
                </div>
                <div style={{ gridColumn: 'span 1' }}>
                    <label style={{ ...STYLES.label, marginBottom: '8px', display: 'block', fontSize: '0.9rem', color: '#666' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        readOnly
                        style={{ 
                            ...STYLES.input, 
                            border: 'none', 
                            background: 'transparent',
                            padding: '8px 0',
                            cursor: 'not-allowed',
                            color: '#999'
                        }}
                    />
                </div>
                
                {/* Кнопки Зберегти / Скасувати */}
                {isEditing && (
                    <div style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        marginTop: '20px',
                        gridColumn: 'span 2',
                        justifyContent: 'flex-start'
                    }}>
                        <button 
                            onClick={handleSave} 
                            style={{ 
                                ...STYLES.baseButton, 
                                ...STYLES.saveButton 
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#a01346';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = '#d81b60';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            ✅ ЗБЕРЕГТИ ЗМІНИ
                        </button>
                        <button 
                            onClick={handleEditToggle} 
                            style={{ 
                                ...STYLES.baseButton, 
                                background: '#f0f0f0', 
                                color: '#333',
                                border: '1px solid #ddd',
                                padding: '12px 30px',
                                fontSize: '1rem',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#e0e0e0';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = '#f0f0f0';
                            }}
                        >
                            ❌ Скасувати
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
        </div>
    );
};

export default Profile;