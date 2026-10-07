import apiApp from "./apiApp";

type Position = {
	lat: number;
	lng: number;
};

interface PositionList extends Array<Position> {}

class MapService {
	static async searchNative(origin: string, destination: string, waypoints: string | null = null) {
		let params = `?origin=${origin}&destination=${destination}&simpleDirections=1`;
		
		if (waypoints != null) params += `&waypoints=${waypoints}`;
		
		const response = await apiApp.get(`direction/search${params}`);
		return response.data;
	}
	static decodePolyline(encoded: string): PositionList {
		if (!encoded) {
			return [];
		}
		const poly = [];
		let index = 0;
		const len = encoded.length;
		let lat = 0;
		let lng = 0;

		while (index < len) {
			let b;
			let shift = 0;
			let result = 0;

			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
			lat += dlat;

			shift = 0;
			result = 0;

			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
			lng += dlng;

			const p = {
				lat: lat / 1e5,
				lng: lng / 1e5,
			};
			poly.push(p);
		}
		return poly;
	}
}

export default MapService;
