let elementProperty = new ElementProperty();
preload(true);
let citiesSelected = '';
let that_cities = [];
let cities = Session.getLocal64("cities");
let that_drivers = [];
let pageDriver = 0;
let name = '';
let monetizationId = '';

document.getElementById('dateStart').valueAsDate = new Date();
document.getElementById('dateEnd').valueAsDate = new Date();

mountList(cities);
mountIndications(name, monetizationId);

function mountIndications(name , monetizationId) {
    elementProperty.getElement('#mount-indication',these => {
        FinancialController.indicationsByUser(name , monetizationId).then(({status,response}) => {
            if(!status)
                return swal('Erro ao listar indicações','Contate o suporte','error');

            let content = '';
            content += response.map(item => {
                return `
                <tr style="cursor:pointer;"> 
                    <tr id="${item.idUser}" class="show-more-that">
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.userType}</td>
                        <td>${item.phone}</td>
                        <td>${item.userIndications}</td>
                        <td>${item.level}</td>
                    </tr>
                    <tr id="th-${item.idUser}" style="display: none;">
                        <td colspan="6">
                            <table class="table table-striped" style="background: antiquewhite;">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Fone</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody class="that-${item.idUser}">
                                
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tr>
            `;
            }).join('');
            these.innerHTML = content;

            elementProperty.addEventInElement('.show-more-that','onclick',function () {
                let id = this.getAttribute('id');
                let that = document.getElementById('th-'+id);

                if(that.style.display === 'none'){
                    preload(true);
                    that.style = '';
                }else{
                    that.style.display = 'none';
                }

                FinancialController.getIndicationByUser(id).then(({status,response}) => {
                    preload(false);
                    if(!status)
                        return swal('Erro ao buscar listagem de usuários','Contate o suporte','error')

                    elementProperty.getElement('.that-'+id, these => {
                        let content = '';
                        content += response.map(item => {
                            return `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.email}</td>
                                    <td>${item.phone}</td>
                                    <td>${Mask.setDateCrazy(item.created_at,false)}</td>
                                </tr>
                            `;
                        }).join('');
                        these.innerHTML = content;
                    });
                });
            });

        });
    });
}
function mountList(data) {
    elementProperty.getElement('#driver-list', element => {
        let list = '';
        list += data.map(driver => {
            const isDriverSelected = that_drivers.includes(driver.cityId);
            return `
                <div id="${driver.cityId}" class='div-driver ${isDriverSelected ? 'disabled' : ''}' name="${driver.nome}">
                    <span>${driver.nome}</span>
                    <span data="${driver.cityId}" id="seleceted_${driver.cityId}" class="selecetedd ${isDriverSelected ? 'show' : 'hidden'}"><i class="material-icons">check</i></span>
                </div>
            `;
        }).join('');

        element.innerHTML = list;
        preload(false);

        elementProperty.addEventInElement('.div-driver', 'onclick', function () {
            if (document.getElementById('mark-all-drivers').checked) {
                return; // Se o "Marcar Todos" estiver marcado, não faça nada
            }

            let id = this.getAttribute('id');
            elementProperty.getElement('#seleceted_' + id, that => {
                if (that.classList.contains('show')) {
                    that.classList.remove('show');
                    that.classList.add('hidden');
                    for (let i in that_cities) {
                        if (that_cities[i] === id) {
                            remove = that_cities[i];
                            that_cities.splice(i, 1);
                        }
                    }
                    return true;
                }
                that.classList.remove('hidden');
                that.classList.add('show');
                that_cities.push(this.getAttribute('id'));
            });
        });
    });
}

elementProperty.addEventInElement('#load', 'onclick', function() {
    let data = {};
    data.date_start = document.getElementById('date_start').value;
    data.date_end = document.getElementById('date_end').value;

    let list_cities_select = JSON.stringify(that_cities);
    list_cities_select = list_cities_select.replace(']', '');
    list_cities_select = list_cities_select.replace(/","/g, '&cities[]=');
    list_cities_select = list_cities_select.replace(/"/g, '');
    list_cities_select = list_cities_select.replace('[', '');

    data.cities = list_cities_select;

    // Verifica se a lista de cidades está vazia ou se a data de término é nula
    if (data.cities === '' || data.date_end === null) {
        swal('Você precisa selecionar uma cidade', '', 'info');
        return;
    }

// Verifica se o checkbox "Marcar Todos" está marcado
    let markAllDriversCheckbox = document.getElementById('mark-all-drivers');
    if (markAllDriversCheckbox && markAllDriversCheckbox.checked) {
        data.drivers = '';
    } else {
        if (that_drivers.length > 0) {
            data.drivers = that_drivers.join('&drivers[]=');
        } else {
            swal('Você precisa selecionar algum motorista', '', 'info');
            return;
        }
    }

    preload(true);

    const timeoutDuration = 10000; // Adjust the timeout duration as needed (in milliseconds)
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout'));
        }, timeoutDuration);
    });

    // Use Promise.race to combine the timeout promise with the actual request promise
    Promise.race([FinancialController.getReport(data), timeoutPromise])
        .then(response => {
            preload(false);
            if (response instanceof Error && response.message === 'Timeout') {
                swal('Tempo limite de carregamento excedido', '', 'error');
            } else if (response.status) {
                return showResponse(response.response);
            } else {
                swal('Erro ao fazer impressão do relatório', '', 'error');
            }
        })
        .catch(error => {
            preload(false);
            swal('Erro ao fazer impressão do relatório! Muitos dados para o período!', '', 'error');
        });
});

elementProperty.addEventInElement('#mark-all-cities','onclick',function(){
    that_drivers = [];
    let status = this.checked;
    if(status){
        for(let i in document.getElementsByClassName('selecetedd')){
            let this_element = document.getElementsByClassName('selecetedd')[i];
            if(this_element.tagName === "SPAN"){
                that_cities.push(this_element.getAttribute('data'));
                this_element.classList.remove('hidden');
                this_element.classList.add('show');
            }
        }
        return;
    }

    for(let i in document.getElementsByClassName('selecetedd')){
        let this_element = document.getElementsByClassName('selecetedd')[i];
        if(this_element.tagName === "SPAN"){
            if(this_element.classList.contains('show')){
                this_element.classList.remove('show');
                this_element.classList.add('hidden');
                let id = this_element.getAttribute('data');
                for(let i in that_cities){
                    if(that_cities[i] == id){
                        remove = that_cities[i];
                        that_cities.splice(i,1);
                    }
                }

            }
        }
    }

});

elementProperty.addEventInElement('#search-user','onclick',function(){
    let why = document.getElementById('who-search').value;

    if (why.trim() === '') {
        swal('Você precisa preencher um nome válido', '', 'info');

        return;
    }

    if (isSelectAllDriversChecked()) {
        swal('Você precisa desmarcar a opção "Todos Motoristas" antes de buscar usuários.', '', 'info');
        return;
    }

    preload(true);
    UserController.getDriverByName(why , 0).then(response => {
        let data = response.response;
        mountDrivers(data);
    });
});

function mountDrivers(response, concat = false) {
    that_drivers = []; // Limpar a lista de motoristas selecionados

    elementProperty.getElement('#mount-users', element => {
        let list = concat ? element.innerHTML : "";
        let data = response.data;
        list += data.map(driver => {
            return `
                <div id="${driver.idDriver}" class='that-driver'>
                    <span>${driver.name}</span>
                    <span data="${driver.idDriver}" id="seleceted_${driver.idDriver}" class="${that_drivers.includes(driver.idDriver) ? 'show' : 'hidden'} seleceted"><i class="material-icons">check</i></span>
                </div>
            `;
        }).join('');
        element.innerHTML = list;
        preload(false);

        let thatDrivers = document.getElementsByClassName('that-driver');
        for (let i = 0; i < thatDrivers.length; i++) {
            let driverElement = thatDrivers[i];
            driverElement.addEventListener('click', function(event) {
                event.stopPropagation(); // Evitar que o clique se propague para o elemento pai
                let id = this.getAttribute('id');

                this.classList.toggle('selected');

                if (!that_drivers.includes(id)) {
                    that_drivers.push(id);
                } else {
                    const index = that_drivers.indexOf(id);
                    if (index > -1) {
                        that_drivers.splice(index, 1);
                    }
                }

                let checkboxElement = document.getElementById('seleceted_' + id);
                if (checkboxElement) {
                    checkboxElement.classList.toggle('hidden');
                    checkboxElement.classList.toggle('show');
                }
            });
        }
    });
}

elementProperty.addEventInElement('#search-city','onclick',function(){
    let who = document.getElementById('who-city').value;
    elementProperty.getElement('.div-driver',div => {
        div.hidden = true;
        let name = div.getAttribute('name');
        if(name.toUpperCase().startsWith(who.toUpperCase())){
            div.hidden = false;
        }
    });
});

elementProperty.addEventInElement('#who-city','onkeydown',function(){
    if(this.value === '' || this.value === ' '){
        mountList(cities);
    }
});

elementProperty.addEventInElement('#mark-all-drivers', 'onclick', function() {
    selectAllDrivers = this.checked;
    clearSearch();

    that_drivers = []; // Limpar a lista de motoristas selecionados

    let searchText = document.getElementById('who-search').value.trim();
    // if (searchText === '') {
    //     UserController.getAllDriversWithoutPage().then(response => {
    //         let data = response.response;
    //         for (let i = 0; i < driverElements.length; i++) {
    //             let driverElement = driverElements[i];
    //             let driverId = driverElement.getAttribute('id');
    //             let driverCheckbox = document.getElementById('seleceted_' + driverId);
    //
    //             if (status) {
    //                 // Adiciona o ID do motorista à lista quando o botão "Marcar Todos" é marcado
    //                 that_drivers.push(driverId);
    //                 driverCheckbox.classList.remove('hidden');
    //                 driverCheckbox.classList.add('show');
    //             } else {
    //                 const index = that_drivers.indexOf(driverId);
    //                 if (index > -1) {
    //                     that_drivers.splice(index, 1);
    //                 }
    //                 driverCheckbox.classList.remove('show');
    //                 driverCheckbox.classList.add('hidden');
    //             }
    //         }
    //
    //         // Se quiser enviar a lista de IDs para os parâmetros "data.drivers"
    //         let list_drivers_select = JSON.stringify(that_drivers);
    //         list_drivers_select = list_drivers_select.replace(']', '');
    //         list_drivers_select = list_drivers_select.replace(/","/g, '&drivers[]=');
    //         list_drivers_select = list_drivers_select.replace(/"/g, '');
    //         list_drivers_select = list_drivers_select.replace('[', '');
    //
    //         data.drivers = list_drivers_select;
    //
    //         // Agora você pode continuar com o restante do código que usa a lista de motoristas
    //         // e fazer o que for necessário com os IDs dos motoristas selecionados.
    //     });
    // } else {
    //     // Caso em que há texto no campo de pesquisa (você pode adicionar lógica aqui, se necessário)
    // }
});

function clearSearch() {
    elementProperty.getElement('#mount-users', element => {
        element.innerHTML = '';
    });

    document.getElementById('who-search').value = '';
}


elementProperty.addEventInElement('#mount-users','onscroll',function(){
    let total = (this.clientHeight + 1);
    if (this.scrollHeight - this.scrollTop === total) {
        preload(true);
        let why = document.getElementById('who-search').value;
        UserController.getDriverByName(why , pageDriver++).then(response => {
            let data = response.data;
            mountDrivers(data , true);
        });
    }
});

function showResponse(response){

    $('#modal-result').modal('show');
    let data = response;

    elementProperty.getElement('#total_trip', table => {
        let txt = '';
        txt += data.total_trip.map(total => {
            const typeText = total.type === 'Total' ? '' : `Tipo: ${total.type}`;

            // Verifica se o tipo é "Total", se for, altera o nome "Quantidade" para "Quantidade Total" em negrito
            const quantityText = total.type === 'Total' ? '<strong>Quantidade Total:</strong> ' : 'Quantidade: ';

            return `
            <div class="content-data">
                <span>${typeText}</span><br>
                <span>${quantityText}${total.quantity}</span><br>
            </div>
        `;
        }).join('');
        table.innerHTML = txt;
    });

    elementProperty.getElement('#who_received', table => {
        let txt = '';
        txt += data.active_drivers.map(total => {
            const typeText = total.type === 'Total' ? '' : `Tipo: ${total.type}`;

            // Verifica se o tipo é "Total", se for, altera o nome "Quantidade" para "Quantidade Total" em negrito
            const quantityText = total.type === 'Total' ? '<strong>Quantidade Total:</strong> ' : 'Quantidade: ';

            return `
            <div class="content-data">
                <span>${typeText}</span><br>
                <span>${quantityText}${total.quantity}</span><br>
            </div>
        `;
        }).join('');
        table.innerHTML = txt;
    });

    elementProperty.getElement('#who_not_received', table => {
        let txt = '';
        txt += data.inactive_drivers.map(total => {
            const typeText = total.type === 'Total' ? '' : `Tipo: ${total.type}`;

            const quantityText = total.type === 'Total' ? '<strong>Quantidade Total:</strong> ' : 'Quantidade: ';

            return `
            <div class="content-data">
                <span>${typeText}</span><br>
                <span>${quantityText}${total.quantity}</span><br>
            </div>
        `;
        }).join('');
        table.innerHTML = txt;
    });

    elementProperty.getElement('#values_general', table => {
        let txt = '';
        txt += data.moved_billing_values.map(total => {
            const typeText = total.type === 'Total' ? '' : `Tipo: ${total.type}`;

            const commissionText = total.type === 'Total' ? '<strong>Comissão Total:</strong> ' : 'Comissão: ';
            const totalText = total.type === 'Total' ? '<strong>Valor Total:</strong> ' : 'Valor: ';

            return `
            <div class="content-data">
                <span>${typeText}</span><br>
                <span>${commissionText}R$${total.commission}</span><br>
                <span>${totalText}R$ ${total.total}</span><br>
            </div>
        `;
        }).join('');
        table.innerHTML = txt;
    });

    elementProperty.getElement('#total_driver_balance', table => {
        let txt = '';
        txt += data.total_driver_balance.map(total => {
            const typeText = total.type === 'Total' ? '' : `Tipo: ${total.type}`;

            const totalText = total.type === 'Total' ? '<strong>Total:</strong> ' : 'Total: ';

            return `
            <div class="content-data">
                <span>${typeText}</span><br>
                <span>${totalText}R$ ${total.total}</span><br>
            </div>
        `;
        }).join('');
        table.innerHTML = txt;
    });

    elementProperty.getElement('#trip_total_value', table => {
        let txt = '';
        txt += data.trip_total_value.map(total => {
            const typeText = total.paymentForm === 'Total' ? '' : `Tipo: ${total.paymentForm}`;

            const commissionText = total.paymentForm === 'Total' ? '<strong>Comissão Total:</strong> ' : 'Comissão: ';
            const totalText = total.paymentForm === 'Total' ? '<strong>Valor Total:</strong> ' : 'Valor: ';


            return `
            <div class="content-data">
                <span>${typeText}</span><br>
                <span>${commissionText}R$ ${total.commission}</span><br>
                <span>${totalText}R$ ${total.total}</span><br>
            </div>
        `;
        }).join('');
        table.innerHTML = txt;
    });

    elementProperty.getElement('#total_tax_fee', table => {
        let txt = '';
        txt += data.total_tax_fee.map(total => {
            const typeText = total.type === 'Total' ? '' : `Tipo: ${total.type}`;

            const totalText = total.type === 'Total' ? '<strong>Total:</strong> ' : 'Total: ';

            return `
            <div class="content-data">
                <span>${typeText}</span><br>
                <span>${totalText}R$ ${total.total}</span><br>
            </div>
        `;
        }).join('');
        table.innerHTML = txt;
    });


}

elementProperty.addEventInElement('#mount-levels','onchange',function () {
    mountIndications( name , this.value);
});

elementProperty.addEventInElement('#search-by-name','oninput',function () {
    monetizationId = document.getElementById('mount-levels').value;
    mountIndications(this.value , monetizationId);
});

elementProperty.getElement('#mount-levels' , these => {
    let data = {};
    data.method = 'GET';
    FinancialController.referralMonetization(data).then(({status,response}) => {
        preload(false);
        if(!status)
            return swal('Erro ao listar itens','Contate o suporte','error');


        let content = '';
        content += response.map(item => {
            return `
                <option value="${item.id}">${item.label}</option>
            `;
        }).join('');

        these.innerHTML += content;

    });
});

elementProperty.addEventInElement('#search-users-by-name','oninput',function () {
    let name = this.value;
    elementProperty.getElement('#userId', these => {
        UserController.getAll(name).then(({status , data , message}) => {
            if(!status)
                return swal('Erro ao buscar lista de motoristas','Contate o suporte' , 'info');

            let content = ''
            content += data.map(driver => {
                return `
                    <option value="${driver.idUser}">${driver.name} - ${driver.type}</option>
                `;
            }).join('');
            these.innerHTML = content;
        });
    });
});

elementProperty.addEventInElement('#search-indications-user','onclick',function () {
    elementProperty.getElement('#mount-indication-total', these => {
        Indication.insert(['dateStart','dateEnd','userId']).then(resolve => {
            let content = '';
            content += resolve.map(item => {
                let period = item.period.replace('~','-');
                return `
                    <tr>
                        <th scope="col">${item.name}</th>
                        <th scope="col">${period}</th>
                        <th scope="col">${item.userType}</th>
                        <th scope="col">R$ ${item.total}</th>
                    </tr>
                `;
            }).join('');
            these.innerHTML = content;
        });
    });
});

function isSelectAllDriversChecked() {
    let markAllDriversCheckbox = document.getElementById('mark-all-drivers');
    return markAllDriversCheckbox.checked;
}
