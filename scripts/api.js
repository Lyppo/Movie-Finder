// api.js
let ACCOUNT_ID = "";
let ACCESS_TOKEN = "";
let SESSION_ID = "";
let cookies = {}; // Dictionnaire pour stocker les cookies

export function getCookies() {

    // Récupérer tous les cookies en tant que tableau
    let cookiesArray = document.cookie.split('; ');

    // Boucle pour parcourir chaque cookie
    for (let cookieTmp of cookiesArray) {
        let [name, value] = cookieTmp.split('='); // Séparer le nom et la valeur
        cookies[name] = decodeURIComponent(value); // Ajouter au dictionnaire
    }

    return cookies; // Retourner le dictionnaire des cookies
}

export function load(){

    getCookies();

    ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
    ACCOUNT_ID = cookies["ACCOUNT_ID"];
    SESSION_ID = cookies["SESSION_ID"];
}

export async function loged() {
    if (!ACCESS_TOKEN) {
        return false;
    }
    else {
        const data = await request("https://api.themoviedb.org/3/authentication");
        return data.success;
    }
}

export async function requestauth(url, content) {
    try {
        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                content: content
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        const data = await response.json();
        return data;  
    } catch (error) {
        console.error("Erreur lors de la requête :", error.message);
        return null; 
    }
}

export async function request(url = "https://api.themoviedb.org/3/authentication", type = "GET", params = {}, content = null) {

    if (!url.includes("api.themoviedb.org")) {
        console.error("L'URL doit concerner le site api.themoviedb.org.");
        return null; // Renvoie une erreur
    }

    // Crée une query string à partir des paramètres, avec "?" si non vide
    let searchParams = new URLSearchParams(params);
    let detail = searchParams.toString() ? `?${searchParams.toString()}` : "";

    url += detail; // Ajoute les paramètres à l'URL

    try {
        // Envoie la requête à l'API TMDB
        const response = await fetch(url, {
            method: type, // Type de requête (GET, POST, PUT, DELETE, etc.)
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`, // Authentification avec le token
            }
        });
    
        const data = await response.json(); // Parse la réponse de TMDB
    
        // Vérifie si l'API TMDB a renvoyé une erreur
        if (!response.ok) {
            console.error("Erreur de l'API TMDB :", response.status, data);
            return null; // Renvoie une erreur
        }
    
        return data; // Renvoie la réponse réussie
    
      } catch (error) {
            console.error("Erreur lors de la requête TMDB :", error);
            return null; // Renvoie une erreur
      }
}

export async function createRequestToken() {

    let redirect_to = window.location.href; // Récupère l'URL actuelle

    if (redirect_to.endsWith(".html")) redirect_to = redirect_to.replace(".html", ""); // Supprime ".html" de l'URL

    if (redirect_to.endsWith("/index")) redirect_to = redirect_to.replace("index", ""); // Supprime "index" de l'URL
    
    const data = await requestauth('https://api.themoviedb.org/4/auth/request_token',
        { redirect_to: redirect_to + "/popup.html" }
    );

    return data.request_token;
}

export async function createAccessToken(tmpToken) {
    const data = await requestauth('https://api.themoviedb.org/4/auth/access_token',
        { request_token: tmpToken }
    );

    ACCOUNT_ID = data.account_id;

    ACCESS_TOKEN = data.access_token;

    document.cookie = "ACCOUNT_ID=" + ACCOUNT_ID + "; max-age=" + (30 * 24 * 60 * 60) + "; path=/";

    document.cookie = "ACCESS_TOKEN=" + ACCESS_TOKEN + "; max-age=" + (30 * 24 * 60 * 60) + "; path=/";

    return data;
}

export async function createSession() {
    const data = await requestauth('https://api.themoviedb.org/3/authentication/session/convert/4',
        { access_token: ACCESS_TOKEN }
    );

    SESSION_ID = data.session_id;

    document.cookie = "SESSION_ID=" + SESSION_ID + "; max-age=" + (30 * 24 * 60 * 60) + "; path=/";

    return data;
}
