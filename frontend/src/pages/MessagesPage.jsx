import React, { useState } from 'react';
import { Search, Phone, Video, Send, Smile, Paperclip, MoreVertical } from 'lucide-react';

export const MessagesPage = ({ onEnterVideoRoom }) => {
  const [selectedContact, setSelectedContact] = useState('rohan');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'rohan', text: 'Hey! Are you free for the session tomorrow?', time: '3:15 PM' },
    { id: 2, sender: 'you', text: 'Yes, 3 PM works for me.', time: '3:16 PM' },
    { id: 3, sender: 'rohan', text: "Great! I'll send the resources beforehand.", time: '3:18 PM' },
    { id: 4, sender: 'you', text: 'Sure, thanks! 😊', time: '3:20 PM' },
  ]);
  const [inputText, setInputText] = useState('');

  const contacts = [
    {
      id: 'rohan',
      name: 'Rohan Sharma',
      avatar: '/avatars/rohan.svg',
      lastMsg: 'See you in the session!',
      time: '3:20 PM',
      online: true,
      unread: false,
    },
    {
      id: 'priya',
      name: 'Priya Singh',
      avatar: '/avatars/priya.svg',
      lastMsg: "That's great!",
      time: '1:15 PM',
      online: false,
      unread: false,
    },
    {
      id: 'aman',
      name: 'Aman Verma',
      avatar: '/avatars/aman.svg',
      lastMsg: "Let's schedule tomorrow",
      time: 'Oct 13',
      online: true,
      unread: false,
    },
    {
      id: 'kritika',
      name: 'Kritika Jain',
      avatar: '/avatars/kritika.svg',
      lastMsg: 'Sure!',
      time: 'Oct 12',
      online: false,
      unread: false,
    },
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'you', text: inputText.trim(), time: 'Just now' },
    ]);
    setInputText('');
  };

  const activeContact = contacts.find((c) => c.id === selectedContact) || contacts[0];

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 60px',
      height: 'calc(100vh - 85px)',
    }}>
      <div className="clean-card" style={{
        padding: 0,
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        overflow: 'hidden',
      }}>
        {/* Left Column: Conversations List */}
        <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          {/* Header & Search */}
          <div style={{ padding: '20px 18px 14px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginBottom: '14px' }}>
              Messages
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
            }}>
              <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search conversations..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  fontSize: '0.88rem',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Contact List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.map((c) => {
              const isSelected = selectedContact === c.id;
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
                      src={c.avatar}
                      alt={c.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    {c.online && (
                      <span style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#10b981',
                        border: '2px solid #ffffff',
                      }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.name}
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{c.time}</span>
                    </div>
                    <p style={{
                      fontSize: '0.82rem',
                      color: isSelected ? '#0d9488' : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {c.lastMsg}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
          {/* Top Chat Bar */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ fontSize: '1rem', color: '#0f172a', display: 'block' }}>
                  {activeContact.name}
                </strong>
                <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>
                  Online
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn-outline-gray" style={{ padding: '8px', borderRadius: '50%', border: 'none' }} title="Phone Call">
                <Phone size={18} color="#475569" />
              </button>

              <button
                onClick={() => onEnterVideoRoom?.({
                  tutorName: activeContact.name,
                  skill: 'Web Development',
                  roomId: `room-${activeContact.id}`,
                })}
                className="btn-teal"
                style={{ padding: '8px 14px', gap: '6px', fontSize: '0.85rem' }}
                title="Launch WebRTC Video Room"
              >
                <Video size={16} />
                <span>Video Call</span>
              </button>

              <button className="btn-outline-gray" style={{ padding: '8px', borderRadius: '50%', border: 'none' }}>
                <MoreVertical size={18} color="#475569" />
              </button>
            </div>
          </div>

          {/* Message Thread */}
          <div style={{
            flex: 1,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto',
            background: '#f8fafc',
          }}>
            {messages.map((m) => {
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
                  <div style={{
                    background: isMe ? '#0d9488' : '#ffffff',
                    color: isMe ? '#ffffff' : '#0f172a',
                    padding: '10px 16px',
                    borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    maxWidth: '65%',
                    fontSize: '0.92rem',
                    lineHeight: 1.45,
                    border: isMe ? 'none' : '1px solid #e2e8f0',
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                    {m.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Chat Input Bar */}
          <form onSubmit={handleSend} style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#ffffff',
          }}>
            <button type="button" style={{ color: '#94a3b8' }}>
              <Smile size={20} />
            </button>
            <button type="button" style={{ color: '#94a3b8' }}>
              <Paperclip size={20} />
            </button>

            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.92rem',
              }}
            />

            <button
              type="submit"
              className="btn-teal"
              style={{ padding: '10px 16px', borderRadius: '8px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
