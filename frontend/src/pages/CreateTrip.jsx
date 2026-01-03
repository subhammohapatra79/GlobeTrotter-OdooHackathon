import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { tripAPI } from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import '../styles/create-trip.css';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to complete loading
    if (authLoading) {
      return;
    }
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.name || !formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate dates
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the API to create the trip
      await tripAPI.create(
        formData.name,
        formData.description || `Trip to ${formData.destination}`,
        formData.startDate,
        formData.endDate
      );

      console.log('Trip created successfully, redirecting to dashboard');
      
      // Redirect to dashboard which will fetch the new trip
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create trip:', err);
      setError(err?.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-page">
      {/* Header */}
      <div className="create-trip-header">
        <h1>Plan a New Trip</h1>
        <p>Create your journey step by step</p>
      </div>

      {/* Main Layout */}
      <div className="create-trip-layout">

        {/* Form */}
        <form className="trip-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <Input
            label="Trip Name"
            name="name"
            placeholder="e.g., Europe Summer Trip"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Select a Place"
            name="destination"
            placeholder="e.g., Paris, France"
            value={formData.destination}
            onChange={handleChange}
            required
          />

          <Input
            label="Description (Optional)"
            name="description"
            placeholder="Add trip details..."
            value={formData.description}
            onChange={handleChange}
            as="textarea"
          />

          <div className="form-row">
            <Input
              type="date"
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <Input
              type="date"
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Suggestions */}
        <div className="suggestions-section">
          <h2>Suggestions for Places & Activities</h2>

          <div className="suggestions-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="suggestion-card">
                <div className="suggestion-placeholder" />
                <p>AI suggestion will appear here</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateTrip;
