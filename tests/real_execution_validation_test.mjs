/**
 * Real Code Execution Validation Automated Test Suite
 * Strictly proves:
 * 1. Empty code cannot pass (Returns "No code submitted.")
 * 2. Unmodified starter templates / 'pass' / 'return 0' cannot pass (Returns "Solution is incomplete.")
 * 3. Wrong answers fail testcases with expected vs actual diff
 * 4. Syntax errors are caught and reported cleanly
 * 5. Runtime exceptions are caught without crashing
 * 6. Correct solutions execute and pass all testcases
 * 7. Real sandbox execution status vs AI reasoning separation
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCodeCompleteness,
  executeJavaScript,
  executePython,
  executeCode,
} from '../ai/code-execution-engine.mjs';
import { analyzeCodeSubmission } from '../ai/code-analysis-service.mjs';

describe('Real Code Execution Validation Suite', () => {
  const sampleTestCases = [
    { call: 'twoSum([2,7,11,15], 9)', expected: [0, 1] },
    { call: 'twoSum([3,2,4], 6)', expected: [1, 2] },
    { call: 'twoSum([3,3], 6)', expected: [0, 1] },
  ];

  test('1. Empty Code Rejection', async () => {
    const emptyResult = await analyzeCodeSubmission({
      studentId: 'test_stu',
      language: 'javascript',
      problem: 'Two Sum',
      code: '   \n\t  ',
      testCases: sampleTestCases,
    });

    assert.equal(emptyResult.is_correct, false);
    assert.equal(emptyResult.test_cases_passed, 0);
    assert.equal(emptyResult.execution_status, 'no_code');
    assert.ok(emptyResult.error.includes('No code submitted.'));

    console.log('\n--- Test 1: Empty Code Rejection ---');
    console.log(`Status: ${emptyResult.execution_status}`);
    console.log(`Error: ${emptyResult.error}`);
    console.log(`Passed count: ${emptyResult.test_cases_passed}`);
  });

  test('2. Unmodified Starter Template / Pass Rejection', async () => {
    const starterPython = `def solve():\n    pass`;
    const resPython = await analyzeCodeSubmission({
      studentId: 'test_stu',
      language: 'python',
      problem: 'Two Sum',
      code: starterPython,
      testCases: sampleTestCases,
    });

    assert.equal(resPython.is_correct, false);
    assert.equal(resPython.test_cases_passed, 0);
    assert.equal(resPython.execution_status, 'incomplete');
    assert.ok(resPython.error.includes('incomplete'));

    const starterJS = `function solve() {\n}`;
    const resJS = await analyzeCodeSubmission({
      studentId: 'test_stu',
      language: 'javascript',
      problem: 'Two Sum',
      code: starterJS,
      testCases: sampleTestCases,
    });

    assert.equal(resJS.is_correct, false);
    assert.equal(resJS.test_cases_passed, 0);
    assert.equal(resJS.execution_status, 'incomplete');

    console.log('\n--- Test 2: Starter Template Rejection ---');
    console.log(`Python Template Status: ${resPython.execution_status} (${resPython.error})`);
    console.log(`JS Template Status: ${resJS.execution_status} (${resJS.error})`);
  });

  test('3. Wrong Answer Execution Failure', () => {
    const wrongJSCode = `
function twoSum(nums, target) {
  return [0, 0]; // Always returns wrong indices
}
`;

    const res = executeJavaScript(wrongJSCode, sampleTestCases);

    assert.equal(res.status, 'failed');
    assert.equal(res.is_correct, false);
    assert.equal(res.test_cases_passed, 0);
    assert.equal(res.results.length, 3);
    assert.equal(res.results[0].passed, false);
    assert.ok(res.results[0].error.includes('Expected'));

    console.log('\n--- Test 3: Wrong Answer Failure ---');
    console.log(`Status: ${res.status}`);
    console.log(`Passed: ${res.test_cases_passed}/${res.total_test_cases}`);
    console.log(`Result 1 Error: ${res.results[0].error}`);
  });

  test('4. Syntax Error Detection', () => {
    const syntaxErrorCode = `
function twoSum(nums, target) {
  let map = new Map(
  return [] // missing closing parenthesis
}
`;

    const res = executeJavaScript(syntaxErrorCode, sampleTestCases);

    assert.equal(res.status, 'syntax_error');
    assert.equal(res.is_correct, false);
    assert.equal(res.test_cases_passed, 0);
    assert.ok(res.error.includes('Syntax Error'));

    console.log('\n--- Test 4: Syntax Error Detection ---');
    console.log(`Status: ${res.status}`);
    console.log(`Error: ${res.error}`);
  });

  test('5. Runtime Exception Handling (TypeError / Null Reference)', () => {
    const runtimeErrorCode = `
function twoSum(nums, target) {
  let a = null;
  return a.property; // Throws TypeError
}
`;

    const res = executeJavaScript(runtimeErrorCode, sampleTestCases);

    assert.equal(res.status, 'failed');
    assert.equal(res.is_correct, false);
    assert.equal(res.test_cases_passed, 0);
    assert.ok(res.results[0].error.includes('null') || res.results[0].error.includes('property'));

    console.log('\n--- Test 5: Runtime Exception Handling ---');
    console.log(`Status: ${res.status}`);
    console.log(`Runtime Error on TC 1: ${res.results[0].error}`);
  });

  test('6. Correct Solution Real Validation in Sandbox', () => {
    const correctJSCode = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`;

    const res = executeJavaScript(correctJSCode, sampleTestCases);

    assert.equal(res.status, 'passed');
    assert.equal(res.is_correct, true);
    assert.equal(res.test_cases_passed, 3);
    assert.equal(res.total_test_cases, 3);
    assert.ok(res.execution_time_ms >= 0);

    console.log('\n--- Test 6: Correct Solution Real Validation ---');
    console.log(`Status: ${res.status}`);
    console.log(`Testcases Passed: ${res.test_cases_passed}/${res.total_test_cases}`);
    console.log(`Execution Time: ${res.execution_time_ms} ms`);
  });

  test('7. Sandbox Execution vs AI Analysis Separation', async () => {
    const correctJSCode = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`;

    const fullAnalysis = await analyzeCodeSubmission({
      studentId: 'sep_test_stu',
      language: 'javascript',
      problem: 'Two Sum',
      code: correctJSCode,
      testCases: sampleTestCases,
    });

    assert.equal(fullAnalysis.is_correct, true);
    assert.equal(fullAnalysis.execution_status, 'passed');
    assert.equal(fullAnalysis.test_cases_passed, 3);
    assert.ok(fullAnalysis.time_complexity.includes('O(N)'));
    assert.ok(fullAnalysis.detected_concepts.length > 0);

    console.log('\n--- Test 7: Full Execution + AI Analysis Pipeline ---');
    console.log(`Execution Status: ${fullAnalysis.execution_status}`);
    console.log(`Correctness Score: ${fullAnalysis.correctness_score}%`);
    console.log(`Time Complexity: ${fullAnalysis.time_complexity}`);
    console.log(`Mentor Feedback: ${fullAnalysis.mentor_feedback}`);
  });
});
