import { verifierSessionOuRediriger } from './authUtils.js';

document.addEventListener('DOMContentLoaded', () => {
  verifierSessionOuRediriger();

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  fetch('/api/users/me', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('profile-username').textContent = data.username || 'Inconnu';
      document.getElementById('profile-best-score').textContent = data.bestScore ?? 'Non disponible';
    })
    .catch(err => {
      console.error('Erreur lors du chargement du profil', err);
    });

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });
});
