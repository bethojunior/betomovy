document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#formRequestDelete", "onsubmit", function (event) {
        event.preventDefault();

        const data = {
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value
        }
        preload(true)
        request(data).then((response)=>{
            preload(false);
            SwalCustom.messageDialog("",!response.status ? "E-mail ou senha inválido" : "Sua conta foi excluida com sucesso",()=>{
                if(response.status)
                   location.reload();
            }, response.status ?  "success" : "info");
        })
    });

    function request(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("customer/requestDeleteData", "POST", data,resolve,reject,undefined, false);
        })
    }
});