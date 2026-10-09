export const nameApp = 'rota101';
const linkApp = 'fb704';
export let appProccess = 'aws';
export let soundCall = null;
const HOST_API_GOOGLE_MAPS = 'AIzaSyBr4fzCxEeEl__R0h_snwRyuHvy48qJxQ';
const isMigrated = true;
const nameBucket = isMigrated ? 'rota101fb704' : 'rota101';
export const isBeta = false;
export const dataExpired = '2024-01-31T19:19:09.975Z';
export const dataNow = new Date().getTime();

// OBS - SOCKET NA AWS TROCAR DE HTTP, PARA HTTPS

export const buildApp = () => {
  if (appProccess === 'development') {
    const HOST_API_DELIVERY = `https://v2.apiteste.${nameApp}.com.br/`;
    const HOST_API_APP = `https://apiteste.${nameApp}.com.br/`;
    const HOST_SOCKET = `http://v2.apiteste.${nameApp}.com.br:3000`;
    const HOST_SOCKETV2 = `http://v2.apiteste.${nameApp}.com.br:3000`;
    const HOST_AUDIO_MESSAGE = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/chat/trip/`;
    const HOST_SITE = `https://beta.${nameApp}.com.br/`;

    const HOST_IMAGE_DRIVER = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/driver/profile/compressed/`;
    const HOST_IMAGE_CUSTOMER = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/customer/profile/compressed/`;

    const PATH_IMAGE_TEMP = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/driver/profile/temp/`;

    const HOST_IMAGE_TRIP_TYPE = `https://${nameApp}teste.s3.sa-east-1.amazonaws.com/tripType/`;

    const HOST_IMAGE_LOGO = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/default.jpg`;

    return {
      HOST_API_DELIVERY,
      HOST_API_APP,
      HOST_SOCKET,
      HOST_AUDIO_MESSAGE,
      HOST_SITE,
      HOST_API_GOOGLE_MAPS,
      HOST_IMAGE_DRIVER,
      HOST_IMAGE_CUSTOMER,
      PATH_IMAGE_TEMP,
      HOST_IMAGE_TRIP_TYPE,
      HOST_IMAGE_LOGO,
      HOST_SOCKETV2,
    };
  }
  if (appProccess === 'aws') {
    const HOST_API_DELIVERY = `https://delivery-api-${nameApp}.prod.704apps.com.br/`;
    const HOST_API_APP = `https://api.movymob.com/`;
    const HOST_SOCKET = `https://socket.movymob.com/`;
    const HOST_SOCKETV2 = `https://socket.movymob.com/`;
    const HOST_SITE = `https://movymob.com/`;

    let HOST_AUDIO_MESSAGE = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/chat/trip/`;
    let HOST_IMAGE_DRIVER = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/driver/profile/compressed/`;
    let HOST_IMAGE_CUSTOMER = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/customer/profile/compressed/`;

    let PATH_IMAGE_TEMP = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/driver/profile/temp/`;

    let HOST_IMAGE_TRIP_TYPE = `https://nodes-${nameBucket}-prod.s3.amazonaws.com/tripType/`;

    let HOST_IMAGE_LOGO = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/default.jpg`;
    if (isMigrated) {
      HOST_AUDIO_MESSAGE = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/chat/trip/`;
      HOST_IMAGE_DRIVER = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/driver/profile/compressed/`;
      HOST_IMAGE_CUSTOMER = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/customer/profile/compressed/`;

      PATH_IMAGE_TEMP = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/driver/profile/temp/`;

      HOST_IMAGE_TRIP_TYPE = `https://${nameBucket}.s3.sa-east-1.amazonaws.com/tripType/`;

      HOST_IMAGE_LOGO = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/default.jpg`;
    } else {
      HOST_AUDIO_MESSAGE = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/chat/trip/`;
      HOST_IMAGE_DRIVER = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/driver/profile/compressed/`;
      HOST_IMAGE_CUSTOMER = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/customer/profile/compressed/`;

      PATH_IMAGE_TEMP = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/driver/profile/temp/`;

      HOST_IMAGE_TRIP_TYPE = `https://nodes-${nameBucket}-prod.s3.amazonaws.com/tripType/`;

      HOST_IMAGE_LOGO = `https://s3.amazonaws.com/nodes-${nameBucket}-prod/default.jpg`;
    }

    return {
      HOST_API_DELIVERY,
      HOST_API_APP,
      HOST_SOCKET,
      HOST_AUDIO_MESSAGE,
      HOST_SITE,
      HOST_API_GOOGLE_MAPS,
      HOST_IMAGE_DRIVER,
      HOST_IMAGE_CUSTOMER,
      PATH_IMAGE_TEMP,
      HOST_IMAGE_TRIP_TYPE,
      HOST_IMAGE_LOGO,
      HOST_SOCKETV2,
    };
  }
  const HOST_API_DELIVERY = `https://v2.${nameApp}api.${linkApp}.com.br/`;
  const HOST_API_APP = `https://${nameApp}api.${linkApp}.com.br/`;
  const HOST_SOCKET = `https://${nameApp}api.${linkApp}.com.br:3000`;
  const HOST_SOCKETV2 = `https://${nameApp}api.${linkApp}.com.br:3000/`;
  const HOST_SITE = `https://${nameApp}.${linkApp}.com.br/`;

  const HOST_AUDIO_MESSAGE = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/chat/trip/`;
  const HOST_IMAGE_DRIVER = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/driver/profile/compressed/`;
  const HOST_IMAGE_CUSTOMER = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/customer/profile/compressed/`;

  const PATH_IMAGE_TEMP = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/driver/profile/temp/`;

  const HOST_IMAGE_TRIP_TYPE = `https://${nameBucket}.s3.sa-east-1.amazonaws.com/tripType/`;

  const HOST_IMAGE_LOGO = `https://s3-sa-east-1.amazonaws.com/${nameBucket}/default.jpg`;

  return {
    HOST_API_DELIVERY,
    HOST_API_APP,
    HOST_SOCKET,
    HOST_AUDIO_MESSAGE,
    HOST_SITE,
    HOST_API_GOOGLE_MAPS,
    HOST_IMAGE_DRIVER,
    HOST_IMAGE_CUSTOMER,
    PATH_IMAGE_TEMP,
    HOST_IMAGE_TRIP_TYPE,
    HOST_IMAGE_LOGO,
    HOST_SOCKETV2,
  };
};
