let ACCOUNT_ID = ""; // ID du compte
let ACCESS_TOKEN = ""; // Token d'accès
let SESSION_ID = ""; // ID de session

// 🔐 Fonction d'authentification asynchrone
async function requestAuth(url, content, type) {
    logMessage('group', `${type} → ${url}`, 'AUTH'); // Démarrer un groupe de log pour l'authentification

    logMessage('connection', 'Envoi des données :', 'AUTH', content); // Afficher les données envoyées

    try {
        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();
        
        logMessage('success', 'Réponse reçue :', 'AUTH', data); // Afficher la réponse API

        if (!response.ok) {
            console.groupEnd();
            throw new Error(`🚫 Erreur HTTP : ${response.status}`);
        }

        console.groupEnd();
        return data;
    } catch (error) {
        logMessage('error', 'Erreur :', 'AUTH', error.message); // Afficher l'erreur
        console.groupEnd();
        return null;
    }
}

// 🔑 Création d'un token de requête
async function createRequestToken() {
    let redirect_to = window.location.href.replace(/(\.html|\/index)$/, "") + "/popup.html";

    logMessage('group', "Création du token de requête...", 'AUTH'); // Indiquer le début de la création du token
    const data = await requestAuth('https://api.themoviedb.org/4/auth/request_token', { redirect_to }, 'POST');

    if (data?.request_token) {
        logMessage('success', 'Token généré :', 'AUTH', { request_token: data.request_token });
    } else {
        logMessage('warn', "Échec de la génération du token.", 'AUTH'); // Avertir en cas d'échec
    }

    console.groupEnd();
    return data?.request_token;
}

// 🔓 Création d'un token d'accès
async function createAccessToken(tmpToken) {
    logMessage('group', "Création du token d'accès...", 'AUTH'); // Indiquer le début de la création du token d'accès
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', { request_token: tmpToken }, 'POST');

    if (data?.account_id && data?.access_token) {
        ACCOUNT_ID = data.account_id;
        ACCESS_TOKEN = data.access_token;
        setCookie("ACCOUNT_ID", ACCOUNT_ID);
        setCookie("ACCESS_TOKEN", ACCESS_TOKEN);

        logMessage('success', 'ID du compte et token d\'accès créés :', 'AUTH', { ACCOUNT_ID, ACCESS_TOKEN });
    } else {
        logMessage('warn', "Échec de la création du token d'accès.", 'AUTH'); // Avertir en cas d'échec
    }

    console.groupEnd();
}

// 🏁 Création d'une session
async function createSession() {
    logMessage('group', "Création de la session...", 'AUTH'); // Indiquer le début de la création de la session
    const data = await requestAuth('https://api.themoviedb.org/3/authentication/session/convert/4', 
        { access_token: ACCESS_TOKEN }, 'POST');

    if (data?.session_id) {
        SESSION_ID = data.session_id;
        setCookie("SESSION_ID", SESSION_ID);

        logMessage('success', 'Session créée :', 'AUTH', { SESSION_ID });
    } else {
        logMessage('warn', "Échec de la création de la session.", 'AUTH'); // Avertir en cas d'échec
    }

    console.groupEnd();
}

// 🚪 Déconnexion
async function logoutRequest() {
    logMessage('group', "Suppression du token d'accès...", 'AUTH'); // Indiquer le début de la suppression du token d'accès
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', { access_token: ACCESS_TOKEN }, 'DELETE');

    if (data?.success) {
        logMessage('success', 'Token supprimé avec succès.', 'AUTH');
    } else {
        logMessage('warn', "Échec de la suppression du token.", 'AUTH'); // Avertir en cas d'échec
    }

    console.groupEnd();
    return data;
}

afficherDocumentation("auth", [
    {
        nom: "requestAuth",
        params: [
            { forced: "url" },    // URL de l'API
            { forced: "content" }, // Contenu de la requête (données envoyées)
            { forced: "type" }     // Type de requête (GET, POST, DELETE)
        ],
        style: "connection",
        descriptions: [
            "Effectue une requête API asynchrone vers The Movie Database (TMDb).",
            "Envoie les données fournies avec le type de requête spécifié (POST, DELETE...).",
            "Retourne les données JSON de la réponse ou `null` en cas d'échec.",
            "Affiche les informations de connexion et la réponse dans la console."
        ]
    },
    {
        nom: "createRequestToken",
        params: [],
        style: "addition",
        descriptions: [
            "Génère un token de requête pour l'authentification avec TMDb.",
            "Utilise `requestAuth` pour envoyer la requête de création de token.",
            "Retourne le token de requête s'il est généré avec succès, sinon `undefined`.",
            "Affiche les informations du token dans la console."
        ]
    },
    {
        nom: "createAccessToken",
        params: [
            { forced: "tmpToken" } // Token de requête temporaire
        ],
        style: "addition",
        descriptions: [
            "Crée un token d'accès à partir d'un token de requête temporaire.",
            "Stocke l'ID du compte et le token d'accès dans des cookies.",
            "Affiche les informations d'identification obtenues.",
            "Utilise `setCookie` pour stocker les données."
        ]
    },
    {
        nom: "createSession",
        params: [],
        style: "success",
        descriptions: [
            "Crée une session utilisateur basée sur le token d'accès.",
            "Stocke l'ID de session obtenu dans un cookie.",
            "Affiche l'ID de session créé ou un avertissement en cas d'échec."
        ]
    },
    {
        nom: "logoutRequest",
        params: [],
        style: "deletion",
        descriptions: [
            "Supprime le token d'accès pour déconnecter l'utilisateur.",
            "Envoie une requête DELETE à l'API TMDb.",
            "Affiche un message de succès ou un avertissement en cas d'échec."
        ]
    }
]);
