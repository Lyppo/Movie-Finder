const DEBUG = false;

const EMOJIS = {
    log: '📝',
    warn: '⚠️',
    error: '🔥',
    success: '✅',
    failure: '❌',
    request: '📡',
    add: '➕',
    remove: '➖',
    cookies: '🍪',
    create: '🛠️',
    delete: '🗑️',
};

const STYLES = {
    log: {r: '34', g: '170', b: '255'}, // Bleu clair
    warn: {r: '255', g: '255', b: '0'}, // Jaune
    error: {r: '255', g: '0', b: '0'}, // Rouge
    success: {r: '0', g: '200', b: '0'}, // Vert foncé
    failure: {r: '200', g: '0', b: '0'}, // Rouge foncé
    request: {r: '0', g: '150', b: '255'}, // Bleu réseau
    add: {r: '0', g: '200', b: '150'}, // Vert turquoise
    remove: {r: '200', g: '100', b: '0'}, // Orange
    cookies: {r: '150', g: '75', b: '0'}, // Marron (cookie)
    create: {r: '0', g: '200', b: '255'}, // Bleu cyan (création)
    delete: {r: '150', g: '0', b: '150'}, // Violet (suppression)
};

const NEEDS = [
    'log',
    'setup',
    'loged',
    'test',
    'requestAuth',
    'openPopup',
    'load',
    'request',
    'loadImage',
    'logoutClear',
];

const LOAD = true;