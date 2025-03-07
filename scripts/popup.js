let popupEnded = false;

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

async function message(event) {
    log('Message reçu du popup', 'log', { eventData: event.data }, 'Popup');

    if (event.data === "authenticated") popupEnded = true;
}

async function popupCheck(popup, resolve) {
    log('Vérification de l\'état du popup', 'log', { popupClosed: popup.closed, popupEnded }, 'Popup');

    if (popupEnded) {
        window.removeEventListener("message", message);
        popup.close();
        log('Popup fermé après authentification réussie', 'success', null, 'Popup');
        resolve(true);
    }
    else if (popup.closed) {
        log('Popup fermé prématurément', 'error', null, 'Popup');
        resolve(false);
    }

    requestAnimationFrame(() => popupCheck(popup, resolve));
}

async function openPopup(requestToken) {
    log('Ouverture du popup pour l\'authentification', 'request', { requestToken }, 'Popup');

    const popup = createPopup(requestToken);

    window.addEventListener("message", message);

    return new Promise((resolve) => {
        popupCheck(popup, resolve);

        setTimeout(() => {
            if (!popup.closed) {
                popup.close();
                log('Popup fermé après délai de 30 secondes', 'error', null, 'Popup');
            }
        }, 30000);
    });
}