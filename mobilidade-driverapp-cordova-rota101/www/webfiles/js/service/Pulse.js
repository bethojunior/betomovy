class Pulse {
    endpoint = "https://api-pulse.704app.com.br/logs";
    app;
    groupId;

    constructor(app, groupId) {
        this.app = app;
        this.groupId = groupId;
    }

    send(message, context, type = "error") {
        const request = new XMLHttpRequest();

        if (!["error", "warn", "info", "debug", "critical"].includes(type)) {
            type = "info";
        }

        request.timeout = 60000;

        request.open("POST", this.endpoint);
        request.setRequestHeader("Content-Type", "application/json");

        const logData = {
            app: this.app,
            groupId: this.groupId,
            context: context,
            type: type,
            message: message,
        };

        request.send(JSON.stringify(logData));
    }
}
