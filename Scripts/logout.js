async function logoutClear() {
    try {
        const sessionDeletion = await request(
            'DELETE',
            "https://api.themoviedb.org/3/authentication/session", 
            { session_id: SESSION_ID }
        );

        if (!sessionDeletion.success) return log('Échec de la suppression de la session', 'error', { sessionDeletion }, 'Logout Clear');

        log('Session supprimée avec succès', 'success', { sessionDeletion: sessionDeletion}, 'Logout Clear');
        
        const tokenDeletion = await logoutRequest();

        if (!tokenDeletion.success) return log('Échec de la suppression du token', 'error', { tokenDeletion }, 'Logout Clear');

        log('Token d\'accès supprimé avec succès', 'success', { tokenDeletion: tokenDeletion }, 'Logout Clear');

        ACCESS_TOKEN = "";
        ACCOUNT_ID = "";
        SESSION_ID = "";

        // Suppression des cookies
        log('Suppression des cookies', 'request', { cookies: ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"] }, 'Logout Clear');

        ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"].forEach(cookieName => {
            clearCookie(cookieName);
        });

        log('Cookies supprimés avec succès', 'success', null, 'Logout Clear');
    } catch (error) {
        log('Erreur lors de la suppression des données de session', 'error', { error: error }, 'Logout Clear');
    }
}