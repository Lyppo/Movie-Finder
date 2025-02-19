// api.js
export async function requestauth(url, content) {
    try {
        const response = await fetch('https://tmdb-request-debug.antodu72210.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                content: content
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        const data = await response.json();
        return data;  
    } catch (error) {
        console.error("Erreur lors de la requête :", error.message);
        return null; 
    }
}

export async function request(account_id, accessToken) {

    /*if (!url.includes("api.themoviedb.org")) {
        console.error("L'URL doit concerner le site api.themoviedb.org.");
        return null; // Renvoie une erreur
    }*/

    try {
        // Envoie la requête à l'API TMDB
        const response = await fetch(`https://api.themoviedb.org/4/account/${account_id}/movie/favorites?page=1&language=en-US&sort_by=created_at.asc`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, // Authentification avec le token
            }
        });
    
        const data = await response.json(); // Parse la réponse de TMDB
    
        // Vérifie si l'API TMDB a renvoyé une erreur
        if (!response.ok) {
            console.error("Erreur de l'API TMDB :", response.status, data);
            return null; // Renvoie une erreur
        }
    
        return data; // Renvoie la réponse réussie
    
      } catch (error) {
            console.error("Erreur lors de la requête TMDB :", error);
            return null; // Renvoie une erreur
      }
}

export async function createRequestToken() {
    let redirect_to = window.location.href; // Récupère l'URL actuelle

    if (redirect_to.endsWith("index.html")) {redirect_to = redirect_to.replace("index.html", "")}
    
    const data = await requestauth('https://api.themoviedb.org/4/auth/request_token',
        { redirect_to: redirect_to + "/popup.html" }
    );

    return data.request_token;
}

export async function createAccessToken(tmpToken) {
    console.log("Création du token d'accès...");

    const data = await requestauth('https://api.themoviedb.org/4/auth/access_token',
        { request_token: tmpToken }
    );

    return data;
}