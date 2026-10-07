export const buildShareTripWaypointFallbackLabel = (index: number): string =>
  `Parada ${index + 1}`;

export const sanitizePhoneForTelHref = (phone: string): string =>
  phone.replace(/[^\d+]/g, "");

export const resolveShareTripWaypointLabel = (
  waypoint: Record<string, unknown>,
  index: number
): string => {
  if (!waypoint || typeof waypoint !== "object") {
    return buildShareTripWaypointFallbackLabel(index);
  }
  const address = waypoint.address as string | undefined;
  const name = waypoint.name as string | undefined;
  const origin = waypoint.origin as { address?: string } | undefined;
  const destination = waypoint.destination as { name?: string } | undefined;
  return (
    address ||
    name ||
    origin?.address ||
    destination?.name ||
    buildShareTripWaypointFallbackLabel(index)
  );
};

export const normalizeShareTripWaypoints = (
  tripWayPoints: unknown
): Record<string, unknown>[] => {
  if (!Array.isArray(tripWayPoints)) {
    return [];
  }
  return tripWayPoints.filter(
    (item): item is Record<string, unknown> =>
      item !== null && typeof item === "object"
  );
};

export const formatShareTripDriverRating = (
  rating: string | undefined
): string => {
  const parsed = parseFloat(rating ?? "");
  if (!Number.isNaN(parsed)) {
    return parsed.toFixed(1);
  }
  return "5.0";
};

export const formatShareTripDriverCarSummary = (
  driver: TripProps["driver"]
): string => {
  const { brand, model, color } = driver.car;
  return `${brand}/${model} - ${color}`;
};
