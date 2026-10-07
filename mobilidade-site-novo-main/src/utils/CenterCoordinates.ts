export const CenterCoordinates = (coordinates: any) => {
  if (coordinates.length === 0) {
    return null;
  }

  if (coordinates.length === 1) {
    return coordinates;
  }

  let totalLatitude = 0;
  let totalLongitude = 0;

  for (const [latitude, longitude] of coordinates) {
    totalLatitude += latitude;
    totalLongitude += longitude;
  }

  const centerLatitude = totalLatitude / coordinates.length;
  const centerLongitude = totalLongitude / coordinates.length;

  return [centerLatitude, centerLongitude];
};
