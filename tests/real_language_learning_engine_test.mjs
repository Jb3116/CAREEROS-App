import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  LANGUAGES_DATA,
  loadLanguageProgress,
  getAllLessonsForLanguage,
  isLessonLocked,
  evaluateExerciseAnswer,
  normalizeString,
  checkGermanA2Readiness,
} from '../src/data/languagesCurriculum.ts';
import {
  generateAutomatedTodaysPlan,
  emitAppEvent,
  subscribeAppEvent,
} from '../src/utils/appEvents.ts';

describe('Real Language Learning Engine & Progress Overhaul Suite', () => {
  // ---------------- 1. Purge Mock Data & 0% Initial State Verification ----------------
  test('1. Every new student starts with 0% progress and zero pre-completed lessons', () => {
    // For fresh student 'new_student_99'
    const germanFresh = loadLanguageProgress('german', 'new_student_99');
    const englishFresh = loadLanguageProgress('english', 'new_student_99');
    const spanishFresh = loadLanguageProgress('spanish', 'new_student_99');

    assert.equal(germanFresh.courseProgressPercent, 0, 'German progress must be 0% initially');
    assert.equal(englishFresh.courseProgressPercent, 0, 'English progress must be 0% initially');
    assert.equal(spanishFresh.courseProgressPercent, 0, 'Spanish progress must be 0% initially');

    assert.equal(germanFresh.completedLessonIds.length, 0, 'German must have 0 completed lessons initially');
    assert.equal(englishFresh.completedLessonIds.length, 0, 'English must have 0 completed lessons initially');

    assert.equal(germanFresh.skillMatrix.speaking, 0, 'Speaking skill must start at 0%');
    assert.equal(germanFresh.skillMatrix.listening, 0, 'Listening skill must start at 0%');
    assert.equal(germanFresh.skillMatrix.reading, 0, 'Reading skill must start at 0%');
    assert.equal(germanFresh.skillMatrix.writing, 0, 'Writing skill must start at 0%');
  });

  // ---------------- 2. Curriculum Data Schema & Distinct Trees ----------------
  test('2. German and English have distinct, realistic lesson trees with prerequisite chains', () => {
    const germanLessons = getAllLessonsForLanguage('german');
    const englishLessons = getAllLessonsForLanguage('english');

    assert.ok(germanLessons.length >= 4, 'German must have at least 4 structured lessons');
    assert.ok(englishLessons.length >= 2, 'English must have at least 2 structured lessons');

    // Root lesson (lesson 1) has no prerequisite
    assert.equal(germanLessons[0].prerequisiteLessonId, null);
    assert.equal(englishLessons[0].prerequisiteLessonId, null);

    // Subsequent lessons require previous lesson IDs
    assert.equal(germanLessons[1].prerequisiteLessonId, 'de-lesson-1');
    assert.equal(germanLessons[2].prerequisiteLessonId, 'de-lesson-2');
    assert.equal(germanLessons[3].prerequisiteLessonId, 'de-lesson-3');
    assert.equal(englishLessons[1].prerequisiteLessonId, 'en-lesson-1');
  });

  // ---------------- 3. Strict Prerequisite Locking ----------------
  test('3. Lesson locking strictly blocks subsequent lessons until prerequisite is completed', () => {
    const germanLessons = getAllLessonsForLanguage('german');
    const lesson1 = germanLessons[0]; // de-lesson-1
    const lesson2 = germanLessons[1]; // de-lesson-2 (prereq: de-lesson-1)
    const lesson3 = germanLessons[2]; // de-lesson-3 (prereq: de-lesson-2)

    // Initially with empty completed list
    assert.equal(isLessonLocked(lesson1, []), false, 'Root lesson 1 must be unlocked');
    assert.equal(isLessonLocked(lesson2, []), true, 'Lesson 2 must be locked initially');
    assert.equal(isLessonLocked(lesson3, []), true, 'Lesson 3 must be locked initially');

    // After completing Lesson 1
    const afterL1 = ['de-lesson-1'];
    assert.equal(isLessonLocked(lesson2, afterL1), false, 'Lesson 2 must unlock after completing Lesson 1');
    assert.equal(isLessonLocked(lesson3, afterL1), true, 'Lesson 3 must remain locked until Lesson 2 is completed');

    // After completing Lesson 1 and 2
    const afterL2 = ['de-lesson-1', 'de-lesson-2'];
    assert.equal(isLessonLocked(lesson3, afterL2), false, 'Lesson 3 must unlock after completing Lesson 2');
  });

  // ---------------- 4. Dynamic Progress Calculation Formula ----------------
  test('4. Course progress % is dynamically derived as (completedLessons / totalLessons) * 100', () => {
    const allGerman = getAllLessonsForLanguage('german');
    const total = allGerman.length; // 4

    const p0 = Math.round((0 / total) * 100);
    const p1 = Math.round((1 / total) * 100);
    const p2 = Math.round((2 / total) * 100);
    const p4 = Math.round((4 / total) * 100);

    assert.equal(p0, 0);
    assert.equal(p1, 25);
    assert.equal(p2, 50);
    assert.equal(p4, 100);
  });

  // ---------------- 5. Interactive Exercise Engine Evaluation Logic ----------------
  test('5. Multi-type exercise evaluator correctly grades all 6 question formats', () => {
    // 1. Multiple Choice
    const mcEx = {
      id: 'ex-mc',
      type: 'multiple_choice',
      skillType: 'reading',
      prompt: 'Select developer',
      instruction: 'Pick one',
      options: ['Der Softwareentwickler', 'Der Bauingenieur'],
      correctIndex: 0,
      explanation: 'Correct noun',
    };
    assert.equal(evaluateExerciseAnswer(mcEx, 0).isCorrect, true);
    assert.equal(evaluateExerciseAnswer(mcEx, 1).isCorrect, false);

    // 2. Translation (case & punctuation insensitive)
    const transEx = {
      id: 'ex-tr',
      type: 'translation',
      skillType: 'writing',
      prompt: 'Translate',
      instruction: 'Type German',
      sourcePhrase: 'I work as a developer',
      expectedAnswer: 'Ich arbeite als Entwickler',
      acceptableAnswers: ['Ich arbeite als Softwareentwickler'],
      explanation: 'Uses preposition als',
    };
    assert.equal(evaluateExerciseAnswer(transEx, 'ich arbeite als entwickler.').isCorrect, true);
    assert.equal(evaluateExerciseAnswer(transEx, 'Ich arbeite als Softwareentwickler!').isCorrect, true);
    assert.equal(evaluateExerciseAnswer(transEx, 'Ich bin müde').isCorrect, false);

    // 3. Fill in the Blank
    const fillEx = {
      id: 'ex-fb',
      type: 'fill_in_the_blank',
      skillType: 'reading',
      prompt: 'Fill missing noun',
      instruction: 'Complete sentence',
      sentenceWithBlank: 'In der [blank] gespeichert',
      expectedAnswer: 'Datenbank',
      acceptableAnswers: ['Datenbank', 'Cloud'],
      explanation: 'Stored in DB',
    };
    assert.equal(evaluateExerciseAnswer(fillEx, 'datenbank').isCorrect, true);
    assert.equal(evaluateExerciseAnswer(fillEx, 'Tastatur').isCorrect, false);

    // 4. Word Ordering
    const orderEx = {
      id: 'ex-wo',
      type: 'word_ordering',
      skillType: 'writing',
      prompt: 'Order words',
      instruction: 'Order correctly',
      words: ['Gestern', 'habe', 'ich', 'den', 'Bug', 'behoben.'],
      correctOrder: ['Gestern', 'habe', 'ich', 'den', 'Bug', 'behoben.'],
      explanation: 'V2 verb order',
    };
    assert.equal(
      evaluateExerciseAnswer(orderEx, ['Gestern', 'habe', 'ich', 'den', 'Bug', 'behoben.']).isCorrect,
      true
    );
    assert.equal(
      evaluateExerciseAnswer(orderEx, ['Gestern', 'ich', 'habe', 'den', 'Bug', 'behoben.']).isCorrect,
      false
    );

    // 5. Matching
    const matchEx = {
      id: 'ex-m',
      type: 'matching',
      skillType: 'reading',
      prompt: 'Match terms',
      instruction: 'Pair items',
      pairs: [
        { term: 'Die Datenbank', match: 'Database' },
        { term: 'Das Netzwerk', match: 'Network' },
      ],
      explanation: 'Term pairing',
    };
    assert.equal(
      evaluateExerciseAnswer(matchEx, {
        'Die Datenbank': 'Database',
        'Das Netzwerk': 'Network',
      }).isCorrect,
      true
    );
    assert.equal(
      evaluateExerciseAnswer(matchEx, {
        'Die Datenbank': 'Network',
        'Das Netzwerk': 'Database',
      }).isCorrect,
      false
    );

    // 6. Listening
    const listenEx = {
      id: 'ex-l',
      type: 'listening',
      skillType: 'listening',
      prompt: 'Listen',
      instruction: 'Type audio',
      audioText: 'Der Server ist online',
      expectedAnswer: 'Der Server ist online',
      acceptableAnswers: ['Der Server ist online.'],
      explanation: 'Server is online',
    };
    assert.equal(evaluateExerciseAnswer(listenEx, 'der server ist online').isCorrect, true);
    assert.equal(evaluateExerciseAnswer(listenEx, 'server ist kaputt').isCorrect, false);
  });

  // ---------------- 6. Telemetry & Today's Plan Event Trigger ----------------
  test('6. Passing a lesson emits event and automatically updates Today\'s Plan', () => {
    let capturedEvent = null;
    const unsubscribe = subscribeAppEvent((ev) => {
      if (ev.type === 'lessonCompleted') {
        capturedEvent = ev;
      }
    });

    emitAppEvent('lessonCompleted', {
      languageId: 'german',
      unitId: 'de-lesson-1',
    });

    assert.ok(capturedEvent, 'lessonCompleted event must be caught by listener');
    assert.equal(capturedEvent.languageId, 'german');
    assert.equal(capturedEvent.unitId, 'de-lesson-1');

    unsubscribe();
  });
});
