const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {db, getAsync } = require('../db/database');

const router = express.Router();

// Clé secrète pour signer les tokens (à cacher plus tard avec dotenv)
const SECRET_KEY = 'secret123';

// ========== POST /api/register ==========
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username et mot de passe requis.' });
  }

  try {
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(409).json({ error: 'Ce pseudo est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);

    return res.status(201).json({ message: 'Utilisateur créé avec succès.' });

  } catch (err) {
    console.error('Erreur à l’inscription :', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== POST /api/login ==========
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username et mot de passe requis.' });
  }

  try {
    const user = await getAsync('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
