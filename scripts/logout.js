async function logoutClear() {
    console.groupCollapsed("%c🔴 SUPPRESSION DES DONNÉES DE DÉCONNEXION", "color: #FF4500; font-weight: bold;");

    try {
        const sessionDeletion = await request(
            "https://api.themoviedb.org/3/authentication/session", 
            "DELETE", 
            {}, 
            { session_id: SESSION_ID }
        );

        if (!sessionDeletion.success) throw new Error("Erreur lors de la suppression de la session.");

        logMessage('success', "✅ Session supprimée avec succès.");

        const tokenDeletion = await logoutRequest();

        if (!tokenDeletion.success) throw new Error("Erreur lors de la suppression du token.");

        logMessage('success', "✅ Token d'accès supprimé avec succès.");

        // Suppression des cookies
        ["ACCOUNT_ID", "ACCESS_TOKEN", "SESSION_ID"].forEach(cookieName => {
            clearCookie(cookieName);
            logMessage('deletion', `🗑️ Cookie supprimé : ${cookieName}`);
        });
    } catch (error) {
        logMessage('error', `🚨 ${error.message}`);
    } finally {
        console.groupEnd();
    }
}

async function logout(event) {
    event?.preventDefault();

    if (event?.target) {
        event.target.removeEventListener("click", logout);
    }

    console.groupCollapsed("%c🔴 TENTATIVE DE DÉCONNEXION", "color: #FF4500; font-weight: bold;");

    try {
        await logoutClear();
        logMessage('success', "🔴 Déconnexion réussie !");
    } catch (error) {
        logMessage('error', `🚨 ${error.message}`);
        if (event?.target) {
            event.target.addEventListener("click", logout);
        }
    } finally {
        // Suppression des éléments de l'interface utilisateur
        const userInterface = document.querySelectorAll("#userInterface > *");
        userInterface.forEach(el => el.remove());

        setuplogin();
        console.groupEnd();
    }
}

// Appel de la fonction pour afficher la documentation
afficherDocumentation(
    "logout.js",
    [
        { emoji: "🔴", description: "Suppression des données de déconnexion", couleur: "color: #FF4500; font-weight: bold;" },
        { emoji: "✅", description: "Session supprimée avec succès", couleur: "color: #32CD32; font-weight: bold;" },
        { emoji: "🗑️", description: "Cookie supprimé", couleur: "color: #FF4500; font-weight: bold;" },
        { emoji: "🚨", description: "Erreur lors de la suppression", couleur: "color: #FF4500; font-weight: bold;" }
    ],
    [
        {
            nom: "logoutClear()",
            couleur: "color: #FF4500; font-weight: bold;",
            descriptions: [
                "Supprime la session utilisateur du serveur.",
                "Supprime les cookies liés à la session et au token d'accès.",
                "Gère les erreurs lors de la suppression des données."
            ]
        },
        {
            nom: "logout(event)",
            couleur: "color: #FF4500; font-weight: bold;",
            descriptions: [
                "Gère le processus de déconnexion de l'utilisateur.",
                "Empêche le rechargement de la page lors de la déconnexion.",
                "Appelle logoutClear pour supprimer les données.",
                "Affiche les messages de succès ou d'erreur selon le résultat."
            ]
        }
    ]
);