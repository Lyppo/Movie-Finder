const debug = true;
const doc = false;

// Constantes pour les emojis
const EMOJIS = {
    log: "📝",          // Journalisation
    warn: "⚠️",         // Avertissement
    error: "🔥",        // Erreur critique
    group: "📂",        // Groupe ou catégorie
    success: "✅",      // Succès
    change: "🔄",       // Changement / Mise à jour
    addition: "➕",     // Ajout
    deletion: "❌",     // Suppression
    connection: "🔌",   // Connexion
    loading: "🔍",      // Chargement
    cookies: "🍪",      // Cookies (inchangé)
    info: "ℹ️"         // Information générale
};

// Constantes pour les styles
const STYLES = {
    log: "color: #3498db; font-weight: bold;",          // Bleu vif pour la journalisation
    warn: "color: #f39c12; font-weight: bold;",         // Orange pour les avertissements
    error: "color: #e74c3c; font-weight: bold;",        // Rouge vif pour les erreurs
    group: "color: #9b59b6; font-weight: bold;",        // Violet pour les groupes
    success: "color: #2ecc71; font-weight: bold;",      // Vert vif pour le succès
    change: "color: #16a085; font-weight: bold;",       // Vert-bleu pour les changements
    addition: "color: #f1c40f; font-weight: bold;",     // Jaune pour l'ajout
    deletion: "color: #c0392b; font-weight: bold;",     // Rouge foncé pour la suppression
    connection: "color: #d35400; font-weight: bold;",   // Orange foncé pour la connexion
    loading: "color: #7f8c8d; font-weight: bold;",      // Gris pour le chargement
    cookies: "color: #d4a017; font-weight: bold;",      // Marron doré pour les cookies
    info: "color: #1E90FF; font-weight: bold;"          // Bleu pour l'information
};

// Constantes pour les tailles de police
const FONT_SIZES = {
    log: "font-size: 10px;",          // Taille standard pour la journalisation
    warn: "font-size: 12px;",         // Légèrement plus grand pour attirer l'attention
    error: "font-size: 14px;",        // Plus grand pour les erreurs critiques
    group: "font-size: 14px;",        // Importante pour distinguer les groupes
    success: "font-size: 10px;",      // Standard, pas besoin d'attirer l'attention excessive
    change: "font-size: 10px;",       // Standard pour les modifications
    addition: "font-size: 10px;",     // Standard pour les ajouts
    deletion: "font-size: 12px;",     // Légèrement plus grand pour les suppressions
    connection: "font-size: 10px;",   // Standard pour les connexions
    loading: "font-size: 10px;",      // Standard pour les chargements
    cookies: "font-size: 10px;",      // Standard pour les cookies
    info: "font-size: 10px;"          // Standard pour l'information
};

function logMessage(type = 'log', message = "exemple", name = null, data = null) {

    if (!debug && (type !== 'warn' && type !== 'error' && type !== 'group')) return; // Ne pas afficher les logs en mode non-debug

    let args = "";
    let msg = "%c";

    // Vérification en une seule étape pour éviter plusieurs accès
    const style = STYLES[type] || "";
    const fontSize = FONT_SIZES[type] || "";
    const emoji = EMOJIS[type] || "";

    if (style || fontSize) {
        args += style + fontSize;
    }

    if (emoji) msg += emoji + " ";
    if (name) msg += `[${name.toUpperCase()}] `;
    msg += message;

    if (type === 'group') {
        console.groupCollapsed(msg, args);
    } else {
        console[type] ? console[type](msg, args) : console.log(msg, args);
    }

    // Affichage des données en table si présentes
    if (data && typeof data === "object") console.table(data);
}

function afficherDocumentation(titre = "Unnamed", fonctions = []) {

    if (!doc) return; // Ne pas afficher la documentation en mode non-doc

    console.groupCollapsed(`%c📜 Importation de ${titre}.js`, "color: #9b59b6; font-weight: bold; font-size: 18px;");

    if (fonctions.length === 0) {
        logMessage("warn", "Aucune fonction définie.");
        console.groupEnd();
        return;
    }

    // Itération sur chaque fonction dans la liste
    for (let fonction of fonctions) {
        let nom = fonction.nom || "Unnamed";
        let params = fonction.params || [];
        let style = fonction.style || "log";
        let descriptions = fonction.descriptions || ["Aucune définition disponible"];

        let styleFormat = STYLES[style] || STYLES["log"]; // Style par défaut
        let paramBgStyle = `background: #007FFF; padding: 0 2px; border-radius: 5px; text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000; ${styleFormat}`; // Style des paramètres forcés

        let paramText = "";
        let paramStyles = [styleFormat]; // Style pour le nom de la fonction

        // Itération sur les paramètres
        for (let param of params) {
            let paramName, paramStyle;

            if (typeof param === "string") {
                paramName = param;
                paramStyle = styleFormat; // Optionnel → Couleur du style
            } else if (param.forced) {
                paramName = param.forced;
                paramStyle = paramBgStyle; // Obligatoire → Fond bleu clair
            }

            // Ajout de la virgule si ce n'est pas le premier paramètre
            if (paramText) {
                paramText += `%c, `;
                paramStyles.push(styleFormat);
            }

            paramText += `%c${paramName}`;
            paramStyles.push(paramStyle);
        }

        // Ajouter la parenthèse de fermeture avec le style de la fonction
        paramText += `%c):`;
        paramStyles.push(styleFormat);

        // Affichage de la fonction
        console.groupCollapsed(`%c${nom}(${paramText}`, ...paramStyles);

        // Itération sur les descriptions
        for (let description of descriptions) {
            console.log(`%c   → ${description}`, "color: yellow;");
        }

        console.groupEnd();
    }

    console.groupEnd();
}

// Appel de la documentation pour logMessage
afficherDocumentation("doc", [
    {
        nom: "logMessage",
        params: [
            { forced: "type" },
            { forced: "message" },
            "name",
            "data"
        ],
        descriptions: [
            "Affiche un message dans la console.",
            "Le type détermine le niveau de journalisation (log, warn, error, etc.).",
            "Le message est le texte affiché.",
            "Les paramètres 'name' et 'data' sont optionnels pour des informations supplémentaires."
        ]
    },
    {
        nom: "afficherDocumentation",
        params: [
            { forced: "titre" },
            { forced: "fonctions" }
        ],
        descriptions: [
            "afficherDocumentation permet d'afficher la documentation des fonctions d'un fichier JavaScript dans la console.",
            "Elle prend deux paramètres principaux :",
            "1. titre : un titre qui représente le nom du fichier ou de la catégorie pour lequel la documentation est générée.",
            "2. fonctions : un tableau d'objets représentant les fonctions du fichier. Chaque objet dans le tableau doit contenir les informations suivantes :",
            "- nom : Le nom de la fonction à afficher.",
            "- params : Un tableau de paramètres que la fonction accepte. Chaque paramètre peut être une chaîne de caractères (nom du paramètre) ou un objet avec une clé `forced` pour indiquer que le paramètre est obligatoire.",
            "- style : Un paramètre optionnel qui définit le style de journalisation (par défaut 'log'). Cela permet de personnaliser la couleur, et d'autres aspects visuels de l'affichage des fonctions.",
            "- descriptions : Un tableau de chaînes de caractères qui décrit brièvement la fonction. Si ce tableau est vide ou non fourni, une description par défaut sera utilisée.",
            "Exemple d'utilisation :",
            "afficherDocumentation('Mon fichier', [",
            "    {",
            "        nom: 'maFonction',",
            "        params: ['param1', { forced: 'param2' }],",
            "        style: 'success',",
            "        descriptions: ['Cette fonction fait quelque chose de génial.']",
            "    }",
            "]);",
            "Cet exemple afficherait la documentation pour une fonction appelée 'maFonction', avec deux paramètres : 'param1' (optionnel) et 'param2' (obligatoire). La fonction serait affichée avec le style de succès (vert)."
        ]
    }
]);