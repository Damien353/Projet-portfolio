// logique tetris
import { verifierSessionOuRediriger } from './authUtils.js';
import { envoyerScore, getTopScores } from "./api.js";

document.addEventListener('DOMContentLoaded', () => {
  verifierSessionOuRediriger();

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

  const couleurs = [
    "cyan",     // I
    "yellow",   // O
    "purple",   // T
    "green",    // S
    "red",      // Z
    "blue",     // J
    "orange"    // L
  ];

  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  pauseBtn.disabled = true;


  let sac = [];

  let intervalId = null;
  let score = 0;
  let enCours = false;
  let enPause = false;
  let vitesse = 500; // en millisecondes


  // Initialisation du plateau de jeu (matrice 2D)
  let plateau = Array.from({ length: NB_LIGNES }, () =>
  Array(NB_COLONNES).fill(0)
  );

  let pieceActuelle = genererNouvellePiece();

  function genererNouvellePiece() {
    if (sac.length === 0) melangerFormes(); // remplit si vide
    const index = sac.pop(); // tire index au lieu d'une forme directement
    const shape = formes[index];
    const couleur = couleurs[index];
    return {
      shape,
      couleur,
      x: 3,
      y: 0
    };
  }

  let nextPiece = genererNouvellePiece();

  function afficherProchainePiece(piece) {
    const nextGrid = document.getElementById('next-piece-grid');
    nextGrid.innerHTML = ''; // Vider l'ancienne grille

    const taille = 4; // Grille 4x4 pour afficher la pièce

    // Créer une mini grille 4x4
    for (let y = 0; y < taille; y++) {
      for (let x = 0; x < taille; x++) {
        const caseDiv = document.createElement('div');
        caseDiv.classList.add('case');
        nextGrid.appendChild(caseDiv);
      }
    }

    // Activer les cases correspondantes à la forme
    const cases = nextGrid.querySelectorAll('.case');
    piece.shape.forEach((ligne, dy) => {
      ligne.forEach((val, dx) => {
        if (val) {
          const index = (dy * taille) + dx;
          if (cases[index]) {
            cases[index].classList.add('active');
            cases[index].style.backgroundColor = piece.couleur || '#0ff';
          }
        }
      });
    });
  }

  afficherProchainePiece(nextPiece);

  function dessinerPiece() {
    const { shape, x, y, couleur } = pieceActuelle;
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
            cases[index].style.backgroundColor = pieceActuelle.couleur;
          }
        }
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

        if (plateau[y][x] !== 0) {
          div.classList.add("active");
          div.style.backgroundColor = plateau[y][x];
        }

        conteneur.appendChild(div);
      }
    }
  }

  function melangerFormes() { // sac aléatoire "7-bag"
    sac = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
  }

  function tournerPiece(piece) {
    const ancienneForme = piece.shape;
    const nouvelleForme = [];

    for (let col = 0; col < ancienneForme[0].length; col++) {
      const nouvelleLigne = [];
      for (let row = ancienneForme.length - 1; row >= 0; row--) {
        nouvelleLigne.push(ancienneForme[row][col]);
      }
      nouvelleForme.push(nouvelleLigne);
    }

    //Vérifie si collision ou non après rotation
    if (!detectCollision({ shape: nouvelleForme, x: piece.x, y: piece.y}, piece.x, piece.y)) {
      piece.shape = nouvelleForme;
    }
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
            newY >= 0 && plateau[newY][newX] !== 0 // touche une autre pièce
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
            plateau[y][x] = piece.couleur;
          }
        }
      }
    }
  }

  function supprimerLignesCompletes() {
    let lignesSupprimees = 0;

    for (let y = NB_LIGNES - 1; y >= 0; y--) {
      if (plateau[y].every(cell => cell !== 0)) {
        plateau.splice(y, 1); // supprime la ligne
        plateau.unshift(new Array(NB_COLONNES).fill(0)); // ajoute une ligne vide en haut
        lignesSupprimees++;
        y++; //re-vérifie la ligne car tout descend
      }
    }
    return lignesSupprimees;
  }

  function mettreAJourScore(nbLignes) {
    score += nbLignes * 100;
    const scoreSpan = document.getElementById("score");
    scoreSpan.textContent = score;
  }

  function mettreAJourVitesse(nbLignes) {
    vitesse = Math.max(100, vitesse - nbLignes * 20); // On peut ajuster ici pour autre rythme
    clearInterval(intervalId);
    intervalId = setInterval(boucleJeu, vitesse);
  }

  function estGameOver(piece) {
    return detectCollision(piece, piece.x, piece.y);
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
    } else if (event.key === "ArrowUp") {
      tournerPiece(pieceActuelle); // Pour la rotation
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

  window.addEventListener("keydown", function(e) {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "]; // espace inclus
    if (keys.includes(e.key)) {
      e.preventDefault();
    }
  }, { passive: false });


  function demarrerPartie() {
    // Réinitialisations
    plateau = Array.from({ length: NB_LIGNES }, () => Array(NB_COLONNES).fill(0));
    pieceActuelle = genererNouvellePiece();
    score = 0;
    document.getElementById("score").textContent = "0"; // reset visuel
    enCours = true;
    enPause = false;
    vitesse = 500;

    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    // Redémarre la boucle de jeu
    intervalId = setInterval(boucleJeu, vitesse);
    pauseBtn.disabled = false; // Active bouton pause
    pauseBtn.textContent = "Pause";
    startBtn.textContent = "Restart"
  }

  function boucleJeu() {
    if (!detectCollision(pieceActuelle, pieceActuelle.x, pieceActuelle.y +1)) {
      pieceActuelle.y += 1;
    } else {
      // Fixe la pièce dans le plateau définitivement
      fixerPieceDansPlateau(pieceActuelle);
      const nbLignes = supprimerLignesCompletes();
      if (nbLignes > 0) {
        mettreAJourScore(nbLignes);
        mettreAJourVitesse(nbLignes);
      }

      // Génère la nouvelle pièce à partir de celle en attente
      pieceActuelle = nextPiece;
      pieceActuelle.x = 3;
      pieceActuelle.y = 0;
      nextPiece = genererNouvellePiece();
      afficherProchainePiece(nextPiece);

      if (estGameOver(pieceActuelle)) {
        clearInterval(intervalId);
        enCours = false;
        pauseBtn.disabled = true;
        startBtn.textContent = "Démarrer";
        finPartie();
        return;
      }
    }

      drawPlateau();
      dessinerPiece();
    }

  function mettreEnPause() {
    if (!enCours) return;
    enPause = true;
    clearInterval(intervalId);
  }

  function reprendrePartie() {
    if (!enCours) return;
    enPause = false;
    intervalId = setInterval(boucleJeu, 500);
  }

  async function finPartie() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Connecte-toi pour enregistrer ton score.");
      return;
    }

    try {
      await envoyerScore(score, token);
      alert("Score enregistré !");
      const topScores = await getTopScores();
      afficherTopScores(topScores);
    } catch (err) {
      alert("Erreur lors de l'envoi ou la récupération des scores : " + err.message);
    }
  }

  function afficherTopScores(scores) {
    const liste = document.getElementById("liste-scores");
    liste.innerHTML = ""; // Vide la liste avant mise à jour
    scores.forEach(({ pseudo, score }) => {
      const li = document.createElement("li");
      li.textContent = `${pseudo} : ${score}`;
      liste.appendChild(li);
    });
  }

  startBtn.addEventListener("click", () => {
    demarrerPartie();
  });

  pauseBtn.addEventListener("click", () => {
    if (!enPause) {
      mettreEnPause();
      pauseBtn.textContent = "Reprendre";
    } else {
      reprendrePartie();
      pauseBtn.textContent = "Pause";
    }
  });

  document.getElementById("start-btn").addEventListener("click", demarrerPartie);
});
