async function createRequestToken() {
    const url = 'https://tmdb-proxy.antodu72210.workers.dev/';
  
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (!response.ok) {
      return -1;
    }

    return await response.text();;  // Retourne la réponse du Worker
}

async function login(event) {
    
    tmpToken = await createRequestToken();
    
    ouvrirPopupCentre(tmpToken);

    console.log(tmpToken);
}

function ouvrirPopupCentre(TON_REQUEST_TOKEN) {
    let width = 640;
    let height = 360;
    let left = (screen.width - width) / 2;
    let top = (screen.height - height) / 2;

    const popup = window.open("https://www.themoviedb.org/auth/access?request_token=" + TON_REQUEST_TOKEN, "popupLogin", `width=${width},height=${height},top=${top},left=${left}`);

    // Vérifier les messages venant de la popup
    window.addEventListener("message", (event) => {
        // S'assurer que le message provient de la bonne origine
        if (event.origin === "https://www.themoviedb.org") {
            if (event.data === "approved") {
                alert("L'authentification est réussie, la popup va se fermer.");
                popup.close();  // Fermer la popup
            }
        }
    });
}

document.getElementById("btnLogin").addEventListener("click", login);