document.addEventListener("DOMContentLoaded",function(){
    const elementProperty =  new ElementProperty();

    const splitUrl = location.href.split("/");

    const whoIndicatedId = splitUrl[splitUrl.length - 1];

    elementProperty.addEventInElement("#btnRequest","onclick",function(){
        const code = document.getElementById("code").value.toUpperCase();

        if (code.length <= 0) {
            SwalCustom.messageDialog("", "Informe o seu código de motorista", undefined, "warning");
            return;
        }

        if (!validateCode(code.toUpperCase())) {
            SwalCustom.messageDialog("", "Código inválido", undefined, "warning");
            return;
        }

        const driverId = parseInt(code.replace(/[^0-9]/g, ""));

        this.disabled = true;

        DriverController.indication({driverId,whoIndicatedId}).then(({status,data,message,errors})=>{
            if(!status) {
                SwalCustom.messageDialog("", message)
            }else {
                SwalCustom.messageDialog("", message,"success");
            }
        }).finally(()=>{
            this.disabled = false;
        });
    });

    function validateCode(value) {
        return /(([A-Z]){2})+(([0-9]){5})+(([A-Z]){1})/g.test(value)
    }
});