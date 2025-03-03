async function zenithInterface(zenith) {
    logMessage('creation', "Création du profil utilisateur...", 'zenith', null, true);

    setupTest(zenith);

    let userInterface = document.createElement("div");
    userInterface.id = "userInterface";
    zenith.appendChild(userInterface);

    logMessage('creation', "interface utilisateur créée.", 'zenith');

    await attendreFonction("loged");
    await attendreFonction("request");

    if (await loged()) {
        setuploged(userInterface);
    } else {
        setuplogin(userInterface);
    }

    let poster = document.createElement("img");
    poster.id = "poster";
    poster.src = "Images/Default.png";
    poster.alt = "Default Image";
    
    zenith.appendChild(poster);

    logMessage('end');
}

async function appInterface(app) {

    let containerImg = document.createElement("div");
    containerImg.id = "container-img";

    let title = document.createElement("h2");
    title.textContent = "Default Movie";

    app.appendChild(containerImg);
    app.appendChild(title);

    let button = document.createElement("div");
    button.id = "buttons";
    app.appendChild(button);

    let b1 = document.createElement("button");
    b1.id = "like";
    b1.textContent = "❤️ Ajouter aux favoris";

    let b2 = document.createElement("button");
    b2.id = "next";
    b2.textContent = "➡️ Suivant";

    button.appendChild(b1);
    button.appendChild(b2);
}

async function setuplogin(userInterface) {
    logMessage('change', "Configuration de la fonction de connexion"); // Début du groupe de logs

    let btn = document.createElement("button");
    btn.id = "btnLogin";
    btn.textContent = "Se connecter";
    btn.addEventListener("click", login);
    userInterface.appendChild(btn);
}

async function setuploged(userInterface) {
    logMessage('change', "Configuration de la fonction de contrôle utilisateur", 'loged'); // Début du groupe de logs

    await createPDP(userInterface);

    let div = document.createElement("div");
    div.id = "list";
    div.style.display = "none";
    div.style.gridTemplateColumns = "1fr";
    div.style.gap = "10px";
    div.style.justifyItems = "center";
    div.style.border = "1px solid gray";

    userInterface.appendChild(div);

    let btn = document.createElement("button");
    btn.id = "btnLogout";
    btn.textContent = "Se déconnecter";
    btn.addEventListener("click", logout);
    div.appendChild(btn);
}

async function createPDP(userInterface) {
    logMessage('loading', "Chargement des données utilisateur...", 'createPDP', null, true); // Message de débogage
    let data = await request("https://api.themoviedb.org/3/account/{account_id}", "GET", { session_id: '' });
    
    let pdp = document.createElement("img");
    pdp.id = "pdp";
    pdp.style.width = "65px";  // Largeur fixe
    pdp.style.height = "65px"; // Hauteur fixe
    pdp.style.objectFit = "cover"; // Remplit sans déformation
    pdp.style.borderRadius = "50%"; // Effet rond
    pdp.style.display = "none";

    userInterface.appendChild(pdp);

    pdp.addEventListener("mouseenter", showOverlay); // Quand on entre dans pdp

    logMessage('loading', "Chargement de l'image pour l'utilisateur...", null, null, false, true);

    await attendreFonction("loadImage");
    await loadImage(pdp, data.avatar.tmdb.avatar_path);

    logMessage('end');
}

async function showOverlay(event) {
    event.target.removeEventListener("mouseenter", showOverlay);
    event.target.parentElement.addEventListener("mouseleave", DiscareOverlay); // Quand on quitte le parent
    let btnLogout = document.getElementById("list");
    btnLogout.style.display = "grid";
}

async function DiscareOverlay(event) {
    event.target.removeEventListener("mouseleave", DiscareOverlay);
    document.getElementById("pdp").addEventListener("mouseenter", showOverlay);
    let btnLogout = document.getElementById("list");
    btnLogout.style.display = "none";
}

async function test() {
    logMessage('loading', "Test en cours...", 'test');
    let data = await request("https://api.themoviedb.org/3/account/{account_id}", "GET", { session_id: '' });
    loadImage(document.getElementById("poster"), data.avatar.tmdb.avatar_path);
}

async function setupTest(zenith) {
    logMessage('creation', "Configuration des tests...", 'setup', null, true);

    let btn = document.createElement("button")

    btn.id = "test";
    btn.textContent = "Test";
    btn.style.top = "0px";
    btn.style.left = "0px";

    zenith.appendChild(btn);

    btn.addEventListener("click", test);

    logMessage('success', 'Bouton de test créé.', 'setup');
    logMessage('end');
}

async function setupUI() {
    logMessage('creation', "Configuration de la page", "setup", null, true); // Début du groupe de logs

    document.querySelectorAll(".no-js").forEach((element) => {
        element.remove();
    });

    logMessage('deletion', "suppression des elements no-js", "setup");

    let body = document.querySelector("body");

    let zenith = document.createElement("div");
    zenith.id = "zenith";
    body.appendChild(zenith);
    zenithInterface(zenith);

    let app = document.createElement("div");
    app.id = "app";
    body.appendChild(app);
    appInterface(app);

    logMessage('end');
}