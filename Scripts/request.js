async function accountDetails(account_id = ACCOUNT_ID) {
    if (!accountInfo[account_id] || Object.keys(accountInfo[account_id]).length === 0) {
        accountInfo[account_id] = await request('GET', `https://api.themoviedb.org/3/account/${account_id}`, { session_id: SESSION_ID });
    }
}

async function testRequest() {
    const data = await request('GET', "https://api.themoviedb.org/3/discover/movie", { language: "fr-FR", page: '1', sort_by: 'popularity.desc' });
    const first = data.results[0];

    let img = document.createElement("img");

    img.style.width = "300px";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.boxShadow = "5px 5px 10px black";
    img.style.borderRadius = "10px";

    document.getElementById("zenith").appendChild(img);

    loadImage(img, first.poster_path);
}

async function request(type, url, params = {}, content = {}) {
    
    url += `?${(new URLSearchParams(params)).toString()}`;

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