class IfoodController {
  static verify(tripReference) {
    return new Promise((resolve, reject) => {
      fetch(`${API_HOST_IFOOD}code-is-necessary/${tripReference}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("✅ iFood verificação: código necessário");

            resolve({
              status: true,
              code: true,
              message: "Código iFood necessário",
            });
          } else {
            console.log("ℹ️ iFood verificação: código não necessário");
            reject(new Error("Código iFood não necessário"));
          }
        })
        .catch((error) => {
          console.error(
            "❌ Erro ao verificar necessidade de código iFood:",
            error
          );
          reject(error);
        });
    });
  }

  static validateCode(tripReference, code) {
    return new Promise((resolve, reject) => {
      fetch(`${API_HOST_IFOOD}validate-code/${code}/${tripReference}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.status === 201) {
            console.log("✅ iFood código validado com sucesso (status 201)");
            resolve({
              status: true,
              response: "Código validado com sucesso!",
            });
            return;
          }

          console.log(
            "❌ iFood código inválido (status:",
            response.status,
            ")"
          );

          response
            .json()
            .then((data) => {
              resolve({
                status: false,
                response:
                  data?.message
                    ? data.message
                    : "Código inválido. Por favor, verifique e tente novamente.",
              });
            })
            .catch((err) => {
              resolve({
                status: false,
                response:
                  "Código inválido. Por favor, verifique e tente novamente.",
              });
            });
        })
        .catch((error) => {
          console.error("❌ Erro ao validar código iFood:", error);
          reject({
            status: false,
            response:
              "Erro de conexão. Verifique sua internet e tente novamente.",
          });
        });
    });
  }

  static getSupport(tripReference) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestCentral(
        "contact-support",
        "GET",
        {
          tripReference: tripReference,
          app: `<nameapp></nameapp>`,
        },
        resolve,
        reject
      );
    });
  }
}
