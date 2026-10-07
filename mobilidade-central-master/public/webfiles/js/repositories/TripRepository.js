class TripRepository {
    static getTripType(){
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest("tripType","GET",null ,resolve,reject);
        });
    }

    static newTrip(trip){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("trip","POST",trip,resolve,reject);
        })
    }

    static newTripScheduledBatch(trip){
        // Lote é processado sequencialmente no back — 30s fixo não escala com
        // a quantidade de agendamentos, encerrando a requisição antes do back
        // terminar (viagens continuam sendo criadas, só o front desiste cedo).
        const scheduleCount = Array.isArray(trip.schedules) ? trip.schedules.length : 1;
        const timeout = Math.max(30000, scheduleCount * 5000);

        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestWithTimeout("trip/scheduled/batch","POST",trip,resolve,reject,timeout);
        })
    }

    static get(tripReference){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`trip/${tripReference}`,"GET",null,resolve,reject);
        });
    }

    static cancel(tripReference, scope){
        // scope "all" cancela o lote inteiro no back (mesmo problema do
        // trip/scheduled/batch) — mas aqui o front não sabe de antemão quantos
        // itens tem o lote, então usa um teto fixo generoso em vez de escalar
        // por quantidade (agendamento em lote é limitado a 30 datas).
        const timeout = scope === "all" ? 150000 : 30000;

        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestWithTimeout(`trip/${tripReference}/cancel`,"PUT",scope ? {scope} : null,resolve,reject,timeout);
        });
    }

    static updateScheduled(tripReference, data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`trip/${tripReference}/schedule`,"PUT",data,resolve,reject);
        });
    }
}