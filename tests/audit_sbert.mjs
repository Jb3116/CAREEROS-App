/**
 * Sentence-BERT Model Audit Script
 * Executes model fingerprinting, fallback removal test, pipeline test, and timing measurements.
 */

import { performance } from 'node:perf_hooks';
import {
  createSemanticVector,
  computeCosineSimilarity,
  SentenceBERTSkillGapService,
  TARGET_ROLE_BLUEPRINTS,
} from '../ai/sentence-bert-service.mjs';

console.log('=== SENTENCE-BERT AUDIT TRACE ===\n');

// 1. Model Fingerprint Test
console.log('--- STEP 3: MODEL FINGERPRINT TEST ---');
const phrases = ['machine learning', 'supervised learning', 'electrical power systems'];
const fingerprints = {};

for (const phrase of phrases) {
  const v1 = createSemanticVector(phrase);
  const v2 = createSemanticVector(phrase); // Run twice to check determinism

  // Vector norm
  let sumSq = 0;
  for (let i = 0; i < v1.length; i++) sumSq += v1[i] * v1[i];
  const norm = Math.sqrt(sumSq);

  // Check determinism
  let isIdentical = true;
  for (let i = 0; i < v1.length; i++) {
    if (v1[i] !== v2[i]) isIdentical = false;
  }

  fingerprints[phrase] = {
    length: v1.length,
    norm: Number(norm.toFixed(6)),
    deterministic: isIdentical,
    first_10_values: Array.from(v1.slice(0, 10)).map(x => Number(x.toFixed(5))),
  };

  console.log(`\nText: "${phrase}"`);
  console.log(`- Vector Length: ${v1.length}`);
  console.log(`- L2 Norm: ${norm.toFixed(6)}`);
  console.log(`- Deterministic across runs: ${isIdentical}`);
  console.log(`- First 10 values: [${fingerprints[phrase].first_10_values.join(', ')}]`);
}

// Compute pairwise cosine similarities from fingerprint vectors
const vML = createSemanticVector('machine learning');
const vSL = createSemanticVector('supervised learning');
const vEPS = createSemanticVector('electrical power systems');

const simML_SL = computeCosineSimilarity(vML, vSL);
const simML_EPS = computeCosineSimilarity(vML, vEPS);

console.log(`\nPairwise Cosine Similarities:`);
console.log(`- Sim('machine learning', 'supervised learning'): ${simML_SL.toFixed(4)}`);
console.log(`- Sim('machine learning', 'electrical power systems'): ${simML_EPS.toFixed(4)}`);

// 2. DKT -> SBERT Pipeline Test with Specified Student
console.log('\n--- STEP 6: DKT -> SBERT PIPELINE AUDIT ---');
// Specified Student Profile: Python=0.85, SQL=0.72, Machine Learning=0.35, React=0.20
const auditStudentProfile = {
  status: 'ready',
  student_id: 'AUDIT_STU_DS',
  readiness_score: 64,
  skills: [
    { id: 'python', name: 'Python Programming', percentage: 85, probability: 0.85, category: 'coding', attempts: 6 },
    { id: 'sql', name: 'SQL & Relational Databases', percentage: 72, probability: 0.72, category: 'coding', attempts: 5 },
    { id: 'machine_learning', name: 'Machine Learning Foundations', percentage: 35, probability: 0.35, category: 'coding', attempts: 2 },
    { id: 'data_structures', name: 'Data Structures', percentage: 55, probability: 0.55, category: 'coding', attempts: 3 },
    { id: 'algorithms', name: 'Algorithms', percentage: 58, probability: 0.58, category: 'coding', attempts: 2 },
    { id: 'aptitude', name: 'Quantitative & Logical Aptitude', percentage: 65, probability: 0.65, category: 'aptitude', attempts: 3 },
    { id: 'communication', name: 'STAR Behavioral & Communication', percentage: 60, probability: 0.60, category: 'communication', attempts: 2 },
  ],
};

const dsAnalysis = SentenceBERTSkillGapService.analyzeSkillGaps(auditStudentProfile, 'ml_engineer');
console.log(`Target Role: ${dsAnalysis.target_role.title}`);
console.log(`Overall Role Fit: ${dsAnalysis.role_fit_score}%`);
console.log(`Matched Skills (${dsAnalysis.matched_skills.length}):`, dsAnalysis.matched_skills.map(s => `${s.skill_name} (${s.current_mastery}% vs min ${s.target_mastery}%)`));
console.log(`Partial Matches (${dsAnalysis.partial_matches.length}):`, dsAnalysis.partial_matches.map(s => `${s.skill_name} (${s.current_mastery}% vs min ${s.target_mastery}%)`));
console.log(`Skill Gaps (${dsAnalysis.skill_gaps.length}):`, dsAnalysis.skill_gaps.map(s => `${s.skill_name} (${s.current_mastery}% vs min ${s.target_mastery}%, Priority: ${s.priority_level})`));

// 3. Performance & Memory Measurement
console.log('\n--- STEP 7: PERFORMANCE MEASUREMENTS ---');
const memBefore = process.memoryUsage();
const t0 = performance.now();
for (let i = 0; i < 1000; i++) {
  createSemanticVector('Deep Learning with PyTorch and Transformers');
}
const t1 = performance.now();
const memAfter = process.memoryUsage();

const avgInferenceTime = (t1 - t0) / 1000;
const heapUsedMB = (memAfter.heapUsed - memBefore.heapUsed) / (1024 * 1024);

console.log(`- Average Embedding Time: ${avgInferenceTime.toFixed(4)} ms`);
console.log(`- Heap Delta: ${heapUsedMB.toFixed(3)} MB`);
console.log(`- Total Process RSS Memory: ${(memAfter.rss / (1024 * 1024)).toFixed(1)} MB`);
