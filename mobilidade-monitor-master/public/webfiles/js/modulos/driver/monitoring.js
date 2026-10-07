document.addEventListener("DOMContentLoaded", function () {
    const splitURL = document.URL.split("/");

    const driverId = splitURL[splitURL.length - 1];

    const mapService = new MapService();

    let polyline = null;

    markers = [];

    mapService.importScriptWithPlaces(true).then(() => {
        mapService.initMap({lat: 0, lng: 0}, 17, document.querySelector("#contentMap"), false);

        polyline = new google.maps.Polyline({
            path: [],
            geodesic: true,
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 2.5,
        });

        updateLastPosition();
        setInterval(() => updateLastPosition(), 10000);
    });

    function updateLastPosition() {
        DriverController.lastPositions(driverId).then(({response}) => {
            markers.map(item=>{
                item.setMap(null);
            });

            markers = [];

            const bounds = [];

            document.querySelector("#listLastPosition").innerHTML = response.map(item => {
                const position = {lat: item.latitude, lng: item.longitude};
                markers.push(mapService.createMaker(position));
                bounds.push(position);
                return `<li>
                            <p><span>Horário Enviado:</span>${new Date(item.created_at).toLocaleString()}</p>
                            <p><span>Horário Servidor:</span>${new Date(item.registered_at).toLocaleString()}</p>
                            <label>${item.latitude},${item.longitude}</label>
                        </li>`
            }).join("");

            mapService.setBoundsArray(bounds);

            polyline.setPath(bounds);
            polyline.setMap(mapService.map);
        });
    }
});