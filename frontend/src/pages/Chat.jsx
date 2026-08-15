import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import {
  FiSend,
  FiHash,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiUsers,
  FiSmile,
  FiPaperclip,
  FiShield,
  FiUserCheck,
  FiCheckCircle,
} from 'react-icons/fi';
import './Chat.css';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return 'Today at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const EMOJI_PRESETS = ['👍', '🙌', '🔥', '✅', '❤️', '🎉'];

const Chat = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState('global');
  const [newRoomName, setNewRoomName] = useState('');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const isFirstLoad = useRef(true);

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/chat/rooms');
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const fetchMessages = async (room, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await api.get(`/chat/${room}`);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    isFirstLoad.current = true;
    fetchMessages(activeRoom, false);

    const interval = setInterval(() => {
      fetchMessages(activeRoom, true);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeRoom]);

  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      isFirstLoad.current = false;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    const sentText = text;
    setText('');
    try {
      await api.post(`/chat/${activeRoom}`, { text: sentText });
      await fetchMessages(activeRoom, true);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to send message:', err);
      setText(sentText);
    } finally {
      setSending(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + ' ' + emoji);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const formatted = newRoomName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!formatted) return;
    setActiveRoom(formatted);
    setNewRoomName('');
    setShowAddRoom(false);
  };

  const switchRoom = (room) => {
    setActiveRoom(room);
    setMessages([]);
    setLoading(true);
    isFirstLoad.current = true;
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="chat-page-root">
      {/* Sidebar Channels */}
      <div className="chat-sidebar-pane">
        <div className="chat-sidebar-header">
          <div className="sidebar-brand-row">
            <FiMessageSquare size={18} color="var(--color-primary)" />
            <h3 className="sidebar-title">Channels</h3>
          </div>
          <button
            onClick={() => setShowAddRoom(!showAddRoom)}
            className="create-channel-btn"
            title="Create New Channel"
          >
            <FiPlus size={16} />
          </button>
        </div>

        {showAddRoom && (
          <form onSubmit={handleCreateRoom} className="create-room-form">
            <div className="input-with-icon-wrapper">
              <FiHash size={14} className="input-left-icon" />
              <input
                type="text"
                placeholder="new-channel-name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="create-room-input"
                autoFocus
              />
            </div>
          </form>
        )}

        <div className="channels-list">
          <div
            className={`channel-item-row${activeRoom === 'global' ? ' active' : ''}`}
            onClick={() => switchRoom('global')}
          >
            <span className="hash-icon">#</span>
            <span className="channel-name">global-lounge</span>
            <span className="online-dot-pill" title="Live Channel" />
          </div>

          {rooms
            .filter((r) => r.room !== 'global')
            .map((r) => (
              <div
                key={r.room}
                className={`channel-item-row${activeRoom === r.room ? ' active' : ''}`}
                onClick={() => switchRoom(r.room)}
              >
                <span className="hash-icon">#</span>
                <span className="channel-name">{r.room}</span>
                {r.messageCount > 0 && (
                  <span className="msg-count-badge">{r.messageCount}</span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="chat-main-pane">
        {/* Header */}
        <div className="chat-header-bar">
          <div className="header-channel-info">
            <div className="header-channel-title">
              <FiHash size={20} color="var(--color-primary)" />
              <h2>{activeRoom === 'global' ? 'global-lounge' : activeRoom}</h2>
              <span className="header-live-badge">
                <span className="pulse-dot" /> Live
              </span>
            </div>
            <p className="header-channel-desc">
              Team communication & real-time ticket discussions.
            </p>
          </div>

          <div className="header-search-wrapper">
            <FiSearch size={15} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search in conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
          </div>
        </div>

        {/* Messages Body */}
        <div className="chat-messages-container">
          {loading ? (
            <div className="chat-loader-center">
              <Loader />
            </div>
          ) : (
            <>
              {filteredMessages.length === 0 && (
                <div className="chat-empty-state">
                  <FiMessageSquare size={36} color="var(--color-text-muted)" />
                  <h4>No messages found in #{activeRoom === 'global' ? 'global-lounge' : activeRoom}</h4>
                  <p>Start the conversation or try a different search filter!</p>
                </div>
              )}

              {filteredMessages.map((msg) => {
                const isMe = msg.sender?._id === user?._id;
                const role = msg.sender?.role || 'employee';

                return (
                  <div
                    key={msg._id}
                    className={`chat-message-row${isMe ? ' is-outgoing' : ' is-incoming'}`}
                  >
                    <div className="chat-avatar-circle">
                      {msg.sender?.avatar ? (
                        <img src={msg.sender.avatar} alt={msg.sender.name} className="avatar-img" />
                      ) : (
                        <span>{msg.sender?.name?.charAt(0).toUpperCase() || '?'}</span>
                      )}
                    </div>

                    <div className="chat-message-bubble">
                      <div className="bubble-meta-row">
                        <div className="sender-name-group">
                          <span className="sender-name">{isMe ? 'You' : msg.sender?.name || 'Unknown'}</span>
                          <span className={`role-badge ${role}`}>
                            {role === 'admin' ? <FiShield size={10} /> : <FiUserCheck size={10} />}
                            {role}
                          </span>
                        </div>
                        <span className="bubble-timestamp">{formatTime(msg.createdAt)}</span>
                      </div>

                      <div className="bubble-content-text">{msg.text}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Dock */}
        <div className="chat-input-dock">
          {/* Quick Emoji Bar */}
          <div className="quick-emoji-bar">
            {EMOJI_PRESETS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="emoji-chip"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Message #${activeRoom === 'global' ? 'global-lounge' : activeRoom}...`}
              disabled={sending}
              className="chat-text-input"
            />

            <button
              type="submit"
              className="chat-send-btn"
              disabled={!text.trim() || sending}
            >
              <FiSend size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
