import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartModal from './components/CartModal.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Masters from './pages/Masters.jsx';
import MasterDetail from './pages/MasterDetail.jsx';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import MasterDashboard from './pages/MasterDashboard.jsx';
import Gallery from './pages/Gallery.jsx';
import Contact from './pages/Contact.jsx';
import Appointment from './pages/Appointment.jsx';

import {
    getCurrentUser,
    getToken,
    removeToken,
} from './api/auth';
import {
    getCart,
    clearCart,
} from './api/cart';

const SuccessModal = ({ data, onClose }) => {
    if (!data) return null;
    console.log(data)
    const modalOverlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4000,
    };

    const modalContentStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        maxWidth: '350px',
        width: '90%',
        textAlign: 'center',
    };

    const detailsContainerStyle = {
        background: '#f8f8f8',
        padding: '15px',
        borderRadius: '8px',
        margin: '15px 0',
        textAlign: 'left',
    };

    const okButtonStyle = {
        padding: '12px 25px',
        background: '#d81b60',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
    };

    const titleStyle = {
        color: '#d81b60',
        marginBottom: '15px',
        fontWeight: 700,
    };

    const successIconStyle = {
        fontSize: '4rem',
        color: '#00cc66',
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{ marginBottom: '20px' }}>
                    <i className="fas fa-check-circle" style={successIconStyle} />
                </div>

                <h3 style={titleStyle}>Запис успішно оформлено!</h3>

                <p style={{ color: '#333', marginBottom: '10px' }}>
                    Вітаємо, {data.user}! Ви записані на:
                </p>

                <div style={detailsContainerStyle}>
                    <p>💅 Послуга: {data.service}</p>
                    <p>🧑‍🎨 Майстер: {data.master}</p>
                    <p>🗓️ Дата: {data.date}</p>
                    <p>⏰ Час: {data.time}</p>
                </div>

                <button onClick={onClose} style={okButtonStyle}>
                    OK
                </button>
            </div>
        </div>
    );
};

const InfoModal = ({ data, onClose }) => {
    if (!data) return null;

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000,
    };

    const contentStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '90%',
    };

    const buttonStyle = {
        background: '#d81b60',
        color: 'white',
        padding: '8px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    };

    return (
        <div style={overlayStyle}>
            <div style={contentStyle}>
                <h4 style={{ color: '#d81b60' }}>{data.title}</h4>
                <p>{data.message}</p>
                <button onClick={onClose} style={buttonStyle}>
                    Закрити
                </button>
            </div>
        </div>
    );
};

const decodeJwt = (token) => {
    try {
        const [, payloadBase64] = token.split('.');
        const payloadString = atob(
            payloadBase64.replace(/-/g, '+').replace(/_/g, '/'),
        );
        return JSON.parse(payloadString);
    } catch {
        return null;
    }
};

const isTokenExpired = (token) => {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
};

function App() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => getCurrentUser());
    const [cart, setCart] = useState(() => getCart());
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [successModalData, setSuccessModalData] = useState(null);
    const [infoModalData, setInfoModalData] = useState(null);

    const openInfoModal = (data) => {
        setInfoModalData(data);
    };

    const updateCart = useCallback(() => {
        const newCart = getCart();
        setCart(newCart);
        return newCart.length;
    }, []);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        updateCart();

        if (loggedInUser.role === 'admin') {
            navigate('/profile');
        } else if (loggedInUser.role === 'master') {
            navigate('/master-dashboard');
        } else {
            navigate('/profile');
        }
    };

    const handleLogout = () => {
        setUser(null);
        removeToken();
        clearCart();
        setCart([]);
        navigate('/');
    };

    const handleUpdateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const handleBookingSuccess = (data) => {
        setSuccessModalData({
            message: data.message,
            type: 'booking',
        });
    };

    useEffect(() => {
        const originalAlert = window.alert;

        window.alert = (message, title = 'Увага') => {
            setInfoModalData({ title, message });
        };

        window.clearAllDB = () => {
            if (
                window.confirm(
                    'Ви впевнені, що хочете очистити всю локальну базу (localStorage)?',
                )
            ) {
                localStorage.clear();
                window.location.reload();
            }
        };

        return () => {
            window.alert = originalAlert;
            delete window.clearAllDB;
        };
    }, []);

    useEffect(() => {
        const checkToken = () => {
            const token = getToken();
            if (token && isTokenExpired(token)) {
                setUser(null);
                removeToken();
                clearCart();
                setCart([]);
                navigate('/');
            }
        };

        checkToken();
        const interval = setInterval(checkToken, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="app">
            <ScrollToTop />

            <Header
                user={user}
                cartCount={cart.length}
                openCart={() => setIsCartOpen(true)}
            />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/services"
                        element={
                            <Services onCartUpdate={updateCart} openInfoModal={openInfoModal} />
                        }
                    />

                    <Route path="/masters" element={<Masters />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route
                        path="/contact"
                        element={<Contact openInfoModal={openInfoModal} />}
                    />

                    <Route
                        path="/auth"
                        element={<Auth onLogin={handleLogin} openInfoModal={openInfoModal} />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <Profile
                                user={user}
                                onLogout={handleLogout}
                                onUpdateUser={handleUpdateUser}
                                setSuccessModalData={setSuccessModalData}
                                openInfoModal={openInfoModal}
                            />
                        }
                    />

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

                    <Route
                        path="/master/:masterId"
                        element={
                            <MasterDetail
                                onCartUpdate={updateCart}
                                openInfoModal={openInfoModal}
                            />
                        }
                    />

                    <Route
                        path="/appointment"
                        element={
                            user ? (
                                <Appointment
                                    user={user}
                                    onBookingSuccess={handleBookingSuccess}
                                />
                            ) : (
                                <Auth
                                    onLogin={handleLogin}
                                    openInfoModal={openInfoModal}
                                    message="Для запису, будь ласка, увійдіть або зареєструйтесь."
                                />
                            )
                        }
                    />

                    {user?.role === 'master' && (
                        <Route
                            path="/master-dashboard"
                            element={
                                <MasterDashboard user={user} openInfoModal={openInfoModal} />
                            }
                        />
                    )}
                </Routes>
            </main>

            <Footer />

            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cart}
                onCartUpdate={updateCart}
            />

            <SuccessModal
                data={successModalData}
                onClose={() => setSuccessModalData(null)}
            />

            <InfoModal
                data={infoModalData}
                onClose={() => setInfoModalData(null)}
            />
        </div>
    );
}

export default App;
