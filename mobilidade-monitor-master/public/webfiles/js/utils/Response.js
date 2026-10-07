class ReturnResponse {
    static get (status , response , icon = '')
    {
        if(status){
            return swal('Sucesso',response, icon = 'success')
        }
        return swal('Erro' ,response, icon = 'error');

    }
}