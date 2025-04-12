import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Public/Navbar';
import '../css/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP ${response.status}: ${errorData.detail || 'Unknown error'}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="profile-container">
        <Navbar />
        <div className="profile-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        {error && <div className="error-message">{error}</div>}

        <div className="profile-section">
          <h2>Profile</h2>
          <div className="profile-box">
            <div className="profile-icon">👤</div>
            <div className="profile-details">
              <p><strong>This Page will be functional in future , I am not able to debug it due to time constraints. Rohit, Happy coding!! </strong></p>
              <p><strong>Name:</strong> {profile?.name || 'N/A'}</p>
              <p><strong>Roll Number:</strong> {profile?.roll_number || 'N/A'}</p>
              <p><strong>Role:</strong> {profile?.role || 'N/A'}</p>
              <p><strong>User ID:</strong> {profile?._id || 'N/A'}</p>
            </div>
          </div>
          <button onClick={() => navigate('/home')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;