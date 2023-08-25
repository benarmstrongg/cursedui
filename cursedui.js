// @ts-check

const w = window;
const stateMap = {};
const cache = {};

// @ts-ignore
w.cre = document.body;

// @ts-ignore
w.component = (initFn) => {
    const rootElem = document.createElement(initFn.name || 'component');
    // @ts-ignore
    const isNested = w.cre !== document.body;
    // @ts-ignore
    w.cre.append(rootElem);
    // @ts-ignore
    w.cre = rootElem;
    rootElem.id = Math.ceil(Math.random() * 100_000);

    let currentParentElem = rootElem;
    let lastRenderedElem = rootElem;
    let currentRenderLevel = 0;
    let lastRenderLevel = 0;

    function createElement(type, renderFn) {
        const elem = document.createElement(type);
        currentRenderLevel++;
        elem.render = () => createElement(type, renderFn);
        if (currentRenderLevel > lastRenderLevel) {
            currentParentElem.append(elem);
            currentParentElem = elem;
        }
        else if (currentRenderLevel === lastRenderLevel) {
            currentParentElem = lastRenderedElem.parentElement;
            currentParentElem.append(elem);
        }
        lastRenderLevel = currentRenderLevel;
        lastRenderedElem = elem;
        renderFn(elem);
        currentRenderLevel--;
        if (currentRenderLevel === 0) {
            lastRenderLevel = 0;
            lastRenderedElem = rootElem;
            currentParentElem = rootElem;
        }
        return elem;
    }


    stateMap[rootElem.id] = [];
    const originalKeys = Object.keys(w);
    initFn(createElement);
    const newKeys = Object.keys(w).filter(k => !originalKeys.includes(k));
    for (const prop of newKeys) {
        if (!stateMap[prop]) {
            stateMap[prop] = rootElem;
            stateMap[rootElem.id].push(prop);
            cache[prop] = w[prop];
        }
    }

    rootElem.rerender = () => {
        if (isNested && !document.getElementById(rootElem.id)) {
            // @ts-ignore
            w.cre.append(rootElem);
        }

        const children = [...(rootElem.children || [])]
        // @ts-ignore
        w.cre = rootElem;
        for (const child of children) {
            if (child.render) {
                child.remove();
                child.render();
            }
            else if (child.rerender) {
                child.remove();
                child.rerender();
            }
        }

        if (isNested) {
            for (const prop of stateMap[rootElem.id]) {
                w[prop] = cache[prop];
            }
        }
        // @ts-ignore
        w.cre = document.body;
    };
    // @ts-ignore
    w.cre = document.body;
}

function detectChanges() {
    for (const prop in stateMap) {
        if (prop in w && prop in cache && w[prop] !== cache[prop]) {
            const elem = stateMap[prop];
            cache[prop] = w[prop];
            elem.rerender();
        }
    }
    requestAnimationFrame(detectChanges);
}
requestAnimationFrame(detectChanges);