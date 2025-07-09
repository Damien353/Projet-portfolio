const authForm = document.getElementById('auth-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toggleRegisterBtn = document.getElementById('toggle-register');
const authMessage = document.getElementById('auth-message');
const authContainer = document.getElementById('auth-container');
const logoutBtn = document.getElementById('logout-btn');

let isRegister = false; // mode connexion par défaut

// Au chargement, afficher le formulaire ou le jeu selon token
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    authContainer.style.display = 'none';
    document.getElementById('conteneur-jeu').style.display = 'flex';
    logoutBtn.style.display = 'inline-block';
  } else {
    authContainer.style.display = 'block';
    document.getElementById('conteneur-jeu').style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});

toggleRegisterBtn.addEventListener('click', () => {
  isRegister = !isRegister;
  submitBtn.textContent = isRegister ? 'Créer un compte' : 'Se connecter';
  toggleRegisterBtn.textContent = isRegister ? 'Se connecter' : 'Créer un compte';
  authMessage.textContent = '';
  authForm.reset();
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    authMessage.textContent = 'Merci de remplir tous les champs.';
    return;
  }

  const url = isRegister ? '/auth/register' : '/auth/login';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      authMessage.textContent = data.error || 'Erreur inconnue';
      return;
    }

    // Connexion / inscription réussie
    localStorage.setItem('token', data.token);
    authMessage.textContent = isRegister
      ? `Compte créé avec succès, bienvenue ${data.user.username} !`
      : `Bienvenue ${data.user.username} !`;

    authContainer.style.display = 'none';
    document.getElementById('conteneur-jeu').style.display = 'flex';
    logoutBtn.style.display = 'inline-block';

  } catch (error) {
    authMessage.textContent = 'Erreur réseau, veuillez réessayer.';
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  authContainer.style.display = 'block';
  document.getElementById('conteneur-jeu').style.display = 'none';
  logoutBtn.style.display = 'none';
  authForm.reset();
  authMessage.textContent = '';
  if (isRegister) {
    toggleRegisterBtn.click(); // Revenir au mode login par défaut
  }
});
