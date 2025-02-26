let ACCOUNT_ID = ""; // ID du compte
let ACCESS_TOKEN = ""; // Token d'accès
let SESSION_ID = ""; // ID de session

// 🔐 Fonction d'authentification asynchrone
async function requestAuth(url, content, type) {
    console.groupCollapsed(`%c🔄 [AUTH] ${type} → ${url}`, "color: #1E90FF; font-weight: bold;");

    console.log("%c📤 Envoi des données :", "color: #00FA9A; font-weight: bold;");
    console.table(content); // 🔍 Utilisation de console.table pour afficher les variables envoyées

    try {
        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();
        
        console.log("%c📩 Réponse reçue :", "color: #FFD700; font-weight: bold;");
        console.table(data); // 🔍 Affichage de la réponse API sous forme de table

        if (!response.ok) {
            throw new Error(`🚫 Erreur HTTP : ${response.status}`);
        }

        console.groupEnd();
        return data;
    } catch (error) {
        console.error("%c❌ Erreur :", "color: #FF0000; font-weight: bold;", error.message);
        console.groupEnd();
        return null;
    }
}

// 🔑 Création d'un token de requête
async function createRequestToken() {
    let redirect_to = window.location.href.replace(/(\.html|\/index)$/, "") + "/popup.html";

    console.groupCollapsed("%c🛠️ [AUTH] Création du token de requête...", "color: #FFA500; font-weight: bold;");
    const data = await requestAuth('https://api.themoviedb.org/4/auth/request_token', { redirect_to }, 'POST');

    if (data?.request_token) {
        console.log("%c🔑 Token généré :", "color: #FFD700; font-weight: bold;");
        console.table({ request_token: data.request_token });
    } else {
        console.error("%c⚠️ Échec de la génération du token.", "color: #FF4500; font-weight: bold;");
    }

    console.groupEnd();
    return data?.request_token;
}

// 🔓 Création d'un token d'accès
async function createAccessToken(tmpToken) {
    console.groupCollapsed("%c🔐 [AUTH] Création du token d'accès...", "color: #00BFFF; font-weight: bold;");
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', { request_token: tmpToken }, 'POST');

    if (data?.account_id && data?.access_token) {
        ACCOUNT_ID = data.account_id;
        ACCESS_TOKEN = data.access_token;
        setCookie("ACCOUNT_ID", ACCOUNT_ID);
        setCookie("ACCESS_TOKEN", ACCESS_TOKEN);

        console.log("%c🆔 ID du compte et token d'accès créés :", "color: #32CD32; font-weight: bold;");
        console.table({ ACCOUNT_ID, ACCESS_TOKEN });
    } else {
        console.error("%c⚠️ Échec de la création du token d'accès.", "color: #FF4500; font-weight: bold;");
    }

    console.groupEnd();
}

// 🏁 Création d'une session
async function createSession() {
    console.groupCollapsed("%c🖥️ [AUTH] Création de la session...", "color: #8A2BE2; font-weight: bold;");
    const data = await requestAuth('https://api.themoviedb.org/3/authentication/session/convert/4', 
        { access_token: ACCESS_TOKEN }, 'POST');

    if (data?.session_id) {
        SESSION_ID = data.session_id;
        setCookie("SESSION_ID", SESSION_ID);

        console.log("%c✅ Session créée :", "color: #32CD32; font-weight: bold;");
        console.table({ SESSION_ID });
    } else {
        console.error("%c⚠️ Échec de la création de la session.", "color: #FF4500; font-weight: bold;");
    }

    console.groupEnd();
}

// 🚪 Déconnexion
async function logoutRequest() {
    console.groupCollapsed("%c🔴 [LOGOUT] Suppression du token d'accès...", "color: #DC143C; font-weight: bold;");
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', { access_token: ACCESS_TOKEN }, 'DELETE');

    if (data?.success) {
        console.log("%c✅ Token supprimé avec succès.", "color: #32CD32; font-weight: bold;");
    } else {
        console.error("%c⚠️ Échec de la suppression du token.", "color: #FF4500; font-weight: bold;");
    }

    console.groupEnd();
    return data;
}

console.groupCollapsed("%c📜 DOCUMENTATION COMPLÈTE auth.js", "color: #FFD700; font-weight: bold; font-size: 18px;");

console.groupCollapsed("%c📌 ÉMOJIS & SIGNIFICATIONS", "color: #FFD700; font-weight: bold; font-size: 16px;");
console.log(`%c🔄 [AUTH] Requête d'authentification → %cIndique une requête en cours vers l'API.`,
    "color: #1E90FF; font-weight: bold;", "color: white;");
console.log(`%c📤 Envoi des données → %cAffiche les données envoyées à l'API.`,
    "color: #00FA9A; font-weight: bold;", "color: white;");
console.log(`%c📩 Réponse reçue → %cAffiche la réponse reçue de l'API.`,
    "color: #00FA9A; font-weight: bold;", "color: white;");
console.log(`%c🚫 Erreur HTTP → %cIndique une erreur HTTP renvoyée par l'API.`,
    "color: #FF4500; font-weight: bold;", "color: white;");
console.log(`%c❌ Erreur → %cIndique une erreur lors de l'exécution.`,
    "color: #FF0000; font-weight: bold;", "color: white;");
console.groupEnd();

console.groupCollapsed("%c🔑 AUTHENTIFICATION & TOKENS", "color: #FFD700; font-weight: bold; font-size: 16px;");
console.log(`%c🔑 [AUTH] Création de token → %cIndique la génération d'un token temporaire pour authentification.`,
    "color: #FFD700; font-weight: bold;", "color: white;");
console.log(`%c🔐 [AUTH] Création de token d'accès → %cGénération du token d'accès permanent.`,
    "color: #FFD700; font-weight: bold;", "color: white;");
console.log(`%c🆔 [AUTH] ID de compte → %cAffiche l'identifiant du compte utilisateur.`,
    "color: #32CD32; font-weight: bold;", "color: white;");
console.log(`%c✅ Action réussie → %cIndique qu'une action a été réalisée avec succès.`,
    "color: #32CD32; font-weight: bold;", "color: white;");
console.log(`%c⚠️ Échec d'une action → %cIndique qu'une action a échoué.`,
    "color: #FFA500; font-weight: bold;", "color: white;");
console.groupEnd();

console.groupCollapsed("%c🖥️ SESSIONS & DÉCONNEXION", "color: #00BFFF; font-weight: bold; font-size: 16px;");
console.log(`%c🖥️ [AUTH] Création de session → %cCréation d'une session utilisateur après authentification.`,
    "color: #00BFFF; font-weight: bold;", "color: white;");
console.log(`%c🚪 [LOGOUT] Déconnexion → %cSuppression du token d'accès et fermeture de session.`,
    "color: #DC143C; font-weight: bold;", "color: white;");
console.groupEnd();

console.groupCollapsed("%c📜 DOCUMENTATION DES FONCTIONS", "color: #FFD700; font-weight: bold; font-size: 18px;");

// 🔑 AUTHENTIFICATION
console.groupCollapsed("%c🔑 AUTHENTIFICATION", "color: #1E90FF; font-weight: bold;");

console.groupCollapsed("%c🔹 requestAuth(url, content, type)", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Effectue une requête API vers TMDB avec la clé d'authentification privée.`, "color: white;");
console.log(`%c   → Permet d'envoyer ou de récupérer des données sécurisées.`, "color: white;");
console.log(`%c   → Gère automatiquement les erreurs et affiche les réponses API dans la console.`, "color: white;");
console.groupEnd();

console.groupCollapsed("%c🔹 createRequestToken()", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Demande la création d'un token temporaire pour l'authentification de l'utilisateur.`, "color: white;");
console.groupEnd();

console.groupCollapsed("%c🔹 createAccessToken(tmpToken)", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Utilise le token temporaire pour générer un token d'accès permanent.`, "color: white;");
console.groupEnd();

console.groupEnd(); // Fin du groupe AUTHENTIFICATION

// 🖥️ SESSION
console.groupCollapsed("%c🖥️ SESSION", "color: #32CD32; font-weight: bold;");

console.groupCollapsed("%c🔹 createSession()", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Crée une session utilisateur en utilisant le token d'accès.`, "color: white;");
console.groupEnd();

console.groupEnd(); // Fin du groupe SESSION

// 🚪 DÉCONNEXION
console.groupCollapsed("%c🚪 DÉCONNEXION", "color: #FF4500; font-weight: bold;");

console.groupCollapsed("%c🔹 logoutRequest()", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Demande la suppression du token d'accès pour déconnecter l'utilisateur.`, "color: white;");
console.groupEnd();

console.groupEnd(); // Fin du groupe DÉCONNEXION

console.log(`%c📌 Fin de la documentation.`, "color: #32CD32; font-weight: bold;");
console.groupEnd(); // Fin de la documentation générale

console.log(`%c📌 Fin de la documentation.`, "color: #32CD32; font-weight: bold;");

console.groupEnd(); // Ferme le groupe principal
