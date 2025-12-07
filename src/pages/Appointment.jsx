// src/pages/Appointment.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 🔥 КРИТИЧНЕ ВИПРАВЛЕННЯ: ІМПОРТУЄМО ДАНІ ТА ФУНКЦІЇ З Auth
import { servicesData, mastersData, saveAppointment, getCartDB, clearCart, getAppointmentsDB } from './Auth'; 


// Допоміжна функція для генерації доступних слотів на основі графіка майстра
const generateTimeSlots = (master, selectedDate, existingAppointments = []) => {
    if (!master || !selectedDate) return [];
    
    // Отримуємо день тижня
    const date = new Date(selectedDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];
    
    // Завантажуємо графік з localStorage або використовуємо графік з профілю майстра
    const savedSchedule = localStorage.getItem(`master_schedule_${master.id}`);
    const masterSchedule = savedSchedule ? JSON.parse(savedSchedule) : (master.schedule || {});
    
    // Перевіряємо, чи майстер працює в цей день
    const daySchedule = masterSchedule[dayName];
    if (!daySchedule || !daySchedule.isWorking) return [];
    
    // Парсимо час початку та кінця
    const [startHour, startMin] = daySchedule.start.split(':').map(Number);
    const [endHour, endMin] = daySchedule.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Генеруємо всі можливі слоти (кожні 60 хвилин)
    const slots = [];
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        const timeSlot = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        slots.push(timeSlot);
    }
    
    // Фільтруємо зайняті слоти
    const bookedSlots = existingAppointments
        .filter(app => 
            String(app.masterId) === String(master.id) && 
            app.date === selectedDate &&
            app.status !== 'Скасовано' &&
            app.status !== 'cancelled'
        )
        .map(app => app.time);
    
    return slots.filter(slot => !bookedSlots.includes(slot));
};

const Appointment = ({ user, onBookingSuccess }) => {
  const navigate = useNavigate();
  
  // 1. СТАН: Ініціалізація
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]); 
  const [selectedCartItem, setSelectedCartItem] = useState(null); 
  const [currentService, setCurrentService] = useState(null);
  const [availableMasters, setAvailableMasters] = useState([]);
  const [selectedMasterId, setSelectedMasterId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [existingAppointments, setExistingAppointments] = useState([]);

  // 2. useEffect для ініціалізації кошика та записів
  useEffect(() => {
    const items = getCartDB();
    setCartItems(items);
    
    // Завантажуємо існуючі записи для перевірки доступності слотів
    const appointments = getAppointmentsDB();
    setExistingAppointments(appointments);
    
    // Якщо в кошику є послуги, встановлюємо першу як обрану
    if (items.length > 0) {
        setSelectedCartItem(items[0].id);
    }
  }, []);

  // 3. useEffect для оновлення поточної послуги та майстрів
  useEffect(() => {
    const service = servicesData.find(s => s.id === selectedCartItem);
    setCurrentService(service);

    if (service) {
        const masters = mastersData.filter(m => m.services.includes(service.id));
        setAvailableMasters(masters);
        // Скидаємо вибір майстра, якщо послуга змінилася
        setSelectedMasterId(''); 
    } else {
        setAvailableMasters([]);
    }
    
    // Скидаємо кроки при зміні послуги
    if (step > 1) setStep(1); 
    
  }, [selectedCartItem]);

  // 4. Обробник Бронювання (КЛЮЧОВИЙ ФІКС)
  const handleBooking = () => {
    if (!currentService || !selectedMasterId || !selectedDate || !selectedTime) {
        // Використовуємо window.alert, який перехоплюється в App.jsx
        window.alert("Будь ласка, оберіть послугу, майстра, дату та час.");
        return;
    }

    const newAppointment = {
        // 🔥 КРИТИЧНЕ ВИПРАВЛЕННЯ: Додаємо ID користувача
        userId: user.id, 
        serviceId: currentService.id,
        masterId: selectedMasterId,
        date: selectedDate,
        time: selectedTime,
    };
    
    // Зберігаємо запис у сховище
    const savedAppointment = saveAppointment(newAppointment);

    // Викликаємо зовнішній обробник успіху (це відкриє модал)
    onBookingSuccess(savedAppointment);
    
    // Перенаправляємо на головну
    navigate('/'); 
  };
  
  // ... (решта коду компонента Appointment: стилі, рендеринг)
  
    // 5. Стилі
    const pageContainerStyle = { 
        padding: '40px 20px', 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundImage: `radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(240, 245, 255, 0.85) 50%, rgba(230, 240, 255, 0.9) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
    };
    const stepContainerStyle = { 
        padding: '30px', 
        border: '1px solid #eee', 
        borderRadius: '10px', 
        marginBottom: '40px', 
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
    };
    const bookButtonStyle = {
        background: '#d81b60', 
        color: 'white', 
        padding: '15px 30px', 
        border: 'none', 
        borderRadius: '8px', 
        fontSize: '1.2rem', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        marginTop: '20px',
        marginRight: '15px',
        transition: 'background 0.2s'
    };
    const prevButtonStyle = {
        background: '#aaa', 
        color: 'white', 
        padding: '10px 20px', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer',
        transition: 'background 0.2s'
    };
    const masterCardStyle = (masterId) => ({
        border: selectedMasterId === masterId ? '3px solid #d81b60' : '1px solid #ddd',
        padding: '15px',
        borderRadius: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background-color 0.2s',
        backgroundColor: selectedMasterId === masterId ? '#fff3f7' : 'white',
    });
    const masterImageStyle = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '10px',
    };
    const inputStyle = {
        width: '100%', 
        padding: '12px', 
        marginBottom: '15px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        boxSizing: 'border-box'
    };
    const sectionTitleStyle = { color: '#d81b60', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' };

    // Отримуємо обраного майстра та генеруємо доступні слоти
    const selectedMaster = mastersData.find(m => m.id === selectedMasterId);
    const availableTimes = selectedMaster && selectedDate 
        ? generateTimeSlots(selectedMaster, selectedDate, existingAppointments)
        : []; 
    const availableSlotStyle = { padding: '8px 15px', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer', background: '#f8f8f8' };
    const selectedSlotStyle = { ...availableSlotStyle, background: '#d81b60', color: 'white', fontWeight: 'bold' };

    // 6. Умовний рендеринг: Якщо кошик порожній
    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ 
                padding: '60px 20px', 
                textAlign: 'center',
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(240, 245, 255, 0.9)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
            }}>
                <h2 style={{ color: '#d81b60' }}>Кошик Порожній</h2>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    Додайте послуги, щоб продовжити запис.
                </p>
                <button 
                    onClick={() => navigate('/services')} 
                    style={{ ...bookButtonStyle, marginRight: 0, marginTop: '30px' }}
                >
                    Перейти до Послуг
                </button>
            </div>
        );
    }

    // 7. Основний рендеринг
    return (
        <div style={{ 
            width: '100%', 
            minHeight: '100vh',
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className="container" style={pageContainerStyle}>
            <h1 style={{ color: '#d81b60', marginBottom: '40px', textAlign: 'center' }}>
                Оформлення Запису ({cartItems.length} {cartItems.length === 1 ? 'Послуга' : 'Послуги'})
            </h1>
            
            {/* Крок 1: Вибір Послуги (Якщо більше однієї) */}
            {step >= 1 && (
                <div style={stepContainerStyle}>
                    <h2 style={sectionTitleStyle}>Крок 1: Оберіть Послугу</h2>
                    
                    {cartItems.length > 1 ? (
                        <select
                            value={selectedCartItem || ''}
                            onChange={(e) => setSelectedCartItem(Number(e.target.value))}
                            style={inputStyle}
                        >
                            {cartItems.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} ({item.price} грн)
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            Обрана послуга: {currentService?.name}
                        </p>
                    )}
                    
                    {/* Кнопка "Далі" для Кроку 1 */}
                    {currentService && (
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <button onClick={() => setStep(2)} style={bookButtonStyle}>
                                Далі: Вибір Майстра
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Крок 2: Вибір Майстра, Дати та Часу */}
            {step >= 2 && currentService && (
                <div style={stepContainerStyle}>
                    <h2 style={sectionTitleStyle}>Крок 2: Майстер та Час</h2>
                    
                    {/* Вибір Майстра */}
                    <h3 style={{ color: '#333', marginBottom: '15px' }}>Оберіть Майстра</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        {availableMasters.map(master => (
                            <div 
                                key={master.id}
                                style={masterCardStyle(master.id)}
                                onClick={() => setSelectedMasterId(master.id)}
                            >
                                <img src={master.image} alt={master.name} style={masterImageStyle} />
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{master.name}</p>
                                <p style={{ margin: '3px 0 0 0', fontSize: '0.9rem', color: '#777' }}>{master.role}</p>
                            </div>
                        ))}
                    </div>

                    {/* Вибір Дати (показуємо, якщо обрано Майстра) */}
                    {selectedMasterId && (
                        <>
                            <h3 style={{ color: '#333', marginBottom: '15px' }}>Оберіть Дату</h3>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedTime(''); // Скидаємо час при зміні дати
                                }}
                                // Мінімальна дата - сьогодні
                                min={new Date().toISOString().split('T')[0]} 
                                style={inputStyle}
                            />
                            
                            {selectedDate && (
                                <>
                                    {/* Вибір Часу */}
                                    <h3 style={{ color: '#333', marginBottom: '15px' }}>Оберіть Час</h3>
                                    {availableTimes.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {availableTimes.map(time => (
                                                <button
                                                    key={time}
                                                    style={selectedTime === time ? selectedSlotStyle : availableSlotStyle}
                                                    onClick={() => setSelectedTime(time)}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#d81b60', padding: '15px', background: '#fff3f7', borderRadius: '8px' }}>
                                            На жаль, вільних слотів на цю дату немає. Оберіть іншу дату.
                                        </p>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* Кнопки Навігації для Кроку 2 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                        <button onClick={() => setStep(1)} style={prevButtonStyle}>
                            ← Назад
                        </button>
                        {selectedMasterId && selectedDate && selectedTime && (
                            <button onClick={() => setStep(3)} style={bookButtonStyle}>
                                Далі: Підтвердження
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {/* Крок 3: Підтвердження */}
            {step >= 3 && currentService && selectedMasterId && selectedDate && selectedTime && (
                <div style={stepContainerStyle}>
                    <h2 style={{ color: '#d81b60', marginBottom: '30px' }}>Крок 3: Підтвердження</h2>
                    <div style={{ border: '2px dashed #d81b60', padding: '30px', borderRadius: '15px', marginBottom: '30px', background: '#fff3f7' }}>
                        <p style={{ fontSize: '1.4rem', margin: '5px 0' }}>**Послуга:** {currentService.name}</p>
                        <p style={{ fontSize: '1.4rem', margin: '5px 0' }}>**Майстер:** {mastersData.find(m => m.id === selectedMasterId).name}</p>
                        <p style={{ fontSize: '1.4rem', margin: '5px 0' }}>**Дата:** {selectedDate}</p>
                        <p style={{ fontSize: '1.4rem', margin: '5px 0' }}>**Час:** {selectedTime}</p>
                        <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#d81b60', marginTop: '20px' }}>
                            До оплати: {currentService.price} грн
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleBooking} 
                        style={bookButtonStyle}
                    >
                        ПІДТВЕРДИТИ ЗАПИС
                    </button>
                    <button 
                        onClick={() => setStep(2)} 
                        style={{ ...prevButtonStyle, marginLeft: '15px' }}
                    >
                        ← Змінити
                    </button>
                </div>
            )}
            </div>
        </div>
    );
};

export default Appointment;