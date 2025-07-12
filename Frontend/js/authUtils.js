// Déconnexion automatique

export function estTokenExpire(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
}

export function deconnexionAuto() {
  alert("Votre session a expiré. Veuillez vous reconnecter.");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

export function verifierSessionOuRediriger() {
  const token = localStorage.getItem("token");
  if (!token || estTokenExpire(token)) {
    deconnexionAuto();
  }
}
