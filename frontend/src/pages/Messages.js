import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Messages.css';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/memberships/user');
        setGroups(response.data);
        if (response.data.length > 0) {
          setSelectedGroup(response.data[0]);
        }
      } catch (err) {
        setError('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(selectedGroup.group_id);
    }
  }, [selectedGroup]);

  const fetchMessages = async (groupId) => {
    try {
      const response = await api.get(`/messages/group/${groupId}`);
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroup) return;
    
    setSending(true);
    try {
      await api.post(`/messages/group/${selectedGroup.group_id}`, {
        content: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedGroup.group_id);
    } catch (err) {
      console.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-sidebar">
          <h3>Your Groups</h3>
          <div className="groups-list">
            {groups.map(group => (
              <div 
                key={group.group_id} 
                className={`group-item ${selectedGroup?.group_id === group.group_id ? 'active' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                <h4>{group.title}</h4>
                <p>{group.subject}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-main">
          {selectedGroup ? (
            <>
              <div className="chat-header">
                <h2>{selectedGroup.title}</h2>
                <p>Group Chat - {selectedGroup.subject}</p>
              </div>
              
              <div className="messages-area">
                {messages.map(message => (
                  <div key={message.id} className={`message ${message.user_id === user?.id ? 'own-message' : ''}`}>
                    <div className="message-content">
                      <div className="message-header">
                        <strong>{message.username || `User ${message.user_id}`}</strong>
                        <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <form className="message-form" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                />
                <button type="submit" className="btn" disabled={sending || !newMessage.trim()}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div className="no-group-selected">
              <p>Select a group to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
