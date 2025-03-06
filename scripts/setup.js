async function createZenith() {

    const zenith = document.createElement("div");

    zenithInterface(zenith);

    zenith.id = "zenith";
    document.body.prepend(zenith);
}

async function createApp() {

    const app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
}

async function zenithInterface(zenith) {

    createTest(zenith);

    createUserInterface(zenith);
}

async function createUserInterface(zenith) {

    const userInterface = document.createElement("div");

    if (await loged()) createLoged(userInterface);

    else createLogin(userInterface);

    userInterface.id = "userInterface";
    userInterface.classList.add("list");
    zenith.appendChild(userInterface);
}

async function createLogin(userInterface) {

    const btn = document.createElement("button");
    btn.id = "btnLogin";
    btn.textContent = "Se connecter";
    btn.addEventListener("click", login);
    userInterface.appendChild(btn);
}

async function createLoged(userInterface) {

    createPDP(userInterface);

    const div = document.createElement("div");

    createLogout(div);

    div.id = "list";
    div.classList.add("list");
    div.style.display = "none";
    userInterface.appendChild(div);
}

async function createLogout(div) {

    const btn = document.createElement("button");
    btn.id = "btnLogout";
    btn.textContent = "Se déconnecter";
    div.appendChild(btn);
    btn.addEventListener("click", logout);
}

async function createPDP(userInterface) {

    let div = document.createElement("div");

    div.id = "englob-pdp";
    div.style.overflow = "hidden";
    userInterface.appendChild(div);

    let pdp = document.createElement("img");

    pdp.id = "pdp";
    pdp.style.width = "65px";
    pdp.style.height = "65px";
    pdp.style.objectFit = "cover";
    pdp.style.borderRadius = "50%";
    pdp.src = "../Images/Default-Profile.png"

    div.prepend(pdp);
    pdp.addEventListener("mouseenter", showUserMenu);

    if (await loged()) {

        pdp.style.display = "none";
        
        const data = await request('GET', "https://api.themoviedb.org/3/account/{account_id}", { session_id: '' });
        
        await loadImage(pdp, data.avatar.tmdb.avatar_path);

        pdp.style.display = "initial";
    }
}

async function createTest(zenith) {

    const btn = document.createElement("button");

    btn.id = "test";
    btn.textContent = "Test";
    btn.style.top = "10px";
    btn.style.left = "10px";

    zenith.prepend(btn);

    btn.addEventListener("click", test);
}

async function setup() {

    createZenith();

    createApp();
}