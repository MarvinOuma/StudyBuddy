import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions');
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

  return (
    <div>
      <h2>Study Sessions</h2>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            <h3>{session.title}</h3>
            <p>Group: {session.group_name}</p>
            <p>Date: {new Date(session.date).toLocaleString()}</p>
            <p>{session.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sessions;
