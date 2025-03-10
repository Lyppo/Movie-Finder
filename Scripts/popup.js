function createPopup(requestToken) {
    log('Création du popup pour l\'authentification', 'request', { requestToken }, 'Popup');

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
    log('Ouverture du popup pour l\'authentification', 'request', { requestToken }, 'Popup');

    const popup = createPopup(requestToken);

    return new Promise((resolve) => {

        const messageListener = (event) => {
            log('Message reçu du popup', 'log', { eventData: event.data }, 'Popup');

            if (event.data === "authenticated") {
                window.removeEventListener("message", messageListener);
                return resolve(true);
            }
        };

        window.addEventListener("message", messageListener);

        setTimeout(() => {
            popup.close();
            log('Popup fermé après délai de 30 secondes', 'error', null, 'Popup');
        }, 30000);
    });
}