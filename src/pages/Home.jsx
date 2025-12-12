import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { getServicesApi } from '../api/services';
import { getMastersApi } from '../api/masters';


const reviewsData = [
  { id: 1, text: "Неймовірно! Стрижка ідеальна, майстер Олена просто чарівниця. Обов'язково повернуся!", author: "Оксана К.", rating: 5 },
  { id: 2, text: "Дуже задоволена манікюром, тримається вже третій тиждень без сколів. Сервіс на найвищому рівні.", author: "Ірина Л.", rating: 5 },
  { id: 3, text: "Вперше був на корекції бороди. Майстер Максим знає свою справу! Рекомендую.", author: "Андрій В.", rating: 5 },
  { id: 4, text: "Фарбування AirTouch перевершило всі очікування. Колір – мрія! Дякую команді TOP BEAUTY.", author: "Вікторія Р.", rating: 5 },
  { id: 5, text: "Завжди приємна атмосфера і якісні послуги. Це мій улюблений салон.", author: "Марина З.", rating: 5 },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesRes, mastersRes] = await Promise.all([
          getServicesApi(),
          getMastersApi(),
        ]);
        setServices(servicesRes || []);
        setMasters(mastersRes || []);
      } catch (e) {
        console.error('Помилка завантаження даних для головної сторінки:', e);
      }
    };

    load();
  }, []);

  const featuredServices = services.slice(0, 3);
  const featuredMasters = masters.slice(0, 3);

  return (
      <div>
        {/* HERO */}
        <section className="home-hero">
          <div className="animate home-hero-inner">
            <h1 className="home-hero-title">TOP BEAUTY STUDIO</h1>
            <p className="home-hero-subtitle">Ми підкреслимо вашу унікальність</p>
            <Link to="/services" className="btn home-hero-btn">
              Обрати Послугу
            </Link>
          </div>
        </section>
        <div className="home-marble-background">
          <section className="container home-section">
            <h2 className="animate">Чому обирають нас?</h2>
            <div className="home-info-grid">
              <div className="card card-body home-info-card">
                <i className="fas fa-magic home-info-icon"></i>
                <h3>🏆 Преміальні Матеріали</h3>
                <p>Працюємо лише з найкращими світовими брендами.</p>
              </div>
              <div className="card card-body home-info-card">
                <i className="fas fa-star home-info-icon"></i>
                <h3>⭐ Топ-Майстри</h3>
                <p>Сертифіковані спеціалісти з багаторічним досвідом.</p>
              </div>
              <div className="card card-body home-info-card">
                <i className="fas fa-heart home-info-icon"></i>
                <h3>💖 Індивідуальний Підхід</h3>
                <p>Створення унікального образу для кожного клієнта.</p>
              </div>
            </div>
          </section>

          {/* FEATURED SERVICES */}
          <section className="home-section">
            <h2 className="animate home-section-title">Популярні Послуги</h2>
            <div className="container home-services-grid">
              {featuredServices.map((service) => (
                  <Link
                      to={`/service/${service.slug}`}
                      key={service.id}
                      className="card home-service-card"
                  >
                    <img
                        src={service.image}
                        alt={service.name}
                        className="home-service-image"
                    />
                    <div className="home-service-content">
                      <div className="home-service-meta">
                    <span className="home-service-category">
                      {service.category?.name || service.categoryName || ''}
                    </span>
                        <span className="home-service-price">
                      {service.price} грн
                    </span>
                      </div>
                      <h4 className="home-service-name">{service.name}</h4>
                      <p className="home-service-description">
                        {(service.description || '').substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
              ))}
            </div>
            <Link to="/services" className="btn home-section-btn">
              Усі Послуги
            </Link>
          </section>

          {/* FEATURED MASTERS */}
          <section className="home-section">
            <h2 className="animate home-section-title">Наші Топ-Майстри</h2>
            <div className="container home-masters-grid">
              {featuredMasters.map((master) => (
                  <div
                      key={master.id}
                      className="card home-master-card"
                  >
                    <img
                        src={master.photoUrl}
                        alt={master.fullName}
                        className="home-master-image"
                    />
                    <h4 className="home-master-name">{master.fullName}</h4>
                    <p className="home-master-role">{master.role}</p>
                    <p className="home-master-about">
                      {master.description}
                    </p>
                  </div>
              ))}
            </div>
            <Link to="/masters" className="btn home-section-btn">
              Вся Команда
            </Link>
          </section>
        </div>

        {/* REVIEWS */}
        <section className="home-reviews-section">
          <h2 className="home-reviews-title">
            Відгуки наших клієнтів
          </h2>
          <div className="home-reviews-wrapper">
            <div className="home-reviews-container">
              {[...reviewsData, ...reviewsData].map((review, index) => (
                  <div
                      key={`${review.id}-${index}`}
                      className="home-review-card"
                  >
                    <div className="home-review-stars">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="home-review-text">
                      "{review.text}"
                    </p>
                    <p className="home-review-author">
                      — {review.author}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </section>
      </div>
  );
};

export default Home;
