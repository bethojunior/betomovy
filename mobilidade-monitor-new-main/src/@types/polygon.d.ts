export interface IPolygonCoordinate {
  lat: number;
  lng: number;
}

export interface IPolygonParser {
  parse(polygon: string): IPolygonCoordinate[];
}
