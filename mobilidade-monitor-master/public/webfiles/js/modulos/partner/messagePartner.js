let filter = '';

init();

function init() {
    preload(true);
    PartnerController.getMessageAudit(filter).then(response => {
        document.querySelector('.list-message').innerHTML = response.response.map(item => {
            return `
            <div class="card border-secondary mb-3 ml-2">
                <div class="card-header d-flex justify-content-between">
                    <div>${item.name}</div>
                    <div>${new Date(item.created_at).toLocaleDateString()}</div>
                </div>
                <div class="card-body text-secondary row">
                    <div class="d-flex flex-column col-lg-3 col-md-3 col-sm-12">
                        <div>
                            <span>E-mail:</span>
                            <span class="font-weight-bold body-message">${item.email}</span>
                        </div>
                        <div>
                            <span>Telefone:</span>
                            <span class="font-weight-bold body-message">${item.phone}</span>
                        </div>
                    </div>
                    <div class="col-lg-7 col-md-7 col-sm-12 message-container">
                        <p class="card-text text-justify body-message">${item.message}</p>
                    </div>
                    <div class="mt-2 col-lg-1 col-md-1 col-sm-12 d-flex justify-content-end button-container">
                        <div class="row justify-content-end">
                            <button class="btn btn-danger material-icons btn-delete" idMessage="${item.id}">delete</button>
                        </div>
                    </div>
                </div>
            </div>`
        }).join('');
        preload(false);

        elementProperty.addEventInElement('.btn-filter', 'onclick', function() {
            const inputFilter = document.querySelector('.input-filter').value;
            const filterChecked = document.querySelector('.type-filter:checked').value;

            if(inputFilter === '') {
                filter = '';
                init(filter);
            }

            inputFilter !== '' && filterChecked === 0 ? filter = `name=${inputFilter}` : filter = `email=${inputFilter}`;
            init(filter);
        })

        elementProperty.addEventInElement('.btn-delete', 'onclick', function() {
            const id = this.getAttribute('idMessage');
            SwalCustom.dialogConfirm('Você realmente deseja excluir essa mensagem?', 'Essa ação é irreversível', (status) => {
                if(!status)
                    return;

                preload(true);
                PartnerController.deleteMessageAudit(id).then(status => {
                    preload(false);
                   if(!status)
                       return SwalCustom.messageDialog('Tente novamente', 'Ops.. Ocorreu um erro ao apagar sua mensagem.', 'error');

                   SwalCustom.messageDialog('', 'Mensagem excluída com sucesso!', 'success').then(() => {
                       preload(true);
                       init();
                   });
                });
            });
        });
    });
}
