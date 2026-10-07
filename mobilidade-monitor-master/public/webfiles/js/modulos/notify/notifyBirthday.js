document.addEventListener("DOMContentLoaded", function () {

    let elementProperty = new ElementProperty();

    getNotifications();

    function getNotifications() {
        preload(true);
        UserTypeController.getNotifyBirthday().then((data) => {
            document.querySelector('#listNotifications').innerHTML = data.response.map((item) => {
                return `
               <tr>
                   <td>${item.event_notification_type.name}</td>
                   <td>${item.title}</td>
                   <td>${item.description}</td>
                   <td>
                       <button id="${item.id}" class="btn btn-danger delete-notify material-icons">delete</button>
                   </td>
               </tr>`;
            }).join("");
            preload(false);

            elementProperty.addEventInElement('.delete-notify', 'onclick', function () {
                const id = this.getAttribute("id");

                SwalCustom.dialogConfirm('Você confirma a exclusão dessa notificação?', '', (status) => {
                    preload(true);
                    if(status) {
                        UserTypeController.deleteNotifyBirthday(id).then((status) => {
                            preload(false);
                            if(!status) {
                                return SwalCustom.messageDialog('', 'Não foi possível excluir sua notificação, tente novamente', 'error');
                            }

                            SwalCustom.messageDialog('', 'Notificação excluída com sucesso!', 'success').then(() => {
                                getNotifications();
                            });
                        });
                    }
                });
            });
        });
    }

    elementProperty.addEventInElement('#btnSaveNotify', 'onclick', () => {
        const select = document.getElementById('selectTypeNotification');
        const typeNotification = select.options[select.selectedIndex].value;
        const title = document.querySelector('#inputTitleBirthdayNotification').value;
        const message = document.querySelector('#inputMessageBirthday').value;

        if (title == "" || message == "") {
            return SwalCustom.messageDialog('', 'Todos os campos devem ser preenchidos', 'error');
        }

        SwalCustom.confirm('Você confirma a criação dessa notificação?', '').then((status) => {
            if(status) {
            preload(true);

            const data = {
                "title" : title,
                "description" : message,
                "eventNotificationTypeId": typeNotification
            }

            UserTypeController.createNotifyBirthday(data).then((status) => {
                preload(false);
                if(!status) {
                    return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao cadastrar uma mensagem', 'error');
                }

                SwalCustom.messageDialog('', 'Notificação atualizada com sucesso!', 'success').then(() => {
                    $('#modalCreateNewNotification').modal('hide');
                    document.querySelector('#inputTitleBirthdayNotification').value = "";
                    document.querySelector('#inputMessageBirthday').value = "";
                    getNotifications();
                });
            });
            }
        });
    });
});