preload(true);
const elementProperty = new ElementProperty()
const userLogged              = Session.getCookie('user')
const establishmentController = new EstablishmentController()

const searchTrips = {
    establishmentId: userLogged.idEstablishment,
    page: 0,
    status: null,
    date: null,
}

const statusPortuguese = {
    finished    : "Finalizou" ,
    canceled    : "Cancelado" ,
    in_progress : "Em viagem",
    boarding    : "Embarcando",
    searching   : "Buscando"  ,
    accepted    : "Aceitou"   ,
}

let dataList = []
let lastPage


elementProperty.addEventInElement('.wrapper-filter-trip-modal','onclick', element => {
    if(element.target.classList.contains('show-modal')) {
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
        if(dateFilter[index].checked) {
            searchTrips.date = dateFilter[index].value === 'null' ? null : dateFilter[index].value
            isSearched = true
        }
    })

    Object.keys(statusFilter).map(index => {
        if(statusFilter[index].checked) {
            searchTrips.status = statusFilter[index].value  === 'null' ? null : statusFilter[index].value
            isSearched = true
        }
    })

    if(isSearched) {
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
        if(dateFilter[index].checked) {
            dateFilter[index].checked = !dateFilter[index].checked
        }
    })

    Object.keys(statusFilter).map(index => {
        if(statusFilter[index].checked) {
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
        .then(({data,status,message}) => {
            if(status) {
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

    let trips = renderFilter()

    data.map(trip => {
        trips += mountTrip(trip)
    })

    elementProperty.getElement('#trips-list', element => element.innerHTML += trips)
    preload(false);
}

function mountTrip(trip) {
    return `<div class="trip-item">
            <a class="access-trip"><img src="${HOST}webfiles/img/icon/right-arrow-down-yellow.png" alt="acessar corrida"></a>

            <div class="title-trip-item">
                <span class="driver-name"><img src="${HOST}webfiles/img/icon/driver.png" alt="Motorista">${trip.driverName}</span>
                <span class="passenger-name"><img src="${HOST}webfiles/img/icon/Arrive_icon.png" alt="Passageiro"> ${trip.customerName}</span>
            </div>

            <div class="trip-content">
                <div class="content-date-trip"><img src="${HOST}webfiles/img/icon/clock.png" alt="Data" /> <span class="date-trip">${FormatDate.brazilianFormat(trip.date)}</span></div>
                <div class="content-departure"><img src="${HOST}webfiles/img/icon/icon_verde.png" alt="Origem"/> <span class="departure">${!isMobile() ? ShortWords.reduceText(trip.originAddress) : ShortWords.reduceTextMobile(trip.originAddress)}</span></div>
                <div class="content-arrival">  <img src="${HOST}webfiles/img/icon/icon_vermelho.png" alt="Destino"/>   <span class="arrival">${trip.destinyAddress}</span></div>
            </div>

            <div class="footer-trip-item">
                <span class="trip-value"><img src="${HOST}webfiles/img/icon/dollar-coin-money.png" alt="Destino">  ${FormatNumber.formatReal(trip.price)}</span>
                <span class="trip-status">${statusPortuguese[trip.status]}</span>
            </div>

        </div>`
}
