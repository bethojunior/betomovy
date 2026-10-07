import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import "./style.css";
import api from "../../api";
import {confirmAlert} from "react-confirm-alert";
import {NotificationNewOrder} from "../../vanilla/NotificationNewOrder";

export default function DeliveryArea() {
    const mapContainerRef = useRef();
    const [polygonData, setPolygonData] = useState(null);
    const [disabled, setDisabled] = useState(false);

    async function store() {
        if (!polygonData)
            return alert("Selecione a área");

        const polygon = polygonData.features[0].geometry.coordinates[0].map(position => ({
            lat: position[1],
            lng: position[0]
        }));

        const companyId = document.querySelector("input[name='companyId']").value;

        Preload.show();

        setDisabled(true)
        const {data} = await api.post(`companyDeliveryArea`, {
            companyId,
            polygon
        });

        setDisabled(false);

        location.reload(true);
    }


    useEffect(() => {
        NotificationNewOrder(true);
        async function getKey() {
            const {data: {response}} = await api.get("config/mapKey");

            return response.value;
        }

        async function getArea() {
            const {data: {response}} = await api.get(`companyDeliveryArea/${document.querySelector("input[name='companyId']").value}`);

            return response;
        }

        async function getAddress() {
            const {data: {response}} = await api.get(`${document.querySelector("input[name='companyId']").value}/address`);

            return response;
        }


        async function getRate() {
            const {data: {response}} = await api.get(`company/${document.querySelector("input[name='companyId']").value}/rate`);

            return response;
        }

        async function getData() {
            Preload.show();

            const key = await getKey();
            const address = await getAddress();
            const area = await getArea();
            const rates = await getRate();

            let marker = null;

            mapboxgl.accessToken = key;
            var map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11'
            });


            var Draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                }
            });
            map.addControl(Draw, 'top-left');
            map.on('draw.create', updateArea);

            function updateArea(e) {
                console.log(Draw.getAll());
                setPolygonData(Draw.getAll());
            }


            if (address) {
                marker = new mapboxgl.Marker()
                    .setLngLat([address.longitude, address.latitude])
                    .addTo(map);
                map.flyTo({
                    center: [address.longitude, address.latitude],
                    zoom: 13
                });
            }

            map.on('load', function () {
                Preload.hide();

                area.map(item => {
                    map.addSource("polygon" + item.id, {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'data': item,
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': [
                                    item.area.map(item => {
                                        return [item.lng, item.lat]
                                    })
                                ]
                            }
                        }
                    });
                    map.addLayer({
                        'id': "polygon" + item.id,
                        'type': 'fill',
                        'source': "polygon" + item.id,
                        'layout': {},
                        'paint': {
                            'fill-color': '#ff5252',
                            'fill-outline-color': '#ff3232',
                            'fill-opacity': 0.25
                        }
                    });

                    map.on('click', "polygon" + item.id, function (e) {
                        confirmAlert({
                            title: "Atenção",
                            message: "Deseja remover essa área?",
                            buttons: [
                                {
                                    label: "Sim",
                                    onClick: async () => {
                                        Preload.show();
                                        await api.delete(
                                            `companyDeliveryArea/${item.id}`
                                        );

                                        location.reload(true);
                                    }
                                },
                                {
                                    label: "Não", onClick: () => {
                                    }
                                }
                            ],
                            closeOnEscape: true,
                            closeOnClickOutside: true
                        });
                    });
                });

                rates.map(item => {
                    map.addSource(`circle_${item.id}`, {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": [{
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [address.longitude, address.latitude]
                                }
                            }]
                        }
                    });

                    map.addLayer({
                        "id": `circle${item.id}`,
                        "type": "circle",
                        "source": `circle_${item.id}`,
                        'paint': {
                            "circle-radius": {
                                stops: [
                                    [0, 0],
                                    [16, item.range * 1000]
                                ],
                                base: 2
                            },
                            "circle-color": "#000000",
                            "circle-opacity": 0.05,
                            "circle-stroke-width": 1,
                            "circle-stroke-color": "#444"
                        }
                    })
                })
            });


        }

        getData();
    }, [])

    return <div className="container-address-config">
        <div className="map-container" ref={mapContainerRef}></div>
        {polygonData && <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-primary" disabled={disabled} onClick={store}>Adicionar</button>
        </div>}
    </div>
}


if (document.getElementById("deliveryArea")) {
    ReactDOM.render(<DeliveryArea/>, document.getElementById("deliveryArea"));
}
