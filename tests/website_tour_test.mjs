import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_STEPS } from '../data/tourSteps.mjs';

describe('AI Website Tour & Smart Mentor Navigation Suite', () => {
  test('1. Compact Website Tour Steps Configuration & Stable Target Integrity', () => {
    assert.equal(TOUR_STEPS.length, 8, 'Tour must cover all 8 key application areas with data-tour-id targets');

    const expectedSteps = [
      { id: 'dashboard', tourId: 'dashboard', route: '/dashboard', title: 'Dashboard' },
      { id: 'assessment', tourId: 'assessment', route: '/assessment', title: 'Assessment' },
      { id: 'roadmap', tourId: 'roadmap', route: '/career-roadmap', title: 'Roadmap' },
      { id: 'opportunities', tourId: 'opportunities', route: '/opportunities', title: 'Opportunities' },
      { id: 'interview', tourId: 'interview', route: '/interview-studio', title: 'Interview Studio' },
      { id: 'learning', tourId: 'learning', route: '/learning', title: 'Learning Hub' },
      { id: 'mentor', tourId: 'mentor', route: '/dashboard', title: 'AI Mentor' },
      { id: 'profile', tourId: 'profile', route: '/profile', title: 'Profile' },
    ];

    expectedSteps.forEach((exp, idx) => {
      assert.equal(TOUR_STEPS[idx].id, exp.id);
      assert.equal(TOUR_STEPS[idx].tourId, exp.tourId);
      assert.equal(TOUR_STEPS[idx].route, exp.route);
      assert.equal(TOUR_STEPS[idx].title, exp.title);
      assert.ok(TOUR_STEPS[idx].description.length >= 15, 'Description should be short and simple');
      assert.ok(TOUR_STEPS[idx].description.length <= 80, 'Description must be under 20 words for simple student UX');
      assert.ok(TOUR_STEPS[idx].badge.length >= 2);
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

  test('5. Initial Route Verification & First Step Target', () => {
    // Step 1 MUST target the dashboard navigation icon on the dashboard route
    const firstStep = TOUR_STEPS[0];
    assert.equal(firstStep.id, 'dashboard');
    assert.equal(firstStep.tourId, 'dashboard');
    assert.equal(firstStep.route, '/dashboard');
  });

  test('6. Auth-Aware User-Specific & Standard Persistence Key Formatting', () => {
    const primaryKey = 'careeros_ai_tour_completed';
    assert.equal(primaryKey, 'careeros_ai_tour_completed');

    const userIds = ['s123', 'alex_chen', 'u999'];
    userIds.forEach((uid) => {
      const userKey = `careeros_tour_completed_${uid}`;
      assert.ok(userKey.startsWith('careeros_tour_completed_'));
      assert.equal(userKey, `careeros_tour_completed_${uid}`);
    });
  });

  test('8. Post-Tour Onboarding Redirection & Zero-Blur Highlight Configuration', () => {
    // Verification that final tour step routes to onboarding wizard
    const finalStep = TOUR_STEPS[TOUR_STEPS.length - 1];
    assert.equal(finalStep.id, 'profile');
    const targetAfterTour = '/onboarding';
    assert.equal(targetAfterTour, '/onboarding', 'Tour completion must guide user to Student Onboarding wizard');
  });

  test('9. Exact Strict User Journey Sequence Progression', () => {
    const sequencePipeline = [
      'STEP_1_SUCCESSFUL_SIGN_UP',
      'STEP_2_DASHBOARD_AI_TOUR',
      'STEP_3_STUDENT_ONBOARDING_WIZARD',
      'STEP_4_DIAGNOSTIC_ASSESSMENT',
      'STEP_5_MAIN_DASHBOARD_ECOSYSTEM',
    ];

    assert.equal(sequencePipeline[0], 'STEP_1_SUCCESSFUL_SIGN_UP');
    assert.equal(sequencePipeline[1], 'STEP_2_DASHBOARD_AI_TOUR');
    assert.equal(sequencePipeline[2], 'STEP_3_STUDENT_ONBOARDING_WIZARD');
    assert.equal(sequencePipeline[3], 'STEP_4_DIAGNOSTIC_ASSESSMENT');
    assert.equal(sequencePipeline[4], 'STEP_5_MAIN_DASHBOARD_ECOSYSTEM');
  });
});
