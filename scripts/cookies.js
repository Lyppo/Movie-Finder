let cookies = {};

let ACCOUNT_ID = "";
let ACCESS_TOKEN = "";
let SESSION_ID = "";

async function getCookies() {

    if (!document.cookie) {
        return;
    }

    cookies = {};
    let cookiesArray = document.cookie.split('; ');

    for (let i = 0; i < cookiesArray.length; i++) {
        let [name, value] = cookiesArray[i].split('=');
        if (name) {
            cookies[name] = decodeURIComponent(value);
        }
    }
}

async function setCookie(name, value) {

    if (!name || !value) {
        return;
    }

    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${2592000}; path=/`;
    cookies[name] = value;
}

async function clearCookie(name) {

    if (!cookies[name]) {
        return;
    }

    document.cookie = `${name}=; max-age=0; path=/`;
    delete cookies[name];

    console.table(cookies);
}

async function load() {

    if (!ACCESS_TOKEN) {
        
        await getCookies();

        ACCESS_TOKEN = cookies["ACCESS_TOKEN"];
        ACCOUNT_ID = cookies["ACCOUNT_ID"];
        SESSION_ID = cookies["SESSION_ID"];
    }
}