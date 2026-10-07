class MonitoringRepository {
    static getMonitoringData(centralId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `central/monitoring/${centralId}`, 
                "GET", 
                null, 
                resolve, 
                reject
            );
        });
    }

    static getDriversStatus(centralId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `central/${centralId}/driver/positions?status=disponivel,corrida`, 
                "GET", 
                null, 
                (response) => {
                    if (response.status && response.response) {
                        const drivers = response.response;
                        const available = drivers.filter(d => d.status === 'disponivel').length;
                        const occupied = drivers.filter(d => d.status === 'corrida').length;
                        
                        resolve({
                            status: true,
                            data: {
                                available,
                                occupied,
                                total: drivers.length
                            }
                        });
                    } else {
                        resolve({
                            status: true,
                            data: { available: 0, occupied: 0, total: 0 }
                        });
                    }
                },
                (error) => {
                    console.error('Erro ao buscar drivers:', error);
                    reject(error);
                }
            );
        });
    }
}