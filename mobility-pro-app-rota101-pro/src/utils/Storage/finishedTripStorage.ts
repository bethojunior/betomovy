import storage from '~/common/services/mmkv/storage';

type TripReference = string;

export class FinishedTripStorage {
  private static readonly MAX_ITEMS = 5;
  private static readonly KEY = 'recentlyFinishedTrips';
  private static readonly TIMESTAMP_KEY = 'lastFinishedTripTimestamp';

  private static getAll(): TripReference[] {
    try {
      const data = storage.getItem(this.KEY, 'json');
      return !data ? [] : data as TripReference[];
    } catch {
      return [];
    }
  }

  private static save(trips: TripReference[]) {
    storage.setItem(this.KEY, trips, 'json');
  }

  private static saveTimestamp() {
    storage.setItem(this.TIMESTAMP_KEY, Date.now().toString(), 'string');
  }

  static add(tripReference: TripReference): void {
    if (!tripReference) return;

    const trips = this.getAll();

    if (trips.includes(tripReference)) return;

    const updated = [...trips, tripReference].slice(-this.MAX_ITEMS);

    this.save(updated);
    this.saveTimestamp();
  }

  static exists(tripReference: TripReference): boolean {
    if (!tripReference) return false;

    return this.getAll().includes(tripReference);
  }

  static remove(tripReference: TripReference): void {
    if (!tripReference) return;

    const filtered = this.getAll().filter(ref => ref !== tripReference);

    this.save(filtered);
  }

  static get(tripReference: TripReference): TripReference | null {
    return this.getAll().find(ref => ref === tripReference) ?? null;
  }

  static getLastTripFinishedAt(): string | null {
    return storage.getItem(this.TIMESTAMP_KEY, 'string');
  }

  static clear(): void {
    storage.removeItem(this.KEY);
    storage.removeItem(this.TIMESTAMP_KEY);
  }
}
