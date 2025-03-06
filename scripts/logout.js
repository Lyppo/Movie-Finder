async function logoutClear() {
    try {
        const sessionDeletion = await request(
            'DELETE',
            "https://api.themoviedb.org/3/authentication/session", 
            { session_id: SESSION_ID }
        );

        if (!sessionDeletion.success) {
            console.groupEnd();
            return;
        }

        // Suppression du token
        const tokenDeletion = await logoutRequest();

        if (!tokenDeletion.success) {
            return;
        }

        ACCESS_TOKEN = "";

        ACCOUNT_ID = "";

        SESSION_ID = "";

        // Suppression des cookies
        ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"].forEach(cookieName => {
            clearCookie(cookieName);
        });

    } catch (error) {
    }
}