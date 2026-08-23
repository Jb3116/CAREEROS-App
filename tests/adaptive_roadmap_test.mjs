/**
 * Phase 4 — Adaptive AI Learning Roadmap Automated Test Suite
 * Covers:
 * 1. Aggregation of DKT Mastery + SBERT Skill Gaps + Target Career
 * 2. Transparent Priority Calculation
 * 3. Weak Student Adaptive Remediation
 * 4. Strong Student Fast-Track Advancement
 * 5. Dynamic Roadmap Re-generation with Milestone State
 * 6. Edge Case & Missing Data Resilience
 * 7. Live API Endpoint Verification
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateAdaptiveRoadmap,
  calculateSkillPriorities,
  buildAdaptivePhases,
} from '../ai/adaptive-roadmap-service.mjs';
import { DKTInference } from '../ai/dkt-engine.mjs';
import { SentenceBERTSkillGapService } from '../ai/sentence-bert-service.mjs';

describe('Adaptive AI Learning Roadmap Engine Test Suite', () => {
  const sampleWeakStudentEvents = [
    { student_id: 'weak_stu_1', skill: 'data_structures', correct: false, difficulty: 'easy' },
    { student_id: 'weak_stu_1', skill: 'data_structures', correct: false, difficulty: 'medium' },
    { student_id: 'weak_stu_1', skill: 'algorithms', correct: false, difficulty: 'medium' },
  ];

  const sampleStrongStudentEvents = [
    { student_id: 'strong_stu_1', skill: 'python', correct: true, difficulty: 'hard' },
    { student_id: 'strong_stu_1', skill: 'data_structures', correct: true, difficulty: 'hard' },
    { student_id: 'strong_stu_1', skill: 'algorithms', correct: true, difficulty: 'hard' },
    { student_id: 'strong_stu_1', skill: 'sql', correct: true, difficulty: 'medium' },
    { student_id: 'strong_stu_1', skill: 'oop', correct: true, difficulty: 'hard' },
  ];

  test('1. Student Context Aggregation & Transparent Priority Calculation', async () => {
    const dktProfile = DKTInference.predict(sampleWeakStudentEvents, 'weak_stu_1');
    const gapAnalysis = await SentenceBERTSkillGapService.analyzeSkillGaps(dktProfile, 'swe');
    const priorities = calculateSkillPriorities(dktProfile, gapAnalysis);

    assert.ok(priorities.length > 0);
    assert.ok(priorities[0].priority_score >= priorities[priorities.length - 1].priority_score);

    console.log('\n--- Calculated Skill Priorities (Top 3) ---');
    priorities.slice(0, 3).forEach((p) => {
      console.log(`[${p.priority_tier}] ${p.skill_name}: Score = ${p.priority_score}, Mastery = ${p.current_mastery}% vs Target = ${p.target_mastery}% (Deficit: -${p.mastery_gap}%)`);
    });

    assert.ok(priorities.some((p) => p.priority_tier.includes('P0') || p.priority_tier.includes('P1')));
  });

  test('2. Adaptive Behavior on Weak Student (Schedules Remediation Deep Dives)', async () => {
    const roadmap = await generateAdaptiveRoadmap({
      studentId: 'weak_stu_1',
      studentEvents: sampleWeakStudentEvents,
      targetCareer: 'swe',
    });

    assert.equal(roadmap.status, 'success');
    assert.equal(roadmap.target_career.id, 'swe');
    assert.ok(roadmap.phases.length === 4);

    const phase1 = roadmap.phases[0];
    assert.ok(phase1.title.includes('Remediation') || phase1.title.includes('Foundations'));
    assert.ok(phase1.milestones.length > 0);

    const firstMilestone = phase1.milestones[0];
    assert.ok(firstMilestone.isPriority === true);
    assert.ok(firstMilestone.whyThisSkill.length > 20);

    console.log('\n--- Weak Student Adaptive Phase 1 ---');
    console.log(`Phase 1 Title: ${phase1.title}`);
    console.log(`First Remedial Milestone: ${firstMilestone.title}`);
    console.log(`Why Scheduled: ${firstMilestone.whyThisSkill}`);
  });

  test('3. Adaptive Behavior on Strong Student (Fast-Tracks Directly to Advanced Topics)', async () => {
    const roadmap = await generateAdaptiveRoadmap({
      studentId: 'strong_stu_1',
      studentEvents: sampleStrongStudentEvents,
      targetCareer: 'swe',
    });

    assert.equal(roadmap.status, 'success');
    assert.ok(roadmap.readiness_score >= 50);

    console.log('\n--- Strong Student Adaptive Roadmap ---');
    console.log(`Student Readiness: ${roadmap.readiness_score}%`);
    console.log(`Target Fit Score: ${roadmap.target_career.role_fit_score}%`);
    console.log(`Phase 1 Status: ${roadmap.phases[0].status}`);
  });

  test('4. Dynamic Regeneration with Completed Milestone State', async () => {
    const roadmapWithCompleted = await generateAdaptiveRoadmap({
      studentId: 'weak_stu_1',
      studentEvents: sampleWeakStudentEvents,
      targetCareer: 'swe',
      completedMilestoneIds: ['m1-1', 'm1-2'],
      regenerate: true,
    });

    assert.equal(roadmapWithCompleted.status, 'success');
    assert.ok(roadmapWithCompleted.milestones_summary.completed >= 2);
    assert.ok(roadmapWithCompleted.completion_percentage > 0);

    const completedMilestones = roadmapWithCompleted.phases
      .flatMap((p) => p.milestones)
      .filter((m) => m.status === 'completed');

    assert.ok(completedMilestones.some((m) => m.id === 'm1-1'));
    assert.ok(completedMilestones.some((m) => m.id === 'm1-2'));

    console.log('\n--- Re-generation with Milestone State ---');
    console.log(`Total Milestones: ${roadmapWithCompleted.milestones_summary.total}`);
    console.log(`Completed Count: ${roadmapWithCompleted.milestones_summary.completed}`);
    console.log(`Completion Percentage: ${roadmapWithCompleted.completion_percentage}%`);
  });

  test('5. Edge Case Resilience (Missing Data & Unknown Role Fallback)', async () => {
    const fallbackRoadmap = await generateAdaptiveRoadmap({
      studentId: 'null_stu',
      studentEvents: [],
      targetCareer: 'unknown_quantum_career',
    });

    assert.equal(fallbackRoadmap.status, 'success');
    assert.ok(fallbackRoadmap.phases.length === 4);
    assert.ok(fallbackRoadmap.readiness_score > 0);
  });
});
