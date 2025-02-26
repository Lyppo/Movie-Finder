let ACCOUNT_ID = ""; // ID du compte
let ACCESS_TOKEN = ""; // Token d'accès
let SESSION_ID = ""; // ID de session

// 🔐 Fonction d'authentification asynchrone
async function requestAuth(url, content, type) {
    logMessage('group', `[AUTH] ${type} → ${url}`); // Démarrer un groupe de log pour l'authentification

    logMessage('log', '📤 Envoi des données :', content); // Afficher les données envoyées

    try {
        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();
        
        logMessage('log', '📩 Réponse reçue :', data); // Afficher la réponse API

        if (!response.ok) {
            throw new Error(`🚫 Erreur HTTP : ${response.status}`);
        }

        console.groupEnd();
        return data;
    } catch (error) {
        logMessage('error', '❌ Erreur :', error.message); // Afficher l'erreur
        console.groupEnd();
        return null;
    }
}

// 🔑 Création d'un token de requête
async function createRequestToken() {
    let redirect_to = window.location.href.replace(/(\.html|\/index)$/, "") + "/popup.html";

    logMessage('group', "Création du token de requête..."); // Indiquer le début de la création du token
    const data = await requestAuth('https://api.themoviedb.org/4/auth/request_token', { redirect_to }, 'POST');

    if (data?.request_token) {
        logMessage('success', '🔑 Token généré :', { request_token: data.request_token });
    } else {
        logMessage('warn', "⚠️ Échec de la génération du token."); // Avertir en cas d'échec
    }

    console.groupEnd();
    return data?.request_token;
}

// 🔓 Création d'un token d'accès
async function createAccessToken(tmpToken) {
    logMessage('group', "[AUTH] Création du token d'accès..."); // Indiquer le début de la création du token d'accès
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', { request_token: tmpToken }, 'POST');

    if (data?.account_id && data?.access_token) {
        ACCOUNT_ID = data.account_id;
        ACCESS_TOKEN = data.access_token;
        setCookie("ACCOUNT_ID", ACCOUNT_ID);
        setCookie("ACCESS_TOKEN", ACCESS_TOKEN);

        logMessage('success', '🆔 ID du compte et token d\'accès créés :', { ACCOUNT_ID, ACCESS_TOKEN });
    } else {
        logMessage('warn', "⚠️ Échec de la création du token d'accès."); // Avertir en cas d'échec
    }

    console.groupEnd();
}

// 🏁 Création d'une session
async function createSession() {
    logMessage('group', "Création de la session..."); // Indiquer le début de la création de la session
    const data = await requestAuth('https://api.themoviedb.org/3/authentication/session/convert/4', 
        { access_token: ACCESS_TOKEN }, 'POST');

    if (data?.session_id) {
        SESSION_ID = data.session_id;
        setCookie("SESSION_ID", SESSION_ID);

        logMessage('success', '✅ Session créée :', { SESSION_ID });
    } else {
        logMessage('warn', "⚠️ Échec de la création de la session."); // Avertir en cas d'échec
    }

    console.groupEnd();
}

// 🚪 Déconnexion
async function logoutRequest() {
    logMessage('group', "Suppression du token d'accès..."); // Indiquer le début de la suppression du token d'accès
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', { access_token: ACCESS_TOKEN }, 'DELETE');

    if (data?.success) {
        logMessage('success', '✅ Token supprimé avec succès.');
    } else {
        logMessage('warn', "⚠️ Échec de la suppression du token."); // Avertir en cas d'échec
    }

    console.groupEnd();
    return data;
}

// Appel de la fonction pour afficher la documentation
afficherDocumentation(
    "auth.js",
    [
        { emoji: "🔐", description: "Fonction d'authentification", couleur: "color: #1E90FF; font-weight: bold;" },
        { emoji: "🔑", description: "Création d'un token de requête", couleur: "color: #FFD700; font-weight: bold;" },
        { emoji: "🔓", description: "Création d'un token d'accès", couleur: "color: #00BFFF; font-weight: bold;" },
        { emoji: "🏁", description: "Création d'une session", couleur: "color: #8A2BE2; font-weight: bold;" },
        { emoji: "🚪", description: "Déconnexion", couleur: "color: #DC143C; font-weight: bold;" }
    ],
    [
        {
            nom: "requestAuth(url, content, type)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Envoie une requête d'authentification à l'API TMDB.",
                "Gère les erreurs et affiche les réponses dans la console."
            ]
        },
        {
            nom: "createRequestToken()",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Crée un token de requête pour l'authentification de l'utilisateur.",
                "Redirige l'utilisateur après la génération du token."
            ]
        },
        {
            nom: "createAccessToken(tmpToken)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Échange un token de requête temporaire contre un token d'accès permanent.",
                "Stocke l'ID du compte et le token d'accès dans des cookies."
            ]
        },
        {
            nom: "createSession()",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Crée une session pour l'utilisateur avec le token d'accès.",
                "Stocke l'ID de session dans un cookie."
            ]
        },
        {
            nom: "logoutRequest()",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Supprime le token d'accès de l'utilisateur pour le déconnexion.",
                "Affiche le succès ou l'échec de la déconnexion dans la console."
            ]
        }
    ]
);
