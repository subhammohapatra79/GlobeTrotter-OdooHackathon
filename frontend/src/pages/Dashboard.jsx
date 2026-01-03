/**
 * Dashboard page
 * Shows user's trips
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { tripAPI } from '../services/api';
import TripList from '../components/trips/TripList';
import Button from '../components/common/Button';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTrips();
  }, [isAuthenticated]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripAPI.getAll();
      setTrips(response.data?.trips || []);
      setError(null);
    } catch (err) {
      setError('Failed to load trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      await tripAPI.delete(tripId);
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (err) {
      setError('Failed to delete trip');
      console.error(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.firstName}! 👋</h1>
          <p>Plan your next adventure</p>
        </div>
        <Button onClick={() => navigate('/create-trip')} variant="primary">
          + Create New Trip
        </Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="trips-section">
        <h2>My Trips</h2>
        <TripList 
          trips={trips}
          onDelete={handleDeleteTrip}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;