// src/pages/Home.jsx (ПОВНИЙ КОД БЕЗ СЕКЦІЇ CTA)

import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData, mastersData } from '../data'; // Припускаємо, що data.js містить ці дані

// 🚀 Імітаційні дані для динамічних відгуків
const reviewsData = [
    { id: 1, text: "Неймовірно! Стрижка ідеальна, майстер Олена просто чарівниця. Обов'язково повернуся!", author: "Оксана К.", rating: 5 },
    { id: 2, text: "Дуже задоволена манікюром, тримається вже третій тиждень без сколів. Сервіс на найвищому рівні.", author: "Ірина Л.", rating: 5 },
    { id: 3, text: "Вперше був на корекції бороди. Майстер Максим знає свою справу! Рекомендую.", author: "Андрій В.", rating: 5 },
    { id: 4, text: "Фарбування AirTouch перевершило всі очікування. Колір – мрія! Дякую команді TOP BEAUTY.", author: "Вікторія Р.", rating: 5 },
    { id: 5, text: "Завжди приємна атмосфера і якісні послуги. Це мій улюблений салон.", author: "Марина З.", rating: 5 },
];


const Home = () => {

  // Обмеження даних для відображення на головній сторінці
  const featuredServices = servicesData.slice(0, 3); 
  const featuredMasters = mastersData.slice(0, 3);
  
  // ✅ URL мармурового фону
  const marbleBackgroundUrl = 'https://abrakadabra.fun/uploads/posts/2022-01/1642320157_1-abrakadabra-fun-p-krasivii-mramornii-fon-1.jpg';
  
  // Стилі для секцій з мармуровим фоном
  const marbleSectionStyle = {
    backgroundImage: `url('${marbleBackgroundUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 20px', 
    textAlign: 'center',
    color: '#333' // Темний текст для контрасту
  };

  // --- Секція відгуків (ваш оригінальний код) ---
  const reviewsSectionStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://homeinteriors.com.ua/wp-content/uploads/2023/09/interyer-salonu-krasy-loft.jpg')`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundAttachment: 'fixed', 
    padding: '80px 0', 
    overflow: 'hidden', 
  };
  
  const reviewsContainerStyle = {
    display: 'flex',
    gap: '30px',
    padding: '20px 0', 
    animation: 'scrollReviews 30s linear infinite', 
  };

  const reviewCardStyle = {
    flex: '0 0 auto', 
    width: '350px', 
    padding: '30px',
    background: 'white', 
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.3)', 
    textAlign: 'center',
    color: '#333',
  };


  return (
    <div>
      {/* Hero Section (БЕЗ ЗМІН) */}
      <section style={{ 
        background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover', backgroundPosition: 'center', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center'
      }}>
        <div className="animate">
          <h1 style={{ fontSize: '4rem', margin: 0 }}>TOP BEAUTY STUDIO</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Ми підкреслимо вашу унікальність</p>
          <Link to="/services" className="btn" style={{ background: '#d81b60', padding: '15px 30px', fontSize: '1.2rem', textDecoration: 'none', color: 'white', borderRadius: '8px' }}>
            Обрати Послугу
          </Link>
        </div>
      </section>

      {/* Info Section - З МАРМУРОВИМ ФОНОМ */}
      <section className="container" style={marbleSectionStyle}>
        <h2 className="animate">Чому обирають нас?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginTop: '40px' }}>
          <div className="card card-body" style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '12px' }}>
            <i className="fas fa-magic" style={{ fontSize: '2rem', color: '#d81b60', marginBottom: '10px' }}></i>
            <h3>🏆 Преміальні Матеріали</h3>
            <p>Працюємо лише з найкращими світовими брендами.</p>
          </div>
          <div className="card card-body" style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '12px' }}>
            <i className="fas fa-star" style={{ fontSize: '2rem', color: '#d81b60', marginBottom: '10px' }}></i>
            <h3>⭐ Топ-Майстри</h3>
            <p>Сертифіковані спеціалісти з багаторічним досвідом.</p>
          </div>
          <div className="card card-body" style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '12px' }}>
            <i className="fas fa-heart" style={{ fontSize: '2rem', color: '#d81b60', marginBottom: '10px' }}></i>
            <h3>💖 Індивідуальний Підхід</h3>
            <p>Створення унікального образу для кожного клієнта.</p>
          </div>
        </div>
      </section>

      {/* Featured Services Section - З МАРМУРОВИМ ФОНОМ */}
      <section style={marbleSectionStyle}>
        <h2 className="animate" style={{ marginBottom: '50px' }}>Популярні Послуги</h2>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px', 
          marginTop: '40px' 
        }}>
          {featuredServices.map(service => (
            <Link to={`/services/${service.slug}`} key={service.id} className="card" style={{ 
              textDecoration: 'none', 
              color: 'inherit', 
              textAlign: 'left', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
              transition: 'transform 0.3s',
              background: 'white' // Білий фон карткам послуг
            }}>
              <img src={service.image} alt={service.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>{service.category}</span>
                  <span style={{ color: '#d81b60', fontWeight: 'bold', fontSize: '1.2rem' }}>{service.price} грн</span>
                </div>
                <h4 style={{ margin: '0 0 10px' }}>{service.name}</h4>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{service.description.substring(0, 100)}...</p>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/services" className="btn" style={{ background: '#d81b60', marginTop: '50px', padding: '12px 25px', textDecoration: 'none', color: 'white', borderRadius: '8px' }}>
          Усі Послуги
        </Link>
      </section>

      {/* Featured Masters Section - З МАРМУРОВИМ ФОНОМ */}
      <section style={marbleSectionStyle}>
        <h2 className="animate" style={{ marginBottom: '50px' }}>Наші Топ-Майстри</h2>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {featuredMasters.map(master => (
            <div key={master.id} className="card" style={{ padding: '20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img src={master.image} alt={master.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 15px' }} />
              <h4 style={{ margin: '0 0 5px' }}>{master.name}</h4>
              <p style={{ color: '#d81b60', margin: '0 0 10px', fontWeight: '600' }}>{master.role}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{master.about}</p>
            </div>
          ))}
        </div>
        <Link to="/masters" className="btn" style={{ background: '#d81b60', marginTop: '50px', padding: '12px 25px', textDecoration: 'none', color: 'white', borderRadius: '8px' }}>
          Вся Команда
        </Link>
      </section>
      
      {/* СЕКЦІЯ ВІДГУКІВ (БЕЗ ЗМІН) */}
      <section style={reviewsSectionStyle}>
        <h2 style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem', textAlign: 'center' }}>
            Відгуки наших клієнтів
        </h2>
        
        <div style={reviewsContainerStyle}>
            {/* Дублюємо відгуки, щоб створити ефект нескінченного прокручування */}
            {[...reviewsData, ...reviewsData].map((review, index) => (
                <div key={`${review.id}-${index}`} style={reviewCardStyle}>
                    <div style={{ fontSize: '2rem', color: '#d81b60', marginBottom: '10px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '15px', lineHeight: 1.6 }}>
                        "{review.text}"
                    </p>
                    <p style={{ fontWeight: 'bold', color: '#333' }}>
                        — {review.author}
                    </p>
                </div>
            ))}
        </div>
        
      </section>
    </div>
  );
};

export default Home;