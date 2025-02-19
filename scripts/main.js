// main.js
import { createRequestToken, createAccessToken, request } from './api.js';
import { ouvrirPopupLogin } from './popup.js';

async function login(event) {
    event.preventDefault(); // Empêche le comportement par défaut du bouton

    const tmpToken = await createRequestToken(); // Crée un token de demande

    const authenticated = await ouvrirPopupLogin(tmpToken); // Attendre que l'utilisateur s'authentifie

    if (authenticated) {
        const data = await createAccessToken(tmpToken); // Crée un token d'accès si authentifié
        console.log("✅ Access Token :", data.access_token);
        console.log("✅ Account ID :", data.account_id);
        console.log(await request(data.account_id, data.access_token)); // Requête de test

    } else { 
        console.error("Erreur lors de l'authentification !");
    }
}

document.getElementById("btnLogin").addEventListener("click", login); // Ajoute un écouteur d'événement au bouton