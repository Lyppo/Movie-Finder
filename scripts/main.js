// main.js
import { load, loged, createRequestToken, createAccessToken, createSession, request } from './api.js';
import { ouvrirPopupLogin } from './popup.js';

async function login(event) {

    event.preventDefault(); // Empêche le comportement par défaut du bouton

    const tmpToken = await createRequestToken(); // Crée un token de demande

    let authenticated = false;

    while (!authenticated) {
        authenticated = await ouvrirPopupLogin(tmpToken); // Attendre que l'utilisateur s'authentifie
    }

    await createAccessToken(tmpToken); // Crée un token d'accès si authentifié

    await createSession(); // Crée une session pour l'utilisateur authentifié

    console.log("Connecté !");// Vérifier les cookies dans la console
    console.log(document.cookie);

    document.getElementById("btnLogin").textContent = "Connecté";
    document.getElementById("btnLogin").removeEventListener("click", login);

    while (await loged()); // test combien de temps avant de se faire déconnecter

    console.log("Déconnecté !");

}

load(); // Récupère les cookies et charge les valeurs


if (await loged()) {
    console.log("Connecté !\nvia les cookies");
    document.getElementById("btnLogin").textContent = "Connecté";
}
else {
    document.getElementById("btnLogin").addEventListener("click", login); // Ajoute un écouteur d'événement au bouton
}