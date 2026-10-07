elementProperty.addEventInElement('#open-modal-add-accessibilityTrip','onclick',function () {
    $('#modal-add-accessibilityTrip').modal('show')
});

elementProperty.addEventInElement('#save-new-things','onclick',function () {
    $('#modal-add-accessibilityTrip').modal('hide');
    swal('Novo item adcionado com sucesso','Verifica as mudanças no seu app','success');
});