import { Layer, Map, Marker, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaCar, FaCircle } from "react-icons/fa";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";

interface DriverMapProps {
  lastPositions: {
    latitude: number;
    longitude: number;
    registered_at: string;
    deviceModel?: string;
  }[];
  focusPosition: { latitude: number; longitude: number } | null;
}

export const DriverMap = ({ lastPositions, focusPosition }: DriverMapProps) => {
  if (!lastPositions || lastPositions.length === 0) return null;
  const mapRef = useRef<any>(null);

  const sortedPositions = [...lastPositions].sort((a, b) =>
    dayjs(a.registered_at).isAfter(dayjs(b.registered_at)) ? 1 : -1
  );

  const latestPos = sortedPositions[sortedPositions.length - 1];

  const coordinates = sortedPositions.map((p) => [p.longitude, p.latitude]);

  const lineLayer: any = {
    id: "route",
    type: "line",
    source: "route",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#ff0000", "line-width": 4 },
  };

  useEffect(() => {
    if (focusPosition && mapRef.current) {
      mapRef.current.flyTo({
        center: [focusPosition.longitude, focusPosition.latitude],
        zoom: 15,
        speed: 1.2,
      });
    }
  }, [focusPosition]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Map
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoidGVzdGViYXlhbm1lZCIsImEiOiJjazd1d2U4OTMxNW9hM2lvNGI3cGFyaGVnIn0.Q4bC04l_8IU6HqONKXbcDA"
        initialViewState={{
          latitude: latestPos.latitude,
          longitude: latestPos.longitude,
          zoom: 14,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ position: "absolute", inset: 0 }}
      >
        <Source
          id="route"
          type="geojson"
          data={{
            type: "Feature",
            geometry: { type: "LineString", coordinates },
            properties: {},
          }}
        >
          <Layer {...lineLayer} />
        </Source>

        <Marker
          latitude={latestPos.latitude}
          longitude={latestPos.longitude}
          anchor="center"
        >
          <FaCar size={32} color="black" />
        </Marker>

        {sortedPositions.slice(0, -1).map((pos, idx) => (
          <Marker
            key={idx}
            latitude={pos.latitude}
            longitude={pos.longitude}
            anchor="center"
          >
            <FaCircle size={10} color="black" />
          </Marker>
        ))}
      </Map>
    </div>
  );
};
