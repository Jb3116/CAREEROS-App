import React from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Award,
  Layers,
  Plus,
} from 'lucide-react';
import { ATSScoreReport } from '../../utils/atsScorer';
import { ResumeExportData } from '../../utils/documentExporter';

interface ATSAnalyzerProps {
  jobDescription: string;
  onJobDescriptionChange: (jd: string) => void;
  atsReport: ATSScoreReport;
  onAddMissingSkill: (skillName: string) => void;
  onGenerateTailoredResume: () => void;
}

export const ATSAnalyzer: React.FC<ATSAnalyzerProps> = ({
  jobDescription,
  onJobDescriptionChange,
  atsReport,
  onAddMissingSkill,
  onGenerateTailoredResume,
}) => {
  const { breakdown } = atsReport;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ---------------- 1. Job Description Input & Tailoring Trigger ---------------- */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Target size={18} color="#4F46E5" />
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Target Job Description Analysis
          </h3>
        </div>
        <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 10px 0' }}>
          Paste the job posting requirements below to test ATS keyword density, skill coverage, and role relevance.
        </p>

        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste full job description requirements here (e.g., 'Looking for a Senior Backend Engineer proficient in Go, Docker, Kubernetes, PostgreSQL...')..."
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #CBD5E1',
            fontSize: 12.5,
            lineHeight: 1.45,
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button
            onClick={onGenerateTailoredResume}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'linear-gradient(135deg, #4F46E5, #4338CA)',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Sparkles size={14} />
            <span>Generate Tailored Resume for this Job</span>
          </button>
        </div>
      </div>

      {/* ---------------- 2. Deterministic 8-Dimension ATS Gauge ---------------- */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Deterministic ATS Score Breakdown
            </h3>
            <span style={{ fontSize: 11.5, color: '#64748B' }}>
              Industry Tier-1 Standard ATS Algorithm (8 Weighted Dimensions)
            </span>
          </div>

          <div
            style={{
              background: atsReport.atsScore >= 80 ? '#ECFDF5' : atsReport.atsScore >= 60 ? '#FEF3C7' : '#FEF2F2',
              color: atsReport.atsScore >= 80 ? '#059669' : atsReport.atsScore >= 60 ? '#D97706' : '#DC2626',
              border: `1.5px solid ${atsReport.atsScore >= 80 ? '#A7F3D0' : atsReport.atsScore >= 60 ? '#FDE68A' : '#FECACA'}`,
              padding: '6px 14px',
              borderRadius: 10,
              fontSize: 20,
              fontWeight: 900,
              textAlign: 'center',
            }}
          >
            {atsReport.atsScore}%
          </div>
        </div>

        {/* 8 Weighted Dimensions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {[
            { label: 'Keywords (30%)', score: breakdown.keywords.score, max: breakdown.keywords.max },
            { label: 'Skills Match (20%)', score: breakdown.skills.score, max: breakdown.skills.max },
            { label: 'Relevance (15%)', score: breakdown.relevance.score, max: breakdown.relevance.max },
            { label: 'Structure (10%)', score: breakdown.structure.score, max: breakdown.structure.max },
            { label: 'Completeness (10%)', score: breakdown.completeness.score, max: breakdown.completeness.max },
            { label: 'Formatting (5%)', score: breakdown.formatting.score, max: breakdown.formatting.max },
            { label: 'Action Verbs (5%)', score: breakdown.actionVerbs.score, max: breakdown.actionVerbs.max },
            { label: 'Quantification (5%)', score: breakdown.quantification.score, max: breakdown.quantification.max },
          ].map((dim, idx) => (
            <div
              key={idx}
              style={{
                background: '#F8FAFC',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                {dim.score} / {dim.max}
              </div>
              <div style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700, marginTop: 2 }}>
                {dim.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- 3. Matched & Missing Keywords ---------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Matched Keywords (Green) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <CheckCircle2 size={16} color="#059669" />
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#047857', margin: 0 }}>
              Matched Keywords ({atsReport.matchedKeywords.length})
            </h4>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
            {atsReport.matchedKeywords.length === 0 ? (
              <span style={{ fontSize: 11.5, color: '#94A3B8' }}>No keywords matched yet</span>
            ) : (
              atsReport.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  style={{
                    background: '#ECFDF5',
                    color: '#047857',
                    border: '1px solid #A7F3D0',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                  }}
                >
                  ✓ {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords (Yellow / Red) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <AlertTriangle size={16} color="#D97706" />
            <h4 style={{ fontSize: 13, fontWeight: 800, color: '#B45309', margin: 0 }}>
              Missing Keywords ({atsReport.missingKeywords.length})
            </h4>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
            {atsReport.missingKeywords.length === 0 ? (
              <span style={{ fontSize: 11.5, color: '#059669', fontWeight: 700 }}>
                ✓ Great match! No missing core keywords.
              </span>
            ) : (
              atsReport.missingKeywords.map((kw, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    padding: '2px 6px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 11.5, color: '#92400E', fontWeight: 700 }}>{kw}</span>
                  <button
                    onClick={() => onAddMissingSkill(kw)}
                    style={{
                      background: '#D97706',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '1px 5px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                    title="Add keyword to Skills"
                  >
                    + Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzer;
