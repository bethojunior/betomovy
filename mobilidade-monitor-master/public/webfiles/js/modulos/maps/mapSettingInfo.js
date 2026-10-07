document.addEventListener("DOMContentLoaded", function () {
    const mapServices = ({data}) => {
        preload(false);
        Object.keys(data).map((attribute) => {
            document.getElementById(attribute).innerHTML = data[attribute];
        })
    };

    const listPriority = ({data}) => {
        document.querySelector("#prioritySearching").setAttribute("list", JSON.stringify(data.searching));
        document.querySelector("#priorityDirection").setAttribute("list", JSON.stringify(data.direction));
        document.querySelector("#priorityGeocoding").setAttribute("list", JSON.stringify(data.geocoding));

        document.querySelector("#prioritySearching").innerHTML = data.searching.map((item, index) => {
            return `${index + 1}º ${item}`
        }).join(", ");

        document.querySelector("#priorityDirection").innerHTML = data.direction.map((item, index) => {
            return `${index + 1}º ${item}`
        }).join(", ");

        document.querySelector("#priorityGeocoding").innerHTML = data.geocoding.map((item, index) => {
            return `${index + 1}º ${item}`
        }).join(", ");
    };

    const checkCustomerMapService = ({response}) => {
        if (response == true) {
            document.querySelector("#enable_custom_mode_of_map_services").innerHTML = 'Ligado';
        } else {
            document.querySelector("#enable_custom_mode_of_map_services").innerHTML = 'Desligado';
        }

    };

    const execute = [mapServices, listPriority, checkCustomerMapService];

    updateInfo();

    function updateInfo() {
        preload(true);

        Promise.all([
            getMapServices(),
            getListPriority(),
            getConfigByKey('enable_custom_mode_of_map_services')
        ]).then(values => {
            values.map((result, index) => {
                execute[index](result);
            });

            preload(false);
        })
    }

    function getMapServices() {
        return new Promise((resolve) => {
            ConnectionServer.sendRequestApi("Map/CheckServices", "GET", null, resolve)
        })
    }

    function getListPriority() {
        return new Promise((resolve) => {
            ConnectionServer.sendRequestApi("Map/ListPriorityService", "GET", null, resolve);
        });
    }

    function getConfigByKey(key) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/${key}`, "GET", null, resolve, reject, true);
        });
    }

    document.querySelector("#changePrioritySearching").onclick = () => {
        changeServicePriority('service_priority_searching', document.querySelector("#prioritySearching"));
    };

    document.querySelector("#changePriorityDirection").onclick = () => {
        changeServicePriority('service_priority_direction', document.querySelector("#priorityDirection"));
    };

    document.querySelector("#changePriorityGeocoding").onclick = () => {
        changeServicePriority('service_priority_geocoding', document.querySelector("#priorityGeocoding"));
    };

    function changeServicePriority(type, element) {
        const list = JSON.parse(element.getAttribute('list'));

        const item = list.splice(0, 1);

        list.push(...item);

        let data = {};
        data[type] = JSON.stringify(list);

        preload(true);

        MapSettingController.update(data).then(updateInfo);
    }
});