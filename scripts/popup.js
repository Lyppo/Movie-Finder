// popup.js

export function ouvrirPopupLogin(requestToken) {
    return new Promise((resolve) => {
        // Vérification de la présence du requestToken
        if (!requestToken) {
            console.error("Erreur : request_token manquant !");
            resolve(false);
            return; // Sortir de la fonction si le token est manquant
        }

        // Définition des dimensions et position de la popup
        const width = 640;
        const height = 360;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        // Ouverture de la popup de connexion
        const popup = window.open(
            `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(requestToken)}`,
            "popupLogin",
            `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
        );

        // Vérification si la popup a été ouverte avec succès
        if (!popup) {
            console.error("Impossible d'ouvrir la popup (bloquée par le navigateur ?)");
            resolve(false);
            return; // Sortir de la fonction si la popup ne s'ouvre pas
        }

        // Écouteur de messages provenant de la popup
        function messageListener(event) {
            // Vérification de l'origine du message
            if (event.origin !== window.location.origin) {
                console.error("Origine non autorisée !");
                resolve(false);
                return; // Sortir de la fonction si l'origine n'est pas autorisée
            }

            // Vérification si l'utilisateur est authentifié
            if (event.data === "authenticated") {
                window.removeEventListener("message", messageListener); // Retrait de l'écouteur
                resolve(true); // Résoudre la promesse avec succès
            }
        }

        // Ajout de l'écouteur de message
        window.addEventListener("message", messageListener);
    });
}