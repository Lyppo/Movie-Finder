async function loged() {
    if (!ACCESS_TOKEN) {
        return false;
    } else {
        logMessage('connection', "Vérification de l'authentification...", 'login', null, true);

        try {
            const data = await request("https://api.themoviedb.org/3/authentication");
            logMessage('success', "Résultat :", 'login', data);
            logMessage('end');
            return data.success;
        } catch (error) {
            logMessage('error', "Erreur lors de la vérification de l'authentification :", 'login', error);
            logMessage('end');
            return false;
        }
    }
}

async function login(event) {
    event?.preventDefault();

    if (event?.target) {
        event.target.removeEventListener("click", login);
    }

    logMessage('connection', "Tentative de connexion...", 'login', null, true);

    const tmpToken = await createRequestToken();
    let authenticated = false;
    let attempts = 0;

    while (!authenticated && attempts < 3) {
        authenticated = await ouvrirPopupLogin(tmpToken);
        if (!authenticated) {
            logMessage('warn', `Tentative d'authentification échouée (${attempts + 1}/3)`, 'login');
            attempts++;
        }
    }

    if (!authenticated) {
        logMessage('error', "Échec de l'authentification après 3 tentatives.", 'login');
        console.groupEnd();
        event.target.addEventListener("click", login);
        return;
    }

    try {
        await createAccessToken(tmpToken);
        await createSession();

        let sonOfUserInterface = document.querySelectorAll("#userInterface > *");

        // Suppression des éléments de l'interface utilisateur
        sonOfUserInterface.forEach(el => el.remove());

        setuploged(document.getElementById("userInterface"));
        logMessage('success', "Connexion réussie !", 'login');
    } catch (error) {
        logMessage('error', "Erreur lors de la création du token ou de la session :", 'login', error);
    }

    logMessage('end');
}

afficherDocumentation("login", [
    {
        nom: "load",
        params: [],
        style: "loading",
        descriptions: [
            "Charge les cookies stockés dans le navigateur.",
            "Récupère `ACCESS_TOKEN`, `ACCOUNT_ID`, et `SESSION_ID` à partir des cookies.",
            "Ces valeurs sont utilisées pour vérifier l'état de connexion de l'utilisateur."
        ]
    },
    {
        nom: "loged",
        params: [],
        style: "success",
        descriptions: [
            "Vérifie si l'utilisateur est authentifié.",
            "Si aucun `ACCESS_TOKEN` n'est trouvé, retourne `false` immédiatement.",
            "Sinon, effectue une requête vers TMDb pour valider l'authentification.",
            "Retourne `true` si l'authentification est confirmée, sinon `false`.",
            "Affiche les erreurs en cas de problème."
        ]
    },
    {
        nom: "login",
        params: ["event"],
        style: "success",
        descriptions: [
            "Gère le processus de connexion utilisateur.",
            "Empêche le comportement par défaut du bouton si un `event` est passé.",
            "Désactive temporairement l'écouteur d'événements pour éviter les doubles clics.",
            "Crée un token de requête et tente l'authentification via une popup.",
            "Autorise jusqu'à 3 tentatives d'authentification avant d'échouer.",
            "Si l'authentification réussit, génère un token d'accès et crée une session.",
            "Met à jour l'interface utilisateur en supprimant les éléments obsolètes.",
            "Affiche les erreurs en cas de problème."
        ]
    }
]);