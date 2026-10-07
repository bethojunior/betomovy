mountListReasons();

elementProperty.addEventInElement('#save-new-reason','onclick',function () {
    elementProperty.getElement('#new-cancellation',these => {
        let typeId = $("input[name='typeReasonId']:checked").val();
        let data = {
            "name" : these.value,
            "cancellationReasonsTypeId" : typeId
        };
        preload(true);
        TripController.cancellationReasons('POST','',data).then(({status,response}) => {
            preload(false);
            mountListReasons();
            if(!status) {
                return swal('Erro ao inserir mensagens de cancelamento', 'Contate o suporte', 'error');
            }
            return swal('Mensagem de cancelamento inserida com sucesso','','success');
        })
    });
});

function mountListReasons() {
    elementProperty.getElement('#mount-reasons' , these => {
        TripController.cancellationReasons('GET').then(({status,response}) => {
            if(!status)
                return swal('Erro ao listar mensagens de cancelamento','Contate o suporte','error');

            let content = '';
            content += response.map(item => {
                return `
                <tr style="cursor: pointer"> 
                    <th>${item.name}</th>
                    <th class="delete-item" id="${item.idCancellationReasons}"><i class="material-icons">clear_all</i></th>
                </tr> 
            `;
            }).join('');

            these.innerHTML = content;

            elementProperty.addEventInElement('.delete-item','onclick',function () {
                let id = this.getAttribute('id');
                SwalCustom.dialogConfirm('Deseja apagar esse item?','Essa ação é irreversível',status =>{
                    if(!status)
                        return true;
                    preload(true);
                    TripController.cancellationReasons('DELETE',id).then(({status,response}) => {
                        preload(false);
                        if(!status){
                            mountListReasons();
                            return swal('Erro ao deletar mensagem de cancelamento','Contate o suporte','error');
                        }
                        return swal('Item apagado com sucesso','','success');
                    });
                })
            });

        });
    })
}