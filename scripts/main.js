// Fonction pour créer un token de demande
async function createRequestToken() {
    redirect_to = window.location.href; // Récupère l'URL actuelle

    if (redirect_to.endsWith("index.html")) {redirect_to = redirect_to.replace("index.html", "")}
    
    data = await request('https://api.themoviedb.org/4/auth/request_token',
        {redirect_to: redirect_to + "/popup.html"}
    );

    return data.request_token;
}

async function request(url, content) {
    try {
        const response = await fetch('https://tmdb-request.antodu72210.workers.dev', {
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

        const data = await response.json(); // Récupère un objet JSON
        return data;  // Retourne les données
    } catch (error) {
        console.error("Erreur lors de la requête :", error.message);
        return null; // Retourne null en cas d'erreur
    }
}

// Fonction pour créer un token d'accès (implémentation à venir)
async function createAccessToken(tmpToken) {
    console.log("Création du token d'accès...");

    data = await request('https://api.themoviedb.org/4/auth/access_token',
        { request_token: tmpToken }
    );

    return data;
}

// Fonction pour ouvrir une fenêtre popup et attendre l'authentification
async function ouvrirPopupCentre(TON_REQUEST_TOKEN) {
    return new Promise((resolve) => {
        if (!TON_REQUEST_TOKEN) {
            console.error("Erreur : request_token manquant !");
            resolve(false); // Sortie en cas d'erreur
            return;
        }

        const width = 640;
        const height = 360;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        // Ouvre la popup
        const popup = window.open(
            `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(TON_REQUEST_TOKEN)}`,
            "popupLogin",
            `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
        );

        if (!popup) {
            console.error("Impossible d'ouvrir la popup (bloquée par le navigateur ?)");
            resolve(false);
            return;
        }

        // Ajoute un écouteur pour attendre le message de validation
        function messageListener(event) {
            if (event.origin !== window.location.origin) {
                console.error("Origine non autorisée !");
                resolve(false);
                return;
            }

            if (event.data === "authenticated") {
                console.log("Utilisateur authentifié.");
                window.removeEventListener("message", messageListener); // Nettoie l'écouteur
                resolve(true);
            }
        }

        window.addEventListener("message", messageListener);
    });
}

// Fonction pour gérer le processus de connexion
async function login(event) {

    event.preventDefault(); // Empêche le comportement par défaut du bouton

    const tmpToken = await createRequestToken(); // Crée un token de demande

    if (tmpToken === -1) {
        console.error("Erreur lors de la création du token de demande !");
        return;
    }

    // Attend que l'utilisateur s'authentifie avant d'exécuter la suite
    const autentified = await ouvrirPopupCentre(tmpToken);

    if (autentified) {
       data = await createAccessToken(tmpToken); // Crée un token d'accès si authentifié
       console.log("✅ Access Token :", data.access_token);
       console.log("✅ Account ID :", data.account_id);
    } else { 
        console.error("Erreur lors de l'authentification !");
    }
}

document.getElementById("btnLogin").addEventListener("click", login); // Ajoute un écouteur d'événement au bouton

// rajouter l'autentification v3