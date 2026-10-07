class Indication extends FinancialController{

    static insert(content)
    {
        return new Promise(resolve => {
            if(!ValidateIndication.verify(content))
                return ReturnResponse.get(false,'Os campos precisam ser preenchidos','info');

            let parameters = ValidateIndication.init(content);
            preload(true);
            this.referralEarnings(parameters).then(({status,response,message}) => {
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
