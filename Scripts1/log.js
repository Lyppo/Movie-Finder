async function log(message, type = 'log', data = null, name = null) {

    if (!DEBUG && type !== 'error' && type !== 'warn') return;

    let msg = "%c" + (EMOJIS[type] || EMOJIS['log']) + " ";

    if (name) msg += `[${name.toUpperCase()}] `;

    msg += message;

    const color = STYLES[type] || STYLES['log'];

    let style = `color: rgb(${color.r}, ${color.g}, ${color.b}); background-color: rgba(${color.r}, ${color.g}, ${color.b}, 0.25); font-weight: bold; padding: 2px 5px 2px 3px; border-radius: 5px; border: 1px solid rgba(${color.r}, ${color.g}, ${color.b}, 0.5); text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000`;

    console[type] ? console[type](msg, style) : console.log(msg, style);

    if (data) console.table(data);
}