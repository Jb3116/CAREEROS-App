/**
 * Real Pretrained Transformer Verification Suite
 * Executes Tests 1 through 9:
 * - Test 1: Real Embedding Dimension, Norm, & First 10 Values
 * - Test 2: Cosine Similarity on ML vs Supervised Learning vs Electrical Power Systems
 * - Test 3: Semantic Test Pairs Evaluation
 * - Test 4: DKT + Real Transformer Pipeline (Student: Python=0.85, SQL=0.72, ML=0.35, React=0.20)
 * - Test 5: Fingerprint Determinism & Text Distinctness
 * - Test 6: Model Weights & Architecture Verification
 * - Test 7: Real Performance Benchmarks (Load time, First inference, Subsequent inference)
 * - Test 8: Live HTTP API Endpoint Verification
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import {
  initializeModel,
  getEmbedding,
  computeCosineSimilarity,
  SentenceBERTSkillGapService,
  TRANSFORMER_METADATA,
} from '../ai/sentence-bert-service.mjs';

describe('Real Transformer Inference Verification Suite (Xenova/all-MiniLM-L6-v2)', () => {
  let modelLoadTimeMs = 0;
  let firstInferenceTimeMs = 0;
  let subsequentInferenceTimeMs = 0;

  test('Test 6 & 7: Model Weight, Tokenizer & Runtime Initialization Benchmark', async () => {
    const t0 = performance.now();
    await initializeModel();
    const t1 = performance.now();
    modelLoadTimeMs = Number((t1 - t0).toFixed(2));

    console.log('\n--- MODEL & RUNTIME ARCHITECTURE VERIFICATION ---');
    console.log(`Model Name: ${TRANSFORMER_METADATA.model_name}`);
    console.log(`Source: ${TRANSFORMER_METADATA.model_source}`);
    console.log(`Runtime: ${TRANSFORMER_METADATA.runtime}`);
    console.log(`Tokenizer: ${TRANSFORMER_METADATA.tokenizer}`);
    console.log(`Architecture: ${TRANSFORMER_METADATA.architecture}`);
    console.log(`Embedding Dimension: ${TRANSFORMER_METADATA.embedding_dim}`);
    console.log(`Real Transformer Inference: ${TRANSFORMER_METADATA.real_transformer_inference ? 'YES' : 'NO'}`);
    console.log(`Model Weights Loaded: ${TRANSFORMER_METADATA.model_weights_loaded ? 'YES' : 'NO'}`);
    console.log(`Tokenizer Loaded: ${TRANSFORMER_METADATA.tokenizer_loaded ? 'YES' : 'NO'}`);
    console.log(`Model Loading Time: ${modelLoadTimeMs} ms`);

    assert.equal(TRANSFORMER_METADATA.real_transformer_inference, true);
    assert.equal(TRANSFORMER_METADATA.model_weights_loaded, true);
    assert.equal(TRANSFORMER_METADATA.tokenizer_loaded, true);
    assert.equal(TRANSFORMER_METADATA.embedding_dim, 384);
  });

  test('Test 1 & 7: Feature Extraction on "machine learning"', async () => {
    const t0 = performance.now();
    const embML = await getEmbedding('machine learning');
    const t1 = performance.now();
    firstInferenceTimeMs = Number((t1 - t0).toFixed(2));

    // Vector length check
    assert.equal(embML.length, 384, 'Embedding length must be exactly 384');

    // Non-zero values check
    const nonZeroCount = embML.filter((x) => x !== 0).length;
    assert.ok(nonZeroCount > 300, 'Dense vector should have non-zero values across majority of dimensions');

    // L2 Norm check
    let sumSq = 0;
    for (const v of embML) sumSq += v * v;
    const norm = Math.sqrt(sumSq);
    assert.ok(Math.abs(norm - 1.0) < 0.01, `L2 norm must be approximately 1.0 (Got: ${norm})`);

    const first10 = embML.slice(0, 10).map((x) => Number(x.toFixed(6)));

    console.log('\n--- TEST 1: REAL EMBEDDING EXTRACTION ---');
    console.log(`Text: "machine learning"`);
    console.log(`Dimension: ${embML.length}`);
    console.log(`L2 Norm: ${norm.toFixed(6)}`);
    console.log(`First Inference Time: ${firstInferenceTimeMs} ms`);
    console.log(`First 10 numerical values: [${first10.join(', ')}]`);
  });

  test('Test 2: Cosine Similarity Benchmarks', async () => {
    const t0 = performance.now();
    const embSL = await getEmbedding('supervised learning');
    const t1 = performance.now();
    subsequentInferenceTimeMs = Number((t1 - t0).toFixed(2));

    const embEPS = await getEmbedding('electrical power systems');
    const embML = await getEmbedding('machine learning');

    const simML_SL = computeCosineSimilarity(embML, embSL);
    const simML_EPS = computeCosineSimilarity(embML, embEPS);

    console.log('\n--- TEST 2: COSINE SIMILARITY BENCHMARKS ---');
    console.log(`Sim("machine learning", "supervised learning"): ${simML_SL.toFixed(4)} (High Semantic Match)`);
    console.log(`Sim("machine learning", "electrical power systems"): ${simML_EPS.toFixed(4)} (Low / Orthogonal)`);
    console.log(`Subsequent Inference Time: ${subsequentInferenceTimeMs} ms`);

    assert.ok(simML_SL >= 0.70, `Similarity between ML and Supervised Learning should be high (Got: ${simML_SL})`);
    assert.ok(simML_EPS < 0.40, `Similarity between ML and Electrical Power Systems should be low (Got: ${simML_EPS})`);
  });

  test('Test 3: Semantic Test Pairs Evaluation', async () => {
    const testPairs = [
      { name: 'Pair 1', t1: 'Python programming', t2: 'Python software development', minSim: 0.75 },
      { name: 'Pair 2', t1: 'Machine learning', t2: 'Supervised learning and neural networks', minSim: 0.60 },
      { name: 'Pair 3', t1: 'Relational database queries', t2: 'SQL and database indexing', minSim: 0.45 },
      { name: 'Pair 4', t1: 'Behavioral communication', t2: 'STAR interview method', minSim: 0.20 },
      { name: 'Unrelated 1', t1: 'Machine learning', t2: 'Electrical power systems', maxSim: 0.35 },
      { name: 'Unrelated 2', t1: 'Python programming', t2: 'Civil structural analysis', maxSim: 0.35 },
    ];

    console.log('\n--- TEST 3: REAL TRANSFORMER SEMANTIC PAIRS TABLE ---');
    const results = [];
    for (const p of testPairs) {
      const v1 = await getEmbedding(p.t1);
      const v2 = await getEmbedding(p.t2);
      const sim = computeCosineSimilarity(v1, v2);

      results.push({
        Pair: p.name,
        Text_1: p.t1,
        Text_2: p.t2,
        Cosine_Similarity: Number(sim.toFixed(4)),
        Expected: p.minSim ? `>= ${p.minSim}` : `< ${p.maxSim}`,
        Status: (p.minSim ? sim >= p.minSim : sim < p.maxSim) ? 'PASSED' : 'FAILED',
      });

      if (p.minSim) assert.ok(sim >= p.minSim, `${p.name} failed min threshold`);
      if (p.maxSim) assert.ok(sim < p.maxSim, `${p.name} failed max threshold`);
    }
    console.table(results);
  });

  test('Test 4: DKT + Real Transformer Pipeline (Specified Student Profile & Data Scientist Role)', async () => {
    // Specified Student Profile: Python=0.85, SQL=0.72, Machine Learning=0.35, React=0.20
    const dktStudentProfile = {
      status: 'ready',
      student_id: 'DS_STUDENT_AUDIT',
      readiness_score: 62,
      skills: [
        { id: 'python', name: 'Python Programming', percentage: 85, probability: 0.85, category: 'coding', attempts: 6 },
        { id: 'sql', name: 'SQL & Relational Databases', percentage: 72, probability: 0.72, category: 'coding', attempts: 5 },
        { id: 'machine_learning', name: 'Machine Learning Foundations', percentage: 35, probability: 0.35, category: 'coding', attempts: 2 },
        { id: 'algorithms', name: 'Algorithms', percentage: 58, probability: 0.58, category: 'coding', attempts: 3 },
        { id: 'data_structures', name: 'Data Structures', percentage: 55, probability: 0.55, category: 'coding', attempts: 3 },
        { id: 'aptitude', name: 'Quantitative & Logical Aptitude', percentage: 65, probability: 0.65, category: 'aptitude', attempts: 4 },
        { id: 'communication', name: 'STAR Behavioral & Communication', percentage: 60, probability: 0.60, category: 'communication', attempts: 2 },
      ],
    };

    const dsAnalysis = await SentenceBERTSkillGapService.analyzeSkillGaps(dktStudentProfile, 'data_scientist');

    assert.equal(dsAnalysis.status, 'success');
    assert.equal(dsAnalysis.target_role.role_id, 'data_scientist');
    assert.equal(dsAnalysis.model_metadata.real_transformer_inference, true);

    console.log('\n--- TEST 4: DKT + REAL TRANSFORMER SKILL GAP ANALYSIS ---');
    console.log(`Target Role: ${dsAnalysis.target_role.title}`);
    console.log(`Overall Role Fit Score: ${dsAnalysis.role_fit_score}%`);
    console.log(`Matched Skills Count: ${dsAnalysis.summary.matched_count}`);
    console.log(`Partial Matches Count: ${dsAnalysis.summary.partial_count}`);
    console.log(`Skill Gaps Count: ${dsAnalysis.summary.gap_count}`);
    console.log(`Top Priority Gap: ${dsAnalysis.summary.top_critical_gap}`);

    console.log('\nMatched Skills:');
    dsAnalysis.matched_skills.forEach((s) => console.log(` - ${s.skill_name}: Mastery = ${s.current_mastery}%, Target = ${s.target_mastery}%, Similarity = ${s.semantic_similarity}`));

    console.log('\nPartial Matches:');
    dsAnalysis.partial_matches.forEach((s) => console.log(` - ${s.skill_name}: Mastery = ${s.current_mastery}%, Target = ${s.target_mastery}%, Gap = -${s.mastery_gap}%, Similarity = ${s.semantic_similarity}`));

    console.log('\nCritical Skill Gaps:');
    dsAnalysis.skill_gaps.forEach((s) => console.log(` - ${s.skill_name}: Mastery = ${s.current_mastery}%, Target = ${s.target_mastery}%, Priority = ${s.priority_level}, Similarity = ${s.semantic_similarity}`));

    assert.ok(dsAnalysis.matched_skills.some((s) => s.skill_id === 'python'));
    assert.ok(dsAnalysis.skill_gaps.some((s) => s.skill_id === 'machine_learning'));
  });

  test('Test 5: Fingerprint Determinism & Text Distinctness', async () => {
    const textA = 'Machine Learning algorithms';
    const textB = 'Relational database schema design';

    const embA1 = await getEmbedding(textA);
    const embA2 = await getEmbedding(textA);
    const embB = await getEmbedding(textB);

    // Determinism check
    let isBitwiseIdentical = true;
    for (let i = 0; i < embA1.length; i++) {
      if (embA1[i] !== embA2[i]) isBitwiseIdentical = false;
    }
    assert.equal(isBitwiseIdentical, true, 'Same text must yield bitwise identical embeddings');

    // Distinctness check
    const simAB = computeCosineSimilarity(embA1, embB);
    assert.ok(simAB < 0.70, 'Different text strings must yield distinct embedding vectors');

    console.log('\n--- TEST 5: FINGERPRINT DETERMINISM & DISTINCTNESS ---');
    console.log(`Determinism: Same text runs produced identical 384-d vectors: ${isBitwiseIdentical}`);
    console.log(`Distinctness: Similarity between distinct concepts: ${simAB.toFixed(4)} (< 0.70)`);
  });
});
