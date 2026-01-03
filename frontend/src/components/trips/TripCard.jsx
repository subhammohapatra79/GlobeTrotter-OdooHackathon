import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/trip-card.css';

export const TripCard = ({ trip, onDelete }) => {
  const startDate = new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endDate = new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const days = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));

  return (
    <div className="trip-card-v2">
      <div className="card-accent-bar"></div>
      <div className="card-body">
        <div className="card-top">
          <h3>{trip.name}</h3>
          <span className="duration-tag">{days} Days</span>
        </div>
        
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-label">DATES</span>
            <span className="meta-value">{startDate} - {endDate}</span>
          </div>
        </div>

        {trip.description && <p className="card-desc">{trip.description}</p>}

        <div className="card-footer">
          <Link to={`/itinerary/${trip.id}`} className="view-link">View Details →</Link>
          <button onClick={() => onDelete(trip.id)} className="delete-text">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;