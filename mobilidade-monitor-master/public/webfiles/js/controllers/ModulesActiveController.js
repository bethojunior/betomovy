class ModulesActiveController  {
  static findAll() {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        "appModule",
        "GET",
        null,
        resolve,
        reject,
        true
      );
    });
  }

  static update(payload) {
    return ConnectionServer.sendRequestWithFiles("appModule/update", "POST", payload, true)
  }
}
