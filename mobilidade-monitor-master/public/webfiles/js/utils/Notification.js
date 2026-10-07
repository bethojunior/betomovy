function sendPush(content , title = NAME_APP, icon = ICON_APP) {
    new Notification(
        title, {
            icon: icon,
            body: content,
        }
    );
}