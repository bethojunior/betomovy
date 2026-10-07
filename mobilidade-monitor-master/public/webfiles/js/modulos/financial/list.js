preload(true);
const elementProperty = new ElementProperty();

var page = 1;
var filters = '';

showListFinancial();

function showListFinancial() {
    elementProperty.getElement('#tbody-withdraw', element => {
        WithdrawController.getAll(page, filters).then(({response}) => {
            let data = response.data;
            let list = '';

            list = data.map(withdraw => {
                return `
                    <tr>
                        <td>${withdraw.confirmationCode}</td>
                        <td>${new Date(withdraw.created_at).toLocaleString()}</td>
                        <td>${withdraw.name}</td>
                        <td>${withdraw.isDriver === 1 ? 'Motorista' : 'Cliente'}</td>
                        <td>${withdraw.recused !== 1 ? withdraw.paid === 1 ? 'Confirmado' : 'Pendente' : 'Recusado'}</td>
                        <td>${Mask.maskMoney(parseFloat(withdraw.value))}</td>
                        <td class="btn-group">
                            <button 
                                type="button" 
                                class="btn btn-sm withdraw-details"
                                data-toggle="modal" 
                                data-target="#show-withdraw-modal"
                                data-withdrawid="${withdraw.idWithdraw}">
                                Detalhar
                            </button>
                            ${
                    withdraw.paid === 1 || withdraw.recused === 1 ?
                        '' :
                        `<button 
                                    type="button" 
                                    class="btn btn-sm btn-success btn-withdraw-confirmation"
                                    data-withdrawid="${withdraw.idWithdraw}">
                                    Confirmar
                                </button>`
                }
                            
                             ${
                    withdraw.paid === 1 || withdraw.recused === 1 ?
                        '' :
                        `<button 
                                    type="button" 
                                    class="btn btn-sm btn-danger btn-withdraw-reject"
                                    data-withdrawid="${withdraw.idWithdraw}">
                                    Recusar
                                </button>`
                }
                        </td>
                    </tr>
                `;
            }).join('');

            if (response.last_page > 1) {
                list += `
                    <div class="withdraw-pagination">
                        <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                ${
                    response.current_page <= 1
                        ?
                        `
                                            <li class="page-item disabled">
                                                <a class="page-link" href="#" aria-label="Anterior">
                                                    <span aria-hidden="true">&laquo;</span>
                                                </a>
                                            </li>
                                            `
                        :
                        `
                                            <li class="page-item">
                                                <a class="page-link btn-pagination-withdraw" data-page="${response.current_page - 1}" href="#" rel="prev" aria-label="Anterior">
                                                    <span aria-hidden="true">&laquo;</span>
                                                </a>
                                            </li>
                                            `
                }
                                ${
                    response.current_page < response.last_page
                        ?
                        `
                                        <li class="page-item">
                                            <a class="page-link btn-pagination-withdraw" data-page="${response.current_page + 1}" href="#" rel="next" aria-label="Próxima">
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                        `
                        :
                        `
                                        <li class="page-item disabled">
                                            <a class="page-link" href="#" aria-label="Próxima">
                                                <span aria-hidden="true">&raquo;</span>
                                            </a>
                                        </li>
                                        `
                }
                            </ul>
                        </nav>
                    </div>
                `
            }

            element.innerHTML = list;
            addEventsAfterList();
            preload(false);
        })
    });
}

function addEventsAfterList() {
    $(".btn-pagination-withdraw").on('click', function (event) {
        event.preventDefault();
        let clickedElement = $(event.target);
        let button = clickedElement.closest('.btn-pagination-withdraw')

        page = button.data('page');

        preload(true);

        showListFinancial();
    });

    elementProperty.addEventInElement(".btn-withdraw-reject", 'onclick', function (e) {
        e.stopPropagation();

        swal({
            title: "Cuidado",
            text: "Quero recusar a transferência",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: ['Cancelar', 'Confirmar']
        }).then((willConfirm) => {
            if (willConfirm) {
                preload(true);
                WithdrawController.reject(this.getAttribute('data-withdrawid')).then(({status, message}) => {
                    preload(false);
                    if (!status) {
                        swal(message, {
                            icon: "warning",
                        });
                        return;
                    }

                    swal(message, {
                        icon: "success",
                    }).then(() => {
                        preload(true);
                        showListFinancial();
                    });
                });

            }
        });
    });

    elementProperty.addEventInElement('.btn-withdraw-confirmation', 'onclick', function (e) {
        e.stopPropagation();
        preload(true);

        AcquirerController.getAll().then(({response}) => {
            const result = response.find(acquire => acquire.name === 'PAGUE LOGO');
            if(result.active){
                WithdrawController.getSaldsPagueLogo().then(({response}) => {
                    document.querySelector('#saldContent').innerHTML =
                         `
                            <p>Saldo disponível</p>
                            <div class="d-flex justify-content-around">
                            <div class="d-flex">
                            <p>Boleto:</p>
                            <p class="font-weight-bold ml-2">${response.billet}</p>
                            </div>
                            <div class="d-flex">
                            <p>Cartão:</p>
                            <p class="font-weight-bold ml-2">${response.card}</p>
                            </div>
                            </div>
                        `
                    }).finally(() => {
                    $('#modalPagueLogo').modal('show');
                    preload(false);
                });

                const transferId = this.getAttribute('data-withdrawid');

                elementProperty.addEventInElement('#selectFormPayment', 'onclick', function () {
                    preload(true);
                    const type = document.querySelector('.select-payment-forms').value;
                    WithdrawController.PaymentPagueLogo(transferId, type).then(({status, message}) => {
                        preload(false);
                        if(!status){
                            return SwalCustom.messageDialog('', `${message}`, 'error');
                        }
                        SwalCustom.messageDialog('', 'Pagamento efetuado com sucesso!', 'success').then(() =>{
                            preload(true);
                            $('#modalPagueLogo').modal('hide');
                            document.querySelector('.select-payment-forms').value = 'cartao';
                            showListFinancial();
                        });
                    });
                });
                return '';
            }
            preload(false);
            swal({
                title: "Cuidado",
                text: "Quero confirmar a transferência",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                buttons: ['Cancelar', 'Confirmar']
            }).then((willConfirm) => {
                if (willConfirm) {
                    preload(true);
                    WithdrawController.confirm(this.getAttribute('data-withdrawid')).then(({status, message}) => {
                        preload(false);
                        if (!status) {
                            swal(message, {
                                icon: "warning",
                            });
                            return;
                        }

                        swal(message, {
                            icon: "success",
                        }).then(() => {
                            preload(true);
                            showListFinancial();
                        });
                    });

                }
            });
        });
    });
}

$('#show-withdraw-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var withdrawId = button.data('withdrawid');
    var modal = $(this);

    preload(true);

    WithdrawController.get(withdrawId)
        .then(({response}) => {
            preload(false);
            if(response == null){
                $('#show-withdraw-modal').hide('show.bs.modal');
               return SwalCustom.messageDialog("", "Cliente não possui dados bancários!");
                }
            modal.find('.modal-title').text(`Solicitação de ${response.isDriver === 1 ? 'Motorista' : 'Cliente'}: ${response.name}`);
            modal.find('.modal-body').html(`
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6">
                            <b>Data Solicitação: </b> ${new Date(response.created_at).toLocaleString()}
                        </div>
                        <div class="col-md-6">
                            <b>Status: </b> ${response.paid === 1 ? 'Confirmado' : 'Pendente'}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <b>Contato: </b> ${Mask.setMaskPhoneValue(response.phone)}
                        </div>
                        <div class="col-md-6">
                            <b>Valor: </b> R$ ${Mask.maskMoney(response.value)}
                        </div>
                    </div>
                    <div class="payment-info"></div>
                </div>
            `);

            if (response.paid === 0) {
                modal.find('.payment-info').html(`
                    <div class="row">
                        <div class="col-md-6">
                            <b>Conta bancária atual:</b>
                        </div>
                        <div class="col-md-6">
                            <b>Chave Pix: </b> ${(response.pix) ? (response.pix) : "-"}
                        </div>
                    </div>
                    ${mountBankAccountHtml(response.bankAccountToPay)}
                `)
            } else {
                modal.find('.payment-info').html(`
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <b>Pago por:</b> ${response.paidByUserName}
                        </div>
                        <div class="col-md-6">
                            <b>Confirmada em:</b> ${new Date(response.paymentDate).toLocaleString()}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <b>Pago na Conta bancária:</b>
                        </div>
                    </div>
                    ${mountBankAccountHtml(response.paidBankAccount)}
                `)
            }

            preload(false);
        })
});

elementProperty.addEventInElement('#to-filter', 'onclick', element => {
    preload(true);
    page = 1;

    elementProperty.getElements('.input-filter').forEach((input, index) => {
        if (input.getAttribute('name') !== 'paid') {
            inputFilter = `${input.getAttribute('name')}=${input.value ? input.value : ''}&`;
            filters = index === 0 ? inputFilter : filters + inputFilter;
        }
    });

    let onlyPending = false;

    elementProperty.getElement('#onlyPending', element => {
        onlyPending = element.checked
    });

    if (onlyPending)
        filters += 'paid=0';

    showListFinancial();
});

function mountBankAccountHtml(bankAccount) {
    return `
        <div class="row">
            ${bankAccount.split(',').map((item, index) => {
        return `
                    <div class="col-md-6">
                        ${index === 0 ? item : item.substring(1)}
                    </div>
                `;
    }).join("")}
        </div>
    `;
}
