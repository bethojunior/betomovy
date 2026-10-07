let elementProperty = new ElementProperty();

elementProperty.addEventInElement('#filter-by-client','onclick',function () {
    elementProperty.getElement('#value-search-filter',these => {
        these.disabled = false;
    })
});

elementProperty.addEventInElement('.edit-user','onclick',function () {
    $('#modal-data-order-choose').modal('show');
});

elementProperty.addEventInElement('.delete-user','onclick',function () {
    SwalCustom.dialogConfirm('Deseja excluir esse usuário?','Essa ação é irreversível', status => {
        if(!status)
            return true;
        swal('Cliente excluído com sucesso','','success');
    });
});

elementProperty.addEventInElement('.release-user','onclick',function () {
    SwalCustom.dialogConfirm('Deseja bloquear esse usuário?','', status => {
        if(!status)
            return true;
        swal('Cliente bloqueado com sucesso','','success');
    });
});

elementProperty.addEventInElement('.historic-user','onclick',function () {
    $('#modal-historic-user').modal('show');
});

elementProperty.addEventInElement('.open-sale','onclick',function () {
    // window.location.href = '/sales/list/12';
    window.open( "/sales/list/12", "_blank");
});
