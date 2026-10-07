preload(true);
const elementProperty = new ElementProperty()
const userLogged = Session.getCookie('user')
const establishmentController = new EstablishmentController()

const searchTrips = {
    establishmentId: userLogged.idEstablishment,
    page: 0,
    status: null,
    date: null,
}

const statusPortuguese = {
    finished: "Finalizou",
    canceled: "Cancelado",
    in_progress: "Em viagem",
    boarding: "Embarcando",
    searching: "Buscando",
    accepted: "Aceitou",
}

let dataList = []
let lastPage


elementProperty.addEventInElement('.wrapper-filter-trip-modal', 'onclick', element => {
    if (element.target.classList.contains('show-modal')) {
        element.target.classList.remove('show-modal')
        element.target.classList.add('hide-modal')
    }
})

function closeFilterTrip() {
    elementProperty.getElement('.wrapper-filter-trip-modal', element => {
        element.classList.remove('show-modal')
        element.classList.add('hide-modal')
    })
}

function showFilterModalTrips() {
    elementProperty.getElement('.wrapper-filter-trip-modal', element => {
        element.classList.remove('hide-modal')
        element.classList.add('show-modal')
    })
}

function filterTrips() {

    const dateFilter = document.getElementsByName('group-date')
    const statusFilter = document.getElementsByName('group-status')
    let isSearched = false

    Object.keys(dateFilter).map(index => {
        if (dateFilter[index].checked) {
            searchTrips.date = dateFilter[index].value === 'null' ? null : dateFilter[index].value
            isSearched = true
        }
    })

    Object.keys(statusFilter).map(index => {
        if (statusFilter[index].checked) {
            searchTrips.status = statusFilter[index].value === 'null' ? null : statusFilter[index].value
            isSearched = true
        }
    })

    if (isSearched) {
        searchTrips.page = 0
        dataList = []
        elementProperty.getElement('#trips-list', element => element.innerHTML = "")
        loadTrips(searchTrips)
        closeFilterTrip()
    }

}

function cleanFilterTrips() {
    const dateFilter = document.getElementsByName('group-date')
    const statusFilter = document.getElementsByName('group-status')

    Object.keys(dateFilter).map(index => {
        if (dateFilter[index].checked) {
            dateFilter[index].checked = !dateFilter[index].checked
        }
    })

    Object.keys(statusFilter).map(index => {
        if (statusFilter[index].checked) {
            statusFilter[index].checked = !statusFilter[index].checked
        }
    })

    elementProperty.getElement('#trips-list', element => element.innerHTML = "")

    searchTrips.page = 0
    searchTrips.status = null
    searchTrips.date = null
    loadTrips(searchTrips)

}

function loadTrips(searchObj) {
    searchObj.page++
    establishmentController
        .getEstablishimentTrips(searchObj)
        .then(({data, status, message}) => {
            if (status) {
                dataList = data.trips
                lastPage = data.paginate.lastPage
                mountTrips(dataList)
                return
            }

        })

}

function renderFilter() {
    return `<div class="filter-trip-content" onclick="showFilterModalTrips(this)">
                    <div class="box waves-effect waves-light">
                        <img src="${HOST}webfiles/img/icon/filter.png" alt="Filtro" id="filter-trips">
                    </div>
                </div>`
}

function mountTrips(data) {

    if(isMobile()){
        return;
    }
    elementProperty.getElement('#trips-list', element => {
        element.innerHTML = data.map((trip, index) => {
            return mountTrip(trip, index)
        }).join("")
    });

    elementProperty.addEventInElement(".info-basic-trip", "onclick", function () {
        const _that = this;

        elementProperty.getElement(".more-info-trips", element => {
            if ("moreInfo" + _that.getAttribute("value") !== element.getAttribute("id"))
                element.hidden = true
        });
        elementProperty.getElement("#moreInfo" + this.getAttribute("value"),
            element => element.hidden = !element.hidden);
    });

    preload(false);
}

function mountTrip(trip, index) {
    console.log(trip)
    return `<tr class="info-basic-trip" value="${index}">
                <td>${FormatDate.brazilianFormat(trip.date)}</td>
                <td>Jose Teste</td>
                <td>${trip.driverName}</td>
                <td>NÃO INFORMADO</td>
                <td>${FormatNumber.formatReal(trip.price)}</td>
            </tr>
            <tr id="moreInfo${index}" class="more-info-trips" hidden>
                <td COLSPAN="5" ROWSPAN="1">
                   <div class="map-trip"></div>
                   <div class="container-more-info">
                        <ul>
                            <li>
                                <div class="cicler-customer"></div>
                                <div>${trip.originAddress}</div>
                            </li>
                            <li>
                                <div class="cicler-customer"></div>
                                <div>${trip.destinyAddress}</div>
                            </li>
                        </ul>
                        <div class="row info-trip-detalhe">
                           <div class="col s6">
                               <div>MOTORISTA: ${trip.driverName}</div>
                               <div>PLACA: NÃO INFORMADO</div>
                           </div>
                           <div class="col s6">
                               <div>PAGAMENTO: NÃO INFORMADO</div>
                               <div>CLIENTE: ${trip.customerName}</div>
                               <div>FONE:</div>
                           </div>
                        </div>
                   </div>
                </td>
            </tr>
    `
}
