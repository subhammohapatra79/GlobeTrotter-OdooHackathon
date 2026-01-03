/**
 * StopCard component
 * Displays a single trip stop
 */

import React from 'react';
import '../styles/stop-card.css';

export const StopCard = ({ stop, activities, onAddActivity, onDeleteStop }) => {
  const startDate = new Date(stop.start_date).toLocaleDateString();
  const endDate = new Date(stop.end_date).toLocaleDateString();
  const totalStopCost = activities.reduce((sum, act) => sum + parseFloat(act.cost || 0), 0);

  return (
    <div className="stop-card">
      <div className="stop-header">
        <div>
          <h3>{stop.city}, {stop.country}</h3>
          <p className="stop-dates">{startDate} to {endDate}</p>
        </div>
        <span className="stop-cost">${totalStopCost.toFixed(2)}</span>
      </div>

      {stop.notes && (
        <p className="stop-notes">{stop.notes}</p>
      )}

      <div className="activities-section">
        <h4>Activities ({activities.length})</h4>
        {activities.length === 0 ? (
          <p className="no-activities">No activities yet</p>
        ) : (
          <ul className="activities-list">
            {activities.map(activity => (
              <li key={activity.id} className="activity-item">
                <span>{activity.name}</span>
                <span className="activity-cost">${parseFloat(activity.cost).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="stop-actions">
        <button onClick={onAddActivity} className="btn btn-sm btn-secondary">
          + Add Activity
        </button>
        <button onClick={onDeleteStop} className="btn btn-sm btn-danger">
          Delete Stop
        </button>
      </div>
    </div>
  );
};

export default StopCard;