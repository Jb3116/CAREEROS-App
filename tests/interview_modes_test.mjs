import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  INTERVIEW_MODE_POOLS,
  startInterviewSession,
  getInterviewQuestion,
  analyzeCandidateResponse,
  generateInterviewFollowUp,
  generateFinalInterviewReport,
} from '../ai/interview-service.mjs';

describe('AI Interview Studio & Sophia Recruiter Suite', () => {
  test('1. Three Working Interview Modes Pool Segregation & Rubrics', () => {
    assert.ok(INTERVIEW_MODE_POOLS.star, 'STAR Behavioral pool must exist');
    assert.ok(INTERVIEW_MODE_POOLS.technical, 'Technical Architecture pool must exist');
    assert.ok(INTERVIEW_MODE_POOLS.hr, 'HR / Cultural pool must exist');

    assert.equal(INTERVIEW_MODE_POOLS.star.questions.length, 4);
    assert.equal(INTERVIEW_MODE_POOLS.technical.questions.length, 4);
    assert.equal(INTERVIEW_MODE_POOLS.hr.questions.length, 3);

    // Verify distinct principle and question texts across modes
    const starQuestions = INTERVIEW_MODE_POOLS.star.questions.map((q) => q.question);
    const techQuestions = INTERVIEW_MODE_POOLS.technical.questions.map((q) => q.question);
    const hrQuestions = INTERVIEW_MODE_POOLS.hr.questions.map((q) => q.question);

    assert.notDeepEqual(starQuestions, techQuestions, 'STAR and Technical questions must be completely different');
    assert.notDeepEqual(techQuestions, hrQuestions, 'Technical and HR questions must be completely different');

    // Verify rubric checklist keys are distinct
    assert.ok(INTERVIEW_MODE_POOLS.star.questions[0].rubric.situation);
    assert.ok(INTERVIEW_MODE_POOLS.technical.questions[0].rubric.architecture);
    assert.ok(INTERVIEW_MODE_POOLS.hr.questions[0].rubric.research);
  });

  test('2. Start Interview Session API Payload Structure', async () => {
    const starSession = await startInterviewSession({ mode: 'star', studentId: 's_test_1' });
    assert.equal(starSession.mode, 'star');
    assert.equal(starSession.student_id, 's_test_1');
    assert.equal(starSession.interviewer.name, 'Sophia');
    assert.ok(starSession.current_question.question.length > 10);

    const techSession = await startInterviewSession({ mode: 'technical', studentId: 's_test_2' });
    assert.equal(techSession.mode, 'technical');
    assert.equal(techSession.target_role, 'Distributed Systems & Cloud Infrastructure SDE');
  });

  test('3. Dynamic Question Index Fetching & Boundary Limits', () => {
    const q0 = getInterviewQuestion('star', 0);
    assert.equal(q0.current_question_index, 0);
    assert.equal(q0.is_final_question, false);

    const qFinal = getInterviewQuestion('star', 3);
    assert.equal(qFinal.current_question_index, 3);
    assert.equal(qFinal.is_final_question, true);

    // Clamping on overflow
    const qOverflow = getInterviewQuestion('star', 99);
    assert.equal(qOverflow.current_question_index, 3);
  });

  test('4. Real Candidate Spoken Transcript Analysis & WPM Calculation', async () => {
    const sampleTranscript =
      'In our high-traffic flash sale service, Redis cache experienced a 100% CPU spike due to un-indexed N+1 queries. I analyzed the slowlog and engineered an in-memory LRU cache with probabilistic early expiration (XFetch), which reduced cache query latency by 74% and normalized p99 latency to 28ms.';

    const analysis = await analyzeCandidateResponse({
      mode: 'star',
      question: INTERVIEW_MODE_POOLS.star.questions[0],
      transcript: sampleTranscript,
      audioDurationSeconds: 45,
    });

    assert.ok(analysis.overall_score >= 70, `Score should be high for complete STAR answer (Got: ${analysis.overall_score})`);
    assert.ok(analysis.speaking_pace_wpm > 30, 'Speaking pace should be computed');
    assert.ok(analysis.feedback.length > 10, 'Actionable feedback must be provided');
  });

  test('5. Empty or Inaudible Transcript Handling', async () => {
    const emptyAnalysis = await analyzeCandidateResponse({
      mode: 'star',
      question: INTERVIEW_MODE_POOLS.star.questions[0],
      transcript: '   ',
      audioDurationSeconds: 10,
    });

    assert.equal(emptyAnalysis.status, 'empty_response');
    assert.equal(emptyAnalysis.overall_score, 0);
    assert.ok(emptyAnalysis.feedback.includes('No audible speech detected'));
  });

  test('6. Contextual AI Follow-up Generation', async () => {
    const sampleTranscript =
      'I designed a distributed rate limiter using Redis Token Bucket algorithm and Lua scripts for atomic increments across 8 gateway nodes.';

    const followUp = await generateInterviewFollowUp({
      mode: 'technical',
      question: INTERVIEW_MODE_POOLS.technical.questions[2],
      transcript: sampleTranscript,
    });

    assert.ok(followUp.follow_up_question.length > 15, 'Follow-up question must be generated');
    assert.ok(followUp.intent.length > 5, 'Intent must explain why follow-up was selected');
  });

  test('7. Comprehensive Final Evaluation Report & Real Metrics (No Fake Eye Contact)', async () => {
    const mockResponses = [
      { question_id: 'star-1', overall_score: 88, transcript: 'Redis slowlog fix with XFetch caching' },
      { question_id: 'star-2', overall_score: 84, transcript: 'Benchmark data presented for technical consensus' },
    ];

    const report = await generateFinalInterviewReport({
      studentId: 'stu_eval_1',
      mode: 'star',
      responses: mockResponses,
    });

    assert.equal(report.student_id, 'stu_eval_1');
    assert.equal(report.overall_readiness_score, 86);
    assert.ok(report.benchmark_verdict.includes('Strong Hire'));
    assert.equal(report.metrics.star_fluency_score, 86);
    assert.ok(report.metrics.communication_score >= 80);
    assert.ok(report.metrics.technical_depth_score >= 80);
    assert.ok(report.metrics.problem_solving_score >= 80);
    assert.equal(report.metrics.eye_contact_score_percent, undefined, 'Eye contact percentage must not be fabricated');
    assert.ok(report.strengths_summary.length > 0);
    assert.ok(report.growth_recommendations.length > 0);
  });
});
