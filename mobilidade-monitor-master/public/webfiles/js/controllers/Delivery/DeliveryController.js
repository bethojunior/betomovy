class DeliveryController {
  static getConfigs() {
    return new Promise((resolve) => {
      ConnectionServer.sendRequest(
        "deliveryConfigAdmin",
        "GET",
        null,
        resolve,
        undefined,
        true
      );
    });
  }

  static editConfigs(data) {
    return new Promise((resolve) => {
      ConnectionServer.sendRequest(
        "deliveryConfigAdmin",
        "POST",
        data,
        resolve,
        undefined,
        true
      );
    });
  }
}
