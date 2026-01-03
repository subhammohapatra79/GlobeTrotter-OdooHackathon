import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { tripAPI } from '../services/api';
import '../styles/calendar.css';

const CalendarView = () => {
  const [trips, setTrips] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await tripAPI.getAll();
        setTrips(res.data?.trips || []);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['SUM', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="calendar-view-root">
      <Navbar />
      <div className="calendar-layout">
        {/* Wireframe Search & Control Bar */}
        <div className="calendar-top-bar">
          <input type="text" placeholder="Search bar ......" className="cal-input-search" />
          <div className="cal-button-group">
            <button className="cal-secondary-btn">Group by</button>
            <button className="cal-secondary-btn">Filter</button>
            <button className="cal-secondary-btn">Sort by...</button>
          </div>
        </div>

        <div className="calendar-main-card">
          <header className="cal-month-header">
            <h2>Calendar View</h2>
            <div className="cal-month-nav">
              <button className="nav-btn">←</button>
              <h3>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              <button className="nav-btn">→</button>
            </div>
          </header>

          <div className="cal-grid">
            {weekDays.map(day => <div key={day} className="cal-weekday">{day}</div>)}
            
            {/* Empty cells for padding start of month */}
            {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} className="cal-day empty"></div>)}

            {days.map(day => {
              // Logic to find if a trip exists on this day
              const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const tripAtDate = trips.find(t => {
                const start = new Date(t.start_date);
                const end = new Date(t.end_date);
                return dayDate >= start && dayDate <= end;
              });

              return (
                <div key={day} className={`cal-day ${tripAtDate ? 'active-trip' : ''}`}>
                  <span className="cal-num">{day}</span>
                  {tripAtDate && day === new Date(tripAtDate.start_date).getDate() && (
                    <div className={`trip-label ${trips.indexOf(tripAtDate) % 2 === 1 ? 'alternate' : ''}`} title={tripAtDate.name}>
                      {tripAtDate.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;