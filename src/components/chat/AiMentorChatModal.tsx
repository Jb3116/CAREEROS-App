import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Target,
  BrainCircuit,
  Loader2,
  Compass,
  ExternalLink,
  BookOpen,
  Code2,
  Brain,
  FileText,
  Briefcase,
  Mic,
} from 'lucide-react';
import { useStudentProfile } from '../../utils/userProfile';
import {
  generateSmartMentorReply,
  generateFallbackMentorReply,
  type ActionButton,
} from '../../utils/mentorEngine';
import type { StudentProfile } from '../../types/dashboard';

export { generateSmartMentorReply, generateFallbackMentorReply };
export type { ActionButton };

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
  actionButtons?: ActionButton[];
}

interface StudentContext {
  readiness_score: number;
  role_fit_score: number;
  top_gap: string;
  target_role: string;
}

export const AiMentorChatModal: React.FC = () => {
  const navigate = useNavigate();
  const profile = useStudentProfile();
  const studentFirstName = profile.name ? profile.name.trim().split(' ')[0] : 'there';

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [studentContext, setStudentContext] = useState<StudentContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `👋 Hi ${studentFirstName}! I'm your **CAREEROS AI Career Mentor**.\n\nI'm actively tracking your **DKT Knowledge State** and **Sentence-BERT Skill Gaps** for upcoming campus placement drives.\n\nHow can I help you today? Take the interactive website tour, choose a quick prompt below, or ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    '🎯 Start Interactive Website Tour',
    '💻 Where to practice coding?',
    '🧠 Aptitude & Reasoning resources',
    '📚 Best Python & SQL tutorials',
    '📊 Explain my skill gaps',
    '🗺️ View Adaptive Roadmap',
    '🎤 Start STAR Interview Drill',
    '💡 Free vs Paid resources',
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    // Intercept Website Tour command
    if (text.toLowerCase().includes('tour')) {
      window.dispatchEvent(new CustomEvent('careeros-start-tour'));
      setIsOpen(false);
      return;
    }

    // Smart Navigation Assist
    if (text.toLowerCase().includes('technical interview') || text.toLowerCase().includes('star interview') || text.toLowerCase().includes('interview studio')) {
      navigate('/interview-studio');
    } else if (text.toLowerCase().includes('practice') || text.toLowerCase().includes('code practice')) {
      navigate('/practice');
    } else if (text.toLowerCase().includes('assessment') || text.toLowerCase().includes('diagnostic test')) {
      navigate('/assessment');
    } else if (text.toLowerCase().includes('roadmap') || text.toLowerCase().includes('learning path')) {
      navigate('/career-roadmap');
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let replyText = '';
      let replyActionUrl: string | undefined;
      let replyActionLabel: string | undefined;
      let replyActionButtons: ActionButton[] | undefined;

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: profile.email || 's123',
            target_role: profile.targetRoles?.[0] || 'swe',
            message: text,
            conversation_history: messages.map((m) => ({ role: m.role, text: m.text })),
          }),
        });

        const contentType = response.headers.get('content-type') || '';

        // Verify that the response is successful AND has a valid JSON content-type
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          if (data && data.success && data.reply) {
            replyText = data.reply;
            if (data.student_context) {
              setStudentContext(data.student_context);
            }
          }
        }
      } catch (fetchErr) {
        console.warn('Backend AI chat endpoint note:', fetchErr);
      }

      // If backend was unreachable or returned non-JSON/HTML fallback, generate helpful AI response
      if (!replyText) {
        const fallback = generateSmartMentorReply(text, profile);
        replyText = fallback.text;
        replyActionUrl = fallback.actionUrl;
        replyActionLabel = fallback.actionLabel;
        replyActionButtons = fallback.actionButtons;
      }

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: replyText,
        actionUrl: replyActionUrl,
        actionLabel: replyActionLabel,
        actionButtons: replyActionButtons,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const fallback = generateSmartMentorReply(text, profile);
      const errorMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: fallback.text,
        actionUrl: fallback.actionUrl,
        actionLabel: fallback.actionLabel,
        actionButtons: fallback.actionButtons,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation history reset. I'm ready to assist you with your placement preparation, DSA, aptitude, and skill mastery!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const formatMessageContent = (text: string) => {
    // Parser for markdown bold, headers, blockquotes, links, and bullet lists
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ color: '#C7D2FE', fontWeight: 700, margin: '10px 0 4px', fontSize: '0.92rem' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} style={{ color: '#E0E7FF', fontWeight: 700, margin: '8px 0 3px', fontSize: '0.86rem' }}>
            {line.replace('#### ', '')}
          </h5>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <div
            key={idx}
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              borderLeft: '3px solid #818CF8',
              padding: '6px 10px',
              borderRadius: '0 6px 6px 0',
              margin: '6px 0',
              fontSize: '0.82rem',
              color: '#CBD5E1',
            }}
          >
            {renderFormattedText(line.replace('> ', ''))}
          </div>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2);
        return (
          <li key={idx} style={{ marginLeft: 16, marginBottom: 4, lineHeight: 1.45 }}>
            {renderFormattedText(content)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} style={{ marginLeft: 8, marginBottom: 4, lineHeight: 1.45 }}>
            {renderFormattedText(line)}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: 6 }} />;
      }
      return (
        <p key={idx} style={{ margin: '0 0 6px', lineHeight: 1.45 }}>
          {renderFormattedText(line)}
        </p>
      );
    });
  };

  const renderFormattedText = (str: string) => {
    // Regex matching markdown links [text](url), bold **text**, and inline code `code`
    const regex = /(\[.*?\]\(https?:\/\/[^\s)]+\)|\*\*.*?\*\*|`.*?`)/g;
    const parts = str.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      // Markdown Link [text](url)
      const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
      if (linkMatch) {
        const [, linkText, linkUrl] = linkMatch;
        return (
          <a
            key={i}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#93C5FD',
              textDecoration: 'underline',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span>{linkText}</span>
            <span style={{ fontSize: '0.7em', textDecoration: 'none' }}>↗</span>
          </a>
        );
      }

      // Bold text **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={i} style={{ color: '#FFFFFF', fontWeight: 800 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Inline code `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={i}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#A5B4FC',
              padding: '1.5px 5px',
              borderRadius: 4,
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return part;
    });
  };

  return (
    <>
      {/* ---------------- Floating Launcher Button ---------------- */}
      {!isOpen && (
        <button
          data-tour="ai-mentor"
          data-tour-id="mentor"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 18px',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px rgba(79, 70, 229, 0.45)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.92rem',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(79, 70, 229, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.45)';
          }}
          aria-label="Open CAREEROS AI Career Mentor"
        >
          <Sparkles size={18} className="animate-pulse" />
          <span>AI Career Mentor</span>
        </button>
      )}

      {/* ---------------- Chat Modal Window ---------------- */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 440,
            maxWidth: 'calc(100vw - 48px)',
            height: 600,
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 99999,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65)',
            animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    CAREEROS AI Mentor
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34D399',
                      padding: '2px 6px',
                      borderRadius: 10,
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399' }} />
                    Active
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 1 }}>
                  Intent-Aware Career & Skill Advisor
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: '#94A3B8',
                  borderRadius: 8,
                  padding: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close AI Mentor"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  color: '#94A3B8',
                  borderRadius: 8,
                  padding: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              scrollbarWidth: 'thin',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    fontSize: '0.86rem',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
                        : 'rgba(30, 41, 59, 0.75)',
                    color: msg.role === 'user' ? '#FFFFFF' : '#E2E8F0',
                    border:
                      msg.role === 'user'
                        ? '1px solid rgba(255, 255, 255, 0.15)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow:
                      msg.role === 'user'
                        ? '0 4px 12px rgba(79, 70, 229, 0.25)'
                        : '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {formatMessageContent(msg.text)}

                  {/* Interactive Action Buttons */}
                  {((msg.actionButtons && msg.actionButtons.length > 0) || msg.actionUrl) && (
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {msg.actionButtons && msg.actionButtons.length > 0 ? (
                        msg.actionButtons.map((btn, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => {
                              if (btn.isExternal || btn.url.startsWith('http')) {
                                window.open(btn.url, '_blank', 'noopener,noreferrer');
                              } else {
                                setIsOpen(false);
                                navigate(btn.url);
                              }
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              background: bIdx === 0 ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'rgba(255, 255, 255, 0.08)',
                              border: bIdx === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#FFFFFF',
                              borderRadius: 8,
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: bIdx === 0 ? '0 2px 8px rgba(79, 70, 229, 0.35)' : 'none',
                            }}
                          >
                            <span>{btn.label}</span>
                            {btn.isExternal || btn.url.startsWith('http') ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
                          </button>
                        ))
                      ) : (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(msg.actionUrl!);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                            border: 'none',
                            color: '#FFFFFF',
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
                          }}
                        >
                          <span>{msg.actionLabel || 'Explore Module'}</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: '#64748B',
                    marginTop: 3,
                    padding: '0 4px',
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', color: '#818CF8', fontSize: '0.8rem' }}>
                <Loader2 size={16} className="animate-spin" />
                <span>AI Mentor is analyzing your DKT state...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div
            style={{
              padding: '8px 12px',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(15, 23, 42, 0.6)',
              scrollbarWidth: 'none',
            }}
          >
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                style={{
                  flexShrink: 0,
                  padding: '5px 10px',
                  borderRadius: 14,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#CBD5E1',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(79, 70, 229, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.95)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask your AI Career Mentor anything..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 10,
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#F8FAFC',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: inputMessage.trim() && !isLoading ? '#6366F1' : 'rgba(99, 102, 241, 0.3)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'default',
                transition: 'background 0.15s ease',
              }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
