async function request(url, type, params = {}, content = {}) {
    logMessage('connection', `Création de la requête...\n       [${type}] → ${url}`, "REQ"); // Démarre un groupe de log

    // Vérifie si l'URL est correcte
    if (!url.includes("api.themoviedb.org")) {
        logMessage('error', "L'URL doit concerner api.themoviedb.org.", "REQ");
        logMessage('end');
        return;
    }

    // Vérification de la méthode HTTP
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!validMethods.includes(type)) {
        logMessage('error', `Méthode HTTP invalide : ${type}.`, "REQ");
        logMessage('end');
        return;
    }

    // Création des paramètres de recherche
    let searchParams = new URLSearchParams(params);
    url += searchParams.toString() ? `?${searchParams.toString()}` : "";

    // Ajout du token d'accès au contenu si présent
    if (content.access_token) {
        content.access_token = ACCESS_TOKEN; // Remplace le token par la valeur actuelle
    }

    logMessage('log', "Contenu envoyé :", "REQ", {params: params, content: content}); // Affiche le contenu envoyé

    try {
        // Envoi de la requête
        let response = await fetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`, // Utilisation de ACCESS_TOKEN
            },
            body: Object.keys(content).length > 0 ? JSON.stringify(content) : undefined
        });

        // Analyse de la réponse
        const data = await response.json();
        logMessage('success', "Réponse reçue :", "REQ", data);

        // Gestion des erreurs de réponse
        if (!response.ok) {
            logMessage('end');
            throw new Error(`⚠️ Erreur API : ${response.status} - ${data.status_message || 'Erreur inconnue'}`);
        }

        logMessage('end');
        return data; // Retourne les données
    } catch (error) {
        logMessage('error', `Erreur : ${error.message}`, "REQ"); // Affiche les erreurs
        logMessage('end');
        return;
    }
}

async function getImageDimensions(element, imagePath) {
    // Récupérer les styles CSS
    const styles = window.getComputedStyle(element);
    const width = styles.width;
    const height = styles.height;
    const objectFit = styles.objectFit;

    logMessage('log', "données récupérées :", "IMG", {width: width, height: height, objectFit: objectFit, display: styles.display}, false, true);

    // Si la largeur n'est pas auto et l'object-fit n'est pas cover, on retourne la largeur
    if (width !== "auto" && width !== '' && objectFit !== "cover") {
        return width;
    } else {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `https://image.tmdb.org/t/p/w45${imagePath}`;
            img.loading = "eager";
            img.decoding = "async";

            img.onload = () => {
                const imgWidth = img.width;
                const imgHeight = img.height;

                // Calcul de la largeur nécessaire pour remplir la hauteur
                const necessaryWidth = (parseFloat(height) / imgHeight) * imgWidth;

                resolve(necessaryWidth); // Résoudre la promesse avec la largeur calculée
            };

            img.onerror = () => {
                logMessage('error', `Erreur de chargement ${imagePath}`, "IMG");
                reject(-1); // Rejeter la promesse en cas d'erreur
            };
        });
    }
}

async function setBlur(width, max) {

    const k = 1;
    let blur = ((parseFloat(max) / width) - 1) * k;
    if (blur < 0) blur = 0;
    logMessage('log', `Filtre appliqué : blur(${blur}px)`, "IMG", null, false, true);
    return blur;
}

async function correctParentOrder(element, add = true) {
    const parent = element.parentNode;

    if (add) {
        // Vérifier si le parent est déjà une div avec la classe content-img-blur
        if (parent && parent.classList.contains('content-img-blur')) {
            // Si le parent a déjà cette classe, on ne fait rien
            return;
        }

        // Créer une nouvelle div avec la classe content-img-blur
        const newDiv = document.createElement('div');
        newDiv.classList.add('content-img-blur');

        // Copier les styles de l'image dans la nouvelle div (styles spécifiques)
        const styles = window.getComputedStyle(element);

        // Appliquer ces styles à la nouvelle div
        newDiv.style.width = styles.width;
        newDiv.style.height = styles.height;
        newDiv.style.borderRadius = styles.borderRadius;
        newDiv.style.border = styles.border;
        newDiv.style.boxShadow = styles.boxShadow;
        newDiv.style.zIndex = styles.zIndex;
        newDiv.style.top = styles.top;
        newDiv.style.left = styles.left;
        newDiv.style.transform = styles.transform;
        newDiv.style.overflow = "hidden";
        newDiv.style.backgroundColor = "#222";

        // Enlever les styles non désirés de l'image
        element.style.boxShadow = 'none';
        element.style.border = '0';
        element.style.top = 'auto';
        element.style.left = 'auto';
        element.style.transform = 'none';

        // Remplacer l'élément actuel par la nouvelle div dans son parent
        parent.replaceChild(newDiv, element);

        // Ajouter l'élément à l'intérieur de la nouvelle div
        newDiv.appendChild(element);

        // Si l'élément a l'ID "poster", ajouter un effet hover
        if (element.id === 'poster') {
            newDiv.style.top = '50%';
            newDiv.style.left = '50%';
            newDiv.style.transform = 'translate(-50%, calc(-50% - 60px))';
            newDiv.addEventListener('mouseover', () => {
                // Ajouter des styles de survol à la div
                element.style.boxShadow = newDiv.style.boxShadow = 'black 0 0 10px';
                element.style.height = newDiv.style.height = '500px';
                element.style.width = newDiv.style.width = 'calc(2/3 * 500px)';
                element.style.borderColor = newDiv.style.borderColor = 'gray';
            });

            newDiv.addEventListener('mouseout', () => {
                // Réinitialiser les styles au départ
                element.style.boxShadow = newDiv.style.boxShadow = 'black 0 0 30px';
                element.style.height = newDiv.style.height = '450px';
                element.style.width = newDiv.style.width = 'calc(2/3 * 450px)';
                element.style.borderColor = newDiv.style.borderColor = 'black 1px solid';
            });
        }
    } else {
        // Si add est faux, restaurer l'élément à son état initial

        // Vérifier si le parent est une div avec la classe content-img-blur
        if (parent && parent.classList.contains('content-img-blur')) {
            // Restaurer les styles de l'élément
            parent;

            // Restaurer les styles supprimés sur l'élément
            const originalStyles = window.getComputedStyle(parent);

            element.style.boxShadow = originalStyles.boxShadow;
            element.style.border = originalStyles.border;
            if (element.id === 'poster') {

                element.style.top = '50%';
                element.style.left = '50%';
                element.style.transform = 'translate(-50%, calc(-50% - 60px))';
            }
            else {
                element.style.top = originalStyles.top;
                element.style.left = originalStyles.left;
                element.style.transform = originalStyles.transform;
            }

            // Supprimer la div contenant l'élément et remettre l'élément dans le parent
            parent.parentNode.replaceChild(element, parent);
        }
    }
}



async function loadImageAtResolution(element, imagePath, resolution, highestLoadedRef, max, i) {

    logMessage('log', `Chargement de l'image en ${resolution.size}...`, "IMG", null, false, true);

    const img = new Image();
    img.src = `https://image.tmdb.org/t/p/${resolution.size}${imagePath}`;
    img.loading = "eager";
    img.decoding = "async";

    const blur = await setBlur(resolution.width, max);
    if (resolution.width>max) {
        correctParentOrder(element, false)
    } else {
        correctParentOrder(element);
    }

    img.onload = () => {
        if (highestLoadedRef.current >= resolution.width) {
            logMessage('deletion', `Image non chargée en ${resolution.size}`, "IMG", null, false, true);
            return; // Ignorer si une meilleure résolution est déjà affichée
        }
        highestLoadedRef.current = resolution.width;
        element.style.filter = `blur(${blur}px)`;
        element.src = img.src;
        element.style.display = "block";
        logMessage('success', `Image chargée en ${resolution.size}`, "IMG", null, false, true);
    };

    img.onerror = () => logMessage('error', `Erreur de chargement ${resolution.size}`, "IMG");
}

async function loadImage(element, imagePath, original = false) {

    const resolutions = [
        { size: 'original', width: Infinity },
        { size: 'w1280', width: 1280 },
        { size: 'w780', width: 780 },
        { size: 'w500', width: 500 },
        { size: 'w342', width: 342 },
        { size: 'w300', width: 300 },
        { size: 'w185', width: 185 },
        { size: 'w154', width: 154 },
        { size: 'w92', width: 92 },
        { size: 'w45', width: 45 }
    ];

    let highestLoadedRef = { current: 0 };

    const max = await getImageDimensions(element, imagePath);

    logMessage('log', "valeur retournée : " + max, "IMG", null, false, true);

    // Utilisation de la boucle for classique
    for (let i = 0; i < resolutions.length; i++) {

        if (!original && i!=resolutions.length-1 && resolutions[i+1].width > max) continue;

        // Charge l'image pour cette résolution
        loadImageAtResolution(element, imagePath, resolutions[i], highestLoadedRef, max, resolutions.length-i-1);
    }
}
