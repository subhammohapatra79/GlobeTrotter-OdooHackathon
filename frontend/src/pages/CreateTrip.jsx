/**
 * CreateTrip page
 * Form to create a new trip
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { tripAPI } from '../services/api';
import TripForm from '../components/trips/TripForm';
import '../styles/create-trip.css';

const CreateTrip = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tripAPI.create(
        formData.name,
        formData.description,
        formData.startDate,
        formData.endDate
      );

      if (response.data?.trip) {
        navigate(`/itinerary/${response.data.trip.id}`);
      }
    } catch (err) {
      setError(err?.message || 'Failed to create trip');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">
      <div className="create-trip-container">
        <h1>Plan Your Trip</h1>
        <p>Start by creating a new trip and adding details</p>

        {error && <div className="error-message">{error}</div>}

        <TripForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateTrip;