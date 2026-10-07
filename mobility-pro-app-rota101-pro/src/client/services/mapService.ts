import {encode, decode} from '@googlemaps/polyline-codec';

class MapService {
  // Decodifica uma polyline e retorna ela com um array de objeto ou uma matrix. Retorno de "matrix" por default é false.
  static decodePolyline(
    polylineEncoded: string,
    matrix = false,
    names: string[] = [],
  ) {
    const name = names.length == 2 ? names : ['latitude', 'longitude'];

    if (matrix) {
      return polylineEncoded;
    }

    return decode(polylineEncoded).map(item => {
      return {[name[0]]: item[0], [name[1]]: item[1]};
    });
  }

  // Codifica uma polyline e retorna esse dado codificado. Caso receba um array de objetos é transformado em matrix para codificar, caso ja venha uma matrix, eu só codifico.

  static encondePolyline = (polyline: any) => {
    let data = polyline;
    let condition = false;

    if (Array.isArray(data) && data.length > 0) {
      condition = Array.isArray(data[0]);
    } else {
      return false;
    }

    if (!condition) {
      data = data.map(coords => {
        const values = Object.values(coords);
        return [values[0], values[1]];
      });
    }

    return encode(data);
  };
}

export default MapService;
