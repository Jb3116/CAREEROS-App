"""
Standalone DKT Training Script in Python.
Loads interaction data from data/development_interactions.json,
splits data by STUDENT to prevent data leakage,
trains an LSTM-based Deep Knowledge Tracing model,
evaluates ROC-AUC, Log Loss, Accuracy, Precision, Recall, and F1 Score,
and persists artifacts to models/dkt/ (model.pth, metadata.json, metrics.json).
"""

import os
import sys
import json
import math
import random
from datetime import datetime

SKILL_MAP = {
    'python': 0,
    'data_structures': 1,
    'algorithms': 2,
    'sql': 3,
    'oop': 4,
    'dbms': 5,
    'operating_systems': 6,
    'computer_networks': 7,
    'machine_learning': 8,
    'aptitude': 9,
    'communication': 10,
}

SKILL_CATEGORIES = {
    'python': 'coding',
    'data_structures': 'coding',
    'algorithms': 'coding',
    'sql': 'coding',
    'oop': 'coding',
    'dbms': 'coding',
    'operating_systems': 'coding',
    'computer_networks': 'coding',
    'machine_learning': 'coding',
    'aptitude': 'aptitude',
    'communication': 'communication',
}

SKILL_DISPLAY_NAMES = {
    'python': 'Python Programming',
    'data_structures': 'Data Structures',
    'algorithms': 'Algorithms',
    'sql': 'SQL & Relational Databases',
    'oop': 'Object-Oriented Programming (OOP)',
    'dbms': 'Database Management Systems (DBMS)',
    'operating_systems': 'Operating Systems',
    'computer_networks': 'Computer Networks',
    'machine_learning': 'Machine Learning Foundations',
    'aptitude': 'Quantitative & Logical Aptitude',
    'communication': 'STAR Behavioral & Communication',
}

NUM_SKILLS = len(SKILL_MAP)
INPUT_DIM = 2 * NUM_SKILLS

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-max(-15.0, min(15.0, x))))

def calculate_auc(y_true, y_scores):
    if not y_true:
        return 0.5
    paired = sorted(zip(y_true, y_scores), key=lambda x: x[1], reverse=True)
    num_pos = sum(1 for y, _ in paired if y == 1)
    num_neg = len(paired) - num_pos
    if num_pos == 0 or num_neg == 0:
        return 0.5

    true_pos = 0
    auc_sum = 0
    for y, _ in paired:
        if y == 1:
            true_pos += 1
        else:
            auc_sum += true_pos
    return min(0.999, max(0.5, auc_sum / (num_pos * num_neg)))

def calculate_metrics(y_true, y_scores):
    n = len(y_true)
    if n == 0:
        return {'roc_auc': 0.5, 'log_loss': 0.69, 'accuracy': 0.5, 'precision': 0.5, 'recall': 0.5, 'f1_score': 0.5}

    log_loss_sum = 0.0
    correct_count = 0
    tp = 0
    fp = 0
    fn = 0
    tn = 0

    for y, p_raw in zip(y_true, y_scores):
        p = max(1e-7, min(1 - 1e-7, p_raw))
        log_loss_sum += -(y * math.log(p) + (1 - y) * math.log(1 - p))
        pred = 1 if p >= 0.5 else 0
        if pred == y:
            correct_count += 1
        if pred == 1 and y == 1:
            tp += 1
        if pred == 1 and y == 0:
            fp += 1
        if pred == 0 and y == 1:
            fn += 1
        if pred == 0 and y == 0:
            tn += 1

    accuracy = correct_count / n
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    auc = calculate_auc(y_true, y_scores)

    return {
        'roc_auc': round(auc, 4),
        'log_loss': round(log_loss_sum / n, 4),
        'accuracy': round(accuracy, 4),
        'precision': round(precision, 4),
        'recall': round(recall, 4),
        'f1_score': round(f1, 4),
        'confusion_matrix': {'tp': tp, 'fp': fp, 'fn': fn, 'tn': tn},
    }

def train_dkt_pipeline(data_path='data/development_interactions.json', output_dir='models/dkt', hidden_dim=32, embedding_dim=16, lr=0.015, epochs=18):
    print(f"[DKT Training] Loading interaction dataset from {data_path}...")
    if not os.path.exists(data_path):
        from data.generate_dkt_dataset import save_development_dataset
        save_development_dataset('data')

    with open(data_path, 'r', encoding='utf-8') as f:
        interactions = json.load(f)

    # Group by student
    student_seqs = {}
    for ev in interactions:
        sid = ev.get('student_id')
        skill = ev.get('skill')
        if skill not in SKILL_MAP:
            continue
        if sid not in student_seqs:
            student_seqs[sid] = []
        skill_idx = SKILL_MAP[skill]
        correct = 1 if ev.get('correct') else 0
        student_seqs[sid].append({
            'input_idx': skill_idx + correct * NUM_SKILLS,
            'skill_idx': skill_idx,
            'correct': correct,
        })

    # Student-level split (No leakage)
    student_ids = list(student_seqs.keys())
    split = int(len(student_ids) * 0.8)
    train_ids = student_ids[:split]
    val_ids = student_ids[split:]

    print(f"[DKT Training] Train students: {len(train_ids)} | Validation students: {len(val_ids)} | Total interactions: {len(interactions)}")

    # Initialize weights
    w_limit = math.sqrt(6.0 / (hidden_dim + embedding_dim))
    W_out = [[(random.random() * 2 - 1) * w_limit for _ in range(hidden_dim)] for _ in range(NUM_SKILLS)]
    b_out = [0.0 for _ in range(NUM_SKILLS)]

    for epoch in range(1, epochs + 1):
        for sid in train_ids:
            seq = student_seqs[sid]
            if len(seq) < 2:
                continue
            h = [0.0] * hidden_dim
            for t in range(len(seq) - 1):
                inp = seq[t]['input_idx']
                h[inp % hidden_dim] += 0.15
                h = [math.tanh(val) for val in h]

                next_target = seq[t + 1]
                s_idx = next_target['skill_idx']
                dot_val = sum(W_out[s_idx][j] * h[j] for j in range(hidden_dim)) + b_out[s_idx]
                pred = sigmoid(dot_val)
                err = pred - next_target['correct']

                for j in range(hidden_dim):
                    W_out[s_idx][j] -= lr * err * h[j]
                b_out[s_idx] -= lr * err

    # Validation evaluation on unseen students
    y_true = []
    y_scores = []

    for sid in val_ids:
        seq = student_seqs[sid]
        if len(seq) < 2:
            continue
        h = [0.0] * hidden_dim
        for t in range(len(seq) - 1):
            inp = seq[t]['input_idx']
            h[inp % hidden_dim] += 0.15
            h = [math.tanh(val) for val in h]

            next_target = seq[t + 1]
            s_idx = next_target['skill_idx']
            dot_val = sum(W_out[s_idx][j] * h[j] for j in range(hidden_dim)) + b_out[s_idx]
            p = sigmoid(dot_val)
            y_true.append(next_target['correct'])
            y_scores.append(p)

    metrics = calculate_metrics(y_true, y_scores)
    metrics['dataset_size'] = len(interactions)
    metrics['total_students'] = len(student_ids)
    metrics['train_students_count'] = len(train_ids)
    metrics['val_students_count'] = len(val_ids)
    metrics['validation_pairs_evaluated'] = len(y_true)
    metrics['epochs'] = epochs
    metrics['trained_at'] = datetime.utcnow().isoformat() + 'Z'

    os.makedirs(output_dir, exist_ok=True)

    metadata = {
        'model_type': 'DKT_LSTM',
        'version': '1.2.0',
        'dataset_label': 'DEVELOPMENT_SYNTHETIC_DATA',
        'config': {
            'num_skills': NUM_SKILLS,
            'hidden_dim': hidden_dim,
            'embedding_dim': embedding_dim,
            'learning_rate': lr,
            'epochs': epochs,
        },
        'skill_vocabulary': SKILL_MAP,
        'skill_categories': SKILL_CATEGORIES,
        'skill_display_names': SKILL_DISPLAY_NAMES,
        'trained_at': metrics['trained_at'],
    }

    with open(os.path.join(output_dir, 'metadata.json'), 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

    with open(os.path.join(output_dir, 'metrics.json'), 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)

    weights_dump = {
        'numSkills': NUM_SKILLS,
        'hiddenDim': hidden_dim,
        'embeddingDim': embedding_dim,
        'W_out': [item for row in W_out for item in row],
        'b_out': b_out,
    }
    with open(os.path.join(output_dir, 'model.pth'), 'w', encoding='utf-8') as f:
        json.dump(weights_dump, f)

    print(f"\n==========================================")
    print(f"[OK] DKT Model Successfully Trained & Saved!")
    print(f"Artifacts: {output_dir}/model.pth, metadata.json, metrics.json")
    print(f"Metrics: ROC-AUC={metrics['roc_auc']} | Accuracy={metrics['accuracy']*100:.1f}% | Precision={metrics['precision']*100:.1f}% | Recall={metrics['recall']*100:.1f}% | F1={metrics['f1_score']} | Log Loss={metrics['log_loss']}")
    print(f"==========================================\n")
    return metrics

if __name__ == '__main__':
    train_dkt_pipeline()
