viewController.setObserver("contact-us", function () {

    const elementProperty = new ElementProperty();
    const userData = Session.get("user");
//StatusBar.overlaysWebView(true);

    window.addEventListener('keyboardDidShow', function () {
        elementProperty.getElement("#buttonKeyboard",element=> element.style.display = "block");
        elementProperty.getElement("#buttonSend",element=> element.style.display = "none");
    });

    window.addEventListener('keyboardDidHide', function () {
        elementProperty.getElement("#buttonKeyboard",element=> element.style.display = "none");
        elementProperty.getElement("#buttonSend",element=> element.style.display = "block");
    });

    elementProperty.addEventInElement("#buttonKeyboard", "onclick", sendMessage);

    elementProperty.addEventInElement("#buttonSend", "onclick", sendMessage);

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    function sendMessage() {

        const userId = userData.idUser;
        const bodyText = document.getElementById("textClient");
        let message = bodyText.value;

        if (bodyText.value.length > 0) {

            optionPreload.show();
            const data = {userId, message};

            CustomerController.sendEmail(data).then(({status}) => {
                optionPreload.hidde();
                if (status) {
                    clearField();
                    swal("Mensagem enviada com sucesso", "Obrigado pelo contato!", "success");
                    return;
                }
                optionPreload.hidde();
                swal("ops", "Você precisa escrever algum comentário", "info");
            }).catch(()=>{
                optionPreload.hidde();
            });
            return;
        }

        SwalCustom.messageDialog("","Por favor, digite seu comentário ou dúvida ",undefined,"warning");

    }

    function clearField(){
        elementProperty.getElement("#sending" , element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#textClient", element => {
            element.value = "";
        });
    }
});