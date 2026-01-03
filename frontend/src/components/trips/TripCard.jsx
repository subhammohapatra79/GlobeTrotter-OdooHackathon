/**
 * TripCard component
 * Displays a single trip card
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/trip-card.css';

export const TripCard = ({ trip, onDelete }) => {
  const startDate = new Date(trip.start_date).toLocaleDateString();
  const endDate = new Date(trip.end_date).toLocaleDateString();
  const days = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));

  return (
    <div className="trip-card">
      <div className="trip-header">
        <h3>{trip.name}</h3>
        <span className="trip-duration">{days} days</span>
      </div>
      
      {trip.description && (
        <p className="trip-description">{trip.description}</p>
      )}

      <div className="trip-dates">
        <p><strong>From:</strong> {startDate}</p>
        <p><strong>To:</strong> {endDate}</p>
      </div>

      <div className="trip-actions">
        <Link to={`/itinerary/${trip.id}`} className="btn btn-primary">
          View Itinerary
        </Link>
        <button 
          onClick={() => onDelete(trip.id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TripCard;