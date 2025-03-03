async function loged() {
    if (!ACCESS_TOKEN) {
        return false;
    } else {
        logMessage('connection', "Vérification de l'authentification...", 'login', null, true);

        try {
            const data = await request("https://api.themoviedb.org/3/authentication", 'GET');
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