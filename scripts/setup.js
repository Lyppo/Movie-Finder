async function userInterface(zenith) {

    console.groupCollapsed("creation du profil utilisateur");

    let userInterface = document.createElement("div");
    userInterface.id = "userInterface";
    zenith.appendChild(userInterface);
    if (await loged()) {
        setuploged(userInterface);
    }
    else {
        setuplogin(userInterface);
    }

    console.groupEnd();
}

function setuplogin(userInterface = document.getElementById("userInterface")) {

    console.groupCollapsed("🟠 Configuration de la fonction de connection"); // Début du groupe de logs

    let btn = document.createElement("button");
    btn.id = "btnLogin";
    btn.textContent = "Se connecter";
    btn.addEventListener("click", login);
    userInterface.appendChild(btn);

    console.groupEnd();
}

async function setuploged(userInterface = document.getElementById("userInterface")) {

    await createPDP(userInterface);

    let div = document.createElement("div");
    div.id = "list";
    div.style.display = "none";
    div.style.gridTemplateColumns = "1fr";
    div.style.gap = "10px";
    div.style.justifyItems = "center";
    div.style.border = "1px solid gray";


    userInterface.appendChild(div);

    console.groupCollapsed("🟠 Configuration de la fonction de controle utilisateur"); // Début du groupe de logs

    let btn = document.createElement("button");
    btn.id = "btnLogout";
    btn.textContent = "Se déconnecter";
    btn.addEventListener("click", logout);
    div.appendChild(btn);

    console.groupEnd();
}

function setupUI() {

    console.groupCollapsed("🟠 Configuration de la page"); // Début du groupe de logs

    document.querySelectorAll("noscript").forEach((element) => {
        console.log("🧹 Suppression de l'élément <noscript>...");
        element.remove();
    });

    let body = document.querySelector("body");

    let zenith = document.createElement("div");
    zenith.id = "zenith";
    body.appendChild(zenith);
    userInterface(zenith);

    let app = document.createElement("div");
    app.id = "app";
    body.appendChild(app);

    let poster = document.createElement("img");
    poster.id = "poster";
    poster.src = "Images/Default.png";
    poster.alt = "Default Image";

    let containerImg = document.createElement("div");
    containerImg.id = "container-img";

    let titele = document.createElement("h2");
    titele.textContent = "Default Movie";

    app.appendChild(containerImg);
    app.appendChild(titele);
    zenith.appendChild(poster);

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
    
    console.groupEnd();
}

async function loadImage(element, imagePath) {
    const resolutions = [
        { size: 'w45', width: 45 },
        { size: 'w92', width: 92 },
        { size: 'w154', width: 154 },
        { size: 'w185', width: 185 },
        { size: 'w300', width: 300 },
        { size: 'w342', width: 342 },
        { size: 'w500', width: 500 },
        { size: 'w780', width: 780 },
        { size: 'w1280', width: 1280 },
        { size: 'original', width: Infinity }
    ];

    // Afficher la largeur de l'élément
    console.log("📏 Élément largeur:", element.clientWidth);

    // Fonction pour calculer le flou
    function calculateBlur(elementWidth, loadedWidth) {
        const blur = Math.max(15 - (loadedWidth / 20), 0); // Ajuster selon besoin
        console.log(`🌫️ Calcul du flou: ${blur} (Élément Largeur: ${elementWidth}, Chargé Largeur: ${loadedWidth})`);
        return blur;
    }

    // Variable pour suivre l'indice de l'image chargée
    let lastLoadedIndex = -1;

    // Fonction asynchrone pour charger l'image
    async function loadImageAtIndex(index) {
        if (index < 0 || index >= resolutions.length) return; // Vérifier l'indice

        const res = resolutions[index]; // Obtenir la résolution actuelle
        // Si l'indice est inférieur à lastLoadedIndex, ne rien faire
        if (lastLoadedIndex >= index) return;

        console.log(`🔄 Chargement de l'image à l'indice ${index}: ${res.size}`);
        
        let img = new Image();
        img.src = `https://image.tmdb.org/t/p/${res.size}${imagePath}`;

        // Lorsque l'image est chargée
        img.onload = () => {
            console.log(`✅ Image chargée: ${img.src}`);
            lastLoadedIndex = index; // Mettre à jour l'indice
            element.src = img.src; // Changer le src de l'élément
            element.style.filter = `blur(${calculateBlur(element.clientWidth, res.width)}px)`; // Appliquer le flou
        };

        // Retourner une promesse qui se résout lorsque l'image est chargée
        return new Promise((resolve) => {
            img.onload = () => {
                lastLoadedIndex = index; // Mettre à jour l'indice
                element.src = img.src; // Changer le src de l'élément
                element.style.filter = `blur(${calculateBlur(element.clientWidth, res.width)}px)`; // Appliquer le flou
                resolve(index); // Résoudre la promesse une fois l'image chargée
            };
        });
    }

    // Appeler la fonction pour charger toutes les résolutions, une par une
    for (let i = 0; i < resolutions.length; i++) {
        await loadImageAtIndex(i);
    }
}

// Exemple d'utilisation
async function createPDP(userInterface) {
    console.groupCollapsed("🔍 Chargement des données utilisateur..."); // Message de débogage
    let data = await request("https://api.themoviedb.org/3/account/{account_id}", "GET", { session_id: '' });
    let pdp = document.createElement("img");
    pdp.id = "pdp";
    pdp.style.width = "65px";  // Largeur fixe
    pdp.style.height = "65px"; // Hauteur fixe
    pdp.style.objectFit = "cover"; // Remplit sans déformation
    pdp.style.objectPosition = "center"; // Centre l'image si besoin
    pdp.style.borderRadius = "50%"; /* Si tu veux un effet rond */
    console.log("🔍 Chargement de l'image pour l'utilisateur...");
    userInterface.appendChild(pdp);
    loadImage(pdp, data.avatar.tmdb.avatar_path);
    pdp.addEventListener("mouseenter", showOverlay); // Quand on entre dans pdp
    console.groupEnd();
}

function showOverlay(event) {
    pdp.removeEventListener("mouseenter", showOverlay);
    event.target.parentElement.addEventListener("mouseleave", DiscareOverlay); // Quand on quitte le parent
    let btnLogout = document.getElementById("list");
    btnLogout.style.display = "grid";
}

function DiscareOverlay(event) {
    event.target.removeEventListener("mouseleave", DiscareOverlay);
    pdp.addEventListener("mouseenter", showOverlay);
    let btnLogout = document.getElementById("list");
    btnLogout.style.display = "none";
}

async function test() {
    console.log("test");
}

function setupTest() {
    console.groupCollapsed("🔧 Configuration des tests..."); // Message de débogage
    creerElementsDepuisHTML(`<button style="top: 0px; left: 0px;" id="test">Test</button>`, "#zenith")
        .addEventListener("click", test);
    console.log('🔧 Bouton de test créé.'); // Message de débogage
    console.groupEnd();
}