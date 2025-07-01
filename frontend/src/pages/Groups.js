import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Groups.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ title: '', subject: '', description: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [joinedGroups, setJoinedGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const [groupsRes, membershipsRes] = await Promise.all([
          api.get('/groups/'),
          api.get('/memberships/user')
        ]);
        
        const joinedGroupIds = membershipsRes.data.map(m => m.group_id);
        const availableGroups = groupsRes.data.filter(g => !joinedGroupIds.includes(g.id));
        
        setGroups(availableGroups);
        setJoinedGroups(joinedGroupIds);
      } catch (err) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>{error}</p>;

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/groups/', newGroup);
      setNewGroup({ title: '', subject: '', description: '' });
      setShowForm(false);
      setMessage('Group created successfully! 🎉');
      setMessageType('success');
      const response = await api.get('/groups/');
      setGroups(response.data);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to create group. Please try again.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await api.post('/memberships/join', { group_id: groupId });
      setMessage('Successfully joined the group! 🎉');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to join group. You might already be a member.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Available Study Groups</h2>
        <p>Join existing groups or create your own study community</p>
        {message && (
          <div className={messageType === 'success' ? 'success' : 'error'}>
            {message}
          </div>
        )}
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create New Group'}
        </button>
      </div>
      
      {showForm && (
        <div className="card">
          <h3>Create New Study Group</h3>
          <form onSubmit={createGroup}>
            <div className="form-group">
              <label>Group Title</label>
              <input
                type="text"
                placeholder="e.g., Advanced Calculus Study Group"
                value={newGroup.title}
                onChange={(e) => setNewGroup({...newGroup, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                placeholder="e.g., Mathematics, Physics, Chemistry"
                value={newGroup.subject}
                onChange={(e) => setNewGroup({...newGroup, subject: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Tell others what this group is about..."
                value={newGroup.description}
                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                rows="3"
              />
            </div>
            <button type="submit" className="btn">Create Group</button>
          </form>
        </div>
      )}
      
      <div className="groups-grid">
        {groups.map(group => (
          <div key={group.id} className="card">
            <h3>{group.title}</h3>
            <p><strong>Subject:</strong> {group.subject}</p>
            <p>{group.description || 'No description provided'}</p>
            <button className="btn" onClick={() => joinGroup(group.id)}>Join Group</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
