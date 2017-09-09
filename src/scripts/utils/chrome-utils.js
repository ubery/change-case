export {
    onMessage,
    sendMessage,
    sendToContent,
    createMenu
}

const validType = type => {
    if (typeof type !== 'string') {
        throw 'message needs type';
    }
}

function onMessage(type, callback) {
    validType(type);
    chrome.runtime.onMessage.addListener(
        (request, sender, response) => {
            if (request.type !== type) return;
            callback(request.data, sender, response);
        }
    )
}

function sendMessage(spec) {
    if (!spec) {
        return;
    }
    let { type, data, callback } = spec;
    validType(type);

    chrome.runtime.sendMessage({
        type, data
    }, callback);
}

function sendToContent(spec) {
    if (!spec) {
        return;
    }
    let { id, type, data, callback } = spec;
    validType(type);

    let send = tabId =>
        chrome.tabs.sendMessage(
            tabId, {
                type,
                data
            }, callback
        );

    if (typeof id === 'number') {
        send(id);
    } else {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, tabs => {
            send(tabs[0].id);
        });
    }
}

function createMenu(items, callback, defaults) {
    items.forEach(item => {
        let params;

        if (item === null) {
            params = {
                type: 'separator'
            }
        } else {
            params = callback(item);
        }
        if (defaults) {
            params = Object.assign({},
                defaults,
                params
            );
        }
        chrome.contextMenus.create(params);
    })
}