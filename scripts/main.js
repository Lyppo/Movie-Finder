// main.js
import { load, loged, createRequestToken, createAccessToken, createSession, request } from './api.js';
import { ouvrirPopupLogin } from './popup.js';
import { creerElementsDepuisHTML, removeElement } from './html.js';

async function login(event) {

    event.preventDefault(); // Empêche le comportement par défaut du bouton

    document.getElementById("btnLogin").removeEventListener("click", login); // Supprime l'écouteur d'événement du bouton

    const tmpToken = await createRequestToken(); // Crée un token de demande

    let authenticated = false;

    let i = 0;

    while (!authenticated) {
        authenticated = await ouvrirPopupLogin(tmpToken); // Attendre que l'utilisateur s'authentifie
        if (!authenticated) {
            console.log("Authentification échouée.");
            if (i++ > 2) {
                console.log("Trop de tentatives.");
                return null;
            }
        }
    }

    await createAccessToken(tmpToken); // Crée un token d'accès si authentifié

    await createSession(); // Crée une session pour l'utilisateur authentifié

    console.log("Connecté !");
    
    removeElement("#btnLogin");

    while (await loged()); // test combien de temps avant de se faire déconnecter

    console.log("Déconnecté !");

}

load(); // Récupère les cookies et charge les valeurs


if (await loged()) {
    console.log("Connecté ! via les cookies");
}
else {
    creerElementsDepuisHTML("body", 0, `<button id="btnLogin">Se connecter</button>`).btnLogin.addEventListener("click", login); // Ajoute un écouteur d'événement au bouton
}