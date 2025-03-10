function createPopup(requestToken) {

    const POPUP_WIDTH = 640;
    const POPUP_HEIGHT = 360;
    const left = (window.screen.width - POPUP_WIDTH) / 2;
    const top = (window.screen.height - POPUP_HEIGHT) / 2;

    return window.open(
        `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(requestToken)}`,
        "popupLogin",
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${top},left=${left},resizable=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
    );
}

async function openPopup(requestToken) {

    const popup = createPopup(requestToken);

    log('Popup ouvert avec succès', 'success', null, 'Popup')

    return new Promise((resolve) => {
        if (!popup) {
            log("Échec de l'ouverture du popup", "error", {}, "Popup");
            return resolve(false);
        }

        const messageListener = (event) => {
            log('Message reçu du popup', 'log', { eventData: event.data }, 'Popup');

            if (event.data === "authenticated") {
                window.removeEventListener("message", messageListener);
                return resolve(true);
            }
            else {
                log("message inconnu reçu du popup", "error", { eventData: event.data }, "Popup");
                popup.close();
                return resolve(false);
            }
        };

        window.addEventListener("message", messageListener);

         function checkPopupClosed() {
            if (!popup || popup.closed) {
                log("Le popup semble fermé, attente de confirmation...", "log", null, "Popup");

                setTimeout(() => {
                    log("Le popup est bien fermé, résolution de la promesse", "log",null, "Popup");
                    window.removeEventListener("message", messageListener);
                    return resolve(false);
                }, 1500);
            } else {
                return requestAnimationFrame(checkPopupClosed);
            }
        }

        return requestAnimationFrame(checkPopupClosed);
    });
}