/**
 * CAREEROS - Dedicated Practice Arena Question Bank
 * Contains expansive practice problem sets for continuous algorithmic and aptitude problem-solving.
 * Distinct from the Initial Diagnostic Assessment Question Bank.
 */

import type { CodingQuestion, AptitudeQuestion } from './assessmentQuestions.ts';

export const PRACTICE_CODING_QUESTION_BANK: CodingQuestion[] = [
  {
    id: 'prac-code-1',
    title: '1. Two Sum',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input would have exactly one solution.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    testCases: [
      { input: 'twoSum([2,7,11,15], 9)', call: 'twoSum([2,7,11,15], 9)', expected: [0, 1] },
      { input: 'twoSum([3,2,4], 6)', call: 'twoSum([3,2,4], 6)', expected: [1, 2] },
      { input: 'twoSum([3,3], 6)', call: 'twoSum([3,3], 6)', expected: [0, 1] },
    ],
    starterTemplates: {
      python: `def twoSum(nums, target):\n    # Return indices [i, j]\n    pass`,
      javascript: `function twoSum(nums, target) {\n    // Return indices [i, j]\n    \n}`,
      cpp: `// C++ Solution\n#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}`,
      java: `// Java Solution\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`,
    },
  },
  {
    id: 'prac-code-2',
    title: '3. Longest Substring Without Repeating Characters',
    category: 'Sliding Window',
    difficulty: 'Medium',
    description: 'Given a string s, find the length of the longest substring without duplicate characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    testCases: [
      { input: 'lengthOfLongestSubstring("abcabcbb")', call: 'lengthOfLongestSubstring("abcabcbb")', expected: 3 },
      { input: 'lengthOfLongestSubstring("bbbbb")', call: 'lengthOfLongestSubstring("bbbbb")', expected: 1 },
      { input: 'lengthOfLongestSubstring("pwwkew")', call: 'lengthOfLongestSubstring("pwwkew")', expected: 3 },
    ],
    starterTemplates: {
      python: `def lengthOfLongestSubstring(s):\n    pass`,
      javascript: `function lengthOfLongestSubstring(s) {\n    \n}`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    return 0;\n}`,
      java: `public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`,
    },
  },
  {
    id: 'prac-code-3',
    title: '15. 3Sum',
    category: 'Two Pointers',
    difficulty: 'Medium',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    testCases: [
      { input: 'threeSum([-1,0,1,2,-1,-4])', call: 'threeSum([-1,0,1,2,-1,-4])', expected: [[-1, -1, 2], [-1, 0, 1]] },
      { input: 'threeSum([0,1,1])', call: 'threeSum([0,1,1])', expected: [] },
    ],
    starterTemplates: {
      python: `def threeSum(nums):\n    pass`,
      javascript: `function threeSum(nums) {\n    \n}`,
      cpp: `vector<vector<int>> threeSum(vector<int>& nums) {\n    return {};\n}`,
      java: `public class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}`,
    },
  },
  {
    id: 'prac-code-4',
    title: '20. Valid Parentheses',
    category: 'Stack',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    testCases: [
      { input: 'isValid("()")', call: 'isValid("()")', expected: true },
      { input: 'isValid("()[]{}")', call: 'isValid("()[]{}")', expected: true },
      { input: 'isValid("(]")', call: 'isValid("(]")', expected: false },
    ],
    starterTemplates: {
      python: `def isValid(s):\n    pass`,
      javascript: `function isValid(s) {\n    \n}`,
      cpp: `bool isValid(string s) {\n    return false;\n}`,
      java: `public class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}`,
    },
  },
  {
    id: 'prac-code-5',
    title: '70. Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3' },
    ],
    constraints: ['1 <= n <= 45'],
    testCases: [
      { input: 'climbStairs(2)', call: 'climbStairs(2)', expected: 2 },
      { input: 'climbStairs(3)', call: 'climbStairs(3)', expected: 3 },
      { input: 'climbStairs(5)', call: 'climbStairs(5)', expected: 8 },
    ],
    starterTemplates: {
      python: `def climbStairs(n):\n    pass`,
      javascript: `function climbStairs(n) {\n    \n}`,
      cpp: `int climbStairs(int n) {\n    return 0;\n}`,
      java: `public class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}`,
    },
  },
  {
    id: 'prac-code-6',
    title: '102. Binary Tree Level Order Traversal',
    category: 'Trees & BFS',
    difficulty: 'Medium',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values. (i.e., from left to right, level by level).',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    testCases: [
      { input: 'levelOrder([3,9,20,null,null,15,7])', call: 'levelOrder([3,9,20,null,null,15,7])', expected: [[3], [9, 20], [15, 7]] },
      { input: 'levelOrder([1])', call: 'levelOrder([1])', expected: [[1]] },
      { input: 'levelOrder([])', call: 'levelOrder([])', expected: [] },
    ],
    starterTemplates: {
      python: `def levelOrder(root):\n    pass`,
      javascript: `function levelOrder(root) {\n    \n}`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {\n    return {};\n}`,
      java: `public class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}`,
    },
  },
  {
    id: 'prac-code-7',
    title: '200. Number of Islands',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    description: 'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    testCases: [
      { input: 'numIslands([["1","1","0"],["1","1","0"],["0","0","1"]])', call: 'numIslands([["1","1","0"],["1","1","0"],["0","0","1"]])', expected: 2 },
      { input: 'numIslands([["1","1","1"],["0","1","0"],["1","1","1"]])', call: 'numIslands([["1","1","1"],["0","1","0"],["1","1","1"]])', expected: 1 },
    ],
    starterTemplates: {
      python: `def numIslands(grid):\n    pass`,
      javascript: `function numIslands(grid) {\n    \n}`,
      cpp: `int numIslands(vector<vector<char>>& grid) {\n    return 0;\n}`,
      java: `public class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}`,
    },
  },
  {
    id: 'prac-code-8',
    title: '42. Trapping Rain Water',
    category: 'Two Pointers & Monotonic Stack',
    difficulty: 'Hard',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    testCases: [
      { input: 'trap([0,1,0,2,1,0,1,3,2,1,2,1])', call: 'trap([0,1,0,2,1,0,1,3,2,1,2,1])', expected: 6 },
      { input: 'trap([4,2,0,3,2,5])', call: 'trap([4,2,0,3,2,5])', expected: 9 },
    ],
    starterTemplates: {
      python: `def trap(height):\n    pass`,
      javascript: `function trap(height) {\n    \n}`,
      cpp: `int trap(vector<int>& height) {\n    return 0;\n}`,
      java: `public class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}`,
    },
  },
  {
    id: 'prac-code-9',
    title: '295. Find Median from Data Stream',
    category: 'Heaps & Design',
    difficulty: 'Hard',
    description: 'The median is the middle value in an ordered integer list. Implement the MedianFinder class with addNum and findMedian methods in O(log N) time.',
    examples: [
      { input: '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\n[[], [1], [2], [], [3], []]', output: '[null, null, null, 1.5, null, 2.0]' },
    ],
    constraints: ['-10^5 <= num <= 10^5', 'At most 5 * 10^4 calls will be made to addNum and findMedian.'],
    testCases: [
      { input: 'medianFinderWorkflow([1, 2], [3])', call: 'medianFinderWorkflow([1, 2], [3])', expected: [1.5, 2.0] },
    ],
    starterTemplates: {
      python: `class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num: int) -> None:\n        pass\n    def findMedian(self) -> float:\n        pass`,
      javascript: `class MedianFinder {\n    constructor() {}\n    addNum(num) {}\n    findMedian() {}\n}`,
      cpp: `class MedianFinder {\npublic:\n    MedianFinder() {}\n    void addNum(int num) {}\n    double findMedian() { return 0.0; }\n};`,
      java: `class MedianFinder {\n    public MedianFinder() {}\n    public void addNum(int num) {}\n    public double findMedian() { return 0.0; }\n}`,
    },
  },
];

export const PRACTICE_APTITUDE_QUESTION_BANK: AptitudeQuestion[] = [
  {
    id: 'prac-apt-1',
    topic: 'Time and Work',
    category: 'Quantitative',
    difficulty: 'Easy',
    question: 'A can do a piece of work in 12 days and B in 16 days. They work together for 4 days. What fraction of the work is left unfinished?',
    options: ['7/12', '5/12', '1/3', '1/4'],
    correctAnswer: 1,
    explanation: 'A’s 1 day work = 1/12. B’s 1 day work = 1/16. Together 1 day = 1/12 + 1/16 = 7/48. In 4 days = 4 * (7/48) = 7/12. Remaining work = 1 - 7/12 = 5/12.',
  },
  {
    id: 'prac-apt-2',
    topic: 'Probability',
    category: 'Quantitative',
    difficulty: 'Medium',
    question: 'Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?',
    options: ['1/4', '1/2', '3/4', '5/12'],
    correctAnswer: 2,
    explanation: 'Total outcomes = 36. Product is odd only when both are odd: 3 * 3 = 9 outcomes. Product is even in 36 - 9 = 27 outcomes. Probability = 27/36 = 3/4.',
  },
  {
    id: 'prac-apt-3',
    topic: 'Seating Arrangement',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    question: 'Five colleagues A, B, C, D, and E are seated in a circular table. B is between A and C. E is to the immediate right of C. Who is sitting to the immediate left of A?',
    options: ['D', 'C', 'B', 'E'],
    correctAnswer: 0,
    explanation: 'Arrangement in clockwise order: A -> B -> C -> E -> D -> A. Immediate left of A is D.',
  },
];
