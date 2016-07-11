function setLocalesAll() {
    var es = document.querySelectorAll('.i18n')
    Array.prototype.slice.call(es).forEach(setLocales)
}

function setLocales(node) {
    var name = null
    if (node.nodeName == 'INPUT' && (node.type == 'submit' || node.type == 'button')) {
        name = node.value.toLocaleLowerCase()
    }
    else {
        name = node.innerHTML.toLocaleLowerCase()
    }
    var message = chrome.i18n.getMessage(name)
    if (message) {
        if (node.nodeName == 'INPUT' && (node.type == 'submit' || node.type == 'button')) {
            node.value = message
        }
        else {
            //node.innerText = message
            node.innerHTML = message
        }
    }
}

