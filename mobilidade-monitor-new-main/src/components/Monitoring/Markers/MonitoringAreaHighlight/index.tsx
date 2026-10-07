import { Layer, Source } from "react-map-gl";

interface AreaPoint {
  lat: number;
  lng: number;
}

type MonitoringAreaHighlightProps = {
  area: AreaPoint[];
}

export const MonitoringAreaHighlight = ({ area }: MonitoringAreaHighlightProps) => {
  if (!area || area.length === 0) {
    return null;
  }

  // Converter coordenadas para formato [lng, lat] e fechar o polígono
  const coordinates = area.map((point) => [Number(point.lng), Number(point.lat)]);
  // Fechar o polígono adicionando o primeiro ponto no final
  const closedCoordinates = [...coordinates, coordinates[0]];

  const dataLayer: any = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [closedCoordinates]
    }
  };

  return (
    <>
      <Source id="monitoring-area-polygon" type="geojson" data={dataLayer}>
        <Layer
          id="monitoring-area-fill"
          type="fill"
          source="monitoring-area-polygon"
          paint={{
            "fill-color": "#1677ff",
            "fill-opacity": 0.2
          }}
        />
        <Layer
          id="monitoring-area-outline"
          type="line"
          source="monitoring-area-polygon"
          layout={{
            "line-join": "round",
            "line-cap": "round"
          }}
          paint={{
            "line-color": "#1677ff",
            "line-width": 3
          }}
        />
      </Source>
    </>
  );
};


