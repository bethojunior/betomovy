var THAT = '<PROJECT_NAME>';
var HOST_API = '<APIAPP_HOST>';
var ROUTE_HOST_TRIP_SHARE_URL = '<ROUTE_HOST_TRIP_SHARE_URL>';

const arrayLike = HOST_API.split(".");

arrayLike.splice(0, 1);

var HOST_API_V2 = createLinkV2();

function createLinkV2() {
    const arrayLike = HOST_API.split(".");

    arrayLike.splice(0, 1);

    return `https://v2.${THAT}seumiltoapi.${arrayLike.join(".")}`;
}