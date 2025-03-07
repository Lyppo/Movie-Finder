async function loged() {
    log('Vérification de la connexion en cours...', 'request', null, 'User');

    await load();

    if (!ACCESS_TOKEN) {
        log('Non connecté : ACCESS_TOKEN introuvable', 'failure', null, 'User');
        return false;
    } else {
        try {
            log("Envoi de la requête d'authentification...",'request', null, 'User');

            const data = await request('GET', "https://api.themoviedb.org/3/authentication");

            const success = data.success;

            if (success) {
                log('Utilisateur connecté avec succès', 'success', data, 'User');
            } else {
                log('Utilisateur non connecté, ACCESS_TOKEN invalide', 'failure', data, 'User');
            }

            return success;
        } catch (error) {
            log('Erreur lors de la vérification de la connexion', 'error', error, 'User');
            return false;
        }
    }
}