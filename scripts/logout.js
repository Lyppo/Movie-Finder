async function logoutClear() {
    logMessage('deletion', "SUPPRESSION DES DONNÉES DE DÉCONNEXION", "LOGOUT CLEAR", null, true);

    try {
        const sessionDeletion = await request(
            "https://api.themoviedb.org/3/authentication/session", 
            "DELETE", 
            {}, 
            { session_id: SESSION_ID }
        );

        if (!sessionDeletion.success) {
            console.groupEnd();
            throw new Error("Erreur lors de la suppression de la session.");
        }

        logMessage('success', "Session supprimée avec succès.", "LOGOUT CLEAR");

        const tokenDeletion = await logoutRequest();

        if (!tokenDeletion.success) {
            console.groupEnd();
            throw new Error("Erreur lors de la suppression du token.");
        }

        logMessage('success', "Token d'accès supprimé avec succès.", "LOGOUT CLEAR");

        // Suppression des cookies
        ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"].forEach(cookieName => {
            clearCookie(cookieName);
            logMessage('deletion', `Cookie supprimé : ${cookieName}`, "LOGOUT CLEAR");
        });
    } catch (error) {
        logMessage('error', `${error.message}`, "LOGOUT CLEAR");
    } finally {
        logMessage('end');
    }
}

async function logout(event) {
    event?.preventDefault();

    if (event?.target) {
        event.target.removeEventListener("click", logout);
    }

    document.getElementById("userInterface").removeEventListener("mouseleave", DiscareOverlay);

    logMessage('deletion', "TENTATIVE DE DÉCONNEXION", "LOGOUT", null, true);

    try {
        await logoutClear();
        logMessage('success', "Déconnexion réussie !", "LOGOUT");
    } catch (error) {
        logMessage('error', `${error.message}`, "LOGOUT");
        if (event?.target) {
            event.target.addEventListener("click", logout);
        }
    } finally {
        // Suppression des éléments de l'interface utilisateur
        const sonOfUserInterface = document.querySelectorAll("#userInterface > *");
        sonOfUserInterface.forEach(el => el.remove());

        setuplogin(document.getElementById("userInterface"));
        logMessage('end');
    }
}