import { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";
import Utils from "../../utils/Utils";

interface RouteProps {
  polyline: string;
}

export const Route = ({ polyline }: RouteProps) => {
  const [coordinates, setCoordinates] = useState<number[][]>([]);

  useEffect(() => {
    if (polyline) {
      const decodePolyline = Utils.decodePolyline(polyline);
      setCoordinates(decodePolyline);
    }
  }, [polyline]);

  return (
    <Source
      id="map-source"
      {...{
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      }}
    >
      <Layer
        type="line"
        layout={{
          "line-cap": "round"
        }}
        paint={{
          "line-color": "#888",
          "line-width": 8,
        }}
        source="route"
      />
    </Source>
  );
};
