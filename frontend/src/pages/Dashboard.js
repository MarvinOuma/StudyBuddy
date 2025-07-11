import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ groups: 0, sessions: 0, memberships: 0 });
  const [recentGroups, setRecentGroups] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [groupsRes, sessionsRes, membershipsRes] = await Promise.all([
          api.get('/groups/'),
          api.get('/sessions/'),
          api.get('/memberships/user')
        ]);
        
        setStats({
          groups: groupsRes.data.length,
          sessions: sessionsRes.data.length,
          memberships: membershipsRes.data.length
        });
        
        setRecentGroups(groupsRes.data.slice(0, 3));
        setUpcomingSessions(sessionsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data');
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome back, {user?.username || 'User'}!</h2>
        <p>Here's your study activity overview</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.groups}</h3>
          <p>Available Groups</p>
        </div>
        <div className="stat-card">
          <h3>{stats.memberships}</h3>
          <p>Your Memberships</p>
        </div>
        <div className="stat-card">
          <h3>{stats.sessions}</h3>
          <p>Total Sessions</p>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="section">
          <h3>Recent Groups</h3>
          {recentGroups.length > 0 ? recentGroups.map(group => (
            <div key={group.id} className="item">
              <h4>{group.title}</h4>
              <p><strong>Subject:</strong> {group.subject}</p>
              <p>{group.description}</p>
            </div>
          )) : <p>No groups yet. <a href="/groups">Join your first group!</a></p>}
        </div>
        
        <div className="section">
          <h3>Upcoming Sessions</h3>
          {upcomingSessions.length > 0 ? upcomingSessions.map(session => (
            <div key={session.id} className="item">
              <p><strong>Date:</strong> {session.date}</p>
              <p><strong>Time:</strong> {session.time}</p>
              <p><strong>Location:</strong> {session.location || 'Online'}</p>
            </div>
          )) : <p>No sessions scheduled. <a href="/sessions">Schedule one now!</a></p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
