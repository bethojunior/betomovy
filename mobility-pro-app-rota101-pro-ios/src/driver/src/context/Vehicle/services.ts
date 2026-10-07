import apiMainDriver from '../../api/apiMain';

export const vehicleService = {
  getPendingVehicles: async (driverId: string) => {
    const response = await apiMainDriver.get(
      `Car/FindAllPendingByDriver?driverId=${driverId}`,
    );
    return response.data;
  },
  postChangeCar: async object => {
    const payload = {
      stdObject: [
        {
          brand: object.brand,
          color: object.color,
          driverId: object.driverId,
          model: object.model,
          plate: object.plate,
          renavam: object.renavam,
          year: object.year,
        },
      ],
    };

    const response = await apiMainDriver.post('Car/InsertSecondCar', payload);
    return response.data;
  },
};
