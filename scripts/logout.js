async function logoutClear() {
    try {
        log('Tentative de suppression de la session', 'request', { session_id: SESSION_ID }, 'Authentification');

        const sessionDeletion = await request(
            'DELETE',
            "https://api.themoviedb.org/3/authentication/session", 
            { session_id: SESSION_ID }
        );

        if (!sessionDeletion.success) {
            log('Échec de la suppression de la session', 'error', { sessionDeletion }, 'Authentification');
            return;
        }

        log('Session supprimée avec succès', 'success', { sessionDeletion }, 'Authentification');

        // Suppression du token
        log('Tentative de suppression du token d\'accès', 'request', null, 'Authentification');
        
        const tokenDeletion = await logoutRequest();

        if (!tokenDeletion.success) {
            log('Échec de la suppression du token', 'error', { tokenDeletion }, 'Authentification');
            return;
        }

        log('Token d\'accès supprimé avec succès', 'success', { tokenDeletion }, 'Authentification');

        ACCESS_TOKEN = "";
        ACCOUNT_ID = "";
        SESSION_ID = "";

        // Suppression des cookies
        log('Suppression des cookies', 'request', { cookies: ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"] }, 'Authentification');

        ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"].forEach(cookieName => {
            clearCookie(cookieName);
        });

        log('Cookies supprimés avec succès', 'success', null, 'Authentification');
    } catch (error) {
        log('Erreur lors de la suppression des données de session', 'error', { error }, 'Authentification');
    }
}