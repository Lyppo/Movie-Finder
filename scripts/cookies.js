let cookies = {}; // 🍪 Stockage des cookies

// 🔹 Fonction pour récupérer les cookies
function getCookies() {
    console.groupCollapsed("📥 Chargement des cookies...");

    if (!document.cookie) {
        console.warn("⚠️ Aucun cookie trouvé.");
        console.groupEnd();
        return;
    }

    cookies = {}; // Réinitialisation du dictionnaire
    let cookiesArray = document.cookie.split('; '); // On récupère les cookies

    for (let i = 0; i < cookiesArray.length; i++) {
        let [name, value] = cookiesArray[i].split('='); // On sépare le nom et la valeur
        if (name) {
            cookies[name] = decodeURIComponent(value);
            console.log(`✅ Cookie chargé : %c${name}%c = %c${value}`, 
                        "color: blue; font-weight: bold; padding: 2px 5px; background-color: darkgray; border-radius: 5px;", // Clé en bleu avec fond sombre
                        "color: inherit;",                                          // Séparateur normal
                        "color: green; font-weight: bold;"                         // Valeur en vert
            );
        }
    }

    console.log(`🎯 Total cookies chargés : %c${Object.keys(cookies).length}`, 
                "color: lightblue; font-weight: bold; font-size: 12px;"); // Nombre de cookies en lightblue

    console.groupEnd();
}

// 🔹 Ajouter ou mettre à jour un cookie
function setCookie(name, value) {
    if (!name || !value) {
        console.warn("⚠️ Impossible d'ajouter un cookie : nom et valeur requis !");
        return;
    }

    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${2592000}; path=/`; // Durée de vie : 30 jours
    cookies[name] = value;

    console.log(`🍪 Cookie ajouté : %c${name}%c = %c${value}`, 
                "color: blue; font-weight: bold; padding: 2px 5px; background-color: darkgray; border-radius: 5px;", // Clé en bleu avec fond sombre
                "color: inherit;",                                          // Séparateur normal
                "color: green; font-weight: bold;"                         // Valeur en vert
    );
}

// 🔹 Supprimer un cookie spécifique
function clearCookie(name) {
    if (!cookies[name]) {
        console.warn(`⚠️ Le cookie "%c${name}%c" n'existe pas.`, 
                     "color: red; font-weight: bold;", "color: inherit;");
        return;
    }

    document.cookie = `${name}=; max-age=0; path=/`;
    delete cookies[name];

    console.log(`🗑️ %cCookie supprimé : %c${name}`, 
                "color: red; font-weight: bold;",  // Titre en rouge
                "color: #ff4500; font-weight: bold;" // Nom du cookie en orange foncé
    );
}

// 🔹 Chargement des cookies au démarrage
getCookies();