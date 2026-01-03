import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import '../styles/create-trip.css';

const CreateTrip = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend / AI integration later
    console.log(formData);
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
            <Button type="submit">Create Trip</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
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
