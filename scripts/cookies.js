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

// 📜 Documentation en console
console.log(`%c📚 DOCUMENTATION DES COOKIES :

%c📥 getCookies() → %cCharge tous les cookies et les affiche sous forme de tableau.
    %c🔹 Si aucun cookie n'est trouvé → %c⚠️ Avertissement affiché.
    %c🔹 Si des cookies existent → %c✅ Affichage dans un tableau + total des cookies chargés.

%c📤 setCookie(nom, valeur) → %cAjoute ou met à jour un cookie avec une durée de vie de 30 jours.
    %c🔹 Nom et valeur sont requis → %c⚠️ Avertissement si l'un des deux est manquant.
    %c🔹 Succès → %c🍪 Cookie ajouté avec affichage dans un tableau.

%c🗑️ clearCookie(nom) → %cSupprime un cookie spécifique.
    %c🔹 Si le cookie n'existe pas → %c⚠️ Avertissement affiché.
    %c🔹 Si le cookie est supprimé → %c🗑️ Confirmation + tableau mis à jour.

%c🔹 Logs et couleurs :
    📊 %cconsole.table()%c → Affichage clair sous forme de tableau.
    📥 %cChargement des cookies → %c🔵 Texte bleu.
    ⚠️ %cErreurs et avertissements → %c🟠 Texte orange.
    🍪 %cAjout de cookie → %c🟢 Texte vert.
    🗑️ %cSuppression de cookie → %c🔴 Texte rouge.

%c📌 Fin de la documentation.`,
    
"color: #FFD700; font-weight: bold; font-size: 16px;", // 📚 Titre principal en doré

"color: #1E90FF; font-weight: bold;", "color: white;", // 📥 getCookies
"color: white;", "color: orange; font-weight: bold;",
"color: white;", "color: green; font-weight: bold;",

"color: #FFA500; font-weight: bold;", "color: white;", // 📤 setCookie
"color: white;", "color: orange; font-weight: bold;",
"color: white;", "color: green; font-weight: bold;",

"color: #FF4500; font-weight: bold;", "color: white;", // 🗑️ clearCookie
"color: white;", "color: orange; font-weight: bold;",
"color: white;", "color: red; font-weight: bold;",

"color: grey; font-weight: bold;", // 🔹 Logs et couleurs
"color: lightblue; font-weight: bold;", "color: white;",
"color: blue; font-weight: bold;", "color: white;",
"color: orange; font-weight: bold;", "color: white;",
"color: green; font-weight: bold;", "color: white;",
"color: red; font-weight: bold;", "color: white;",

"color: #32CD32; font-weight: bold;" // 📌 Fin de doc
);    