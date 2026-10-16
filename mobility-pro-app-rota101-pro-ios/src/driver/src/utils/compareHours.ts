export const CompareHours = (firstHours: string, secondHours: string) => {
  const [deviceHours, deviceMinutes, deviceSeconds] = firstHours
    ?.split(':')
    .map(Number);
  const [tripHours, tripMinutes, tripSeconds] = secondHours
    ?.split(':')
    .map(Number);

  const dateDevice: any = new Date();
  const dateTrip: any = new Date();

  dateDevice.setHours(deviceHours, deviceMinutes, deviceSeconds, 0);
  dateTrip.setHours(tripHours, tripMinutes, tripSeconds, 0);

  const diferencaMillis = dateDevice - dateTrip;

  const diferencaSegundos = Math.floor(diferencaMillis / 1000);
  const hours = Math.floor(diferencaSegundos / 3600);
  const minutes = Math.floor((diferencaSegundos % 3600) / 60);
  const seconds = diferencaSegundos % 60;

  return {
    hours,
    minutes,
    seconds,
  };
};
