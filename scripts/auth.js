let ACCOUNT_ID = ""; // ID du compte
let ACCESS_TOKEN = ""; // Token d'accès
let SESSION_ID = ""; // ID de session

// 🔹 Requête d'authentification
async function requestAuth(url, content, type) {
    console.groupCollapsed(`[REQUEST AUTH] ${type} → ${url}`); // Démarre un groupe de log
    console.log("📩 Contenu envoyé :", content);

    try {

        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();
        console.log("📬 Réponse reçue :", data);

        if (!response.ok) {
            throw new Error(`❌ Code HTTP : ${response.status}`);
        }

        console.groupEnd(); // Termine le groupe de log
        return data;
    } catch (error) {
        console.error(`❌ Erreur : ${error.message}`);
        console.groupEnd(); // Termine le groupe de log même en cas d'erreur
        return null;
    }
}

// 🔹 Création d'un token de requête
async function createRequestToken() {

    let redirect_to = window.location.href;

    if (redirect_to.endsWith(".html")) redirect_to = redirect_to.replace(".html", "");
    if (redirect_to.endsWith("/index")) redirect_to = redirect_to.replace("index", "");

    redirect_to += "/popup.html";

    console.groupCollapsed("🟢 [AUTH] Création du token de requête..."); // Démarre un groupe de log
    const data = await requestAuth('https://api.themoviedb.org/4/auth/request_token', 
        { redirect_to: redirect_to },
        'POST'
    );

    console.log("✅ [AUTH] Token généré :", data.request_token);
    console.groupEnd(); // Termine le groupe de log
    return data.request_token;
}

// 🔹 Création d'un token d'accès
async function createAccessToken(tmpToken) {

    console.groupCollapsed("🟢 [AUTH] Création du token d'accès..."); // Démarre un groupe de log
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', 
        { request_token: tmpToken },
        'POST'
    );

    ACCOUNT_ID = data.account_id;
    ACCESS_TOKEN = data.access_token;

    setCookie("ACCOUNT_ID", ACCOUNT_ID);
    setCookie("ACCESS_TOKEN", ACCESS_TOKEN);

    console.log("✅ [AUTH] ID de compte récupéré :", ACCOUNT_ID);
    console.log("✅ [AUTH] Token d'accès créé :", ACCESS_TOKEN);
    console.groupEnd(); // Termine le groupe de log
}

async function createSession() {
    console.groupCollapsed("🟢 [AUTH] Création de la session..."); // Démarre un groupe de log
    const data = await requestAuth('https://api.themoviedb.org/3/authentication/session/convert/4', 
        { access_token: ACCESS_TOKEN },
        'POST'
    );

    SESSION_ID = data.session_id;

    setCookie("SESSION_ID", SESSION_ID); // Ajoute le SESSION_ID au cookie
    console.log("✅ [AUTH] Session créée :", SESSION_ID); // Affiche les informations de la session

    console.groupEnd(); // Termine le groupe de log
}

// 🔹 Demande de déconnexion
async function logoutRequest() {

    console.groupCollapsed("🔴 [LOGOUT] Suppression du token d'accès..."); // Démarre un groupe de log
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', 
        { access_token: ACCESS_TOKEN },
        'DELETE'
    );

    console.log("✅ [LOGOUT] Résultat :", data.success);
    console.groupEnd(); // Termine le groupe de log

    return data;
}
