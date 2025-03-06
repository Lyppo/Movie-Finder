let popupEnded = false;

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

async function message(event) {

    if (event.data === "authenticated") popupEnded = true;
}

async function popupCheck(popup, resolve) {

    if (popupEnded) {
        
        window.removeEventListener("message", message);
        popup.close();
        resolve(true);
    }
    else if (popup.closed) resolve(false);

    requestAnimationFrame(() => popupCheck(popup, resolve));
}

async function openPopup(requestToken) {

    const popup = createPopup(requestToken);

    window.addEventListener("message", message);

    return new Promise((resolve) => {

        popupCheck(popup, resolve);

        setTimeout(() => {
            if (!popup.closed) {
                popup.close();
            }
        }, 30000);
    });
}