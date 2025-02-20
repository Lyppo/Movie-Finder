// main.js
import { load, loged, createRequestToken, createAccessToken, createSession, request } from './api.js';
import { ouvrirPopupLogin } from './popup.js';
import { creerElement, creerElementsDepuisHTML, removeElement } from './html.js';

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

    creerElement({tag: "button", id : "btnLogout", textContent : "Se déconnecter", parent : "#zenith"}).addEventListener("click", logout);

    while (await loged()); // test combien de temps avant de se faire déconnecter

    console.log("Déconnecté !");

}

load(); // Récupère les cookies et charge les valeurs

async function logout(event) {
    console.log("Déconnexion...");
    document.cookie.split(";").forEach((cookie) => {
        let name = cookie.split("=")[0].trim();
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
}


if (await loged()) {
    console.log("Connecté ! via les cookies");
    creerElement({tag: "button", id : "btnLogout", textContent : "Se déconnecter", parent : "#zenith"}).addEventListener("click", logout);
}
else {
    creerElement({tag: "button", id : "btnLogin", textContent : "Se connecter", parent : "#zenith"}).addEventListener("click", login);
}

creerElement({tag: "img", id : "poster", parent : "#zenith", attributs : {src: "Images/Default.png", alt: "Default Image"}});

creerElement({tag: "div", id : "container-img", parent : "#app"});

creerElement({tag: "h2", textContent : "Default Movie", parent : "#app"});

let div = creerElement({tag: "div", id : "buttons", parent : "#app"});
div.appendChild(creerElement({tag: "button", id : "like", textContent : "❤️ Ajouter aux favoris", parent : "#buttons"}));
div.appendChild(creerElement({tag: "button", id : "next", textContent : "➡️ Suivant", parent : "#buttons"}));