// MapService.js — Mapbox GL JS (v3.x) port.
// Interface pública mantida idêntica ao original para não quebrar os controllers/módulos chamadores.

class MapService {
    constructor() {
        this.map = null;
        this.locationClient = null;
        this.locationDestination = null;
        this.infoOrigin = null;
        this.infoDestination = null;
        this.infoSearch = null;
        this.pointDriver = null;
        this.locationClientTrip = null;
        this.pointCenter = null;
        this.pointCustomer = null;

        this.futurePosition = null;
        this.currentPosition = null;
        this.timeOut = null;
        this.numDeltas = 100;
        this.delay = 5;
        this.index = 0;
        this.deltaLat = 0;
        this.deltaLng = 0;

        this.isImportMap = false;
        this.key = null;
        this.waypoints = [];
        this.inRoute = true;
        this.bounds = [];
        this.defaultZoom = 14;
        this.mapStyle = 'mapbox://styles/mapbox/streets-v12';
        this.paddingBoundsMap = { top: 120, left: 300, right: 300, bottom: 120 };
        this.icons = {
            central: '/webfiles/img/icon/central.png',
            center: '/webfiles/img/icon/pin2.png',
            origin: '/webfiles/img/icon/origin.png',
            destination: '/webfiles/img/icon/destination.png',
            waypoint: '/webfiles/img/icon/waypoint.png',
            clientWait: '/webfiles/img/icon/point.png',
        };

        this.polygonArea = null;
        this._polygonSourceId = 'polygon-area';

        // Polyline principal (tracking de viagem em tempo real)
        this._routeSourceId = 'route-main';
        this._routeLayerId = 'route-main-layer';
        this._routeAdded = false;
        // Dicionário de polylines por tripReference (showInRoute)
        this._tripRoutes = {};

        this.timeoutAddressPoint = null;
    }

    // ─── Inicialização do SDK ─────────────────────────────────────────────────

    getKey() {
        // GET /config/mapbox_access_token — retorna o token diretamente como string
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('config/mapbox_access_token', 'GET', null, (result) => {
                const token = result && result.status && typeof result.response === 'string'
                    ? result.response
                    : null;
                if (!token) { reject(new Error('mapbox_access_token não encontrado')); return; }
                resolve({ status: true, response: token });
            }, reject);
        });
    }

    setLibraries() { /* no-op — Mapbox não precisa de bibliotecas extras */ }

    importScriptWithPlaces(executeResolve = false) {
        return new Promise((resolve, reject) => {
            if (this.key) { resolve(); return; }

            const injectedToken = this._getInjectedToken();
            if (injectedToken) {
                this._setMapboxToken(injectedToken);
                resolve();
                return;
            }

            this.getKey().then(({ status, response }) => {
                if (!status) { reject(); return; }
                this._setMapboxToken(response);
                resolve();
            }).catch(reject);
        });
    }

    // ─── Criação e inicialização do mapa ─────────────────────────────────────

    initMap(id, position, callback = undefined) {
        const bad = (lat, lng) =>
            isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0) ||
            (Math.abs(lat - -3.7319) < 0.0002 && Math.abs(lng - -38.5267) < 0.0002) ||
            (Math.abs(lat - 42.40843) < 0.002 && Math.abs(lng - -71.0536625) < 0.002);

        let lat = position ? parseFloat(position.lat) : NaN;
        let lng = position ? parseFloat(position.lng) : NaN;
        if (bad(lat, lng)) {
            const saved = (typeof Session !== 'undefined') ? Session.getLocal('location') : null;
            const centralSelected = (typeof Session !== 'undefined') ? Session.get('centralSelected') : null;
            if (saved && !bad(parseFloat(saved.lat), parseFloat(saved.lng))) {
                lat = parseFloat(saved.lat);
                lng = parseFloat(saved.lng);
            } else if (centralSelected && !bad(parseFloat(centralSelected.latitude), parseFloat(centralSelected.longitude))) {
                lat = parseFloat(centralSelected.latitude);
                lng = parseFloat(centralSelected.longitude);
            } else {
                lat = -9.389;
                lng = -40.503;
            }
        }
        position = { lat, lng };

        if (this.map !== null) {
            this.map.setCenter([position.lng, position.lat]);
            this.resizeMap();
            return;
        }

        mapboxgl.accessToken = this.key || Session.get('mapboxToken') || '';

        this.map = new mapboxgl.Map({
            container: id,
            style: this.mapStyle,
            center: [position.lng, position.lat],
            zoom: this.defaultZoom,
            attributionControl: false,
        });
        this.map.setOptions = this.map.setOptions || function () {};

        this.map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

        // Marcador da central
        this._addImageMarker(position, this.icons.central, 35);

        // Pin de centro (segue o centro do mapa)
        this.pointCenter = this._createMarker(position, this.icons.center, 35);

        // Drag → desativa auto-zoom
        this.map.on('drag', () => {
            this.inRoute = false;
            if (typeof viewController !== 'undefined') {
                viewController.elementProperty.addClass('.option-gps-route', 'active');
            }
        });

        this.map.on('move', () => {
            if (!this.pointCenter) return;
            const { lat, lng } = this.map.getCenter();
            this.pointCenter.setLngLat([lng, lat]);
        });

        this.map.on('moveend', () => {
            if (!this.pointCenter) return;
            if (this.pointCenter.isOnMap()) {
                this.verifyAddressByCenter();
            }
        });

        this.isImportMap = true;

        this.map.once('load', () => {
            this._initResizeObserver();
            this.resizeMap();
            if (typeof callback === 'function') callback();
        });
    }

    resizeMap() {
        if (!this.map) return;
        requestAnimationFrame(() => {
            this.map.resize();
        });
    }

    _initResizeObserver() {
        const container = document.getElementById('mapClient');
        if (!container || this._resizeObserver) return;
        this._resizeObserver = new ResizeObserver(() => this.resizeMap());
        this._resizeObserver.observe(container);
    }

    // ─── Endereço pelo centro do mapa ─────────────────────────────────────────

    verifyAddressByCenter() {
        const nameEl = document.getElementById('namePointUser');
        if (!nameEl) return;
        nameEl.innerHTML = '';
        nameEl.classList.add('address-loading');
        nameEl.setAttribute('value', JSON.stringify(null));

        clearTimeout(this.timeoutAddressPoint);
        this.timeoutAddressPoint = setTimeout(() => {
            const { lat, lng } = this.map.getCenter();
            ConnectionServer.sendRequestMain(
                `geocoding/search?latlng=${lat},${lng}`,
                'GET', null,
                ({ status, data }) => {
                    if (!nameEl) return;
                    nameEl.classList.remove('address-loading');
                    if (!status) { nameEl.innerHTML = 'Informações não encontrada'; return; }
                    nameEl.setAttribute('value', JSON.stringify(data));
                    nameEl.innerHTML = data.address;
                }
            );
        }, 150);
    }

    // ─── Marcadores de origem / destino ───────────────────────────────────────

    addPointClient(position) {
        if (this.locationClient) {
            this.locationClient.remove();
            this.map.setCenter([position.lng, position.lat]);
        }
        const { lat, lng } = this._getPointLatLng(position);
        const container = document.createElement('div');
        container.className = 'uber-origin-marker-wrap';
        container.innerHTML = `
            <div class="uber-origin-bubble">
                <span>Partida aqui</span>
            </div>
            <div class="uber-origin-pin">
                <span class="uber-origin-dot"></span>
                <span class="uber-origin-pulse"></span>
            </div>
        `;
        const marker = new mapboxgl.Marker({ element: container, anchor: 'bottom' })
            .setLngLat([lng, lat]);
        this.locationClient = this._wrapMarker(marker);
        if (this.locationClient) this.locationClient.setMap(this.map);
    }

    addPointClientWait(position) {
        if (this.locationClientTrip) {
            this.locationClientTrip.setLngLat([position.lng, position.lat]);
            return;
        }
        const { lat, lng } = this._getPointLatLng(position);
        const container = document.createElement('div');
        container.className = 'uber-origin-marker-wrap';
        container.innerHTML = `
            <div class="uber-origin-bubble">
                <span>Partida aqui</span>
            </div>
            <div class="uber-origin-pin">
                <span class="uber-origin-dot"></span>
                <span class="uber-origin-pulse"></span>
            </div>
        `;
        const marker = new mapboxgl.Marker({ element: container, anchor: 'bottom' })
            .setLngLat([lng, lat]);
        this.locationClientTrip = this._wrapMarker(marker);
        if (this.locationClientTrip) this.locationClientTrip.setMap(this.map);
    }

    addPointDestination(position) {
        if (this.locationDestination) this.locationDestination.remove();
        const { lat, lng } = this._getPointLatLng(position);
        const container = document.createElement('div');
        container.className = 'uber-dest-marker-wrap';
        container.innerHTML = `
            <div class="uber-dest-square">
                <span class="uber-dest-inner"></span>
            </div>
        `;
        const marker = new mapboxgl.Marker({ element: container, anchor: 'center' })
            .setLngLat([lng, lat]);
        this.locationDestination = this._wrapMarker(marker);
        if (this.locationDestination) this.locationDestination.setMap(this.map);
    }

    addWaypointInMap(waypoints) {
        this.waypoints.forEach(m => m.remove());
        this.waypoints = waypoints.map(point => {
            const m = this._createMarker(point, this.icons.waypoint, 25);
            if (m) m.setMap(this.map);
            return m;
        }).filter(Boolean);
    }

    removePointClient() {
        if (this.locationClient) { this.locationClient.remove(); this.locationClient = null; }
    }

    removePointDestination() {
        if (this.locationDestination) { this.locationDestination.remove(); this.locationDestination = null; }
    }

    // ─── makeMarker — retorna wrapper compatível com callers externos ─────────

    makeMarker(position, map, icon) {
        const size = (icon && icon.scaledSize) ? icon.scaledSize.width : 32;
        const marker = this._createMarker(position, icon && icon.url, size);
        if (marker && map) marker.setMap(map);
        if (!marker) return null;
        return marker;
    }

    // ─── Carro do motorista (popup customizado) ───────────────────────────────

    createCar({ lat, lng }, map) {
        initPop();
        const pop = new Popup(
            { lat, lng },
            `<div class="container-car tooltip-customer"><div id="carDriverMap"></div></div>`
        );
        pop.setMap(map);
        return pop;
    }

    // ─── Animação de movimento do marcador ────────────────────────────────────

    updateRouteInMap(positionWait, positionDriver, polyline) {
        const routePoints = Array.isArray(polyline)
            ? [positionDriver, ...polyline, positionWait]
            : MapService.decodePolyline(polyline);

        this._setRoutePolyline(routePoints);

        if (this.inRoute) this.zoomBetweenPoints(routePoints);

        if (this.pointDriver === null) {
            this.pointDriver = this.createCar(positionDriver, this.map);
            this.currentPosition = { ...positionDriver };
            return;
        }

        if (this.getDistanceFromLatLonInMeters(this.currentPosition, positionDriver) < 5) return;

        this.futurePosition = positionDriver;
        this.transition();
    }

    transition() {
        clearTimeout(this.timeOut);
        this.index = 0;
        this.deltaLat = (this.futurePosition.lat - this.currentPosition.lat) / this.numDeltas;
        this.deltaLng = (this.futurePosition.lng - this.currentPosition.lng) / this.numDeltas;
        this.moveMarker();
    }

    moveMarker() {
        if (!this.pointDriver) {
            clearTimeout(this.timeOut);
            this.timeOut = null;
            return;
        }

        const prevLat = this.currentPosition.lat;
        const prevLng = this.currentPosition.lng;

        this.currentPosition.lat += this.deltaLat;
        this.currentPosition.lng += this.deltaLng;

        const rotation = turf.bearing(
            [prevLng, prevLat],
            [this.currentPosition.lng, this.currentPosition.lat]
        );

        this.pointDriver.position = this.currentPosition;

        const el = document.getElementById('carDriverMap');
        if (el) el.style.transform = `rotate(${rotation}deg)`;

        if (this.index !== this.numDeltas) {
            this.index++;
            this.timeOut = setTimeout(() => this.moveMarker(), this.delay);
            return;
        }

        clearTimeout(this.timeOut);
        this.timeOut = null;
    }

    // ─── Rota / polyline ──────────────────────────────────────────────────────

    showRoute(origin, destination, waypoints = [], polyline) {
        this.addWaypointInMap(waypoints);
        const coords = MapService.decodePolyline(polyline);

        this._setRoutePolyline(coords);

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([origin.lng, origin.lat]);
        coords.forEach(p => bounds.extend([p.lng, p.lat]));
        bounds.extend([destination.lng, destination.lat]);

        this._afterLayoutSettles(() => this.map.fitBounds(bounds, { padding: this.paddingBoundsMap }));
    }

    resetToCentralView() {
        if (!this.map) return;

        const central = Session.get('centralSelected');
        if (!central) return;

        this._afterLayoutSettles(() => this.map.easeTo({
            center: [parseFloat(central.longitude), parseFloat(central.latitude)],
            zoom: this.defaultZoom,
        }));
    }

    _afterLayoutSettles(callback, delayMs = 700) {
        this.map.resize();
        setTimeout(() => { this.map.resize(); callback(); }, delayMs);
    }

    showRouteDriver(origin, destination, waypoints) {
        this.addWaypointInMap(waypoints);

        const coords = [origin, ...waypoints, destination];
        const bounds = new mapboxgl.LngLatBounds();
        coords.forEach(p => bounds.extend([p.lng, p.lat]));
        this.bounds = coords;

        if (this.inRoute) this.zoomBetweenPoints(coords);

        // Delegate routing to Mapbox Directions API via backend proxy
        const originStr = `${origin.lat},${origin.lng}`;
        const destStr = `${destination.lat},${destination.lng}`;
        const waypointStr = waypoints
            .map(point => this._formatLatLng(point))
            .filter(Boolean)
            .join('|');

        return new Promise(resolve => {
            ConnectionServer.sendRequestByUrl('/Directions/Direction', 'POST',
                { origin: originStr, destination: destStr, waypoints: waypointStr, key: this.key },
                result => {
                    if (result && result.routes && result.routes[0]) {
                        const pts = MapService.decodePolyline(result.routes[0].overview_polyline.points);
                        this._setRoutePolyline(pts, 'route-driver', 'route-driver-layer');
                    }
                    resolve(result);
                }
            );
        });
    }

    // showInRoute / removeInRoute — múltiplas rotas no mapa de monitoramento
    showInRoute(route) {
        const sourceId = `trip-route-${route.tripReference}`;
        const layerId = `trip-route-layer-${route.tripReference}`;

        const coords = MapService.decodePolyline(route.polyline)
            .map(p => [p.lng, p.lat]);

        const geojson = {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords },
        };

        this._withLoadedMap(() => {
            if (this.map.getSource(sourceId)) {
                this.map.getSource(sourceId).setData(geojson);
            } else {
                this.map.addSource(sourceId, { type: 'geojson', data: geojson });
                this.map.addLayer({
                    id: layerId,
                    type: 'line',
                    source: sourceId,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#000000', 'line-width': 1, 'line-opacity': 1 },
                });
            }
        });

        this._tripRoutes[route.tripReference] = { sourceId, layerId };
    }

    removeInRoute(route) {
        const ids = this._tripRoutes[route.tripReference];
        if (!ids) return;
        if (this.map.getLayer(ids.layerId)) this.map.removeLayer(ids.layerId);
        if (this.map.getSource(ids.sourceId)) this.map.removeSource(ids.sourceId);
        delete this._tripRoutes[route.tripReference];
    }

    // ─── Popups informativos ─────────────────────────────────────────────────

    addLegends(duration) {
        initPop();

        if (this.infoOrigin) { this.infoOrigin.setMap(null); this.infoOrigin = null; }
        if (this.infoDestination) { this.infoDestination.setMap(null); this.infoDestination = null; }

        this.infoOrigin = new Popup(
            this.locationClient.getPosition(),
            `<div class="container-origin popup-bubble-content">
                <div class="local">${document.querySelector("*[place='origin']").value}</div>
            </div>`
        );

        this.infoDestination = new Popup(
            this.locationDestination.getPosition(),
            `<div class="container-destination popup-bubble-content">
                <span>
                    <span class="time">${parseInt(duration)}</span>
                    <span class="minute">min</span>
                </span>
                <div class="local">${document.querySelector("*[place='destination']").value}</div>
            </div>`
        );

        this.infoOrigin.setMap(this.map);
        this.infoDestination.setMap(this.map);

        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    searchDriver(trip) {
        if (typeof initPop === "function") {
            try { initPop(); } catch (e) {}
        }

        if (this.pointCustomer) {
            try { this.pointCustomer.remove(); } catch (e) {}
            this.pointCustomer = null;
        }

        const rawLat = trip?.origin?.latitude ?? trip?.origin?.lat ?? 0;
        const rawLng = trip?.origin?.longitude ?? trip?.origin?.lng ?? 0;
        const lat = parseFloat(rawLat);
        const lng = parseFloat(rawLng);

        if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
            console.warn("searchDriver: Coordenadas de origem inválidas", trip?.origin);
            return;
        }

        const position = { lat, lng };

        if (typeof Popup !== "undefined") {
            try {
                this.infoSearch = new Popup(
                    position,
                    `<div class="point-local-customer">
                        <div class="container-search-driver">
                            <span class="time-search-trip"></span>
                        </div>
                    </div>`
                );

                if (this.map && typeof this.map.setCenter === "function") {
                    this.map.setCenter([position.lng, position.lat]);
                }
                if (this.infoSearch && typeof this.infoSearch.setMap === "function") {
                    this.infoSearch.setMap(this.map);
                }
            } catch (popErr) {
                console.warn("Erro ao instanciar Popup de busca:", popErr);
            }
        }
    }

    // ─── Remoção de overlays ──────────────────────────────────────────────────

    removeRoute() {
        if (this.locationClient) { this.locationClient.remove(); this.locationClient = null; }
        this._removeRouteLayer(this._routeSourceId, this._routeLayerId);
        this._routeAdded = false;
        if (this.locationDestination) this.locationDestination.remove();
        if (this.infoOrigin) { this.infoOrigin.setMap(null); this.infoOrigin = null; }
        if (this.infoDestination) { this.infoDestination.setMap(null); this.infoDestination = null; }
        this.addWaypointInMap([]);
    }

    removeDetalheMap() {
        this._removeRouteLayer(this._routeSourceId, this._routeLayerId);
        this._removeRouteLayer('route-driver', 'route-driver-layer');
        this._routeAdded = false;
        if (this.locationDestination) this.locationDestination.remove();
        if (this.infoOrigin) { this.infoOrigin.setMap(null); this.infoOrigin = null; }
        if (this.infoDestination) { this.infoDestination.setMap(null); this.infoDestination = null; }
        if (this.pointDriver) { this.pointDriver.setMap(null); this.pointDriver = null; }
        if (this.locationClient) { this.locationClient.remove(); this.locationClient = null; }
        if (this.locationClientTrip) { this.locationClientTrip.remove(); this.locationClientTrip = null; }
    }

    removeOnlyRoute() {
        this._removeRouteLayer(this._routeSourceId, this._routeLayerId);
        this._routeAdded = false;
        if (this.infoOrigin) { this.infoOrigin.setMap(null); this.infoOrigin = null; }
        if (this.infoDestination) { this.infoDestination.setMap(null); this.infoDestination = null; }
    }

    // ─── Zoom / bounds ────────────────────────────────────────────────────────

    zoomBetweenPoints(points) {
        if (typeof viewController !== 'undefined') {
            viewController.elementProperty.removeClass('.option-gps-route', 'active');
        }

        if (!this.locationClientTrip) return;

        const bounds = new mapboxgl.LngLatBounds();
        const waitPos = this.locationClientTrip.getLngLat();
        bounds.extend([waitPos.lng, waitPos.lat]);

        if (Array.isArray(points) && points.length > 0) {
            points.forEach(p => bounds.extend([p.lng, p.lat]));
        } else if (this.map.getSource(this._routeSourceId)) {
            const data = this.map.getSource(this._routeSourceId)._data;
            if (data && data.geometry && data.geometry.coordinates) {
                data.geometry.coordinates.forEach(c => bounds.extend(c));
            }
        }

        this.map.fitBounds(bounds, { padding: { top: 30, left: 20, right: 20, bottom: 30 } });
    }

    focusInRoute() {
        this.inRoute = true;
        this.zoomBetweenPoints();
    }

    setBoundsArray(bounds) {
        if (!bounds || bounds.length === 0) return;
        const mb = new mapboxgl.LngLatBounds();
        bounds.forEach(p => {
            if (p && p.lat != null && p.lng != null) mb.extend([p.lng, p.lat]);
        });
        if (!mb.isEmpty()) this.map.fitBounds(mb, { padding: 40 });
    }

    // ─── Polígono de área ─────────────────────────────────────────────────────

    showPolygon(area) {
        if (!this.map.loaded()) {
            this.map.once('idle', () => this.showPolygon(area));
            return;
        }

        const coords = area.map(p => [p.lng, p.lat]);
        if (coords.length && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
            coords.push(coords[0]); // fechar polígono
        }

        const geojson = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [coords] },
        };

        if (this.map.getSource(this._polygonSourceId)) {
            this.map.getSource(this._polygonSourceId).setData(geojson);
        } else {
            this.map.addSource(this._polygonSourceId, { type: 'geojson', data: geojson });
            this.map.addLayer({
                id: 'polygon-area-fill',
                type: 'fill',
                source: this._polygonSourceId,
                paint: { 'fill-color': '#FF0000', 'fill-opacity': 0.35 },
            });
            this.map.addLayer({
                id: 'polygon-area-border',
                type: 'line',
                source: this._polygonSourceId,
                paint: { 'line-color': '#FF0000', 'line-width': 2, 'line-opacity': 0.8 },
            });
        }

        const bounds = new mapboxgl.LngLatBounds();
        area.forEach(p => bounds.extend([p.lng, p.lat]));

        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const padding = isMobile ? this.paddingBoundsMap : { top: 50, left: 550, right: 50, bottom: 50 };
        this.map.fitBounds(bounds, { padding });

        this.polygonArea = {
            setMap: (map) => {
                if (map) {
                    this.showPolygon(area);
                    return;
                }
                if (this.map.getLayer('polygon-area-border')) this.map.removeLayer('polygon-area-border');
                if (this.map.getLayer('polygon-area-fill')) this.map.removeLayer('polygon-area-fill');
                if (this.map.getSource(this._polygonSourceId)) this.map.removeSource(this._polygonSourceId);
                this.polygonArea = null;
            },
        };
    }

    // ─── Imagem estática da rota (Mapbox Static Images) ───────────────────────

    getImgMapTrip(origin, destination, waypoints = []) {
        const token = this.key;
        return new Promise(resolve => {
            ConnectionServer.sendRequestByUrl('/Directions/Direction', 'POST',
                {
                    origin: `${origin.lat},${origin.lng}`,
                    destination: `${destination.lat},${destination.lng}`,
                    waypoints: waypoints.map(point => this._formatLatLng(point)).filter(Boolean).join('|'),
                    key: token,
                },
                result => {
                    if (!result || !result.routes || !result.routes[0]) {
                        resolve('');
                        return;
                    }
                    const polylineEnc = result.routes[0].overview_polyline.points;
                    const pts = MapService.decodePolyline(polylineEnc)
                        .map(p => [p.lng, p.lat]);

                    const overlay = {
                        type: 'Feature',
                        properties: {
                            stroke: '#000000',
                            'stroke-width': 3,
                        },
                        geometry: {
                            type: 'LineString',
                            coordinates: pts,
                        },
                    };

                    const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(${encodeURIComponent(JSON.stringify(overlay))})/auto/600x300@2x?access_token=${token}`;
                    resolve(url);
                }
            );
        });
    }

    // ─── Busca de endereço (backend) ──────────────────────────────────────────

    getAddressByLatLng(position) {
        return new Promise((resolve, reject) => {
            const { lat, lng } = this._getPointLatLng(position);
            ConnectionServer.sendRequestMain(
                `geocoding/search?latlng=${lat},${lng}`,
                'GET', null,
                ({ status, data }) => {
                    if (status && data) resolve(data);
                    else reject(new Error('Geocoding failed'));
                }
            );
        });
    }

    getDetailPlace(address) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain(`geocoding/search?address=${address}`, 'GET', null, resolve, reject);
        });
    }

    addSearchInInput(input, callback, preCallback) {
        let timeout = null;
        input.oninput = function () {
            clearTimeout(timeout);
            if (this.value.length === 0) return callback({ response: [] });
            if (preCallback) preCallback();
            timeout = setTimeout(() => {
                PlaceRepository
                    .searching(this.value, Session.getLocal('location'))
                    .then(callback);
            }, 1000);
        };
    }

    // ─── Zoom ─────────────────────────────────────────────────────────────────

    zoomIn() {
        if (!this.map) return;
        this.map.setZoom(Math.round(this.map.getZoom()) + 1);
    }

    zoomOut() {
        if (!this.map) return;
        this.map.setZoom(Math.max(1, Math.round(this.map.getZoom()) - 1));
    }

    // ─── Distância entre pontos (haversine) ───────────────────────────────────

    getDistanceFromLatLonInMeters(lastPosition, currentPosition) {
        const deg2rad = d => d * (Math.PI / 180);
        const R = 6371;
        const dLat = deg2rad(lastPosition.lat - currentPosition.lat);
        const dLng = deg2rad(lastPosition.lng - currentPosition.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(lastPosition.lat))
            * Math.cos(deg2rad(currentPosition.lat))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return parseInt((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000).toFixed());
    }

    // ─── Decode polyline (Google-encoded) ────────────────────────────────────

    static decodePolyline(encoded) {
        if (!encoded) return [];
        const poly = [];
        let index = 0, lat = 0, lng = 0;
        while (index < encoded.length) {
            let b, shift = 0, result = 0;
            do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            lat += (result & 1) ? ~(result >> 1) : (result >> 1);
            shift = 0; result = 0;
            do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            lng += (result & 1) ? ~(result >> 1) : (result >> 1);
            poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
        }
        return poly;
    }

    // ─── Privados ─────────────────────────────────────────────────────────────

    _createMarker(position, iconUrl, size = 32) {
        const { lat, lng } = this._getPointLatLng(position);
        let marker;

        if (iconUrl) {
            const el = document.createElement('img');
            el.src = iconUrl;
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            el.style.display = 'block';
            marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
                .setLngLat([lng, lat]);
        } else {
            marker = new mapboxgl.Marker({ anchor: 'bottom' }).setLngLat([lng, lat]);
        }

        return this._wrapMarker(marker);
    }

    _addImageMarker(position, iconUrl, size = 32) {
        const m = this._createMarker(position, iconUrl, size);
        if (m && this.map) m.setMap(this.map);
        return m;
    }

    _setRoutePolyline(points, sourceId, layerId) {
        sourceId = sourceId || this._routeSourceId;
        layerId = layerId || this._routeLayerId;

        if (!Array.isArray(points) || points.length === 0) return;

        const coords = points.map(p => [p.lng, p.lat]);
        const geojson = {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords },
        };

        this._withLoadedMap(() => {
            if (this.map.getSource(sourceId)) {
                this.map.getSource(sourceId).setData(geojson);
            } else {
                this.map.addSource(sourceId, { type: 'geojson', data: geojson });
                this.map.addLayer({
                    id: layerId,
                    type: 'line',
                    source: sourceId,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': '#111111',
                        'line-width': 2.5,
                        'line-opacity': 1,
                    },
                });
            }
        });
    }

    _removeRouteLayer(sourceId, layerId) {
        if (!this.map) return;
        this._withLoadedMap(() => {
            if (this.map.getLayer(layerId)) this.map.removeLayer(layerId);
            if (this.map.getSource(sourceId)) this.map.removeSource(sourceId);
        });
    }

    _withLoadedMap(callback) {
        if (!this.map) return;
        if (this.map.loaded()) callback();
        else this.map.once('idle', callback);
    }

    _getInjectedToken() {
        return typeof window._mapboxToken === 'string' && window._mapboxToken
            ? window._mapboxToken
            : null;
    }

    _setMapboxToken(token) {
        this.key = token;
        Session.set('mapboxToken', token);
        mapboxgl.accessToken = token;
    }

    _getPointLatLng(point) {
        if (!point) return null;
        return {
            lat: typeof point.lat === 'function' ? point.lat() : point.lat,
            lng: typeof point.lng === 'function' ? point.lng() : point.lng,
        };
    }

    _formatLatLng(point) {
        const normalizedPoint = point && {
            lat: point.lat != null ? point.lat : point.latitude,
            lng: point.lng != null ? point.lng : point.longitude,
        };
        const { lat, lng } = this._getPointLatLng(normalizedPoint) || {};
        if (lat == null || lng == null) return null;
        return `${lat},${lng}`;
    }

    _wrapMarker(marker) {
        const getPointLatLng = this._getPointLatLng.bind(this);

        return {
            _mbMarker: marker,
            _element: marker.getElement(),
            addTo(map) {
                marker.addTo(map);
                return this;
            },
            remove() {
                marker.remove();
            },
            setMap(map) {
                if (map) marker.addTo(map);
                else marker.remove();
            },
            setPosition(pos) {
                const { lat, lng } = getPointLatLng(pos);
                marker.setLngLat([lng, lat]);
            },
            getPosition() {
                const lngLat = marker.getLngLat();
                return {
                    lat: () => lngLat.lat,
                    lng: () => lngLat.lng,
                };
            },
            setLngLat(lngLat) {
                marker.setLngLat(lngLat);
            },
            getLngLat() {
                return marker.getLngLat();
            },
            isOnMap() {
                const element = marker.getElement();
                return !!(element && element.parentNode);
            },
        };
    }

    // Compatibilidade: estilo do mapa padrão (não usado pelo Mapbox diretamente)
    getStyleMapDefault() { return []; }
}
