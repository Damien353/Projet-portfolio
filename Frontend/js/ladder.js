// affichage du classement
async function fetchScores() {
  try {
    const response = await fetch('http://localhost:3000/scores');
    const data = await response.json();

    const tbody = document.getElementById('score-table-body');
    tbody.innerHTML = '';

    data.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.pseudo}</td>
        <td>${entry.score}</td>
        <td>${new Date(entry.created_at).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des scores :', err);
  }
}

fetchScores();
