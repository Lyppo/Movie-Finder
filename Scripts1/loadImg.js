async function getImageDimensions(element, imagePath) {

    const styles = window.getComputedStyle(element);
    const width = styles.width;
    const height = styles.height;
    const objectFit = styles.objectFit;

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

                const necessaryWidth = (parseFloat(height) / imgHeight) * imgWidth;

                resolve(necessaryWidth);
            };

            img.onerror = () => {
                reject(-1);
            };
        });
    }
}

async function setBlur(width, max) {

    const k = 1;
    let blur = ((parseFloat(max) / width) - 1) * k;
    if (blur < 0) blur = 0;
    return blur;
}

async function correctParentOrder(element, add = true) {
    const parent = element.parentNode;

    if (add) {
        if (parent && parent.classList.contains('content-img-blur')) {
            return;
        }

        const newDiv = document.createElement('div');
        newDiv.classList.add('content-img-blur');

        const styles = window.getComputedStyle(element);

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

        element.style.boxShadow = 'none';
        element.style.border = '0';
        element.style.top = 'auto';
        element.style.left = 'auto';
        element.style.transform = 'none';

        parent.replaceChild(newDiv, element);

        newDiv.appendChild(element);

        if (element.id === 'poster') {
            newDiv.style.top = '50%';
            newDiv.style.left = '50%';
            newDiv.style.transform = 'translate(-50%, calc(-50% - 60px))';
            newDiv.addEventListener('mouseover', () => {

                element.style.boxShadow = newDiv.style.boxShadow = 'black 0 0 10px';
                element.style.height = newDiv.style.height = '500px';
                element.style.width = newDiv.style.width = 'calc(2/3 * 500px)';
                element.style.borderColor = newDiv.style.borderColor = 'gray';
            });

            newDiv.addEventListener('mouseout', () => {

                element.style.boxShadow = newDiv.style.boxShadow = 'black 0 0 30px';
                element.style.height = newDiv.style.height = '450px';
                element.style.width = newDiv.style.width = 'calc(2/3 * 450px)';
                element.style.borderColor = newDiv.style.borderColor = 'black 1px solid';
            });
        }
    } else {

        if (parent && parent.classList.contains('content-img-blur')) {
            parent;

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

            parent.parentNode.replaceChild(element, parent);
        }
    }
}

async function loadImageAtResolution(element, imagePath, resolution, highestLoadedRef, max) {

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
            return; // Ignorer si une meilleure résolution est déjà affichée
        }
        highestLoadedRef.current = resolution.width;
        element.style.filter = `blur(${blur}px)`;
        element.src = img.src;
        element.style.display = "block";
    };
}

async function loadImage(element, imagePath, original = false) {

    return tmpload(element, imagePath);

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

    // Utilisation de la boucle for classique
    for (let i = 0; i < resolutions.length; i++) {

        if (!original && i!=resolutions.length-1 && resolutions[i+1].width > max) continue;

        // Charge l'image pour cette résolution
        loadImageAtResolution(element, imagePath, resolutions[i], highestLoadedRef, max);
    }
}

function tmpload(element, imagePath) {
    element.src = `https://image.tmdb.org/t/p/original${imagePath}`;
}

async function loadPDP(pdp) {
    if (await loged()) {
        log("Utilisateur connecté, chargement de l'avatar...", 'request', null, 'Setup');

        try {
            log("Requete pour récupérer les données utilisateur...", 'request', null, 'Setup');

            const data = await request('GET', "https://api.themoviedb.org/3/account/{account_id}", { session_id: '' });
            

            pdp.style.display = "none";
            await loadImage(pdp, data.avatar.tmdb.avatar_path);

            pdp.style.display = "initial";
            log("Avatar chargé avec succès!", 'success', data.avatar.tmdb.avatar_path, 'Setup');
        } catch (error) {
            pdp.style.display = "initial";
            log("Erreur lors du chargement de l'avatar", 'error', error, 'Setup');
        }
    }
}