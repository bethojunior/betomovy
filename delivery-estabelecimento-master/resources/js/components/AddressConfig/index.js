import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import "./style.css";
import api from "../../api";
import {NotificationNewOrder} from "../../vanilla/NotificationNewOrder";

export default function AddressConfig() {
    const mapContainerRef = useRef();
    const [place, setPlace] = useState(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    async function store() {
        if (!place)
            return alert("Informe o endereço");

        const companyId = document.querySelector("input[name='companyId']").value;

        setDisabled(true)
        const {data} = await api.post(`${companyId}/address`, {
            companyId,
            address: place.address,
            latitude:   place.lat,
            longitude: place.lng
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

        async function getAddress() {
            const {data: {response}} = await api.get(`${document.querySelector("input[name='companyId']").value}/address`);

            return response;
        }

        async function getData() {
            const key = await getKey();
            const address = await getAddress();

            let marker = null;

            mapboxgl.accessToken = key;
            var map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11'
            });

            const geocoder = new MapboxGeocoder({
                accessToken: key,
                mapboxgl: mapboxgl
            })

            map.addControl(geocoder);

            if (address) {
                setText(address.address);
                marker = new mapboxgl.Marker()
                    .setLngLat([address.longitude, address.latitude])
                    .addTo(map);
                map.flyTo({
                    center: [address.longitude, address.latitude],
                    zoom: 17
                });
            }

            geocoder.on('result', function ({result}) {
                setPlace({
                    address: result.place_name,
                    lat: result.center[1],
                    lng: result.center[0]
                })
            });
        }

        getData();
    }, [])

    return <div className="container-address-config">
        <h4>Endereço</h4>
        <p>{text}</p>
        <div className="map-container" ref={mapContainerRef}></div>
        {place && <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-primary" disabled={disabled} onClick={store}>Atualizar</button>
        </div>}
    </div>
}


if (document.getElementById("companyAddress")) {
    ReactDOM.render(<AddressConfig/>, document.getElementById("companyAddress"));
}
