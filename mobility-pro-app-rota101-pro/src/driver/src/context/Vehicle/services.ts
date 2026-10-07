import apiMainDriver from '../../api/apiMain';
import {VehicleDocumentAsset} from '../../components/VehicleDocumentUpload/types';

export const vehicleService = {
  getPendingVehicles: async (driverId: string) => {
    const response = await apiMainDriver.get(
      `Car/FindAllPendingByDriver?driverId=${driverId}`,
    );
    return response.data;
  },
  postChangeCar: async (object, document: VehicleDocumentAsset) => {
    const formData = new FormData();

    formData.append('car', JSON.stringify({
      brand: object.brand,
      color: object.color,
      driverId: object.driverId,
      model: object.model,
      plate: object.plate,
      renavam: object.renavam,
      year: object.year,
    }));
    formData.append('document', {
      uri: document.uri,
      name: document.name,
      type: document.type,
    } as any);

    const response = await apiMainDriver.post('Car/InsertSecondCar', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return response.data;
  },
};
