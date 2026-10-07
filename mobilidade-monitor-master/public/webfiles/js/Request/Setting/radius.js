class Radius extends SettingController{

    /**
     *
     * @param content
     */
    static insert(content)
    {
        if(!ValidateRadius.verify(content))
            return ReturnResponse.get(false,'Os campos precisam ser preenchidos','info');


        let parameters = ValidateRadius.init(content);
        preload(true);
        this.getRadiusByCity(METHOD_REQUISITION['inserir'],parameters).then(({status,response,message}) => {
            preload(false);
            if(!status){
                return ReturnResponse.get(false,message,'success');
            }
            ReturnResponse.get(true,message,'success');
        });
    }

    /**
     *
     * @param content
     * @param id
     */
    static update(content , id)
    {
        if(!ValidateRadius.verify(content))
            return ReturnResponse.get(false,'Os campos precisam ser preenchidos','info');

        let parameters = ValidateRadius.init(content);
        preload(true);
        this.getRadiusByCity(METHOD_REQUISITION['editar'],parameters,id).then(({status,response,message}) => {
            preload(false);
            if(!status)
                return ReturnResponse.get(false,message,'success');
            ReturnResponse.get(true,message,'success');
        });
    }
}
