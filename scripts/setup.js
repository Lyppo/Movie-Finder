async function userInterface(zenith) {
    logMessage('group', "👤 Création du profil utilisateur...");

    let userInterface = document.createElement("div");
    userInterface.id = "userInterface";
    zenith.appendChild(userInterface);

    if (await loged()) {
        setuploged(userInterface);
    } else {
        setuplogin(userInterface);
    }

    logMessage('group', null);
}

function setuplogin(userInterface = document.getElementById("userInterface")) {
    logMessage('group', "🟠 Configuration de la fonction de connexion"); // Début du groupe de logs

    let btn = document.createElement("button");
    btn.id = "btnLogin";
    btn.textContent = "Se connecter";
    btn.addEventListener("click", login);
    userInterface.appendChild(btn);

    logMessage('group', null);
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

    logMessage('group', "🟠 Configuration de la fonction de contrôle utilisateur"); // Début du groupe de logs

    let btn = document.createElement("button");
    btn.id = "btnLogout";
    btn.textContent = "Se déconnecter";
    btn.addEventListener("click", logout);
    div.appendChild(btn);

    logMessage('group', null);
}

function setupUI() {
    logMessage('group', "🟠 Configuration de la page"); // Début du groupe de logs

    document.querySelectorAll(".no-js").forEach((element) => {
        logMessage('log', "🧹 Suppression de l'élément <noscript>...");
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

    let title = document.createElement("h2");
    title.textContent = "Default Movie";

    app.appendChild(containerImg);
    app.appendChild(title);
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

    logMessage('group', null);
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
    logMessage('log', "📏 Élément largeur:", element.clientWidth);

    // Fonction pour calculer le flou
    function calculateBlur(elementWidth, loadedWidth) {
        const blur = Math.max(15 - (loadedWidth / 20), 0); // Ajuster selon besoin
        logMessage('log', `🌫️ Calcul du flou: ${blur} (Élément Largeur: ${elementWidth}, Chargé Largeur: ${loadedWidth})`);
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

        logMessage('log', `🔄 Chargement de l'image à l'indice ${index}: ${res.size}`);
        
        let img = new Image();
        img.src = `https://image.tmdb.org/t/p/${res.size}${imagePath}`;

        // Lorsque l'image est chargée
        img.onload = () => {
            logMessage('log', `✅ Image chargée: ${img.src}`);
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
    logMessage('group', "🔍 Chargement des données utilisateur..."); // Message de débogage
    let data = await request("https://api.themoviedb.org/3/account/{account_id}", "GET", { session_id: '' });
    
    let pdp = document.createElement("img");
    pdp.id = "pdp";
    pdp.style.width = "65px";  // Largeur fixe
    pdp.style.height = "65px"; // Hauteur fixe
    pdp.style.objectFit = "cover"; // Remplit sans déformation
    pdp.style.objectPosition = "center"; // Centre l'image si besoin
    pdp.style.borderRadius = "50%"; // Effet rond

    logMessage('log', "🔍 Chargement de l'image pour l'utilisateur...");
    userInterface.appendChild(pdp);
    loadImage(pdp, data.avatar.tmdb.avatar_path);
    
    pdp.addEventListener("mouseenter", showOverlay); // Quand on entre dans pdp
    logMessage('group', null);
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
    logMessage('log', "🔍 Test en cours...");
}

function setupTest() {
    logMessage('group', "🔧 Configuration des tests..."); // Message de débogage
    creerElementsDepuisHTML(`<button style="top: 0px; left: 0px;" id="test">Test</button>`, "#zenith")
        .addEventListener("click", test);
    logMessage('log', '🔧 Bouton de test créé.'); // Message de débogage
    logMessage('group', null);
}

// Appel de la fonction pour afficher la documentation
afficherDocumentation(
    "setup.js",
    [
        { emoji: "👤", description: "Création du profil utilisateur", couleur: "color: #1E90FF; font-weight: bold;" },
        { emoji: "🟠", description: "Configuration de la fonction de connexion", couleur: "color: #FF8C00; font-weight: bold;" },
        { emoji: "🔍", description: "Chargement des données utilisateur", couleur: "color: #32CD32; font-weight: bold;" },
        { emoji: "✅", description: "Image chargée avec succès", couleur: "color: #32CD32; font-weight: bold;" },
        { emoji: "❌", description: "Erreur d'image ou de données", couleur: "color: #FF4500; font-weight: bold;" }
    ],
    [
        {
            nom: "userInterface(zenith)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Crée et configure l'interface utilisateur.",
                "Vérifie si l'utilisateur est connecté et configure l'interface en conséquence."
            ]
        },
        {
            nom: "setuplogin(userInterface)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Configure l'interface pour la connexion de l'utilisateur.",
                "Ajoute un bouton de connexion et définit un écouteur d'événements."
            ]
        },
        {
            nom: "setuploged(userInterface)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Configure l'interface lorsque l'utilisateur est connecté.",
                "Ajoute un bouton de déconnexion et affiche les informations utilisateur."
            ]
        },
        {
            nom: "setupUI()",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Configure la page principale de l'application.",
                "Supprime les éléments inutiles et initialise les éléments de l'interface."
            ]
        },
        {
            nom: "loadImage(element, imagePath)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Charge une image à partir d'un chemin donné et ajuste son flou selon la largeur de l'élément.",
                "Gère plusieurs résolutions d'image."
            ]
        },
        {
            nom: "createPDP(userInterface)",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Crée le profil utilisateur avec l'image et les données de l'utilisateur.",
                "Ajoute l'image à l'interface et configure les événements associés."
            ]
        },
        {
            nom: "test()",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Fonction de test pour vérifier le fonctionnement des éléments."
            ]
        },
        {
            nom: "setupTest()",
            couleur: "color: #FFD700; font-weight: bold;",
            descriptions: [
                "Configure un bouton de test dans l'interface.",
                "Ajoute un écouteur d'événements pour exécuter la fonction de test."
            ]
        }
    ]
);