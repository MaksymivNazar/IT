// src/App.jsx (ФІНАЛЬНИЙ ВИПРАВЛЕНИЙ КОД - Усунення "білого екрану" та додано ScrollToTop)

import React, { useState, useEffect, useCallback } from 'react'; 
import { Routes, Route, useNavigate } from 'react-router-dom';

// Компоненти
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartModal from './components/CartModal.jsx'; 
import SearchModal from './components/SearchModal.jsx'; 
import ConfirmationModal from './components/ConfirmationModal'; 

// 🔥 КРИТИЧНО: ІМПОРТУЄМО ScrollToTop
import ScrollToTop from './components/ScrollToTop.jsx'; 

// Сторінки
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Masters from './pages/Masters.jsx';
import MasterDetail from './pages/MasterDetail.jsx'; 
import Auth, { 
    getCartDB, 
    getAppointmentsDB, 
    servicesData, 
    mastersData, 
    clearCart,
    getStoredToken,
    validateJWT,
    getUserFromToken,
    removeToken,
} from './pages/Auth.jsx'; 
import Profile from './pages/Profile.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import MasterDashboard from './pages/MasterDashboard.jsx'; 
import Gallery from './pages/Gallery.jsx'; 
import Contact from './pages/Contact.jsx'; 
import Appointment from './pages/Appointment.jsx'; 


// -----------------------------------------------------------------
// 1. ВБУДОВАНИЙ SuccessModal 
// -----------------------------------------------------------------
const SuccessModal = ({ data, onClose }) => {
    if (!data) return null;

    // СТИЛІ 
    const modalOverlayStyle = { 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', 
        justifyContent: 'center', alignItems: 'center', zIndex: 4000, 
    };
    const modalContentStyle = { 
        backgroundColor: 'white', padding: '30px', borderRadius: '15px', 
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', maxWidth: '350px', 
        width: '90%', textAlign: 'center', 
    };
    const detailsContainerStyle = { 
        background: '#f8f8f8', padding: '15px', borderRadius: '8px', 
        margin: '15px 0', textAlign: 'left', 
    };
    const okButtonStyle = { 
        padding: '12px 25px', background: '#d81b60', color: 'white', 
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', 
        marginTop: '10px' 
    };
    const titleStyle = { 
        color: '#d81b60', marginBottom: '15px', fontWeight: '700', 
    };
    const successIconStyle = {
        fontSize: '4rem', color: '#00cc66', 
    };


    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                
                <div style={{ marginBottom: '20px' }}>
                    <i className="fas fa-check-circle" style={successIconStyle}></i> 
                </div>
                
                <h3 style={titleStyle}>Запис Успішно Оформлено!</h3>
                
                <p style={{ color: '#333', marginBottom: '10px' }}>
                    Вітаємо, **{data.user}**! Ви записані на:
                </p>
                
                <div style={detailsContainerStyle}>
                    <p>💅 **Послуга:** {data.service}</p>
                    <p>🧑‍🎨 **Майстер:** {data.master}</p>
                    <p>🗓️ **Дата:** {data.date}</p>
                    <p>⏰ **Час:** {data.time}</p>
                </div>

                <button onClick={onClose} style={okButtonStyle}>
                    OK, ЗРОЗУМІЛО
                </button>
            </div>
        </div>
    );
};
// --- КІНЕЦЬ SuccessModal ---

// -----------------------------------------------------------------
// 2. ВБУДОВАНИЙ InfoModal 
// -----------------------------------------------------------------
const InfoModal = ({ data, onClose }) => {
    if (!data) return null;
    return (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000}}>
            <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)'}}>
                <h4 style={{color: '#d81b60'}}>{data.title}</h4>
                <p>{data.message}</p>
                <button onClick={onClose} style={{background: '#d81b60', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Закрити</button>
            </div>
        </div>
    );
};
// --- КІНЕЦЬ InfoModal ---



function App() {
    const navigate = useNavigate();
    
    // Перевіряємо JWT токен при завантаженні
    const initializeUser = () => {
        const token = getStoredToken();
        if (token && validateJWT(token)) {
            // Токен валідний, отримуємо користувача
            const userFromToken = getUserFromToken();
            if (userFromToken) {
                return userFromToken;
            }
        }
        // Якщо токен не валідний або відсутній, перевіряємо localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                return null;
            }
        }
        return null;
    };
    
    const [user, setUser] = useState(initializeUser());
    const [cart, setCart] = useState(getCartDB()); 
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [appointments, setAppointments] = useState(getAppointmentsDB()); 
    const [successModalData, setSuccessModalData] = useState(null); 
    const [infoModalData, setInfoModalData] = useState(null);

    // Функція для відкриття InfoModal
    const openInfoModal = (data) => {
        setInfoModalData(data);
    }; 

    const updateCart = useCallback(() => {
        const newCart = getCartDB();
        setCart(newCart);
        return newCart.length;
    }, []);
    
    const updateAppointments = useCallback(() => {
        setAppointments(getAppointmentsDB());
    }, []);

    // -----------------------------------------------------------------
    // ОБРОБНИКИ
    // -----------------------------------------------------------------

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        const masterProfile = mastersData.find(m => String(m.userId) === String(loggedInUser.id));
        if (masterProfile) {
            loggedInUser.masterId = masterProfile.id;
        }
        localStorage.setItem('user', JSON.stringify(loggedInUser)); 
        updateAppointments();
        updateCart();
        
        if (loggedInUser.role === 'admin') {
            navigate('/profile'); // Адміністратор переходить в профіль (можна створити окремий дашборд)
        } else if (loggedInUser.role === 'master' && masterProfile) {
            navigate('/master-dashboard');
        } else {
            navigate('/profile');
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        removeToken(); // Видаляємо JWT токен
        clearCart(); 
        setCart([]);
        navigate('/');
    };

    const handleUpdateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };
    
    const handleBookingSuccess = (newAppointment) => {
        updateAppointments(); 
        clearCart(); 
        updateCart(); 
        
        const master = mastersData.find(m => String(m.id) === String(newAppointment.masterId));
        const service = servicesData.find(s => String(s.id) === String(newAppointment.serviceId));

        setSuccessModalData({
            user: user?.firstName || 'Клієнт',
            master: master?.name || 'Невідомий Майстер',
            service: service?.name || 'Невідома Послуга',
            date: newAppointment.date,
            time: newAppointment.time,
        });
    };
    
    // -----------------------------------------------------------------
    // USE EFFECT та ПІДГОТОВКА ДАНИХ
    // -----------------------------------------------------------------

    // Імітація alert через InfoModal
        useEffect(() => {
            window.alert = (message, title = "Увага") => {
                setInfoModalData({ title, message });
            };
            
            // Додаємо функцію очищення бази даних в глобальний об'єкт для використання в консолі
            window.clearAllDB = () => {
                if (confirm('Ви впевнені, що хочете очистити всю базу даних? Це видалить всіх користувачів, записи та токени.')) {
                    localStorage.clear();
                    window.location.reload();
                }
            };

            return () => {
                delete window.alert;
                delete window.clearAllDB;
            }
        }, []);

    // Перевірка валідності токена при завантаженні та періодично
    useEffect(() => {
        const checkToken = () => {
            const token = getStoredToken();
            if (token) {
                if (!validateJWT(token)) {
                    // Токен прострочений або невалідний - виходимо
                    setUser(null);
                    localStorage.removeItem('user');
                    removeToken();
                    clearCart();
                    setCart([]);
                    navigate('/');
                }
            }
        };
        
        checkToken();
        // Перевіряємо токен кожні 5 хвилин
        const interval = setInterval(checkToken, 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, [navigate]);

    // Підготовка записів для Profile та Dashboard
    const upcomingAppointments = appointments
        .filter(app => app.status === 'pending')
        .map(app => {
            const service = servicesData.find(s => String(s.id) === String(app.serviceId));
            const master = mastersData.find(m => String(m.id) === String(app.masterId));
            return {
                ...app,
                serviceName: service?.name || 'Послуга не знайдена',
                masterName: master?.name || 'Майстер не знайдений',
                masterImage: master?.image || '',
            };
        });

    // -----------------------------------------------------------------
    // МАРШРУТИЗАЦІЯ
    // -----------------------------------------------------------------

    return (
        <div className="app">
            
            {/* 🔥 КРИТИЧНО: ScrollToTop повинен бути тут, щоб слухати зміни маршруту */}
            <ScrollToTop />
            
            {/* Header */}
            <Header 
                user={user} 
                cartCount={cart.length} 
                openCart={() => setIsCartOpen(true)}
            />
            
            <main>
                <Routes>
                    {/* ОСНОВНІ СТОРІНКИ */}
                    <Route path="/" element={<Home />} />
                    <Route 
                        path="/services" 
                        element={<Services onCartUpdate={updateCart} openInfoModal={openInfoModal} />} 
                    />
                    <Route path="/masters" element={<Masters />} /> 
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact openInfoModal={openInfoModal} />} />

                    {/* АВТОРИЗАЦІЯ ТА ПРОФІЛЬ */}
                    <Route path="/auth" element={<Auth onLogin={handleLogin} openInfoModal={openInfoModal} />} />
                    <Route 
                        path="/profile" 
                        element={
                            <Profile 
                                user={user} 
                                onLogout={handleLogout} 
                                appointments={upcomingAppointments.filter(app => String(app.userId) === String(user?.id))}
                                onUpdateAppointments={updateAppointments}
                                onUpdateUser={handleUpdateUser}
                                setSuccessModalData={setSuccessModalData}
                                openInfoModal={openInfoModal}
                            />
                        } 
                    />

                    {/* ЗАПИСИ ТА ДЕТАЛІ */}
                    <Route 
                        path="/service/:slug" 
                        element={
                            <ServiceDetail 
                                user={user} 
                                onBookingSuccess={handleBookingSuccess}
                                onCartUpdate={updateCart}
                                openInfoModal={openInfoModal}
                            />
                        } 
                    />
                    
                    {/* ДЕТАЛІ МАЙСТРА */}
                    <Route 
                        path="/master/:masterId" 
                        element={<MasterDetail onCartUpdate={updateCart} openInfoModal={openInfoModal} />} 
                    />
                    
                    {/* СТОРІНКА ЗАПИСУ (Checkout) */}
                    <Route 
                        path="/appointment" 
                        element={
                            user 
                            ? <Appointment 
                                user={user} 
                                onBookingSuccess={handleBookingSuccess} 
                              />
                            : <Auth onLogin={handleLogin} message="Для запису, будь ласка, увійдіть або зареєструйтесь."/>
                        } 
                    />

                    {/* ДАШБОРД МАЙСТРА */}
                    {user && user.role === 'master' && (
                        <Route 
                            path="/master-dashboard" 
                            element={
                                <MasterDashboard 
                                    user={user} 
                                    appointments={upcomingAppointments.filter(app => String(app.masterId) === String(user.masterId))}
                                    onUpdateAppointments={updateAppointments}
                                    openInfoModal={openInfoModal}
                                />
                            } 
                        />
                    )}
                </Routes>
            </main>
            
            {/* Footer */}
            <Footer />
            
            {/* Модальне вікно Кошика */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onCartUpdate={updateCart}
            />
            
            {/* КРАСИВИЙ МОДАЛ УСПІХУ (ВБУДОВАНИЙ) */}
            <SuccessModal 
                data={successModalData}
                onClose={() => setSuccessModalData(null)}
            />
            
            {/* Інформаційний Модал (ВБУДОВАНИЙ) */}
            <InfoModal
                data={infoModalData}
                onClose={() => setInfoModalData(null)}
            />
        </div>
    );
}

export default App;