async function getUnifiedAppName() {
    try {
        const appName = typeof NAME_PROJECT !== 'undefined' ? `${NAME_PROJECT}` : "";
        if (appName) {
            const appNameFormatted = appName.replace(/[^a-zA-Z0-9]/g, "");
            return appNameFormatted.toLowerCase();
        }
        return "";
    } catch (e) {
        return "";
    }
}

async function customJsonParse(responseText) {
    try {
        return JSON.parse(responseText || "{}");
    } catch (e) {
        return {};
    }
}

(async function () {
    const appName = await getUnifiedAppName();
    let context = "www/webfiles/js/utils/HttpInterceptor";

    const exclude = [
        "www/webfiles/js/utils/stack",
        "www/webfiles/js/utils/HttpInterceptor",
        "www/webfiles/js/service/ConnectionServer",
    ];

    const pulse = new Pulse(`${appName}_${PULSE_APP}`, PULSE_GROUPID);

    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        const isPulseApi = url.includes("https://api-pulse");
        const isSearchTrip = url.includes("Driver/searchTrip");
        const originStack = new Error().stack;

        this.addEventListener("readystatechange", async function () {
            const isRequestDone = this.readyState === 4;
            if (isPulseApi || !isRequestDone || isSearchTrip) return;

            const isError = this.status < 200 || this.status >= 300;
            const response = await customJsonParse(this.responseText || "{}");
            const message = `Erro ao acessar ${url} - ${this.status} ${this.statusText}`;

            if (isError || (this.status === 200 && response?.status === false)) {
                const originInfo = Stack.getOriginInfo(originStack, 0, exclude);
                context = originInfo?.file ?? context;

                pulse.send(response?.message ?? message, context, "error");
            }
        });

        return originalOpen.apply(this, [method, url, ...rest]);
    };
})();
