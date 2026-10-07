class Helper {
  static transformSecondsToMinutes(seconds: number) {
    if (!seconds) {
      return "";
    }
    if (seconds <= 60) {
      return `00:${seconds}`;
    }
    const minutes = Math.floor(seconds / 60);
    const secondsRest = seconds % 60;
    return `${minutes}:${String(secondsRest)?.padStart(2, "0")}`;
  }

  static diffSeconds = (start: string) => {
    if (!start) return null;
    const dateStartTripParse = new Date(start);
    const dateNow = new Date();

    const diff = (dateNow.getTime() - dateStartTripParse.getTime()) / 1000;
    return diff.toFixed(0);
  };

  static emailValidation = (email: string): boolean => {
    const usuario = email.substring(0, email.indexOf("@"));
    const dominio = email.substring(email.indexOf("@") + 1, email.length);

    return (
      usuario.length >= 1 &&
      dominio.length >= 3 &&
      usuario.indexOf("@") === -1 &&
      dominio.indexOf("@") === -1 &&
      usuario.indexOf(" ") === -1 &&
      dominio.indexOf(" ") === -1 &&
      dominio.indexOf(".") !== -1 &&
      dominio.indexOf(".") >= 1 &&
      dominio.lastIndexOf(".") < dominio.length - 1
    );
  };

  static phoneMask = (string: string) => {
    const phone = string?.replace(/\D/g, "") ?? "";

    if (phone.length === 9) {
      // Número sem DDD (ex: 98765-4321)
      return phone.replace(/(\d{5})(\d{4})/, "$1-$2");
    } else if (phone.length === 11) {
      // Número com DDD (ex: (11) 98765-4321)
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };
  static formatPhoneNumber(phoneNumber: string) {
    if (!phoneNumber.startsWith("55")) {
      phoneNumber = "55" + phoneNumber;
    }
    return phoneNumber;
  }
}

export default Helper;
