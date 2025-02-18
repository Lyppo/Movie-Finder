// Fonction pour créer un token de demande
async function createRequestToken() {
    try {
        redirect_to = window.location.href; // Récupère l'URL actuelle
        if (redirect_to.endsWith("index.html")) {
            // Redirige vers l'URL sans "index.html"
            redirect_to = redirect_to.replace("index.html", "");
        }

        // Envoie une requête POST pour obtenir un token de demande
        const response = await fetch('https://tmdb-proxy-request.antodu72210.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ redirect_to: redirect_to + "/popup.html" }) , // Utilisation de JSON.stringify pour structurer le corps
        });

        // Vérifie si la réponse est ok (status 200-299)
        if (!response.ok) {
            throw new Error('Erreur lors de la création du token de demande.');
        }

        const data = await response.json(); // Récupère un objet JSON
        return data.request_token;  // Retourne uniquement le request_token
    } catch (error) {
        console.error(error.message); // Affiche les erreurs en cas d'échec
        return -1;
    }
}

// Fonction pour créer un token d'accès (implémentation à venir)
async function createAccessToken(tmpToken) {
    console.log("Création du token d'accès...");try {
    const response = await fetch('https://tmdb-proxy-create.antodu72210.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ request_token: tmpToken })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erreur lors de la récupération de l'Access Token.");
        }

        console.log("✅ Access Token :", data.access_token);
        console.log("✅ Account ID :", data.account_id);

        test(data); // Appel de la fonction test avec les données récupérées

        return data;

    } catch (error) {
        console.error("❌ Erreur :", error.message);
        return null;
    }
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
    } else { 
        console.error("Erreur lors de l'authentification !");
    }
}

document.getElementById("btnLogin").addEventListener("click", login); // Ajoute un écouteur d'événement au bouton

// rajouter l'autentification v3