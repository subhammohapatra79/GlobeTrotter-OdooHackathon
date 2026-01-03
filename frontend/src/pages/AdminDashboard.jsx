import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <>
      <div className="admin-page">
        {/* TOP CONTROLS */}
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Search user..."
            className="search-input"
          />

          <div className="control-buttons">
            <button>Manage Users</button>
            <button>Register Admin</button>
            <button>Popular Routes</button>
            <button>View Ratings</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="admin-content">
          {/* ANALYTICS */}
          <div className="analytics-card">
            <h3>Platform Analytics</h3>

            <div className="chart-placeholder pie"></div>
            <div className="chart-placeholder line"></div>
            <div className="chart-placeholder bar"></div>
          </div>

          {/* SIDE PANEL */}
          <div className="activity-panel">
            <h3>Recent User Activity</h3>
            <ul>
              <li>User booked a trip to Bali</li>
              <li>New admin registered</li>
              <li>User reviewed Paris trip</li>
              <li>New itinerary created</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
