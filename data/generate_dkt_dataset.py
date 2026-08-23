"""
CAREEROS - Synthetic Development Dataset Generator for Deep Knowledge Tracing (DKT) in Python

DISCLAIMER / LABELING:
[SYNTHETIC DEVELOPMENT DATASET - NOT REAL STUDENT BEHAVIOR]
This dataset is procedurally generated strictly for local development, model calibration,
benchmarking, and unit testing of sequential knowledge tracing architectures.
"""

import json
import os
import random
from datetime import datetime, timedelta

SKILL_CONCEPTS = [
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
]

def generate_synthetic_interactions(num_students=250, min_attempts=30, max_attempts=80):
    dataset = []
    for s in range(1, num_students + 1):
        student_id = f"student_{s:04d}"
        is_advanced = random.random() > 0.6
        student_base_aptitude = random.uniform(0.65, 0.90) if is_advanced else random.uniform(0.35, 0.65)
        learning_rate = random.uniform(0.03, 0.08)
        attempts_count = random.randint(min_attempts, max_attempts)

        latent_mastery = {
            skill: max(0.15, min(0.85, student_base_aptitude + random.uniform(-0.1, 0.1)))
            for skill in SKILL_CONCEPTS
        }

        current_time = datetime.utcnow() - timedelta(hours=attempts_count * 8)

        for i in range(1, attempts_count + 1):
            skill = random.choice(SKILL_CONCEPTS)
            difficulty = random.choice(['easy', 'medium', 'hard'])
            diff_penalty = 0.22 if difficulty == 'hard' else 0.08 if difficulty == 'medium' else -0.05

            p_correct = max(0.08, min(0.92, latent_mastery[skill] - diff_penalty + random.uniform(-0.03, 0.03)))
            is_correct = 1 if random.random() < p_correct else 0

            if is_correct:
                latent_mastery[skill] = min(0.96, latent_mastery[skill] + learning_rate)
            else:
                latent_mastery[skill] = max(0.10, latent_mastery[skill] - learning_rate * 0.25)

            current_time += timedelta(minutes=random.randint(20, 90))

            dataset.append({
                'dataset_type': 'DEVELOPMENT_SYNTHETIC_DATA',
                'student_id': student_id,
                'attempt_index': i,
                'skill': skill,
                'difficulty': difficulty,
                'correct': is_correct,
                'activity': 'practice_problem',
                'timestamp': current_time.isoformat() + 'Z',
            })
    return dataset

def save_development_dataset(output_dir='./data'):
    os.makedirs(output_dir, exist_ok=True)
    dataset = generate_synthetic_interactions(250, 30, 80)
    target_path = os.path.join(output_dir, 'development_interactions.json')
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, indent=2)
    print(f"[DKT Python Synthetic Data] Generated {len(dataset)} student interaction events across 250 students -> {target_path}")
    return dataset

if __name__ == '__main__':
    save_development_dataset()
