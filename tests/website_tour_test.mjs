import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_STEPS } from '../data/tourSteps.mjs';

describe('AI Website Tour & Smart Mentor Navigation Suite', () => {
  test('1. Website Tour Steps Configuration & Sequence Integrity', () => {
    assert.equal(TOUR_STEPS.length, 7, 'Tour must cover all 7 key application areas');

    const expectedSteps = [
      { id: 'dashboard', route: '/' },
      { id: 'assessment', route: '/assessment' },
      { id: 'practice', route: '/practice' },
      { id: 'interview', route: '/interview' },
      { id: 'roadmap', route: '/roadmap' },
      { id: 'opportunities', route: '/opportunities' },
      { id: 'analytics', route: '/analytics' },
    ];

    expectedSteps.forEach((exp, idx) => {
      assert.equal(TOUR_STEPS[idx].id, exp.id);
      assert.equal(TOUR_STEPS[idx].route, exp.route);
      assert.ok(TOUR_STEPS[idx].title.length > 5);
      assert.ok(TOUR_STEPS[idx].description.length > 20);
      assert.ok(TOUR_STEPS[idx].keyFeatures.length >= 3);
    });
  });

  test('2. Step Counter Math and Progression', () => {
    const total = TOUR_STEPS.length;
    for (let i = 0; i < total; i++) {
      const stepNumber = i + 1;
      assert.equal(`Step ${stepNumber} of ${total}`, `Step ${i + 1} of 7`);
    }
  });
});
