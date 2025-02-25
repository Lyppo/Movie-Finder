function load() {
    ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
    ACCOUNT_ID = cookies["ACCOUNT_ID"];
    SESSION_ID = cookies["SESSION_ID"];
}

async function loged() {
    if (!ACCESS_TOKEN) {
        return false;
    } else {
        console.groupCollapsed(`[LOGGED]`); // Démarre un groupe de logs
        console.log("✅ Vérification de l'authentification...");
        
        const data = await request("https://api.themoviedb.org/3/authentication");
        console.log("✅ Résultat :", data);
        
        console.groupEnd(); // Termine le groupe de logs
        return data.success;
    }
}

async function login(event) {
    event?.preventDefault(); // Empêche le rechargement de la page

    if (event?.target) {
        event.target.removeEventListener("click", login);
    }

    console.groupCollapsed("🔵 Tentative de connexion..."); // Message de débogage

    const tmpToken = await createRequestToken();
    let authenticated = false;
    let attempts = 0;

    while (!authenticated && attempts < 3) {
         authenticated = await ouvrirPopupLogin(tmpToken);
        if (!authenticated) {
            console.warn(`❌ Tentative d'authentification échouée (${attempts + 1}/3)`); // Message de débogage
            attempts++;
        }
    }

    if (!authenticated) {
        console.error("🚨 Échec de l'authentification après 3 tentatives."); // Message d'erreur
        console.groupEnd(); // Termine le groupe de logs
        event.target.addEventListener("click", login);
        return;
    }

    await createAccessToken(tmpToken);
    await createSession();

    let userInterface = document.querySelectorAll("#userInterface > *");

    for (let i = 0; i < userInterface.length; i++) {
        userInterface[i].remove();
    }

    setuploged();

    console.log("🔵 Connexion réussie !"); // Message de débogage
    console.groupEnd(); // Termine le groupe de logs
}