import React from 'react';
import { User, GraduationCap, Award, CheckCircle2, Flame, MapPin, Mail, Globe, Code2, ExternalLink } from 'lucide-react';

export const ProfileView: React.FC = () => {
  return (
    <div style={{ padding: '24px 36px', maxWidth: 900, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Profile Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          borderRadius: 20,
          padding: 32,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          boxShadow: '0 12px 32px rgba(79, 70, 229, 0.25)',
          flexWrap: 'wrap',
        }}
      >
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
          AC
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900 }}>Alex Chen</h1>
            <span style={{ fontSize: 11.5, background: '#10B981', color: '#FFF', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
              Verified Student
            </span>
          </div>

          <div style={{ fontSize: 13.5, color: '#C7D2FE' }}>
            B.Tech Computer Science & Engineering • 3rd Year (Class of 2027)
          </div>
          <div style={{ fontSize: 13, color: '#C7D2FE' }}>
            Vellore Institute of Technology, Vellore • CGPA: 8.9 / 10.0
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 18px', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#34D399' }}>78%</div>
            <div style={{ fontSize: 11, color: '#CBD5E1' }}>Readiness Score</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', padding: '10px 18px', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#FBBF24' }}>5 Days</div>
            <div style={{ fontSize: 11, color: '#CBD5E1' }}>Active Streak</div>
          </div>
        </div>
      </div>

      {/* Verified Skills Profile */}
      <div style={{ background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
          Demonstrated vs Self-Reported Skills
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>Coding & DSA</span>
              <span style={{ color: '#4F46E5', fontWeight: 800 }}>72%</span>
            </div>
            <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ Verified by 3 Assessment Attempts</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>Aptitude & Logic</span>
              <span style={{ color: '#059669', fontWeight: 800 }}>81%</span>
            </div>
            <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ Verified by Speed Problem Sets</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>Communication</span>
              <span style={{ color: '#D97706', fontWeight: 800 }}>64%</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Mock Interview Score Baseline</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
