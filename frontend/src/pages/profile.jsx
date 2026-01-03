import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { profileAPI, tripAPI } from '../services/api';
import '../styles/profile.css';
import Button from '../components/common/Button';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, authLoading } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: '',
    summary: '',
    image: ''
  });

  // Check authentication and fetch data
  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchProfileData();
    fetchUserTrips();
  }, [isAuthenticated, authLoading, navigate]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.get();
      console.log('=== PROFILE API RESPONSE ===');
      console.log('Full response:', response);
      console.log('response.data:', response.data);
      console.log('response.data?.profile:', response.data?.profile);
      
      // Handle the response structure - profile should be in response.data.profile
      let profileInfo = response.data?.profile;
      
      console.log('Extracted profileInfo:', profileInfo);
      console.log('profileInfo?.firstName:', profileInfo?.firstName);
      console.log('profileInfo?.lastName:', profileInfo?.lastName);
      
      if (!profileInfo) {
        // If no profile exists, create one from user data
        console.log('No profile data found, using user data from auth context');
        profileInfo = {
          firstName: user?.first_name || user?.firstName || '',
          lastName: user?.last_name || user?.lastName || '',
          email: user?.email || '',
          phoneNumber: '',
          city: '',
          country: ''
        };
      }
      
      console.log('Final profileInfo to be set:', profileInfo);
      setProfileData(profileInfo);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // If profile fetch fails, we can still display user data from auth context
      console.log('Using fallback user data from auth context');
      setProfileData({
        firstName: user?.first_name || user?.firstName || '',
        lastName: user?.last_name || user?.lastName || '',
        email: user?.email || '',
        phoneNumber: '',
        city: '',
        country: ''
      });
      setError(null); // Don't show error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTrips = async () => {
    try {
      const response = await tripAPI.getAll();
      console.log('Trips response:', response);
      const trips = response.data?.trips || response.trips || [];
      setUserTrips(trips);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const removeImage = () => setProfileImage(null);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await tripAPI.delete(tripId);
      setUserTrips(prevTrips => prevTrips.filter(t => t.id !== tripId));
    } catch (err) {
      console.error('Failed to delete trip:', err);
      setError('Failed to delete trip');
    }
  };

  return (
    <div className="profile-page">
      {loading ? (
        <div className="loading">Loading profile...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <>
          <div className="profile-card">
            <div className="profile-image-section">
              <div className="profile-image-wrapper">
                <div className="profile-image">
                  {profileImage ? <img src={profileImage} alt="User" /> : <span>Photo</span>}
                </div>
                <label className="camera-btn" title="Update photo">
                  📷
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
                </label>
              </div>
              {profileImage && (
                <button className="remove-img" onClick={removeImage}>Remove</button>
              )}
            </div>

            <div className="profile-details">
              <h2>User Details</h2>
              <p><strong>Name:</strong> {profileData?.firstName || profileData?.first_name || ''} {profileData?.lastName || profileData?.last_name || ''}</p>
              <p><strong>Email:</strong> {user?.email || ''}</p>
              <p><strong>Phone:</strong> {profileData?.phoneNumber || profileData?.phone_number || 'Not provided'}</p>
              <p><strong>City:</strong> {profileData?.city || 'Not provided'}</p>
              <p><strong>Country:</strong> {profileData?.country || 'Not provided'}</p>
              <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</p>
              <p><strong>Trips planned:</strong> {userTrips.length}</p>
              <Button>Edit Profile</Button>
            </div>
          </div>

          <section>
            <div className="section-header">
              <h3 className="section-title">My Trips ({userTrips.length})</h3>
              <Button variant="primary" onClick={() => navigate('/create-trip')}>+ Create New Trip</Button>
            </div>
            {userTrips.length > 0 ? (
              <div className="trip-grid">
                {userTrips.map(trip => (
                  <div key={trip.id} className="trip-card">
                    <div className="trip-thumb" style={{backgroundColor: '#ccc'}}>
                      <span>{trip.name}</span>
                    </div>
                    <div className="trip-info">
                      <h4>{trip.name}</h4>
                      <p className="trip-meta">{trip.start_date} to {trip.end_date}</p>
                      <p className="trip-desc">{trip.description || 'No description'}</p>
                      <div className="trip-footer">
                        <div className="trip-actions">
                          <Button variant="primary" onClick={() => navigate(`/itinerary/${trip.id}`)}>View</Button>
                          <button className="remove-trip" onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-trips">No trips created yet. <Button onClick={() => navigate('/create-trip')}>Create your first trip!</Button></p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Profile;
