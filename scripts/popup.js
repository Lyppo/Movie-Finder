// popup.js

function ouvrirPopupLogin(requestToken) {
    return new Promise((resolve) => {
        // Vérification de la présence du requestToken
        if (!requestToken) {
            console.error("❌ Erreur : request_token manquant !");
            return resolve(false); // Sortir de la fonction si le token est manquant
        }

        // Définition des dimensions et position de la popup
        const POPUP_WIDTH = 640;
        const POPUP_HEIGHT = 360;
        const left = (window.screen.width - POPUP_WIDTH) / 2;
        const top = (window.screen.height - POPUP_HEIGHT) / 2;
        console.log(`🪟 Ouverture de la popup à (${left}, ${top}) avec dimensions ${POPUP_WIDTH}x${POPUP_HEIGHT}`);

        // Ouverture de la popup de connexion avec des options de fenêtre
        const popup = window.open(
            `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(requestToken)}`,
            "popupLogin",
            `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
        );

        // Vérification si la popup a été ouverte avec succès
        if (!popup) {
            console.error("❌ Impossible d'ouvrir la popup (bloquée par le navigateur ?)");
            return resolve(false); // Sortir de la fonction si la popup ne s'ouvre pas
        }
        console.log("✅ Popup ouverte avec succès !");

        // Écouteur de messages provenant de la popup
        const messageListener = (event) => {
            // Vérification de l'origine du message
            if (event.origin !== window.location.origin) {
                console.error("❌ Origine non autorisée !");
                return resolve(false); // Sortir de la fonction si l'origine n'est pas autorisée
            }

            // Vérification si l'utilisateur est authentifié
            if (event.data === "authenticated") {
                console.log("✅ Utilisateur authentifié !");
                window.removeEventListener("message", messageListener); // Retrait de l'écouteur
                return resolve(true); // Résoudre la promesse avec succès
            } else {
                console.log(`📩 Message reçu de la popup : ${event.data}`);
            }
        };

        // Ajout de l'écouteur de message
        window.addEventListener("message", messageListener);
        console.log("👂 Écouteur de message ajouté pour la popup.");
    });
}