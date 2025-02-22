let ACCOUNT_ID = "";
let ACCESS_TOKEN = "";
let SESSION_ID = "";
let cookies = {}; // Dictionnaire pour stocker les cookies

// 🔹 Gestion des cookies
export function getCookies() {
    let cookiesArray = document.cookie.split('; ');

    for (let cookieTmp of cookiesArray) {
        let [name, value] = cookieTmp.split('=');
        cookies[name] = decodeURIComponent(value);
    }

    return cookies;
}

export function logoutClear() {
    ACCOUNT_ID = "";
    ACCESS_TOKEN = "";
    SESSION_ID = "";
}

export function load() {
    getCookies();

    ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
    ACCOUNT_ID = cookies["ACCOUNT_ID"];
    SESSION_ID = cookies["SESSION_ID"];
}

// 🔹 Vérification de l'état de connexion
export async function loged() {
    if (!ACCESS_TOKEN) {
        return false;
    } else {
        console.log(`\n${setColor('green', '[LOGGED]')} Vérification de l'authentification...`);
        const data = await request("https://api.themoviedb.org/3/authentication");
        console.log(setColor('green', '[LOGGED]') + " Résultat :", data);
        return data.success;
    }
}

// 🔹 Requêtes à l'API
export async function request(url = "https://api.themoviedb.org/3/authentication", type = "GET", params = {}, content = {}) {
    if (!url.includes("api.themoviedb.org")) {
        console.error(setColor('red', '[Erreur]') + " L'URL doit concerner api.themoviedb.org.");
        return null;
    }

    let searchParams = new URLSearchParams(params);
    let detail = searchParams.toString() ? `?${searchParams.toString()}` : "";
    url += detail;

    if (content.session_id !== undefined) content.session_id = SESSION_ID;
    if (content.account_id !== undefined) content.account_id = ACCOUNT_ID;
    if (content.access_token !== undefined) content.access_token = ACCESS_TOKEN;

    try {
        console.log(`\n${setColor('blue', '[REQUEST]')} ${type} → ${url}`);
        console.log("📩 Contenu envoyé :", content);

        let response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
            body: type !== 'GET' ? JSON.stringify(content) : undefined
        });

        const data = await response.json();
        console.log("📬 Réponse reçue :", data);

        if (!response.ok) {
            console.error(setColor('red', '[REQUEST]') + " Erreur API :", response.status, data);
            return null;
        }

        return data;
    } catch (error) {
        console.error(setColor('red', '[REQUEST]') + " Erreur :", error);
        return null;
    }
}

export async function requestauth(url, content, type = 'POST') {
    try {
        console.log(`\n${setColor('blue', '[REQUEST AUTH]')} ${type} → ${url}`);
        console.log("📩 Contenu envoyé :", content);

        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();
        console.log("📬 Réponse reçue :", data);

        if (!response.ok) {
            throw new Error(`❌ ${setColor('red', '[Erreur]')} Code HTTP : ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(setColor('red', '[REQUEST AUTH]') + " Erreur :", error.message);
        return null;
    }
}

// 🔹 Gestion de l'authentification
export async function createRequestToken() {
    let redirect_to = window.location.href;

    if (redirect_to.endsWith(".html")) redirect_to = redirect_to.replace(".html", "");
    if (redirect_to.endsWith("/index")) redirect_to = redirect_to.replace("index", "");

    console.log("\n🟢 [AUTH] Création du token de requête...");
    const data = await requestauth('https://api.themoviedb.org/4/auth/request_token',
        { redirect_to: redirect_to + "/popup.html" }
    );

    console.log("✅ [AUTH] Token généré :", data);
    return data.request_token;
}

export async function createAccessToken(tmpToken) {
    console.log("\n🟢 [AUTH] Création du token d'accès...");
    const data = await requestauth('https://api.themoviedb.org/4/auth/access_token',
        { request_token: tmpToken }
    );

    ACCOUNT_ID = data.account_id;
    ACCESS_TOKEN = data.access_token;

    document.cookie = `ACCOUNT_ID=${ACCOUNT_ID}; max-age=${30 * 24 * 60 * 60}; path=/`;
    document.cookie = `ACCESS_TOKEN=${ACCESS_TOKEN}; max-age=${30 * 24 * 60 * 60}; path=/`;

    console.log("✅ [AUTH] Token d'accès créé :", data);
    return data;
}

export async function createSession() {
    console.log("\n🟢 [AUTH] Création de la session...");
    const data = await requestauth('https://api.themoviedb.org/3/authentication/session/convert/4',
        { access_token: ACCESS_TOKEN }
    );

    SESSION_ID = data.session_id;

    document.cookie = `SESSION_ID=${SESSION_ID}; max-age=${30 * 24 * 60 * 60}; path=/`;

    console.log("✅ [AUTH] Session créée :", data);
    return data;
}

// 🔹 Déconnexion
export async function logoutRequest() {
    console.log("\n🔴 [LOGOUT] Suppression du token d'accès...");
    const data = await requestauth('https://api.themoviedb.org/4/auth/access_token',
        { access_token: ACCESS_TOKEN },
        'DELETE'
    );

    console.log("✅ [LOGOUT] Résultat :", data);
    return data;
}

// Fonction utilitaire pour appliquer des couleurs
function setColor(color, text) {
    const colors = {
        red: "\x1b[31m",     // Rouge
        green: "\x1b[32m",   // Vert
        blue: "\x1b[34m",    // Bleu
        reset: "\x1b[0m"     // Réinitialiser
    };

    return (colors[color] || colors.reset) + text + colors.reset;
}
