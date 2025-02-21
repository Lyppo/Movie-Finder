// main.js
import { load, loged, createRequestToken, createAccessToken, createSession, request, logoutRequest } from './api.js';
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
    
    creerElementsDepuisHTML(`<button id="btnLogout">Se déconnecter</button>`, "#zenith").addEventListener("click", logout);
    
    while (await loged()); // test combien de temps avant de se faire déconnecter

    console.log("Déconnecté !");

}

load(); // Récupère les cookies et charge les valeurs

async function logout(event) {
    /*if (!await request("https://api.themoviedb.org/3/authentication/session", "DELETE", {}, {session_id: ''}).success) {
        console.error("Erreur lors de la déconnexion.");
        return null;
    }/*                                 // deconection pas encore totalement opérationelle
    if (!await logoutRequest()) {
        console.error("Erreur lors de la déconnexion.");
        return null;
    }*/
    console.log("Déconnexion...");
    document.cookie.split(";").forEach((cookie) => {
        let name = cookie.split("=")[0].trim();
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
    removeElement("#btnLogout");
    creerElementsDepuisHTML(`<button id="btnLogin">Se connecter</button>`, "#zenith").addEventListener("click", login);
}

if (await loged()) {
    console.log("Connecté ! via les cookies");
    creerElementsDepuisHTML(`<button id="btnLogout">Se déconnecter</button>`, "#zenith").addEventListener("click", logout);
} else {
    creerElementsDepuisHTML(`<button id="btnLogin">Se connecter</button>`, "#zenith").addEventListener("click", login);
}

// Ajout de l'image avec les attributs bien placés
creerElementsDepuisHTML(`<img id="poster" src="Images/Default.png" alt="Default Image" />`, "#zenith");

// Création du container d'image
creerElementsDepuisHTML(`<div id="container-img"></div>`, "#app");

// Ajout du titre
creerElementsDepuisHTML(`<h2>Default Movie</h2>`, "#app");

// Création de la div qui contiendra les boutons
let div = creerElementsDepuisHTML(`<div id="buttons"></div>`, "#app");

// Ajout des boutons dans la div
div = document.getElementById("buttons"); // Récupère la div après l'avoir ajoutée au DOM

div.appendChild(creerElementsDepuisHTML(`<button id="like">❤️ Ajouter aux favoris</button>`));
div.appendChild(creerElementsDepuisHTML(`<button id="next">➡️ Suivant</button>`));