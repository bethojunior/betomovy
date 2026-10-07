class MonitorController {
    currentQuantities() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('dashboard/currentQuantities', "GET", {}, resolve,false,true)
        })
    }

    eventEstablishment() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('monitor/establishment/events', 'GET', {}, resolve)
        })
    }

    eventDriver() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('monitor/driver/events', 'GET', {}, resolve)
        })
    }

    quantities() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('dashboard/tripQuantities', 'GET', {}, resolve, reject, true)
        })
    }

    activeTrips() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('dashboard/activeTrips', 'GET', {}, resolve, reject,true)
        })
    }

    filter() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('monitor/trip/quantities', 'GET', {}, resolve);
        })
    }

    filterTrip(type = 'scheduled') {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('scheduled/trip?status=' + type, 'GET', {}, resolve, undefined, true);
        })
    }

    static publicities() {
        return new Promise((resolve) => {
            ConnectionServer.simpleRequest(`${environment.hosts.hostGlobal}publicities`, "GET", null, resolve)
        })
    }


}