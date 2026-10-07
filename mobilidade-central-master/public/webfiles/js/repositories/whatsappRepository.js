class WhatsAppRepository {
  static initSession(params) {
    return new Promise((resolve, reject) => {
      ConnectionServer.requestApiWhatsApp(
        "whatsapp/session",
        `POST`,
        params,
        resolve,
        reject,
        "text"
      );
    });
  }

  static removeSession(sessionName) {
    return new Promise((resolve, reject) => {
      ConnectionServer.requestApiWhatsApp(
        "whatsapp/session/" + sessionName,
        `DELETE`,
        {},
        resolve,
        reject
      );
    });
  }

  static dispatchMessage(params) {
    return new Promise((resolve, reject) => {
      ConnectionServer.requestApiWhatsApp(
        "whatsapp/send-message",
        `POST`,
        params,
        resolve,
        reject
      );
    });
  }

  static createReference(params) {
    return new Promise((resolve, reject) => {
      ConnectionServer.requestApiWhatsApp(
        "session/reference",
        `POST`,
        params,
        resolve,
        reject
      );
    });
  }


  static fetchMyGroups(sessionName) {
    return new Promise((resolve, reject) => {
      ConnectionServer.requestApiWhatsApp(
        `whatsapp/get-my-groups?sessionName=${sessionName}`,
        `GET`,
        {},
        resolve,
        reject
      );
    });
  }

  static sendMessageToGroup(params) {
    return new Promise((resolve, reject) => {
      ConnectionServer.requestApiWhatsApp(
        `whatsapp/send-message-group`,
        `POST`,
        params,
        resolve,
        reject
      );
    });
  }
}
