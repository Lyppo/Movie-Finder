async function logoutClear() {
    console.groupCollapsed("🔴 Suppression des données de déconnexion..."); // Début du groupe de logs

    try {
        const sessionDeletion = await request(
            "https://api.themoviedb.org/3/authentication/session", 
            "DELETE", 
            {}, 
            { session_id: SESSION_ID } // Utilisation de SESSION_ID
        );

        if (!sessionDeletion.success) throw new Error("Erreur lors de la suppression de la session.");

        console.log("✅ Session supprimée avec succès.");

        const tokenDeletion = await logoutRequest(); // Attendre la réponse

        if (!tokenDeletion.success) throw new Error("Erreur lors de la suppression du token.");

        console.log("✅ Token d'accès supprimé avec succès.");

        // Suppression des cookies
        clearCookie("ACCOUNT_ID");
        console.log("🗑️ Cookie supprimé : ACCOUNT_ID");
        clearCookie("ACCESS_TOKEN");
        console.log("🗑️ Cookie supprimé : ACCESS_TOKEN");
        clearCookie("SESSION_ID");
        console.log("🗑️ Cookie supprimé : SESSION_ID");
    } catch (error) {
        console.error(`🚨 ${error.message}`); // Message d'erreur en cas d'échec
    } finally {
        console.groupEnd(); // Fin du groupe de logs
    }
}

async function logout(event) {
    event?.preventDefault();

    if (event?.target) {
        event.target.removeEventListener("click", logout);
    }

    console.groupCollapsed("🔴 Tentative de déconnexion..."); // Début du groupe de logs

    try {
        await logoutClear(); // Attendre la suppression des données
        // removeElement("#btnLogout");
        // updateUIAfterLogout();
        console.log("🔴 Déconnexion réussie !"); // Message de débogage
    } catch (error) {
        console.error(`🚨 ${error.message}`); // Message d'erreur
        event.target.addEventListener("click", login);
    } finally {
        event.target.remove();
        setuplogin();
        console.groupEnd(); // Fin du groupe de logs=
    }
}