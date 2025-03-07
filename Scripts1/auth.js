async function createRequestToken() {
    let redirect_to = window.location.origin + "/popup.html";

    log('Création d\'un token de requête', 'request', { redirect_to }, 'Authentification');

    const data = await requestAuth('POST', 'https://api.themoviedb.org/4/auth/request_token', { redirect_to });

    if (data && data.request_token) {
        log('Token de requête créé avec succès', 'success', { request_token: data.request_token }, 'Authentification');
        return data.request_token;
    } else {
        return log('Erreur lors de la création du token de requête', 'error', data, 'Authentification');
    }
}

async function createAccessToken(tmpToken) {
    log('Création d\'un token d\'accès avec le token temporaire', 'request', { tmpToken }, 'Authentification');

    const data = await requestAuth('POST', 'https://api.themoviedb.org/4/auth/access_token', { request_token: tmpToken });

    if (data && data.account_id && data.access_token) {
        ACCOUNT_ID = data.account_id;
        ACCESS_TOKEN = data.access_token;
        setCookie("ACCOUNT_ID", ACCOUNT_ID);
        setCookie("ACCESS_TOKEN", ACCESS_TOKEN);

        log('Token d\'accès créé avec succès', 'success', { ACCOUNT_ID, ACCESS_TOKEN }, 'Authentification');
    } else {
        log('Erreur lors de la création du token d\'accès', 'error', data, 'Authentification');
    }
}

async function createSession() {
    log('Création de la session', 'request', { ACCESS_TOKEN }, 'Authentification');

    const data = await requestAuth('POST', 'https://api.themoviedb.org/3/authentication/session/convert/4', { access_token: ACCESS_TOKEN });

    if (data && data.session_id) {
        SESSION_ID = data.session_id;
        setCookie("SESSION_ID", SESSION_ID);

        log('Session créée avec succès', 'success', { SESSION_ID }, 'Authentification');
    } else {
        log('Erreur lors de la création de la session', 'error', data, 'Authentification');
    }
}

async function logoutRequest() {
    log('Déconnexion de l\'utilisateur', 'request', { ACCESS_TOKEN }, 'Authentification');

    const data = await requestAuth('DELETE', 'https://api.themoviedb.org/4/auth/access_token', { access_token: ACCESS_TOKEN });

    if (data) {
        log('Utilisateur déconnecté avec succès', 'success', data, 'Authentification');
    } else {
        log('Erreur lors de la déconnexion', 'error', data, 'Authentification');
    }

    return data;
}

async function requestAuth(type, url, content) {
    log('Envoi de la requête d\'authentification', 'request', { type, url, content }, 'Réseau');

    try {
        const response = await fetch('https://tmdb-request-debug.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();
        log('Réponse reçue de l\'API', 'success', data, 'Réseau');

        return data;
    } catch (error) {
        return log('Erreur lors de la requête d\'authentification', 'error', error, 'Réseau');
    }
}
