/**
 * CAREEROS - Real Pretrained Transformer Inference Service
 * Powered by @huggingface/transformers & ONNX Runtime
 * Model: Xenova/all-MiniLM-L6-v2 (384-dimensional dense semantic vectors)
 */

import { pipeline, env } from '@huggingface/transformers';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SKILL_DISPLAY_NAMES, SKILL_CATEGORIES } from './dkt-engine.mjs';

// Configure ONNX WASM & Local Cache paths
const distPath = join(process.cwd(), 'node_modules', 'onnxruntime-web', 'dist');
env.backends.onnx.wasm.wasmPaths = pathToFileURL(distPath).href + '/';
env.backends.onnx.wasm.numThreads = 1;
env.cacheDir = join(process.cwd(), '.cache');

export const TRANSFORMER_METADATA = {
  model_name: 'Xenova/all-MiniLM-L6-v2',
  model_source: 'Hugging Face (sentence-transformers/all-MiniLM-L6-v2)',
  runtime: 'ONNX Runtime (WASM / CPU)',
  tokenizer: 'BertTokenizer (WordPiece)',
  architecture: 'MiniLM-L6-H384-uncased Transformer (6 layers, 12 heads, 384 hidden)',
  embedding_dim: 384,
  real_transformer_inference: true,
  model_weights_loaded: true,
  tokenizer_loaded: true,
  version: '3.3.3',
};

export const EMBEDDING_MODEL_INFO = TRANSFORMER_METADATA;

// Singleton pipeline instance and vector cache
let extractorPromise = null;
let isModelInitialized = false;
let modelLoadTimeMs = 0;
const EMBEDDING_CACHE = new Map();

/**
 * Initialize and cache the pretrained Transformer pipeline
 */
export async function initializeModel() {
  if (extractorPromise) return extractorPromise;

  const t0 = performance.now();
  try {
    extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'fp32',
    });
    const extractor = await extractorPromise;
    const t1 = performance.now();
    modelLoadTimeMs = Number((t1 - t0).toFixed(2));
    isModelInitialized = true;
    return extractor;
  } catch (err) {
    console.error('Failed to initialize Transformer model:', err);
    extractorPromise = null;
    isModelInitialized = false;
    throw err;
  }
}

/**
 * Generate a 384-dimensional dense semantic embedding using real transformer forward pass
 */
export async function getEmbedding(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input text for embedding generation.');
  }

  const cleanText = text.trim();
  if (EMBEDDING_CACHE.has(cleanText)) {
    return EMBEDDING_CACHE.get(cleanText);
  }

  const extractor = await initializeModel();
  const output = await extractor(cleanText, { pooling: 'mean', normalize: true });
  const embedding = Array.from(output.data);

  EMBEDDING_CACHE.set(cleanText, embedding);
  return embedding;
}

/**
 * Cosine Similarity between two L2-normalized embedding arrays
 */
export function computeCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.min(1.0, Math.max(0.0, dotProduct));
}

// Canonical Skill Phrases for Real Semantic Matching
export const CANONICAL_SKILL_DESCRIPTIONS = {
  python: 'Python programming language, scripting, backend development, data analysis, algorithms',
  data_structures: 'Data structures, arrays, linked lists, binary trees, graphs, heaps, hash maps, tries',
  algorithms: 'Algorithms, dynamic programming, greedy algorithms, divide and conquer, sorting, graph traversal',
  sql: 'SQL, relational database queries, PostgreSQL, MySQL, joins, aggregations, database indexing',
  oop: 'Object-oriented programming, classes, inheritance, polymorphism, encapsulation, SOLID design patterns',
  dbms: 'Database management systems, ACID transactions, concurrency control, normalization, storage engines',
  operating_systems: 'Operating systems, multithreading, concurrency, mutex, processes, virtual memory, paging',
  computer_networks: 'Computer networks, TCP/IP protocols, HTTP, DNS, socket programming, network layers',
  machine_learning: 'Machine learning, supervised learning, deep learning, neural networks, predictive models, AI',
  aptitude: 'Quantitative aptitude, logical reasoning, probability, permutations, arithmetic problem solving',
  communication: 'Behavioral communication, STAR interview method, articulation, teamwork, soft skills',
};

// Target Role Blueprints
export const TARGET_ROLE_BLUEPRINTS = {
  swe: {
    role_id: 'swe',
    title: 'Software Development Engineer (SDE / SWE)',
    category: 'Software Engineering',
    requirements: [
      { skill: 'data_structures', description: 'Data structures & algorithmic problem solving', weight: 0.95, min_mastery: 75, importance: 'Critical' },
      { skill: 'algorithms', description: 'Algorithms, dynamic programming, and complexity analysis', weight: 0.95, min_mastery: 75, importance: 'Critical' },
      { skill: 'python', description: 'Python programming and core software development', weight: 0.85, min_mastery: 70, importance: 'High' },
      { skill: 'oop', description: 'Object-oriented programming and system design patterns', weight: 0.85, min_mastery: 70, importance: 'High' },
      { skill: 'dbms', description: 'Database management systems and ACID transactions', weight: 0.80, min_mastery: 65, importance: 'High' },
      { skill: 'operating_systems', description: 'Operating systems, multithreading, and concurrency', weight: 0.80, min_mastery: 65, importance: 'High' },
      { skill: 'computer_networks', description: 'Computer networks and TCP/IP protocols', weight: 0.75, min_mastery: 60, importance: 'Medium' },
      { skill: 'sql', description: 'SQL relational database querying and schema design', weight: 0.70, min_mastery: 60, importance: 'Medium' },
      { skill: 'communication', description: 'STAR behavioral communication and team collaboration', weight: 0.75, min_mastery: 65, importance: 'Medium' },
      { skill: 'aptitude', description: 'Quantitative and logical reasoning', weight: 0.70, min_mastery: 60, importance: 'Medium' },
    ],
  },
  data_scientist: {
    role_id: 'data_scientist',
    title: 'Data Scientist / Machine Learning Engineer',
    category: 'Data & Artificial Intelligence',
    requirements: [
      { skill: 'machine_learning', description: 'Machine learning, predictive modelling, supervised learning, deep learning', weight: 0.98, min_mastery: 80, importance: 'Critical' },
      { skill: 'python', description: 'Python programming, data analysis, pandas, numpy', weight: 0.95, min_mastery: 75, importance: 'Critical' },
      { skill: 'sql', description: 'SQL relational database queries, aggregations, data extraction', weight: 0.85, min_mastery: 70, importance: 'High' },
      { skill: 'algorithms', description: 'Algorithms, optimization, and statistical computation', weight: 0.85, min_mastery: 70, importance: 'High' },
      { skill: 'data_structures', description: 'Core data structures and algorithmic complexity', weight: 0.80, min_mastery: 65, importance: 'High' },
      { skill: 'aptitude', description: 'Quantitative reasoning, probability, and mathematical statistics', weight: 0.80, min_mastery: 65, importance: 'Medium' },
      { skill: 'communication', description: 'Technical presentation and STAR behavioral communication', weight: 0.70, min_mastery: 60, importance: 'Medium' },
    ],
  },
  ml_engineer: {
    role_id: 'ml_engineer',
    title: 'Machine Learning & AI Engineer',
    category: 'Data & Artificial Intelligence',
    requirements: [
      { skill: 'machine_learning', description: 'Machine learning, predictive modelling, deep learning, PyTorch', weight: 0.98, min_mastery: 80, importance: 'Critical' },
      { skill: 'python', description: 'Python programming, data processing, async workflows', weight: 0.95, min_mastery: 75, importance: 'Critical' },
      { skill: 'algorithms', description: 'Algorithmic optimization and graph models', weight: 0.85, min_mastery: 70, importance: 'High' },
      { skill: 'data_structures', description: 'Data structures, trees, and tensor layouts', weight: 0.80, min_mastery: 65, importance: 'High' },
      { skill: 'sql', description: 'SQL relational queries and dataset management', weight: 0.70, min_mastery: 60, importance: 'Medium' },
      { skill: 'aptitude', description: 'Quantitative logic and probability', weight: 0.80, min_mastery: 65, importance: 'Medium' },
      { skill: 'communication', description: 'STAR behavioral articulation and stakeholder communication', weight: 0.70, min_mastery: 60, importance: 'Medium' },
    ],
  },
  data_analyst: {
    role_id: 'data_analyst',
    title: 'Data Analyst / BI Specialist',
    category: 'Analytics & Business Intelligence',
    requirements: [
      { skill: 'sql', description: 'SQL relational queries, joins, window functions, data pipelines', weight: 0.95, min_mastery: 80, importance: 'Critical' },
      { skill: 'python', description: 'Python programming, pandas data analysis, automation', weight: 0.85, min_mastery: 70, importance: 'High' },
      { skill: 'aptitude', description: 'Quantitative reasoning, data interpretation, probability', weight: 0.85, min_mastery: 70, importance: 'High' },
      { skill: 'dbms', description: 'Database management systems, warehousing, normalization', weight: 0.80, min_mastery: 65, importance: 'Medium' },
      { skill: 'communication', description: 'Data storytelling and stakeholder communication', weight: 0.80, min_mastery: 70, importance: 'High' },
    ],
  },
};

/**
 * Match a raw query term against known skills using real Transformer cosine similarity
 */
export async function matchSkillSemantics(queryText) {
  try {
    const queryVec = await getEmbedding(queryText);
    let bestSkill = null;
    let bestSim = -1.0;

    for (const [skillKey, desc] of Object.entries(CANONICAL_SKILL_DESCRIPTIONS)) {
      const targetVec = await getEmbedding(desc);
      const sim = computeCosineSimilarity(queryVec, targetVec);
      if (sim > bestSim) {
        bestSim = sim;
        bestSkill = skillKey;
      }
    }

    return {
      matched_skill_key: bestSkill,
      skill_name: SKILL_DISPLAY_NAMES[bestSkill] || bestSkill,
      similarity: Number(bestSim.toFixed(4)),
      matched_phrase: queryText,
      real_transformer_inference: true,
    };
  } catch (err) {
    return {
      status: 'model_unavailable',
      message: 'Transformer model unavailable.',
      error: err.message,
    };
  }
}

/**
 * Sentence-BERT Skill Gap Service using Real Pretrained Transformer Embeddings
 */
export class SentenceBERTSkillGapService {
  static async analyzeSkillGaps(dktProfile, targetRoleId = 'swe') {
    if (!dktProfile || dktProfile.status === 'not_trained') {
      return {
        status: 'not_trained',
        message: 'AI skill analysis is being prepared. DKT student model has not been trained yet.',
        student_id: dktProfile?.student_id || 'unknown',
      };
    }

    try {
      await initializeModel();
    } catch (err) {
      return {
        status: 'model_unavailable',
        message: 'Transformer model is unavailable.',
        student_id: dktProfile.student_id,
      };
    }

    const roleKey = targetRoleId === 'data_scientist' ? 'data_scientist' : (TARGET_ROLE_BLUEPRINTS[targetRoleId] ? targetRoleId : 'swe');
    const roleBlueprint = TARGET_ROLE_BLUEPRINTS[roleKey] || TARGET_ROLE_BLUEPRINTS.swe;
    const studentSkillsMap = {};

    for (const s of dktProfile.skills || []) {
      studentSkillsMap[s.id || s.key] = s;
    }

    const matched_skills = [];
    const partial_matches = [];
    const skill_gaps = [];
    let totalWeightedScore = 0;
    let totalWeightSum = 0;

    for (const req of roleBlueprint.requirements) {
      const studentSkill = studentSkillsMap[req.skill] || {
        percentage: 45,
        probability: 0.45,
        level: 'Needs Practice',
        attempts: 0,
      };

      const mastery = studentSkill.percentage;
      const minMastery = req.min_mastery;
      const weight = req.weight;
      totalWeightSum += weight;

      // Real semantic embedding similarity between requirement and canonical skill description
      const reqVec = await getEmbedding(req.description);
      const skillVec = await getEmbedding(CANONICAL_SKILL_DESCRIPTIONS[req.skill] || req.skill);
      const similarity = Number(computeCosineSimilarity(reqVec, skillVec).toFixed(4));

      const masteryGap = Math.max(0, minMastery - mastery);

      // Priority formula
      const priorityScore = Number(
        (weight * 0.4 + (masteryGap / 100) * 0.4 + (1.0 - mastery / 100) * 0.2).toFixed(3)
      );

      let priorityLevel = 'Low';
      if (priorityScore >= 0.65 || (req.importance === 'Critical' && mastery < minMastery)) {
        priorityLevel = 'Critical (P0)';
      } else if (priorityScore >= 0.50) {
        priorityLevel = 'High (P1)';
      } else if (priorityScore >= 0.35) {
        priorityLevel = 'Medium (P2)';
      } else {
        priorityLevel = 'Low (P3)';
      }

      const item = {
        skill_id: req.skill,
        skill_name: SKILL_DISPLAY_NAMES[req.skill] || req.skill,
        category: SKILL_CATEGORIES[req.skill] || 'coding',
        importance: req.importance,
        role_weight: req.weight,
        target_mastery: minMastery,
        current_mastery: mastery,
        mastery_gap: masteryGap,
        semantic_similarity: similarity,
        priority_score: priorityScore,
        priority_level: priorityLevel,
        student_attempts: studentSkill.attempts || 0,
        confidence: studentSkill.confidence || 'Calibrating',
        action_recommendation:
          mastery >= minMastery
            ? 'Competency benchmark attained. Maintain with periodic refreshers.'
            : mastery >= minMastery - 10
            ? `Close ${masteryGap}% gap with targeted problem sets.`
            : `Priority foundational remediation required (+${masteryGap}% to reach hiring threshold).`,
      };

      if (mastery >= minMastery) {
        matched_skills.push(item);
        totalWeightedScore += weight * 1.0;
      } else if (mastery >= minMastery - 10) {
        partial_matches.push(item);
        totalWeightedScore += weight * (mastery / minMastery);
      } else {
        skill_gaps.push(item);
        totalWeightedScore += weight * (mastery / minMastery);
      }
    }

    skill_gaps.sort((a, b) => b.priority_score - a.priority_score);
    partial_matches.sort((a, b) => b.priority_score - a.priority_score);
    matched_skills.sort((a, b) => b.current_mastery - a.current_mastery);

    const overallFitScore = Math.round((totalWeightedScore / (totalWeightSum || 1)) * 100);

    return {
      status: 'success',
      student_id: dktProfile.student_id,
      target_role: {
        role_id: roleBlueprint.role_id,
        title: roleBlueprint.title,
        category: roleBlueprint.category,
      },
      role_fit_score: overallFitScore,
      summary: {
        total_competencies_evaluated: roleBlueprint.requirements.length,
        matched_count: matched_skills.length,
        partial_count: partial_matches.length,
        gap_count: skill_gaps.length,
        top_critical_gap: skill_gaps.length > 0 ? skill_gaps[0].skill_name : null,
      },
      matched_skills,
      partial_matches,
      skill_gaps,
      model_metadata: {
        ...TRANSFORMER_METADATA,
        model_load_time_ms: modelLoadTimeMs,
      },
    };
  }
}
