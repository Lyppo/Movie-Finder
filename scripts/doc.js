const debug = false;
const doc = false;
const groupe = true;

// Constantes pour les emojis
const EMOJIS = {
    log: "📝",          // Journalisation
    warn: "⚠️",         // Avertissement
    error: "🔥",        // Erreur critique
    info: "ℹ️",           // Information générale
    group: "📂",        // Groupe ou catégorie
    end: "🔚",          // Fin de la journalisation
    success: "✅",      // Succès
    addition: "➕",     // Ajout
    change: "🔄",       // Changement / Mise à jour
    deletion: "❌",     // Suppression
    connection: "🔌",   // Connexion
    loading: "🔍",      // Chargement
    cookies: "🍪",      // Cookies (inchangé)
    creation: "🛠️",     // Création
};

// Constantes pour les styles
const STYLES = {
    log: "color: #3498db;",          // Bleu vif pour la journalisation
    warn: "color: #f39c12;",         // Orange pour les avertissements
    error: "color: #e74c3c;",        // Rouge vif pour les erreurs
    group: "color: #9b59b6;",        // Violet pour les groupes
    success: "color: #2ecc71;",      // Vert vif pour le succès
    change: "color: #16a085;",       // Vert-bleu pour les changements
    addition: "color: #f1c40f;",     // Jaune pour l'ajout
    deletion: "color: #c0392b;",     // Rouge foncé pour la suppression
    connection: "color: #d35400;",   // Orange foncé pour la connexion
    loading: "color: #7f8c8d;",      // Gris pour le chargement
    cookies: "color: #d4a017;",      // Marron doré pour les cookies
    info: "color: #1E90FF;",         // Bleu pour l'information
    creation: "color: #884422;"     // Bleu foncé pour la création
};

// Constantes pour les tailles de police
const FONT_SIZES = {
    log: "font-size: 1em;",            // Standard pour la journalisation
    warn: "font-size: 1.1em;",         // Légèrement plus grand pour attirer l'attention
    error: "font-size: 1.2em;",        // Plus grand pour les erreurs critiques
    group: "font-size: 1.1em;",        // Importante pour distinguer les groupes
    loading: "font-size: 0.95em;",     // Standard pour les chargements
    info: "font-size: 0.9em;"          // Standard pour l'information
};

async function logMessage(type, message = "", name = null, data = null, group = false, forced = false) {

    if (!forced && !debug && (type !== 'warn' && type !== 'error')) return; // Ne pas afficher les logs en mode non-debug

    if (type === 'end') {
        if (!groupe)console.groupEnd();
        return;
    }

    let args = "";
    let msg = "";

    let fontSize;
    
    if (group) {
        fontSize = FONT_SIZES['group'];
    }
    else {
        fontSize = FONT_SIZES[type] || FONT_SIZES['log'];
    }
    const style = STYLES[type] || STYLES['log'];
    const emoji = EMOJIS[type] || EMOJIS['log'];

    args += style + fontSize + "font-weight: bold;";

    msg += emoji + " ";
    if (name) msg += `[${name.toUpperCase()}] `;
    msg +=message;

    if (!groupe && type === 'group') type = 'log';

    if (type === 'group') {
        msg = "%c" + msg;
        console.groupCollapsed(msg, args);
    } else if (groupe && group) {
        msg = "%c" + EMOJIS['group'] + " → " + msg;
        console.groupCollapsed(msg, args);
    } else {
        msg = "%c" + msg;
        console[type] ? console[type](msg, args) : console.log(msg, args);
    }

    // Affichage des données en table si présentes
    if (data && typeof data === "object") console.table(data);
}

async function afficherDocumentation(titre = "Unnamed", fonctions = []) {

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