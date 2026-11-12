import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Phone,
  Video,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Trash2,
  User,
} from 'lucide-react';
import { getAvatarSrc } from '../utils/avatars';

const QUICK_EMOJIS = ['😊', '👍', '🚀', '💻', '🔥', '🙌', '📚', '✅'];

const INITIAL_THREADS = {
  rohan: [
    { id: 1, sender: 'rohan', text: 'Hey! Are you free for our Web Development session?', time: '3:15 PM' },
    { id: 2, sender: 'you', text: 'Yes, 3 PM works great for me.', time: '3:16 PM' },
    { id: 3, sender: 'rohan', text: "Great! I'll share the GitHub repo beforehand.", time: '3:18 PM' },
    { id: 4, sender: 'you', text: 'Sure, thanks! 😊', time: '3:20 PM' },
  ],
  priya: [
    { id: 1, sender: 'priya', text: 'Hi! Ready to review your Figma wireframes?', time: '1:10 PM' },
    { id: 2, sender: 'you', text: 'Uploaded my latest prototype link!', time: '1:12 PM' },
    { id: 3, sender: 'priya', text: "That's great! Let's hop on video soon.", time: '1:15 PM' },
  ],
  aman: [
    { id: 1, sender: 'aman', text: 'I prepared some Scikit-learn & TensorFlow examples for you.', time: 'Yesterday' },
    { id: 2, sender: 'aman', text: "Let's schedule tomorrow at 5:00 PM.", time: 'Oct 13' },
  ],
  kritika: [
    { id: 1, sender: 'you', text: 'Can you show me color grading shortcuts in Premiere Pro?', time: 'Oct 12' },
    { id: 2, sender: 'kritika', text: 'Sure! Bring a sample clip to our session.', time: 'Oct 12' },
  ],
};

export const MessagesPage = ({ onEnterVideoRoom, onNavigate, initialContactName }) => {
  const [selectedContact, setSelectedContact] = useState('rohan');
  const [searchQuery, setSearchQuery] = useState('');
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  const contacts = [
    {
      id: 'rohan',
      name: 'Rohan Sharma',
      skill: 'Web Development',
      avatar: '/avatars/rohan.svg',
      time: '3:20 PM',
      online: true,
    },
    {
      id: 'priya',
      name: 'Priya Singh',
      skill: 'UI/UX Design',
      avatar: '/avatars/priya.svg',
      time: '1:15 PM',
      online: false,
    },
    {
      id: 'aman',
      name: 'Aman Verma',
      skill: 'Data Science',
      avatar: '/avatars/aman.svg',
      time: 'Oct 13',
      online: true,
    },
    {
      id: 'kritika',
      name: 'Kritika Jain',
      skill: 'Video Editing',
      avatar: '/avatars/kritika.svg',
      time: 'Oct 12',
      online: false,
    },
  ];

  useEffect(() => {
    if (initialContactName) {
      const matched = contacts.find((c) =>
        c.name.toLowerCase().includes(initialContactName.toLowerCase())
      );
      if (matched) {
        setSelectedContact(matched.id);
      }
    }
  }, [initialContactName]);

  useEffect(() => {
    const closeMenus = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', closeMenus);
    return () => document.removeEventListener('mousedown', closeMenus);
  }, []);

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const lastMessage = (threads[c.id]?.slice(-1)[0]?.text || '').toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.skill.toLowerCase().includes(q) ||
      lastMessage.includes(q)
    );
  });

  const activeContact = contacts.find((c) => c.id === selectedContact) || contacts[0];
  const currentMessages = threads[activeContact.id] || [];

  const appendMessage = (text) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setThreads((prev) => ({
      ...prev,
      [activeContact.id]: [
        ...(prev[activeContact.id] || []),
        { id: Date.now(), sender: 'you', text, time: nowTime },
      ],
    }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    appendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleAttachResource = () => {
    appendMessage(`📎 Shared Study Notes: https://github.com/skillswap/${activeContact.id}-notes`);
  };

  const handleClearThread = () => {
    setThreads((prev) => ({ ...prev, [activeContact.id]: [] }));
    setShowMoreMenu(false);
  };

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '24px 20px 60px',
        height: 'calc(100vh - 85px)',
      }}
    >
      <div
        className="clean-card"
        style={{
          padding: 0,
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          overflow: 'hidden',
        }}
      >
        {/* Left Column: Conversations List */}
        <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 18px 14px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginBottom: '14px' }}>
              Messages
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '8px 12px',
              }}
            >
              <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxShadow: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Contact List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.length === 0 ? (
              <div style={{ padding: '20px', fontSize: '0.86rem', color: '#64748b', textAlign: 'center' }}>
                No conversations match "{searchQuery}".
              </div>
            ) : (
              filteredContacts.map((c) => {
                const isSelected = selectedContact === c.id;
                const latestMsg = threads[c.id]?.slice(-1)[0]?.text || 'No messages yet';

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContact(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      background: isSelected ? '#f0fdfa' : 'transparent',
                      borderLeft: isSelected ? '4px solid #0d9488' : '4px solid transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={getAvatarSrc(c.avatar, c.name)}
                        alt={c.name}
                        style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                      />
                      {c.online && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '0px',
                            width: '10px',
                            height: '10px',
                            background: '#10b981',
                            border: '2px solid #ffffff',
                          }}
                        />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong
                          style={{
                            fontSize: '0.92rem',
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {c.name}
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{c.time}</span>
                      </div>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: isSelected ? '#0d9488' : '#64748b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {latestMsg}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
          {/* Top Chat Bar */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={getAvatarSrc(activeContact.avatar, activeContact.name)}
                alt={activeContact.name}
                style={{ width: '42px', height: '42px', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ fontSize: '1rem', color: '#0f172a', display: 'block' }}>
                  {activeContact.name}
                </strong>
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: activeContact.online ? '#10b981' : '#64748b',
                    fontWeight: 600,
                  }}
                >
                  {activeContact.online ? 'Online' : 'Offline'} • {activeContact.skill}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() =>
                  onEnterVideoRoom?.({
                    tutorName: activeContact.name,
                    skill: `${activeContact.skill} (Audio/Video Call)`,
                    roomId: `room-${activeContact.id}`,
                  })
                }
                className="btn-outline-gray"
                style={{ padding: '8px', border: '1px solid #e2e8f0' }}
                title="Start Voice/Video Call"
              >
                <Phone size={18} color="#475569" />
              </button>

              <button
                type="button"
                onClick={() =>
                  onEnterVideoRoom?.({
                    tutorName: activeContact.name,
                    skill: activeContact.skill,
                    roomId: `room-${activeContact.id}`,
                  })
                }
                className="btn-teal"
                style={{ padding: '8px 14px', gap: '6px', fontSize: '0.85rem' }}
                title="Launch WebRTC Video Room"
              >
                <Video size={16} />
                <span>Video Call</span>
              </button>

              <div ref={moreMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="btn-outline-gray"
                  style={{ padding: '8px', border: '1px solid #e2e8f0' }}
                  title="More Options"
                >
                  <MoreVertical size={18} color="#475569" />
                </button>

                {showMoreMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: '180px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 10px 24px rgba(15,23,42,0.14)',
                      zIndex: 100,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onNavigate?.('explore');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.84rem',
                        color: '#0f172a',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <User size={14} />
                      <span>Browse Tutors</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearThread}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.84rem',
                        color: '#dc2626',
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Clear Chat</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Thread */}
          <div
            style={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              overflowY: 'auto',
              background: '#f8fafc',
            }}
          >
            {currentMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '40px' }}>
                Start a conversation with {activeContact.name}...
              </div>
            ) : (
              currentMessages.map((m) => {
                const isMe = m.sender === 'you';
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        background: isMe ? '#0d9488' : '#ffffff',
                        color: isMe ? '#ffffff' : '#0f172a',
                        padding: '10px 16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                        maxWidth: '65%',
                        fontSize: '0.92rem',
                        lineHeight: 1.45,
                        border: isMe ? 'none' : '1px solid #e2e8f0',
                        wordBreak: 'break-word',
                      }}
                    >
                      {m.text}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                      {m.time}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Chat Input Bar with Emoji Picker */}
          <div style={{ position: 'relative' }}>
            {showEmojiPicker && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '16px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '8px 10px',
                  display: 'flex',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                }}
              >
                {QUICK_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => `${prev}${em}`);
                      setShowEmojiPicker(false);
                    }}
                    style={{ fontSize: '1.2rem', padding: '4px' }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSend}
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#ffffff',
              }}
            >
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                style={{ color: showEmojiPicker ? '#0d9488' : '#64748b', padding: '4px' }}
                title="Insert Emoji"
              >
                <Smile size={20} />
              </button>
              <button
                type="button"
                onClick={handleAttachResource}
                style={{ color: '#64748b', padding: '4px' }}
                title="Share Study Notes Link"
              >
                <Paperclip size={20} />
              </button>

              <input
                type="text"
                placeholder={`Message ${activeContact.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #e2e8f0',
                  padding: '10px 14px',
                  fontSize: '0.92rem',
                }}
              />

              <button type="submit" className="btn-teal" style={{ padding: '10px 16px' }} title="Send Message">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
