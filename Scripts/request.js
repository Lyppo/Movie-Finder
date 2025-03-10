async function request(type, url, params = {}, content = {}) {

    let searchParams = new URLSearchParams(params);
    url += searchParams.toString() ? `?${searchParams.toString()}` : "";

    if (content.access_token) {
        content.access_token = ACCESS_TOKEN;
    }

    try {
        log('Envoi de la requête', 'request', { type: type, url: url, params: params, content: content }, 'request');

        let response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
            body: Object.keys(content).length > 0 ? JSON.stringify(content) : undefined
        });

        const data = await response.json();

        log('Réponse reçue avec succès', 'success', { data: data }, 'request');
        
        return data;
    } catch (error) {
        
        return log('Erreur lors de la requête', 'error', { error: error }, 'request');
    }
}