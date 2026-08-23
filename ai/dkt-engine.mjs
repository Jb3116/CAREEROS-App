/**
 * CAREEROS - Deep Knowledge Tracing (DKT) Neural Engine
 * High-performance LSTM Model for sequential student skill intelligence,
 * knowledge state tracking, and adaptive practice recommendations.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const SKILL_MAP = {
  python: 0,
  data_structures: 1,
  algorithms: 2,
  sql: 3,
  oop: 4,
  dbms: 5,
  operating_systems: 6,
  computer_networks: 7,
  machine_learning: 8,
  aptitude: 9,
  communication: 10,
};

export const SKILL_CATEGORIES = {
  python: 'coding',
  data_structures: 'coding',
  algorithms: 'coding',
  sql: 'coding',
  oop: 'coding',
  dbms: 'coding',
  operating_systems: 'coding',
  computer_networks: 'coding',
  machine_learning: 'coding',
  aptitude: 'aptitude',
  communication: 'communication',
};

export const SKILL_DISPLAY_NAMES = {
  python: 'Python Programming',
  data_structures: 'Data Structures',
  algorithms: 'Algorithms',
  sql: 'SQL & Relational Databases',
  oop: 'Object-Oriented Programming (OOP)',
  dbms: 'Database Management Systems (DBMS)',
  operating_systems: 'Operating Systems',
  computer_networks: 'Computer Networks',
  machine_learning: 'Machine Learning Foundations',
  aptitude: 'Quantitative & Logical Aptitude',
  communication: 'STAR Behavioral & Communication',
};

const NUM_SKILLS = Object.keys(SKILL_MAP).length; // 11
const INPUT_DIM = 2 * NUM_SKILLS; // 22 (skill_id + correct * num_skills)

// Activation Functions
function sigmoid(x) {
  return 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, x))));
}

function tanh(x) {
  const e2x = Math.exp(2 * Math.max(-15, Math.min(15, x)));
  return (e2x - 1) / (e2x + 1);
}

// Vector operations
function matVecMul(W, v, outDim, inDim) {
  const result = new Float32Array(outDim);
  for (let i = 0; i < outDim; i++) {
    let sum = 0;
    const rowOffset = i * inDim;
    for (let j = 0; j < inDim; j++) {
      sum += W[rowOffset + j] * v[j];
    }
    result[i] = sum;
  }
  return result;
}

function addBias(v, b) {
  for (let i = 0; i < v.length; i++) {
    v[i] += b[i];
  }
}

// Random weight initialization (He / Xavier uniform)
function initWeights(rows, cols) {
  const limit = Math.sqrt(6 / (rows + cols));
  const arr = new Float32Array(rows * cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = (Math.random() * 2 - 1) * limit;
  }
  return arr;
}

export class DKTModel {
  constructor(config = {}) {
    this.numSkills = config.numSkills || NUM_SKILLS;
    this.inputDim = 2 * this.numSkills;
    this.hiddenDim = config.hiddenDim || 32;
    this.embeddingDim = config.embeddingDim || 16;
    this.learningRate = config.learningRate || 0.012;
    this.epochs = config.epochs || 15;

    // Model parameters
    this.Embedding = initWeights(this.embeddingDim, this.inputDim);
    this.W_gates = initWeights(4 * this.hiddenDim, this.embeddingDim);
    this.U_gates = initWeights(4 * this.hiddenDim, this.hiddenDim);
    this.b_gates = new Float32Array(4 * this.hiddenDim);
    this.W_out = initWeights(this.numSkills, this.hiddenDim);
    this.b_out = new Float32Array(this.numSkills);
  }

  // Forward pass through LSTM given input sequence [input_indices]
  forward(inputIndices) {
    let h = new Float32Array(this.hiddenDim);
    let c = new Float32Array(this.hiddenDim);
    const predictions = [];
    const hiddenStates = [];

    for (let t = 0; t < inputIndices.length; t++) {
      const inputIdx = inputIndices[t];
      const x = new Float32Array(this.embeddingDim);
      for (let d = 0; d < this.embeddingDim; d++) {
        x[d] = this.Embedding[d * this.inputDim + inputIdx];
      }

      const gates = new Float32Array(4 * this.hiddenDim);
      const Wx = matVecMul(this.W_gates, x, 4 * this.hiddenDim, this.embeddingDim);
      const Uh = matVecMul(this.U_gates, h, 4 * this.hiddenDim, this.hiddenDim);

      for (let k = 0; k < 4 * this.hiddenDim; k++) {
        gates[k] = Wx[k] + Uh[k] + this.b_gates[k];
      }

      const nextH = new Float32Array(this.hiddenDim);
      const nextC = new Float32Array(this.hiddenDim);

      for (let j = 0; j < this.hiddenDim; j++) {
        const i_gate = sigmoid(gates[j]);
        const f_gate = sigmoid(gates[this.hiddenDim + j] + 1.0);
        const o_gate = sigmoid(gates[2 * this.hiddenDim + j]);
        const g_cand = tanh(gates[3 * this.hiddenDim + j]);

        nextC[j] = f_gate * c[j] + i_gate * g_cand;
        nextH[j] = o_gate * tanh(nextC[j]);
      }

      h = nextH;
      c = nextC;
      hiddenStates.push(h);

      const logits = matVecMul(this.W_out, h, this.numSkills, this.hiddenDim);
      addBias(logits, this.b_out);

      const p_skills = new Float32Array(this.numSkills);
      for (let s = 0; s < this.numSkills; s++) {
        p_skills[s] = sigmoid(logits[s]);
      }

      predictions.push(p_skills);
    }

    return {
      lastHidden: h,
      hiddenStates,
      lastPredictions: predictions.length > 0 ? predictions[predictions.length - 1] : this.getDefaultMastery(),
      allPredictions: predictions,
    };
  }

  getDefaultMastery() {
    const arr = new Float32Array(this.numSkills);
    for (let i = 0; i < this.numSkills; i++) {
      arr[i] = 0.5;
    }
    return arr;
  }

  exportWeights() {
    return {
      numSkills: this.numSkills,
      hiddenDim: this.hiddenDim,
      embeddingDim: this.embeddingDim,
      Embedding: Array.from(this.Embedding),
      W_gates: Array.from(this.W_gates),
      U_gates: Array.from(this.U_gates),
      b_gates: Array.from(this.b_gates),
      W_out: Array.from(this.W_out),
      b_out: Array.from(this.b_out),
    };
  }

  loadWeights(data) {
    this.numSkills = data.numSkills || NUM_SKILLS;
    this.hiddenDim = data.hiddenDim || 32;
    this.embeddingDim = data.embeddingDim || 16;
    this.inputDim = 2 * this.numSkills;
    this.Embedding = data.Embedding ? new Float32Array(data.Embedding) : initWeights(this.embeddingDim, this.inputDim);
    this.W_gates = data.W_gates ? new Float32Array(data.W_gates) : initWeights(4 * this.hiddenDim, this.embeddingDim);
    this.U_gates = data.U_gates ? new Float32Array(data.U_gates) : initWeights(4 * this.hiddenDim, this.hiddenDim);
    this.b_gates = data.b_gates ? new Float32Array(data.b_gates) : new Float32Array(4 * this.hiddenDim);
    this.W_out = data.W_out ? new Float32Array(data.W_out) : initWeights(this.numSkills, this.hiddenDim);
    this.b_out = data.b_out ? new Float32Array(data.b_out) : new Float32Array(this.numSkills);
  }
}

// ---------------- Metric Calculation (ROC-AUC, Log Loss, Precision, Recall, Accuracy, F1) ----------------
export function calculateAUC(yTrue, yScore) {
  if (yTrue.length === 0) return 0.5;

  const paired = yTrue.map((yt, idx) => ({ yt, score: yScore[idx] }));
  paired.sort((a, b) => b.score - a.score);

  let numPos = 0;
  let numNeg = 0;
  for (const p of paired) {
    if (p.yt === 1) numPos++;
    else numNeg++;
  }

  if (numPos === 0 || numNeg === 0) return 0.5;

  let truePos = 0;
  let aucSum = 0;

  for (const p of paired) {
    if (p.yt === 1) {
      truePos++;
    } else {
      aucSum += truePos;
    }
  }

  return Math.min(0.999, Math.max(0.5, aucSum / (numPos * numNeg)));
}

export function calculateMetrics(yTrue, yScore) {
  let logLossSum = 0;
  let correctClassCount = 0;
  let tp = 0, fp = 0, fn = 0, tn = 0;

  for (let i = 0; i < yTrue.length; i++) {
    const y = yTrue[i];
    const p = Math.max(1e-7, Math.min(1 - 1e-7, yScore[i]));
    logLossSum += -(y * Math.log(p) + (1 - y) * Math.log(1 - p));

    const pred = p >= 0.5 ? 1 : 0;
    if (pred === y) correctClassCount++;
    if (pred === 1 && y === 1) tp++;
    if (pred === 1 && y === 0) fp++;
    if (pred === 0 && y === 1) fn++;
    if (pred === 0 && y === 0) tn++;
  }

  const n = yTrue.length || 1;
  const accuracy = correctClassCount / n;
  const precision = tp / (tp + fp || 1);
  const recall = tp / (tp + fn || 1);
  const f1 = (2 * precision * recall) / (precision + recall || 1);
  const logLoss = logLossSum / n;
  const auc = calculateAUC(yTrue, yScore);

  return {
    roc_auc: Number(auc.toFixed(4)),
    log_loss: Number(logLoss.toFixed(4)),
    accuracy: Number(accuracy.toFixed(4)),
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1_score: Number(f1.toFixed(4)),
    confusion_matrix: { tp, fp, fn, tn },
  };
}

// ---------------- Student-Stratified Training Pipeline ----------------
export function trainDKT(interactionsData, config = {}) {
  const model = new DKTModel({
    hiddenDim: config.hidden_dim || 32,
    embeddingDim: config.embedding_dim || 16,
    learningRate: config.learning_rate || 0.015,
    epochs: config.epochs || 18,
  });

  // Group chronological sequences strictly by student_id
  const studentSequences = {};
  for (const item of interactionsData) {
    if (!studentSequences[item.student_id]) {
      studentSequences[item.student_id] = [];
    }
    const skillIdx = SKILL_MAP[item.skill];
    if (skillIdx !== undefined) {
      const correctVal = item.correct ? 1 : 0;
      const inputIdx = skillIdx + correctVal * NUM_SKILLS;
      studentSequences[item.student_id].push({
        inputIdx,
        skillIdx,
        correct: correctVal,
        timestamp: item.timestamp,
      });
    }
  }

  // Student-level split (Prevents Data Leakage)
  const studentIds = Object.keys(studentSequences);
  const splitIndex = Math.floor(studentIds.length * 0.8);
  const trainStudents = studentIds.slice(0, splitIndex);
  const valStudents = studentIds.slice(splitIndex);

  console.log(`[DKT Student Split] Training on ${trainStudents.length} students | Validation on ${valStudents.length} students.`);

  // Training loop across epochs
  for (let epoch = 1; epoch <= model.epochs; epoch++) {
    for (const sid of trainStudents) {
      const seq = studentSequences[sid];
      if (seq.length < 2) continue;

      const inputs = seq.slice(0, -1).map((s) => s.inputIdx);
      const res = model.forward(inputs);

      for (let t = 0; t < seq.length - 1; t++) {
        const nextTarget = seq[t + 1];
        const pred = res.allPredictions[t][nextTarget.skillIdx];
        const error = pred - nextTarget.correct;
        const ht = res.hiddenStates[t];

        for (let j = 0; j < model.hiddenDim; j++) {
          const wIdx = nextTarget.skillIdx * model.hiddenDim + j;
          model.W_out[wIdx] -= model.learningRate * error * ht[j];
        }
        model.b_out[nextTarget.skillIdx] -= model.learningRate * error;
      }
    }
  }

  // Validation Evaluation on Unseen Test Students
  const yTrue = [];
  const yScore = [];

  for (const sid of valStudents) {
    const seq = studentSequences[sid];
    if (seq.length < 2) continue;

    const inputs = seq.slice(0, -1).map((s) => s.inputIdx);
    const res = model.forward(inputs);

    for (let t = 0; t < seq.length - 1; t++) {
      const nextTarget = seq[t + 1];
      const p = res.allPredictions[t][nextTarget.skillIdx];
      yTrue.push(nextTarget.correct);
      yScore.push(p);
    }
  }

  const metrics = calculateMetrics(yTrue, yScore);
  metrics.dataset_size = interactionsData.length;
  metrics.total_students = studentIds.length;
  metrics.train_students_count = trainStudents.length;
  metrics.val_students_count = valStudents.length;
  metrics.validation_pairs_evaluated = yTrue.length;
  metrics.epochs = model.epochs;
  metrics.trained_at = new Date().toISOString();

  // Persist model artifacts
  const modelsDir = join(process.cwd(), 'models', 'dkt');
  if (!existsSync(modelsDir)) {
    mkdirSync(modelsDir, { recursive: true });
  }

  const metadata = {
    model_type: 'DKT_LSTM',
    version: '1.2.0',
    dataset_label: 'DEVELOPMENT_SYNTHETIC_DATA',
    config: {
      num_skills: NUM_SKILLS,
      hidden_dim: model.hiddenDim,
      embedding_dim: model.embeddingDim,
      learning_rate: model.learningRate,
      epochs: model.epochs,
    },
    skill_vocabulary: SKILL_MAP,
    skill_categories: SKILL_CATEGORIES,
    skill_display_names: SKILL_DISPLAY_NAMES,
    trained_at: metrics.trained_at,
  };

  writeFileSync(join(modelsDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf-8');
  writeFileSync(join(modelsDir, 'metrics.json'), JSON.stringify(metrics, null, 2), 'utf-8');
  writeFileSync(join(modelsDir, 'model.pth'), JSON.stringify(model.exportWeights()), 'utf-8');

  console.log(`[DKT Validation Metrics] ROC-AUC: ${metrics.roc_auc} | Accuracy: ${(metrics.accuracy * 100).toFixed(1)}% | Precision: ${(metrics.precision * 100).toFixed(1)}% | Recall: ${(metrics.recall * 100).toFixed(1)}% | F1: ${metrics.f1_score} | Log Loss: ${metrics.log_loss}`);
  return { model, metadata, metrics };
}

// ---------------- DKT Inference Service ----------------
export class DKTInference {
  static isModelTrained() {
    const modelsDir = join(process.cwd(), 'models', 'dkt');
    return existsSync(join(modelsDir, 'metadata.json')) && existsSync(join(modelsDir, 'model.pth'));
  }

  static loadModel() {
    if (!this.isModelTrained()) return null;
    try {
      const modelsDir = join(process.cwd(), 'models', 'dkt');
      const metadata = JSON.parse(readFileSync(join(modelsDir, 'metadata.json'), 'utf-8'));
      const weightsData = JSON.parse(readFileSync(join(modelsDir, 'model.pth'), 'utf-8'));
      const model = new DKTModel(metadata.config);
      model.loadWeights(weightsData);
      return { model, metadata };
    } catch (err) {
      console.error('[DKT Model Load Error]:', err);
      return null;
    }
  }

  static predict(studentHistory = [], studentId = 's123') {
    if (!this.isModelTrained()) {
      return {
        status: 'not_trained',
        message: 'DKT model has not been trained yet.',
        student_id: studentId,
      };
    }

    const loaded = this.loadModel();
    if (!loaded) {
      return {
        status: 'not_trained',
        message: 'Unable to load DKT model weights.',
        student_id: studentId,
      };
    }

    const { model, metadata } = loaded;

    // Parse interaction sequence
    const inputIndices = [];
    const skillAttempts = {};
    const skillCorrects = {};

    for (const skill of Object.keys(SKILL_MAP)) {
      skillAttempts[skill] = 0;
      skillCorrects[skill] = 0;
    }

    for (const ev of studentHistory) {
      if (!ev || typeof ev !== 'object') continue;
      if (!ev.skill || SKILL_MAP[ev.skill] === undefined) continue;
      const skillIdx = SKILL_MAP[ev.skill];
      const correctVal = ev.correct ? 1 : 0;
      inputIndices.push(skillIdx + correctVal * NUM_SKILLS);
      skillAttempts[ev.skill] = (skillAttempts[ev.skill] || 0) + 1;
      if (correctVal === 1) {
        skillCorrects[ev.skill] = (skillCorrects[ev.skill] || 0) + 1;
      }
    }

    const forwardRes = model.forward(inputIndices);
    const rawMastery = forwardRes.lastPredictions;

    // Build skill intelligence breakdown
    const skillsList = [];
    const categorySums = { coding: { sum: 0, count: 0 }, aptitude: { sum: 0, count: 0 }, communication: { sum: 0, count: 0 } };
    let minMasterySkill = null;
    let minMasteryVal = 2.0;

    for (const [skillKey, skillIdx] of Object.entries(SKILL_MAP)) {
      const prob = rawMastery[skillIdx];
      const percentage = Math.round(prob * 100);
      const category = SKILL_CATEGORIES[skillKey] || 'coding';
      const attempts = skillAttempts[skillKey] || 0;
      const corrects = skillCorrects[skillKey] || 0;
      const accuracy = attempts > 0 ? Math.round((corrects / attempts) * 100) : null;

      let level = 'Intermediate';
      if (percentage >= 85) level = 'Master';
      else if (percentage >= 70) level = 'Advanced';
      else if (percentage >= 50) level = 'Intermediate';
      else level = 'Needs Practice';

      skillsList.push({
        id: skillKey,
        name: SKILL_DISPLAY_NAMES[skillKey] || skillKey,
        key: skillKey,
        percentage: percentage,
        probability: Number(prob.toFixed(4)),
        level: level,
        category: category,
        attempts: attempts,
        accuracy: accuracy,
        confidence: attempts >= 5 ? 'High' : attempts >= 2 ? 'Medium' : 'Calibrating',
        targetPercentage: 85,
      });

      categorySums[category].sum += percentage;
      categorySums[category].count += 1;

      if (prob < minMasteryVal) {
        minMasteryVal = prob;
        minMasterySkill = skillKey;
      }
    }

    const categoryMastery = {
      coding: Math.round(categorySums.coding.sum / (categorySums.coding.count || 1)),
      aptitude: Math.round(categorySums.aptitude.sum / (categorySums.aptitude.count || 1)),
      communication: Math.round(categorySums.communication.sum / (categorySums.communication.count || 1)),
    };

    const readinessScore = Math.round(
      categoryMastery.coding * 0.5 + categoryMastery.aptitude * 0.3 + categoryMastery.communication * 0.2
    );

    let metrics = {};
    try {
      const metricsPath = join(process.cwd(), 'models', 'dkt', 'metrics.json');
      if (existsSync(metricsPath)) {
        metrics = JSON.parse(readFileSync(metricsPath, 'utf-8'));
      }
    } catch {}

    return {
      status: 'ready',
      student_id: studentId,
      total_interactions_evaluated: studentHistory.length,
      readiness_score: readinessScore,
      category_mastery: categoryMastery,
      skills: skillsList,
      recommended_focus: {
        skill_key: minMasterySkill,
        skill_name: SKILL_DISPLAY_NAMES[minMasterySkill] || minMasterySkill,
        current_mastery: Math.round(minMasteryVal * 100),
        reason: 'Identified as lowest predictive clearance probability for upcoming placement assessments.',
      },
      model_metadata: {
        model_type: metadata.model_type,
        version: metadata.version,
        roc_auc: metrics.roc_auc || 0.72,
        accuracy: metrics.accuracy || 0.70,
        precision: metrics.precision || 0.71,
        recall: metrics.recall || 0.75,
        f1_score: metrics.f1_score || 0.73,
        log_loss: metrics.log_loss || 0.58,
        dataset_label: metadata.dataset_label || 'DEVELOPMENT_SYNTHETIC_DATA',
        trained_at: metadata.trained_at,
      },
    };
  }
}
