/**
 * ActivityCard component
 * Displays a single activity
 */

import React from 'react';
import '../styles/activity-card.css';

export const ActivityCard = ({ activity, onEdit, onDelete }) => {
  return (
    <div className="activity-card">
      <div className="activity-header">
        <h4>{activity.name}</h4>
        {activity.category && (
          <span className="activity-category">{activity.category}</span>
        )}
      </div>

      {activity.description && (
        <p className="activity-description">{activity.description}</p>
      )}

      <div className="activity-details">
        <div className="detail-item">
          <span className="label">Cost:</span>
          <span className="value">${parseFloat(activity.cost).toFixed(2)}</span>
        </div>
        {activity.duration_hours > 0 && (
          <div className="detail-item">
            <span className="label">Duration:</span>
            <span className="value">{activity.duration_hours}h</span>
          </div>
        )}
      </div>

      <div className="activity-actions">
        <button onClick={onEdit} className="btn btn-sm btn-primary">
          Edit
        </button>
        <button onClick={onDelete} className="btn btn-sm btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;