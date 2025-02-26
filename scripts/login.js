function load() {
    ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
    ACCOUNT_ID = cookies["ACCOUNT_ID"];
    SESSION_ID = cookies["SESSION_ID"];
}

async function loged() {
    if (!ACCESS_TOKEN) {
        return false;
    } else {
        logMessage('group', '[LOGGED]'); 
        logMessage('log', "✅ Vérification de l'authentification...");

        try {
            const data = await request("https://api.themoviedb.org/3/authentication");
            logMessage('log', "✅ Résultat :", data);
            console.groupEnd(); 
            return data.success;
        } catch (error) {
            logMessage('error', "Erreur lors de la vérification de l'authentification :", error);
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

    logMessage('group', "🔵 Tentative de connexion...");

    const tmpToken = await createRequestToken();
    let authenticated = false;
    let attempts = 0;

    while (!authenticated && attempts < 3) {
        authenticated = await ouvrirPopupLogin(tmpToken);
        if (!authenticated) {
            logMessage('warn', `❌ Tentative d'authentification échouée (${attempts + 1}/3)`);
            attempts++;
        }
    }

    if (!authenticated) {
        logMessage('error', "🚨 Échec de l'authentification après 3 tentatives.");
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
        logMessage('log', "🔵 Connexion réussie !");
    } catch (error) {
        logMessage('error', "Erreur lors de la création du token ou de la session :", error);
    }

    console.groupEnd();
}

// Appel de la fonction pour afficher la documentation
afficherDocumentation(
    "login.js",
    [
        { emoji: "✅", description: "Vérification de l'authentification", couleur: "color: #32CD32; font-weight: bold;" },
        { emoji: "❌", description: "Tentative d'authentification échouée", couleur: "color: #FF4500; font-weight: bold;" },
        { emoji: "🚨", description: "Échec de l'authentification", couleur: "color: #FF4500; font-weight: bold;" },
        { emoji: "🔵", description: "Tentative de connexion", couleur: "color: #1E90FF; font-weight: bold;" }
    ],
    [
        {
            nom: "load()",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Charge les cookies ACCESS_TOKEN, ACCOUNT_ID et SESSION_ID."
            ]
        },
        {
            nom: "loged()",
            couleur: "color: #1E90FF; font-weight: bold;",
            descriptions: [
                "Vérifie si l'utilisateur est authentifié.",
                "Affiche les logs de la vérification d'authentification.",
                "Renvoie vrai si l'utilisateur est authentifié, faux sinon."
            ]
        },
        {
            nom: "login(event)",
            couleur: "color: #1E90FF; font-weight: bold;",
            descriptions: [
                "Gère le processus de connexion de l'utilisateur.",
                "Empêche le rechargement de la page lors de la connexion.",
                "Effectue plusieurs tentatives d'authentification (maximum 3).",
                "Affiche les messages de débogage et d'erreur selon le résultat."
            ]
        }
    ]
);