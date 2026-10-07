export default function notifyMe(text) {
    if (!("Notification" in window)) {
        return console.log("O seu browser não suporta notificação");
    }

    if (Notification.permission === "granted") {
        var notification = new Notification(text);
    } else if (Notification.permission !== "denied") {
        return Notification.requestPermission(permission => {
            if (permission === "granted") {
                var notification = new Notification(text);
            }
        });
    }
}
