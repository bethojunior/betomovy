
import { Layer, Source } from "react-map-gl";

type CityDelimiterProps = {
	coordinates: number[][];
}
export const CityDelimiter = ({ coordinates }: CityDelimiterProps) => {
	const dataLayer: any = {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: coordinates.map((coordinate) => {
				if (!Array.isArray(coordinate) || coordinate.length < 2) return [0, 0];
				const a = coordinate[0];
				const b = coordinate[1];
				// GeoJSON expects [longitude, latitude]
				if (a < -30 && b > -35 && b < 35) {
					// a is longitude, b is latitude
					return [a, b];
				}
				// Otherwise assume [latitude, longitude] and convert to [longitude, latitude]
				return [b, a];
			})
		}
	};

  return (
    <>
      <Source id="polylineLayer" type="geojson" data={dataLayer}>
				<Layer 
            id={`lineLayer-1`}
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
            paint={{
              "line-color": "#757575",
              "line-width": 1.5
            }}
        />
      </Source>
    </>
  );
};
