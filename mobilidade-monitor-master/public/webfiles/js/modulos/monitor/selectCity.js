CityController.getActives().then(({status, data}) => {
    if (!status)
        return;
    preload(true);
    window.elementProperty.getElement("#listCityUser", element => {
        element.innerHTML = data.map(city => {
            return `<li  class="city-selected" city='${JSON.stringify(city)}' value='${JSON.stringify(getPathByPolygon(city.polygon))}'>
                        <div>
                            <div style="background-image: url(${environment.hosts.hostImageDefault})"></div>
                        </div>
                        <div>${NAME_APP}</div>
                        <div>${city.shortName ? city.shortName : city.nome}</div>
                    </li>`;
                    
        }).join("");
        preload(false)
        initEventSelectCity();
    })
});

/**
 *
 * @param stringPolygon {String}
 */
function getPathByPolygon(stringPolygon) {
    stringPolygon = stringPolygon.replace("POLYGON((", "").replace("))", "");

    return stringPolygon.split(",").map((locationString) => {
        const location = locationString.split(" ");

        return {lat: parseFloat(location[0]), lng: parseFloat(location[1])};
    });
}


if (Session.getLocal("pointsCity").length === 0)
    window.elementProperty.addClass(".container-select-location", "active");

function initEventSelectCity() {

    window.elementProperty.addEventInElement(".city-selected", "onclick", function () {
        window.elementProperty.addClass(".select-location", "active");

        const city = JSON.parse(this.getAttribute("city"));

        document.getElementById("nameCitySelected").innerHTML = city.nome;

        Session.setLocal("citySelected", city);
        Session.setLocal("pointsCity", JSON.parse(this.getAttribute("value")));

        location.reload();
    });
}

window.elementProperty.addEventInElement(".container-list-city", "onclick", function () {
    window.elementProperty.addClass(".container-select-location", "active");
});
