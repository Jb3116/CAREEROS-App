/**
 * HTTP End-to-End Assessment API Verification
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('HTTP Live Assessment End-to-End Verification', () => {
  const BASE_URL = 'http://127.0.0.1:5173';

  test('1. Verify Static Frontend Assessment Route is Serving (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/assessment`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('<!doctype html>') || html.includes('CAREEROS'));
    console.log('[PASS] GET /assessment served successfully with 200 OK.');
  });

  test('2. Verify Real Live Sandbox Code Execution API', async () => {
    // Incomplete code submission
    const incompleteRes = await fetch(`${BASE_URL}/api/ai/code-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'http_stu_1',
        language: 'python',
        problem: '1. Two Sum',
        code: 'def twoSum(nums, target):\n    pass',
        test_cases: [{ call: 'twoSum([2,7,11,15], 9)', expected: [0, 1] }],
      }),
    });

    assert.equal(incompleteRes.status, 200);
    const incData = await incompleteRes.json();
    assert.equal(incData.analysis.is_correct, false);
    assert.equal(incData.analysis.test_cases_passed, 0);
    assert.equal(incData.analysis.execution_status, 'incomplete');
    console.log(`[PASS] Incomplete code rejected: ${incData.analysis.execution_status}`);

    // Correct JS code submission
    const correctRes = await fetch(`${BASE_URL}/api/ai/code-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'http_stu_1',
        language: 'javascript',
        problem: '1. Two Sum',
        code: 'function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const diff = target - nums[i]; if (map.has(diff)) return [map.get(diff), i]; map.set(nums[i], i); } return []; }',
        test_cases: [
          { call: 'twoSum([2,7,11,15], 9)', expected: [0, 1] },
          { call: 'twoSum([3,2,4], 6)', expected: [1, 2] },
        ],
      }),
    });

    assert.equal(correctRes.status, 200);
    const corData = await correctRes.json();
    assert.equal(corData.analysis.is_correct, true);
    assert.equal(corData.analysis.test_cases_passed, 2);
    console.log(`[PASS] Valid code executed and passed all ${corData.analysis.test_cases_passed} testcases in live sandbox.`);
  });

  test('3. Verify Assessment Telemetry Ingestion into DKT Engine', async () => {
    const eventRes = await fetch(`${BASE_URL}/api/ai/student-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'stu_phase7',
        skill: 'probability',
        activity: 'assessment_aptitude',
        correct: true,
        difficulty: 'easy',
        timestamp: new Date().toISOString(),
      }),
    });

    assert.equal(eventRes.status, 200);
    const eventData = await eventRes.json();
    assert.equal(eventData.success, true);
    console.log(`[PASS] Assessment event recorded for DKT knowledge tracing: ${eventData.message || 'success'}`);
  });
});
