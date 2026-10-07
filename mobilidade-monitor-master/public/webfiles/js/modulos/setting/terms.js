
elementProperty.addEventInElement('#send-driver','onclick',function () {
    preload(true);
    let form = new FormData();
    form.append('driver',document.getElementById('term-driver').files[0]);
    SettingsController.inertTerms(form).then(({status,response}) => {
        preload(false);
        if(status)
            return swal('','Termos atualizados com sucesso','success');

        swal('Erro ao atualizar termos','Contate o suporte','error');
    });
});

elementProperty.addEventInElement('#send-costumer','onclick',function () {
    let form = new FormData();
    form.append('customer',document.getElementById('term-customer').files[0]);
    SettingsController.inertTerms(form).then(({status,response}) => {
        preload(false);
        if(status)
            return swal('','Termos atualizados com sucesso','success');

        swal('Erro ao atualizar termos','Contate o suporte','error');
    });
});