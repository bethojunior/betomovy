export type RideCallNotice = {
  userId: number;
  callType?: string | number | null;
  tripReference?: string;
};

export function readRideCallNotice(raw: any): RideCallNotice | null {
  if (!raw || typeof raw !== 'object') return null;

  let extra: any = {};
  const additional = raw.additionalData;
  if (typeof additional === 'string' && additional !== '' && additional !== 'Array') {
    try {
      extra = JSON.parse(additional);
    } catch {
      extra = {};
    }
  } else if (additional && typeof additional === 'object') {
    extra = additional;
  }

  const tag = raw.tag || extra.tag;
  const action = raw.action || extra.action;
  const tripReference = extra.tripReference || raw.tripReference;
  const isRideCall =
    tag === 'rideRequest' ||
    tag === 'notifyDriversClose' ||
    action === 'rideRequest' ||
    action === 'tripCall' ||
    !!tripReference;

  if (!isRideCall) return null;

  const userId = Number(extra.userId ?? raw.userId ?? 0);

  return {
    userId: Number.isFinite(userId) ? userId : 0,
    callType: extra.tripCallTypeId ?? raw.tripCallTypeId ?? null,
    tripReference: tripReference ? String(tripReference) : undefined,
  };
}
