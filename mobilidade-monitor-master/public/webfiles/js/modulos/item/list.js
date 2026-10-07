preload(true);
let elementProperty = new ElementProperty();
let idSelected = '';
mountListInitial();

function mountListInitial(concat = false) {
    elementProperty.getElement('#list-items',here => {
        SettingsController.getItems().then(callback => {
            let content = concat ? element.innerHTML : "";
            let data = callback.response;
            content += data.map(item => {
                return `
                    <div class="col-lg-6 col-sm-12">
                        <div class="row main-content">
                            <div class="col-lg-4 div-image">
                                <img src="${item.picture}">
                            </div>
                            <div class="col-lg-4 col-sm-12 content">
                                <span>${item.description}</span><br>
                                <span>Criado: ${Mask.setDateCrazyWhitOutHour(item.created_at)}</span>
                             
                            </div>
                            <div class="col-lg-4 col-sm-12">
                                <button id="${item.id}" class="btn btn-primary delete-item">Apagar item</button>
                                <button id="${item.id}" class="btn btn-primary update-item">Atualizar item</button>
                            </div>
                        </div>
                    </div>   
            `;
            }).join('');
            here.innerHTML = content;
            preload(false);

            elementProperty.addEventInElement('.delete-item','onclick',function () {
                SwalCustom.dialogConfirm('Deseja apagar esse item?','Esse será deletado', status => {
                    if(status){
                        preload(true);
                        SettingsController.deleteItem(this.getAttribute('id')).then(callback => {
                            preload(false);
                            if(callback.status){
                                swal('Item deletado com sucesso','','success');
                                mountListInitial();
                                return;
                            }
                        });
                        return;
                    }
                });
            });

            elementProperty.addEventInElement('.update-item','onclick',function(){
                idSelected = this.getAttribute('id');
                $('#modal-update-item').modal('show')

            });

        });
    });
}

elementProperty.addEventInElement('#updating-this','onclick',function () {
    SwalCustom.dialogConfirm('Deseja atualizar esse item?','',status => {
        if(status){
            $('#modal-update-item').modal('toggle')
            preload(true);
            elementProperty.getElement('#fileUpload-new',image =>{
                if(document.getElementById('weight-new').value  === '' ||
                    document.getElementById('height-new').value === '' ||
                    document.getElementById('width-new').value  === '' ||
                    document.getElementById('depth-new').value  === ''
                ){
                    preload(false);
                    return swal('Preencha os valores da cubagem','','info');
                }
                var form = new FormData();
                form.append("weight", document.getElementById('weight-new').value);
                form.append("height", document.getElementById('height-new').value);
                form.append("width",  document.getElementById('width-new').value);
                form.append("depth",  document.getElementById('depth-new').value);
                if(image.files[0] !== undefined || image.files[0] !== null){
                    form.append('picture', image.files[0]);
                }
                form.append('picture', '');
                form.append('description', document.getElementById('value-description-item-new').value);
                SettingsController.updateItem(idSelected,form).then(callback => {
                    preload(false);
                    if(callback.status){
                        return swal('Inserido com sucesso','','success');
                    }
                    return swal('Erro ao inserir item','Contate o suporte','error');
                });
            });
            return;
        }
    })
});
