preload(true);
let elementy = new ElementProperty();
let lastPage = 0;
let thisPage = 1;
document.getElementById('dateStart').valueAsDate = new Date();
document.getElementById('dateEnd').valueAsDate = new Date();

$(document).ready(function () {
    $('.js-example-basic-single').select2();
});

let inputSearchTimeout = null;

elementy.addEventInElement('#search-userId', 'oninput', function () {
    clearTimeout(inputSearchTimeout);
    let name = this.value;
    inputSearchTimeout = setTimeout(() =>{
        const these = document.querySelector("#userId");
        if (name.length === 0)
            return these.innerHTML = '<option selected value="">Todos</option>';
        CustomerController.getByName(name).then(({status, data}) => {
            if (!status)
                return swal('Erro ao listar usuários', 'Contate o suporte', 'error');

            let content = '';
            content += data.data.map(item => {
                return `
                    <option value="${item.idUser}">${item.name}</option>
                `;
            }).join('');
            these.innerHTML = content;
        });
    }, 1200);
});

elementy.addEventInElement('#search-driver', 'oninput', function () {
    clearTimeout(inputSearchTimeout);
    let name = this.value;
    inputSearchTimeout = setTimeout(() => {
        const these = document.querySelector("#driverId");
        if (name.length === 0)
            return these.innerHTML = '<option selected value="">Todos</option>';
        DriverController.getDrivers('', name, '').then(({status, response}) => {
            if (!status)
                return swal('Erro ao listar usuários', 'Contate o suporte', 'error');

            let content = '';
            content += response.data.map(item => {
                return `
                    <option value="${item.idDriver}">${item.name}</option>
                `;
            }).join('');
            these.innerHTML = content;
        });
    },1200);
});

elementy.getElement('#cityId', these => {
    CityController.getActives().then(({status, data}) => {
        if (!status) {
            return swal('Erro ao buscar cidades ativas', 'Contate o suporte', 'error');
        }
        let content = '';
        content += data.map(item => {
            return `
                <option value="${item.cityId}">${item.nome}</option>
            `;
        }).join('');
        these.innerHTML += content;
        preload(false);
    })
});

elementy.addEventInElement('#get-cancellationFee', 'onclick', function () {
    listCancellation();
});

function listCancellation(){
    Cancellation.insert(thisPage,['dateStart', 'dateEnd', 'cityId', 'userId', 'driverId'], 'withTrash').then(response => {
        elementy.getElement('#mount-list-fee', these => {
            let content = '';
            if (response.data.length === 0) {
                these.innerHTML = '';
                return swal('Não há dados para sua pesquisa', '', 'info');
            }
            content += response.data.map(item => {
                return `
                      <tr class="tr-${item.id}">
                        <th>${item.userName}</th>
                        <th>${item.driverPaidName === null ? " " : item.driverPaidName}</th>
                        <th>${Mask.setDateCrazy(item.created_at)}</th>
                        <th>${Mask.maskMoney(item.feeValue)}</th>
                        <th>${item.driverName}</th>
                        <th>${Mask.setDateCrazy(item.paymentDate)}</th>
                        <th>
                            <button id="${item.id}" class="btn btn-danger delete-cancellation-fee btn-sm">
                                <i class="material-icons">delete_all</i>
                            </button>
                        </th>
                      </tr>
                `;
            }).join('');
            these.innerHTML = content;

            elementy.addEventInElement('.delete-cancellation-fee', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.confirm('Deseja deletar essa taxa?', 'Essa ação é permanente').then(status => {
                    if (!status)
                        return false;
                    preload(true);
                    FinancialController.delete(id).then(({status, response, message}) => {
                        preload(false);
                        if (!status)
                            return swal('Erro ao deletar taxa', 'Contate o suporte', 'error');

                        swal('Taxa excluida com sucesso', '', 'success');
                        elementy.getElement('.tr-' + id, tr => {
                            tr.style.display = 'none';
                        })
                    });
                });
            });
        })

        if (response.prev_page_url === null) {
            const buttonBackPage = document.querySelector('.page-back');
            if(!buttonBackPage.classList.contains('disabled')) {
                buttonBackPage.onclick = ()=>{};
                buttonBackPage.classList.add('disabled');
            }
        }else{
            const buttonBackPage = document.querySelector('.page-back');
            buttonBackPage.classList.remove('disabled');
            elementy.addEventInElement('.page-back', 'onclick', function () {
                thisPage -= 1;
                listCancellation();
            });
        }

        if (response.next_page_url === null) {
            const buttonNextPage = document.querySelector('.page-next');
            if(!buttonNextPage.classList.contains('disabled')) {
                buttonNextPage.onclick = ()=>{};
                buttonNextPage.classList.add('disabled');
            }
        }else{
            const buttonNextPage = document.querySelector('.page-next');
            buttonNextPage.classList.remove('disabled');
            elementy.addEventInElement('.page-next', 'onclick', function () {
                thisPage += 1;
                listCancellation();
            });
        }
    })
}