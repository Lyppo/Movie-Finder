async function request(url, type = "GET", params = {}, content = {}) {
    logMessage('group', `Création de la requête...\n${type} → ${url}`, "REQ"); // Démarre un groupe de log

    // Vérifie si l'URL est correcte
    if (!url.includes("api.themoviedb.org")) {
        logMessage('error', "L'URL doit concerner api.themoviedb.org.", "REQ");
        console.groupEnd(); // Termine le groupe de log en cas d'erreur
        return null;
    }

    // Vérification de la méthode HTTP
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!validMethods.includes(type)) {
        logMessage('error', `Méthode HTTP invalide : ${type}.`, "REQ");
        console.groupEnd(); // Termine le groupe de log en cas d'erreur
        return null;
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
            console.groupEnd(); // Termine le groupe de log en cas d'erreur
            throw new Error(`⚠️ Erreur API : ${response.status} - ${data.status_message || 'Erreur inconnue'}`);
        }

        console.groupEnd(); // Termine le groupe de log en cas de succès
        return data; // Retourne les données
    } catch (error) {
        logMessage('error', `Erreur : ${error.message}`, "REQ"); // Affiche les erreurs
        console.groupEnd(); // Termine le groupe de log en cas d'erreur
        return null;
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