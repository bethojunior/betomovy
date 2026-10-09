const IS_HOST_ENVIRONMENT_TEST = false;

var consoleHolder = console;

function debug(bool) {
    if (!bool) {
        consoleHolder = console;
        console = {};
        Object.keys(consoleHolder).forEach(function (key) {
            console[key] = function () {
            };
        })
    } else {
        console = consoleHolder;
    }
}

debug(IS_HOST_ENVIRONMENT_TEST);

const typeVersion = (IS_HOST_ENVIRONMENT_TEST) ? "TESTE" : "";

const NAME_PROJECT = "rota101";

const CONTACT_SUPPORT = '+5585996777458';

//----------------------------------------------------

const API_HOST_PRODUCTION = `https://api.movymob.com/`;
const API_HOST_TEST = `https://apiteste.${NAME_PROJECT}.com.br/`;

const API_HOST = (IS_HOST_ENVIRONMENT_TEST) ? API_HOST_TEST : API_HOST_PRODUCTION;

//----------------------------------------------------

const API_HOST_LOCATION_PRODUCTION = `https://socket.movymob.com`;
const API_HOST_LOCATION_TEST = `http://apiteste.${NAME_PROJECT}.com.br`;

const API_HOST_LOCATION = (IS_HOST_ENVIRONMENT_TEST) ? API_HOST_LOCATION_TEST : API_HOST_LOCATION_PRODUCTION;

//---------------------------------------------------

const PWA_HOST_TEST = `https://pwatest.${NAME_PROJECT}.com.br/`;
const PWA_HOST_PRODUCTION = `https://movymob.com/`;

const CURRENT_HOST_PWA = (IS_HOST_ENVIRONMENT_TEST) ? PWA_HOST_TEST : PWA_HOST_PRODUCTION;

//---------------------------------------------------

const SOCKET_HOST_PRODUCTION = `https://socket.movymob.com`;
const SOCKET_HOST_TEST = `http://apiteste.${NAME_PROJECT}.com.br:3704`;

const SOCKET_IO_HOST = (IS_HOST_ENVIRONMENT_TEST) ? SOCKET_HOST_TEST : SOCKET_HOST_PRODUCTION;

//---------------------------------------------------0

const SOCKET_TEST = `ws://${NAME_PROJECT}.com.br:5555/`;

const SOCKET_PRODUCTION = `ws://${NAME_PROJECT}.com.br:4444/`;

const SOCKET_HOST = (IS_HOST_ENVIRONMENT_TEST) ? SOCKET_TEST : SOCKET_PRODUCTION;

//----------------------------------------------------
const PATH_IMAGE_PRODUCTION = `https://minio.704app.com.br/rota101fb704/driver/profile/compressed/`;
const PATH_IMAGE_TEST = `https://minio.704app.com.br/rota101fb704/driver/profile/compressed/`;

const PATH_IMAGE = (IS_HOST_ENVIRONMENT_TEST) ? PATH_IMAGE_TEST : PATH_IMAGE_PRODUCTION;
//----------------------------------------------------

const PATH_IMAGE_PRODUCTION_TEMP = `https://minio.704app.com.br/rota101fb704/driver/profile/temp/`;
const PATH_IMAGE_TEST_TEMP = `https://minio.704app.com.br/rota101fb704/driver/profile/temp/`;

const PATH_IMAGE_TEMP = (IS_HOST_ENVIRONMENT_TEST) ? PATH_IMAGE_TEST_TEMP : PATH_IMAGE_PRODUCTION_TEMP;
// ---------------------------------------------------
const PATH_IMAGE_CLIENT_TEST = `https://minio.704app.com.br/rota101fb704/customer/profile/compressed/`;

const PATH_IMAGE_CLIENT_PRODUCTION = `https://minio.704app.com.br/rota101fb704/customer/profile/compressed/`;

const CLIENT_PROFILE = (IS_HOST_ENVIRONMENT_TEST) ? PATH_IMAGE_CLIENT_TEST : PATH_IMAGE_CLIENT_PRODUCTION;
// ---------------------------------------------------

const PATH_IMAGE_COOPERATIVE_TEST = `https://minio.704app.com.br/rota101fb704/cooperative/`;

const PATH_IMAGE_COOPERATIVE_PRODUCTION = `https://minio.704app.com.br/rota101fb704/cooperative/`;

const PATH_COOPERATIVE = (IS_HOST_ENVIRONMENT_TEST) ? PATH_IMAGE_COOPERATIVE_TEST : PATH_IMAGE_COOPERATIVE_PRODUCTION;
// ---------------------------------------------------
const AUDIO_CHAT_MESSAGE_TEST = `https://minio.704app.com.br/rota101fb704/chat/trip/`;

const AUDIO_CHAT_MESSAGE_PRODUCTION = `https://minio.704app.com.br/rota101fb704/chat/trip/`;

const AUDIO_CHAT_MESSAGE = (IS_HOST_ENVIRONMENT_TEST) ? AUDIO_CHAT_MESSAGE_TEST : AUDIO_CHAT_MESSAGE_PRODUCTION;

//----------------------------------------------------
const HOST_HOSTEL = `https://pwa.${NAME_PROJECT}.com.br/cliente/OpenHostel?hostel=`;

const API_HOST_WHAT = `https://api.whatsapp.com/`;

//--------------------------------------------------

const HOST_SITE_TEST = `https://beta.${NAME_PROJECT}.com.br/`;

const HOST_SITE_PRODUCTION = `https://rota101.prod.704apps.com.br/`;0

const HOST_SITE = (IS_HOST_ENVIRONMENT_TEST) ? HOST_SITE_TEST : HOST_SITE_PRODUCTION;


/// ---------------------------------------------------

const HOST_API_V2 = `https://v2.${API_HOST.split("/")[2]}/`;

const HOST_API_SOCKET_V2 = `http://v2.${API_HOST.split("/")[2]}:3000`;

// ----------------------------------------------------

const PATH_IMAGE_CENTRAL_TEST = `https://minio.704app.com.br/rota101fb704/`;
const PATH_IMAGE_CENTRAL_PRODUCTION = `https://minio.704app.com.br/rota101fb704/`;

const PATH_IMAGE_CENTRAL = (IS_HOST_ENVIRONMENT_TEST) ? PATH_IMAGE_CENTRAL_TEST : PATH_IMAGE_CENTRAL_PRODUCTION;

// ----------------------------------------------------

const API_HOST_CENTRAL_TEST = `https://central-rota101fb704-api.dev.704apps.com.br/`;
const API_HOST_CENTRAL_PRODUCTION = `https://central-${NAME_PROJECT}-api.prod.704apps.com.br/`;
const API_HOST_CENTRAL = (IS_HOST_ENVIRONMENT_TEST) ? API_HOST_CENTRAL_TEST : API_HOST_CENTRAL_PRODUCTION;

// ----------------------------------------------------
const API_HOST_IFOOD = `https://api-ifood.704app.com.br/ifood/`;

// ----------------------------------------------------
const PULSE_GROUPID_TESTE = '31935354-eb99-4c3c-b238-58ed8a71b96a';
const PULSE_GROUPID_PRODUCTION =  '31935354-eb99-4c3c-b238-58ed8a71b96a';
const PULSE_GROUPID_SOCKET_REAL_TIME = '31935354-eb99-4c3c-b238-58ed8a71b96a';

const PULSE_GROUPID = (IS_HOST_ENVIRONMENT_TEST) ? PULSE_GROUPID_TESTE : PULSE_GROUPID_PRODUCTION;
const PULSE_APP = "driver_app_legado";
