// Routes GET/POST pour les scores
const express = require('express');
const router = express.Router();
const { db } = require('../db/database'); // fichier qui gère la connexion SQLite
const authenticateToken = require('../middlewares/authenticateToken');


// Ajouter un score
router.post('/', authenticateToken, (req, res) => {
  const userId = req.user.id; // récupéré via le token
  const { score } = req.body;

  if (typeof score !== 'number') {
    return res.status(400).json({ error: 'Score invalide.' });
  }

  const query = 'INSERT INTO scores (user_id, score) VALUES (?, ?)';
  db.run(query, [userId, score], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Récupérer les meilleurs scores
router.get('/', (req, res) => {
  const query = `
    SELECT users.username AS pseudo, scores.score, scores.created_at
    FROM scores
    JOIN users ON scores.user_id = users.id
    ORDER BY scores.score DESC
    LIMIT 10
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
