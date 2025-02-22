import { load, getCookies, logoutClear, loged, createRequestToken, createAccessToken, createSession, request, logoutRequest } from './api.js';
import { ouvrirPopupLogin } from './popup.js';
import { creerElement, creerElementsDepuisHTML, removeElement } from './html.js';

// 🟢 CHARGEMENT INITIAL
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🟢 Chargement initial..."); // Message de débogage
    load(); // Charge les cookies
    setupUI(); // Initialise l'interface utilisateur
    setupTest(); // Initialise les tests
    await verifyLoginStatus(); // Vérifie l'état de connexion
});

// 🟠 CONFIGURATION DE L'INTERFACE UTILISATEUR
function setupUI() {
    console.log("🟠 Configuration de l'interface utilisateur..."); // Message de débogage
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
    console.log("🔵 Tentative de connexion..."); // Message de débogage

    const tmpToken = await createRequestToken();
    let authenticated = false;
    let attempts = 0;

    while (!authenticated && attempts < 3) {
        authenticated = await ouvrirPopupLogin(tmpToken);
        if (!authenticated) {
            console.warn(`❌ Tentative d'authentification échouée (${attempts + 1}/3)`); // Message de débogage
            attempts++;
        }
    }

    if (!authenticated) {
        console.error("🚨 Échec de l'authentification après 3 tentatives."); // Message d'erreur
        toggleButtonState("btnLogin", true);
        return;
    }

    await createAccessToken(tmpToken);
    await createSession();

    removeElement("#btnLogin");
    updateUIAfterLogin();
    console.log("🔵 Connexion réussie !"); // Message de débogage
}

// 🔴 AUTHENTIFICATION : DÉCONNEXION
async function logout(event) {
    event?.preventDefault();
    toggleButtonState("btnLogout", false);
    console.log("🔴 Tentative de déconnexion..."); // Message de débogage

    try {
        // Suppression des cookies
        ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"].forEach(cookieName => {
            document.cookie = `${cookieName}=; max-age=0; path=/;`;
            console.log(`🗑️ Cookie supprimé: ${cookieName}`); // Message de débogage
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
        console.log("🔴 Déconnexion réussie !"); // Message de débogage
    } catch (error) {
        console.error(`🚨 ${error.message}`); // Message d'erreur
        toggleButtonState("btnLogout", true);
    }
}

// 🔄 MISE À JOUR UI : APRÈS CONNEXION
function updateUIAfterLogin() {
    console.log("🔄 Mise à jour de l'UI après connexion..."); // Message de débogage
    creerElementsDepuisHTML(`<button id="btnLogout">Se déconnecter</button>`, "#zenith")
        .addEventListener("click", logout);
}

// 🔄 MISE À JOUR UI : APRÈS DÉCONNEXION
function updateUIAfterLogout() {
    console.log("🔄 Mise à jour de l'UI après déconnexion..."); // Message de débogage
    creerElementsDepuisHTML(`<button id="btnLogin">Se connecter</button>`, "#zenith")
        .addEventListener("click", login);
}

// 🔍 VÉRIFICATION DE L'ÉTAT DE CONNEXION
async function verifyLoginStatus() {
    console.log("🔍 Vérification de l'état de connexion..."); // Message de débogage
    if (await loged()) {
        updateUIAfterLogin();
    } else {
        updateUIAfterLogout();
    }
}

// 🔄 FONCTION UTILITAIRE : ACTIVER/DÉSACTIVER UN BOUTON
function toggleButtonState(buttonId, enabled) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = !enabled;
        console.log(`🔘 État du bouton ${buttonId} : ${enabled ? 'activé' : 'désactivé'}`); // Message de débogage
    }
}

async function loadImage(element, imagePath) {
    const resolutions = [
        { size: 'w45', width: 45 },
        { size: 'w92', width: 92 },
        { size: 'w154', width: 154 },
        { size: 'w185', width: 185 },
        { size: 'w300', width: 300 },
        { size: 'w342', width: 342 },
        { size: 'w500', width: 500 },
        { size: 'w780', width: 780 },
        { size: 'w1280', width: 1280 },
        { size: 'original', width: Infinity }
    ];

    // Afficher la largeur de l'élément
    console.log("📏 Élément largeur:", element.clientWidth);

    // Fonction pour calculer le flou
    function calculateBlur(elementWidth, loadedWidth) {
        const blur = Math.max(15 - (loadedWidth / 20), 0); // Ajuster selon besoin
        console.log(`🌫️ Calcul du flou: ${blur} (Élément Largeur: ${elementWidth}, Chargé Largeur: ${loadedWidth})`);
        return blur;
    }

    // Variable pour suivre l'indice de l'image chargée
    let lastLoadedIndex = -1;

    // Fonction asynchrone pour charger l'image
    async function loadImageAtIndex(index) {
        if (index < 0 || index >= resolutions.length) return; // Vérifier l'indice

        const res = resolutions[index]; // Obtenir la résolution actuelle
        // Si l'indice est inférieur à lastLoadedIndex, ne rien faire
        if (lastLoadedIndex >= index) return;

        console.log(`🔄 Chargement de l'image à l'indice ${index}: ${res.size}`);
        
        let img = new Image();
        img.src = `https://image.tmdb.org/t/p/${res.size}${imagePath}`;

        // Lorsque l'image est chargée
        img.onload = () => {
            console.log(`✅ Image chargée: ${img.src}`);
            lastLoadedIndex = index; // Mettre à jour l'indice
            element.src = img.src; // Changer le src de l'élément
            element.style.filter = `blur(${calculateBlur(element.clientWidth, res.width)}px)`; // Appliquer le flou
        };

        // Retourner une promesse qui se résout lorsque l'image est chargée
        return new Promise((resolve) => {
            img.onload = () => {
                lastLoadedIndex = index; // Mettre à jour l'indice
                element.src = img.src; // Changer le src de l'élément
                element.style.filter = `blur(${calculateBlur(element.clientWidth, res.width)}px)`; // Appliquer le flou
                resolve(index); // Résoudre la promesse une fois l'image chargée
            };
        });
    }

    // Appeler la fonction pour charger toutes les résolutions, une par une
    for (let i = 0; i < resolutions.length; i++) {
        await loadImageAtIndex(i);
    }
}

// Exemple d'utilisation
async function getUser() {
    console.log("🔍 Chargement des données utilisateur..."); // Message de débogage
    let data = await request("https://api.themoviedb.org/3/account/{account_id}", "GET", { session_id: '' });
    let poster = document.getElementById("poster");
    console.log("🔍 Chargement de l'image pour l'utilisateur...");
    loadImage(poster, data.avatar.tmdb.avatar_path);
}

function setupTest() {
    console.log("🔧 Configuration des tests..."); // Message de débogage
    creerElementsDepuisHTML(`<button style="top: 0px; left: 0px;" id="testuser">User</button>`, "#zenith")
        .addEventListener("click", getUser);
    console.log('🔧 Bouton de test créé.'); // Message de débogage
}