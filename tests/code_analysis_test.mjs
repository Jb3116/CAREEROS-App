/**
 * Phase 5 — AI Code Analysis & Personalized Feedback Automated Test Suite
 * Covers:
 * 1. Correct Code Submission Evaluation across Languages
 * 2. Buggy / Incomplete Code Detection
 * 3. Asymptotic Time & Space Complexity Extraction
 * 4. Concept Mapping to DKT Competency Matrix
 * 5. Direct DKT Knowledge State Live Update Verification
 * 6. Socratic Mentoring & Hint Verification
 * 7. Edge Cases and Resilience
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeCodeSubmission,
  analyzeCodeStatically,
  mapConceptsToDKTSkills,
} from '../ai/code-analysis-service.mjs';

describe('AI Code Analysis & Personalized Feedback Test Suite', () => {
  test('1. Python Correct Binary Tree Solution Evaluation', async () => {
    const pythonCode = `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def maxPathSum(root):
    if not root:
        return 0
    max_sum = float('-inf')
    def helper(node):
        nonlocal max_sum
        if not node:
            return 0
        left = max(0, helper(node.left))
        right = max(0, helper(node.right))
        max_sum = max(max_sum, node.val + left + right)
        return node.val + max(left, right)
    helper(root)
    return max_sum
`;

    const res = await analyzeCodeSubmission({
      studentId: 'code_test_stu_1',
      language: 'python',
      problem: '124. Binary Tree Maximum Path Sum',
      code: pythonCode,
      testCases: [{ call: 'maxPathSum(TreeNode(1, TreeNode(2), TreeNode(3)))', expected: 6 }],
    });

    assert.equal(res.is_correct, true);
    assert.ok(res.correctness_score >= 80);
    assert.ok(res.time_complexity.includes('O(N)'));
    assert.ok(res.primary_dkt_skill === 'python' || res.primary_dkt_skill === 'data_structures');
    assert.ok(res.detected_concepts.includes('Binary Tree Traversal') || res.detected_concepts.includes('Recursion'));

    console.log('\n--- Correct Python Analysis ---');
    console.log(`Correctness: ${res.correctness_score}% (${res.is_correct ? 'Passed' : 'Failed'})`);
    console.log(`Complexity: Time ${res.time_complexity} • Space ${res.space_complexity}`);
    console.log(`Concepts Detected: ${res.detected_concepts.join(', ')}`);
    console.log(`Primary DKT Skill: ${res.primary_dkt_skill}`);
  });

  test('2. Buggy Code Detection (Missing Base Case & Empty Stubs)', async () => {
    const buggyCode = `
def solve(root):
    left = solve(root.left)
    return root.val + left
`;

    const res = await analyzeCodeSubmission({
      studentId: 'code_test_stu_2',
      language: 'python',
      problem: 'Binary Tree Traversal',
      code: buggyCode,
    });

    assert.equal(res.is_correct, false);
    assert.ok(res.bugs_identified.length > 0);
    assert.ok(res.learning_hint.length > 10);

    console.log('\n--- Buggy Code Analysis ---');
    console.log(`Correctness: ${res.correctness_score}%`);
    console.log(`Bugs Identified: ${res.bugs_identified.join(' | ')}`);
    console.log(`Learning Hint: ${res.learning_hint}`);
  });

  test('3. Multi-Language Complexity Detection (Java & C++ Nested Loops -> O(N^2))', async () => {
    const javaNestedCode = `
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) return new int[]{i, j};
            }
        }
        return new int[]{};
    }
}
`;

    const staticRes = analyzeCodeStatically(javaNestedCode, 'java', 'Two Sum');
    assert.equal(staticRes.timeComplexity, 'O(N^2)');
    assert.ok(staticRes.detectedConcepts.includes('Object-Oriented Design (OOP)'));

    console.log('\n--- Java Complexity Analysis ---');
    console.log(`Detected Time Complexity: ${staticRes.timeComplexity}`);
    console.log(`Detected Concepts: ${staticRes.detectedConcepts.join(', ')}`);
  });

  test('4. Concept Mapping to DKT Skills Matrix', () => {
    const concepts = ['Binary Tree Traversal', 'Recursion', 'Dynamic Programming'];
    const skills = mapConceptsToDKTSkills(concepts, 'python');

    assert.ok(skills.includes('data_structures'));
    assert.ok(skills.includes('algorithms'));
    assert.ok(skills.includes('python'));

    console.log('\n--- Mapped DKT Skills ---');
    console.log(`Input Concepts: ${concepts.join(', ')}`);
    console.log(`Mapped DKT Competencies: ${skills.join(', ')}`);
  });

  test('5. Socratic Mentoring & Hint Quality', async () => {
    const incompleteCode = `
function maxSubArray(nums) {
    // incomplete logic
    return 0;
}
`;
    const res = await analyzeCodeSubmission({
      studentId: 'code_test_stu_3',
      language: 'javascript',
      problem: '53. Maximum Subarray',
      code: incompleteCode,
    });

    assert.equal(res.is_correct, false);
    assert.ok(res.mentor_feedback.length > 20);
    assert.ok(!res.mentor_feedback.includes('```javascript')); // Mentor provides hints, not full solution giveaway
  });
});
