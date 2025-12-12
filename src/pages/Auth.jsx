import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, registerApi } from '../api/auth.js';
import '../styles/Auth.css';

const Auth = ({ onLogin, openInfoModal }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    }, [isRegistering]);

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (isRegistering) {
                await registerApi({
                    firstName: formData.firstName,
                    email: formData.email,
                    password: formData.password,
                });

                const { user } = await loginApi({
                    email: formData.email,
                    password: formData.password,
                });

                if (openInfoModal) {
                    openInfoModal({
                        title: 'Реєстрація успішна! 🎉',
                        message: `Ласкаво просимо, ${user.email}! Ви успішно зареєстровані й увійшли в систему.`,
                        type: 'success',
                    });
                }

                if (onLogin) {
                    onLogin(user);
                }

                const targetPath = user.role === 'MASTER' ? '/master-dashboard' : '/profile';
                navigate(targetPath);
            } else {
                const { user } = await loginApi({
                    email: formData.email,
                    password: formData.password,
                });

                if (onLogin) {
                    onLogin(user);
                }

                const targetPath = user.role === 'MASTER' ? '/master-dashboard' : '/profile';
                navigate(targetPath);
            }
        } catch (err) {
            setError(err.message || 'Сталася помилка при авторизації.');
            console.error('Auth error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(prev => !prev);
        setError('');
        setFormData({ firstName: '', email: '', password: '' });
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-page">
                <div className={`auth-card ${isAnimating ? 'auth-card--animating' : ''}`}>
                    <h1 className="auth-title">
                        {isRegistering ? 'Реєстрація' : 'Вхід'}
                    </h1>

                    {error && <p className="auth-error">{error}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {isRegistering && (
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Ім'я (напр. Ірина)"
                                required
                                className="auth-input"
                            />
                        )}

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email (напр. client@test.ua)"
                            required
                            className="auth-input"
                        />

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Пароль (напр. 123)"
                            required
                            className="auth-input"
                        />

                        <button
                            type="submit"
                            className="auth-main-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (isRegistering ? 'Реєструємо...' : 'Входимо...')
                                : (isRegistering ? 'ЗАРЕЄСТРУВАТИСЯ' : 'УВІЙТИ')}
                        </button>
                    </form>

                    <p className="auth-toggle-text">
                        {isRegistering ? 'Вже маєте акаунт?' : 'Не маєте акаунту?'}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="auth-toggle-button"
                        >
                            {isRegistering ? 'Увійти' : 'Реєстрація'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
