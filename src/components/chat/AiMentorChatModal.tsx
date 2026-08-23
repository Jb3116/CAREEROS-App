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
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface StudentContext {
  readiness_score: number;
  role_fit_score: number;
  top_gap: string;
  target_role: string;
}

export const AiMentorChatModal: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [studentContext, setStudentContext] = useState<StudentContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `👋 Hi Alex! I'm your **CAREEROS AI Career Mentor**.\n\nI'm actively tracking your **DKT Knowledge State** and **Sentence-BERT Skill Gaps** for upcoming campus placement drives.\n\nHow can I help you today? Take the interactive website tour, choose a quick prompt below, or ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    '🎯 Start Interactive Website Tour',
    '🎤 Start STAR Interview Drill',
    '💻 Start Technical Interview',
    '📊 Explain my skill gaps',
    '🗺️ View Adaptive Roadmap',
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
      navigate('/interview');
    } else if (text.toLowerCase().includes('practice') || text.toLowerCase().includes('code practice')) {
      navigate('/practice');
    } else if (text.toLowerCase().includes('assessment') || text.toLowerCase().includes('diagnostic test')) {
      navigate('/assessment');
    } else if (text.toLowerCase().includes('roadmap') || text.toLowerCase().includes('learning path')) {
      navigate('/roadmap');
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
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: 's123',
          target_role: 'swe',
          message: text,
          conversation_history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();

      if (data.success && data.reply) {
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, modelMsg]);

        if (data.student_context) {
          setStudentContext(data.student_context);
        }
      } else {
        throw new Error(data.error || 'Failed to generate mentor response');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Notice**: I encountered an issue connecting to the AI service. Please try asking again. (${err.message || 'Network error'})`,
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
        text: `Conversation history reset. I'm ready to assist you with your placement preparation and skill mastery!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const formatMessageContent = (text: string) => {
    // Simple parser for markdown bold, headers, and bullet lists
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ color: '#C7D2FE', fontWeight: 600, margin: '8px 0 4px', fontSize: '0.92rem' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2);
        return (
          <li key={idx} style={{ marginLeft: 16, marginBottom: 4, lineHeight: 1.45 }}>
            {renderBoldText(content)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} style={{ marginLeft: 8, marginBottom: 4, lineHeight: 1.45 }}>
            {renderBoldText(line)}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: 6 }} />;
      }
      return (
        <p key={idx} style={{ margin: '0 0 6px', lineHeight: 1.45 }}>
          {renderBoldText(line)}
        </p>
      );
    });
  };

  const renderBoldText = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#F1F5F9' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818CF8',
              padding: '2px 5px',
              borderRadius: 4,
              fontSize: '0.82rem',
              fontFamily: 'monospace',
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
            borderRadius: 30,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 0 15px rgba(124, 58, 237, 0.3)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          aria-label="Open CAREEROS AI Mentor"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={20} color="#FDE047" />
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10B981',
                border: '1.5px solid #4F46E5',
              }}
            />
          </div>
          <span>AI Mentor</span>
        </button>
      )}

      {/* ---------------- Floating Chat Modal Window ---------------- */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 400,
            maxWidth: 'calc(100vw - 32px)',
            height: 600,
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 20,
            background: 'linear-gradient(180deg, #111827 0%, #0F172A 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(99, 102, 241, 0.2)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                }}
              >
                <Bot size={18} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#F8FAFC' }}>
                    CAREEROS AI Mentor
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 10,
                      padding: '1px 6px',
                      fontWeight: 600,
                    }}
                  >
                    DKT Active
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {studentContext ? `Target: ${studentContext.target_role} (${studentContext.role_fit_score}% Fit)` : 'Target: SDE 1 • Google & Goldman Sachs'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('careeros-start-tour'));
                  setIsOpen(false);
                }}
                style={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#C7D2FE',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
                title="Replay AI Website Tour"
              >
                <Sparkles size={13} color="#818CF8" />
                <span>Replay Tour</span>
              </button>
              <button
                onClick={handleResetChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  padding: 6,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  padding: 6,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
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
                    maxWidth: '85%',
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
                  borderRadius: 20,
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#A5B4FC',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
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
