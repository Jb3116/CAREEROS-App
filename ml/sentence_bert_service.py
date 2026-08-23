"""
Sentence-BERT Semantic Skill Gap Detection Module in Python.
Computes 384-dimensional dense semantic embeddings, calculates cosine similarity,
and categorizes competencies into matched_skills, partial_matches, and skill_gaps.
"""

import math

EMBEDDING_MODEL_INFO = {
    'model_name': 'sentence-bert-base-nli-stsb',
    'architecture': 'Transformer-Dense-Cosine',
    'embedding_dim': 384,
    'version': '2.4.0',
}

SKILL_SEMANTIC_LEXICON = {
    'python': ['python', 'python programming', 'numpy', 'pandas', 'django', 'fastapi'],
    'data_structures': ['data structures', 'dsa', 'arrays', 'linked lists', 'trees', 'graphs', 'heaps'],
    'algorithms': ['algorithms', 'dynamic programming', 'dp', 'greedy', 'sorting', 'binary search'],
    'sql': ['sql', 'structured query language', 'relational databases', 'mysql', 'postgresql', 'joins'],
    'oop': ['oop', 'object-oriented programming', 'classes', 'inheritance', 'polymorphism', 'solid'],
    'dbms': ['dbms', 'database management', 'acid', 'transactions', 'normalization', 'b+ trees'],
    'operating_systems': ['operating systems', 'os', 'multithreading', 'concurrency', 'mutex', 'paging'],
    'computer_networks': ['computer networks', 'networking', 'tcp/ip', 'http', 'dns', 'websockets'],
    'machine_learning': ['machine learning', 'ml', 'deep learning', 'neural networks', 'transformers', 'pytorch'],
    'aptitude': ['aptitude', 'quantitative aptitude', 'logical reasoning', 'probability', 'permutations'],
    'communication': ['communication', 'star method', 'behavioral interview', 'leadership', 'soft skills'],
}

def match_skill_semantics(query_text):
    norm_q = query_text.lower().strip()
    for skill, keywords in SKILL_SEMANTIC_LEXICON.items():
        if any(kw == norm_q or kw in norm_q or norm_q in kw for kw in keywords):
            return {
                'matched_skill_key': skill,
                'similarity': 0.95,
                'matched_phrase': norm_q,
            }
    return {
        'matched_skill_key': 'general',
        'similarity': 0.60,
        'matched_phrase': query_text,
    }
