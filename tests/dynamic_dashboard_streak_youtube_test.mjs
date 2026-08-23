import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateRealStreak, getTimeBasedGreeting } from '../src/utils/streakCalculator.ts';
import { getContextualYouTubeVideos, YOUTUBE_RESOURCES_DB } from '../src/data/youtubeResources.ts';
import { CODING_QUESTION_BANK } from '../src/data/assessmentQuestions.ts';

describe('Dynamic Dashboard Greeting, Real Streak & YouTube Integration Suite', () => {
  // ---------------- 1. Time-Based Greeting Tests ----------------
  test('1. Time-based greeting accurately reflects local time of day', () => {
    // 08:30 AM -> Good Morning
    const morningDate = new Date(2026, 7, 23, 8, 30, 0);
    const morningRes = getTimeBasedGreeting('Alex Chen', morningDate);
    assert.equal(morningRes.greeting, 'Good Morning, Alex 👋');
    assert.equal(morningRes.period, 'morning');

    // 14:15 -> Good Afternoon
    const afternoonDate = new Date(2026, 7, 23, 14, 15, 0);
    const afternoonRes = getTimeBasedGreeting('Sarah Connor', afternoonDate);
    assert.equal(afternoonRes.greeting, 'Good Afternoon, Sarah 👋');
    assert.equal(afternoonRes.period, 'afternoon');

    // 19:45 -> Good Evening
    const eveningDate = new Date(2026, 7, 23, 19, 45, 0);
    const eveningRes = getTimeBasedGreeting('Rahul Sharma', eveningDate);
    assert.equal(eveningRes.greeting, 'Good Evening, Rahul 👋');
    assert.equal(eveningRes.period, 'evening');

    // 23:30 -> Good Night
    const nightDate = new Date(2026, 7, 23, 23, 30, 0);
    const nightRes = getTimeBasedGreeting('Priya', nightDate);
    assert.equal(nightRes.greeting, 'Good Night, Priya 👋');
    assert.equal(nightRes.period, 'night');

    // Fallback when name is omitted
    const fallbackRes = getTimeBasedGreeting(undefined, morningDate);
    assert.equal(fallbackRes.greeting, 'Good Morning, Champ 👋');
  });

  // ---------------- 2. Real Streak Boundary & Event Ledger Tests ----------------
  test('2. Streak calculation accurately computes consecutive active days leading to today', () => {
    const refDate = new Date(2026, 7, 23, 12, 0, 0); // Aug 23, 2026

    // Events on Aug 23, Aug 22, Aug 21, Aug 20, Aug 19 (5 consecutive days)
    const events = [
      { timestamp: '2026-08-23T08:00:00Z', activity: 'code_practice' },
      { timestamp: '2026-08-22T14:30:00Z', activity: 'assessment' },
      { timestamp: '2026-08-21T18:15:00Z', activity: 'code_practice' },
      { timestamp: '2026-08-20T10:00:00Z', activity: 'aptitude' },
      { timestamp: '2026-08-19T09:00:00Z', activity: 'code_practice' },
    ];

    const report = calculateRealStreak(events, refDate);
    assert.equal(report.currentStreak, 5);
    assert.equal(report.longestStreak, 5);
    assert.equal(report.isActiveToday, true);
    assert.equal(report.totalActiveDays, 5);
  });

  test('3. Streak is preserved when yesterday had activity but today is not yet done', () => {
    const refDate = new Date(2026, 7, 23, 10, 0, 0); // Aug 23, 2026

    // Events on Aug 22, Aug 21, Aug 20 (no activity on Aug 23 yet)
    const events = [
      { timestamp: '2026-08-22T14:30:00Z', activity: 'assessment' },
      { timestamp: '2026-08-21T18:15:00Z', activity: 'code_practice' },
      { timestamp: '2026-08-20T10:00:00Z', activity: 'aptitude' },
    ];

    const report = calculateRealStreak(events, refDate);
    assert.equal(report.currentStreak, 3, 'Streak must stay active waiting for today');
    assert.equal(report.isActiveToday, false);
  });

  test('4. Streak resets to 0 when missed days exceed threshold', () => {
    const refDate = new Date(2026, 7, 23, 10, 0, 0); // Aug 23, 2026

    // Last event was Aug 20 (missed Aug 21 and Aug 22)
    const events = [
      { timestamp: '2026-08-20T10:00:00Z', activity: 'aptitude' },
      { timestamp: '2026-08-19T09:00:00Z', activity: 'code_practice' },
      { timestamp: '2026-08-18T09:00:00Z', activity: 'code_practice' },
    ];

    const report = calculateRealStreak(events, refDate);
    assert.equal(report.currentStreak, 0, 'Current streak must reset to 0 upon missed days');
    assert.equal(report.longestStreak, 3, 'Longest historical streak must remain 3');
    assert.equal(report.isActiveToday, false);
  });

  test('5. Weekly calendar view (M T W T F S S) contains 7 ordered days', () => {
    const refDate = new Date(2026, 7, 23, 12, 0, 0); // Aug 23, 2026 (Sunday)
    const events = [{ timestamp: '2026-08-23T08:00:00Z', activity: 'code_practice' }];

    const report = calculateRealStreak(events, refDate);
    assert.equal(report.weekDays.length, 7);

    const initials = report.weekDays.map((d) => d.dayInitial);
    assert.deepEqual(initials, ['M', 'T', 'W', 'T', 'F', 'S', 'S']);

    // Sunday Aug 23 is today
    const sunday = report.weekDays[6];
    assert.equal(sunday.isToday, true);
    assert.equal(sunday.isCompleted, true);
    assert.equal(sunday.dayName, 'Sunday');
  });

  // ---------------- 3. Contextual YouTube Learning Integration Tests ----------------
  test('6. YouTube resources database contains valid video URLs, IDs and channels', () => {
    assert.ok(YOUTUBE_RESOURCES_DB.length >= 10, 'Must have curated video pool');

    YOUTUBE_RESOURCES_DB.forEach((v) => {
      assert.ok(v.id && v.id.length >= 5, 'Valid YouTube video ID');
      assert.ok(v.videoUrl.startsWith('https://www.youtube.com/watch?v='), 'Must be standard watch URL');
      assert.ok(v.thumbnailUrl.startsWith('https://img.youtube.com/vi/'), 'Must be official YouTube thumbnail');
      assert.ok(v.title && v.title.length > 5, 'Must have meaningful title');
      assert.ok(v.channel && v.channel.length > 2, 'Must have channel name');
      assert.ok(Array.isArray(v.topics) && v.topics.length > 0, 'Must have topic tags');
    });
  });

  test('7. Contextual YouTube matcher pairs videos with problem category and topics', () => {
    // Problem 1: Two Sum (Arrays & Hashing)
    const twoSumProblem = CODING_QUESTION_BANK[0];
    const twoSumVideos = getContextualYouTubeVideos(twoSumProblem);

    assert.ok(twoSumVideos.length >= 2, 'Must return 2-4 videos');
    const hasArrayOrTwoSum = twoSumVideos.some(
      (v) => v.topics.includes('arrays & hashing') || v.topics.includes('two sum') || v.title.toLowerCase().includes('two sum')
    );
    assert.ok(hasArrayOrTwoSum, 'Must recommend Array/Two Sum video');

    // Problem 2: Binary Tree Maximum Path Sum
    const treeProblem = CODING_QUESTION_BANK.find((q) => q.category.toLowerCase().includes('tree')) || {
      title: 'Binary Tree Maximum Path Sum',
      category: 'Trees',
      constraints: ['binary tree'],
    };
    const treeVideos = getContextualYouTubeVideos(treeProblem);
    assert.ok(treeVideos.length >= 2);
    const hasTree = treeVideos.some((v) => v.topics.includes('trees') || v.title.toLowerCase().includes('tree'));
    assert.ok(hasTree, 'Must recommend Tree video for Tree problem');
  });
});
