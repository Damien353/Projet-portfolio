// Routes GET/POST pour les scores
const express = require('express');
const router = express.Router();
const db = require('../db/database'); // fichier qui gère la connexion SQLite

// Ajouter un score
router.post('/', (req, res) => {
  const { pseudo, score } = req.body;
  if (!pseudo || typeof score !== 'number') {
    return res.status(400).json({ error: 'Pseudo et score requis.' });
  }

  const query = 'INSERT INTO scores (pseudo, score) VALUES (?, ?)';
  db.run(query, [pseudo, score], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Récupérer les meilleurs scores
router.get('/', (req, res) => {
  const query = 'SELECT pseudo, score, created_at FROM scores ORDER BY score DESC LIMIT 10';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
