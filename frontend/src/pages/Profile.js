import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ groupsJoined: 0, sessionsAttended: 0 });

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <p><strong>Username:</strong> {user?.username || 'Not logged in'}</p>
        <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
      </div>
      
      <div className="profile-stats">
        <h3>Your Study Activity</h3>
        <div className="stat-item">
          <span>Groups Joined:</span>
          <span>{stats.groupsJoined}</span>
        </div>
        <div className="stat-item">
          <span>Sessions Attended:</span>
          <span>{stats.sessionsAttended}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
