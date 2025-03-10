let cookies = {};

let ACCOUNT_ID = "";
let ACCESS_TOKEN = "";
let SESSION_ID = "";

async function getCookies() {

    if (!document.cookie) return log('Aucun cookie trouvé', 'failure', null, 'Cookies');

    cookies = {};
    let cookiesArray = document.cookie.split('; ');

    for (let i = 0; i < cookiesArray.length; i++) {
        let [name, value] = cookiesArray[i].split('=');
        if (name) {
            cookies[name] = decodeURIComponent(value);
        }
    }

    log('Cookies récupérés avec succès', 'success', cookies, 'Cookies');
}

async function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${2592000}; path=/`;
    cookies[name] = value;

    log(`Cookie défini : ${name} = ${value} avec une durée de vie de 30 jours`, 'add', null, 'Cookies');
}

async function clearCookie(name) {
    if (!cookies[name]) return log(`Tentative de suppression d'un cookie inexistant : ${name}`, 'warn', null, 'Cookies');

    document.cookie = `${name}=; max-age=0; path=/`;
    delete cookies[name];

    log(`Cookie supprimé : ${name}`, 'remove', null, 'Cookies');
}

async function load() {
    if (!ACCESS_TOKEN) {
        
        await getCookies();

        ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
        ACCOUNT_ID = cookies["ACCOUNT_ID"];
        SESSION_ID = cookies["SESSION_ID"];

        if (ACCESS_TOKEN) {
            log('Données utilisateur chargées avec succès', 'success', { ACCESS_TOKEN, ACCOUNT_ID, SESSION_ID }, 'Cookies');
        } else {
            log('Données utilisateur introuvables', 'failure', null, 'Cookies');
        }
    } else {
        log("Cookies déjà chargés", 'failure', cookies, 'Cookies');
    }
}