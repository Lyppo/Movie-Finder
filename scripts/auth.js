// 🔐 Fonction d'authentification asynchrone
async function requestAuth(url, content, type) {
    logMessage('connection', `${type} → ${url}`, 'AUTH', null, true); // Démarrer un groupe de log pour l'authentification

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
            logMessage('end');
            throw new Error(`🚫 Erreur HTTP : ${response.status}`);
        }

        logMessage('end');
        return data;
    } catch (error) {
        logMessage('error', 'Erreur :', 'AUTH', error.message); // Afficher l'erreur
        logMessage('end');
        return null;
    }
}

// 🔑 Création d'un token de requête
async function createRequestToken() {
    let redirect_to = window.location.href.replace(/(\.html|\/index)$/, "") + "/popup.html";

    logMessage('connection', "Création du token de requête...", 'AUTH', null, true); // Indiquer le début de la création du token
    const data = await requestAuth('https://api.themoviedb.org/4/auth/request_token', { redirect_to }, 'POST');

    if (data?.request_token) {
        logMessage('success', 'Token généré :', 'AUTH', { request_token: data.request_token });
    } else {
        logMessage('warn', "Échec de la génération du token.", 'AUTH'); // Avertir en cas d'échec
    }

    logMessage('end');
    return data?.request_token;
}

// 🔓 Création d'un token d'accès
async function createAccessToken(tmpToken) {
    logMessage('connection', "Création du token d'accès...", 'AUTH', null, true); // Indiquer le début de la création du token d'accès
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

    logMessage('end');
}

// 🏁 Création d'une session
async function createSession() {
    logMessage('connection', "Création de la session...", 'AUTH', null, true); // Indiquer le début de la création de la session
    const data = await requestAuth('https://api.themoviedb.org/3/authentication/session/convert/4', 
        { access_token: ACCESS_TOKEN }, 'POST');

    if (data?.session_id) {
        SESSION_ID = data.session_id;
        setCookie("SESSION_ID", SESSION_ID);

        logMessage('success', 'Session créée :', 'AUTH', { SESSION_ID });
    } else {
        logMessage('warn', "Échec de la création de la session.", 'AUTH'); // Avertir en cas d'échec
    }

    logMessage('end');
}

// 🚪 Déconnexion
async function logoutRequest() {
    logMessage('connection', "Suppression du token d'accès...", 'AUTH', null, true); // Indiquer le début de la suppression du token d'accès
    const data = await requestAuth('https://api.themoviedb.org/4/auth/access_token', { access_token: ACCESS_TOKEN }, 'DELETE');

    if (data?.success) {
        logMessage('success', 'Token supprimé avec succès.', 'AUTH');
    } else {
        logMessage('warn', "Échec de la suppression du token.", 'AUTH'); // Avertir en cas d'échec
    }

    logMessage('end');
    return data;
}
