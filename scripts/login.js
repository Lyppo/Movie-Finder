function load() {
    logMessage('loading', "chargement des cookies...");
    ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
    ACCOUNT_ID = cookies["ACCOUNT_ID"];
    SESSION_ID = cookies["SESSION_ID"];
}

async function loged() {
    if (!ACCESS_TOKEN) {
        return false;
    } else {
        logMessage('group', "Vérification de l'authentification...");

        try {
            const data = await request("https://api.themoviedb.org/3/authentication");
            logMessage('success', "Résultat :", null, data);
            console.groupEnd(); 
            return data.success;
        } catch (error) {
            logMessage('error', "Erreur lors de la vérification de l'authentification :", null, error);
            console.groupEnd();
            return false;
        }
    }
}

async function login(event) {
    event?.preventDefault();

    if (event?.target) {
        event.target.removeEventListener("click", login);
    }

    logMessage('group', "Tentative de connexion...");

    const tmpToken = await createRequestToken();
    let authenticated = false;
    let attempts = 0;

    while (!authenticated && attempts < 3) {
        authenticated = await ouvrirPopupLogin(tmpToken);
        if (!authenticated) {
            logMessage('warn', `Tentative d'authentification échouée (${attempts + 1}/3)`);
            attempts++;
        }
    }

    if (!authenticated) {
        logMessage('error', "Échec de l'authentification après 3 tentatives.");
        console.groupEnd();
        event.target.addEventListener("click", login);
        return;
    }

    try {
        await createAccessToken(tmpToken);
        await createSession();

        let userInterface = document.querySelectorAll("#userInterface > *");

        // Suppression des éléments de l'interface utilisateur
        userInterface.forEach(el => el.remove());

        setuploged();
        logMessage('success', "Connexion réussie !");
    } catch (error) {
        logMessage('error', "Erreur lors de la création du token ou de la session :", null, error);
    }

    console.groupEnd();
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