document.addEventListener("DOMContentLoaded" , function () {
    const elementProperty = new ElementProperty();
    let page = 1;
    const buttonNextPage = document.querySelector('.page-next');
    const buttonPreviousPage = document.querySelector('.page-previous');
    const buttonSearch = document.querySelector('#searchCustomer');

    preload(true);

    listCustomers();

    function listCustomers(name = '') {
        const list = document.querySelector('#listCustomer');

        CentralUserController.getAllCustomers(page, name).then(({response}) => {
            const { data, next_page_url, prev_page_url } = response;

            if (data.length === 0) {
                preload(false);
                return SwalCustom.messageDialog('', 'Nenhum usuário encontrado!');
            }

            list.innerHTML = data.map(customer => {
                return `
                    <tr>
                        <td>${customer.centralName}</td>
                        <td>${customer.name}</td>
                        <td>${customer.email}</td>
                        <td>
                            <button title="Deletar" userid="${customer.idUser}"
                                    class="btn btn-primary delete-customer btn-danger material-icons">delete
                            </button>
                        </td>
                    </tr>
            `
            }).join('');

            elementProperty.addEventInElement('.delete-customer', 'onclick', function () {
                const id = this.getAttribute('userid');

                SwalCustom.dialogConfirm('Você deseja realmente excluir o usuário?', 'O usuário vai ser excluido definitivamente', status => {
                    if (status) {
                        preload(true);
                        CentralUserController.removeUserById(id).then(callback => {
                            preload(false);
                            if (callback.status)
                                return swal('Usuário deletado com sucesso', '', 'success').then(() => location.reload());

                            return swal('Erro ao deletar esse usuário', 'Contate o suporte', 'error');
                        });
                    }
                });
            });

            if(!next_page_url) {
                buttonNextPage.disabled = true;
                if(!buttonNextPage.classList.contains('disabled')) {
                    buttonNextPage.classList.add('disabled');
                }
            } else {
                buttonNextPage.disabled = false;
                buttonNextPage.classList.remove('disabled');
            }

            if(!prev_page_url) {
                buttonPreviousPage.disabled = true;
                if(!buttonPreviousPage.classList.contains('disabled')) {
                    buttonPreviousPage.classList.add('disabled');
                }
            } else {
                buttonPreviousPage.disabled = false;
                buttonPreviousPage.classList.remove('disabled');
            }

            preload(false);
        });
    }

    buttonNextPage.addEventListener('click', function () {
        if(this.disabled)
            return;
        preload(true);
        page += 1;
        listCustomers();
    });

    buttonPreviousPage.addEventListener('click', function () {
        if(this.disabled)
            return;
        preload(true);
        page -= 1;
        listCustomers();
    });

    buttonSearch.addEventListener('click', function () {
        const name = document.querySelector('#doFilter').value;

        preload(true);
        listCustomers(name);
    });
});