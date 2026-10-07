function validateFormPersonalData(dataDriver, isNacional = true) {


    if (!ValidateForm.validateNameComplete(dataDriver.driver.name)) {
        SwalCustom.messageDialog(i18next.t('label_input_name_complete'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }
    if(dataDriver.driver.document.replace(/\D/g, '').length <= 11 && isNacional) {
        if (!ValidateForm.validateCpf(dataDriver.driver.document.replace(/\D/g, ''))) {
            SwalCustom.messageDialog(i18next.t('label_invalid_cpf'), i18next.t('attention_message'), () => {
            }, "warning");
            return false;
        }
    } else if(dataDriver.driver.document.replace(/\D/g, '').length < 14 && isNacional){
        SwalCustom.messageDialog(i18next.t('label_invalid_cnpj'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }
    if (!ValidateForm.validateEmail(dataDriver.driver.email)) {
        SwalCustom.messageDialog(i18next.t('label_invalid_email'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }
    // if (!ValidateForm.validatePhone(dataDriver.driver.phone)) {
    //     SwalCustom.messageDialog("Telefone inválido", "Atenção", () => {
    //     }, "warning");
    //     return false;
    // }

    if (dataDriver.driver.gender.length === 0) {
        SwalCustom.messageDialog(i18next.t('label_select_gender'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.driver.password.length === 0) {
        SwalCustom.messageDialog(i18next.t('label_enter_password'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }
    if (dataDriver.driver.password.trim().length < 6) {
        SwalCustom.messageDialog(i18next.t('min_password_character'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    // getVerifyCode(dataDriver);
    // clearCode();

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
    return true;
    if (validateForm.verifyCode.toString() === validateForm.confirmationCode ||
        Session.get("codeSupport") === validateForm.confirmationCode) {
        return true;
    }

    SwalCustom.messageDialog("Codigo invalido", "Atenção", () => {
    }, "info");
    return false;
}


function validateMilitaryUser(dataDriver) {
    if (dataDriver.driver.militaryUser.militaryForceId.length === 0) {
        swal('Atenção', "Informe o tipo de força militar", 'warning');
        return false;
    }

    if (dataDriver.driver.militaryUser.militaryGraduationId.length === 0) {
        swal('Atenção', "Informe de patente", 'warning');
        return false;
    }

    if (dataDriver.driver.militaryUser.militaryStatusId.length === 0) {
        swal('Atenção', "Informe seu status atual", 'warning');
        return false;
    }

    if (dataDriver.driver.militaryUser.om.length === 0) {
        swal('Atenção', "Informe o número da OM", 'warning');
        return false;
    }

    return true;
}


function verifyPassword(dataDriver) {

    if (document.getElementById("repassowrd").value !== dataDriver.driver.password || dataDriver.driver.password.length === 0) {
        SwalCustom.messageDialog(i18next.t('label_passwords_do_not_match'), i18next.t('attention_message'), () => {            
        }, "warning");
        return false;
    }
    return true;
}

function verifyCompany(dataDriver){
    if(dataDriver.driver.cityId === null){
        SwalCustom.messageDialog(i18next.t('label_select_city'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.driver.stationId === null){
        SwalCustom.messageDialog("Selecione uma estação", "Atenção", () => {
        }, "warning");
        return false;
    }

   /* if(dataDriver.station.stationTypeId === null){
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
    const userLang = navigator.language.substring(0, 2);

    if(dataDriver.driver.numberCRLV.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_document_car'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.licensePlate.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_car_plate'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(userLang === 'pt') {
        let regex = /^[a-zA-Z]{3}[0-9]{4}\b/;
        let newRegex = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}\b/;

        if(!regex.test(dataDriver.car.licensePlate.replace("-","")) && !newRegex.test(dataDriver.car.licensePlate.replace("-","")) ){
            SwalCustom.messageDialog(i18next.t('label_invalid_car_plate'), i18next.t('attention_message'), () => {
            }, "warning");
            return false;
        }
    }

    if(dataDriver.car.renavam.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_renavam'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.markCar.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_brand_car'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.modelCar.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_model_car'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.colorCar.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_color_car'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.numberSeatingCar.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_number_seats'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.car.year.length === 0){
        SwalCustom.messageDialog(i18next.t('label_input_year_car'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocumentALVARA(dataDriver){
    if(dataDriver.driver.numberAlvara === null){
        SwalCustom.messageDialog(i18next.t('label_input_alvara_number'), i18next.t('attention_message'), () => {
        }, "warning");
        return false;
    }

    if(dataDriver.image.ALVARA === null){
        SwalCustom.messageDialog(i18next.t('label_take_photo_alvara'), i18next.t('attention_message'), () => {
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
        SwalCustom.messageDialog(i18next.t('label_select_profile_photo'), i18next.t('attention_message'), () => {
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
        // SwalCustom.messageDialog("Retire uma foto do seu rosto", "Atenção", () => {
        // }, "warning");
        // return false;
        return true;
    }
    return true;
}
