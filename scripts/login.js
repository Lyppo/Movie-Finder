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

console.groupCollapsed("%c📜 DOCUMENTATION COMPLÈTE login.js", "color: #FFD700; font-weight: bold; font-size: 18px;");

// 📌 SIGNIFICATION DES ÉMOJIS
console.groupCollapsed("%c📌 SIGNIFICATION DES ÉMOJIS", "color: #FFD700; font-weight: bold; font-size: 16px;");
console.log(`%c🍪 Stockage des cookies → %cVariable contenant les cookies en mémoire.`,
    "color: #32CD32; font-weight: bold;", "color: white;");
console.log(`%c📥 Chargement des cookies → %cLecture et affichage des cookies stockés.`,
    "color: #1E90FF; font-weight: bold;", "color: white;");
console.log(`%c📤 Ajout d'un cookie → %cInsertion ou mise à jour d'un cookie.`,
    "color: #FFD700; font-weight: bold;", "color: white;");
console.log(`%c🗑️ Suppression d'un cookie → %cEffacement d'un cookie spécifique.`,
    "color: #FF4500; font-weight: bold;", "color: white;");
console.log(`%c⚠️ Avertissement → %cIndique une erreur ou un problème potentiel.`,
    "color: orange; font-weight: bold;", "color: white;");
console.log(`%c📊 Affichage tableau → %cAffiche les données sous forme de tableau.`,
    "color: lightblue; font-weight: bold;", "color: white;");
console.groupEnd();

// 🔹 FONCTIONS DISPONIBLES
console.groupCollapsed("%c🔹 FONCTIONS DISPONIBLES", "color: #FFD700; font-weight: bold; font-size: 16px;");

// 🔄 CHARGEMENT DES IDENTIFIANTS
console.groupCollapsed("%c📥 CHARGEMENT DES IDENTIFIANTS", "color: #1E90FF; font-weight: bold;");
console.groupCollapsed("%c🔹 load()", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Charge les identifiants (ACCESS_TOKEN, ACCOUNT_ID, SESSION_ID) depuis les cookies.`, "color: white;");
console.groupEnd();
console.groupEnd(); // Fin du groupe CHARGEMENT DES IDENTIFIANTS

// 🔑 VÉRIFICATION D'AUTHENTIFICATION
console.groupCollapsed("%c🔑 VÉRIFICATION D'AUTHENTIFICATION", "color: #32CD32; font-weight: bold;");
console.groupCollapsed("%c🔹 loged()", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Vérifie si l'utilisateur est authentifié en consultant l'API TMDB.`, "color: white;");
console.log(`%c   → Affiche les logs de vérification dans la console.`, "color: white;");
console.log(`%c   → Retourne un booléen indiquant l'état de l'authentification.`, "color: white;");
console.groupEnd();
console.groupEnd(); // Fin du groupe VÉRIFICATION D'AUTHENTIFICATION

// 🔵 CONNEXION
console.groupCollapsed("%c🔵 CONNEXION", "color: #00BFFF; font-weight: bold;");
console.groupCollapsed("%c🔹 login(event)", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Gère la connexion de l'utilisateur et empêche le rechargement de la page.`, "color: white;");
console.log(`%c   → Génère un token temporaire et tente l'authentification via une pop-up.`, "color: white;");
console.log(`%c   → Limite à 3 tentatives d'authentification en cas d'échec.`, "color: white;");
console.log(`%c   → Enregistre le token d'accès et crée une session en cas de succès.`, "color: white;");
console.log(`%c   → Met à jour l'interface utilisateur après connexion.`, "color: white;");
console.groupEnd();
console.groupEnd(); // Fin du groupe CONNEXION

console.groupEnd(); // Fin du groupe FONCTIONS DISPONIBLES

console.log(`%c📌 Fin de la documentation.`, "color: #32CD32; font-weight: bold;");
console.groupEnd(); // Fin de la documentation générale