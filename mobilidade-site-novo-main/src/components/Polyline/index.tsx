import { Layer, Source } from "react-map-gl";
import { Position } from "geojson";

type PolylineData = Position[];

interface PolylineProps {
  data: PolylineData;
  width: number;
  color: string;
  opacity: number;
}

// Função para converter as coordenadas em formato GeoJSON
const generateGeoJSON = (data: PolylineData) => ({
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: data,
  },
});

export const Polyline = ({ data, width, color, opacity }: PolylineProps) => {
  return (
    <Source type="geojson" data={generateGeoJSON(data) as any}>
      <Layer
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
        }}
      />
    </Source>
  );
};
