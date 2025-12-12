import React from 'react';
import '../styles/AppointmentCard.css';

const AppointmentCard = ({ app, onCancelAttempt, isCancellable }) => {
    if (!app) return null;

    const {
        id,
        date,
        time,
        status,
        statusText,
        master,
        service,
    } = app;

    const masterName = master?.fullName || master?.name || 'Майстер не вказаний';
    const masterRole = master?.role || '';
    const serviceName = service?.name || 'Послуга не вказана';
    const servicePrice = service?.price;

    const normalizedStatusText =
        statusText ||
        (status
            ? {
            PENDING: 'Заплановано',
            CONFIRMED: 'Підтверджено',
            CANCELLED: 'Скасовано',
            CANCELLED_BY_MASTER: 'Скасовано майстром',
            COMPLETED: 'Виконано',
        }[status] || status
            : 'Заплановано');

    return (
        <div className="appointment-card">
            <div className="appointment-card-main">
                <div className="appointment-card-row">
                    <span className="appointment-card-label">Послуга:</span>
                    <span className="appointment-card-value">{serviceName}</span>
                </div>

                {typeof servicePrice === 'number' && (
                    <div className="appointment-card-row">
                        <span className="appointment-card-label">Вартість:</span>
                        <span className="appointment-card-value">
                            {servicePrice} грн
                        </span>
                    </div>
                )}

                <div className="appointment-card-row">
                    <span className="appointment-card-label">Майстер:</span>
                    <span className="appointment-card-value">
                        {masterName}
                        {masterRole ? ` (${masterRole})` : ''}
                    </span>
                </div>

                <div className="appointment-card-row">
                    <span className="appointment-card-label">Дата:</span>
                    <span className="appointment-card-value">{date}</span>
                </div>

                <div className="appointment-card-row">
                    <span className="appointment-card-label">Час:</span>
                    <span className="appointment-card-value">{time}</span>
                </div>
            </div>

            <div className="appointment-card-footer">
                <span
                    className={`appointment-card-status status-${(
                        status || ''
                    ).toLowerCase()}`}
                >
                    {normalizedStatusText}
                </span>

                {isCancellable && (
                    <button
                        type="button"
                        className="appointment-card-cancel-btn"
                        onClick={() => onCancelAttempt && onCancelAttempt(id)}
                    >
                        Скасувати візит
                    </button>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;
