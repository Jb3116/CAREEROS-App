import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Award,
  CheckCircle2,
  Flame,
  MapPin,
  Mail,
  Globe,
  Code2,
  ExternalLink,
  Edit3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Lock,
  Layers,
  X,
  Save,
} from 'lucide-react';
import { useStudentProfile, saveStudentProfile } from '../../utils/userProfile';
import { getUserActivitySummary } from '../../utils/userActivity';
import { getAssessmentRecord } from '../../utils/assessmentValidation';
import { getStudentStreak } from '../../utils/streakCalculator';
import { getStudentAtsScore } from '../../utils/resumeVersioning';

export const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const profile = useStudentProfile();
  const studentId = profile.email || 'student';

  // 100% Data-Driven Metrics
  const summary = getUserActivitySummary(profile);
  const assessmentRecord = getAssessmentRecord(studentId);
  const currentStreak = getStudentStreak(studentId);
  const atsScore = getStudentAtsScore(studentId);
  const isAssessed = summary.hasAssessment && summary.assessmentScore !== null;

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    college: profile.college || '',
    degree: profile.degree || '',
    year: profile.currentYear || profile.year || '1st Year',
    gradYear: profile.gradYear || String(new Date().getFullYear() + 4),
    cgpa: profile.cgpa || '',
    targetRoles: (profile.targetRoles || ['Software Development Engineer']).join(', '),
    primaryLanguages: (profile.primaryLanguages || ['C++', 'Python', 'TypeScript', 'SQL']).join(', '),
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveStudentProfile({
      name: formData.name.trim() || profile.name,
      college: formData.college.trim() || profile.college,
      degree: formData.degree.trim() || profile.degree,
      year: formData.year,
      currentYear: formData.year,
      gradYear: formData.gradYear.trim() || profile.gradYear,
      cgpa: formData.cgpa.trim(),
      targetRoles: formData.targetRoles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
      primaryLanguages: formData.primaryLanguages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <div
      style={{
        padding: '24px 36px',
        maxWidth: 960,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Profile Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          borderRadius: 22,
          padding: 32,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          boxShadow: '0 12px 32px rgba(79, 70, 229, 0.25)',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#FFFFFF',
            color: '#4F46E5',
            fontSize: 28,
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          }}
        >
          {profile.avatarText || 'ST'}
        </div>

        {/* Student Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{profile.name}</h1>
            {isAssessed ? (
              <span
                style={{
                  fontSize: 11.5,
                  background: '#10B981',
                  color: '#FFF',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ShieldCheck size={13} />
                <span>Verified Placement Candidate</span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: 11.5,
                  background: 'rgba(255,255,255,0.18)',
                  color: '#E0E7FF',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <ClockIcon />
                <span>Diagnostic Pending</span>
              </span>
            )}
          </div>

          <div style={{ fontSize: 13.5, color: '#C7D2FE' }}>
            {profile.degree || 'Engineering Degree'} &bull; {profile.currentYear || profile.year || '1st Year'}{' '}
            {profile.gradYear ? `(Class of ${profile.gradYear})` : ''}
          </div>
          <div style={{ fontSize: 13, color: '#C7D2FE' }}>
            {profile.college || 'Engineering Institution'} &bull; CGPA:{' '}
            {profile.cgpa && profile.cgpa !== '0.0' ? `${profile.cgpa} / 10.0` : 'Not specified'}
          </div>
        </div>

        {/* Live Data Stat Badges */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Readiness Score Box */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              padding: '10px 18px',
              borderRadius: 14,
              textAlign: 'center',
              minWidth: 100,
            }}
          >
            <div
              style={{
                fontSize: isAssessed ? 22 : 14,
                fontWeight: 900,
                color: isAssessed ? '#34D399' : '#CBD5E1',
                lineHeight: isAssessed ? 1.2 : 1.6,
              }}
            >
              {isAssessed ? `${summary.assessmentScore}%` : 'Not assessed'}
            </div>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>Readiness Score</div>
          </div>

          {/* Active Streak Box */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              padding: '10px 18px',
              borderRadius: 14,
              textAlign: 'center',
              minWidth: 90,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: currentStreak > 0 ? '#FBBF24' : '#CBD5E1',
                lineHeight: 1.2,
              }}
            >
              {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>Active Streak</div>
          </div>

          {/* Resume ATS Box */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              padding: '10px 18px',
              borderRadius: 14,
              textAlign: 'center',
              minWidth: 90,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: atsScore > 0 ? '#60A5FA' : '#CBD5E1',
                lineHeight: 1.2,
              }}
            >
              {atsScore > 0 ? `${atsScore}%` : '0%'}
            </div>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>Resume ATS</div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setIsEditing(true)}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: 10,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          title="Edit profile information"
        >
          <Edit3 size={13} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Unassessed Prompt Banner */}
      {!isAssessed && (
        <div
          style={{
            background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
            borderRadius: 16,
            border: '1px solid #C7D2FE',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#4F46E5',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>
                Unlock Verified Skill Badges
              </div>
              <div style={{ fontSize: 12.5, color: '#475569' }}>
                Take the 15-minute placement diagnostic assessment to calibrate your skill scores and verify your baseline.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/assessment')}
            style={{
              background: '#4F46E5',
              color: '#FFF',
              border: 'none',
              borderRadius: 10,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <span>Take Assessment</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Verified Skills Profile: Demonstrated vs Self-Reported */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Demonstrated vs Self-Reported Skills
            </h2>
            <p style={{ fontSize: 12.5, color: '#64748B', margin: '2px 0 0 0' }}>
              Validated by live code execution, aptitude speed drills, and behavioral interview recordings.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {/* Coding & DSA */}
          <div
            style={{
              background: '#F8FAFC',
              padding: 18,
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code2 size={16} color="#4F46E5" />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Coding &amp; DSA</span>
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: summary.hasCodingActivity && summary.codingScore !== null ? '#4F46E5' : '#94A3B8',
                }}
              >
                {summary.hasCodingActivity && summary.codingScore !== null
                  ? `${summary.codingScore}%`
                  : 'Not assessed'}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${summary.hasCodingActivity && summary.codingScore !== null ? summary.codingScore : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4F46E5, #6366F1)',
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div
              style={{
                fontSize: 12,
                color: summary.hasCodingActivity ? '#059669' : '#94A3B8',
                fontWeight: summary.hasCodingActivity ? 700 : 500,
              }}
            >
              {summary.hasCodingActivity
                ? `✓ Verified by ${assessmentRecord?.codingAttemptedCount || 1} Coding Submission${
                    (assessmentRecord?.codingAttemptedCount || 1) > 1 ? 's' : ''
                  }`
                : 'No verified coding attempts yet'}
            </div>
          </div>

          {/* Aptitude & Logic */}
          <div
            style={{
              background: '#F8FAFC',
              padding: 18,
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BrainCircuit size={16} color="#059669" />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Aptitude &amp; Logic</span>
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: summary.hasAptitudeActivity && summary.aptitudeScore !== null ? '#059669' : '#94A3B8',
                }}
              >
                {summary.hasAptitudeActivity && summary.aptitudeScore !== null
                  ? `${summary.aptitudeScore}%`
                  : 'Not assessed'}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${summary.hasAptitudeActivity && summary.aptitudeScore !== null ? summary.aptitudeScore : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #059669, #10B981)',
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div
              style={{
                fontSize: 12,
                color: summary.hasAptitudeActivity ? '#059669' : '#94A3B8',
                fontWeight: summary.hasAptitudeActivity ? 700 : 500,
              }}
            >
              {summary.hasAptitudeActivity
                ? '✓ Verified by Diagnostic Aptitude Assessment'
                : 'No verified aptitude attempts yet'}
            </div>
          </div>

          {/* Communication */}
          <div
            style={{
              background: '#F8FAFC',
              padding: 18,
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={16} color="#D97706" />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Communication &amp; Speaking</span>
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: summary.hasCommunicationActivity && summary.communicationScore !== null ? '#D97706' : '#94A3B8',
                }}
              >
                {summary.hasCommunicationActivity && summary.communicationScore !== null
                  ? `${summary.communicationScore}%`
                  : 'Not assessed'}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${summary.hasCommunicationActivity && summary.communicationScore !== null ? summary.communicationScore : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #D97706, #F59E0B)',
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <div
              style={{
                fontSize: 12,
                color: summary.hasCommunicationActivity ? '#059669' : '#94A3B8',
                fontWeight: summary.hasCommunicationActivity ? 700 : 500,
              }}
            >
              {summary.hasCommunicationActivity
                ? '✓ Verified by AI Speaking & Behavioral Drills'
                : 'No speaking drills recorded yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Target Roles & Tech Stack Preferences */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {/* Target Roles */}
        <div>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Target Career Roles</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(profile.targetRoles || ['Software Development Engineer']).map((role, idx) => (
              <span
                key={idx}
                style={{
                  background: '#EEF2FF',
                  color: '#4F46E5',
                  fontSize: 12.5,
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: '1px solid #C7D2FE',
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Primary Stack */}
        <div>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            Primary Technical Languages
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(profile.primaryLanguages || ['C++', 'Python', 'TypeScript', 'SQL']).map((lang, idx) => (
              <span
                key={idx}
                style={{
                  background: '#F1F5F9',
                  color: '#334155',
                  fontSize: 12.5,
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              width: '100%',
              maxWidth: 540,
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: 0 }}>Edit Student Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: 13.5,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    College / University
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Degree &amp; Major
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Year of Study
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                    }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    CGPA (e.g. 8.9)
                  </label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    placeholder="e.g. 8.9"
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Target Roles (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.targetRoles}
                  onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: 13.5,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Primary Languages (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.primaryLanguages}
                  onChange={(e) => setFormData({ ...formData, primaryLanguages: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: 13.5,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: '#FFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#4F46E5',
                    color: '#FFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default ProfileView;
