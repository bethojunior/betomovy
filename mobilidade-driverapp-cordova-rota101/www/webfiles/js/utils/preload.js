function preload(status) {
    if (status) {
        document.getElementById("preloadLogin").style.display = "block";
        if (typeof displayAppVersion === "function") {
            displayAppVersion("preloader-version");
        }
        return;
    }
    document.getElementById("preloadLogin").style.display = "none";
}

function preloadGlobal(status){
    if (status) {
        document.getElementById("preloadGlobal").classList.add("active");
        return;
    }
    document.getElementById("preloadGlobal").classList.remove("active");
}

const EMPTY_APP_VERSION = "";

function setAppVersion(version) {
    const safeVersion = typeof version === "string" ? version : EMPTY_APP_VERSION;
    Session.set("appVersion", safeVersion);
    displayVersionInElement("preloader-version", safeVersion);
}

if (typeof cordova !== 'undefined' && cordova.getAppVersion) {
    cordova.getAppVersion.getVersionNumber(
        function (version) {
            setAppVersion(version);
        },
        function () {
            setAppVersion(EMPTY_APP_VERSION);
        }
    );
} else {
    setAppVersion(EMPTY_APP_VERSION);
}

function displayVersionInElement(elementId, version) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = version ? `versão - ${version}` : "";
    }
}

function displayAppVersion(elementId) {
    const storedVersion = Session.get("appVersion");
    const version =
        typeof storedVersion === "string" && storedVersion.length > 0
            ? storedVersion
            : EMPTY_APP_VERSION;

    displayVersionInElement(elementId, version);
}
