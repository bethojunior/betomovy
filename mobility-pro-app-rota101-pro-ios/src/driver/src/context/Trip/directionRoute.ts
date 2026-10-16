import axios from 'axios';
import { appProccess, buildApp } from '../../../../constantBuild/config';
import apiMainDriver from '../../api/apiMain';
import { UrlBuilder } from '~/utils/UrlBuilder';
import { DirectionResponse } from '~/interfaces/direction';

export const searchNative = async (
  origin: string,
  destination: string,
  waypoints: string | null = null,
): Promise<ApiResponse<DirectionResponse>> => {
  if (!origin || !destination) {
    console.warn('searchNative: origin or destination is undefined');
    return;
  }

  try {
    let params = `?origin=${origin}&destination=${destination}&simpleDirections=1`;

    if (waypoints != null) params += `&waypoints=${waypoints}`;
    const response = await apiMainDriver.get<ApiResponse<DirectionResponse>>(
      `direction/search${params}`,
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const searchNativeFetch = async (
  origin,
  destination,
  waypoints = null,
  headers,
  {
    tripAccepted,
    userDriverFind,
    cityConfig,
    getKmRouteTraveled,
    getMinutesRouteTraveled,
    lat,
    lng,
  },
) => {
  if (!origin || !destination) {
    console.warn('searchNativeFetch: origin or destination is undefined');
    return;
  }

  try {
    let params = `?origin=${origin}&destination=${destination}&simpleDirections=1`;

    if (waypoints != null) params += `&waypoints=${waypoints}`;

    const response = await fetch(`${buildApp().HOST_API_APP}direction/search${params}`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    await updateRouteFetch(
      {
        tripReference: tripAccepted?.tripReference,
        polyline: data?.data?.overview_polyline?.points,
        time: `${Math.floor(data?.data?.duration / 60)} min`,
        idDriver: userDriverFind?.idDriver,
        position: { lat: lat, lng: lng },
        kmProgressing: await getKmRouteTraveled(),
        minuteProgressing: Number(await getMinutesRouteTraveled()),
      },
      { token: headers?.api_token, userid: userDriverFind?.userId },
      cityConfig?.configDriverLocation?.port_url,
    )
      .then((data) => {})
      .catch((err) => {
        console.log('deu erro ', err);
      });

    return data;
  } catch (error) {
    console.error('Erro:', error);
    return error;
  }
};

export const updateRoute = async (data, driver, port = ':3704') => {
  try {
    let uri = buildApp().HOST_API_APP.replace('https', 'http');
    if (appProccess === 'aws') {
      uri = buildApp().HOST_SOCKET;
    }
    uri = uri.substring(0, uri.length - 1);

    const baseUrl = UrlBuilder.resolveWithPort(uri, port);

    const response = await axios.post(`${baseUrl}/location/route`, data, {
      headers: {
        token: driver?.token,
        userid: driver?.userid,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateRouteFetch = async (data, driver, port = ':3704') => {
  try {
    let uri = buildApp().HOST_API_APP.replace('https', 'http');
    if (appProccess === 'aws') {
      uri = buildApp().HOST_SOCKET;
    }
    uri = uri.substring(0, uri.length - 1);

    const baseUrl = UrlBuilder.resolveWithPort(uri, port);

    const response = await fetch(`${baseUrl}/location/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: driver?.token,
        userid: driver?.userid,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro:', error);
    return error;
  }
};
