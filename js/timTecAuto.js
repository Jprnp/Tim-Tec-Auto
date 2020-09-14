var initialScript = `
    var interval; 
    var automationActive = false;

    clearInterval(interval);

    function autoCompleteLesson() {
            var scope = angular.element(document.getElementsByClassName("btn-success")[1]).scope();
        
            if (scope.$$phase != "$digest" && scope.section != "end") {
                scope.$apply(function () {
                    scope.nextStep();
                });
            }
        
            if (scope.section == "end") {
                clearInterval(interval);
            }
    }
`;

var initialScriptElement = document.createElement('script');
initialScriptElement.textContent = initialScript;
(document.head || document.documentElement).appendChild(initialScriptElement);

chrome.runtime.onMessage.addListener(incomingMessage);

function incomingMessage(message, sender, sendResponse) {
    let toggleScript;

    if (message.action == "automacao") {
        switch (message.status) {       
            case "on":
                if (message.toggle) {
                    toggleScript = `alert("Automação ativada!")`;
                }

                toggleScript += `
                if (!automationActive) {
                    automationActive = true;
                    interval = setInterval(autoCompleteLesson,  0500);
                }
                `;
                break;
            case "off":
                if (message.toggle) {
                    toggleScript = `alert("Automação desativada!")`;
                }

                toggleScript += `
                if (automationActive) {
                    clearInterval(interval);
                    automationActive = false;
                }
                 `;
                break;
        }

        if (toggleScript) {
            let toggleScriptElement = document.createElement('script');
            toggleScriptElement.textContent = toggleScript;
            (document.head || document.documentElement).appendChild(toggleScriptElement);
            toggleScriptElement.remove();
        }
    }
}