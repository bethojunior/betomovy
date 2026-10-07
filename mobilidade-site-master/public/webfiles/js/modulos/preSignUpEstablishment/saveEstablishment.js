function saveEstablishment() {
    elementProperty
        .addEventInElement('#btn-save-info', 'onclick', () => {
            preload(true);
            EstablishmentController.insertEstablishment({ establishment },images, ({ status, message }) => {
                preload(false);
                if(status) {
                    swal('Estabelecimento cadastrado com sucesso','','success')
                        .then(() => window.location.reload())
                    return
                }

                swal('Erro ao cadastrar o estabelecimento',message,'warning')
                return
            })
        })
}

function addEmployeeAgain() {
    elementProperty
        .addEventInElement('#btn-new-employee-info', 'onclick', () => renderAddEmployee())
}