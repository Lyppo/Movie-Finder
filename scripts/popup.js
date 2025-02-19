// popup.js
export function ouvrirPopupLogin(resuqetToken) {
    return new Promise((resolve) => {
        if (!resuqetToken) {
            console.error("Erreur : request_token manquant !");
            resolve(false);
            return;
        }

        const width = 640;
        const height = 360;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        const popup = window.open(
            `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(resuqetToken)}`,
            "popupLogin",
            `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
        );

        if (!popup) {
            console.error("Impossible d'ouvrir la popup (bloquée par le navigateur ?)");
            resolve(false);
            return;
        }

        function messageListener(event) {
            if (event.origin !== window.location.origin) {
                console.error("Origine non autorisée !");
                resolve(false);
                return;
            }

            if (event.data === "authenticated") {
                console.log("Utilisateur authentifié.");
                window.removeEventListener("message", messageListener);
                resolve(true);
            }
        }

        window.addEventListener("message", messageListener);
    });
}