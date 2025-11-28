// src/components/ConfirmationModal.jsx

import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3 style={modalTitleStyle}>{title}</h3>
                <p style={modalMessageStyle}>{message}</p>
                
                <div style={buttonContainerStyle}>
                    <button onClick={onCancel} style={cancelButtonStyle}>Скасувати</button>
                    <button onClick={onConfirm} style={confirmButtonStyle}>Підтвердити</button>
                </div>
            </div>
        </div>
    );
};

// --- Стилі для модального вікна ---
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    transform: 'scale(1)',
    transition: 'transform 0.3s ease-out',
};

const modalTitleStyle = {
    color: '#d81b60',
    marginBottom: '15px',
};

const modalMessageStyle = {
    color: '#333',
    marginBottom: '25px',
    fontSize: '1.1rem',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
};

const baseButtonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    border: 'none',
};

const confirmButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#d81b60', // Акцентний колір
    color: 'white',
};

const cancelButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: '#f4f4f4',
    color: '#666',
    border: '1px solid #ccc',
};

export default ConfirmationModal;