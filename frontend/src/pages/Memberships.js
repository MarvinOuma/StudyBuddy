import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await api.get('/memberships');
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
    <div>
      <h2>Your Memberships</h2>
      <ul>
        {memberships.map(membership => (
          <li key={membership.id}>
            <h3>{membership.group_title}</h3>
            <p>Status: {membership.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Memberships;
