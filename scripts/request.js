async function request(type, url, params = {}, content = {}) {

    let searchParams = new URLSearchParams(params);
    url += searchParams.toString() ? `?${searchParams.toString()}` : "";

    if (content.access_token) {
        content.access_token = ACCESS_TOKEN;
    }

    try {
        let response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
            body: Object.keys(content).length > 0 ? JSON.stringify(content) : undefined
        });

        const data = await response.json();

        return data;
    } catch (error) {
        
        return;
    }
}