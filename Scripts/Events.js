async function showUserMenu(event) {
    event.target.removeEventListener("mouseenter", showUserMenu);
    event.target.parentElement.parentElement.addEventListener("mouseleave", DiscareUserMenu);
    document.getElementById("list").style.display = "grid";

    log('Menu utilisateur affiché', 'success', null, 'UI');
}

async function DiscareUserMenu(event) {

    event.target.removeEventListener("mouseleave", DiscareUserMenu);
    document.getElementById("pdp").addEventListener("mouseenter", showUserMenu);
    document.getElementById("list").style.display = "none";

    log('Menu utilisateur masqué', 'success', null, 'UI');
}

async function login(event) {
    event.target.removeEventListener("click", login);

    const userInterface = event.target.parentElement;
    const zenith = event.target.parentElement.parentElement;

    const requestToken = await createRequestToken();

    const authenticated= await openPopup(requestToken);

    if (!authenticated) {
        event.target.addEventListener("click", login);
        return log('Authentification échouée', 'failure', null, 'Login');
    }

    await createAccessToken(requestToken);
    await createSession();

    userInterface.remove();
    createUserInterface(zenith);

    log('Connexion réussie, interface utilisateur mise à jour', 'success', null, 'Login');
}

async function logout(event) {
    event.target.removeEventListener("click", logout);

    const userInterface = event.target.parentElement.parentElement;
    const zenith = event.target.parentElement.parentElement.parentElement;

    userInterface.removeEventListener("mouseleave", DiscareUserMenu);

    await logoutClear();

    userInterface.remove();
    createUserInterface(zenith);

    log('Déconnexion réussie, interface utilisateur mise à jour', 'success', null, 'Logout');
}

async function test(event) {
    const name = event.target.id;

    log(name, 'test', null, name);
}