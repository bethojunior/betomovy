// Popup.js — Mapbox GL JS port of the Google Maps OverlayView-based popup.
// Public interface mantida idêntica ao original para não quebrar callers.

let Popup;

function initPop() {
    // No-op: no Mapbox não existe deferred class definition como no Google OverlayView.
    // initPop() é chamado em vários lugares; mantemos a função para não quebrar nada.
}

Popup = class {
    constructor(position, content) {
        const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
        const lng = typeof position.lng === 'function' ? position.lng() : position.lng;

        const anchor = document.createElement('div');
        anchor.classList.add('popup-tip-anchor');

        const bubble = document.createElement('div');
        bubble.classList.add('popup-bubble-anchor');
        bubble.innerHTML = content;
        anchor.appendChild(bubble);

        ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart', 'pointerdown']
            .forEach(evt => anchor.addEventListener(evt, e => e.stopPropagation()));

        this._marker = new mapboxgl.Marker({ element: anchor, anchor: 'bottom' })
            .setLngLat([lng, lat]);

        this._el = anchor;
    }

    // position getter retorna objeto compatível com google.maps.LatLng (.lat() / .lng())
    get position() {
        const self = this;
        return {
            lat: () => self._marker.getLngLat().lat,
            lng: () => self._marker.getLngLat().lng,
        };
    }

    // Aceita google.maps.LatLng-like (.lat()/.lng()) OU plain {lat, lng}
    set position(pos) {
        const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
        const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;
        this._marker.setLngLat([lng, lat]);
    }

    setMap(map) {
        if (map) {
            this._marker.addTo(map);
        } else {
            this._marker.remove();
        }
    }

    getPosition() {
        const { lat, lng } = this._marker.getLngLat();
        return { lat, lng };
    }

    setPosition(pos) {
        const lat = typeof pos.lat === 'function' ? pos.lat() : pos.lat;
        const lng = typeof pos.lng === 'function' ? pos.lng() : pos.lng;
        this._marker.setLngLat([lng, lat]);
    }

    // Mapbox reposiciona automaticamente via setLngLat — draw() é no-op
    draw() {}
};
