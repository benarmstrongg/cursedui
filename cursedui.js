// @ts-check

const w = window;
const stateMap = {};
const cache = {};

// @ts-ignore
w.cre = document.body;

// @ts-ignore
w.component = function (initFn) {
    // @ts-ignore
    const rootElem = document.createElement(initFn.name || w.component.caller?.name || 'component');
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
        const isComponent = typeof type === 'function';
        const tagName = isComponent ? (type.name || 'nestedcomponent') : type;

        const subcomponentKey = `${tagName}-${currentRenderLevel}-${lastRenderLevel}-${renderFn.toString()}`;
        // @ts-ignore
        let elem = createElement.subcomponents?.get(subcomponentKey);
        // @ts-ignore
        if (isComponent && !elem) {
            elem = type();
            // @ts-ignore
            createElement.subcomponents ??= new Map();
            // @ts-ignore
            createElement.subcomponents.set(subcomponentKey, elem);
        }
        elem ??= document.createElement(tagName);

        currentRenderLevel++;
        // @ts-ignore
        elem.render = () => createElement(tagName, renderFn);
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
        const children = [...(rootElem.children || [])]
        // @ts-ignore
        w.cre = rootElem;
        for (const child of children) {
            if (child.rerender) {
                child.remove();
                child.rerender();
            }
            else if (child.render) {
                child.remove();
                child.render();
            }
        }
        // @ts-ignore
        w.cre = document.body;
    };
    // @ts-ignore
    w.cre = document.body;
    return rootElem;
}

function detectChanges() {
    for (const prop in stateMap) {
        if (prop in w && prop in cache && w[prop] !== cache[prop]) {
            const elem = stateMap[prop];
            cache[prop] = w[prop];
            elem.render && elem.render();
            elem.rerender();
        }
    }
    requestAnimationFrame(detectChanges);
}
requestAnimationFrame(detectChanges);