import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Memberships.css';

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading memberships...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="memberships-container">
      <h2>Your Memberships</h2>
      <ul>
        {memberships.map(membership => (
          <li key={membership.group_id}>
            <h3>{membership.title}</h3>
            <p>Subject: {membership.subject}</p>
            <p>{membership.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Memberships;
