// html.js
export function creerElement({
    tag = "div",
    id = "",
    classe = "",
    parent = "body",
    numero = 0,
    textContent = "",
    attributs = {}
} = {}) {
    // Création de l'élément
    let element = document.createElement(tag);

    // Ajout de l'ID si fourni
    if (id) element.id = id;

    // Ajout des classes si fournies
    if (classe) element.className = classe;

    // Ajout du texte si fourni
    if (textContent) element.textContent = textContent;

    // Ajout des autres attributs
    for (let [key, value] of Object.entries(attributs)) {
        element.setAttribute(key, value);
    }

    // Sélection du parent
    let parents = document.querySelectorAll(parent);
    if (parents.length > numero) {
        parents[numero].appendChild(element);
    } else {
        console.warn(`Parent '${parent}' numéro ${numero} non trouvé.`);
    }

    return element;
}

export function removeElement(cible = "body", index = 0) {
    let elements = document.querySelectorAll(cible);

    if (index === -1) {
        // Supprime tous les éléments correspondants
        elements.forEach(el => el.remove());
    } else if (elements.length > index) {
        // Supprime l'élément correspondant à l'index donné
        elements[index].remove();
    } else {
        console.warn(`Aucun élément trouvé pour '${cible}' à l'index ${index}.`);
    }
}

export function creerElementsDepuisHTML(parent = "body", numero = 0, htmlString = "") {
    // Création d'un conteneur temporaire pour parser le HTML
    let tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString.trim();

    // Sélection du parent
    let parents = document.querySelectorAll(parent);
    if (parents.length <= numero) {
        console.warn(`Parent '${parent}' numéro ${numero} non trouvé.`);
        return {};
    }

    let parentElement = parents[numero];

    // Fonction pour générer un ID aléatoire
    const generateID = () => `unnamed-${Math.floor(100000 + Math.random() * 900000)}`;

    // Objet pour stocker les références des éléments créés
    let elementsMap = {};

    // Parcourir les enfants du conteneur temporaire
    Array.from(tempContainer.children).forEach(child => {
        // Vérifier si l'élément a un ID, sinon lui en attribuer un
        if (!child.id) {
            child.id = generateID();
        }

        // Créer l'élément avec la fonction creerElement()
        creerElement({
            tag: child.tagName.toLowerCase(),
            id: child.id,
            classe: child.className,
            textContent: child.textContent,
            parent: parent,
            numero: numero
        });

        // Ajouter l'élément au dictionnaire en utilisant document.getElementById
        elementsMap[child.id] = document.getElementById(child.id);

        // Ajouter récursivement les enfants
        if (child.children.length > 0) {
            let childElements = creerElementsDepuisHTML(`#${child.id}`, 0, child.innerHTML);
            Object.assign(elementsMap, childElements); // Fusionner les enfants dans le dictionnaire
        }
    });

    // Retourner un objet qui permet l'accès par propriété
    return new Proxy(elementsMap, {
        get(target, prop) {
            return target[prop] || undefined; // Retourne undefined si l'élément n'existe pas
        }
    });
}