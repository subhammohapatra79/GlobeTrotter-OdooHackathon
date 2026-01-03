/**
 * TripList component
 * Displays list of trips
 */

import React from 'react';
import TripCard from './TripCard';
import '../styles/trip-list.css';

export const TripList = ({ trips, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Loading trips...</div>;
  }

  if (!trips || trips.length === 0) {
    return (
      <div className="empty-state">
        <p>No trips yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="trip-list">
      {trips.map((trip) => (
        <TripCard 
          key={trip.id} 
          trip={trip}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TripList;