"""
Deep Knowledge Tracing (DKT) LSTM Model Architecture.
Configurable PyTorch Neural Network predicting future skill mastery from sequential student interactions.
"""

import math
import json
import os

class DKTConfig:
    def __init__(self, num_skills=12, embedding_dim=32, hidden_dim=64, learning_rate=0.005, epochs=15, max_seq_len=50, dropout=0.2):
        self.num_skills = num_skills
        self.embedding_dim = embedding_dim
        self.hidden_dim = hidden_dim
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.max_seq_len = max_seq_len
        self.dropout = dropout

    def to_dict(self):
        return {
            "num_skills": self.num_skills,
            "embedding_dim": self.embedding_dim,
            "hidden_dim": self.hidden_dim,
            "learning_rate": self.learning_rate,
            "epochs": self.epochs,
            "max_seq_len": self.max_seq_len,
            "dropout": self.dropout,
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            num_skills=data.get("num_skills", 12),
            embedding_dim=data.get("embedding_dim", 32),
            hidden_dim=data.get("hidden_dim", 64),
            learning_rate=data.get("learning_rate", 0.005),
            epochs=data.get("epochs", 15),
            max_seq_len=data.get("max_seq_len", 50),
            dropout=data.get("dropout", 0.2),
        )

# Try importing torch if available, otherwise provide lightweight NumPy/Python implementation
try:
    import torch
    import torch.nn as nn

    class PyTorchDKT(nn.Module):
        def __init__(self, config: DKTConfig):
            super().__init__()
            self.config = config
            self.input_dim = 2 * config.num_skills  # skill_id + (1 if correct else 0) * num_skills
            self.embedding = nn.Embedding(self.input_dim, config.embedding_dim)
            self.lstm = nn.LSTM(config.embedding_dim, config.hidden_dim, batch_first=True)
            self.dropout = nn.Dropout(config.dropout)
            self.fc = nn.Linear(config.hidden_dim, config.num_skills)
            self.sigmoid = nn.Sigmoid()

        def forward(self, x):
            # x shape: (batch_size, seq_len)
            embedded = self.embedding(x)
            lstm_out, _ = self.lstm(embedded)
            lstm_out = self.dropout(lstm_out)
            logits = self.fc(lstm_out)
            output = self.sigmoid(logits)
            return output

except ImportError:
    PyTorchDKT = None
