const removeValidation = getTextTranslate("sign-up", "remove-mask");
const FILE_CONTEXT = "www/webfiles/js/modulos/validator/validateSignup";

let logger;
getPulseLogger().then(l => logger = l).catch(() => {});

function validateFormPersonalData(dataDriver) {
    if (!ValidateForm.validateNameComplete(dataDriver.driver.name)) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "name-user-invalid"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    if (!ValidateForm.validateEmail(dataDriver.driver.email)) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "email-user-invalid"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }
    
    if (!removeValidation && !ValidateForm.validatePhone(dataDriver.driver.phone)) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "phone-user-invalid"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    if (dataDriver.driver.gender.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "gender-user-invalid"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    return true;
}

function getVerifyCode(dataDriver) {
    const driverController = new DriverController();

    navigator.geolocation.getCurrentPosition(
        (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        },
        (error) => {    
            if (logger) logger.error(`Erro localização SMS: ${error.message || error}`, FILE_CONTEXT);
        },
    );

    const payload = {
        number: dataDriver.driver.phone,
        latitude: latitude,
        longitude: longitude
    };

    driverController.sendConfirmationCode(payload).then(result => {
        document.getElementById("verifyCode").value = result.data.sms;
    }).catch(error => {
        if (logger) logger.error(`Erro SMS: ${error.message || error}`, FILE_CONTEXT);
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

    SwalCustom.messageDialog(getTextTranslate("sign-up", "confirmation-code-invalid"), getTextTranslate("sign-up", "title-required"), () => {}, "info");
    return false;
}


function verifyPassword(dataDriver) {

    if (document.getElementById("repassowrd").value !== dataDriver.driver.password || dataDriver.driver.password.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "passwords-do-not-match"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }
    return true;
}

function validateMilitaryUser(dataDriver) {
    if (dataDriver.driver.militaryUser.militaryForceId.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "military-force-required"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    if (dataDriver.driver.militaryUser.militaryGraduationId.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "military-graduation-required"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    if (dataDriver.driver.militaryUser.militaryStatusId.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "military-status-required"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    if (dataDriver.driver.militaryUser.om.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "military-om-required"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    return true;
}


function verifyRGMilitary(dataDriver) {
    if (dataDriver.image.RG_FRONT === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "rg-front-photo-required"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    if (dataDriver.image.RG_BACK === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "rg-back-photo-required"), getTextTranslate("sign-up", "title-required"), () => {}, "warning");
        return false;
    }

    return true;
}

function verifyCompany(dataDriver) {
    if (dataDriver.driver.cityId === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "city-user-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocumentCNH(dataDriver) {
    if (dataDriver.driver.numberCNH.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "cnh-number-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.image.CNH === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "cnh-photo-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocumentCRLV(dataDriver) {

    if (dataDriver.car.licensePlate.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","license-place-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    let regex = /^[a-zA-Z]{3}[0-9]{4}\b/;
    let newRegex = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}\b/;

    if (!removeValidation && !regex.test(dataDriver.car.licensePlate.replace("-", "")) && !newRegex.test(dataDriver.car.licensePlate.replace("-", ""))) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","license-place-invalid"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.car.renavam.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","renavam-required"),  getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.car.markCar.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","mark-car-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.car.modelCar.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","model-car-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.car.colorCar.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","color-car-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.car.numberSeatingCar.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","number-seating-car-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }
    if (dataDriver.car.year.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","year-vehicle-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    /*if(dataDriver.image.CRLV === null){
        SwalCustom.messageDialog("Retire uma foto do seu CRLV", "Atenção", () => {
        }, "warning");
        return false;
    }*/

    return true;
}

function verifyDocumentProofOfResidence(dataDriver) {
    if (dataDriver.image.PROOF_OF_RESIDENCE === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "proof-of-residence-photo-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocumentALVARA(dataDriver) {
    if (dataDriver.driver.numberAlvara === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "alvara-number-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.image.ALVARA === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "alvara-photo-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    return true;
}


function verifyDocumentCriminalRecord(dataDriver) {
    if (dataDriver.driver.numberCriminalRecord.length === 0) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "criminal-record-number-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.image.CRIMINAL_RECORD == null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "criminal-record-photo-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    return true;
}


function verifyDocumentProfile(dataDriver) {
    if (dataDriver.image.PROFILE === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up","photo-profile-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    return true;
}

function verifyDocument(dataDriver) {
    if (dataDriver.image.CNH === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "cnh-photo-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.image.CRLV === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "crlv-photo-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.image.ALVARA === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "alvara-photo-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }

    if (dataDriver.image.PROFILE === null) {
        SwalCustom.messageDialog(getTextTranslate("sign-up", "photo-profile-required"), getTextTranslate("sign-up", "title-required"), () => {
        }, "warning");
        return false;
    }
    return true;
}
