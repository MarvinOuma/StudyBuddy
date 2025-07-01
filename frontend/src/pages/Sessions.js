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
      setMessage('Session created successfully!');
      const response = await api.get('/sessions/');
      setSessions(response.data);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to create session');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await api.delete(`/sessions/${sessionId}`);
        setSessions(sessions.filter(s => s.id !== sessionId));
        setMessage('Session deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('Failed to delete session');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const toggleSessionStatus = async (sessionId) => {
    try {
      const response = await api.put(`/sessions/${sessionId}/toggle-status`);
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, status: response.data.status } : s
      ));
      setMessage('Session status updated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update session status');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Study Sessions</h2>
        <p>Manage your study sessions and track attendance</p>
        {message && <div className={message.includes('successfully') ? 'success' : 'error'}>{message}</div>}
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Schedule New Session'}
        </button>
      </div>
      
      {showForm && (
        <div className="card">
          <h3>Schedule New Session</h3>
          <form onSubmit={createSession}>
            <div className="form-group">
              <label>Group ID</label>
              <input
                type="number"
                placeholder="Enter group ID"
                value={newSession.group_id}
                onChange={(e) => setNewSession({...newSession, group_id: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newSession.date}
                onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={newSession.time}
                onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Online, Library, etc."
                value={newSession.location}
                onChange={(e) => setNewSession({...newSession, location: e.target.value})}
              />
            </div>
            <button type="submit" className="btn">Schedule Session</button>
          </form>
        </div>
      )}
      
      <div className="sessions-grid">
        {sessions.map(session => {
          const isCompleted = session.status === 'completed';
          return (
            <div key={session.id} className="card">
              <h3>Study Session</h3>
              <p><strong>Group ID:</strong> {session.group_id}</p>
              <p><strong>Date:</strong> {session.date}</p>
              <p><strong>Time:</strong> {session.time}</p>
              <p><strong>Location:</strong> {session.location || 'Online'}</p>
              <div className="session-actions">
                <div className="session-status">
                  <span className={isCompleted ? 'session-completed' : 'session-upcoming'}>
                    {isCompleted ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
                <div className="session-buttons">
                  <button 
                    className={`btn ${isCompleted ? 'btn-secondary' : 'btn'}`} 
                    onClick={() => toggleSessionStatus(session.id)}
                  >
                    Mark as {isCompleted ? 'Upcoming' : 'Completed'}
                  </button>
                  <button className="btn btn-danger" onClick={() => deleteSession(session.id)}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sessions;
