async function showUserMenu(event) {
    event.target.removeEventListener("mouseenter", showUserMenu);
    event.target.parentElement.parentElement.addEventListener("mouseleave", DiscareUserMenu);
    document.getElementById("list").style.display = "grid";
}

async function DiscareUserMenu(event) {

    event.target.removeEventListener("mouseleave", DiscareUserMenu);
    document.getElementById("pdp").addEventListener("mouseenter", showUserMenu);
    document.getElementById("list").style.display = "none";
}

async function login(event) {
    event.target.removeEventListener("click", login);

    const userInterface = event.target.parentElement;
    const zenith = event.target.parentElement.parentElement;

    const requestToken = await createRequestToken();

    if (!await openPopup(requestToken)) {
        event.target.addEventListener("click", login);
        return log('Authentification échouée', 'failure', null, 'Login');
    }

    await createAccessToken(requestToken);

    userInterface.remove();
    createUserInterface(zenith);

    await createSession();

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

    console.clear();

    const name = event.target.id;

    await testRequest();

    log(name, 'test', null, name);
}