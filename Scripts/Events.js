async function showUserMenu(event) {
    log('Affichage du menu utilisateur', 'request', null, 'UI');

    event.target.removeEventListener("mouseenter", showUserMenu);
    event.target.parentElement.parentElement.addEventListener("mouseleave", DiscareUserMenu);
    document.getElementById("list").style.display = "grid";

    log('Menu utilisateur affiché', 'success', null, 'UI');
}

async function DiscareUserMenu(event) {
    log('Masquage du menu utilisateur', 'request', null, 'UI');

    event.target.removeEventListener("mouseleave", DiscareUserMenu);
    document.getElementById("pdp").addEventListener("mouseenter", showUserMenu);
    document.getElementById("list").style.display = "none";

    log('Menu utilisateur masqué', 'success', null, 'UI');
}

async function login(event) {
    log('Tentative de connexion', 'request', null, 'Authentification');

    event.target.removeEventListener("click", login);

    const userInterface = event.target.parentElement;
    const zenith = event.target.parentElement.parentElement;

    const requestToken = await createRequestToken();
    log('Token de requête créé', 'success', { requestToken }, 'Authentification');

    const authenticated= await openPopup(requestToken);
    
    log('État de l\'authentification', 'log', { authenticated }, 'Authentification');

    if (!authenticated) {
        event.target.addEventListener("click", login);
        log('Authentification échouée', 'failure', null, 'Authentification');
        return;
    }

    await createAccessToken(requestToken);
    await createSession();

    userInterface.remove();
    createUserInterface(zenith);

    log('Connexion réussie, interface utilisateur mise à jour', 'success', null, 'Authentification');
}

async function logout(event) {
    log('Tentative de déconnexion', 'request', null, 'Authentification');

    event.target.removeEventListener("click", logout);

    const userInterface = event.target.parentElement.parentElement;
    const zenith = event.target.parentElement.parentElement.parentElement;

    userInterface.removeEventListener("mouseleave", DiscareUserMenu);

    await logoutClear();

    userInterface.remove();
    createUserInterface(zenith);

    log('Déconnexion réussie, interface utilisateur mise à jour', 'success', null, 'Authentification');
}

async function test(event) {
    const name = event.target.id;

    log(name, 'test', null, name);
}