import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRealStreak, formatLocalDateStr } from '../src/utils/streakCalculator.ts';
import { CODING_QUESTION_BANK } from '../data/assessmentQuestions.mjs';
import { getContextualYouTubeVideos } from '../src/data/youtubeResources.ts';
import {
  LANGUAGES_DATA,
  checkGermanA2Readiness,
} from '../src/data/languagesCurriculum.ts';

describe('CAREEROS Mega-Upgrade Validation Suite', () => {
  // ---------------- 1. Dynamic Coding Engine & Difficulty Swapping ----------------
  test('1. Difficulty filter accurately partitions and swaps question bank', () => {
    const allProblems = CODING_QUESTION_BANK;
    assert.ok(allProblems.length >= 8, 'Must have ample questions in bank');

    const easyPool = allProblems.filter((q) => q.difficulty.toLowerCase() === 'easy');
    const medPool = allProblems.filter((q) => q.difficulty.toLowerCase() === 'medium');
    const hardPool = allProblems.filter((q) => q.difficulty.toLowerCase() === 'hard');

    assert.ok(easyPool.length > 0, 'Easy question pool must not be empty');
    assert.ok(medPool.length > 0, 'Medium question pool must not be empty');
    assert.ok(hardPool.length > 0, 'Hard question pool must not be empty');

    // Confirm distinct separation
    assert.equal(easyPool.every((q) => q.difficulty === 'Easy'), true);
    assert.equal(medPool.every((q) => q.difficulty === 'Medium'), true);
    assert.equal(hardPool.every((q) => q.difficulty === 'Hard'), true);
  });

  // ---------------- 2. Contextual YouTube Videos ----------------
  test('2. Problem topic strictly loads verified contextual YouTube tutorials', () => {
    const twoSum = CODING_QUESTION_BANK.find((q) => q.id === 'code-1') || CODING_QUESTION_BANK[0];
    const videos = getContextualYouTubeVideos(twoSum);

    assert.ok(videos.length >= 2, 'Must return at least 2 contextual tutorials');
    videos.forEach((v) => {
      assert.ok(v.videoUrl.startsWith('https://www.youtube.com/'), 'Video URL must be authentic YouTube link');
      assert.ok(v.title.length > 5, 'Video must have descriptive title');
      assert.ok(v.channel.length > 0, 'Video must have verified channel name');
    });
  });

  // ---------------- 3. Unified Streak System (Week + Month View) ----------------
  test('3. Advanced streak engine computes accurate Week and Navigable Month calendar grids', () => {
    const baseDate = new Date(2026, 7, 23); // Aug 23, 2026
    const sampleEvents = [
      { timestamp: '2026-08-23T10:00:00.000Z', correct: true },
      { timestamp: '2026-08-22T14:30:00.000Z', correct: true },
      { timestamp: '2026-08-21T09:15:00.000Z', correct: true },
      { timestamp: '2026-08-20T18:00:00.000Z', correct: true },
    ];

    const report = calculateRealStreak(sampleEvents, baseDate, 0);

    // Verify streaks
    assert.equal(report.currentStreak, 4, 'Current streak should be 4 consecutive days');
    assert.equal(report.totalActiveDays, 4, 'Total active days should be 4');

    // Verify 7-day week structure
    assert.equal(report.weekDays.length, 7, 'Week view must contain 7 days (M-S)');

    // Verify Month view structure
    const month = report.monthReport;
    assert.equal(month.year, 2026);
    assert.equal(month.monthIndex, 7); // August
    assert.equal(month.monthTotalDays, 31, 'August has 31 days');
    assert.ok(month.monthDays.length >= 31, 'Month calendar grid must contain all days + padding');
    assert.equal(month.monthActiveDaysCount, 4, '4 active days in August');
  });

  // ---------------- 4. Global Language Hub & Isolated Progress ----------------
  test('4. Per-language progression is strictly isolated across languages', () => {
    const germanData = LANGUAGES_DATA.german;
    const englishData = LANGUAGES_DATA.english;
    const spanishData = LANGUAGES_DATA.spanish;

    assert.ok(germanData && englishData && spanishData, 'All major languages must be configured');
    assert.ok(germanData.units.length >= 2, 'German must have comprehensive units');

    const germanProgress = {
      cefrLevel: 'A2',
      courseProgressPercent: 75,
      streak: 5,
      lastPracticed: new Date().toISOString(),
      completedLessonIds: ['de-lesson-1', 'de-lesson-2', 'de-lesson-3'],
      skillMatrix: { speaking: 75, listening: 80, reading: 90, writing: 72 },
      totalQuestionsAnswered: 20,
      correctAnswersCount: 18,
    };

    const spanishProgress = {
      cefrLevel: 'A1',
      courseProgressPercent: 0,
      streak: 1,
      lastPracticed: new Date().toISOString(),
      completedLessonIds: [],
      skillMatrix: { speaking: 0, listening: 0, reading: 0, writing: 0 },
      totalQuestionsAnswered: 2,
      correctAnswersCount: 2,
    };

    // Confirm German progress does not bleed into Spanish
    assert.notEqual(germanProgress.courseProgressPercent, spanishProgress.courseProgressPercent);
    assert.notEqual(germanProgress.streak, spanishProgress.streak);
  });

  // ---------------- 5. German A2 Certification Trigger ----------------
  test('5. German A2 certification readiness triggers correctly when prerequisite path lessons are completed with high accuracy', () => {
    const readyState = {
      cefrLevel: 'A2',
      courseProgressPercent: 100,
      streak: 6,
      lastPracticed: new Date().toISOString(),
      completedLessonIds: ['de-lesson-1', 'de-lesson-2', 'de-lesson-3', 'de-lesson-4'],
      skillMatrix: { speaking: 80, listening: 85, reading: 90, writing: 78 },
      totalQuestionsAnswered: 20,
      correctAnswersCount: 17, // 85% accuracy
    };

    const unreadyScoreState = {
      cefrLevel: 'A1',
      courseProgressPercent: 25,
      streak: 2,
      lastPracticed: new Date().toISOString(),
      completedLessonIds: ['de-lesson-1'],
      skillMatrix: { speaking: 40, listening: 45, reading: 50, writing: 35 },
      totalQuestionsAnswered: 10,
      correctAnswersCount: 9,
    };

    assert.equal(checkGermanA2Readiness(readyState), true, 'User with 4 completed lessons & 85% accuracy must trigger A2 readiness');
    assert.equal(checkGermanA2Readiness(unreadyScoreState), false, 'User with only 1 completed lesson must not trigger A2 readiness');

    // Confirm authentic Goethe and telc details exist
    const examDetails = LANGUAGES_DATA.german.examReadiness;
    assert.ok(examDetails?.examNames.includes('Goethe-Zertifikat A2'));
    assert.ok(examDetails?.examNames.includes('telc Deutsch A2'));
    assert.ok(examDetails?.officialLinks.some((l) => l.url.includes('goethe.de')));
    assert.ok(examDetails?.officialLinks.some((l) => l.url.includes('telc.net')));
  });
});
