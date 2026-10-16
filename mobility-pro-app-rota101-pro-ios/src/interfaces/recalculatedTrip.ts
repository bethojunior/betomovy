export interface RecalculatedTrip {
  id: number;
  tripReference: string;
  oldPrice: number;
  newPrice: number;
  recalculatedTripTypeId: number;
  created_at: string;
  newDistance: number | null;
  newTripTime: number | null;
  message: string | null;
  valueDiffError: number | null;
}
