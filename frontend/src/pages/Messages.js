import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/messages/group/1');
        setMessages(response.data);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="messages-container">
      <h2>Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id}>
            <p><strong>{message.sender_name}:</strong> {message.content}</p>
            <p><em>{new Date(message.timestamp).toLocaleString()}</em></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
