-- Script de création de table
CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO scores (pseudo, score) VALUES ('Alice', 1200);
INSERT INTO scores (pseudo, score) VALUES ('Dylan', 850);
INSERT INTO scores (pseudo, score) VALUES ('Charles', 1400);
INSERT INTO scores (pseudo, score) VALUES ('Bob', 900);
INSERT INTO scores (pseudo, score) VALUES ('TestUser', 300);