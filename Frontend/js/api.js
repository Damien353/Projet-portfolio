// requêtes fetch vers backend
export async function envoyerScore(pseudo, score) {
  try {
    const response = await fetch("http://localhost:3000/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pseudo, score }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi du score");
    }

    const data = await response.json();
    console.log("Score enregistré :", data);
    return data;
  } catch (error) {
    console.error("Erreur réseau :", error);
    throw error;
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
