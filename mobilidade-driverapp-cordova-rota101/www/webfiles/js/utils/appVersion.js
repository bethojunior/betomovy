const APP_VERSION_FALLBACK = "";
const pulse = new Pulse(`${appName}_${PULSE_APP}`, PULSE_GROUPID_PRODUCTION);

function setAppVersion(version) {
    const safeVersion = typeof version === "string" ? version : APP_VERSION_FALLBACK;
    Session.set("appVersion", safeVersion);
    displayVersionInElement("preloader-version", safeVersion);
}
 
// Iniciar busca da versão do app
function initAppVersion() {
    if (typeof cordova !== "undefined" && cordova.getAppVersion) {
        cordova.getAppVersion.getVersionNumber(
            function (version) {
                setAppVersion(version);
            },
            function (error) {
                pulse.send('error', 'Falha ao capturar versão do app', 'appVersion.js');
                setAppVersion(APP_VERSION_FALLBACK);
            }
        );
    } else {
        pulse.send('warning', 'Cordova não disponível para capturar versão', 'appVersion.js');
        setAppVersion(APP_VERSION_FALLBACK);
    }
}

// Exibir a versão em qualquer elemento
function displayVersionInElement(elementId, version) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = version ? `versão - ${version}` : "";
    }
}

// Exibir a versão em qualquer tela
function displayAppVersion(elementId) {
    const storedVersion = Session.get("appVersion");
    const version = 
        typeof storedVersion === "string" && storedVersion.length > 0
            ? storedVersion
            : APP_VERSION_FALLBACK;

        displayVersionInElement(elementId, version);
}
