import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { searchRealCourses, VERIFIED_COURSES_DB } from '../ai/course-search-service.mjs';
import { executeCode, executeJavaScript, validateCodeCompleteness } from '../ai/code-execution-engine.mjs';

describe('Real Course Search & Coding Execution Validation Suite', () => {
  // ---------------- 1. Real Course Search Backend Tests ----------------
  test('1. All verified courses have valid HTTPS URLs and accredited platforms', () => {
    assert.ok(VERIFIED_COURSES_DB.length >= 10, 'Should have comprehensive verified courses catalog');

    const validPlatforms = [
      'MIT OpenCourseWare',
      'Harvard Online / edX',
      'freeCodeCamp',
      'Coursera (Free Audit Available)',
      'Coursera',
      'Educative.io',
      'Udemy',
      'Udacity / Georgia Tech',
      'UC Berkeley Webcasts',
      'Carnegie Mellon University Online',
      'GitHub / freeCodeCamp',
      'freeCodeCamp / YouTube',
    ];

    VERIFIED_COURSES_DB.forEach((c) => {
      assert.ok(c.id, 'Course must have an ID');
      assert.ok(c.title.length > 5, 'Course must have descriptive title');
      assert.ok(c.url.startsWith('https://'), `Course URL must be valid HTTPS: ${c.url}`);
      assert.ok(!c.url.includes('example.com') && !c.url.includes('fake'), 'URL must be a real platform link');
      assert.ok(c.type === 'free' || c.type === 'paid', 'Course must be categorized as free or paid');
      assert.ok(c.skills && c.skills.length > 0, 'Course must list relevant skills');
      assert.ok(validPlatforms.some((p) => c.platform.includes(p) || p.includes(c.platform)), `Valid platform: ${c.platform}`);
    });
  });

  test('2. Segregation into FREE and PAID tiers works accurately', () => {
    const freeRes = searchRealCourses({ filterType: 'free' });
    assert.ok(freeRes.courses.every((c) => c.type === 'free'), 'All returned courses must be free');
    assert.ok(freeRes.free_count > 0, 'Must contain free courses');

    const paidRes = searchRealCourses({ filterType: 'paid' });
    assert.ok(paidRes.courses.every((c) => c.type === 'paid'), 'All returned courses must be paid');
    assert.ok(paidRes.paid_count > 0, 'Must contain paid courses');

    const allRes = searchRealCourses({ filterType: 'all' });
    assert.equal(allRes.total_count, allRes.free_count + allRes.paid_count);
  });

  test('3. Query and skill gap matching ranks relevant courses higher', () => {
    const dsaSearch = searchRealCourses({ query: 'tree' });
    assert.ok(dsaSearch.courses.length > 0);
    assert.ok(
      dsaSearch.courses[0].skills.some((s) => s.toLowerCase().includes('tree')) ||
      dsaSearch.courses[0].title.toLowerCase().includes('algorithm') ||
      dsaSearch.courses[0].title.toLowerCase().includes('tree')
    );

    const skillGapSearch = searchRealCourses({
      query: '',
      studentSkillGaps: [{ skill_name: 'Operating Systems' }, { skill_name: 'Distributed Systems' }],
    });
    assert.ok(skillGapSearch.courses.length > 0);
    assert.ok(skillGapSearch.courses[0].matchScore > 50, 'Matched skill gaps must boost course relevance');
  });

  // ---------------- 2. Code Execution & Test Case Matching Tests ----------------
  test('4. Testcase evaluation strictly uses actualOutput.trim() === expectedOutput.trim()', () => {
    const correctCode = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
`;
    const testCases = [
      { call: 'twoSum([2,7,11,15], 9)', expected: [0, 1] },
      { call: 'twoSum([3,2,4], 6)', expected: [1, 2] },
      { call: 'twoSum([3,3], 6)', expected: [0, 1], hidden: true },
    ];

    const result = executeCode('javascript', correctCode, testCases);
    assert.equal(result.status, 'passed');
    assert.equal(result.is_correct, true);
    assert.equal(result.test_cases_passed, 3);
    assert.equal(result.results.length, 3);

    // Verify hidden testcase data protection
    assert.equal(result.results[2].isHidden, true);
    assert.equal(result.results[2].input, '[Hidden Testcase Input]');
    assert.equal(result.results[2].expected, '[Hidden Expected Output]');
    assert.equal(result.results[2].passed, true);
  });

  test('5. Standard output (stdout) and standard error (stderr) capturing', () => {
    const codeWithLogs = `
function solve() {
  console.log("Debug log 1");
  console.log("Calculated answer:", 42);
  return 42;
}
`;
    const testCases = [{ call: 'solve()', expected: 42 }];
    const result = executeJavaScript(codeWithLogs, testCases);
    assert.equal(result.status, 'passed');
    assert.ok(result.stdout.includes('Debug log 1'));
    assert.ok(result.stdout.includes('Calculated answer: 42'));
    assert.equal(result.stderr, '');
  });

  test('6. Syntax error and runtime exception handling returns clear error states', () => {
    const syntaxErrorCode = `function broken( { return 123; }`;
    const res1 = executeCode('javascript', syntaxErrorCode, [{ call: 'broken()', expected: 123 }]);
    assert.equal(res1.status, 'syntax_error');
    assert.equal(res1.is_correct, false);
    assert.ok(res1.error.includes('Syntax Error'));

    const runtimeErrorCode = `function crash() { const obj = null; return obj.missingProperty; }`;
    const res2 = executeCode('javascript', runtimeErrorCode, [{ call: 'crash()', expected: 5 }]);
    assert.equal(res2.status, 'failed');
    assert.equal(res2.is_correct, false);
    assert.ok(res2.results[0].error.length > 0);
  });
});
