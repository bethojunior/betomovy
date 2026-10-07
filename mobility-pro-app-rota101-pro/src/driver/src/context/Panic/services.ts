import apiMain from '../../api/apiMain';

interface PropsPosition {
  latitude: number;
  longitude: number;
}

export const PanicService = {
  list: async () => {
    const response = await apiMain.get(`EmergencyMonitoringType/FindAll`);
    return response.data;
  },
  postAlertPanicOnMonitor: async (
    position: PropsPosition,
    emergencyId: string,
  ) => {
    const response = await apiMain.post(`Support/SendAlertHelp`, {
      emergencyMonitoringTypeId: emergencyId,
      lat: position.latitude,
      lng: position.longitude,
    });
    return response.data;
  },
};
