async function request(url, type, params = {}, content = {}) {
    console.groupCollapsed("🟢 [REQ] Création de la requête..."); // Démarre un groupe de log
    
    // Vérifie si l'URL est correcte
    if (!url.includes("api.themoviedb.org")) {
        console.error("❌ L'URL doit concerner api.themoviedb.org.");
        console.groupEnd(); 
        return null;
    }

    // Création des paramètres de recherche
    let searchParams = new URLSearchParams(params);
    url += searchParams.toString() ? `?${searchParams.toString()}` : "";

    // Ajout du token d'accès au contenu si présent
    if (content.access_token) content.access_token = ACCESS_TOKEN;

    // Démarre un groupe pour les logs de la requête
    console.groupCollapsed(`[REQUEST] ${type} → ${url}`);
    console.log("📩 Contenu envoyé :", content);

    try {
        // Envoi de la requête
        let response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`, // Utilisation de ACCESS_TOKEN
            },
            body: Object.keys(content).length > 0 ? JSON.stringify(content) : undefined // Envoie le corps seulement si le contenu n'est pas vide
        });

        // Analyse de la réponse
        const data = await response.json();
        console.log("📬 Réponse reçue :", data);

        // Gestion des erreurs de réponse
        if (!response.ok) {
            throw new Error(`⚠️ Erreur API : ${response.status}`, data);
        }

        console.groupEnd(); // Termine le groupe de log
        return data; // Retourne les données
    } catch (error) {
        console.error(`❌ Erreur : ${error.message}`); // Affiche les erreurs
        console.groupEnd(); // Termine le groupe de log en cas d'erreur
        return null;
    }
}