/**
 * TripForm component
 * Form for creating/editing trips
 */

import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import '../styles/trip-form.css';

export const TripForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    startDate: initialData?.start_date || '',
    endDate: initialData?.end_date || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Trip name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <Input
        name="name"
        label="Trip Name"
        placeholder="e.g., European Summer Tour"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        name="description"
        label="Description (Optional)"
        placeholder="e.g., Visiting Paris, Rome, and Barcelona"
        value={formData.description}
        onChange={handleChange}
      />

      <div className="form-row">
        <Input
          type="date"
          name="startDate"
          label="Start Date"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          required
        />
        <Input
          type="date"
          name="endDate"
          label="End Date"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Trip'}
      </Button>
    </form>
  );
};

export default TripForm;