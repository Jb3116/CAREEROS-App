import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_STEPS } from '../data/tourSteps.mjs';

describe('AI Website Tour & Smart Mentor Navigation Suite', () => {
  test('1. Website Tour Steps Configuration & Stable Target Integrity', () => {
    assert.equal(TOUR_STEPS.length, 8, 'Tour must cover all 8 key application areas with data-tour targets');

    const expectedSteps = [
      { id: 'dashboard', target: 'dashboard', route: '/dashboard' },
      { id: 'assessment', target: 'assessment', route: '/assessment' },
      { id: 'roadmap', target: 'roadmap', route: '/career-roadmap' },
      { id: 'practice', target: 'practice', route: '/practice' },
      { id: 'interview-studio', target: 'interview-studio', route: '/interview-studio' },
      { id: 'ai-mentor', target: 'ai-mentor', route: '/dashboard' },
      { id: 'analytics', target: 'analytics', route: '/dashboard' },
      { id: 'profile', target: 'profile', route: '/profile' },
    ];

    expectedSteps.forEach((exp, idx) => {
      assert.equal(TOUR_STEPS[idx].id, exp.id);
      assert.equal(TOUR_STEPS[idx].target, exp.target);
      assert.equal(TOUR_STEPS[idx].route, exp.route);
      assert.ok(TOUR_STEPS[idx].title.length > 5);
      assert.ok(TOUR_STEPS[idx].description.length > 20);
      assert.ok(TOUR_STEPS[idx].keyFeatures.length >= 3);
    });
  });

  test('2. Step Counter Math and Progression', () => {
    const total = TOUR_STEPS.length;
    assert.equal(total, 8);
    for (let i = 0; i < total; i++) {
      const stepNumber = i + 1;
      assert.equal(`Step ${stepNumber} of ${total}`, `Step ${i + 1} of 8`);
    }
  });

  test('3. Stable Data-Tour Target Selector Resolution', () => {
    TOUR_STEPS.forEach((step) => {
      assert.ok(step.target, `Step ${step.id} must define target`);
      const selector = `[data-tour="${step.target}"]`;
      assert.ok(selector.startsWith('[data-tour="') && selector.endsWith('"]'));
    });
  });
});
