export const GEOLOCATION_OPTIONS: PositionOptions = {
	maximumAge: 60000,
	timeout: 10000,
	enableHighAccuracy: false,
};

function getPosition(): Promise<{ latitude: number; longitude: number } | null> {
	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			() => resolve(null),
			GEOLOCATION_OPTIONS
		);
	});
}

export default getPosition;
