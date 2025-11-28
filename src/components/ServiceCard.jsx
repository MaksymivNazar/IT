import React from 'react';

const ServiceCard = ({ title, price, icon, description }) => {
  return (
    <div style={{ 
      border: '1px solid #eee', 
      padding: '20px', 
      borderRadius: '12px', 
      textAlign: 'center',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)' 
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ margin: '10px 0' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>{description}</p>
      <p style={{ color: '#d81b60', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '15px' }}>
        {price} грн
      </p>
    </div>
  );
};

export default ServiceCard;