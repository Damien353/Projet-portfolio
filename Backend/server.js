// Point d'entrée du serveur Express
const express = require('express');
const app = express();
const cors = require('cors');
const scoresRoutes = require('./routes/scores');

app.use(cors());
app.use(express.json());

app.use('/scores', scoresRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
