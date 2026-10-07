import { isPossiblePhoneNumber } from "libphonenumber-js/mobile";
import api from "../services/api";
class Utils {
  static formatDateFromBackend(date: string): string {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  static formatDateToBackend(date: string | undefined): string {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }
  static removeAccent(text: string): string {
    let newText = text.toLocaleLowerCase();
    newText = newText.replace(new RegExp("\\s", "g"), "");
    newText = newText.replace(new RegExp("[àáâãäå]", "g"), "a");
    newText = newText.replace(new RegExp("æ", "g"), "ae");
    newText = newText.replace(new RegExp("ç", "g"), "c");
    newText = newText.replace(new RegExp("[èéêë]", "g"), "e");
    newText = newText.replace(new RegExp("[ìíîï]", "g"), "i");
    newText = newText.replace(new RegExp("ñ", "g"), "n");
    newText = newText.replace(new RegExp("[òóôõö]", "g"), "o");
    newText = newText.replace(new RegExp("œ", "g"), "oe");
    newText = newText.replace(new RegExp("[ùúûü]", "g"), "u");
    newText = newText.replace(new RegExp("[ýÿ]", "g"), "y");
    newText = newText.replace(new RegExp("\\W", "g"), "");
    return newText;
  }

  static normalizeText(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  static checkIfPhoneNumberIsValid(number: string): boolean {
    if (/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/.test(number)) {
      return true;
    }

    // número com DDI (Mask.setMaskPhoneValue formata via libphonenumber-js
    // nesse caso, então não bate mais com o formato brasileiro acima)
    const digits = (number || "").replace(/\D/g, "");
    if (digits.length > 11) {
      return isPossiblePhoneNumber(`+${digits}`);
    }

    return false;
  }

  static checkIfEmailIsValid(email: string): boolean {
    if (
      /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)
    ) {
      return true;
    }
    return false;
  }

  static checkNameUser(name: string): boolean {
    const fullNameArr = name.split("");
    const space = " ";
    let firstName: string | string[] = "";
    if (fullNameArr.includes(space)) {
      for (let i = 0; i < fullNameArr.length; i++) {
        if (!firstName.includes(space)) {
          firstName += fullNameArr[i];
        }
      }
    }

    firstName = fullNameArr.splice(0, firstName.length);
    const lastName = fullNameArr;
    if (
      firstName.length > 3 &&
      firstName.length <= 21 &&
      lastName.length >= 3 &&
      lastName.length <= 20 &&
      lastName.includes(space) === false
    ) {
      return true;
    }
    return false;
  }

  static checkURLIsValid(str: string) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  }

  static transformDate(valueDate: string, showTime: boolean = true) {
    if (valueDate.length > 0) {
      const [datePart, timePart] = valueDate.split(" ");

      const [day, month, year] = datePart.split("/");

      if (showTime) {
        const newDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )} ${timePart}`;

        return newDate;
      } else {
        const newDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;

        return newDate;
      }
    }
  }

  static checkCpfIsValue(value: any) {
    let sum;
    let rest;
    sum = 0;

    const cpfWithoutPoints = value.replaceAll(".", "");
    const cpfFormated = cpfWithoutPoints.replace("-", "");

    const valueCpf = cpfFormated;

    if (valueCpf === "00000000000") return false;
    for (let i = 1; i <= 9; i++)
      sum += parseInt(valueCpf.substring(i - 1, i)) * (11 - i);

    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(valueCpf.substring(9, 10))) return false;

    sum = 0;

    for (let i = 1; i <= 10; i++)
      sum += parseInt(valueCpf.substring(i - 1, i)) * (12 - i);

    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(valueCpf.substring(10, 11))) return false;
    return true;
  }

  static checkIfCNPJIsValid(value: string) {
    if (!value) return false;

    const isString = typeof value === "string";
    const validTypes =
      isString || Number.isInteger(value) || Array.isArray(value);

    if (!validTypes) return false;

    if (isString) {
      if (value.length > 18) return false;

      const digitsOnly = /^\d{14}$/.test(value);
      const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(value);

      if (digitsOnly || validFormat) true;
      else return false;
    }

    const match = value.toString().match(/\d/g);
    const numbers = Array.isArray(match) ? match.map(Number) : [];

    if (numbers.length !== 14) return false;

    const calc = (x: number) => {
      const slice = numbers.slice(0, x);
      let factor = x - 7;
      let sum = 0;

      for (let i = x; i >= 1; i--) {
        const n = slice[x - i];
        sum += n * factor--;
        if (factor < 2) factor = 9;
      }

      const result = 11 - (sum % 11);

      return result > 9 ? 0 : result;
    };

    const digits = numbers.slice(12);

    const digit0 = calc(12);
    if (digit0 !== digits[0]) return false;

    const digit1 = calc(13);
    return digit1 === digits[1];
  }

  static isMobile(): boolean {
    let check = false;
    (function checkIfIsMobile(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
      return "";
    })(navigator.userAgent || navigator.vendor);
    return check;
  }

  static NumberToBrl(value: number): string {
    return value.toFixed(2).replace(".", ",");
  }

  static BrlToNumber(money: string, negative: "positive" | "negative") {
    return negative === "negative"
      ? -Number(money.replace(/\./g, "").replace(",", "."))
      : Number(money.replace(/\./g, "").replace(",", "."));
  }

  static BrlToNumberUpdate(money: string, negative: "positive" | "negative") {
    if (typeof money !== "string") {
      throw new Error("O valor passado para money precisa ser uma string.");
    }

    money = money.replace(/[^\d,.-]/g, "");

    money = money.replace(",", ".");

    const numberValue = parseFloat(money);

    if (isNaN(numberValue)) {
      throw new Error("Valor de dinheiro inválido.");
    }

    return negative === "negative" ? -numberValue : numberValue;
  }

  static CenterCoordinates(coordinates: any) {
    if (coordinates.length === 0) {
      return null;
    }

    if (coordinates.length === 1) {
      return coordinates;
    }

    let totalLatitude = 0;
    let totalLongitude = 0;

    for (const [latitude, longitude] of coordinates) {
      totalLatitude += latitude;
      totalLongitude += longitude;
    }

    const centerLatitude = totalLatitude / coordinates.length;
    const centerLongitude = totalLongitude / coordinates.length;

    return [centerLatitude, centerLongitude];
  }

  static getCenterCoordinates(arr: any) {
    let minX: any, maxX: any, minY: any, maxY: any;
    for (let i = 0; i < arr.length; i++) {
      let x = arr[i].lat,
        y = arr[i].lng;
      minX = x < minX || minX == null ? x : minX;
      maxX = x > maxX || maxX == null ? x : maxX;
      minY = y < minY || minY == null ? y : minY;
      maxY = y > maxY || maxY == null ? y : maxY;
    }
    return { lat: (minX + maxX) / 2, lng: (minY + maxY) / 2 };
  }

  static getCircleCoordinates = (
    center: [number, number],
    radius: number,
    numPoints: number = 512
  ) => {
    const coordinates = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 360) / numPoints;
      const radians = (angle * Math.PI) / 180;
      const lng = center[0] + (radius / 111320) * Math.cos(radians);
      const lat = center[1] + (radius / 110540) * Math.sin(radians);
      coordinates.push({ lat, lng });
    }
    coordinates.push(coordinates[0]);
    return coordinates;
  };

  static newGetCircleCoordinates = (
    center: [number, number],
    radius: number,
    numPoints: number = 512
  ) => {
    const coordinates: [number, number][] = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 360) / numPoints;
      const radians = (angle * Math.PI) / 180;
      const lng = center[0] + (radius / 111320) * Math.cos(radians);
      const lat = center[1] + (radius / 110540) * Math.sin(radians);
      coordinates.push([lng, lat]);
    }

    coordinates.push(coordinates[0]);

    return coordinates;
  };

  static calculateRadiusFromCoordinates = (
    center: [number, number],
    pointOnPerimeter: [number, number]
  ) => {
    const lngDiff = Math.abs(center[0] - pointOnPerimeter[0]);
    const latDiff = Math.abs(center[1] - pointOnPerimeter[1]);
    const lngDistance = lngDiff * 111320;
    const latDistance = latDiff * 110540;
    const radius = Math.sqrt(
      Math.pow(lngDistance, 2) + Math.pow(latDistance, 2)
    );
    return radius;
  };

  static TransformCoordinates(coordinates: any, inverted: boolean = false) {
    const wktString = coordinates;
    const coordinatesString = wktString
      .replace("POLYGON((", "")
      .replace("))", "");

    const coordinatePairs = coordinatesString.split(",");

    const coordinateArray = coordinatePairs.map((pair: any) => {
      const [latitude, longitude] = pair.split(" ").map(Number);

      if (inverted) {
        return [longitude, latitude];
      }

      return [latitude, longitude];
    });

    return coordinateArray;
  }

  static pointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean {
    if (!polygon || polygon.length < 3) {
      return false;
    }

    let inside = false;
    const x = point.lng;
    const y = point.lat;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;

      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  static decodePolyline(encoded: string) {
    if (!encoded) {
      return [];
    }
    var poly = [];
    var index = 0,
      len = encoded.length;
    var lat = 0,
      lng = 0;

    while (index < len) {
      var b,
        shift = 0,
        result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      var p = [lng / 1e5, lat / 1e5];
      poly.push(p);
    }
    return poly;
  }

  static calculateAngleCentering(
    latitudeOld: number,
    longitudeOld: number,
    latitudeNew: number,
    ongitudeNew: number
  ): number {
    const dLat = latitudeNew - latitudeOld;
    const dLon = ongitudeNew - longitudeOld;

    const lonRad = dLon * (Math.PI / 180);

    const angle = Math.atan2(dLat, lonRad);

    const angleDegrees = (angle * 180) / Math.PI;

    return angleDegrees * -1;
  }

  static dateConvertToISO8601(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const iso8601String = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}T${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return iso8601String;
  }

  static dataURLtoFile(dataurl: any, filename: string) {
    if (dataurl.length > 0) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  }

  static setOnlyNumber(value: string) {
    return value.replace(/[^0-9]/g, "");
  }

  static bytesToKb(value: number) {
    return (value / 1024).toFixed(2);
  }

  static getPathByPolygon(stringPolygon: string | null | undefined) {
    if (!stringPolygon || typeof stringPolygon !== 'string') {
      return [];
    }

    stringPolygon = stringPolygon.replace("POLYGON((", "").replace("))", "");

    return stringPolygon.split(",").map((locationString) => {
      const location = locationString.split(" ");

      return { lat: parseFloat(location[0]), lng: parseFloat(location[1]) };
    });
  }

  static convertStringToNumber(value: string) {
    const number = parseFloat(value);

    if (!isNaN(number)) {
      return number;
    } else {
      return "N/A";
    }
  }

  static async convertUrlToFile(link: string) {
    try {
      const response = await fetch(link);
      const blob = await response.blob();
      const file = new File([blob], "default", { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error downloading the image:", error);
      throw error;
    }
  }

  static formatStringToKeyObject(str: string): string {
    function removerAcentos(text: string) {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    return removerAcentos(str).toLowerCase().replace(/\s+/g, "_");
  }

  static revertStringToOriginal(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  static formatTripDate = (dateString: string | undefined) => {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("pt-BR")}`;
  };

  static convertMinutesToHours(minutes: number | null): string {
    if (minutes === null || minutes === undefined) return "0:00";
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}min`;
    }
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }

  static formatTime(dateTime?: string | Date): string {
    if (!dateTime) return '00:00';
    
    const date = new Date(dateTime);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Capitaliza a primeira letra de uma string
   * @param str - String a ser capitalizada
   * @returns String com a primeira letra em maiúscula
   * 
   * @example
   * capitalizeFirstLetter("voutehomologar") // "Voutehomologar"
   * capitalizeFirstLetter("Fortaleza Movel") // "Fortaleza Movel"
   * capitalizeFirstLetter("") // ""
   */
  static capitalizeFirstLetter(str: string | undefined | null): string {
    if (!str || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const getSocketConfig = async () => {
  const response = await api.get("config");
  const socketConfig = response.data?.response?.find(
    (item: KeysAppProps) => item.type === "SOCKET"
  );
  return socketConfig;
};

export default Utils;
