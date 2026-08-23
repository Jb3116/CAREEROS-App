/**
 * CAREEROS - AI Code Analysis & Personalized Feedback Service
 * Powered by Google Gemini (@google/genai SDK) and integrated with DKT Knowledge Tracing.
 */

import { GoogleGenAI } from '@google/genai';
import { DKTInference, SKILL_MAP, SKILL_DISPLAY_NAMES } from './dkt-engine.mjs';
import { executeCode, validateCodeCompleteness } from './code-execution-engine.mjs';

/**
 * Mapping from detected programming concepts to canonical DKT skills
 */
export const CONCEPT_TO_DKT_SKILL = {
  // Data Structures
  'binary tree': 'data_structures',
  'tree': 'data_structures',
  'bst': 'data_structures',
  'linked list': 'data_structures',
  'stack': 'data_structures',
  'queue': 'data_structures',
  'heap': 'data_structures',
  'priority queue': 'data_structures',
  'graph': 'data_structures',
  'trie': 'data_structures',
  'hash table': 'data_structures',
  'hash map': 'data_structures',
  'array': 'data_structures',

  // Algorithms
  'recursion': 'algorithms',
  'dynamic programming': 'algorithms',
  'memoization': 'algorithms',
  'dfs': 'algorithms',
  'bfs': 'algorithms',
  'two pointers': 'algorithms',
  'sliding window': 'algorithms',
  'binary search': 'algorithms',
  'sorting': 'algorithms',
  'greedy': 'algorithms',
  'backtracking': 'algorithms',

  // Language & Systems
  'python': 'python',
  'list comprehension': 'python',
  'dictionary': 'python',
  'class': 'oop',
  'inheritance': 'oop',
  'encapsulation': 'oop',
  'polymorphism': 'oop',
  'sql': 'sql',
  'select': 'sql',
  'join': 'sql',
  'thread': 'operating_systems',
  'concurrency': 'operating_systems',
  'socket': 'computer_networks',
};

/**
 * Map detected concepts from code to primary and secondary DKT skills
 */
export function mapConceptsToDKTSkills(concepts = [], language = 'python') {
  const dktSkills = new Set();

  // Add base language skill if mapped
  if (language === 'python') dktSkills.add('python');

  for (const c of concepts) {
    const norm = c.toLowerCase().trim();
    for (const [key, dktSkill] of Object.entries(CONCEPT_TO_DKT_SKILL)) {
      if (norm.includes(key)) {
        dktSkills.add(dktSkill);
      }
    }
  }

  // Default fallback if no concept matched
  if (dktSkills.size === 0) {
    dktSkills.add('algorithms');
  }

  return Array.from(dktSkills);
}

/**
 * Static Code & Complexity Detector
 */
export function analyzeCodeStatically(code = '', language = 'python', problemTitle = '') {
  const norm = code.toLowerCase();
  const detectedConcepts = [];
  const bugsIdentified = [];

  // Concept Extraction
  if (norm.includes('def ') || norm.includes('lambda')) detectedConcepts.push('Function Definitions');
  if (norm.includes('root') || norm.includes('left') || norm.includes('right') || norm.includes('tree')) {
    detectedConcepts.push('Binary Tree Traversal');
  }
  if (norm.includes('recursion') || (norm.includes('def ') && code.includes('(') && norm.includes('return '))) {
    // Check self-recursive calls
    detectedConcepts.push('Recursion');
  }
  if (norm.includes('dp') || norm.includes('memo') || norm.includes('cache')) {
    detectedConcepts.push('Dynamic Programming');
  }
  if (norm.includes('left') && norm.includes('right') && (norm.includes('while') || norm.includes('for'))) {
    detectedConcepts.push('Two Pointers');
  }
  if (norm.includes('class ') || norm.includes('public class') || norm.includes('struct ')) {
    detectedConcepts.push('Object-Oriented Design (OOP)');
  }
  if (norm.includes('hash') || norm.includes('dict') || norm.includes('map') || norm.includes('set')) {
    detectedConcepts.push('Hash Table Lookup');
  }

  // Time Complexity Estimation
  let timeComplexity = 'O(N)';
  let spaceComplexity = 'O(1)';

  const loopCount = (code.match(/for\s|while\s|forEach/g) || []).length;
  const isNestedLoop = /for[\s\S]*?for|while[\s\S]*?while|for[\s\S]*?while|while[\s\S]*?for/.test(code);

  if (isNestedLoop) {
    timeComplexity = 'O(N^2)';
  } else if (loopCount === 1 || detectedConcepts.includes('Binary Tree Traversal') || detectedConcepts.includes('Recursion')) {
    timeComplexity = 'O(N)';
  } else if (norm.includes('binary search') || norm.includes('mid =')) {
    timeComplexity = 'O(log N)';
  } else if (norm.includes('.sort(') || norm.includes('sorted(')) {
    timeComplexity = 'O(N log N)';
  }

  if (detectedConcepts.includes('Recursion') || detectedConcepts.includes('Binary Tree Traversal')) {
    spaceComplexity = 'O(H) (Call Stack)';
  } else if (detectedConcepts.includes('Dynamic Programming') || norm.includes('[]') || norm.includes('new int')) {
    spaceComplexity = 'O(N) (Auxiliary Memory)';
  }

  // Correctness & Bug Detection
  let isCorrect = true;
  let correctnessScore = 100;

  if (code.trim().length < 15 || norm.includes('pass') || (norm.includes('return 0') && !norm.includes('if'))) {
    isCorrect = false;
    correctnessScore = 30;
    bugsIdentified.push('Incomplete implementation or empty starter stub returned.');
  }

  if (norm.includes('root') && !norm.includes('if not root') && !norm.includes('if (root == null)') && !norm.includes('if (!root)')) {
    bugsIdentified.push('Missing base case for null/empty tree root node (Potential NullPointer / AttributeError).');
    correctnessScore = Math.min(correctnessScore, 65);
    isCorrect = false;
  }

  const primarySkill = mapConceptsToDKTSkills(detectedConcepts, language)[0];

  return {
    isCorrect,
    correctnessScore,
    timeComplexity,
    spaceComplexity,
    codeQualityScore: isCorrect ? 92 : 68,
    detectedConcepts: detectedConcepts.length > 0 ? detectedConcepts : ['General Problem Solving'],
    primarySkill,
    bugsIdentified,
  };
}

/**
 * Analyze Code Submission using Gemini SDK or Intelligent Static Fallback
 */
/**
 * Analyze Code Submission using Real Execution Engine & Gemini Socratic Reasoning
 */
export async function analyzeCodeSubmission({
  studentId = 's123',
  language = 'python',
  problem = '124. Binary Tree Maximum Path Sum',
  code = '',
  testCases = [],
}) {
  const completeness = validateCodeCompleteness(code, language);
  if (!completeness.isValid) {
    return {
      student_id: studentId,
      language,
      problem_title: problem,
      is_correct: false,
      correctness_score: 0,
      test_cases_passed: 0,
      total_test_cases: testCases.length || 3,
      execution_status: completeness.status,
      execution_time_ms: 0,
      test_results: [],
      error: completeness.message,
      time_complexity: 'N/A',
      space_complexity: 'N/A',
      code_quality_score: 0,
      detected_concepts: [],
      primary_dkt_skill: language === 'python' ? 'python' : 'algorithms',
      bugs_identified: [completeness.message],
      mentor_feedback: completeness.message,
      learning_hint: 'Write your logic implementation inside the function body and click Run Code.',
      optimization_tip: 'Start by handling the base cases first.',
    };
  }

  // Run actual code execution
  const execution = executeCode(language, code, testCases);
  const staticAnalysis = analyzeCodeStatically(code, language, problem);

  // Derive correctness strictly from real execution results
  const isCorrect = execution.status === 'passed' && execution.is_correct;
  const passedCount = execution.test_cases_passed || 0;
  const totalCount = execution.total_test_cases || (testCases.length || 3);
  const correctnessScore = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : (isCorrect ? 100 : 0);

  let finalResult = {
    student_id: studentId,
    language,
    problem_title: problem,
    is_correct: isCorrect,
    correctness_score: correctnessScore,
    test_cases_passed: passedCount,
    total_test_cases: totalCount,
    execution_status: execution.status,
    execution_time_ms: execution.execution_time_ms || 0,
    test_results: execution.results || [],
    error: execution.error || null,
    time_complexity: staticAnalysis.timeComplexity,
    space_complexity: staticAnalysis.spaceComplexity,
    code_quality_score: isCorrect ? 92 : 65,
    detected_concepts: staticAnalysis.detectedConcepts,
    primary_dkt_skill: staticAnalysis.primarySkill,
    bugs_identified: execution.error ? [execution.error] : staticAnalysis.bugsIdentified,
    mentor_feedback: isCorrect
      ? `Outstanding work! All ${passedCount}/${totalCount} testcases passed cleanly with optimal ${staticAnalysis.timeComplexity} asymptotic complexity.`
      : execution.error
      ? `Execution error encountered: ${execution.error}`
      : `Your solution passed ${passedCount}/${totalCount} testcases. Check for boundary conditions and unhandled edge inputs.`,
    learning_hint: isCorrect
      ? 'Can you optimize the auxiliary recursion call stack space further or solve this iteratively?'
      : 'Consider checking if root is null before recursive descent, and handle negative node value sums by bounding them with Math.max(0, pathSum).',
    optimization_tip: 'Always declare base cases first to avoid unnecessary call stack overhead.',
  };

  // If GEMINI_API_KEY is available, enrich with Gemini Socratic analysis
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the CAREEROS AI Code Evaluator.
Analyze this student code submission:
Problem: ${problem}
Language: ${language}
Execution Status: ${execution.status} (Passed: ${passedCount}/${totalCount})
Code:
\`\`\`${language}
${code}
\`\`\`

Provide analysis in concise JSON format with keys:
{
  "time_complexity": string,
  "space_complexity": string,
  "code_quality_score": number (0-100),
  "detected_concepts": string[],
  "mentor_feedback": string (Socratic mentor tone),
  "learning_hint": string (Hint without giving away complete solution)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      if (response.text) {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          finalResult = {
            ...finalResult,
            time_complexity: parsed.time_complexity || finalResult.time_complexity,
            space_complexity: parsed.space_complexity || finalResult.space_complexity,
            code_quality_score: parsed.code_quality_score || finalResult.code_quality_score,
            detected_concepts: parsed.detected_concepts || finalResult.detected_concepts,
            mentor_feedback: parsed.mentor_feedback || finalResult.mentor_feedback,
            learning_hint: parsed.learning_hint || finalResult.learning_hint,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini Code Analysis note:', err.message);
    }
  }

  return finalResult;
}
