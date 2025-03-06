async function loged(tmp = null) {

    await load();

    if (!ACCESS_TOKEN) {
        return false;
    } else {
        try {
            const data = await request('GET', "https://api.themoviedb.org/3/authentication");
            return data.success;
        } catch (error) {
            return false;
        }
    }
}