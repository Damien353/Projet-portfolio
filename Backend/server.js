// Point d'entrée du serveur Express
const express = require('express');
const app = express();
const cors = require('cors');
const scoresRoutes = require('./routes/scores');
const authRoutes = require('./routes/auth');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/scores', scoresRoutes);
app.use('/api', authRoutes);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, '../Frontend')));
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
