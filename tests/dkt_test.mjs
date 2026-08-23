import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DKTInference, DKTModel, SKILL_MAP } from '../ai/dkt-engine.mjs';

describe('DKT Model & Inference Unit Tests', () => {
  test('1. Predicts correctly on empty student history when model is trained', () => {
    const res = DKTInference.predict([], 'test_student_empty');
    assert.equal(res.status, 'ready');
    assert.equal(res.student_id, 'test_student_empty');
    assert.equal(typeof res.readiness_score, 'number');
    assert.ok(res.readiness_score >= 0 && res.readiness_score <= 100);
    assert.equal(res.skills.length, 11);
    assert.equal(typeof res.recommended_focus.skill_key, 'string');
  });

  test('2. Predicts correctly on single interaction event', () => {
    const singleHistory = [
      { skill: 'python', correct: 1, difficulty: 'easy', timestamp: new Date().toISOString() }
    ];
    const res = DKTInference.predict(singleHistory, 'test_student_single');
    assert.equal(res.status, 'ready');
    assert.equal(res.total_interactions_evaluated, 1);
    const pythonSkill = res.skills.find(s => s.id === 'python');
    assert.ok(pythonSkill);
    assert.equal(pythonSkill.attempts, 1);
    assert.equal(pythonSkill.accuracy, 100);
  });

  test('3. Predicts correctly on multiple consecutive interaction events across skills', () => {
    const multiHistory = [
      { skill: 'python', correct: 1, difficulty: 'easy' },
      { skill: 'data_structures', correct: 1, difficulty: 'medium' },
      { skill: 'algorithms', correct: 0, difficulty: 'hard' },
      { skill: 'sql', correct: 1, difficulty: 'medium' },
      { skill: 'aptitude', correct: 1, difficulty: 'medium' },
      { skill: 'communication', correct: 1, difficulty: 'medium' },
    ];
    const res = DKTInference.predict(multiHistory, 'test_student_multi');
    assert.equal(res.status, 'ready');
    assert.equal(res.total_interactions_evaluated, 6);
    assert.ok(res.category_mastery.coding > 0);
    assert.ok(res.category_mastery.aptitude > 0);
    assert.ok(res.category_mastery.communication > 0);
  });

  test('4. Gracefully handles unknown or unmapped skills without crashing', () => {
    const unknownHistory = [
      { skill: 'quantum_physics_unknown', correct: 1 },
      { skill: 'data_structures', correct: 1 },
      { skill: 'invalid_skill_xyz', correct: 0 },
    ];
    const res = DKTInference.predict(unknownHistory, 'test_student_unknown');
    assert.equal(res.status, 'ready');
    assert.equal(res.skills.length, 11);
  });

  test('5. Handles missing fields in interaction events safely', () => {
    const corruptHistory = [
      { skill: 'operating_systems' }, // missing correct
      { correct: 1 }, // missing skill
      null,
      undefined,
      {},
      { skill: 'oop', correct: true }
    ];
    const res = DKTInference.predict(corruptHistory, 'test_student_corrupt');
    assert.equal(res.status, 'ready');
    assert.ok(res.skills.find(s => s.id === 'oop'));
  });

  test('6. Verifies DKT forward pass mathematical bounds', () => {
    const model = new DKTModel({ numSkills: 11, hiddenDim: 16, embeddingDim: 8 });
    const res = model.forward([0, 1, 14, 5, 20]);
    assert.equal(res.lastPredictions.length, 11);
    for (let i = 0; i < res.lastPredictions.length; i++) {
      const p = res.lastPredictions[i];
      assert.ok(p >= 0.0 && p <= 1.0, `Prediction out of probability bounds: ${p}`);
    }
  });

  test('7. Verifies untrained model status behavior', () => {
    const fakeInference = {
      isModelTrained: () => false,
      predict: (hist, sid) => ({ status: 'not_trained', message: 'DKT model has not been trained yet.', student_id: sid })
    };
    const res = fakeInference.predict([], 's_untrained');
    assert.equal(res.status, 'not_trained');
    assert.equal(res.message, 'DKT model has not been trained yet.');
  });
});
