let cookies = {}; // 🍪 Stockage des cookies

// 🔹 Fonction pour récupérer les cookies
function getCookies() {
    logMessage('group', "Chargement des cookies..."); // Démarrer un groupe de log pour le chargement des cookies

    if (!document.cookie) {
        logMessage('warn', "Aucun cookie trouvé."); // Avertir si aucun cookie n'est trouvé
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

    logMessage('log', "Cookies chargés :", cookies); // Afficher les cookies sous forme de tableau
    logMessage('log', `Total cookies chargés : ${Object.keys(cookies).length}`); // Nombre total de cookies
    console.groupEnd(); // Assurez-vous que le groupe est toujours fermé
}

// 🔹 Ajouter ou mettre à jour un cookie
function setCookie(name, value) {
    logMessage('group', "Ajout d'un cookie..."); // Démarrer un groupe de log pour l'ajout de cookie

    if (!name || !value) {
        logMessage('warn', "Impossible d'ajouter un cookie : Nom et valeur requis !"); // Avertir si le nom ou la valeur est manquant
        console.groupEnd();
        return;
    }

    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${2592000}; path=/`; // Durée de vie : 30 jours
    cookies[name] = value;

    logMessage('log', "Cookie ajouté :", { [name]: value }); // Afficher le cookie ajouté sous forme de tableau
    logMessage('log', `Cookie : ${name} = ${value}`); // Afficher le nom et la valeur du cookie
    console.groupEnd(); // Assurez-vous que le groupe est toujours fermé
}

// 🔹 Supprimer un cookie spécifique
function clearCookie(name) {
    logMessage('group', "Suppression d'un cookie..."); // Démarrer un groupe de log pour la suppression de cookie

    if (!cookies[name]) {
        logMessage('warn', `Le cookie "${name}" n'existe pas.`); // Avertir si le cookie n'existe pas
        console.groupEnd();
        return;
    }

    document.cookie = `${name}=; max-age=0; path=/`;
    delete cookies[name];

    logMessage('log', "Cookies après suppression :", cookies); // Afficher les cookies restants après suppression
    logMessage('log', `Cookie supprimé : ${name}`); // Afficher le nom du cookie supprimé
    console.groupEnd(); // Assurez-vous que le groupe est toujours fermé
}

// Appel de la fonction pour afficher la documentation
afficherDocumentation(
    "cookies.js",
    [
        { emoji: "🍪", description: "Stockage des cookies", couleur: "color: #32CD32; font-weight: bold;" },
        { emoji: "📥", description: "Chargement des cookies", couleur: "color: #1E90FF; font-weight: bold;" },
        { emoji: "📤", description: "Ajout d'un cookie", couleur: "color: #FFD700; font-weight: bold;" },
        { emoji: "🗑️", description: "Suppression d'un cookie", couleur: "color: #FF4500; font-weight: bold;" },
        { emoji: "⚠️", description: "Avertissement", couleur: "color: orange; font-weight: bold;" },
        { emoji: "📊", description: "Affichage tableau", couleur: "color: lightblue; font-weight: bold;" }
    ],
    [
        {
            nom: "📥 getCookies()",
            couleur: "color: #1E90FF; font-weight: bold;",
            descriptions: [
                "Récupère tous les cookies stockés dans le navigateur.",
                "Stocke les cookies dans un objet JavaScript.",
                "Affiche les cookies sous forme de tableau dans la console."
            ]
        },
        {
            nom: "📤 setCookie(name, value)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Ajoute un cookie ou met à jour sa valeur.",
                "Le cookie est stocké pour une durée de 30 jours.",
                "Affiche le cookie ajouté sous forme de tableau."
            ]
        },
        {
            nom: "🗑️ clearCookie(name)",
            couleur: "color: #FF4500; font-weight: bold;",
            descriptions: [
                "Supprime un cookie spécifique en le mettant à expiration.",
                "Met à jour la liste des cookies après suppression.",
                "Affiche un message si le cookie n'existe pas."
            ]
        }
    ]
);