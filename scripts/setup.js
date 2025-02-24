// 🟠 CONFIGURATION DE L'INTERFACE UTILISATEUR
function setupUI() {

    document.querySelectorAll("noscript").forEach((element) => {
        console.log("🧹 Suppression de l'élément <noscript>...");
        element.remove();
    });

    let zenith = document.createElement("div"); // Crée l'élément div
    zenith.id = "zenith"; // Assigne l'ID
    
    let app = document.createElement("div"); // Crée l'autre élément div
    app.id = "app"; // Assigne l'ID
    
    document.querySelector("body").appendChild(zenith); // Ajoute zenith au body
    document.querySelector("body").appendChild(app); // Ajoute app au body

    let poster = document.createElement("img"); // Crée l'élément img
    let containerImg = document.createElement("div"); // Crée l'élément div
    let titele = document.createElement("h2"); // Crée l'élément h2

    console.log("🟠 Configuration de l'interface utilisateur..."); // Message de débogage

    poster.id = "poster"; // Assigne l'ID
    poster.src = "Images/Default.png"; // Assigne le src
    poster.alt = "Default Image"; // Assigne l'alt
    containerImg.id = "container-img"; // Assigne l'ID
    titele.textContent = "Default Movie"; // Assigne le texte
    
    zenith.appendChild(poster); // Ajoute poster à zenith
    app.appendChild(containerImg); // Ajoute containerImg à app
    app.appendChild(titele); // Ajoute titele à app

    // Création du conteneur de boutons
    let button = document.createElement("div");
    button.id = "buttons";
    app.appendChild(button);

    let b1 = document.createElement("button");
    b1.id = "like";
    b1.textContent = "❤️ Ajouter aux favoris";
    let b2 = document.createElement("button");
    b2.id = "next";
    b2.textContent = "➡️ Suivant";

    button.appendChild(b1); // Ajoute les boutons à div
    button.appendChild(b2); // Ajoute les boutons à div
}

// 🔄 MISE À JOUR UI : APRÈS CONNEXION
function updateUIAfterLogin() {
    console.log("🔄 Mise à jour de l'UI après connexion..."); // Message de débogage
    creerElementsDepuisHTML(`<button id="btnLogout">Se déconnecter</button>`, "#zenith")
        .addEventListener("click", logout);
}

// 🔄 MISE À JOUR UI : APRÈS DÉCONNEXION
function updateUIAfterLogout() {
    console.log("🔄 Mise à jour de l'UI après déconnexion..."); // Message de débogage
    creerElementsDepuisHTML(`<button id="btnLogin">Se connecter</button>`, "#zenith")
        .addEventListener("click", login);
}

// 🔍 VÉRIFICATION DE L'ÉTAT DE CONNEXION
async function verifyLoginStatus() {
    console.log("🔍 Vérification de l'état de connexion..."); // Message de débogage
    if (await loged()) {
        updateUIAfterLogin();
    } else {
        updateUIAfterLogout();
    }
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
async function getUser() {
    console.log("🔍 Chargement des données utilisateur..."); // Message de débogage
    let data = await request("https://api.themoviedb.org/3/account/{account_id}", "GET", { session_id: '' });
    let poster = document.getElementById("poster");
    console.log("🔍 Chargement de l'image pour l'utilisateur...");
    loadImage(poster, data.avatar.tmdb.avatar_path);
}

function setupTest() {
    console.log("🔧 Configuration des tests..."); // Message de débogage
    creerElementsDepuisHTML(`<button style="top: 0px; left: 0px;" id="testuser">User</button>`, "#zenith")
        .addEventListener("click", getUser);
    console.log('🔧 Bouton de test créé.'); // Message de débogage
}