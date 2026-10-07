export type RoomScope = 'trip' | 'driver' | 'user' | 'city';
export type RoomParams = Record<string, string | number | undefined>;
export type CityRoomParams = { callType: string };

export class EventsHelper {
  static buildRoomName(scope: RoomScope, id: string | number): string {
    return `${scope}:${id}`.toLocaleLowerCase();
  }

  static buildDynamicRoomName(base: string, params?: RoomParams): string {
    if (!params || Object.keys(params).length === 0) return base;

    const suffix = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${String(value)}`.toLocaleLowerCase());

    return [base, ...suffix].join('-');
  }

  static removeTrailingColon(prefix: string) {
    if (!prefix) return '';
    return prefix.endsWith(':') ? prefix.slice(0, -1) : prefix;
  }
}
