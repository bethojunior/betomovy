class MilitaryForceController {
  static getAll() {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        "MilitaryForce/GetAll",
        "GET",
        null,
        resolve,
        reject
      );
    });
  }

  static graduations(militaryForceId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `MilitaryForce/Graduations?militaryForceId=${militaryForceId}`,
        "GET",
        null,
        resolve,
        reject
      );
    });
  }

  static status() {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        "MilitaryForce/Status",
        "GET",
        null,
        resolve,
        reject
      );
    });
  }
}
