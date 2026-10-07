elementProperty.addEventInElement('#status-enterprise','onchange',function () {
    SwalCustom.dialogConfirm('Deseja alterar seu status de funcionamento','Essa alteração implicará em sua disponibilidade para pedidos',status => {
        if(status)
            return swal('Status atualizado com sucesso','','success');
    })
});
