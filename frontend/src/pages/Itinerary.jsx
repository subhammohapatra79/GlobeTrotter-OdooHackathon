import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { tripAPI, tripStopAPI, budgetAPI, activityAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import '../styles/itinerary.css';

const Itinerary = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { isAuthenticated, authLoading } = useAuth();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState(null);

  const [newActivity, setNewActivity] = useState({ name: '', cost: '', category: '', durationHours: '' });
  const [newStop, setNewStop] = useState({
    city: '',
    country: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [tempBudgetInput, setTempBudgetInput] = useState('0');

  // Check auth and fetch data
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (tripId) {
      fetchTripData();
    }
  }, [isAuthenticated, authLoading, tripId, navigate]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trip details
      const tripResponse = await tripAPI.getById(tripId);
      const tripData = tripResponse.data?.trip || tripResponse.trip;
      setTrip(tripData);
      console.log('Trip data:', tripData);

      // Fetch stops for this trip
      const stopsResponse = await tripStopAPI.getAll(tripId);
      const stopsData = stopsResponse.data?.stops || stopsResponse.stops || [];
      
      // Fetch activities for each stop
      const stopsWithActivities = await Promise.all(
        stopsData.map(async (stop) => {
          try {
            const activitiesResponse = await activityAPI.getAll(tripId, stop.id);
            const activities = activitiesResponse.data?.activities || activitiesResponse.activities || [];
            return { ...stop, activities };
          } catch (err) {
            console.error(`Failed to fetch activities for stop ${stop.id}:`, err);
            return { ...stop, activities: [] };
          }
        })
      );
      setStops(stopsWithActivities);
      console.log('Stops with activities:', stopsWithActivities);

      // Fetch budget
      const budgetResponse = await budgetAPI.getByTrip(tripId);
      const budgetData = budgetResponse.data?.budget || budgetResponse.budget;
      setBudget(budgetData);
      if (budgetData) {
        setTempBudgetInput(budgetData.total_cost?.toString() || '0');
      }
      console.log('Budget data:', budgetData);
    } catch (err) {
      console.error('Failed to fetch trip data:', err);
      setError(err?.message || 'Failed to load trip data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const calculateTotalCost = () => {
    return stops.reduce((total, stop) => {
      return total + (stop.activities?.reduce((stopTotal, activity) => stopTotal + (activity.cost || 0), 0) || 0);
    }, 0);
  };

  const totalCost = calculateTotalCost();
  const budgetLimit = budget?.total_cost || 0;
  const remainingBudget = budgetLimit - totalCost;
  const budgetPercentage = budgetLimit > 0 ? (totalCost / budgetLimit) * 100 : 0;
  const isOverBudget = totalCost > budgetLimit && budgetLimit > 0;

  const handleAddStop = async () => {
    if (!newStop.city || !newStop.country || !newStop.startDate || !newStop.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(newStop.endDate) <= new Date(newStop.startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      const response = await tripStopAPI.create(
        tripId,
        newStop.city,
        newStop.country,
        newStop.startDate,
        newStop.endDate,
        newStop.notes
      );
      const createdStop = response.data?.stop || response.stop;
      setStops([...stops, { ...createdStop, activities: [] }]);
      setShowModal(false);
      setNewStop({ city: '', country: '', startDate: '', endDate: '', notes: '' });
      setError(null);
    } catch (err) {
      console.error('Failed to add stop:', err);
      setError(err?.message || 'Failed to add stop');
    }
  };

  const handleDeleteStop = async (stopId) => {
    try {
      await tripStopAPI.delete(tripId, stopId);
      setStops(stops.filter(stop => stop.id !== stopId));
    } catch (err) {
      console.error('Failed to delete stop:', err);
      setError(err?.message || 'Failed to delete stop');
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.name || !newActivity.cost || selectedStopId === null) {
      setError('Please fill in activity name and cost');
      return;
    }

    try {
      const costValue = parseFloat(newActivity.cost) || 0;
      const response = await activityAPI.create(
        tripId,
        selectedStopId,
        newActivity.name,
        '',
        costValue,
        parseFloat(newActivity.durationHours) || 0,
        newActivity.category
      );
      const createdActivity = response.data?.activity || response.activity;
      
      setStops(stops.map(stop => {
        if (stop.id === selectedStopId) {
          return {
            ...stop,
            activities: [...(stop.activities || []), createdActivity]
          };
        }
        return stop;
      }));
      setNewActivity({ name: '', cost: '', category: '', durationHours: '' });
      setShowActivityModal(false);
      setSelectedStopId(null);
      setError(null);
    } catch (err) {
      console.error('Failed to add activity:', err);
      setError(err?.message || 'Failed to add activity');
    }
  };

  const handleDeleteActivity = async (stopId, activityId) => {
    try {
      await activityAPI.delete(tripId, stopId, activityId);
      setStops(stops.map(stop => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: stop.activities.filter(activity => activity.id !== activityId)
          };
        }
        return stop;
      }));
    } catch (err) {
      console.error('Failed to delete activity:', err);
      setError(err?.message || 'Failed to delete activity');
    }
  };

  const handleUpdateBudget = async () => {
    try {
      const newBudgetAmount = parseFloat(tempBudgetInput) || 0;
      
      if (newBudgetAmount <= 0) {
        setError('Budget must be greater than 0');
        return;
      }

      let updatedBudget;
      if (budget) {
        // Update existing budget
        const response = await budgetAPI.update(tripId, newBudgetAmount);
        updatedBudget = response.data?.budget || response.budget || { ...budget, total_cost: newBudgetAmount };
      } else {
        // Create new budget
        const response = await budgetAPI.create(tripId, newBudgetAmount);
        updatedBudget = response.data?.budget || response.budget || { id: null, trip_id: tripId, total_cost: newBudgetAmount };
      }

      setBudget(updatedBudget);
      setTempBudgetInput(newBudgetAmount.toString());
      setEditingBudget(false);
      setError(null);
    } catch (err) {
      console.error('Failed to update budget:', err);
      setError(err?.message || 'Failed to update budget');
    }
  };

  if (authLoading || loading) {
    return <div className="loading">Loading trip details...</div>;
  }

  if (error && !trip) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="error-container">
        <p className="error">Trip not found</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const startDate = trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const endDate = trip.end_date ? new Date(trip.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="itinerary-page">
      <div className="itinerary-hero">
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Back to Trips
        </Button>
        <h1>{trip.name || 'Trip Details'}</h1>
        <p>From {startDate} to {endDate}</p>
      </div>

      <div className="itinerary-content">
        <div className="timeline-section">
          <div className="timeline-header">
            <h2>Your Journey Timeline</h2>
            <Button onClick={() => setShowModal(true)}>+ Add Stop</Button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {stops.length === 0 ? (
            <div className="empty-state">
              <p>No stops planned yet. Add a stop to get started!</p>
              <Button onClick={() => setShowModal(true)}>Add First Stop</Button>
            </div>
          ) : (
            <div className="timeline">
              {stops.map((stop, index) => (
                <div key={stop.id} className="timeline-item">
                  <div className="timeline-marker">{index + 1}</div>
                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <div>
                        <h3>{stop.city}, {stop.country}</h3>
                        <span>{stop.start_date || stop.startDate} – {stop.end_date || stop.endDate}</span>
                      </div>
                      <button
                        className="delete-stop-btn"
                        onClick={() => handleDeleteStop(stop.id)}
                        title="Remove this stop"
                      >
                        ✕
                      </button>
                    </div>
                    {stop.notes && <p className="stop-notes">{stop.notes}</p>}
                    <ul>
                      {stop.activities && stop.activities.length > 0 ? (
                        stop.activities.map((activity) => (
                          <li key={activity.id} className="activity-item">
                            <span>{activity.name} – ₹{(activity.cost || 0).toLocaleString('en-IN')}</span>
                            <button
                              className="delete-activity-btn"
                              onClick={() => handleDeleteActivity(stop.id, activity.id)}
                              title="Remove activity"
                            >
                              ✕
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="no-activities">No activities added yet</li>
                      )}
                    </ul>
                    <button
                      className="add-activity-btn"
                      onClick={() => {
                        setSelectedStopId(stop.id);
                        setShowActivityModal(true);
                      }}
                    >
                      + Add Activity
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="budget-section">
          <h2>Budget Summary</h2>
          {isOverBudget && (
            <div className="budget-alert">
              ⚠️ Over Budget: You've exceeded by ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
            </div>
          )}
          {budgetLimit === 0 && !editingBudget ? (
            <div className="empty-state">
              <p>No budget set yet. Set a budget to track expenses!</p>
              <Button onClick={() => {
                setEditingBudget(true);
                setTempBudgetInput('');
              }}>+ Set Budget</Button>
            </div>
          ) : editingBudget && budgetLimit === 0 ? (
            <div className="budget-card">
              <h3>Set Your Budget</h3>
              <div className="budget-input-group">
                <input
                  type="number"
                  value={tempBudgetInput}
                  onChange={(e) => setTempBudgetInput(e.target.value)}
                  placeholder="Enter budget amount"
                  className="budget-input"
                  min="0"
                  step="100"
                />
                <button className="save-budget-btn" onClick={handleUpdateBudget}>
                  Save Budget
                </button>
                <button className="cancel-budget-btn" onClick={() => setEditingBudget(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={`budget-card ${isOverBudget ? 'over-budget' : ''}`}>
              <div className="budget-header">
                <div className="budget-icon">💰</div>
                <span className={`status-badge ${isOverBudget ? 'warning' : 'success'}`}>
                  {isOverBudget ? '⚠️ Over Budget' : '✓ Within Budget'}
                </span>
              </div>
              <div className="budget-progress">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${isOverBudget ? 'over' : ''}`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  />
                </div>
                <p className="progress-text">{Math.min(Math.round(budgetPercentage), 100)}% of budget used</p>
              </div>
              <div className="budget-details">
                <div className="budget-row">
                  <span>Total Spent:</span>
                  <span className={isOverBudget ? 'over-text' : ''}>₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="budget-row">
                  <span>Budget Limit:</span>
                  <span>₹{budgetLimit.toLocaleString('en-IN')}</span>
                </div>
                <div className={`budget-row remaining ${isOverBudget ? 'negative' : 'positive'}`}>
                  <span>Remaining:</span>
                  <span>₹{Math.abs(remainingBudget).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="budget-actions">
                {!editingBudget ? (
                  <button 
                    className="edit-budget-btn"
                    onClick={() => {
                      setEditingBudget(true);
                      setTempBudgetInput(budgetLimit.toString());
                    }}
                  >
                    ✏️ Edit Budget
                  </button>
                ) : (
                  <div className="budget-input-group">
                    <input
                      type="number"
                      value={tempBudgetInput}
                      onChange={(e) => setTempBudgetInput(e.target.value)}
                      placeholder="Enter budget"
                      className="budget-input"
                    />
                    <button className="save-budget-btn" onClick={handleUpdateBudget}>
                      Save
                    </button>
                    <button className="cancel-budget-btn" onClick={() => setEditingBudget(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div className="budget-tips">
                <p>💡 <strong>Tip:</strong> {
                  isOverBudget 
                    ? 'Remove activities or increase budget to stay on track.'
                    : remainingBudget < 5000 
                    ? 'Limited budget left. Plan carefully!'
                    : 'Good budget flexibility. Enjoy your trip!'
                }</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Destination</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Add a new stop to your journey</p>
            <Input
              label="City"
              placeholder="e.g., Barcelona"
              value={newStop.city}
              onChange={(e) => setNewStop({ ...newStop, city: e.target.value })}
              required
            />
            <Input
              label="Country"
              placeholder="e.g., Spain"
              value={newStop.country}
              onChange={(e) => setNewStop({ ...newStop, country: e.target.value })}
              required
            />
            <div className="modal-form-row">
              <Input
                type="date"
                label="Arrival"
                value={newStop.startDate}
                onChange={(e) => setNewStop({ ...newStop, startDate: e.target.value })}
              />
              <Input
                type="date"
                label="Departure"
                value={newStop.endDate}
                onChange={(e) => setNewStop({ ...newStop, endDate: e.target.value })}
              />
            </div>
            <Input
              label="Notes (Optional)"
              placeholder="What do you want to do here?"
              value={newStop.notes}
              onChange={(e) => setNewStop({ ...newStop, notes: e.target.value })}
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStop}>Add to Journey</Button>
            </div>
          </div>
        </div>
      )}

      {showActivityModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Activity</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Add something to do at this stop</p>
            <Input
              label="Activity Name"
              placeholder="e.g., Eiffel Tower Summit"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              required
            />
            <Input
              label="Cost (₹)"
              type="number"
              placeholder="e.g., 2490"
              value={newActivity.cost}
              onChange={(e) => setNewActivity({ ...newActivity, cost: e.target.value })}
              required
            />
            <Input
              label="Duration (hours)"
              type="number"
              placeholder="e.g., 2"
              value={newActivity.durationHours}
              onChange={(e) => setNewActivity({ ...newActivity, durationHours: e.target.value })}
            />
            <Input
              label="Category (Optional)"
              placeholder="e.g., Museum, Restaurant"
              value={newActivity.category}
              onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowActivityModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAddActivity(selectedStopId)}>Add Activity</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
