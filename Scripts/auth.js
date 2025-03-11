async function createRequestToken() {

    const redirect_to = window.location.origin + window.location.pathname + "/popup.html";

    const data = await requestAuth('POST', 'https://api.themoviedb.org/4/auth/request_token', { redirect_to });

    if (data.success) return data.request_token;

    else return log('Erreur lors de la création du token de requête', 'error', data, 'Request Token');
}

async function createAccessToken(tmpToken) {

    const data = await requestAuth('POST', 'https://api.themoviedb.org/4/auth/access_token', { request_token: tmpToken });

    if (data.success) {
        ACCOUNT_ID = data.account_id;
        ACCESS_TOKEN = data.access_token;
        setCookie("ACCOUNT_ID", ACCOUNT_ID);
        setCookie("ACCESS_TOKEN", ACCESS_TOKEN);
    }
    else log('Erreur lors de la création du token d\'accès', 'error', data, 'Access Token');
}

async function createSession() {

    const data = await requestAuth('POST', 'https://api.themoviedb.org/3/authentication/session/convert/4', { access_token: ACCESS_TOKEN });

    if (data.success) {
        SESSION_ID = data.session_id;
        setCookie("SESSION_ID", SESSION_ID);
    }
    else log('Erreur lors de la création de la session', 'error', data, 'Session ID');
}

async function logoutRequest() {

    const data = await requestAuth('DELETE', 'https://api.themoviedb.org/4/auth/access_token', { access_token: ACCESS_TOKEN });

    if (!data.success) log('Erreur lors de la déconnexion', 'error', data, 'Logout Request');

    return data;
}

async function requestAuth(type, url, content) {
    log('Envoi de requête d\'authentification', 'request', { type: type, url: url, content: content }, 'Authentification');

    try {
        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();

        log('Réponse de l\'authentification', 'succes', data, 'Authentification');

        return data;

    } catch (error) {

        let module;
        
        try {
            module = await import('./localAdressDebug.js');
        } catch (err) {
            return log('Erreur lors de la requête d\'authentification', 'error', error, 'Authentification');
        }
        return await module.requestAuth(type, url, content);
    }
}
