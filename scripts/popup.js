// Vérifie si la fenêtre parent existe avant d'envoyer le message
if (window.opener) {
    try {
        window.opener.postMessage("authenticated", window.location.origin);
    } catch (error) {
        console.error("Erreur lors de l'envoi du message à la fenêtre parente :", error);
    }
}

window.close();