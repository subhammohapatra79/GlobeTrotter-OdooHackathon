/**
 * BudgetSummary component
 * Displays budget information for the trip
 */

import React from 'react';
import '../styles/budget-summary.css';

export const BudgetSummary = ({ budget, tripDays }) => {
  const totalCost = parseFloat(budget?.total_cost || 0);
  const costPerDay = tripDays > 0 ? totalCost / tripDays : 0;

  return (
    <div className="budget-summary">
      <h2>Budget Summary</h2>
      
      <div className="budget-cards">
        <div className="budget-card">
          <div className="budget-label">Total Budget</div>
          <div className="budget-value">${totalCost.toFixed(2)}</div>
        </div>

        <div className="budget-card">
          <div className="budget-label">Trip Duration</div>
          <div className="budget-value">{tripDays} days</div>
        </div>

        <div className="budget-card">
          <div className="budget-label">Daily Budget</div>
          <div className="budget-value">${costPerDay.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;