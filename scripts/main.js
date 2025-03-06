async function waitToLoad() {
    while (typeof LOAD === 'undefined') {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }

    for (let name of NEEDS) {
        while (typeof window[name] === 'undefined') {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }
}

async function init() {

    await waitToLoad();

    setup();
}

init();