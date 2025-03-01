// 🍪 Stockage des cookies
let cookies = {}; 

// 🔹 Fonction pour récupérer les cookies
function getCookies() {
    logMessage('group', "Chargement des cookies..."); // Démarre un groupe de log pour le chargement des cookies

    if (!document.cookie) {
        logMessage('warn', "Aucun cookie trouvé."); // Avertit si aucun cookie n'est trouvé
        console.groupEnd();
        return;
    }

    cookies = {}; // Réinitialisation du dictionnaire
    let cookiesArray = document.cookie.split('; '); // On récupère les cookies

    for (let i = 0; i < cookiesArray.length; i++) {
        let [name, value] = cookiesArray[i].split('='); // On sépare le nom et la valeur
        if (name) {
            cookies[name] = decodeURIComponent(value); // Ajoute le cookie dans l'objet
        }
    }

    logMessage('success', "Cookies chargés :", null, cookies); // Affiche les cookies sous forme de tableau
    logMessage('cookies', `Total cookies chargés : ${Object.keys(cookies).length}`); // Affiche le nombre total de cookies
    console.groupEnd(); // Assurez-vous que le groupe est toujours fermé
}

// 🔹 Ajouter ou mettre à jour un cookie
function setCookie(name, value) {
    logMessage('group', "Ajout d'un cookie..."); // Démarre un groupe de log pour l'ajout de cookie

    if (!name || !value) {
        logMessage('warn', "Impossible d'ajouter un cookie : Nom et valeur requis !"); // Avertit si le nom ou la valeur est manquant
        console.groupEnd();
        return;
    }

    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${2592000}; path=/`; // Durée de vie : 30 jours
    cookies[name] = value; // Met à jour l'objet cookies

    logMessage('addition', "Cookie ajouté :", null, { [name]: value }); // Affiche le cookie ajouté sous forme de tableau
    logMessage('cookies', `Cookie : ${name} = ${value}`); // Affiche le nom et la valeur du cookie
    console.groupEnd(); // Assurez-vous que le groupe est toujours fermé
}

// 🔹 Supprimer un cookie spécifique
function clearCookie(name) {
    logMessage('group', "Suppression d'un cookie..."); // Démarre un groupe de log pour la suppression de cookie

    if (!cookies[name]) {
        logMessage('warn', `Le cookie "${name}" n'existe pas.`); // Avertit si le cookie n'existe pas
        console.groupEnd();
        return;
    }

    document.cookie = `${name}=; max-age=0; path=/`; // Supprime le cookie
    delete cookies[name]; // Supprime le cookie de l'objet

    logMessage('cookies', "Cookies après suppression :", null, cookies); // Affiche les cookies restants après suppression
    logMessage('deletion', `Cookie supprimé : ${name}`); // Affiche le nom du cookie supprimé
    console.groupEnd(); // Assurez-vous que le groupe est toujours fermé
}

afficherDocumentation("cookies", [
    {
        nom: "getCookies",
        params: [],
        style: "log",
        descriptions: [
            "Récupère tous les cookies stockés dans le navigateur.",
            "Affiche les cookies sous forme de tableau dans la console.",
            "Si aucun cookie n'est trouvé, un avertissement est affiché."
        ]
    },
    {
        nom: "setCookie",
        params: [
            { forced: "name" }, // Paramètre obligatoire : nom du cookie
            { forced: "value" } // Paramètre obligatoire : valeur du cookie
        ],
        style: "addition",
        descriptions: [
            "Ajoute un cookie avec un nom et une valeur spécifiés.",
            "Le cookie a une durée de vie de 30 jours.",
            "Affiche un message de confirmation et le cookie ajouté."
        ]
    },
    {
        nom: "clearCookie",
        params: [
            { forced: "name" } // Paramètre obligatoire : nom du cookie à supprimer
        ],
        style: "deletion",
        descriptions: [
            "Supprime un cookie spécifique en utilisant son nom.",
            "Si le cookie n'existe pas, un avertissement est affiché.",
            "Affiche les cookies restants après la suppression."
        ]
    }
]);