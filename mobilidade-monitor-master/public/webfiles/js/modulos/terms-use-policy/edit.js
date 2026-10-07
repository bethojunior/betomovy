const elementProperty = new ElementProperty();

getTermByType();

function getTermByType(){
    preload(true);

    const type = window.location.href.split('/')[window.location.href.split('/').length - 1];

    TermsUsePolicyController.getTermByType(type).then(resolve => {
        let data = resolve.response;

        document.getElementById("type-term").value = data.type;
        document.getElementById("description-term").value = data.description;
        preload(false);
    });
}

elementProperty.addEventInElement("#save-terms", "onclick", function () {
    preload(true);
    const data = {
        type: document.getElementById("type-term").value,
        description: document.getElementById("description-term").value
    }

    TermsUsePolicyController.updateTerm(data).then(resolve => {
        preload(false);

        if (resolve.status) {
            swal('Termos atualizados com sucesso!', '', 'success');
            window.location = '/termsusepolicy/list';
        } else {
            swal('Erro ao atualizar teroms!', '', 'error');
        }
    });
});