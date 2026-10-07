const elementProperty = new ElementProperty();

const withdrawControler = new WithdrawController();

const url = document.URL;

const code = CodeSecurity.clearConfirmationCode(url.split("/").slice(-1).pop());

function showReceipt(recepit){
    elementProperty.getElement("#favored",element=> element.innerHTML = recepit.holderName);
    elementProperty.getElement("#agency",element=> element.innerHTML = recepit.agency);
    elementProperty.getElement("#account",element=> element.innerHTML = recepit.numberAccount);
    elementProperty.getElement("#codeConfirmation",element=> element.innerHTML = recepit.confirmationCode);
    elementProperty.getElement("#value",element=>
        element.value = `R$ ${MaskService.maskMoney(parseFloat(recepit.value))}`);

    const date = new Date(recepit['created_at']);

    const dateString = date.toLocaleString().split("/");

    elementProperty.getElement("#date",element=>{
        element.innerHTML = `${dateString[0]} ${DateCustom.getSigleMonth(date.getMonth())} ${dateString[2]}`;
    });

    elementProperty.getElement(".container-receipt",element=>{
        element.classList.add("active");
    });
}

withdrawControler.actionFind(code).then(({status,data})=>{
    if(!status) {
        swal("Atenção","Nenhum comprovante encontrado","warning");
        return;
    }

    showReceipt(data);
});