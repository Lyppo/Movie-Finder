import { 
    load, getCookies, logoutClear, loged, 
    createRequestToken, createAccessToken, 
    createSession, request, logoutRequest 
} from './api.js';

import { ouvrirPopupLogin } from './popup.js';
import { creerElement, creerElementsDepuisHTML, removeElement } from './html.js';

// 🟢 CHARGEMENT INITIAL
document.addEventListener("DOMContentLoaded", async () => {
    load(); // Charge les cookies
    setupUI(); // Initialise l'interface utilisateur
    await verifyLoginStatus(); // Vérifie l'état de connexion
});

// 🟠 CONFIGURATION DE L'INTERFACE UTILISATEUR
function setupUI() {
    creerElementsDepuisHTML(`<img id="poster" src="Images/Default.png" alt="Default Image" />`, "#zenith");

    creerElementsDepuisHTML(`<div id="container-img"></div>`, "#app");
    creerElementsDepuisHTML(`<h2>Default Movie</h2>`, "#app");

    // Création du conteneur de boutons
    let div = creerElementsDepuisHTML(`<div id="buttons"></div>`, "#app");
    div = document.getElementById("buttons");
    
    div.appendChild(creerElementsDepuisHTML(`<button id="like">❤️ Ajouter aux favoris</button>`));
    div.appendChild(creerElementsDepuisHTML(`<button id="next">➡️ Suivant</button>`));
}

// 🔵 AUTHENTIFICATION : CONNEXION
async function login(event) {
    event?.preventDefault(); // Empêche le rechargement de la page
    toggleButtonState("btnLogin", false); // Désactive le bouton temporairement

    const tmpToken = await createRequestToken();
    let authenticated = false;
    let attempts = 0;

    while (!authenticated && attempts < 3) {
        authenticated = await ouvrirPopupLogin(tmpToken);
        if (!authenticated) {
            console.warn(`❌ Tentative d'authentification échouée (${attempts + 1}/3)`);
            attempts++;
        }
    }

    if (!authenticated) {
        console.error("🚨 Échec de l'authentification après 3 tentatives.");
        toggleButtonState("btnLogin", true);
        return;
    }

    await createAccessToken(tmpToken);
    await createSession();

    removeElement("#btnLogin");

    updateUIAfterLogin();
}

// 🔴 AUTHENTIFICATION : DÉCONNEXION
async function logout(event) {
    event?.preventDefault();
    toggleButtonState("btnLogout", false);

    try {
        // Suppression des cookies
        ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"].forEach(cookieName => {
            document.cookie = `${cookieName}=; max-age=0; path=/;`;
        });

        // Suppression de la session TMDB
        const sessionDeletion = await request(
            "https://api.themoviedb.org/3/authentication/session", 
            "DELETE", 
            {}, 
            { session_id: '' }
        );

        if (!sessionDeletion.success) throw new Error("Erreur lors de la suppression de la session.");

        // Suppression du token TMDB
        const tokenDeletion = await logoutRequest();
        if (!tokenDeletion.success) throw new Error("Erreur lors de la suppression du token.");

        logoutClear();

        removeElement("#btnLogout");

        updateUIAfterLogout();
    } catch (error) {
        console.error(`🚨 ${error.message}`);
        toggleButtonState("btnLogout", true);
    }
}

// 🔄 MISE À JOUR UI : APRÈS CONNEXION
function updateUIAfterLogin() {
    creerElementsDepuisHTML(`<button id="btnLogout">Se déconnecter</button>`, "#zenith")
        .addEventListener("click", logout);
}

// 🔄 MISE À JOUR UI : APRÈS DÉCONNEXION
function updateUIAfterLogout() {
    creerElementsDepuisHTML(`<button id="btnLogin">Se connecter</button>`, "#zenith")
        .addEventListener("click", login);
}

// 🔍 VÉRIFICATION DE L'ÉTAT DE CONNEXION
async function verifyLoginStatus() {
    if (await loged()) {
        updateUIAfterLogin();
    } else {
        updateUIAfterLogout();
    }
}

// 🔄 FONCTION UTILITAIRE : ACTIVER/DÉSACTIVER UN BOUTON
function toggleButtonState(buttonId, enabled) {
    const button = document.getElementById(buttonId);
    if (button) button.disabled = !enabled;
}