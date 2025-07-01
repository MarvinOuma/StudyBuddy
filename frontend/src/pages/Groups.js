import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Groups.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups');
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

  return (
    <div className="groups-container">
      <h2>Study Groups</h2>
      <ul>
        {groups.map(group => (
          <li key={group.id}>
            <h3>{group.title}</h3>
            <p>Subject: {group.subject}</p>
            <p>{group.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Groups;
