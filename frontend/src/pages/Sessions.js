import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Sessions.css';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newSession, setNewSession] = useState({ group_id: '', date: '', time: '', location: '' });
  const [message, setMessage] = useState('');

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
      
      <div className="sessions-grid">
        {sessions.map(session => {
          const isCompleted = new Date(session.date) < new Date();
          return (
            <div key={session.id} className="card">
              <h3>Study Session</h3>
              <p><strong>Group ID:</strong> {session.group_id}</p>
              <p><strong>Date:</strong> {session.date}</p>
              <p><strong>Time:</strong> {session.time}</p>
              <p><strong>Location:</strong> {session.location || 'Online'}</p>
              <div className="session-status">
                {isCompleted ? (
                  <span className="session-completed">✅ Completed</span>
                ) : (
                  <span className="session-upcoming">⏰ Upcoming</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sessions;
