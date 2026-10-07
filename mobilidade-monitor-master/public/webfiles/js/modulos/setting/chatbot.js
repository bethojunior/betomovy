preload(true);

mountListChat();


elementProperty.getElement('#tripTypes',these => {
    TripController.getTripTypes().then(({status,response}) => {
        if(!status)
            return swal('Erro ao listar tipos de viagem','Contate o suporte','error');
        let list = '';
        list += response.map(item => {
            return `
                <option value="${item.id}">${item.name}</option>
            `;
        }).join('');
        these.innerHTML = list;
    })
});

function mountListChat() {
    elementProperty.getElement('#mount-list-chat', tbody => {
        TripController.getMessagesChatBot().then(({status,response}) => {
            if(!status)
                return swal('Erro ao listar mensagens','','error');

            let tr = '';
            tr += response.map(item => {
                return `
                    <tr>
                        <td>${item.chat_bot_trip_type['name']}</td>
                        <td>${item.message}</td>
                        <td class="delete" id="${item.idChatBotTrip}"><i class="material-icons">delete</i></td>
                    </tr> 
                `;
            }).join('');
            tbody.innerHTML = tr;
            preload(false);
            elementProperty.addEventInElement('.delete','onclick',function () {
                let id = this.getAttribute('id');
                SwalCustom.dialogConfirm('Deseja deletar esta mensagem?','Essa ação é inevitável',status => {
                    if(status){
                        TripController.deleteMessagesChatBot(id).then(response => {
                            mountListChat();
                            swal('Mesangem apagada com sucesso','','success')
                        })
                    }
                });
            });
        });
    });
}

elementProperty.addEventInElement('#save-new-chat','onclick',function () {
    let data = {};
    data.chatBotTripTypeId = parseInt(document.getElementById('tripTypes').value);
    data.message = document.getElementById('message').value;
    TripController.getMessagesChatBot('post' , data).then(response => {
        mountListChat();
        if(!response.status)
            return swal('Erro ao inserir mensagem','Contate o suporte','error');
        return swal('Mensagem inserida com sucesso','','success');

    })
});