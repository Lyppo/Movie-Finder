async function createZenith() {
    log("Création de l'overlay...", 'create', null, 'Setup');

    const zenith = document.createElement("div");

    createTest(zenith);

    createUserInterface(zenith);

    zenith.id = "zenith";

    log("Overlay créée avec succès!", 'success', null, 'Setup');

    document.body.prepend(zenith);
}

async function createApp() {
    log("Création de l'interface de l'application...", 'create', null, 'Setup');

    const app = document.createElement("div");
    app.id = "app";

    log("Interface de l'application créée avec succès!", 'success', null, 'Setup');

    document.body.append(app);
}

async function createUserInterface(zenith) {
    log("Création de l'interface utilisateur...", 'create', null, 'Setup');

    const userInterface = document.createElement("div");

    if (await loged()) {

        createEnveloppeIMG(userInterface, createProfileIMG(), true);

        createLogedList(userInterface);
    
    } else {

        createLogin(userInterface)
    }

    userInterface.id = "userInterface";
    userInterface.classList.add("list");

    log("Interface utilisateur créée avec succès!", 'success', null, 'Setup');

    zenith.append(userInterface);
}

async function createLogin(userInterface) {
    log("Création du bouton de connexion...", 'create', null, 'Setup');

    const btn = document.createElement("button");
    btn.id = "btnLogin";
    btn.textContent = "Se connecter";
    btn.addEventListener("click", login);

    log("Bouton de connexion créé avec succès!", 'success', null, 'Setup');

    userInterface.append(btn);
}

async function createLogedList(userInterface) {
    log("Création de la liste des options de l'utilisateur connecté...", 'create', null, 'Setup');

    const div = document.createElement("div");
    
    createLogout(div);

    div.id = "list";
    div.classList.add("list");
    div.style.display = "none";

    log("Liste des options de l'utilisateur connecté créée avec succès!", 'success', null, 'Setup');

    userInterface.append(div);
}

async function createLogout(list) {
    log("Création du bouton de déconnexion...", 'create', null, 'Setup');

    const btn = document.createElement("button");
    btn.id = "btnLogout";
    btn.textContent = "Se déconnecter";
    btn.addEventListener("click", logout);

    log("Bouton de déconnexion créé avec succès!", 'success', null, 'Setup');

    list.append(btn);
}

async function createProfileIMG() {
    log("Création de l'image de profil...", 'create', null, 'Setup');

    let pdp = document.createElement("img");

    loadPDP(pdp);
    
    pdp.id = "pdp";
    pdp.style.width = "65px";
    pdp.style.height = "65px";
    pdp.style.objectFit = "cover";
    pdp.style.borderRadius = "50%";
    pdp.src = "../Images/Default-Profile.png";
    pdp.addEventListener("mouseenter", showUserMenu);

    log("Image de profil créée avec succès!", 'success', null, 'Setup');

    return pdp;
}

async function createEnveloppeIMG(userInterface, img, first = false) {

    log("Création de l'enveloppe de l'image de profil...", 'create', null, 'Setup');

    let div = document.createElement("div");

    div.append(await img);

    div.id = "englob-pdp";
    div.style.overflow = "hidden";

    log("Enveloppe de l'image de profil créée avec succès!", 'success', null, 'Setup');

    if (first) userInterface.prepend(div);

    else userInterface.append(div);
}

async function createTest(zenith) {
    log("Création du bouton de test...", 'create', null, 'Setup');

    const btn = document.createElement("button");
    btn.id = "test";
    btn.textContent = "Test";
    btn.style.top = "10px";
    btn.style.left = "10px";
    btn.addEventListener("click", test);

    log("Bouton de test créé avec succès!", 'success', null, 'Setup');

    zenith.prepend(btn);
}

async function setup() {
    log("Démarrage du setup de l'application...", 'create', null, 'Setup');

    createZenith()
    
    createApp()
}