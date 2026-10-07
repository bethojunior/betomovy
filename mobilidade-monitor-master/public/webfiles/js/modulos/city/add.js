const loadCities = () => {
    const optionDefault = `<option value="" disabled selected>Selecione uma cidade</option>`;

    preload(true);
    CityController.getActives()
        .then((data) => data.data)
        .then((cities) => {
            document.querySelector("#cityId").innerHTML =
                optionDefault +
                cities
                    .map((city) => {
                        return `<option value='${city.cityId}' >${city.nome}</option>`;
                    })
                    .join("");
        })
        .finally(() => {
            preload(false);
        });
};

document.addEventListener("DOMContentLoaded", function () {
    loadCities();
    let drawingManager = null;
    let mapPolygon = null;

    const mapService = new MapService();

    const elementProperty = new ElementProperty();

    const manager = {
        estate: null,
        city: null,
        mapPolygon: null,
        drawingManager: null,
        shortName: null
    };

    let resultCountries = null;
    let resultCities = null;

    mapService.setLibraries("drawing");

    mapService.importScriptWithPlaces().then(() => {
        manager.mapPolygon = new google.maps.Polygon({
            paths: [],
            draggable: false, // turn off if it gets annoying
            editable: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });

        let polyOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true
        };
        //
        manager.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON,
                ]
            },
            markerOptions: {
                draggable: true
            },
            polylineOptions: {
                editable: true
            },
            polygonOptions: polyOptions,
        });

        google.maps.event.addListener(manager.drawingManager, 'polygoncomplete', function (polygon) {
            manager.drawingManager.setDrawingMode(null);

            manager.drawingManager.setOptions({
                drawingControl: false
            });

            let path = polygon.getPath();
            let coordinates = [];

            for (let i = 0; i < path.length; i++) {
                coordinates.push({
                    lat: path.getAt(i).lat(),
                    lng: path.getAt(i).lng()
                });
            }

            manager.mapPolygon.setPath(coordinates);

            polygon.setMap(null);

        });
    });

    $('#country').select2({
        placeholder: "Selecione um país",
        width: '100%',
        escapeMarkup: function (markup) {
            return markup;
        },
    }).on('change', function (e) {
        const countryId = $(this).val();

        if (countryId) {
            EstateController.getByCountry(countryId).then(({ status, response, message }) => {
                if (!status) {
                    SwalCustom.messageDialog("", message, "warning");
                    return;
                }

                $('#estate').val(null).trigger('change');

                elementProperty.getElement("#estate", element => {
                    element.innerHTML = response.map(estate => {
                        return `<option value='${JSON.stringify(estate)}'>${estate.name}</option>`;
                    }).join("");

                    const firstEstateJSON = response.length > 0 ? JSON.stringify(response[0]) : null;
                    $('#estate').val(firstEstateJSON).trigger('change');
                });
            });
        }
    });

    CountryController.getAllV2().then(({ status, response }) => {
            if (!status) {
                SwalCustom.messageDialog("", response, "warning");
                return;
            }

            elementProperty.getElement("#country", element => {
                element.innerHTML = response.map(country => {
                    return `
                            <option value=''>Selecione um país</option>
                            <option value='${country.id}'>${country.name}</option>
                           `;
                }).join("");
            });
        });

    $('#estate').select2({
        placeholder: "Selecione um estado",
        width: '100%'
    }).on('change', async function (e) {
        const selectedEstateJSON = $(this).val();

        if (selectedEstateJSON) {
            const selectedEstate = JSON.parse(selectedEstateJSON);

                resultCities = await fetch(`/json/geo/${selectedEstate.sigla.toLowerCase()}.json`).then(result => {
                    const contentType = result.headers.get("content-type");
                    return contentType.includes("application/json") ? result.json() : null;
                });

                if (!resultCities) {
                    CityController.getByEstateV2(selectedEstate.id).then(showCity);
                }else {
                    CityController.getByEstateV2(selectedEstate.id).then(result => showCity({...result, stateId: selectedEstate?.id}));
                }
            }
    });

    elementProperty.addEventInElement("#removeCity", "onclick", deleteCity);

    const showCity = ({ status, response: cities, stateId }) => {

        $('#city').select2({
            placeholder: "Selecione uma cidade",
            width: '100%',
            ajax: {
                url: () => "/dummy-url",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        searchTerm: params.term,
                        estateId: stateId
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.map(city => ({
                            id: city.id,
                            text: city.name, 
                            city: city 
                        }))
                    };
                },
                transport: function (params, success, failure) {
                    if (!params.data.searchTerm) {
                        return null;
                    }
                    CityController.getByEstateV2(stateId, false, params.data.searchTerm).then(response => {
                        if (response.status) {
                            success(response.response);
                        } else {
                            failure(response.message);
                            alert("Erro ao carregar cidades: " + response.message);
                        }
                    }).catch(failure);
                }
            }
        }).on('select2:select', function (e) {
            getRateCity(e.params.data.city);
        });

        cities = cities.map(city => {
            city.name = city.name.replace(/'/g, "");
            return city;
        });

        if(cities) {
            $('#city').select2('destroy').select2({
                data: cities.map(city => ({
                    id: city.id,
                    text: city.name,
                    city: city 
                }))
            });
        }
        elementProperty.getElement("#city", element => {
            const cityOptions = cities.map(city => {
                return `<option value='${JSON.stringify(city)}'>${city.name}</option>`;
            }).join("");
            element.innerHTML = cityOptions;

            if (cities.length === 1) {
                elementProperty.addEventInElement("#city", "onclick", getRateCity);
            } else {
                elementProperty.addEventInElement("#city", "onchange", getRateCity);
            }
        });
    };

    elementProperty.addEventInElement("#btnSearchLocal", "onclick", function () {
        const text = document.querySelector("#searchLocalText").value;

        const url = `https://nominatim.openstreetmap.org/search.php?q=${text}&polygon_geojson=1&format=json`;

        preload(true);
        ConnectionServer.sendRequestCustomer(url, "GET", null, (result) => {
            elementProperty.getElement("#listOptionCity", element => {
                element.innerHTML = result.filter(item => {
                    return item.geojson.type === "Polygon" || item.geojson.type === "MultiPolygon";
                }).map((city, index) => {
                    if (!city.geojson.coordinates[0].map)
                        return "";
                    return `<li class="list-group-item item-city" value='${index}'>
                            ${city.display_name}
                        </li>`;
                }).join("");
                preload(false);
            });

            elementProperty.addEventInElement(".item-city", "onclick", function () {
                $("#cityAreaModal").modal('hide');

                const item = result[this.getAttribute("value")];

                const bounds = [
                    {lat: parseFloat(item.boundingbox[0]), lng: parseFloat(item.boundingbox[2])},
                    {lat: parseFloat(item.boundingbox[1]), lng: parseFloat(item.boundingbox[3])},
                ];

                if (!item.geojson.coordinates[0].map){
                    SwalCustom.messageDialog("", "Não foi possível encontrar a cidade! Precisa cadastrar manualmente...", "info");

                    showDrawingTools();

                    return;
                }

                const polyline = getPolygon(item.geojson.coordinates[0]);

                manager.mapPolygon.setPath(polyline);

                elementProperty.removeClass(".map-city", "no-city");

                initMap({lat: parseFloat(item.lat), lng: parseFloat(item.lon)}, bounds);
            })
        });

        manager.city = JSON.parse(document.querySelector("#city").value);

        initMap({lat: 0, lng: 0});

        getCityData();
    })

    function getRateCity(cityQuery = null) {
        document.querySelector("#linkModal").hidden = false;
        const city = cityQuery || JSON.parse(document.querySelector("#city").value);
        manager.city = city;

        let local = null;
        let bounds = [];

        if (resultCities) {
            local = resultCities.features.find(item => {
                return city.name === item.properties.name;
            });

            if (local) {
                const polyline = getPolygon(local.geometry.coordinates[0]);

                bounds = [...polyline];

                manager.mapPolygon.setPath(polyline);

                elementProperty.removeClass(".map-city", "no-city");

                initMap({lat: 0, lng: 0}, bounds);
            }
        } else if (city.polygon) {
            const path = getPathByPolygon(city.polygon);

            bounds = [...path];

            manager.mapPolygon.setPath(path);

            elementProperty.removeClass(".map-city", "no-city");

            initMap({lat: 0, lng: 0}, bounds);
        }
        else {
            showSearchResultsModal();
            document.querySelector("#linkModal").hidden = false;
        }
    }

    function showSearchResultsModal() {
        $("#cityAreaModal").modal('show');
    }

    function getPathByPolygon(stringPolygon) {
        stringPolygon = stringPolygon.replace("POLYGON((", "").replace("))", "");

        return stringPolygon.split(",").map((locationString) => {
            const location = locationString.trim().split(" ");

            return { lat: parseFloat(location[1]), lng: parseFloat(location[0]) };
        });
    }

    function showDrawingTools() {
        const initialLocation = { lat: -14.235004, lng: -51.92528 };
        const initialBounds = [
            { lat: 4.610397, lng: -36.154775 },
            { lat: -14.235004, lng: -51.92528 },
        ];

        initMap(initialLocation, initialBounds, 3, false);
    }

    function getPolygon(coordinates) {
        if (coordinates.length <= 500)
            return coordinates.map(position => {
                return {lat: position[1], lng: position[0]}
            });

        return coordinates.filter((item, index) => {
            return index % 5 === 0;
        }).map(position => {
            return {lat: position[1], lng: position[0]}
        });
    }

    function initMap(location, bounds = [], zoom = 10, timeout = true) {

        elementProperty.getElement(".map-city", element => {
            mapService.initMap(location, zoom, element);

            if (timeout){
                setTimeout(() => {
                    mapService.setBounds(...bounds);
                    manager.drawingManager.setMap(mapService.map);
                    manager.mapPolygon.setMap(mapService.map);
                }, 500);
            } else {
                mapService.setBounds(...bounds);
                manager.drawingManager.setMap(mapService.map);
                manager.mapPolygon.setMap(mapService.map);
            }
        })
    }

    elementProperty.addEventInElement("#savePolygon", "onclick", () => {
        if (manager.city === null)
            return SwalCustom.messageDialog("", "Selecione uma cidade", "info");

        if (manager.mapPolygon.getPath() == null)
            return SwalCustom.messageDialog("", "Selecione uma area do mapa");

        elementProperty.addClass(".modal-setting-city", "active");

        elementProperty.addEventInElement("#btnDeniedSetting", "onclick", () => {
            elementProperty.removeClass(".modal-setting-city", "active");
            getPolygonCoords().then((mirroringCityId) => {
                if (mirroringCityId != null)
                    setTimeout(() => {
                        location.reload()
                    }, 2000)
            });
        });

        elementProperty.addEventInElement("#btnAllowSetting", "onclick", () => {
            elementProperty.removeClass(".modal-setting-city", "active");
            getPolygonCoords().then((mirroringCityId) => {
                Session.deleteLocal("cities")
                preload(true);
                CityAreaController.mirroring({
                    cityMirrorId: document.querySelector("#settingCity").value,
                    mirroringCityId,
                    cityName: manager.city.name,
                    estateId: manager.city.estate_id
                }).then(({status, message}) => {
                    SwalCustom.messageDialog("", message, status ? "success" : "error").then(() => {
                        if (status)
                            location.reload();
                    });
                }).finally(() => {
                    preload(false)
                })
            });
        })
    });

    function getPolygonCoords() {

        let len = manager.mapPolygon.getPath().getLength();

        let polygon = [];

        for (let i = 0; i < len; i++) {
            polygon.push(manager.mapPolygon.getPath().getAt(i));
        }

        if (polygon.length === 0) {
            SwalCustom.messageDialog("", "Nenhuma área selecionada", "info");
            return;
        }

        polygon.push(polygon[0]);

        return new Promise(resolve => {
            preload(true);
            CityAreaController.insert(manager.city.id, polygon, manager.city.estate_id, manager.city.name, manager.city.name).then(({status, data}) => {
                if (!status)
                    return;

                SwalCustom.messageDialog("", "Região atualizada com sucesso !", "success");

                resolve(manager.city.id);
            }).finally(() => {
                preload(false);
            });
        })

    }

    function getCityData() {
        CityAreaController.get(manager.city.id).then(({status, data, response}) => {

            data = response;

            manager.drawingManager.setDrawingMode(null);

            if (!status) {
                return elementProperty.addClass(".map-city", "no-city");
            }

            elementProperty.removeClass(".map-city", "no-city");

            manager.mapPolygon.setPath(data.polygon);

            setTimeout(() => {
                mapService.setBounds(...data.polygon);
            }, 500)
        })
    }

    elementProperty.getElement("#settingCity", element => {
        element.innerHTML = Session.getLocal64("cities").map(city => {
            return `<option value='${city.cityId}'>${city.nome}</option>`
        }).join("");
    });

    function deleteCity(event) {
        event.preventDefault();
        const cityId = document.getElementById("cityID").value;
        if (cityId === "")
            return SwalCustom.messageDialog("", "Selecione uma cidade", "warning");


        preload(true);
        CityController.deleteCityRole(cityId).then(() => {
            preload(false);

            $('#removeCityModal').modal('hide');
            SwalCustom.messageDialog("", "Cidade removida com sucesso!", "success").then(() => {
                location.reload();
            });
        });
    }

    elementProperty.addEventInElement("#addCountryName", "onclick", addCountryName);

    $('#addStateModal').on('shown.bs.modal', function () {
        CountryController.getAllV2().then(({status, response}) => {
            preload(false);
            if (!status)
                return SwalCustom.messageDialog("", response, "warning");

            elementProperty.getElement("#countrySelect2", element => {
                element.innerHTML = response.map(country => {
                    return `<option value='${country.id}'>${country.name}</option>`;
                }).join("");
            });

            $('#countrySelect2').on('change', function (e) {
                const countryId = $(this).val();
                if (countryId) {
                    manager.countryId = countryId;
                }
            });
        });

        elementProperty.addEventInElement("#addStateName", "onclick", addStateName);
    });

    $('#addCityModal').on('shown.bs.modal', function () {
        CountryController.getAllV2().then(({status, response}) => {
            preload(false);
            if (!status)
                return SwalCustom.messageDialog("", response, "warning");

            elementProperty.getElement("#countryIdSelect", element => {
                element.innerHTML = response.map(country => {
                    return `<option value='${country.id}'>${country.name}</option>`;
                }).join("");
            });

            $('#countryIdSelect').on('change', function (e) {
                const countryId = $(this).val();
                if (countryId) {
                    loadEstatesByCountry(countryId);
                }
            });
        });

        function loadEstatesByCountry(countryId) {
            EstateController.getByCountry(countryId).then(({ status, response }) => {
                preload(false);
                if (!status)
                    return SwalCustom.messageDialog("", response, "warning");

                elementProperty.getElement("#estateIdSelect", element => {
                    element.innerHTML = response.map(estate => {
                        return `<option value='${estate.id}'>${estate.name}</option>`;
                    }).join("");
                });

                manager.estateId = response.length > 0 ? response[0].id : null;
            });
        }

        elementProperty.addEventInElement("#addCityName", "onclick", addCityName);
    });

    $('#removeCityNameModal').on('shown.bs.modal', function () {
        CountryController.getAllV2().then(({status, response}) => {
            preload(false);
            if (!status)
                return SwalCustom.messageDialog("", response, "warning");

            elementProperty.getElement("#countryIdSelectRemoveCity", element => {
                element.innerHTML = response.map(country => {
                    return `<option value='${country.id}'>${country.name}</option>`;
                }).join("");
            });

            $('#countryIdSelectRemoveCity').on('change', function (e) {
                const countryId = $(this).val();
                if (countryId) {
                    loadEstatesByCountry(countryId);
                }
            });
        });

        function loadEstatesByCountry(countryId) {
            EstateController.getByCountry(countryId).then(({ status, response }) => {
                preload(false);
                if (!status)
                    return SwalCustom.messageDialog("", response, "warning");

                elementProperty.getElement("#estateIdSelectRemoveCity", element => {
                    element.innerHTML = response.map(estate => {
                        return `<option value='${estate.id}'>${estate.name}</option>`;
                    }).join("");
                });

                $('#estateIdSelectRemoveCity').on('change', function (e) {
                    const estateId = $(this).val();
                    if (estateId) {
                        loadCitiesByEstate(estateId);
                    }
                });
            });
        }

        function loadCitiesByEstate(estateId) {
            CityController.getByEstate(estateId).then(({ status, response }) => {
                preload(false);
                if (!status)
                    return SwalCustom.messageDialog("", response, "warning");

                elementProperty.getElement("#cityIdSelectRemoveCity", element => {
                    element.innerHTML = response.map(city => {
                        return `<option value='${city.id}'>${city.name}</option>`;
                    }).join("");
                });

                manager.cityId = response.length > 0 ? response[0].cityId : null;
            });
        }

        elementProperty.addEventInElement("#removeCityName", "onclick", removeCityName);
    });

    function removeCityName() {
        const cityId = document.querySelector("#cityIdSelectRemoveCity").value;
        if (cityId === "") {
            return SwalCustom.messageDialog("", "Informe a cidade", "warning");
        }
        SwalCustom.confirm("Deseja remover o nome da cidade?", "Essa ação não poderá ser desfeita!", "warning", "Sim, remover!")
            .then((value) => {
            if (value) {
                preload(true);
                CityController.deleteCityName(cityId).then(() => {
                    preload(false);

                    $('#removeCityNameModal').modal('hide');
                    SwalCustom.messageDialog("", "Nome da Cidade removida com sucesso!", "success").then(() => {
                        location.reload();
                    });
                });
            }
        });
    }

    function addCityName() {
        const cityName = document.querySelector("#cityName").value;
        const estateId = document.querySelector("#estateIdSelect").value;
        if (cityName === "") {
            return SwalCustom.messageDialog("", "Informe o nome da cidade", "warning");
        }

        preload(true);
        CityController.create({nome: cityName, estado: estateId, statusId: 0, polygon: null}).then(({status, message, response}) => {
            preload(false);
            if (!status) {
                return SwalCustom.messageDialog("", response[0], "warning");
            }

            SwalCustom.messageDialog("", message, "success").then(() => {
                location.reload();
            });
        });
    }
    function addStateName() {
        const stateName = document.querySelector("#stateName").value;
        const stateShortName = "--";
        if (stateName === "")
            return SwalCustom.messageDialog("", "Informe o nome do estado", "warning");

        preload(true);
        EstateController.create({countryId: manager.countryId, nome: stateName, sigla: stateShortName })
            .then(({status, message, response}) => {
                preload(false);
                if (!status)
                    return SwalCustom.messageDialog("", response[0], "warning");

                SwalCustom.messageDialog("", message, "success").then(() => {
                    location.reload();
                });
        });
    }
    function addCountryName() {
        const countryName = document.querySelector("#countryName").value;
        const shortName = '-';
        if (countryName === "")
            return SwalCustom.messageDialog("", "Informe o nome do país", "warning");

        preload(true);
        CountryController.create({name: countryName, shortName}).then(({status, message, response}) => {
            preload(false);
            if (!status)
                return SwalCustom.messageDialog("", response[0], "warning");

            SwalCustom.messageDialog("", message, "success").then(() => {
                location.reload();
            });
        });
    }

});