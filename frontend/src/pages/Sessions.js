import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Sessions.css';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newSession, setNewSession] = useState({ group_id: '', date: '', time: '', location: '' });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions/');
        setSessions(response.data);
      } catch (err) {
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p>{error}</p>;

  const createSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions/', newSession);
      setNewSession({ group_id: '', date: '', time: '', location: '' });
      setShowForm(false);
      const response = await api.get('/sessions/');
      setSessions(response.data);
    } catch (err) {
      setError('Failed to create session');
    }
  };

  return (
    <div className="sessions-container">
      <h2>Study Sessions</h2>
      <button onClick={() => setShowForm(!showForm)}>Schedule New Session</button>
      
      {showForm && (
        <form onSubmit={createSession}>
          <input
            type="number"
            placeholder="Group ID"
            value={newSession.group_id}
            onChange={(e) => setNewSession({...newSession, group_id: e.target.value})}
            required
          />
          <input
            type="date"
            value={newSession.date}
            onChange={(e) => setNewSession({...newSession, date: e.target.value})}
            required
          />
          <input
            type="time"
            value={newSession.time}
            onChange={(e) => setNewSession({...newSession, time: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Location (optional)"
            value={newSession.location}
            onChange={(e) => setNewSession({...newSession, location: e.target.value})}
          />
          <button type="submit">Schedule Session</button>
        </form>
      )}
      
      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            <p>Group ID: {session.group_id}</p>
            <p>Date: {session.date}</p>
            <p>Time: {session.time}</p>
            <p>Location: {session.location || 'Not specified'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sessions;
