import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ groupsJoined: 0, sessionsAttended: 0 });
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', passwordData);
      setMessage('Password changed successfully!');
      setMessageType('success');
      setPasswordData({ current_password: '', new_password: '' });
      setShowPasswordForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to change password. Check your current password.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/auth/delete-account');
        logout();
        navigate('/login');
      } catch (err) {
        setMessage('Failed to delete account');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Your Profile</h2>
        {message && <div className={messageType === 'success' ? 'success' : 'error'}>{message}</div>}
        <div className="profile-info">
          <p><strong>Username:</strong> {user?.username || 'Not logged in'}</p>
          <p><strong>ID:</strong> {user?.id || 'N/A'}</p>
        </div>
        <div className="profile-actions">
          <button className="btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
          <button className="btn btn-danger" onClick={deleteAccount}>Delete Account</button>
        </div>
      </div>
      
      {showPasswordForm && (
        <div className="card">
          <h3>Change Password</h3>
          <form onSubmit={changePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn">Change Password</button>
          </form>
        </div>
      )}
      
      <div className="card">
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
      
      <div className="card">
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
