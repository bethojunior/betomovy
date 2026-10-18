export const GEOLOCATION_OPTIONS: PositionOptions = {
	maximumAge: 60000,
	timeout: 8000,
	enableHighAccuracy: true,
};

function getPosition(): Promise<{ latitude: number; longitude: number } | null> {
	return new Promise((resolve) => {
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			fetchIpFallback().then(resolve);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			() => {
				fetchIpFallback().then(resolve);
			},
			GEOLOCATION_OPTIONS
		);
	});
}

async function fetchIpFallback(): Promise<{ latitude: number; longitude: number } | null> {
	try {
		const res = await fetch("https://ipapi.co/json/");
		const data = await res.json();
		if (data && typeof data.latitude === "number" && typeof data.longitude === "number") {
			return { latitude: data.latitude, longitude: data.longitude };
		}
	} catch {
		// silent
	}
	return null;
}

export default getPosition;
