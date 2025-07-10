const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const authenticateToken = require('../middlewares/authenticateToken');

// Récupérer les infos du profil utilisateur connecté
router.get('/me', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT username, (SELECT MAX(score) FROM scores WHERE user_id = ?) AS bestScore FROM users WHERE id = ?';
  db.get(query, [userId, userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json(row);
  });
});

module.exports = router;
