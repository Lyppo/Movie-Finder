// 🍪 Stockage des cookies
let cookies = {};

let ACCOUNT_ID = ""; // ID du compte
let ACCESS_TOKEN = ""; // Token d'accès
let SESSION_ID = ""; // ID de session

async function attendreFonction(nomFonction) {
    while (typeof window[nomFonction] !== "function") {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}

// 🔹 Fonction pour récupérer les cookies
async function getCookies() {
    logMessage('cookies', "Chargement des cookies...", "cookies", null, true); // Démarre un groupe de log pour le chargement des cookies

    if (!document.cookie) {
        logMessage('warn', "Aucun cookie trouvé.", "cookies"); // Avertit si aucun cookie n'est trouvé
        logMessage('end');
        return;
    }

    cookies = {}; // Réinitialisation du dictionnaire
    let cookiesArray = document.cookie.split('; '); // On récupère les cookies

    for (let i = 0; i < cookiesArray.length; i++) {
        let [name, value] = cookiesArray[i].split('='); // On sépare le nom et la valeur
        if (name) {
            cookies[name] = decodeURIComponent(value); // Ajoute le cookie dans l'objet
        }
    }

    logMessage('success', "Cookies chargés :", "cookies", cookies); // Affiche les cookies sous forme de tableau
    logMessage('cookies', `Total cookies chargés : ${Object.keys(cookies).length}`, "cookies"); // Affiche le nombre total de cookies
    logMessage('end');
}

async function load() {
    
    await attendreFonction("logMessage");

    logMessage('loading', "chargement des cookies...", 'cookies');
    await getCookies();
    ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
    ACCOUNT_ID = cookies["ACCOUNT_ID"];
    SESSION_ID = cookies["SESSION_ID"];
}

load(); // Charge les cookies

// 🔹 Ajouter ou mettre à jour un cookie
async function setCookie(name, value) {
    logMessage('group', "Ajout d'un cookie..."); // Démarre un groupe de log pour l'ajout de cookie

    if (!name || !value) {
        logMessage('warn', "Impossible d'ajouter un cookie : Nom et valeur requis !"); // Avertit si le nom ou la valeur est manquant
        logMessage('end');
        return;
    }

    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${2592000}; path=/`; // Durée de vie : 30 jours
    cookies[name] = value; // Met à jour l'objet cookies

    logMessage('addition', "Cookie ajouté :", null, { [name]: value }); // Affiche le cookie ajouté sous forme de tableau
    logMessage('cookies', `Cookie : ${name} = ${value}`); // Affiche le nom et la valeur du cookie
    logMessage('end'); // Assurez-vous que le groupe est toujours fermé
}

// 🔹 Supprimer un cookie spécifique
async function clearCookie(name) {
    logMessage('group', "Suppression d'un cookie..."); // Démarre un groupe de log pour la suppression de cookie

    if (!cookies[name]) {
        logMessage('warn', `Le cookie "${name}" n'existe pas.`); // Avertit si le cookie n'existe pas
        logMessage('end');
        return;
    }

    document.cookie = `${name}=; max-age=0; path=/`; // Supprime le cookie
    delete cookies[name]; // Supprime le cookie de l'objet

    logMessage('cookies', "Cookies après suppression :", null, cookies); // Affiche les cookies restants après suppression
    logMessage('deletion', `Cookie supprimé : ${name}`); // Affiche le nom du cookie supprimé
    logMessage('end'); // Assurez-vous que le groupe est toujours fermé
}