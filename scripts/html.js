// html.js
export function creerElement({tag = "div", parent = "body", numero = 0, attributs = {}} = {}) {
    // Création de l'élément
    let element = document.createElement(tag);

    if (!("id" in attributs)) {  
        attributs.id = "unamed-" + Math.floor(10000 + Math.random() * 90000);
    }

    if ("textContent" in attributs) {  
        element.textContent = attributs.textContent;
        delete attributs.textContent;
    }

    // Ajout des autres attributs
    for (let [key, value] of Object.entries(attributs)) {
        element.setAttribute(key, value);
    }

    // Sélection du parent
    let parents = document.querySelectorAll(parent);
    if (parents.length === 0) {
        console.warn(`Parent '${parent}' non trouvé.\nAssigné à <body> par défaut`);
        document.body.appendChild(element);
    } else if (parents.length > numero) {
        parents[numero].appendChild(element);
    } else {
        console.warn(`Parent '${parent}' numéro ${numero} non trouvé.\nAssigné à l'élément 0 par défaut`);
        parents[0].appendChild(element);
    }

    return element;
}

export function removeElement(cible = "body", index = 0) {
    let elements = document.querySelectorAll(cible);

    // Vérifie si des éléments ont été trouvés
    if (elements.length === 0) {
        console.warn(`Aucun élément trouvé pour '${cible}'.`);
        return false; // Retourne false si aucun élément n'est trouvé
    }

    if (index === -1) {
        // Supprime tous les éléments correspondants
        elements.forEach(el => el.remove());
        return true; // Retourne true si la suppression a réussi
    } else if (index >= 0 && elements.length > index) {
        // Supprime l'élément correspondant à l'index donné
        elements[index].remove();
        return true; // Retourne true si la suppression a réussi
    } else {
        console.warn(`Aucun élément trouvé pour '${cible}' à l'index ${index}.`);
        return false; // Retourne false si l'index est invalide
    }
}

export function creerElementsDepuisHTML(htmlString = "", parent = "body", numero = 0) {
    // Nettoyage de la chaîne HTML
    htmlString = htmlString.trim();

    // Vérifie si la chaîne commence par une balise (y compris les auto-fermantes)
    const regex = /^<(\w+)([^>]*)\/?>$|^<(\w+)([^>]*)>(.*?)<\/\3>$/s; // Expression régulière pour matcher une balise
    const match = htmlString.match(regex);

    if (!match) {
        console.error("Erreur : La chaîne HTML est mal formée.");
        return null; // Retourne null en cas d'erreur
    }

    // Déterminer si c'est une balise auto-fermante ou non
    let tag, attributesString, textContent;
    if (match[1]) {
        // Cas d'une balise auto-fermante
        tag = match[1];
        attributesString = match[2];
        textContent = ""; // Pas de contenu texte pour les balises auto-fermantes
    } else {
        // Cas d'une balise normale
        tag = match[3];
        attributesString = match[4];
        textContent = match[5]?.trim() || ""; // Contenu texte entre les balises
    }

    // Parse des attributs
    const attributs = {};
    const attrRegex = /(\w+)\s*=\s*"([^"]*?)"/g; // Expression régulière pour matcher les attributs
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
        const key = attrMatch[1];
        const value = attrMatch[2];
        attributs[key] = value;
    }

    // Ajoute le texte de contenu à l'objet d'attributs si ce n'est pas une balise auto-fermante
    if (textContent) {
        attributs.textContent = textContent;
    }

    // Utilise la fonction creerElement pour créer l'élément
    try {
        return creerElement({ tag, parent, numero, attributs });
    } catch (error) {
        console.error("Erreur lors de la création de l'élément :", error);
        return null; // Retourne null en cas d'erreur
    }
}