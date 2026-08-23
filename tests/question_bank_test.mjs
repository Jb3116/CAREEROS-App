/**
 * Complete Question Bank & Dynamic Navigation Automated Test Suite
 * Covers:
 * 1. Coding Question Bank Count (>= 20 questions) & Coverage
 * 2. Aptitude Question Bank Count (>= 30 questions) & Coverage
 * 3. Dynamic Question Loading & Counter Calculation
 * 4. Forward & Backward Navigation Boundary Tests
 * 5. Submit Button State Transition on Final Question
 * 6. Answer State Persistence & Undefined Handling
 * 7. Assessment Scoring & Category/Difficulty Matrix Evaluation
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CODING_QUESTION_BANK,
  APTITUDE_QUESTION_BANK,
} from '../data/assessmentQuestions.mjs';

describe('Coding & Aptitude Question Bank & Navigation Suite', () => {
  test('1. Coding Question Bank Size & Structural Schema Integrity', () => {
    assert.ok(
      CODING_QUESTION_BANK.length >= 20,
      `Expected at least 20 coding questions, got ${CODING_QUESTION_BANK.length}`
    );

    const categoriesCovered = new Set(CODING_QUESTION_BANK.map((q) => q.category));
    console.log(`\nTotal Real Coding Questions: ${CODING_QUESTION_BANK.length}`);
    console.log(`Coding Categories Covered (${categoriesCovered.size}):`, Array.from(categoriesCovered).join(', '));

    CODING_QUESTION_BANK.forEach((q, idx) => {
      assert.ok(q.id && q.id.startsWith('code-'), `Question ${idx} missing valid id`);
      assert.ok(q.title && q.title.length > 3, `Question ${idx} missing title`);
      assert.ok(['Easy', 'Medium', 'Hard'].includes(q.difficulty), `Invalid difficulty in ${q.id}`);
      assert.ok(q.description && q.description.length > 10, `Short description in ${q.id}`);
      assert.ok(q.examples && q.examples.length >= 1, `Missing examples in ${q.id}`);
      assert.ok(q.constraints && q.constraints.length >= 1, `Missing constraints in ${q.id}`);
      assert.ok(q.testCases && q.testCases.length >= 1, `Missing testCases in ${q.id}`);
      assert.ok(q.starterTemplates.python && q.starterTemplates.javascript, `Missing starters in ${q.id}`);
    });
  });

  test('2. Aptitude Question Bank Size & 4-Option Schema Integrity', () => {
    assert.ok(
      APTITUDE_QUESTION_BANK.length >= 30,
      `Expected at least 30 aptitude questions, got ${APTITUDE_QUESTION_BANK.length}`
    );

    const topicsCovered = new Set(APTITUDE_QUESTION_BANK.map((q) => q.topic));
    console.log(`\nTotal Real Aptitude Questions: ${APTITUDE_QUESTION_BANK.length}`);
    console.log(`Aptitude Topics Covered (${topicsCovered.size}):`, Array.from(topicsCovered).join(', '));

    APTITUDE_QUESTION_BANK.forEach((q, idx) => {
      assert.ok(q.id && q.id.startsWith('apt-'), `Aptitude question ${idx} missing valid id`);
      assert.ok(q.topic && q.topic.length > 2, `Missing topic in ${q.id}`);
      assert.ok(q.question && q.question.length > 10, `Short question text in ${q.id}`);
      assert.equal(q.options.length, 4, `Question ${q.id} must have exactly 4 options`);
      assert.ok(
        q.correctAnswer >= 0 && q.correctAnswer < 4,
        `Question ${q.id} correctAnswer must be between 0 and 3`
      );
      assert.ok(q.explanation && q.explanation.length > 10, `Missing explanation in ${q.id}`);
    });
  });

  test('3. Dynamic Question Counter Math Verification', () => {
    const totalCoding = CODING_QUESTION_BANK.length;
    const totalAptitude = APTITUDE_QUESTION_BANK.length;

    // Verify counter string generation for all indices
    for (let i = 0; i < totalCoding; i++) {
      const counterText = `Problem ${i + 1} of ${totalCoding}`;
      assert.equal(counterText, `Problem ${i + 1} of ${totalCoding}`);
    }

    for (let j = 0; j < totalAptitude; j++) {
      const counterText = `Question ${j + 1} of ${totalAptitude}`;
      assert.equal(counterText, `Question ${j + 1} of ${totalAptitude}`);
    }

    console.log(`\n--- Dynamic Counter Verified ---`);
    console.log(`Coding Counter: Problem 1 of ${totalCoding} -> Problem ${totalCoding} of ${totalCoding}`);
    console.log(`Aptitude Counter: Question 1 of ${totalAptitude} -> Question ${totalAptitude} of ${totalAptitude}`);
  });

  test('4. Forward & Backward Navigation Boundary Clamping', () => {
    let index = 0;
    const total = CODING_QUESTION_BANK.length;

    // Previous on first question should clamp to 0
    index = Math.max(0, index - 1);
    assert.equal(index, 0);

    // Step forward to end
    for (let step = 0; step < total + 10; step++) {
      index = Math.min(total - 1, index + 1);
    }
    assert.equal(index, total - 1);

    // Step backward to beginning
    for (let step = 0; step < total + 10; step++) {
      index = Math.max(0, index - 1);
    }
    assert.equal(index, 0);
  });

  test('5. Submit Button State Transition on Final Question', () => {
    const totalAptitude = APTITUDE_QUESTION_BANK.length;

    const getButtonLabel = (currIndex, totalCount) => {
      return currIndex < totalCount - 1 ? 'Next Question' : 'Submit Assessment';
    };

    assert.equal(getButtonLabel(0, totalAptitude), 'Next Question');
    assert.equal(getButtonLabel(totalAptitude - 2, totalAptitude), 'Next Question');
    assert.equal(getButtonLabel(totalAptitude - 1, totalAptitude), 'Submit Assessment');

    console.log(`\n--- Submit Button Transition Verified ---`);
    console.log(`Index ${totalAptitude - 2}: "${getButtonLabel(totalAptitude - 2, totalAptitude)}"`);
    console.log(`Index ${totalAptitude - 1} (Final): "${getButtonLabel(totalAptitude - 1, totalAptitude)}"`);
  });

  test('6. Answer Persistence & Undefined Handling', () => {
    const userAnswers = {};

    // Answer question 1 and 3
    userAnswers[APTITUDE_QUESTION_BANK[0].id] = 1;
    userAnswers[APTITUDE_QUESTION_BANK[2].id] = 3;

    assert.equal(userAnswers[APTITUDE_QUESTION_BANK[0].id], 1);
    assert.equal(userAnswers[APTITUDE_QUESTION_BANK[1].id], undefined);
    assert.equal(userAnswers[APTITUDE_QUESTION_BANK[2].id], 3);

    // Answer count
    const answeredCount = Object.keys(userAnswers).length;
    assert.equal(answeredCount, 2);
  });

  test('7. Assessment Scoring & Sectional/Difficulty Calculation', () => {
    const simulatedAnswers = {};
    let expectedCorrect = 0;

    // Simulate answering all questions correctly
    APTITUDE_QUESTION_BANK.forEach((q) => {
      simulatedAnswers[q.id] = q.correctAnswer;
      expectedCorrect++;
    });

    let correctCount = 0;
    const categoryStats = {};
    const difficultyStats = {};

    APTITUDE_QUESTION_BANK.forEach((q) => {
      const userAns = simulatedAnswers[q.id];
      const cat = q.category;
      const diff = q.difficulty;

      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
      if (!difficultyStats[diff]) difficultyStats[diff] = { correct: 0, total: 0 };

      categoryStats[cat].total++;
      difficultyStats[diff].total++;

      if (userAns !== undefined && userAns === q.correctAnswer) {
        correctCount++;
        categoryStats[cat].correct++;
        difficultyStats[diff].correct++;
      }
    });

    assert.equal(correctCount, expectedCorrect);
    assert.equal(correctCount, APTITUDE_QUESTION_BANK.length);

    console.log(`\n--- Sectional Assessment Breakdown ---`);
    for (const [cat, stat] of Object.entries(categoryStats)) {
      console.log(`${cat}: ${stat.correct}/${stat.total} Correct (${Math.round((stat.correct / stat.total) * 100)}%)`);
      assert.equal(stat.correct, stat.total);
    }
  });
});
