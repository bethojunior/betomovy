import apiMainDriver from '../../../api/apiMain';

export const sendDocumentPhoto = async (
  setLoading,
  capturedPhoto,
  userDriverFind,
  lat,
  lng,
  test: boolean = false,
) => {
  console.log(capturedPhoto, lat, lng);
  setLoading(true);
  if (Object.keys(capturedPhoto).length > 0) {
    // @ts-ignore
    const formData = new FormData();
    formData.append('photo', capturedPhoto);
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('emergencyMonitoringTypeId', '6');
    test && formData.append('test', '1');
    const response = await apiMainDriver.post(
      'Support/SendAlertHelpWithData',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(response.data);
  }
  setLoading(false);
};
