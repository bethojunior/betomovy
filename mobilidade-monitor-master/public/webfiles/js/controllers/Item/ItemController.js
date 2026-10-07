class ItemController {

    static request(method, params, id = false)
    {
        switch (method) {

            case METHOD_REQUISITION['listar']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest('accessibility/obstacle',method,params,resolve,false,true);
                });

            case METHOD_REQUISITION['deletar']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest('accessibility/obstacle/'+id,'DELETE',params,resolve,false,true);
                });

            case METHOD_REQUISITION['inserir']:
                return ConnectionServer.sendRequestWithFiles('accessibility/obstacle','POST',params,true);

        }
    }

    static priceObstacle(method , params = false , id = false)
    {
        switch (method) {

            case METHOD_REQUISITION['listar']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest(
                        'price/obstacle?cityId='+Session.getValueInSessionLocal("citySelected","cityId"), method,params,resolve,false,true);
                });

            case METHOD_REQUISITION['deletar']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest('price/obstacle/'+id,'DELETE',params,resolve,false,true);
                });

            case METHOD_REQUISITION['inserir']:
                return new Promise(resolve => {
                    ConnectionServer.sendRequest('price/obstacle','POST',params,resolve,'',true);
                })

        }
    }

}