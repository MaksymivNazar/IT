import React from 'react'
const blackMarbleUrl = 'https://img.freepik.com/premium-photo/natural-black-marble-texture-skin-tile-wallpaper-luxurious-background_24076-426.jpg'


const footerStyle = {
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${blackMarbleUrl}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: '#fff',
  padding: '40px 0',
  textAlign: 'center',
  marginTop: 0,
  margin: 0,
  fontFamily: 'Georgia, "Times New Roman", Times, serif', 
}

// Стиль для основної назви
const logoStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  margin: '0 0 10px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: '#FFECB3'
}

const Footer = () => (
  <footer style={{ ...footerStyle, display: 'block' }}>
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h3 style={logoStyle}>
        TOP BEAUTY
      </h3>
      <div style={{ margin: '20px 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
        <p style={{ margin: '5px 0' }}>Створюємо красу з 2015 року</p>
        <p style={{ margin: '5px 0' }}>Наші послуги: Зачіски | Макіяж | Манікюр | Догляд за шкірою</p>
      </div>

      <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', width: '50%', margin: '25px auto' }} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '1rem', marginBottom: '20px' }}>
        <div>
          <strong style={{ color: '#FFECB3' }}>Контакти:</strong>
          <p style={{ margin: '5px 0' }}>+38 (097) 123-45-67</p>
        </div>
        <div>
          <strong style={{ color: '#FFECB3' }}>Адреса:</strong>
          <p style={{ margin: '5px 0' }}>Вул. Центральна, 10, Київ</p>
        </div>
      </div>
      <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '30px' }}>
        &copy; 2025 Всі права захищені | TOP BEAUTY STUDIO
      </p>
    </div>
  </footer>
)

export default Footer