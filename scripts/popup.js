function ouvrirPopupLogin(requestToken) {
    logMessage('group', "🪟 Ouverture de la popup de connexion..."); // Démarre le groupe de logs
    return new Promise((resolve) => {
        if (!requestToken) {
            logMessage('error', "❌ Erreur : request_token manquant !");
            logMessage('group', null); // Ferme le groupe de logs
            return resolve(false);
        }

        const POPUP_WIDTH = 640;
        const POPUP_HEIGHT = 360;
        const left = (window.screen.width - POPUP_WIDTH) / 2;
        const top = (window.screen.height - POPUP_HEIGHT) / 2;
        logMessage('log', `🪟 Ouverture de la popup à (${left}, ${top}) avec dimensions ${POPUP_WIDTH}x${POPUP_HEIGHT}`);

        const popup = window.open(
            `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(requestToken)}`,
            "popupLogin",
            `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
        );

        if (!popup) {
            logMessage('error', "❌ Impossible d'ouvrir la popup (bloquée par le navigateur ?)");
            logMessage('group', null);
            return resolve(false);
        }
        logMessage('success', "✅ Popup ouverte avec succès !");

        const messageListener = (event) => {
            if (event.origin !== window.location.origin) {
                logMessage('error', "❌ Origine non autorisée !");
                logMessage('group', null);
                return resolve(false);
            }

            if (event.data === "authenticated") {
                logMessage('success', "✅ Utilisateur authentifié !");
                window.removeEventListener("message", messageListener);
                logMessage('group', null);
                return resolve(true);
            } else {
                logMessage('log', `📩 Message reçu de la popup : ${event.data}`);
            }
        };

        window.addEventListener("message", messageListener);
        logMessage('info', "👂 Écouteur de message ajouté pour la popup.");

        // Optionnel : fermer la popup après un certain temps si l'utilisateur ne s'authentifie pas
        setTimeout(() => {
            if (popup && !popup.closed) {
                logMessage('warn', "⚠️ La popup se ferme après 30 secondes d'inactivité.");
                popup.close();
            }
        }, 30000); // 30 secondes

        logMessage('group', null); // Ferme le groupe de logs
    });
}

// Appel de la fonction pour afficher la documentation
afficherDocumentation(
    "popup.js",
    [
        { emoji: "🪟", description: "Ouverture de la popup de connexion", couleur: "color: #1E90FF; font-weight: bold;" },
        { emoji: "❌", description: "Erreur lors de l'ouverture", couleur: "color: #FF4500; font-weight: bold;" },
        { emoji: "✅", description: "Popup ouverte avec succès", couleur: "color: #32CD32; font-weight: bold;" },
        { emoji: "📩", description: "Message reçu de la popup", couleur: "color: lightblue; font-weight: bold;" },
        { emoji: "👂", description: "Écouteur de message ajouté", couleur: "color: #FFD700; font-weight: bold;" }
    ],
    [
        {
            nom: "ouvrirPopupLogin(requestToken)",
            couleur: "color: #1E90FF; font-weight: bold;",
            descriptions: [
                "Ouvre une popup de connexion pour l'utilisateur.",
                "Vérifie la présence du requestToken et gère les erreurs si absent.",
                "Définit la position et la taille de la popup.",
                "Ajoute un écouteur de message pour recevoir des notifications d'authentification.",
                "Résout la promesse avec succès si l'utilisateur est authentifié."
            ]
        }
    ]
);