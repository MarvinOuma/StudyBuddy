import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ groupsJoined: 0, sessionsAttended: 0 });
  const [joinedGroups, setJoinedGroups] = useState([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const membershipsRes = await api.get('/memberships/user');
        const sessionsRes = await api.get('/sessions/');
        
        setJoinedGroups(membershipsRes.data);
        setStats({
          groupsJoined: membershipsRes.data.length,
          sessionsAttended: sessionsRes.data.length
        });
      } catch (err) {
        console.error('Failed to load user stats');
      }
    };
    
    if (user) {
      fetchUserStats();
    }
  }, [user]);

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
          <span>Sessions Available:</span>
          <span>{stats.sessionsAttended}</span>
        </div>
      </div>
      
      <div className="joined-groups">
        <h3>Your Groups</h3>
        {joinedGroups.length > 0 ? (
          <div className="groups-list">
            {joinedGroups.map(group => (
              <div key={group.group_id} className="group-item">
                <h4>{group.title}</h4>
                <p><strong>Subject:</strong> {group.subject}</p>
                <p>{group.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't joined any groups yet. <a href="/groups">Browse groups</a></p>
        )}
      </div>
    </div>
  );
};

export default Profile;
