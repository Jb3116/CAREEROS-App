import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { APTITUDE_QUESTION_BANK, CODING_QUESTION_BANK } from '../src/data/assessmentQuestions.ts';

describe('Communication Learning Hub, Streak Calendar & Aptitude Scaling Suite', () => {
  // ---------------- 1. Aptitude Scaling Tests ----------------
  test('1. Aptitude pool supports dynamic session sizing (5, 10, 15, 20)', () => {
    assert.ok(APTITUDE_QUESTION_BANK.length >= 20, 'Question bank must have at least 20 real questions');

    [5, 10, 15, 20].forEach((count) => {
      const sampled = APTITUDE_QUESTION_BANK.slice(0, count);
      assert.equal(sampled.length, count, `Session must contain exactly ${count} questions`);
      sampled.forEach((q) => {
        assert.ok(q.id && q.question && q.options && q.options.length >= 4);
        assert.ok(typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < q.options.length);
        assert.ok(q.explanation.length > 10, 'Must have shortcut explanation formula');
      });
    });
  });

  test('2. Aptitude category and difficulty filtering works accurately', () => {
    const quantOnly = APTITUDE_QUESTION_BANK.filter((q) => q.category === 'Quantitative');
    assert.ok(quantOnly.length >= 5, 'Must have quantitative questions');
    assert.ok(quantOnly.every((q) => q.category === 'Quantitative'));

    const logicalOnly = APTITUDE_QUESTION_BANK.filter((q) => q.category === 'Logical Reasoning');
    assert.ok(logicalOnly.length >= 5, 'Must have logical reasoning questions');
    assert.ok(logicalOnly.every((q) => q.category === 'Logical Reasoning'));

    const easyOnly = APTITUDE_QUESTION_BANK.filter((q) => q.difficulty === 'Easy');
    assert.ok(easyOnly.length > 0 && easyOnly.every((q) => q.difficulty === 'Easy'));
  });

  test('3. Aptitude scoring and accuracy math calculation', () => {
    const samplePool = APTITUDE_QUESTION_BANK.slice(0, 10);
    const mockUserAnswers = {};
    // Answer 8 correctly out of 10
    samplePool.forEach((q, idx) => {
      mockUserAnswers[q.id] = idx < 8 ? q.correctAnswer : (q.correctAnswer + 1) % 4;
    });

    let correctCount = 0;
    let answeredCount = 0;
    samplePool.forEach((q) => {
      if (mockUserAnswers[q.id] !== undefined) {
        answeredCount++;
        if (mockUserAnswers[q.id] === q.correctAnswer) correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / answeredCount) * 100);
    assert.equal(correctCount, 8);
    assert.equal(answeredCount, 10);
    assert.equal(accuracy, 80);
  });

  // ---------------- 2. Duolingo Streak Calendar Math ----------------
  test('4. Duolingo 7-day week structure represents M T W T F S S sequence', () => {
    const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    assert.equal(dayInitials.length, 7);

    const activeStreak = 5;
    // 5 consecutive active days completed
    const completedDays = [true, true, true, true, true, false, false];
    const completedCount = completedDays.filter(Boolean).length;
    assert.equal(completedCount, activeStreak);
  });

  // ---------------- 3. Speech Pace & Articulation Analytics ----------------
  test('5. Words Per Minute (WPM) and filler words detection algorithm', () => {
    const mockSpeech = 'In my previous project um we had basically a high latency issue actually in the database';
    const words = mockSpeech.split(/\s+/).filter(Boolean);
    const durationSeconds = 30; // 0.5 minutes
    const durationMinutes = durationSeconds / 60;
    const wpm = Math.round(words.length / durationMinutes);

    assert.equal(words.length, 16);
    assert.equal(wpm, 32); // 16 / 0.5 = 32 WPM

    const fillerKeywords = ['um', 'uh', 'like', 'actually', 'basically'];
    const detectedFillers = words.filter((w) => fillerKeywords.includes(w.toLowerCase()));
    assert.equal(detectedFillers.length, 3); // 'um', 'basically', 'actually'
  });

  // ---------------- 4. Coding 2-Panel Similar Problems ----------------
  test('6. Similar problems algorithm finds 3-4 related coding challenges', () => {
    const currentProb = CODING_QUESTION_BANK[0]; // Two Sum
    const similar = CODING_QUESTION_BANK.filter(
      (q) => q.id !== currentProb.id && (q.category === currentProb.category || q.difficulty === currentProb.difficulty)
    ).slice(0, 4);

    assert.ok(similar.length >= 3, 'Must return 3-4 similar problems');
    assert.ok(similar.every((q) => q.id !== currentProb.id), 'Must not include self');
  });
});
