async function request(type, url, params = {}, content = {}) {

    log(`Envoi de la requête ${type} vers ${url}`, 'request', { params, content }, 'request');

    let searchParams = new URLSearchParams(params);
    url += searchParams.toString() ? `?${searchParams.toString()}` : "";

    if (content.access_token) {
        content.access_token = ACCESS_TOKEN;
    }

    try {
        log('Tentative d\'exécution de la requête...', 'log', { url, type, content }, 'request');

        let response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
            body: Object.keys(content).length > 0 ? JSON.stringify(content) : undefined
        });

        // Vérification de la réponse
        if (!response.ok) {
            log(`Échec de la requête, statut : ${response.status}`, 'failure', { response }, 'request');
            return;
        }

        const data = await response.json();
        
        log('Réponse reçue avec succès', 'success', { data }, 'request');
        
        return data;
    } catch (error) {
        
        return log('Erreur lors de la requête', 'error', { error }, 'request');
    }
}