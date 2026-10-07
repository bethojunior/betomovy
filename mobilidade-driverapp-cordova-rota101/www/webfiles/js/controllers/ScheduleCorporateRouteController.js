class ScheduleCorporateRouteController {
    static availableOnDate(date) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`ScheduleCorporateRoute/AvailableOnDate`, "POST", {date}, resolve, reject, undefined, false);
        });
    }

    static createSchedule(scheduleCorporateRouteId, schedule) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`ScheduleCorporateRoute/CreateSchedule`, "POST", {
                scheduleCorporateRouteId,
                schedule
            }, resolve, reject, undefined, false);
        });
    }

    static tripsByDriver(driverId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`ScheduleCorporateRoute/TripsByDriver`, "POST", {driverId}, resolve, reject, undefined, false);
        });
    }
}
