async function attendreFonction(nomFonction) {
    while (typeof window[nomFonction] !== "function") {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
}

async function init() {

    await logMessage('creation', "Initialisation...", "main");

    await attendreFonction("setupUI");
    setupUI();

    await logMessage('success', "Initialisation terminée.", "main");
}

init();