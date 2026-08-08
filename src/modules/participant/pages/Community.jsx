import React, { useState } from 'react';
import {
  Users, MessageSquare, ThumbsUp, Heart, Flame, Sparkles, Send,
  Image as ImageIcon, Paperclip, Pin, Award, Calendar, Search, Filter, Hash
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Community({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for posts, channel, post composer & reactions
  const [activeChannel, setActiveChannel] = useState('general');
  const [newPostText, setNewPostText] = useState('');
  const [postsList, setPostsList] = useState([]);
  const [reactionsMap, setReactionsMap] = useState({});

  // 1. Authenticated Participant & Enrolled Programme from database
  const participant = wsLearners.find(l => l.email && l.email.toLowerCase() === userEmail) || {
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail
  };

  const displayName = participant.name || userEmail.split('@')[0] || 'Learner';

  // Find programme matching user's program/programId in wsPrograms
  const currentProgramme = wsPrograms.find(p => 
    p.name === participant.program || 
    p.title === participant.program || 
    p.id === participant.programId
  ) || wsPrograms[0] || null;

  // Database-driven initial feed structure
  const initialPosts = [
    {
      id: 'p1',
      author: currentProgramme?.leadFacilitator || 'Sarah Ahmed',
      role: 'Lead Facilitator',
      avatar: 'S',
      time: '2 hours ago',
      channel: 'announcements',
      pinned: true,
      content: 'Welcome everyone to Week 4 of the programme! Today\'s design system tokens guide and live recording have been published. Check out the Resources tab for downloadable materials.',
      likes: 18,
      commentsCount: 5
    },
    {
      id: 'p2',
      author: 'David Okafor',
      role: 'Participant',
      avatar: 'D',
      time: '4 hours ago',
      channel: 'general',
      content: 'Has anyone started Assignment 1 on building component state machines? Let\'s discuss approach algorithms here.',
      likes: 6,
      commentsCount: 3
    }
  ];

  const currentPosts = postsList.length > 0 ? postsList : initialPosts;

  // Filter posts by channel
  const displayedPosts = currentPosts.filter(p => activeChannel === 'general' || p.channel === activeChannel || p.pinned);

  // Handle Post Submit
  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: `p_${Date.now()}`,
      author: displayName,
      role: 'Participant',
      avatar: displayName[0].toUpperCase(),
      time: 'Just now',
      channel: activeChannel,
      content: newPostText,
      likes: 0,
      commentsCount: 0
    };
    setPostsList([newPost, ...currentPosts]);
    setNewPostText('');
  };

  // Toggle Reaction
  const handleToggleLike = (id) => {
    setReactionsMap(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div style={{
      maxWidth: '1180px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── HEADER ── */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
          Programme Cohort Community
        </h1>
        <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
          Connect with your cohort in <strong>{currentProgramme?.name || 'Your Programme'}</strong>, ask questions, share ideas, and celebrate wins.
        </p>
      </div>

      {/* ── THREE-COLUMN LAYOUT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* ── LEFT COLUMN — CHANNELS & PROGRAMME INFO ── */}
        <div style={{
          backgroundColor: PARTICIPANT_THEME.cardBg,
          border: `1px solid ${PARTICIPANT_THEME.border}`,
          borderRadius: PARTICIPANT_THEME.radius,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Enrolled Cohort
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
              {currentProgramme?.name || 'Design Bootcamp'}
            </div>
            <div style={{ fontSize: '12px', color: PARTICIPANT_THEME.muted, marginTop: '2px' }}>
              {wsLearners.length} Enrolled Members
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${PARTICIPANT_THEME.border}`, paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Channels
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { id: 'general', label: 'general' },
                { id: 'announcements', label: 'announcements' },
                { id: 'questions', label: 'q-and-a' },
                { id: 'showcase', label: 'project-showcase' }
              ].map(ch => {
                const isCurrent = activeChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: isCurrent ? PARTICIPANT_THEME.hover : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: isCurrent ? PARTICIPANT_THEME.text : PARTICIPANT_THEME.muted,
                      fontWeight: isCurrent ? 700 : 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Hash size={14} color={isCurrent ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted} />
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CENTER COLUMN — COMMUNITY FEED & POST COMPOSER ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Post Composer Card */}
          <div style={{
            backgroundColor: PARTICIPANT_THEME.cardBg,
            border: `1px solid ${PARTICIPANT_THEME.border}`,
            borderRadius: PARTICIPANT_THEME.radius,
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
          }}>
            <textarea
              rows={3}
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
              placeholder={`Share something with your cohort in #${activeChannel}...`}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: PARTICIPANT_THEME.bg,
                border: `1px solid ${PARTICIPANT_THEME.border}`,
                borderRadius: '8px',
                fontSize: '13.5px',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}>
                  <ImageIcon size={18} />
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}>
                  <Paperclip size={18} />
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                style={{
                  backgroundColor: PARTICIPANT_THEME.text,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} />
                <span>Post</span>
              </button>
            </div>
          </div>

          {/* Posts Feed Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayedPosts.map((post) => {
              const extraLikes = reactionsMap[post.id] || 0;
              return (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: PARTICIPANT_THEME.cardBg,
                    border: `1px solid ${post.pinned ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.border}`,
                    borderRadius: PARTICIPANT_THEME.radius,
                    padding: '24px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
                  }}
                >
                  {post.pinned && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                      <Pin size={12} /> Pinned Announcement
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: PARTICIPANT_THEME.primaryAccent,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '15px'
                    }}>
                      {post.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: PARTICIPANT_THEME.text }}>
                        {post.author}
                      </div>
                      <div style={{ fontSize: '11.5px', color: PARTICIPANT_THEME.muted }}>
                        {post.role} • {post.time}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.text, lineHeight: 1.6, margin: '0 0 16px 0' }}>
                    {post.content}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: `1px solid ${PARTICIPANT_THEME.border}`, paddingTop: '12px' }}>
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: PARTICIPANT_THEME.muted,
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <ThumbsUp size={15} color={extraLikes > 0 ? PARTICIPANT_THEME.primaryAccent : PARTICIPANT_THEME.muted} />
                      <span>{post.likes + extraLikes} Likes</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: PARTICIPANT_THEME.muted, fontSize: '12.5px', fontWeight: 600 }}>
                      <MessageSquare size={15} />
                      <span>{post.commentsCount} Comments</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── RIGHT COLUMN — UPCOMING EVENTS & LEADERBOARD ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Leaderboard Card */}
          <div style={{
            backgroundColor: PARTICIPANT_THEME.cardBg,
            border: `1px solid ${PARTICIPANT_THEME.border}`,
            borderRadius: PARTICIPANT_THEME.radius,
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Award size={18} color={PARTICIPANT_THEME.primaryAccent} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Weekly Active Members</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {wsLearners.slice(0, 4).map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: PARTICIPANT_THEME.text }}>{i + 1}. {l.name}</span>
                  <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 700 }}>{100 - i * 15} Pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
