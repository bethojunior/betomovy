function addEventDataUser(){
    elementProperty.addEventInElement("#btn-user-info","onclick",function(){
        elementProperty.getElement("#name-user",element=>{
            establishment.user.name = element.value;
        });
        elementProperty.getElement("#email-user",element=>{
            establishment.user.email = element.value;
        });
        elementProperty.getElement("#cpf-user",element=>{
            establishment.user.document = element.value;
        });
        elementProperty.getElement("#phone-user",element=>{
            establishment.user.phone = element.value;
        });
        elementProperty.getElement("#password-user",element=>{
            establishment.user.password = element.value;
        });
        validateDataUser();
    });
}

function validateDataUser(){
    if(establishment.user.name.length === 0){
        SimpleSwall.modalError("Informe o nome do usuario");
        return;
    }
    establishment.user.nickname = establishment.user.name.split(" ")[0];

    if(establishment.user.email.length === 0){
        SimpleSwall.modalError("Informe o email");
        return;
    }
    if(establishment.user.document.length === 0){
        SimpleSwall.modalError("Informe o cpf");
        return;
    }
    if(establishment.user.phone.length === 0){
        SimpleSwall.modalError("Informe o telefone");
        return;
    }
    if(establishment.user.password.length < 5){
        SimpleSwall.modalError("A senha deve contém pelo menos 5 digitos");
        return;
    }

    if(document.getElementById("confirm-password-user").value !== establishment.user.password){
        SimpleSwall.modalError("Senha de confirmação não corresponde a senha");
        return;
    }

    if(!checkCPF(establishment.user.document)) {
        swal('CPF inválido','','warning')
            .then(() => document.getElementById('document-bank').focus())
        return
    }

    renderBankInfo();
}