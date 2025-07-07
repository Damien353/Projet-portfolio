-- Création de la table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- Script de création de table
CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertion d'utilisateurs de test
INSERT INTO users (username, password_hash) VALUES 
('Alice', '$2b$10$TqEEGS8yhSpCyhvxtUc4.OVFu626K8EM3H5Yx0.iRfy0lkGIkhv9u'), 
('Dylan', '$2b$10$UvQY5t6K.fShXYAoda/0c.SM0JvWfuK2tO210sf5G/62l/Kk2uNI.'),
('Charles', '$2b$10$RBvzDuOuNV0U6akIpnkem.uRMqaxXJzCJhI.39YbyDgb7NIb0klbm'),
('Bob', '$2b$10$/uA0q3AyRipuKu7YRhCqL.1doBTFq6AhI2Jt9Y75SU2aUiN4c7uq.'),
('TestUser', '$2b$10$t5xL89eqtW7Dm9SfjDF5ZuWU5EAYVKTM8iYd/AsMhiJuWYYHhg9li');

-- Insertion de scores avec liaison correcte via SELECT id FROM users

INSERT INTO scores (user_id, score)
  SELECT id, 1200 FROM users WHERE username = 'Alice';

INSERT INTO scores (user_id, score)
  SELECT id, 850 FROM users WHERE username = 'Dylan';

INSERT INTO scores (user_id, score)
  SELECT id, 1400 FROM users WHERE username = 'Charles';

INSERT INTO scores (user_id, score)
  SELECT id, 900 FROM users WHERE username = 'Bob';

INSERT INTO scores (user_id, score)
  SELECT id, 300 FROM users WHERE username = 'TestUser';