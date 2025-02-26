let cookies = {}; // 🍪 Stockage des cookies

// 🔹 Fonction pour récupérer les cookies
function getCookies() {
    console.groupCollapsed("📥 %cChargement des cookies...", "color: #1E90FF; font-weight: bold;");

    if (!document.cookie) {
        console.warn("⚠️ %cAucun cookie trouvé.", "color: orange; font-weight: bold;");
        console.groupEnd();
        return;
    }

    cookies = {}; // Réinitialisation du dictionnaire
    let cookiesArray = document.cookie.split('; '); // On récupère les cookies

    for (let i = 0; i < cookiesArray.length; i++) {
        let [name, value] = cookiesArray[i].split('='); // On sépare le nom et la valeur
        if (name) {
            cookies[name] = decodeURIComponent(value);
        }
    }

    console.table(cookies); // 📊 Affichage sous forme de tableau
    console.log(`🎯 %cTotal cookies chargés : %c${Object.keys(cookies).length}`, 
                "color: lightblue; font-weight: bold;", "color: #32CD32; font-weight: bold;"); // Nombre total en vert
    console.groupEnd();
}

// 🔹 Ajouter ou mettre à jour un cookie
function setCookie(name, value) {
    console.groupCollapsed("📤 %cAjout d'un cookie...", "color: #FFD700; font-weight: bold;");

    if (!name || !value) {
        console.warn("⚠️ %cImpossible d'ajouter un cookie : Nom et valeur requis !", "color: red; font-weight: bold;");
        console.groupEnd();
        return;
    }

    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${2592000}; path=/`; // Durée de vie : 30 jours
    cookies[name] = value;

    console.table({ [name]: value }); // 📊 Affichage sous forme de tableau

    console.log(`🍪 %cCookie ajouté : %c${name}%c = %c${value}`, 
                "color: #1E90FF; font-weight: bold;",  // Préfixe
                "color: blue; font-weight: bold; background-color: darkgray; padding: 2px 5px; border-radius: 5px;", // Clé en bleu sur fond gris
                "color: inherit;", // Séparateur normal
                "color: green; font-weight: bold;" // Valeur en vert
    );
    console.groupEnd();
}

// 🔹 Supprimer un cookie spécifique
function clearCookie(name) {
    console.groupCollapsed("🗑️ %cSuppression d'un cookie...", "color: #FF4500; font-weight: bold;");
    
    if (!cookies[name]) {
        console.warn(`⚠️ %cLe cookie "%c${name}%c" n'existe pas.`, 
                     "color: orange; font-weight: bold;", "color: red; font-weight: bold;", "color: inherit;");
        console.groupEnd();
        return;
    }

    document.cookie = `${name}=; max-age=0; path=/`;
    delete cookies[name];

    console.table(cookies); // 📊 Mise à jour du tableau après suppression

    console.log(`🗑️ %cCookie supprimé : %c${name}`, 
                "color: red; font-weight: bold;",  // Titre en rouge
                "color: #FF4500; font-weight: bold;" // Nom du cookie en orange foncé
    );
    console.groupEnd();
}

console.groupCollapsed("%c📜 DOCUMENTATION COMPLÈTE cookies.js", "color: #FFD700; font-weight: bold; font-size: 18px;");

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

console.groupCollapsed("%c🔹 FONCTIONS DISPONIBLES", "color: #FFD700; font-weight: bold; font-size: 16px;");

console.groupCollapsed("%c📥 getCookies()", "color: #1E90FF; font-weight: bold;");
console.log(`%c   → Récupère tous les cookies stockés dans le navigateur.`, "color: white;");
console.log(`%c   → Stocke les cookies dans un objet JavaScript.`, "color: white;");
console.log(`%c   → Affiche les cookies sous forme de tableau dans la console.`, "color: white;");
console.groupEnd();

console.groupCollapsed("%c📤 setCookie(name, value)", "color: #FFD700; font-weight: bold;");
console.log(`%c   → Ajoute un cookie ou met à jour sa valeur.`, "color: white;");
console.log(`%c   → Le cookie est stocké pour une durée de 30 jours.`, "color: white;");
console.log(`%c   → Affiche le cookie ajouté sous forme de tableau.`, "color: white;");
console.groupEnd();

console.groupCollapsed("%c🗑️ clearCookie(name)", "color: #FF4500; font-weight: bold;");
console.log(`%c   → Supprime un cookie spécifique en le mettant à expiration.`, "color: white;");
console.log(`%c   → Met à jour la liste des cookies après suppression.`, "color: white;");
console.log(`%c   → Affiche un message si le cookie n'existe pas.`, "color: white;");
console.groupEnd();

console.groupEnd(); // Ferme le groupe des fonctions

console.log(`%c📌 Fin de la documentation.`, "color: #32CD32; font-weight: bold;");

console.groupEnd(); // Ferme le groupe principal