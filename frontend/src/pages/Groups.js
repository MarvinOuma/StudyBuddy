import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Groups.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ title: '', subject: '', description: '' });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups/');
        setGroups(response.data);
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
      const response = await api.get('/groups/');
      setGroups(response.data);
    } catch (err) {
      setError('Failed to create group');
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await api.post('/memberships/join', { group_id: groupId });
      alert('Joined group successfully!');
    } catch (err) {
      alert('Failed to join group');
    }
  };

  return (
    <div className="groups-container">
      <h2>Study Groups</h2>
      <button onClick={() => setShowForm(!showForm)}>Create New Group</button>
      
      {showForm && (
        <form onSubmit={createGroup}>
          <input
            type="text"
            placeholder="Group Title"
            value={newGroup.title}
            onChange={(e) => setNewGroup({...newGroup, title: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={newGroup.subject}
            onChange={(e) => setNewGroup({...newGroup, subject: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={newGroup.description}
            onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
          />
          <button type="submit">Create Group</button>
        </form>
      )}
      
      <ul>
        {groups.map(group => (
          <li key={group.id}>
            <h3>{group.title}</h3>
            <p>Subject: {group.subject}</p>
            <p>{group.description}</p>
            <button onClick={() => joinGroup(group.id)}>Join Group</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Groups;
