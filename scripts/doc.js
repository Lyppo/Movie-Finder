// Constantes pour les emojis
const EMOJIS = {
    log: "📜",
    warn: "⚠️",
    error: "❌",
    group: "🗂️",
    success: "✅",
    change: "🔄",
    addition: "➕",
    deletion: "🚫",
    info: "ℹ️",
    userProfile: "👤",
    connection: "🟠",
    loading: "🔍"
};

// Constantes pour les styles
const STYLES = {
    log: "color: #00FA9A; font-weight: bold;",
    warn: "color: #FFA500; font-weight: bold;",
    error: "color: #FF0000; font-weight: bold;",
    group: "color: #1E90FF; font-weight: bold;",
    success: "color: #32CD32; font-weight: bold;",
    change: "color: #0000FF; font-weight: bold;",
    addition: "color: #FFD700; font-weight: bold;",
    deletion: "color: #DC143C; font-weight: bold;",
    info: "color: rgb(190, 222, 255); font-weight: bold;",
    customFunction: "color: #FFA500; font-weight: bold;",
    userFunction: "color: #32CD32; font-weight: bold;"
};

// Constantes pour les tailles de police
const FONT_SIZES = {
    warn: "font-size: 12px;",
    group: "font-size: 16px;",
    info: "font-size: 12px;",
};




function afficherDocumentation(titre, significationEmojis, fonctions) {
    console.groupCollapsed(`%c📜 DOCUMENTATION COMPLÈTE ${titre}`, "color: #FFD700; font-weight: bold; font-size: 18px;");

    // Signification des emojis
    console.groupCollapsed("%c📌 SIGNIFICATION DES ÉMOJIS", "color: #FFD700; font-weight: bold; font-size: 16px;");
    significationEmojis.forEach(({ emoji, description, couleur }) => {
        console.log(`%c${emoji} ${description} → %c${description}`,
            couleur, "color: white;");
    });
    console.groupEnd(); // Ferme le groupe des significations

    // Fonctions disponibles
    console.groupCollapsed("%c🔹 FONCTIONS DISPONIBLES", "color: #FFD700; font-weight: bold; font-size: 16px;");
    fonctions.forEach(({ nom, couleur, descriptions }) => {
        console.groupCollapsed(`%c${nom}`, couleur);
        descriptions.forEach(description => {
            console.log(`%c   → ${description}`, "color: white;");
        });
        console.groupEnd(); // Ferme le groupe de chaque fonction
    });
    console.groupEnd(); // Ferme le groupe des fonctions

    console.log(`%c📌 Fin de la documentation.`, "color: #32CD32; font-weight: bold;");
    console.groupEnd(); // Ferme le groupe principal
}

// Fonction pour afficher des messages de log avec différents niveaux et styles
function logMessage(type = 'log', message = "", data = null, emoji = null) {

    // Choisir l'émoji, utiliser l'émoji par défaut selon le type
    const chosenEmoji = emoji || EMOJIS[type] || "";

    // Afficher le message selon le type spécifié
    switch (type) {
        case 'log':
            console.log(`%c${chosenEmoji} ${message}`, STYLES.log);
            if (data) console.table(data);
            break;
        case 'warn':
            console.warn(`%c${chosenEmoji} ${message}`, STYLES.warn + FONT_SIZES.warn);
            if (data) console.table(data);
            break;
        case 'error':
            console.error(`%c${chosenEmoji} ${message}`, STYLES.error);
            if (data) console.table(data);
            break;
        case 'info':
            console.info(`%c${chosenEmoji} ${message}`, STYLES.info + FONT_SIZES.info);
            if (data) console.table(data);
            break;
        case 'group':
            console.groupCollapsed(`%c${chosenEmoji} ${message}`, STYLES.group + FONT_SIZES.group);
            if (data) console.table(data);
            break;
        case 'success':
            console.log(`%c${chosenEmoji} ${message}`, STYLES.success);
            if (data) console.table(data);
            break;
        case 'change':
            console.log(`%c${chosenEmoji} ${message}`, STYLES.change);
            if (data) console.table(data);
            break;
        case 'addition':
            console.log(`%c${chosenEmoji} ${message}`, STYLES.addition);
            if (data) console.table(data);
            break;
        case 'deletion':
            console.log(`%c${chosenEmoji} ${message}`, STYLES.deletion);
            if (data) console.table(data);
            break;
        default:
            console.log(message); // Afficher un message par défaut si le type n'est pas reconnu
    }
}