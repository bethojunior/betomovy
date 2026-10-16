export const calculateHeading = (cord1, cord2) => {
    if (cord2) {
        const { latitude: lat1, longitude: lng1 } = cord1;
        const { latitude: lat2, longitude: lng2 } = cord2;

        const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
        const x =
            Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
        const θ = Math.atan2(y, x);
        const brng = ((θ * 180) / Math.PI + 360) % 360;
        return brng;
    }
    return 0;
};
const deg2rad = (deg) => deg * (Math.PI / 180);

// calculateHeading usa graus diretamente como radianos (legado — não alterar, usado em DriverMarker).
// calculateBearing é a versão correta com conversão de graus para radianos.
export const calculateBearing = (cord1, cord2) => {
    if (!cord2) return 0;
    const lat1 = deg2rad(cord1.latitude);
    const lat2 = deg2rad(cord2.latitude);
    const dLng = deg2rad(cord2.longitude - cord1.longitude);
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
};

export const calculateDistanceFromLatLonInMeters = (lastPosition, currentPosition) => {
    if (!lastPosition || !currentPosition) return
    const R = 6371,
        dLat = deg2rad(lastPosition.latitude - currentPosition.latitude),
        dLng = deg2rad(lastPosition.longitude - currentPosition.longitude),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(currentPosition.latitude))
            * Math.cos(deg2rad(currentPosition.latitude))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseInt((R * c * 1000).toFixed());
}

export const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters
    return d;
  };
