/**
 * Itinerary page
 * Shows complete trip itinerary with stops and activities
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { tripAPI, tripStopAPI, activityAPI, budgetAPI } from '../services/api';
import StopCard from '../components/itinerary/StopCard';
import BudgetSummary from '../components/itinerary/BudgetSummary';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import '../styles/itinerary.css';

const Itinerary = () => {
  const { tripId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState({});
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAddStop, setShowAddStop] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [stopFormData, setStopFormData] = useState({
    city: '',
    country: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [activityFormData, setActivityFormData] = useState({
    name: '',
    description: '',
    cost: '',
    durationHours: '',
    category: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchItinerary();
  }, [isAuthenticated, tripId]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const [tripRes, stopsRes, budgetRes] = await Promise.all([
        tripAPI.getById(tripId),
        tripStopAPI.getAll(tripId),
        budgetAPI.getByTrip(tripId)
      ]);

      setTrip(tripRes.data?.trip);
      setStops(stopsRes.data?.stops || []);
      setBudget(budgetRes.data?.budget);

      // Fetch activities for all stops
      const activitiesMap = {};
      for (const stop of stopsRes.data?.stops || []) {
        const activitiesRes = await activityAPI.getAll(tripId, stop.id);
        activitiesMap[stop.id] = activitiesRes.data?.activities || [];
      }
      setActivities(activitiesMap);
      setError(null);
    } catch (err) {
      setError('Failed to load itinerary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      const res = await tripStopAPI.create(
        tripId,
        stopFormData.city,
        stopFormData.country,
        stopFormData.startDate,
        stopFormData.endDate,
        stopFormData.notes
      );
      setStops([...stops, res.data?.stop]);
      setActivities(prev => ({
        ...prev,
        [res.data.stop.id]: []
      }));
      setShowAddStop(false);
      setStopFormData({ city: '', country: '', startDate: '', endDate: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await activityAPI.create(
        tripId,
        selectedStopId,
        activityFormData.name,
        activityFormData.description,
        activityFormData.cost,
        activityFormData.durationHours,
        activityFormData.category
      );
      setActivities(prev => ({
        ...prev,
        [selectedStopId]: [...(prev[selectedStopId] || []), res.data?.activity]
      }));
      await budgetAPI.recalculate(tripId);
      await fetchItinerary();
      setShowAddActivity(false);
      setActivityFormData({ name: '', description: '', cost: '', durationHours: '', category: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (window.confirm('Delete this stop and all its activities?')) {
      try {
        await tripStopAPI.delete(tripId, stopId);
        setStops(stops.filter(s => s.id !== stopId));
        await budgetAPI.recalculate(tripId);
        await fetchItinerary();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteActivity = async (stopId, activityId) => {
    if (window.confirm('Delete this activity?')) {
      try {
        await activityAPI.delete(tripId, stopId, activityId);
        setActivities(prev => ({
          ...prev,
          [stopId]: prev[stopId].filter(a => a.id !== activityId)
        }));
        await budgetAPI.recalculate(tripId);
        await fetchItinerary();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading itinerary...</div>;
  if (!trip) return <div className="error-message">Trip not found</div>;

  const tripDays = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));

  return (
    <div className="itinerary-page">
      <div className="itinerary-header">
        <div>
          <h1>{trip.name}</h1>
          <p>{new Date(trip.start_date).toLocaleDateString()} to {new Date(trip.end_date).toLocaleDateString()}</p>
        </div>
        <Button onClick={() => navigate('/dashboard')} variant="secondary">
          ← Back to Trips
        </Button>
      </div>

      <BudgetSummary budget={budget} tripDays={tripDays} />

      {error && <div className="error-message">{error}</div>}

      <div className="stops-section">
        <div className="section-header">
          <h2>City Stops ({stops.length})</h2>
          <Button onClick={() => setShowAddStop(true)} variant="secondary">
            + Add Stop
          </Button>
        </div>

        {showAddStop && (
          <form onSubmit={handleAddStop} className="add-form">
            <Input
              name="city"
              label="City"
              placeholder="e.g., Paris"
              value={stopFormData.city}
              onChange={(e) => setStopFormData({...stopFormData, city: e.target.value})}
              required
            />
            <Input
              name="country"
              label="Country"
              placeholder="e.g., France"
              value={stopFormData.country}
              onChange={(e) => setStopFormData({...stopFormData, country: e.target.value})}
            />
            <div className="form-row">
              <Input
                type="date"
                name="startDate"
                label="Start Date"
                value={stopFormData.startDate}
                onChange={(e) => setStopFormData({...stopFormData, startDate: e.target.value})}
                required
              />
              <Input
                type="date"
                name="endDate"
                label="End Date"
                value={stopFormData.endDate}
                onChange={(e) => setStopFormData({...stopFormData, endDate: e.target.value})}
                required
              />
            </div>
            <Input
              name="notes"
              label="Notes"
              placeholder="e.g., Must see Eiffel Tower"
              value={stopFormData.notes}
              onChange={(e) => setStopFormData({...stopFormData, notes: e.target.value})}
            />
            <Button type="submit">Add Stop</Button>
            <Button type="button" onClick={() => setShowAddStop(false)} variant="secondary">
              Cancel
            </Button>
          </form>
        )}

        <div className="stops-list">
          {stops.length === 0 ? (
            <p className="empty">No stops added yet</p>
          ) : (
            stops.map(stop => (
              <StopCard
                key={stop.id}
                stop={stop}
                activities={activities[stop.id] || []}
                onAddActivity={() => {
                  setSelectedStopId(stop.id);
                  setShowAddActivity(true);
                }}
                onDeleteStop={() => handleDeleteStop(stop.id)}
              />
            ))
          )}
        </div>
      </div>

      {showAddActivity && selectedStopId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Activity</h3>
            <form onSubmit={handleAddActivity}>
              <Input
                name="name"
                label="Activity Name"
                placeholder="e.g., Visit Eiffel Tower"
                value={activityFormData.name}
                onChange={(e) => setActivityFormData({...activityFormData, name: e.target.value})}
                required
              />
              <Input
                name="description"
                label="Description"
                placeholder="Optional details"
                value={activityFormData.description}
                onChange={(e) => setActivityFormData({...activityFormData, description: e.target.value})}
              />
              <Input
                type="number"
                name="cost"
                label="Cost ($)"
                placeholder="0.00"
                value={activityFormData.cost}
                onChange={(e) => setActivityFormData({...activityFormData, cost: e.target.value})}
              />
              <Input
                type="number"
                name="durationHours"
                label="Duration (hours)"
                placeholder="0"
                value={activityFormData.durationHours}
                onChange={(e) => setActivityFormData({...activityFormData, durationHours: e.target.value})}
              />
              <Input
                name="category"
                label="Category"
                placeholder="e.g., Sightseeing"
                value={activityFormData.category}
                onChange={(e) => setActivityFormData({...activityFormData, category: e.target.value})}
              />
              <Button type="submit">Add Activity</Button>
              <Button type="button" onClick={() => setShowAddActivity(false)} variant="secondary">
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;