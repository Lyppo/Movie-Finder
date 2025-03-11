async function createZenith() {

    const zenith = document.createElement("div");

    createTest(zenith);

    createUserInterface(zenith);

    zenith.id = "zenith";

    document.body.prepend(zenith);
}

async function createApp() {
    const app = document.createElement("div");

    app.id = "app";

    document.body.append(app);
}

async function createUserInterface(zenith) {

    const userInterface = document.createElement("div");

    if (await loged()) createLogedList(userInterface);
    
    else createLogin(userInterface);

    userInterface.id = "userInterface";

    userInterface.classList.add("list");

    zenith.append(userInterface);
}

async function createLogin(userInterface) {

    const btn = document.createElement("button");

    btn.id = "btnLogin";

    btn.textContent = "Se connecter";

    btn.addEventListener("click", login);

    userInterface.append(btn);
}

async function createLogedList(userInterface) {

    createProfileIMG(userInterface);

    const div = document.createElement("div");
    
    createLogout(div);

    div.id = "list";

    div.classList.add("list");

    div.style.display = "none";

    userInterface.append(div);
}

async function createLogout(list) {

    const btn = document.createElement("button");

    btn.id = "btnLogout";

    btn.textContent = "Se déconnecter";

    btn.addEventListener("click", logout);

    list.append(btn);
}

async function createProfileIMG(userInterface) {

    let pdp = document.createElement("img");

    createEnveloppeIMG(userInterface, pdp, true);

    loadPDP(pdp);
    
    pdp.id = "pdp";
    pdp.style.width = "65px";
    pdp.style.height = "65px";
    pdp.style.objectFit = "cover";
    pdp.style.borderRadius = "50%";

    pdp.src = "../Images/Default-Profile.png";

    pdp.addEventListener("mouseenter", showUserMenu);
}

async function createEnveloppeIMG(userInterface, img, first = false) {

    let div = document.createElement("div");

    div.id = "englob-pdp";
    div.style.overflow = "hidden";

    div.append(img);

    if (first) userInterface.prepend(div);

    else userInterface.append(div);
}

async function createTest(zenith) {

    const btn = document.createElement("button");

    btn.id = "test";
    btn.textContent = "Test";
    btn.style.top = "10px";
    btn.style.left = "10px";

    btn.addEventListener("click", test);

    zenith.prepend(btn);
}

async function setup() {

    createZenith()
    createApp()
}