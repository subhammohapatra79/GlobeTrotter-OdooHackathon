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

  // Updated Regions to use your local public/images folder
  const regions = [
    { id: 1, name: 'Europe', img: '/images/europe.png' },
    { id: 2, name: 'Asia', img: '/images/asia.png' },
    { id: 3, name: 'Africa', img: '/images/africa.png' },
    { id: 4, name: 'N. America', img: '/images/namerica.png' },
    { id: 5, name: 'S. America', img: '/images/samerica.png' },
    { id: 6, name: 'Antarctica', img: '/images/antarctica.png' },
    { id: 7, name: 'Australia', img: '/images/australia.png' }
  ];

  useEffect(() => {
    // Authentication check removed - dashboard accessible to all
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripAPI.getAll();
      setTrips(response.data?.trips || []);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await tripAPI.delete(tripId);
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Subtle World Map background overlay */}
      <div className="world-map-overlay"></div>

      <div className="banner-area">
        <div className="banner-content">
          <h1>Explore the World, {user?.firstName || 'Traveler'}</h1>
          <p>Adventure awaits. Sign in to your journey.</p>
        </div>
      </div>

      <div className="content-container">
        {/* Search & Filter Bar */}
        <div className="tool-bar">
          <input type="text" placeholder="Search destinations..." className="search-box" />
          <div className="filter-set">
            <select className="dash-select"><option>Group by</option></select>
            <select className="dash-select"><option>Filter</option></select>
            <select className="dash-select"><option>Sort by</option></select>
          </div>
        </div>

        {/* Top Regional Selections - Continent Cards */}
        <section className="dashboard-section">
          <h2 className="section-label">Top Regional Selections</h2>
          <div className="regions-grid">
            {regions.map(region => (
              <div key={region.id} className="region-card-image">
                <img src={region.img} alt={region.name} />
                <div className="region-overlay">
                  <span>{region.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Trips Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-label">Previous Trips</h2>
            <Button onClick={() => navigate('/create-trip')} variant="primary" className="btn-plan">
              + Plan a trip
            </Button>
          </div>
          
          <TripList 
            trips={trips} 
            onDelete={handleDeleteTrip} 
            loading={loading} 
          />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;