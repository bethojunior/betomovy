
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
				return coordinate.reverse();
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
