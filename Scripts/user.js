async function loged() {

    await load();

    if (!ACCESS_TOKEN) {
        log('Non connecté : ACCESS_TOKEN introuvable', 'failure', null, 'User');
        return false;
    } else {
        try {
            const data = await request('GET', "https://api.themoviedb.org/3/authentication");

            const success = data.success;

            if (success) {
                log('Utilisateur authentifié avec succès', 'success', data, 'User');
            } else {
                log('Utilisateur non authentifié, ACCESS_TOKEN invalide', 'failure', data, 'User');
            }

            return success;
        } catch (error) {
            log('Erreur lors de la vérification de la connexion', 'error', error, 'User');
            return false;
        }
    }
}