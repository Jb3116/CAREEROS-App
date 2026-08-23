import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('HTTP AI Interview Endpoints Live Verification', () => {
  const BASE_URL = 'http://127.0.0.1:5173';

  test('1. POST /api/ai/interview/start initializes session', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'technical', student_id: 'http_test_stu' }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.mode, 'technical');
    assert.equal(data.interviewer.name, 'Sophia');
    assert.ok(data.session_id.startsWith('int_'));
  });

  test('2. POST /api/ai/interview/question & /next-question fetches mode question', async () => {
    const res1 = await fetch(`${BASE_URL}/api/ai/interview/question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'star', question_index: 1 }),
    });

    assert.equal(res1.status, 200);
    const data1 = await res1.json();
    assert.equal(data1.current_question_index, 1);
    assert.ok(data1.question.question.length > 10);

    const res2 = await fetch(`${BASE_URL}/api/ai/interview/next-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'technical', question_index: 2 }),
    });

    assert.equal(res2.status, 200);
    const data2 = await res2.json();
    assert.equal(data2.current_question_index, 2);
    assert.ok(data2.question.question.length > 10);
  });

  test('3. POST /api/ai/interview/analyze & /respond roundtrip', async () => {
    const analyzeRes = await fetch(`${BASE_URL}/api/ai/interview/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'star',
        question: { question: 'Tell me about a high pressure bug' },
        transcript: 'I diagnosed a slowlog query latency issue and implemented local caching reducing latency by 70%.',
        audio_duration_seconds: 30,
      }),
    });

    assert.equal(analyzeRes.status, 200);
    const analysis = await analyzeRes.json();
    assert.ok(analysis.overall_score > 0);

    const respondRes = await fetch(`${BASE_URL}/api/ai/interview/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'technical',
        question: { question: 'Design a distributed cache system' },
        transcript: 'I designed a multi-tier cache using Redis cluster and local LRU with probabilistic early expiration.',
        audio_duration_seconds: 40,
      }),
    });

    assert.equal(respondRes.status, 200);
    const respondAnalysis = await respondRes.json();
    assert.ok(respondAnalysis.overall_score > 0);

    const followUpRes = await fetch(`${BASE_URL}/api/ai/interview/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'star',
        question: { question: 'Tell me about a high pressure bug' },
        transcript: 'I diagnosed a slowlog query latency issue and implemented local caching reducing latency by 70%.',
      }),
    });

    assert.equal(followUpRes.status, 200);
    const followUp = await followUpRes.json();
    assert.ok(followUp.follow_up_question.length > 10);
  });

  test('4. POST /api/ai/interview/complete & /evaluate generates final report', async () => {
    const completeRes = await fetch(`${BASE_URL}/api/ai/interview/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'http_test_stu',
        mode: 'star',
        responses: [{ overall_score: 90, transcript: 'Full STAR answer with benchmarks' }],
      }),
    });

    assert.equal(completeRes.status, 200);
    const report = await completeRes.json();
    assert.equal(report.student_id, 'http_test_stu');
    assert.equal(report.overall_readiness_score, 90);
    assert.ok(report.benchmark_verdict.includes('Strong Hire'));

    const evalRes = await fetch(`${BASE_URL}/api/ai/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'http_test_stu_2',
        mode: 'technical',
        responses: [{ overall_score: 88, transcript: 'Distributed cache and rate limiter design' }],
      }),
    });

    assert.equal(evalRes.status, 200);
    const evalReport = await evalRes.json();
    assert.equal(evalReport.student_id, 'http_test_stu_2');
    assert.equal(evalReport.overall_readiness_score, 88);
  });
});
