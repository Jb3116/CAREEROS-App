import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  SentenceBERTSkillGapService,
  matchSkillSemantics,
  computeCosineSimilarity,
  EMBEDDING_MODEL_INFO,
} from '../ai/sentence-bert-service.mjs';
import { DKTInference } from '../ai/dkt-engine.mjs';

describe('Sentence-BERT Semantic Skill Gap Detection Tests', () => {
  test('1. Embedding Model Metadata Verification', () => {
    assert.equal(EMBEDDING_MODEL_INFO.model_name, 'sentence-bert-base-nli-stsb');
    assert.equal(EMBEDDING_MODEL_INFO.embedding_dim, 384);
  });

  test('2. Semantic Equivalence Matching for Acronyms & Synonyms', () => {
    const testCases = [
      { input: 'ML', expectedSkill: 'machine_learning' },
      { input: 'Supervised Learning', expectedSkill: 'machine_learning' },
      { input: 'DSA', expectedSkill: 'data_structures' },
      { input: 'Binary Search Trees', expectedSkill: 'data_structures' },
      { input: 'Dynamic Programming', expectedSkill: 'algorithms' },
      { input: 'PostgreSQL Queries', expectedSkill: 'sql' },
      { input: 'OOP Design Patterns', expectedSkill: 'oop' },
      { input: 'Concurrency & Mutex', expectedSkill: 'operating_systems' },
      { input: 'TCP/IP Sockets', expectedSkill: 'computer_networks' },
      { input: 'STAR Method Behavioral', expectedSkill: 'communication' },
      { input: 'Quantitative Reasoning', expectedSkill: 'aptitude' },
    ];

    for (const tc of testCases) {
      const match = matchSkillSemantics(tc.input);
      assert.equal(
        match.matched_skill_key,
        tc.expectedSkill,
        `Term "${tc.input}" should semantically align to "${tc.expectedSkill}" (Got: ${match.matched_skill_key}, Similarity: ${match.similarity})`
      );
      assert.ok(match.similarity >= 0.75, `Similarity should be high for synonyms (Got: ${match.similarity})`);
    }
  });

  test('3. Categorization into Matched Skills, Partial Matches, and Skill Gaps', () => {
    const mockDKTProfile = {
      status: 'ready',
      student_id: 'test_student_gaps',
      readiness_score: 68,
      skills: [
        { id: 'python', name: 'Python', percentage: 88, probability: 0.88, category: 'coding', attempts: 10 },
        { id: 'data_structures', name: 'Data Structures', percentage: 82, probability: 0.82, category: 'coding', attempts: 8 },
        { id: 'algorithms', name: 'Algorithms', percentage: 76, probability: 0.76, category: 'coding', attempts: 6 },
        { id: 'operating_systems', name: 'Operating Systems', percentage: 58, probability: 0.58, category: 'coding', attempts: 2 },
        { id: 'machine_learning', name: 'Machine Learning', percentage: 32, probability: 0.32, category: 'coding', attempts: 1 },
        { id: 'sql', name: 'SQL', percentage: 70, probability: 0.70, category: 'coding', attempts: 4 },
        { id: 'oop', name: 'OOP', percentage: 72, probability: 0.72, category: 'coding', attempts: 5 },
        { id: 'dbms', name: 'DBMS', percentage: 65, probability: 0.65, category: 'coding', attempts: 3 },
        { id: 'computer_networks', name: 'Networks', percentage: 60, probability: 0.60, category: 'coding', attempts: 2 },
        { id: 'aptitude', name: 'Aptitude', percentage: 75, probability: 0.75, category: 'aptitude', attempts: 5 },
        { id: 'communication', name: 'Communication', percentage: 70, probability: 0.70, category: 'communication', attempts: 3 },
      ],
    };

    const analysis = SentenceBERTSkillGapService.analyzeSkillGaps(mockDKTProfile, 'swe');

    assert.equal(analysis.status, 'success');
    assert.ok(analysis.role_fit_score > 0 && analysis.role_fit_score <= 100);
    assert.ok(analysis.matched_skills.length > 0);

    // Python & DSA should be in matched skills
    assert.ok(analysis.matched_skills.some((s) => s.skill_id === 'python'));
    assert.ok(analysis.matched_skills.some((s) => s.skill_id === 'data_structures'));

    // OS (58% vs min 65%) should be in partial matches or skill gaps
    const osInGaps = analysis.partial_matches.concat(analysis.skill_gaps).some((s) => s.skill_id === 'operating_systems');
    assert.ok(osInGaps, 'Operating Systems should be flagged as partial match or gap');
  });

  test('4. Priority Ranking of Skill Gaps for Targeted Learning', () => {
    const studentHistory = [
      { skill: 'python', correct: true, difficulty: 'medium' },
      { skill: 'data_structures', correct: true, difficulty: 'hard' },
    ];
    const liveProfile = DKTInference.predict(studentHistory, 'student_rank_test');
    const gaps = SentenceBERTSkillGapService.analyzeSkillGaps(liveProfile, 'swe');

    assert.equal(gaps.status, 'success');
    assert.ok(gaps.summary.total_competencies_evaluated === 10);
    assert.ok(gaps.skill_gaps.length > 0);

    // Gaps must be sorted in descending order of priority score
    for (let i = 0; i < gaps.skill_gaps.length - 1; i++) {
      assert.ok(
        gaps.skill_gaps[i].priority_score >= gaps.skill_gaps[i + 1].priority_score,
        'Skill gaps must be sorted by priority score descending'
      );
    }
  });

  test('5. Graceful Handling of Untrained Model Status', () => {
    const untrainedProfile = {
      status: 'not_trained',
      message: 'DKT student model has not been trained yet.',
      student_id: 's_untrained_gap',
    };

    const res = SentenceBERTSkillGapService.analyzeSkillGaps(untrainedProfile, 'swe');
    assert.equal(res.status, 'not_trained');
    assert.equal(res.message, 'AI skill analysis is being prepared. DKT student model has not been trained yet.');
  });
});
