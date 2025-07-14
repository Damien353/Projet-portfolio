const authForm = document.getElementById('auth-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const toggleRegisterBtn = document.getElementById('toggle-register');
const authMessage = document.getElementById('auth-message');

let isRegister = false;

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

    // Succès
    localStorage.setItem('token', data.token);
    window.location.href = 'index.html'; // Redirection vers le jeu
  } catch (error) {
    authMessage.textContent = 'Erreur réseau, veuillez réessayer.';
  }
});
