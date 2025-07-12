// requêtes fetch vers backend
import { estTokenExpire, deconnexionAuto } from './authUtils.js';

export async function envoyerScore(score, token) {
  // Vérifier si le token est expiré avant d'envoyer la requête
  if (!token || estTokenExpire(token)) {
    deconnexionAuto();  // supprime token + redirige
    throw new Error("Session expirée, déconnexion automatique.");
  }
  const response = await fetch("/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ score }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erreur lors de l'envoi du score");
  }
}

export async function getTopScores() {
  try {
    const response = await fetch("http://localhost:3000/scores");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des scores");
    }

    const scores = await response.json();
    return scores;
  } catch (error) {
    console.error("Erreur de récupération des scores :", error);
    return [];
  }
}
