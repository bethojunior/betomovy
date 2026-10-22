function validateFormPersonalData(dataDriver) {

    if (!ValidateForm.validateNameComplete(dataDriver.driver.name)) {
        SwalCustom.messageDialog("Informe o nome do usuario completo", "Atenção", () => {
        }, "warning");
        return false;
    }

    if (!dataDriver.driver.document || dataDriver.driver.document.trim().length === 0) {
        dataDriver.driver.document = 'DOC' + Date.now();
    }

    if (!ValidateForm.validateEmail(dataDriver.driver.email)) {
        SwalCustom.messageDialog("E-mail inválido", "Atenção", () => {
        }, "warning");
        return false;
    }
    if (!ValidateForm.validatePhone(dataDriver.driver.phone)) {
        SwalCustom.messageDialog("Telefone inválido", "Atenção", () => {
        }, "warning");
        return false;
    }

    if (dataDriver.driver.gender.length === 0) {
        SwalCustom.messageDialog("Selecione um gênero", "Atenção", () => {
        }, "warning");
        return false;
    }

    //getVerifyCode(dataDriver);
    //clearCode();

    return true;
}

function getVerifyCode(dataDriver) {
    const driverController = new DriverController();

    driverController.sendConfirmationCode(dataDriver.driver.phone).then(result => {
        document.getElementById("verifyCode").value = result.data.sms;
    });
}

function clearCode() {
    const elementProperty = new ElementProperty();

    elementProperty.getElement(".code-phone", element => {
        element.value = "";
    });
}

function verifyCode(validateForm) {
    if (validateForm.verifyCode.toString() === validateForm.confirmationCode ||
        Session.get("codeSupport") === validateForm.confirmationCode) {
        return true;
    }

    SwalCustom.messageDialog("Codigo invalido", "Atenção", () => {
    }, "info");
    return false;
}


function verifyPassword(dataDriver) {

    if (document.getElementById("repassowrd").value !== dataDriver.driver.password || dataDriver.driver.password.length === 0) {
        SwalCustom.messageDialog("As senhas não conferem", "Atenção", () => {
        }, "warning");
        return false;
    }
    return true;
}

function verifyCompany(dataDriver){
    if(dataDriver.driver.cityId === null){
        SwalCustom.messageDialog("Selecione uma cidade", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.driver.stationId === null){
        SwalCustom.messageDialog("Selecione uma estação", "Atenção", () => {
        }, "warning");
        return false;
    }

  /*  if(dataDriver.station.stationTypeId === null){
        SwalCustom.messageDialog("Selecione o tipo do ponto", "Atenção", () => {
        }, "warning");
        return false;
    }
    if(dataDriver.station.name.length === 0){
        SwalCustom.messageDialog("Informe o nome do ponto", "Atenção", () => {
        }, "warning");
        return false;
    }
    if(dataDriver.station.address.length === 0){
        SwalCustom.messageDialog("Informe o endereço do ponto", "Atenção", () => {
        }, "warning");
        return false;
    }*/
    return true;
}
function verifyDocumentCNH(dataDriver){
    if(dataDriver.driver.numberCNH.length === 0){
        SwalCustom.messageDialog("Por favor digite o número da CNH", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.CNH === null){
        SwalCustom.messageDialog("Retire uma foto  do seu CNH", "Atenção", () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocumentCRLV(dataDriver){

    if(dataDriver.driver.numberCRLV.length === 0){
        SwalCustom.messageDialog("Por favor digite o número documento do carro", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.licensePlate.length === 0){
        SwalCustom.messageDialog("Por favor digite a placa do carro", "Atenção", () => {
        }, "warning");
        return false;
    }

    let regex = /^[a-zA-Z]{3}[0-9]{4}\b/;
    let newRegex = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}\b/;

    if(!regex.test(dataDriver.car.licensePlate.replace("-","")) && !newRegex.test(dataDriver.car.licensePlate.replace("-","")) ){
        SwalCustom.messageDialog("a placa do carro está inválida", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.renavam.length === 0){
        SwalCustom.messageDialog("Por favor digite o renavam", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.markCar.length === 0){
        SwalCustom.messageDialog("Por favor digite o marcar do carro", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.modelCar.length === 0){
        SwalCustom.messageDialog("Por favor digite o modelo do carro", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.colorCar.length === 0){
        SwalCustom.messageDialog("Por favor digite  a cor do carro", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.numberSeatingCar.length === 0){
        SwalCustom.messageDialog("Por favor digite o número de assentos", "Atenção", () => {
        }, "warning");
        return false;
    }
    if(dataDriver.car.year.length === 0){
        SwalCustom.messageDialog("Informe o ano do carro", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.CRLV === null){
        SwalCustom.messageDialog("Retire uma foto do seu CRLV", "Atenção", () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocumentALVARA(dataDriver){
    if(dataDriver.driver.numberAlvara === null){
        SwalCustom.messageDialog("Por favor digite o número do ALVARÁ", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.ALVARA === null){
        SwalCustom.messageDialog("Retire uma foto do seu ALVARA", "Atenção", () => {
        }, "warning");
        return false;
    }

    return true;
}


function verifyDocumentCriminalRecord(dataDriver){
    if(dataDriver.driver.numberCriminalRecord.length === 0){
        SwalCustom.messageDialog("Por favor, digite o número do atestado de antecedentes criminais", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.CRIMINAL_RECORD === undefined){
        SwalCustom.messageDialog("Por favor, informer a certidão de antecedentes criminais", "Atenção", () => {
        }, "warning");
        return false;
    }

    return true;
}


function verifyDocumentProfile(dataDriver){
    if(dataDriver.image.PROFILE === null){
        SwalCustom.messageDialog("Retire uma foto do seu rosto", "Atenção", () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocument(dataDriver){
    if(dataDriver.image.CNH === null){
        SwalCustom.messageDialog("Retire uma foto  do seu CNH", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.CRLV === null){
        SwalCustom.messageDialog("Retire uma foto do seu CRLV", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.ALVARA === null){
        SwalCustom.messageDialog("Retire uma foto do seu ALVARA", "Atenção", () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.PROFILE === null){
        SwalCustom.messageDialog("Retire uma foto do seu rosto", "Atenção", () => {
        }, "warning");
        return false;
    }
    return true;
}