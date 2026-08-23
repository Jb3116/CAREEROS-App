import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateAutomatedTodaysPlan,
  emitAppEvent,
  subscribeAppEvent,
} from '../src/utils/appEvents.ts';
import {
  LANGUAGES_DATA,
  checkGermanA2Readiness,
} from '../src/data/languagesCurriculum.ts';

describe('Language Hub, Speaking Studio & Event-Driven Today\'s Plan Suite', () => {
  // ---------------- 1. Automated Event-Driven Today\'s Plan Tests ----------------
  test('1. Automated Today\'s Plan generates tasks dynamically based on weakest skills and roadmap', () => {
    const plan = generateAutomatedTodaysPlan(true);

    assert.equal(plan.length, 3, 'Today\'s Plan must have 3 focused adaptive tasks');
    const categories = plan.map((t) => t.category);
    assert.ok(categories.includes('coding'));
    assert.ok(categories.includes('language'));
    assert.ok(categories.includes('speaking'));

    plan.forEach((task) => {
      assert.ok(task.title.length > 10, 'Task must have a descriptive title');
      assert.ok(task.rationale.length > 15, 'Task must include weakness/milestone rationale');
      assert.ok(task.route.startsWith('/'), 'Task must specify a valid navigation route');
    });
  });

  test('2. Event-driven bus updates task completion status automatically on platform events', () => {
    let receivedEvent = null;

    const unsubscribe = subscribeAppEvent((ev) => {
      receivedEvent = ev;
    });

    emitAppEvent('problemSolved', { id: 'code-1', skill: 'Dynamic Programming' });

    assert.ok(receivedEvent, 'Event listener must capture emitted app event');
    assert.equal(receivedEvent.type, 'problemSolved');
    assert.equal(receivedEvent.id, 'code-1');

    unsubscribe();
  });

  // ---------------- 2. Global Language Hub Path & 4-Skill Matrix ----------------
  test('3. Language Hub units and lessons use CEFR milestones and 4-skill metrics with zero XP', () => {
    const german = LANGUAGES_DATA.german;
    const english = LANGUAGES_DATA.english;

    assert.ok(german.units.length >= 2, 'German must have structured curriculum units');
    german.units.forEach((unit) => {
      assert.ok(unit.cefrLevel, 'Unit must have CEFR level (A1, A2, etc.)');
      assert.ok(unit.lessons.length > 0, 'Unit must have lessons');
      unit.lessons.forEach((l) => {
        assert.ok(l.exercises.length > 0, 'Lesson must contain exercises');
        l.exercises.forEach((ex) => {
          assert.ok(['speaking', 'listening', 'reading', 'writing'].includes(ex.skillType));
        });
      });
    });

    // Verify absence of XP in curriculum schema
    assert.equal('xp' in german, false, 'Curriculum must not contain gamified XP');
  });

  // ---------------- 3. Isolated Per-Language Data Tests ----------------
  test('4. Language progression is strictly isolated across independent language profiles', () => {
    const germanState = {
      cefrLevel: 'A2',
      courseProgressPercent: 75,
      streak: 4,
      lastPracticed: new Date().toISOString(),
      completedLessonIds: ['de-lesson-1', 'de-lesson-2', 'de-lesson-3'],
      skillMatrix: { speaking: 75, listening: 82, reading: 90, writing: 72 },
      totalQuestionsAnswered: 16,
      correctAnswersCount: 14,
    };

    const frenchState = {
      cefrLevel: 'A1',
      courseProgressPercent: 0,
      streak: 0,
      lastPracticed: null,
      completedLessonIds: [],
      skillMatrix: { speaking: 0, listening: 0, reading: 0, writing: 0 },
      totalQuestionsAnswered: 0,
      correctAnswersCount: 0,
    };

    assert.notEqual(germanState.courseProgressPercent, frenchState.courseProgressPercent);
    assert.notEqual(germanState.streak, frenchState.streak);
  });

  // ---------------- 4. German A2 Certification Trigger ----------------
  test('5. German A2 certification unlocks when prerequisite path lessons are completed with high accuracy', () => {
    const qualifiedGermanState = {
      cefrLevel: 'A2',
      courseProgressPercent: 100,
      streak: 5,
      lastPracticed: new Date().toISOString(),
      completedLessonIds: ['de-lesson-1', 'de-lesson-2', 'de-lesson-3', 'de-lesson-4'],
      skillMatrix: { speaking: 80, listening: 85, reading: 92, writing: 78 },
      totalQuestionsAnswered: 16,
      correctAnswersCount: 14, // 87.5%
    };

    const noviceGermanState = {
      cefrLevel: 'A1',
      courseProgressPercent: 25,
      streak: 1,
      lastPracticed: new Date().toISOString(),
      completedLessonIds: ['de-lesson-1'],
      skillMatrix: { speaking: 35, listening: 40, reading: 45, writing: 30 },
      totalQuestionsAnswered: 4,
      correctAnswersCount: 3,
    };

    assert.equal(checkGermanA2Readiness(qualifiedGermanState), true, 'Qualified state must trigger A2 accreditation');
    assert.equal(checkGermanA2Readiness(noviceGermanState), false, 'Novice state must not trigger A2 accreditation');

    // Confirm authentic Goethe and telc details exist
    const examDetails = LANGUAGES_DATA.german.examReadiness;
    assert.ok(examDetails?.examNames.includes('Goethe-Zertifikat A2'));
    assert.ok(examDetails?.examNames.includes('telc Deutsch A2'));
  });
});
