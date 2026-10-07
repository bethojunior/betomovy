class Cancellation extends FinancialController{

    static insert(page, content , checked)
    {
        return new Promise(resolve => {
            let parameters = ValidateCancellation.init(content , false);
            if(document.getElementById(checked).checked){
                parameters.withTrash = true;
            }else{
                parameters.withTrash = '';
            }
            preload(true);
            this.cancellationFee(page, parameters).then(({status,response,message}) => {
                preload(false);
                if(!status){
                    resolve(false);
                    return ReturnResponse.get(false,message,'success');
                }
                resolve(response);
            });
        })
    }

}