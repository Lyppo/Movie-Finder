function ouvrirPopupLogin(requestToken) {
    logMessage('connecting', "Ouverture de la popup de connexion...", "POPUP", null, true); // Démarre le groupe de logs
    return new Promise((resolve) => {
        if (!requestToken) {
            logMessage('error', "Erreur : request_token manquant !", "POPUP");
            logMessage('end');
            return resolve(false);
        }

        const POPUP_WIDTH = 640;
        const POPUP_HEIGHT = 360;
        const left = (window.screen.width - POPUP_WIDTH) / 2;
        const top = (window.screen.height - POPUP_HEIGHT) / 2;
        logMessage('log', `Ouverture de la popup à (${left}, ${top}) avec dimensions ${POPUP_WIDTH}x${POPUP_HEIGHT}`, "POPUP");

        const popup = window.open(
            `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(requestToken)}`,
            "popupLogin",
            `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
        );

        if (!popup) {
            logMessage('error', "Impossible d'ouvrir la popup (bloquée par le navigateur ?)", "POPUP");
            logMessage('end');
            return resolve(false);
        }
        logMessage('success', "Popup ouverte avec succès !", "POPUP");

        const messageListener = (event) => {
            if (event.origin !== window.location.origin) {
                logMessage('error', "Origine non autorisée !", "POPUP");
                logMessage('end');
                return resolve(false);
            }

            if (event.data === "authenticated") {
                logMessage('success', "Utilisateur authentifié !", "POPUP");
                window.removeEventListener("message", messageListener);
                logMessage('end');
                return resolve(true);
            } else {
                logMessage('log', `Message reçu de la popup : ${event.data}`, "POPUP");
            }
        };

        window.addEventListener("message", messageListener);
        logMessage('info', "Écouteur de message ajouté pour la popup.", "POPUP");

        // Optionnel : fermer la popup après un certain temps si l'utilisateur ne s'authentifie pas
        setTimeout(() => {
            if (popup && !popup.closed) {
                logMessage('warn', "La popup se ferme après 30 secondes d'inactivité.", "POPUP");
                popup.close();
            }
        }, 30000); // 30 secondes

        logMessage('end'); // Ferme le groupe de logs
    });
}

afficherDocumentation("popup", [
    {
        nom: "ouvrirPopupLogin",
        params: [
            { forced: "requestToken" } // Token de requête obligatoire
        ],
        style: "loading",
        descriptions: [
            "Ouvre une popup de connexion à TMDb avec le `request_token` fourni.",
            "Vérifie si le `request_token` est présent, sinon une erreur est affichée.",
            "Calcule la position de la popup pour la centrer sur l'écran.",
            "Ajoute un écouteur d'événements pour détecter la validation de connexion.",
            "Ferme la popup après 30 secondes si l'utilisateur ne s'authentifie pas.",
            "Renvoie `true` si l'authentification réussit, sinon `false`."
        ]
    }
]);