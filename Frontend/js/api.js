// requêtes fetch vers backend
export async function envoyerScore(score, token) {
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
