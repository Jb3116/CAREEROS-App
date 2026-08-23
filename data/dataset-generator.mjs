/**
 * CAREEROS - Synthetic Development Dataset Generator for Deep Knowledge Tracing (DKT)
 * 
 * DISCLAIMER / LABELING:
 * [SYNTHETIC DEVELOPMENT DATASET - NOT REAL STUDENT BEHAVIOR]
 * This dataset is procedurally generated strictly for local development, model calibration,
 * benchmarking, and unit testing of sequential knowledge tracing architectures.
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const SKILL_CONCEPTS = [
  'python',
  'data_structures',
  'algorithms',
  'sql',
  'oop',
  'dbms',
  'operating_systems',
  'computer_networks',
  'machine_learning',
  'aptitude',
  'communication',
];

export function generateSyntheticInteractions(numStudents = 300, minAttempts = 25, maxAttempts = 75) {
  const dataset = [];

  for (let s = 1; s <= numStudents; s++) {
    const studentId = `student_${s.toString().padStart(4, '0')}`;
    // Latent student aptitude: bimodal distribution to simulate diverse student cohorts
    const isAdvancedStudent = Math.random() > 0.6;
    const studentBaseAptitude = isAdvancedStudent ? 0.65 + Math.random() * 0.25 : 0.35 + Math.random() * 0.3;
    const learningRate = 0.03 + Math.random() * 0.05; // Learning progression rate
    const attemptsCount = Math.floor(minAttempts + Math.random() * (maxAttempts - minAttempts + 1));

    // Per-skill latent competence initialized around student's base aptitude
    const latentMastery = {};
    for (const skill of SKILL_CONCEPTS) {
      latentMastery[skill] = Math.max(0.15, Math.min(0.85, studentBaseAptitude + (Math.random() * 0.2 - 0.1)));
    }

    let timestamp = Date.now() - attemptsCount * 3600 * 1000 * 8;

    for (let i = 1; i <= attemptsCount; i++) {
      const skill = SKILL_CONCEPTS[Math.floor(Math.random() * SKILL_CONCEPTS.length)];
      const difficultyLevels = ['easy', 'medium', 'hard'];
      const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
      const diffPenalty = difficulty === 'hard' ? 0.22 : difficulty === 'medium' ? 0.08 : -0.05;

      // Probability of solving correctly: logistic curve of latent mastery minus item difficulty
      const pCorrect = Math.max(0.08, Math.min(0.92, latentMastery[skill] - diffPenalty + (Math.random() * 0.06 - 0.03)));
      const isCorrect = Math.random() < pCorrect ? 1 : 0;

      // Update latent mastery sequentially reflecting learning through practice
      if (isCorrect) {
        latentMastery[skill] = Math.min(0.96, latentMastery[skill] + learningRate);
      } else {
        // Constructive reinforcement on mistakes
        latentMastery[skill] = Math.max(0.1, latentMastery[skill] - learningRate * 0.25);
      }

      timestamp += Math.floor(1200 * 1000 + Math.random() * 5400 * 1000);

      dataset.push({
        dataset_type: 'DEVELOPMENT_SYNTHETIC_DATA',
        student_id: studentId,
        attempt_index: i,
        skill: skill,
        difficulty: difficulty,
        correct: isCorrect,
        activity: 'practice_problem',
        timestamp: new Date(timestamp).toISOString(),
      });
    }
  }

  return dataset;
}

export function saveDevelopmentDataset(outputDir = './data') {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const interactions = generateSyntheticInteractions(250, 30, 80);
  const targetPath = join(outputDir, 'development_interactions.json');
  writeFileSync(targetPath, JSON.stringify(interactions, null, 2), 'utf-8');
  console.log(`[DKT Synthetic Data] Generated ${interactions.length} development interaction events across 250 students -> ${targetPath}`);
  return interactions;
}

if (process.argv[1]?.endsWith('dataset-generator.mjs')) {
  saveDevelopmentDataset();
}
