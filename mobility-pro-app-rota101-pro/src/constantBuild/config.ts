export const nameApp = 'rota101';
const linkApp = 'fb704';
export let appProccess = 'aws';
export let soundCall = null;
const HOST_API_GOOGLE_MAPS = 'AIzaSyBr4fzCxEeEl__R0h_snwRyuHvy48qJxQ';
const isMigrated = false;
const nameBucket = isMigrated ? 'rota101fb704' : 'rota101';
export const isBeta = false;
export const dataExpired = '2023-10-15T16:42:10.436Z';
export const dataNow = new Date().getTime();
const BASE_URL_SITE = `https://${nameApp}-new.prod.704apps.com.br/`;
const pulseCodeHomolog = '5a0a39bf-5115-432c-ae71-9153bc8855c2';
const pulseCode704 = 'd5096670-ac06-482d-8919-36901ac36e92';
const APP_PARTNER = false;
export const USE_DARK_PRIMARY_VARIANT: boolean = false;
const TOKEN_HEADER = 'jayW2RMJUY7f6T3sXoVXrL8tg';
const IS_APP_DEMO = false;

// OBS - SOCKET NA AWS TROCAR DE HTTP, PARA HTTPS

export const buildApp = () => {
  if (appProccess === 'development') {
    const HOST_API_DELIVERY = `https://v2.apiteste.${nameApp}.com.br/`;
    const HOST_API_APP = `https://apiteste.${nameApp}.com.br/`;
    const HOST_SOCKET = `http://v2.apiteste.${nameApp}.com.br:3000`;
    const HOST_SOCKETV2 = `http://v2.apiteste.${nameApp}.com.br:3000`;
    const HOST_AUDIO_MESSAGE = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/chat/trip/`;
    const HOST_SITE = `https://${nameApp}-mobilidade.dev.704apps.com.br/`;
    const HOST_API_IFOOD = 'https://api-ifood.704app.com.br/ifood/';
    const HOST_API_CENTRAL = `https://central-${nameApp}-api.prod.704apps.com.br/`;

    const HOST_IMAGE_DRIVER = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/driver/profile/compressed/`;
    const HOST_IMAGE_CUSTOMER = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/customer/profile/compressed/`;

    const PATH_IMAGE_TEMP = `https://s3-sa-east-1.amazonaws.com/${nameApp}teste/driver/profile/temp/`;

    const HOST_IMAGE_TRIP_TYPE = `https://${nameApp}teste.s3.sa-east-1.amazonaws.com/tripType/`;

    const HOST_IMAGE_LOGO = `https://minio.704app.com.br/rota101fb704/default.jpg`;

    const PULSE_CODE = pulseCodeHomolog;

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
      BASE_URL_SITE,
      HOST_API_IFOOD,
      HOST_API_CENTRAL,
      PULSE_CODE,
      APP_PARTNER,
      TOKEN_HEADER,
      IS_APP_DEMO,
    };
  }
  if (appProccess === 'aws') {
    const HOST_API_DELIVERY = `https://delivery-api-${nameApp}.prod.704apps.com.br/`;
    const HOST_API_APP = `https://api.movymob.com/`;
    const HOST_SOCKET = `https://socket.movymob.com/`;
    const HOST_SOCKETV2 = `https://socket.movymob.com/`;
    const HOST_SITE = `https://movymob.com/`;
    const HOST_API_IFOOD = 'https://api-ifood.704app.com.br/ifood/';
    const HOST_API_CENTRAL = `https://movycentral.com/`;

    let HOST_AUDIO_MESSAGE = `https://minio.704app.com.br/rota101fb704/chat/trip/`;
    let HOST_IMAGE_DRIVER = `https://minio.704app.com.br/rota101fb704/driver/profile/compressed/`;
    let HOST_IMAGE_CUSTOMER = `https://minio.704app.com.br/rota101fb704/customer/profile/compressed/`;

    let PATH_IMAGE_TEMP = `https://minio.704app.com.br/rota101fb704/driver/profile/temp/`;

    let HOST_IMAGE_TRIP_TYPE = `https://nodes-${nameBucket}-dev.s3.amazonaws.com/tripType/`;

    let HOST_IMAGE_LOGO = `https://minio.704app.com.br/rota101fb704/default.jpg`;

    const PULSE_CODE = pulseCodeHomolog;

    if (isMigrated) {
      HOST_AUDIO_MESSAGE = `https://minio.704app.com.br/rota101fb704/chat/trip/`;
      HOST_IMAGE_DRIVER = `https://minio.704app.com.br/rota101fb704/driver/profile/compressed/`;
      HOST_IMAGE_CUSTOMER = `https://minio.704app.com.br/rota101fb704/customer/profile/compressed/`;

      PATH_IMAGE_TEMP = `https://minio.704app.com.br/rota101fb704/driver/profile/temp/`;

      HOST_IMAGE_TRIP_TYPE = `https://${nameBucket}.s3.sa-east-1.amazonaws.com/tripType/`;

      HOST_IMAGE_LOGO = `https://minio.704app.com.br/rota101fb704/default.jpg`;
    } else {
      HOST_AUDIO_MESSAGE = `https://minio.704app.com.br/rota101fb704/chat/trip/`;
      HOST_IMAGE_DRIVER = `https://minio.704app.com.br/rota101fb704/driver/profile/compressed/`;
      HOST_IMAGE_CUSTOMER = `https://minio.704app.com.br/rota101fb704/customer/profile/compressed/`;

      PATH_IMAGE_TEMP = `https://minio.704app.com.br/rota101fb704/driver/profile/temp/`;

      HOST_IMAGE_TRIP_TYPE = `https://nodes-${nameBucket}-dev.s3.amazonaws.com/tripType/`;

      HOST_IMAGE_LOGO = `https://minio.704app.com.br/rota101fb704/default.jpg`;
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
      BASE_URL_SITE,
      HOST_API_IFOOD,
      HOST_API_CENTRAL,
      PULSE_CODE,
      APP_PARTNER,
      TOKEN_HEADER,
      IS_APP_DEMO,
    };
  }
  const HOST_API_DELIVERY = `https://v2.${nameApp}api.${linkApp}.com.br/`;
  const HOST_API_APP = `https://${nameApp}api.${linkApp}.com.br/`;
  const HOST_SOCKET = `https://${nameApp}api.${linkApp}.com.br:3000`;
  const HOST_SOCKETV2 = `https://${nameApp}api.${linkApp}.com.br:3000/`;
  const HOST_SITE = `https://${nameApp}-mobilidade.dev.704apps.com.br/`;

  const HOST_AUDIO_MESSAGE = `https://minio.704app.com.br/rota101fb704/chat/trip/`;
  const HOST_IMAGE_DRIVER = `https://minio.704app.com.br/rota101fb704/driver/profile/compressed/`;
  const HOST_IMAGE_CUSTOMER = `https://minio.704app.com.br/rota101fb704/customer/profile/compressed/`;

  const PATH_IMAGE_TEMP = `https://minio.704app.com.br/rota101fb704/driver/profile/temp/`;

  const HOST_IMAGE_TRIP_TYPE = `https://${nameBucket}.s3.sa-east-1.amazonaws.com/tripType/`;

  const HOST_IMAGE_LOGO = `https://minio.704app.com.br/rota101fb704/default.jpg`;

  const PULSE_CODE = pulseCode704;

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
    PULSE_CODE,
    TOKEN_HEADER,
    BASE_URL_SITE,
    APP_PARTNER,
    IS_APP_DEMO,
  };
};