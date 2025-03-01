// Fonction pour créer un élément HTML
function creerElement({ tag = "div", parent = "body", numero = 0, attributs = {} } = {}) {
    // Création de l'élément
    const element = document.createElement(tag);

    // Attribution d'un ID par défaut si non fourni
    if (!("id" in attributs)) {
        attributs.id = "unamed-" + Math.floor(10000 + Math.random() * 90000);
    }

    // Ajout du contenu texte si fourni
    if ("textContent" in attributs) {
        element.textContent = attributs.textContent;
        delete attributs.textContent; // Suppression de l'attribut après usage
    }

    // Ajout des autres attributs
    Object.entries(attributs).forEach(([key, value]) => {
        if (typeof value === 'string') {
            element.setAttribute(key, value);
        } else {
        }
    });

    // Sélection du parent et ajout de l'élément
    const parents = document.querySelectorAll(parent);
    if (parents.length === 0) {
        document.body.appendChild(element);
    } else if (parents.length > numero) {
        parents[numero].appendChild(element);
    } else {
        parents[0].appendChild(element);
    }
    return element; // Retourne l'élément créé
}

// Fonction pour supprimer un élément HTML
function removeElement(cible = "body", index = 0) {
    const elements = document.querySelectorAll(cible);

    // Vérifie si des éléments ont été trouvés
    if (elements.length === 0) {
        return false; // Retourne false si aucun élément n'est trouvé
    }

    if (index === -1) {
        // Supprime tous les éléments correspondants
        elements.forEach(el => {
            el.remove();
        });
        return true; // Retourne true si la suppression a réussi
    } else if (index >= 0 && index < elements.length) {
        elements[index].remove();
        return true; // Retourne true si la suppression a réussi
    } else {
        return false; // Retourne false si l'index est invalide
    }
}

// Fonction pour créer des éléments à partir d'une chaîne HTML
function creerElementsDepuisHTML(htmlString = "", parent = "body", numero = 0) {
    // Nettoyage de la chaîne HTML
    htmlString = htmlString.trim();

    // Vérifie si la chaîne commence par une balise
    const regex = /^<(\w+)([^>]*)\/?>$|^<(\w+)([^>]*)>(.*?)<\/\3>$/s;
    const match = htmlString.match(regex);

    if (!match) {
        return null; // Retourne null en cas d'erreur
    }

    // Déterminer le tag, les attributs et le contenu texte
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
    const attrRegex = /(\w+)\s*=\s*"([^"]*?)"/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
        attributs[attrMatch[1]] = attrMatch[2]; // Ajoute l'attribut au dictionnaire
    }

    // Ajoute le texte de contenu à l'objet d'attributs si ce n'est pas une balise auto-fermante
    if (textContent) {
        attributs.textContent = textContent;
    }

    // Utilise la fonction creerElement pour créer l'élément
    try {
        const nouvelElement = creerElement({ tag, parent, numero, attributs });
        return nouvelElement;
    } catch (error) {
        return null; // Retourne null en cas d'erreur
    }
}