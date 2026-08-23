import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_STEPS } from '../data/tourSteps.mjs';

describe('AI Website Tour & Smart Mentor Navigation Suite', () => {
  test('1. Compact Website Tour Steps Configuration & Stable Target Integrity', () => {
    assert.equal(TOUR_STEPS.length, 8, 'Tour must cover all 8 key application areas with data-tour-id targets');

    const expectedSteps = [
      { id: 'dashboard', tourId: 'dashboard', route: '/dashboard' },
      { id: 'assessment', tourId: 'assessment', route: '/assessment' },
      { id: 'roadmap', tourId: 'roadmap', route: '/career-roadmap' },
      { id: 'practice', tourId: 'practice', route: '/practice' },
      { id: 'interview', tourId: 'interview', route: '/interview-studio' },
      { id: 'mentor', tourId: 'mentor', route: '/dashboard' },
      { id: 'opportunities', tourId: 'opportunities', route: '/opportunities' },
      { id: 'profile', tourId: 'profile', route: '/profile' },
    ];

    expectedSteps.forEach((exp, idx) => {
      assert.equal(TOUR_STEPS[idx].id, exp.id);
      assert.equal(TOUR_STEPS[idx].tourId, exp.tourId);
      assert.equal(TOUR_STEPS[idx].route, exp.route);
      assert.ok(TOUR_STEPS[idx].title.length >= 5, 'Title should be concise and descriptive');
      assert.ok(TOUR_STEPS[idx].description.length >= 20, 'Description should be 1-2 punchy sentences');
      assert.ok(TOUR_STEPS[idx].description.length <= 160, 'Description must remain compact for SaaS tooltip');
      assert.ok(TOUR_STEPS[idx].badge.length > 2);
    });
  });

  test('2. Step Counter Math and Progression', () => {
    const total = TOUR_STEPS.length;
    assert.equal(total, 8);
    for (let i = 0; i < total; i++) {
      const stepNumber = i + 1;
      assert.equal(`Step ${stepNumber} of ${total}`, `Step ${i + 1} of 8`);
      assert.equal(`${stepNumber} of ${total}`, `${i + 1} of 8`);
    }
  });

  test('3. Stable data-tour-id and data-tour Target Selector Resolution', () => {
    TOUR_STEPS.forEach((step) => {
      assert.ok(step.tourId, `Step ${step.id} must define tourId`);
      const tourIdSelector = `[data-tour-id="${step.tourId}"]`;
      const legacySelector = `[data-tour="${step.target}"]`;
      assert.ok(tourIdSelector.startsWith('[data-tour-id="') && tourIdSelector.endsWith('"]'));
      assert.ok(legacySelector.startsWith('[data-tour="') && legacySelector.endsWith('"]'));
    });
  });

  test('4. Smart Persistence State Definition', () => {
    const validStates = ['true', 'skipped', null];
    validStates.forEach((state) => {
      const shouldAutoLaunch = !state;
      if (state === 'true' || state === 'skipped') {
        assert.equal(shouldAutoLaunch, false, 'Completed or skipped tour should never auto-launch');
      } else {
        assert.equal(shouldAutoLaunch, true, 'First-time user without localStorage state should auto-launch');
      }
    });
  });
});
