import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import Itinerary from './pages/Itinerary';
import Profile from './pages/profile.jsx';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/common/Navbar';
import './styles/main.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/itinerary/:tripId" element={<Itinerary />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;