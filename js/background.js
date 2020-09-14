var regExTimTec = /(http)s?(:\/\/)+(cursos\.timtec\.com\.br\/course\/.*\/lesson).*/i
var regExBlocked = /chrome:.*/i

var activeAutomations = new Set();

function toggleAutomacao(tab) {
    if (tab.url.match(regExTimTec)) {
        if (activeAutomations.has(tab.id)) {
            activeAutomations.delete(tab.id);
            chrome.tabs.sendMessage(tab.id, {action: "automacao", status: "off", toggle: true});
        } else {
            activeAutomations.add(tab.id);
            chrome.tabs.sendMessage(tab.id, {action: "automacao", status: "on", toggle: true});
        }     
    } else {
        if (!tab.url.match(regExBlocked)) {
            chrome.tabs.executeScript({code: `alert("Utilizar somente em aulas TimTec!!");`});        
        }
    }
}

function ativarEmNovaPagina(tab) {
    if (tab.url.match(regExTimTec) && activeAutomations.has(tab.tabId)) {
        activeAutomations.add(tab.tabId);
        chrome.tabs.sendMessage(tab.tabId, {action: "automacao", status: "on", toggle: false});
    }
}

chrome.browserAction.onClicked.addListener(toggleAutomacao);
chrome.webNavigation.onReferenceFragmentUpdated.addListener(ativarEmNovaPagina);
chrome.webNavigation.onCompleted.addListener(ativarEmNovaPagina);


