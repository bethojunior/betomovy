export const isWaypointPending = (waypoint: any): boolean => {
  const confirmed = waypoint?.confirmed;

  return confirmed !== true && confirmed !== 1 && confirmed !== '1';
};

export const getPendingWaypoints = (waypoints?: any[]): any[] => {
  if (!Array.isArray(waypoints)) return [];

  return waypoints.filter(isWaypointPending);
};
