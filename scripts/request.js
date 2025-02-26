async function request(url, type, params = {}, content = {}) {
    logMessage('group', "🟢 [REQ] Création de la requête..."); // Démarre un groupe de log

    // Vérifie si l'URL est correcte
    if (!url.includes("api.themoviedb.org")) {
        logMessage('error', "❌ L'URL doit concerner api.themoviedb.org.");
        logMessage('group', null);
        return null;
    }

    // Vérification de la méthode HTTP
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!validMethods.includes(type)) {
        logMessage('error', `❌ Méthode HTTP invalide : ${type}.`);
        logMessage('group', null);
        return null;
    }

    // Création des paramètres de recherche
    let searchParams = new URLSearchParams(params);
    url += searchParams.toString() ? `?${searchParams.toString()}` : "";

    // Ajout du token d'accès au contenu si présent
    if (content.access_token) {
        content.access_token = ACCESS_TOKEN; // Remplace le token par la valeur actuelle
    }

    logMessage('group', `[REQUEST] ${type} → ${url}`);
    logMessage('log', "📩 Contenu envoyé :", { ...content, access_token: '***' }); // Masque le token dans les logs

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
        logMessage('log', "📬 Réponse reçue :", data);

        // Gestion des erreurs de réponse
        if (!response.ok) {
            throw new Error(`⚠️ Erreur API : ${response.status} - ${data.status_message || 'Erreur inconnue'}`);
        }

        logMessage('group', null); // Termine le groupe de log
        return data; // Retourne les données
    } catch (error) {
        logMessage('error', `❌ Erreur : ${error.message}`); // Affiche les erreurs
        logMessage('group', null); // Termine le groupe de log en cas d'erreur
        return null;
    }
}

// Appel de la fonction pour afficher la documentation
afficherDocumentation(
    "request.js",
    [
        { emoji: "🟢", description: "Création de la requête", couleur: "color: #1E90FF; font-weight: bold;" },
        { emoji: "❌", description: "Erreur d'URL ou de requête", couleur: "color: #FF4500; font-weight: bold;" },
        { emoji: "📩", description: "Contenu envoyé", couleur: "color: lightblue; font-weight: bold;" },
        { emoji: "📬", description: "Réponse reçue", couleur: "color: #32CD32; font-weight: bold;" },
        { emoji: "⚠️", description: "Erreur API", couleur: "color: orange; font-weight: bold;" }
    ],
    [
        {
            nom: "request(url, type, params = {}, content = {})",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Effectue une requête HTTP vers l'API TMDB.",
                "Vérifie que l'URL est correcte avant d'envoyer la requête.",
                "Gère l'ajout du token d'accès dans le contenu si présent.",
                "Affiche les logs pour le contenu envoyé et la réponse reçue.",
                "Retourne les données de la réponse ou null en cas d'erreur."
            ]
        }
    ]
);