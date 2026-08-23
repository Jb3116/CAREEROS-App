import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { trainDKT } from './ai/dkt-engine.mjs';
import { saveDevelopmentDataset } from './data/dataset-generator.mjs';

const dataPath = join(process.cwd(), 'data', 'development_interactions.json');
let interactions;

if (!existsSync(dataPath)) {
  interactions = saveDevelopmentDataset();
} else {
  interactions = JSON.parse(readFileSync(dataPath, 'utf-8'));
}

console.log(`[DKT Training Runner] Starting DKT Neural Training across ${interactions.length} student events...`);
const result = trainDKT(interactions, {
  hidden_dim: 32,
  embedding_dim: 16,
  learning_rate: 0.015,
  epochs: 20,
});

console.log(`[DKT Training Completed Successfully] Output stored in models/dkt/`);
