import React, { FC, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { CoordinateInterface, EventList } from "../../../../@types/tripDetails";
import { useMapbox } from "../../../../contexts/mapbox";
import { ExpandButton, MapContainer, MapWrapper } from "./styles";

type FitBoundsInterface = [[number, number], [number, number]];

interface MapProps {
  boundsOrigin: [number, number] | undefined;
  boundsDestination: [number, number] | undefined;
  coordinate: CoordinateInterface;
  events: EventList;
}

const SOURCE_ID = "my-data";

const MapTrip: FC<MapProps> = ({
  boundsOrigin,
  boundsDestination,
  coordinate,
  events,
}) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [bound, setBound] = useState<FitBoundsInterface | undefined>();
  const [expanded, setExpanded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const { mapboxToken } = useMapbox();

  useEffect(() => {
    if (boundsOrigin && boundsDestination) {
      setBound([boundsOrigin, boundsDestination]);
    }
  }, [boundsOrigin, boundsDestination]);

  useEffect(() => {
    if (!mapboxToken || mapRef.current) return;

    mapboxgl.accessToken = mapboxToken;
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 15,
    });

    mapRef.current = mapInstance;

    mapInstance.on("load", () => {
      mapInstance.addSource(SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [] },
        },
      });
      mapInstance.addLayer({
        id: "route",
        type: "line",
        source: SOURCE_ID,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#a8a8a8", "line-width": 8 },
      });
    });

    setMap(mapInstance);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapboxToken]);

  // Mapbox precisa de resize após mudança de tamanho do container
  useEffect(() => {
    if (!map) return;
    const timeout = setTimeout(() => map.resize(), 50);
    return () => clearTimeout(timeout);
  }, [expanded, map]);

  // Trava o scroll da página no modo fullscreen
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  // ESC fecha o fullscreen
  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  useEffect(() => {
    if (!map || coordinate.length === 0) return;

    const applyCoordinates = () => {
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
      if (!source) return;
      source.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: coordinate },
      });
    };

    if (map.isStyleLoaded()) {
      applyCoordinates();
    } else {
      map.once("load", applyCoordinates);
    }
  }, [map, coordinate]);

  useEffect(() => {
    if (!map || !bound) return;

    if (map.isStyleLoaded()) {
      map.fitBounds(bound, { padding: 60 });
    } else {
      map.once("load", () => map.fitBounds(bound, { padding: 60 }));
    }
  }, [map, bound]);

  useEffect(() => {
    if (!map || events.length === 0) return;

    const addMarkers = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      events.forEach((event) => {
        if (!Array.isArray(event.position) || event.position.length < 2) return;

        const iconElement = document.createElement("div");
        iconElement.className = "marker";
        iconElement.style.backgroundImage = `url(${event.icon})`;
        iconElement.style.width = "30px";
        iconElement.style.height = "30px";
        iconElement.style.backgroundSize = "100%";

        const m = new mapboxgl.Marker({ element: iconElement })
          .setLngLat([event.position[0], event.position[1]])
          .addTo(map);
        markersRef.current.push(m);
      });
    };

    if (map.isStyleLoaded()) {
      addMarkers();
    } else {
      map.once("load", addMarkers);
    }
  }, [map, events]);

  return (
    <MapWrapper $expanded={expanded}>
      <MapContainer ref={mapContainerRef} />
      <ExpandButton
        $expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        title={expanded ? "Sair do fullscreen (ESC)" : "Expandir mapa"}
      >
        {expanded ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
      </ExpandButton>
    </MapWrapper>
  );
};

export default MapTrip;
