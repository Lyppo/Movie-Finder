async function log(message, type = 'log', data = null, name = null) {

    if (!DEBUG && type !== 'error' && type !== 'warn') return;

    let msg = "%c" + (EMOJIS[type] || "") + " ";

    if (name) msg += `[${name.toUpperCase()}] `;

    msg += message;

    let style = (STYLES[type] || STYLES['log']) + "font-weight: bold;";

    console[type] ? console[type](msg, style) : console.log(msg, style);

    if (data) console.table(data);
}