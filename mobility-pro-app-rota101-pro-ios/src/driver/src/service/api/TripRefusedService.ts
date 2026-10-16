import apiMain from '~/client/api/apiMain';
import { TripRefused, TripRefusedCreated } from '~/interfaces/tripRefused';

export class TripRefusedService {
  static async create(driverId: string, tripId: string) {
    const response = await apiMain.post<ApiResponse<TripRefusedCreated>>(
      'TripRefused/Create',
      {stdObject: [{driverId, tripId}]},
    );
    return response.data;
  }

  static async get(id: string) {
    const response = await apiMain.post<ApiResponse<TripRefused>>(
      'TripRefused/Get',
      {stdObject: [{id}]},
    );
    return response.data;
  }

  static async delete(id: string) {
    const response = await apiMain.post<ApiResponse<boolean>>(
      'TripRefused/Delete',
      {stdObject: [{id}]},
    );
    return response.data;
  }
}
