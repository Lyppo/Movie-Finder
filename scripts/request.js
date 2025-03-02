async function request(url, type = "GET", params = {}, content = {}) {
    logMessage('connection', `Création de la requête...\n       [${type}] → ${url}`, "REQ"); // Démarre un groupe de log

    // Vérifie si l'URL est correcte
    if (!url.includes("api.themoviedb.org")) {
        logMessage('error', "L'URL doit concerner api.themoviedb.org.", "REQ");
        logMessage('end');
        return;
    }

    // Vérification de la méthode HTTP
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!validMethods.includes(type)) {
        logMessage('error', `Méthode HTTP invalide : ${type}.`, "REQ");
        logMessage('end');
        return;
    }

    // Création des paramètres de recherche
    let searchParams = new URLSearchParams(params);
    url += searchParams.toString() ? `?${searchParams.toString()}` : "";

    // Ajout du token d'accès au contenu si présent
    if (content.access_token) {
        content.access_token = ACCESS_TOKEN; // Remplace le token par la valeur actuelle
    }

    logMessage('log', "Contenu envoyé :", "REQ", {params: params, content: content}); // Affiche le contenu envoyé

    try {
        // Envoi de la requête
        let response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`, // Utilisation de ACCESS_TOKEN
            },
            body: Object.keys(content).length > 0 ? JSON.stringify(content) : undefined
        });

        // Analyse de la réponse
        const data = await response.json();
        logMessage('success', "Réponse reçue :", "REQ", data);

        // Gestion des erreurs de réponse
        if (!response.ok) {
            logMessage('end');
            throw new Error(`⚠️ Erreur API : ${response.status} - ${data.status_message || 'Erreur inconnue'}`);
        }

        logMessage('end');
        return data; // Retourne les données
    } catch (error) {
        logMessage('error', `Erreur : ${error.message}`, "REQ"); // Affiche les erreurs
        logMessage('end');
        return;
    }
}

async function loadImage(element, imagePath) {
    const resolutions = [
        { size: 'w45', width: 45 },
        { size: 'w92', width: 92 },
        { size: 'w154', width: 154 },
        { size: 'w185', width: 185 },
        { size: 'w300', width: 300 },
        { size: 'w342', width: 342 },
        { size: 'w500', width: 500 },
        { size: 'w780', width: 780 },
        { size: 'w1280', width: 1280 },
        { size: 'original', width: Infinity }
    ];

    // Afficher la largeur de l'élément
    logMessage('log', "Élément largeur: " + element.clientWidth, 'loadImage');

    // Fonction pour calculer le flou
    function calculateBlur(elementWidth, loadedWidth) {
        const blur = Math.max(15 - (loadedWidth / 20), 0); // Ajuster selon besoin
        logMessage('loading', `Calcul du flou: ${blur} (Élément Largeur: ${elementWidth}, Chargé Largeur: ${loadedWidth})`, "loadImage");
        return blur;
    }

    // Variable pour suivre l'indice de l'image chargée
    let lastLoadedIndex = -1;

    // Fonction asynchrone pour charger l'image
    async function loadImageAtIndex(index) {
        if (index < 0 || index >= resolutions.length) return; // Vérifier l'indice

        const res = resolutions[index]; // Obtenir la résolution actuelle
        // Si l'indice est inférieur à lastLoadedIndex, ne rien faire
        if (lastLoadedIndex >= index) return;

        logMessage('loading', `Chargement de l'image à l'indice ${index}: ${res.size}`, "loadImage");
        
        let img = new Image();
        img.src = `https://image.tmdb.org/t/p/${res.size}${imagePath}`;

        // Lorsque l'image est chargée
        img.onload = () => {
            logMessage('success', `Image chargée: ${img.src}`, "loadImage");
            lastLoadedIndex = index; // Mettre à jour l'indice
            element.src = img.src; // Changer le src de l'élément
            element.style.filter = `blur(${calculateBlur(element.clientWidth, res.width)}px)`; // Appliquer le flou
        };

        // Retourner une promesse qui se résout lorsque l'image est chargée
        return new Promise((resolve) => {
            img.onload = () => {
                lastLoadedIndex = index; // Mettre à jour l'indice
                element.src = img.src; // Changer le src de l'élément
                element.style.filter = `blur(${calculateBlur(element.clientWidth, res.width)}px)`; // Appliquer le flou
                resolve(index); // Résoudre la promesse une fois l'image chargée
            };
        });
    }

    // Appeler la fonction pour charger toutes les résolutions, une par une
    for (let i = 0; i < resolutions.length; i++) {
        await loadImageAtIndex(i);
    }
}

afficherDocumentation("request", [
    {
        nom: "request",
        params: [
            { forced: "url" },    // URL de l'API
            { forced: "type" },   // Type de requête (GET, POST, PUT, DELETE)
            "params",             // Paramètres de requête optionnels (query params)
            "content"             // Corps de la requête (données envoyées)
        ],
        style: "connection",
        descriptions: [
            "Effectue une requête asynchrone vers l'API TMDb avec `fetch`.",
            "Vérifie si l'URL est correcte (`api.themoviedb.org`).",
            "Supporte les méthodes HTTP : GET, POST, PUT, DELETE.",
            "Ajoute automatiquement l'`ACCESS_TOKEN` dans les headers.",
            "Affiche les requêtes et réponses dans la console pour le debug.",
            "Retourne les données de la réponse ou `null` en cas d'erreur."
        ]
    }
]);