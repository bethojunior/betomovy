function showNotificationOneUser(idUser,name,photo){

    document.getElementById("titleNotify").value = "";
    document.getElementById("messageNotify").value = "";

    elementProperty.getElement(".name-customer-notify",element=>{
        element.innerHTML = name;
    });
    elementProperty.getElement(".profile-customer-notify",element=>{
        element.style.backgroundImage = `url(${photo})`;
    });

    elementProperty.addEventInElement(".close-modal-notification-user","onclick",function(){
        elementProperty.removeClass(".modal-notification-user","active");
    });

    elementProperty.addClass(".modal-notification-user","active");

    elementProperty.addEventInElement("#btnSendNotifyUser","onclick",function(){
        let title = document.getElementById("titleNotify").value;
        let message = document.getElementById("messageNotify").value;

        if(title.trim().length === 0){
            SwalCustom.messageDialog("","Informe o titulo da notificação");
            return;
        }

        if(message.trim().length === 0){
            SwalCustom.messageDialog("","Informe o mensagem da notificação");
            return;
        }

        NotificationController.send({
            "action": "message",
            "link": "",
            message,
            "notificationTypeId": 2,
            title,
            "userIdAdministrator": Session.getValueInSession("user","idUser"),
            "userTypeId": "4",
            "usersId": [idUser]
        }).then(({status,data})=>{
            if(!status){
                Toastr.error("Ocorreu um error ao enviar notificação");
                return
            }

            if(data[0].success === 1){
                Toastr.success("Notificação enviada com sucesso !");
            }else{
                Toastr.error("Não foi possível notificar o usuário!");
            }
        });

        elementProperty.removeClass(".modal-notification-user","active");

        Toastr.progress('Enviando notificação !',1000);
        document.getElementById("titleNotify").value = "";
        document.getElementById("messageNotify").value = "";
    });
}