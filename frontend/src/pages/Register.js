import React, { useState } from 'react';
import api from '../services/api';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      setSuccess('Registration successful! You can now log in.');
      setError(null);
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      setError(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Registration failed. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="container">
      <div className="auth-header">
        <h1 className="brand-title">StudyBuddy</h1>
        <p className="brand-subtitle">Collaborative Study Platform</p>
      </div>
      <div className="card register-container">
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
