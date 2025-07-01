import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Memberships.css';

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupSessions, setGroupSessions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await api.get('/memberships/user');
        setMemberships(response.data);
      } catch (err) {
        setError('Failed to load memberships');
      } finally {
        setLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  const fetchGroupDetails = async (groupId) => {
    try {
      const [membersRes, sessionsRes] = await Promise.all([
        api.get(`/groups/${groupId}/members`),
        api.get('/sessions/')
      ]);
      setGroupMembers(membersRes.data || []);
      setGroupSessions(sessionsRes.data.filter(s => s.group_id === groupId));
    } catch (err) {
      console.error('Failed to load group details');
    }
  };

  const leaveGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await api.post('/memberships/leave', { group_id: groupId });
        setMemberships(memberships.filter(m => m.group_id !== groupId));
        setMessage('Successfully left the group');
        setSelectedGroup(null);
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('Failed to leave group');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const viewGroupDetails = (group) => {
    setSelectedGroup(group);
    fetchGroupDetails(group.group_id);
  };

  if (loading) return <p>Loading memberships...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="card">
        <h2>👥 My Study Groups</h2>
        <p>Manage your group memberships and view group details</p>
        {message && <div className={message.includes('Successfully') ? 'success' : 'error'}>{message}</div>}
      </div>

      {!selectedGroup ? (
        <div className="groups-grid">
          {memberships.map(membership => (
            <div key={membership.group_id} className="card">
              <h3>{membership.title}</h3>
              <p><strong>Subject:</strong> {membership.subject}</p>
              <p>{membership.description}</p>
              <div className="group-actions">
                <button className="btn" onClick={() => viewGroupDetails(membership)}>View Details</button>
                <button className="btn btn-danger" onClick={() => leaveGroup(membership.group_id)}>Leave Group</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="card">
            <button className="btn btn-secondary" onClick={() => setSelectedGroup(null)}>← Back to My Groups</button>
            <h2>{selectedGroup.title}</h2>
            <p><strong>Subject:</strong> {selectedGroup.subject}</p>
            <p>{selectedGroup.description}</p>
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <h3>👤 Group Members</h3>
              {groupMembers.length > 0 ? (
                groupMembers.map(member => (
                  <div key={member.id} className="item">
                    <p><strong>{member.username}</strong></p>
                    <p>Role: {member.role || 'Member'}</p>
                  </div>
                ))
              ) : (
                <p>No members data available</p>
              )}
            </div>

            <div className="section">
              <h3>📅 Group Sessions</h3>
              {groupSessions.length > 0 ? (
                groupSessions.map(session => (
                  <div key={session.id} className="item">
                    <p><strong>Date:</strong> {session.date}</p>
                    <p><strong>Time:</strong> {session.time}</p>
                    <p><strong>Location:</strong> {session.location || 'Online'}</p>
                    <span className={new Date(session.date) < new Date() ? 'session-completed' : 'session-upcoming'}>
                      {new Date(session.date) < new Date() ? '✅ Completed' : '⏰ Upcoming'}
                    </span>
                  </div>
                ))
              ) : (
                <p>No sessions scheduled for this group</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memberships;
