// logique tetris
const NB_COLONNES = 10;
const NB_LIGNES = 19;

const formes = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

let sac = [];

// Initialisation du plateau de jeu (matrice 2D)
let plateau = Array.from({ length: NB_LIGNES }, () =>
Array(NB_COLONNES).fill(0)
);

let pieceActuelle = genererNouvellePiece();

function genererNouvellePiece() {
  if (sac.length === 0) melangerFormes(); // remplit si vide
  const shape = sac.pop(); // tire une forme du sac
  console.log("Nouvelle pièce générée :", shape); //temporaire
  return {
    shape,
    x: 3,
    y: 0
  };
}

function dessinerPiece() {
  const { shape, x, y} = pieceActuelle;
  const conteneur = document.getElementById("plateau-jeu");
  const cases = conteneur.children;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        let posY = y + row;
        let posX = x + col;

        if (posY >= 0 && posY < NB_LIGNES && posX >= 0 && posX < NB_COLONNES) {
          const index = posY * NB_COLONNES + posX;
          cases[index].classList.add("active");
        }
      }
    }
  }
}

function viderPlateau() {
  for (let y = 0; y < NB_LIGNES; y++) {
    for (let x = 0; x < NB_COLONNES; x++) {
      plateau[y][x] = 0;
    }
  }
}

function drawPlateau() {
  const conteneur = document.getElementById("plateau-jeu");
  conteneur.innerHTML = ""; // Nettoie affichage
  for (let y = 0; y < NB_LIGNES; y++) {
    for (let x = 0; x < NB_COLONNES; x++) {
      const div = document.createElement("div");
      div.classList.add("case");

      if (plateau[y][x] === 1) {
        div.classList.add("active");
      }

      conteneur.appendChild(div);
    }
  }
}

function melangerFormes() { // sac aléatoire "7-bag"
  sac = [...formes].sort(() => Math.random() - 0.5);
}

function detectCollision(piece, x, y) {
  for (let i = 0; i < piece.shape.length; i++) {
    for (let j = 0; j < piece.shape[i].length; j++) {
      if (piece.shape[i][j]) {
        const newY = y + i;
        const newX = x + j;

        // Vérifie su la pièce dépasse les limites ou entre en collision avec une pièce
        if (
          newY >= NB_LIGNES || // touche le bas
          newX < 0 || newX >= NB_COLONNES || // hors bords horizontaux
          newY >= 0 && plateau[newY][newX] === 1 // touche une autre pièce
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function fixerPieceDansPlateau(piece) {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] === 1) {
        const y = piece.y + row;
        const x = piece.x + col;
        if (y >= 0 && y < NB_LIGNES && x >= 0 && x < NB_COLONNES) {
          plateau[y][x] = 1;
        }
      }
    }
  }
}

document.addEventListener("keydown", (event) => {
  let nouvelleX = pieceActuelle.x;
  let nouvelleY = pieceActuelle.y;

  if (event.key === "ArrowLeft") {
    nouvelleX -= 1;
  } else if (event.key === "ArrowRight") {
    nouvelleX += 1;
  } else if (event.key === "ArrowDown") {
    nouvelleY += 1;
  } else {
    return; // Ignorer autres touches
  }

  // Vérifie s'il y a collision à nouvelle position
  if (!detectCollision(pieceActuelle, nouvelleX, nouvelleY)) {
    pieceActuelle.x = nouvelleX;
    pieceActuelle.y = nouvelleY;

    // Met à jour l'affichage
    drawPlateau();
    dessinerPiece();
  }
});

setInterval(() => {
  if (!detectCollision(pieceActuelle, pieceActuelle.x, pieceActuelle.y +1)) {
    pieceActuelle.y += 1;
  } else {
    // Fixe la pièce dans le plateau définitivement
    fixerPieceDansPlateau(pieceActuelle);

    // Génère une nouvelle pièce
    pieceActuelle = genererNouvellePiece();
  }

  drawPlateau();
  dessinerPiece();
}, 500); // toutes les 500ms

//Appel au chargement de la page
drawPlateau();