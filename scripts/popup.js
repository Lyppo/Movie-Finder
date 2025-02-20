// popup.js
export function ouvrirPopupLogin(requestToken) {
    return new Promise((resolve) => {
        if (!requestToken) {
            console.error("Erreur : request_token manquant !");
            resolve(false);
        }

        const width = 640;
        const height = 360;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        const popup = window.open(
            `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(requestToken)}`,
            "popupLogin",
            `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
        );

        if (!popup) {
            console.error("Impossible d'ouvrir la popup (bloquée par le navigateur ?)");
            resolve(false);
        }

        function messageListener(event) {
            if (event.origin !== window.location.origin) {
                console.error("Origine non autorisée !");
                resolve(false);
            }

            if (event.data === "authenticated") {
                window.removeEventListener("message", messageListener);
                resolve(true);
            }
        }

        window.addEventListener("message", messageListener);
    });
}