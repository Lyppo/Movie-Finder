async function createRequestToken() {
    let redirect_to = window.location.origin + "/popup.html";

    const data = await requestAuth('POST', 'https://api.themoviedb.org/4/auth/request_token', { redirect_to });

    return data.request_token;
}

async function createAccessToken(tmpToken) {

    const data = await requestAuth('POST', 'https://api.themoviedb.org/4/auth/access_token', { request_token: tmpToken });

    if (data.account_id && data.access_token) {
        ACCOUNT_ID = data.account_id;
        ACCESS_TOKEN = data.access_token;
        setCookie("ACCOUNT_ID", ACCOUNT_ID);
        setCookie("ACCESS_TOKEN", ACCESS_TOKEN);
    }
}

async function createSession() {

    const data = await requestAuth('POST', 'https://api.themoviedb.org/3/authentication/session/convert/4', { access_token: ACCESS_TOKEN });

    if (data.session_id) {
        SESSION_ID = data.session_id;
        setCookie("SESSION_ID", SESSION_ID);
    }
}

async function logoutRequest() {

    const data = await requestAuth('DELETE', 'https://api.themoviedb.org/4/auth/access_token', { access_token: ACCESS_TOKEN });
    
    return data;
}

async function requestAuth(type, url, content) {

    try {
        const response = await fetch('https://tmdb-request.antodu72210.workers.dev/', {
            method: type,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, content: content })
        });

        const data = await response.json();

        return data;
    } catch (error) {

        return;
    }
}
