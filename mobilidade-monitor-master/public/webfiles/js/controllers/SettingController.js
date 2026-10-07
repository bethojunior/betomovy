class SettingController {

    static ConfigByCity(method,data = '',id='')
    {
        switch (method) {
            case METHOD_REQUISITION['listar'] :
                return new Promise(resolve => {
                    ConnectionServer.sendRequest(
                        'city/'+Session.getValueInSessionLocal("citySelected","cityId")+'/config',
                        METHOD_REQUISITION['listar'],
                        '',
                        resolve,
                        '',
                        true
                        )
                });

            case METHOD_REQUISITION['editar']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest(
                        'city/'+Session.getValueInSessionLocal("citySelected","cityId")+'/config',
                        METHOD_REQUISITION['editar'],
                        data,
                        resolve,
                        '',
                        true
                    )
                });

            case METHOD_REQUISITION['inserir']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest(
                        'city/'+Session.getValueInSessionLocal("citySelected","cityId")+'/config',
                        METHOD_REQUISITION['inserir'],
                        '',
                        data,
                        '',
                        true
                    )
                });
        }

    }

    static getRadiusByCity(method,data = '',id='')
    {
        switch (method) {
            case METHOD_REQUISITION['listar'] :
                return new Promise(resolve => {
                    ConnectionServer.sendRequest(
                        'city/'+Session.getValueInSessionLocal("citySelected","cityId")+'/zone',
                        METHOD_REQUISITION['listar'],
                        '',
                        resolve,
                        '',
                        true
                    )
                });

            case METHOD_REQUISITION['editar']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest(
                        'city/'+Session.getValueInSessionLocal("citySelected","cityId")+'/zone/'+id,
                        METHOD_REQUISITION['editar'],
                        data,
                        resolve,
                        '',
                        true
                    )
                });

            case METHOD_REQUISITION['inserir']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest(
                        'city/'+Session.getValueInSessionLocal("citySelected","cityId")+'/zone',
                        METHOD_REQUISITION['inserir'],
                        data,
                        resolve,
                        '',
                        true
                    )
                });
        }

    }

    static listPendency() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`userPenaltiesType`, 'GET', {}, resolve, undefined, true);
        });
    }

    static updatePendency(id, value) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`userPenaltiesType/${id}`, 'PUT', value, resolve, undefined, true);
        });
    }

    static getServicesGlobals() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`externalServiceType/fully`, 'GET', null, resolve, undefined, true);
        });
    }

    static updateServicesGlobals(id, response) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`externalService/${id}`, 'PUT', response, resolve, undefined, true);
        });
    }

    static getExternalServicesByCity(cityId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`externalServiceType/fully?cityId=${cityId}`, 'GET', null, resolve, undefined, true);
        });
    }

    static updateExternalServicesByCity(metadata, requestParam) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`externalService/${requestParam}/city`, 'PUT', metadata, resolve, undefined, true);
        });
    }
}