let driverId = 0;
let dataBoleto = [];
let boletosVerify = false;
let driverIdOverdue = [];
let driverIdDesblock = [];
let dadosBoletos = [];
let indexArrayBoletos = 0;
let indexArrayBoletosAPI = 0;
let indexArrayBlockAPI = 0;
let indexArrayUnBlockAPI = 0;
let timeout;
let timeoutAPI;
let timeoutBLOCK;
let timeoutUNBLOCK;

window.addEventListener('load', function () {
    preload(true);
    var settings = {
        "url": `${ConnectionServer.Host()}city/actives`,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "token": Session.getValueInSession('user', 'api_token'),
            "userid": Session.getValueInSession('user', 'idUser')
        },
    };

    $.ajax(settings).done(function ({ status, data }) {
        if (!status)
            return swal('Erro ao listar cidades ' + response[0], 'Contate o suporte', 'info');
        if (data === null)
            return swal('Não há dados de cidades', 'Tente novamente', 'info');
        let city = '';
        city += data.map((item) => {
            return `
                <option value="${item.cityId}">${item.nome}</option>
            `
        })
        city += `<option value="0">Selecionar todas</option>`
        document.getElementById('select-cities').innerHTML = city;
        preload(false);
    });
});

elementProperty.addEventInElement('#btn-do-filter', 'onclick', function () {
    preload(true);
    dataBoleto = [];
    let cityValue = document.getElementById('select-cities').value
    let valor = document.getElementById('input-valor').value
    FinancialController.getAll().then(({ status, response }) => {
        let total = 0;
        let totalMotoristas = 0;
        if (!status)
            return swal('Erro ao listar relatório de motorista ' + response, 'Contate o suporte', 'info');

        if (response === null)
            return swal('Não há dados de produção desse motorista para essa data', 'Tente outra data', 'info');

        let content = '';
        content += response.filter((a) =>
            a.balance < -parseFloat(valor) && cityValue != 0 ? a.cityId == cityValue : a.balance < -parseFloat(valor)
        ).map((item, index) => {
            total = total + item.balance;
            totalMotoristas = totalMotoristas + 1;
            dataBoleto.push(item);
            return `
                <tr> 
                    <th>${item.name}</th>
                    <th>${Mask.maskMoney(parseFloat(item.balance))}</th>
                </tr> 
            `;
        });
        // HTML DO CONTEUDO FRONT //
        document.getElementById('mount-here-relatorio').innerHTML = content;
        document.getElementById('total').innerHTML = `<h5>R$ ${parseFloat(total).toFixed(2)}</h5>`;
        document.getElementById('total-motoristas').innerHTML = `<h5 class="ml-5">${totalMotoristas}</h5>`;
        preload(false);
    })

});

elementProperty.addEventInElement('#show-modal-btn-data', 'onclick', sendBoleto);
function sendBoleto() {
    if (dataBoleto.length == 0)
        return swal('Não há dados para gerar o boleto', 'Por favor tente novamente', 'info');
    let data = dataBoleto;

    SwalCustom.confirm("Deseja gerar boleto", "Essa ação é irreversivel, você irá gerar boleto para " + data.length + " MOTORISTAS.")
        .then(() => {
            sendBoletosAPI(dataBoleto)
            $('#progress-sendboleto-api').attr('aria-valuemax', dataBoleto.length);
        }).catch((err) => {
            swal('Erro ao enviar boleto', 'Error: ' + err, 'error');
        })
};

async function sendBoletosAPI(dataBoleto) {
    clearTimeout(timeoutAPI);
    if (indexArrayBoletosAPI < dataBoleto.length) {
        console.log('CRIANDO BOLETO E ENVIANDO ' + indexArrayBoletosAPI)
        $('#modalProgress').modal('show');
        document.getElementById('progress-sendboleto-api').innerHTML = `<span class="text-dark"><strong>${indexArrayBoletosAPI} / ${dataBoleto.length}</strong></span>`;
        $('#progress-sendboleto-api').attr('aria-valuenow', indexArrayBoletosAPI)
        $('#progress-sendboleto-api').width((Math.round(indexArrayBoletosAPI * 100) / dataBoleto.length) + "%")

        FinancialController.createBoletoAsaas(dataBoleto[indexArrayBoletosAPI]).then((response) => {
            if (response.response == null) {
                clearTimeout(timeoutAPI);
                swal('Erro ao Gerar boleto, falha de comunicação com o asaas', 'Error: ' + err, 'error');
            }
            if (response.status === true && response.response != null) {
                let id = dataBoleto[indexArrayBoletosAPI].idDriver;
                let valor = dataBoleto[indexArrayBoletosAPI].balance * -1;
                let data = {};
                data.value = valor;
                data.driverId = id;

                DriverController.insertBalance(id, data).then(response => {
                    if (response.status) {
                        indexArrayBoletosAPI++;
                        timeoutAPI = setTimeout(() => sendBoletosAPI(dataBoleto), 500);
                    } else {
                        clearTimeout(timeoutAPI);
                        swal('Erro na chamada da API [insertBalance]', response.errors[0], 'error');
                    }
                }).catch((err) => {
                    clearTimeout(timeoutAPI);
                    swal('Erro ao ajustar saldo', 'Error: ' + err, 'error');
                })
            } else {
                clearTimeout(timeoutAPI);
                swal('Erro na chamada da API [createBoletoAsaas]', 'Error', 'error');
            }

        }).catch((err) => {
            clearTimeout(timeoutAPI);
            swal('Erro ao criar boleto', 'Error: ' + err, 'error');
        })
    } else {
        $('#modalProgress').modal('hide');
        swal('Boletos enviados', 'Boletos enviados com sucesso [ENVIADOS: ' + dataBoleto.length + ' ]', 'success');
    }
}

// VERIFICAR BOLETOS //
elementProperty.addEventInElement('#btn-verificarBoletos', 'onclick', verifyBoletos);
function verifyBoletos() {
    preload(true);
    dadosBoletos = [];
    driverIdDesblock = [];
    driverIdOverdue = [];

    if (boletosVerify === false) {
        FinancialController.getAll().then(({ status, response }) => {
            if (status) {
                response.map((item) => dadosBoletos.push(item));
            };

            preload(true);
            console.log("TOTAL: " + dadosBoletos.length);
            verifyBoletosByApi(dadosBoletos);
            $('#progress-bar-verify').attr('aria-valuemax', dadosBoletos.length);
            preload(false);

        });
        console.log(driverIdDesblock);
        console.log(driverIdOverdue);
        preload(false)
    }
};

function verifyBoletosByApi(dadosBoletosParam) {
    console.log("INDEX ATUAL: " + indexArrayBoletos);
    clearTimeout(timeout);

    if (indexArrayBoletos < dadosBoletosParam.length) {
        if (dadosBoletosParam[indexArrayBoletos].idDriver) {
            $('#modalDrivers').modal('show');
            document.getElementById('progress-bar-verify').innerHTML = `<span class="text-dark"><strong>${indexArrayBoletos} / ${dadosBoletosParam.length}</strong></span>`;
            $('#progress-bar-verify').attr('aria-valuenow', indexArrayBoletos)
            $('#progress-bar-verify').width((Math.round(indexArrayBoletos * 100) / dadosBoletosParam.length) + "%")

            let idDriver = dadosBoletosParam[indexArrayBoletos].idDriver;
            console.log('ID DRIVER: ' + idDriver);
            FinancialController.getBoletosAsaas(idDriver).then(({ status, response }) => {
                console.log('RESPONSE: ' + response);
                if (status === true) {
                    if (response) {
                        let dataPending = response.data;
                        console.log(response);
                        if (dataPending.length > 0) {
                            for (var a = 0; a < dataPending.length; a++) {
                                if (dataPending[a].status === "OVERDUE") {
                                    driverIdOverdue.push(dataPending[a].externalReference);
                                    break;
                                } else if ((dataPending[a].status === "CONFIRMED" ||
                                    dataPending[a].status === "RECEIVED") &&
                                    dadosBoletosParam[indexArrayBoletos].driverRegisterStatusId != 1) {
                                    let haveOverdue = false;
                                    for (var b = 0; b < dataPending.length; b++) {
                                        if (dataPending[b].status === "OVERDUE")
                                            haveOverdue = true;
                                    };
                                    if (haveOverdue === false)
                                        driverIdDesblock.push(dataPending[a].externalReference);
                                }
                            };
                        };
                        indexArrayBoletos++;
                        timeout = setTimeout(() => verifyBoletosByApi(dadosBoletosParam), 400);
                    } else {
                        clearTimeout(timeout);
                        $('#modalDrivers').modal('hide');
                        swal('Erro ao verificar boleto', 'Error: RESPONSE NULO OU INVALIDO', 'error');
                    }
                } else {
                    clearTimeout(timeout);
                    $('#modalDrivers').modal('hide');
                    swal('Erro ao verificar boleto', 'Error', 'error');
                }
            }).catch((err) => {
                clearTimeout(timeout);
                $('#modalDrivers').modal('hide');
                swal('Erro ao verificar boleto', 'Error: ' + err, 'error');
            })
        };
    } else {
        boletosVerify = true;
        document.getElementById('btn-bloquear').disabled = false;
        document.getElementById('btn-desbloquear').disabled = false;
        document.getElementById('total-motoristas-est').innerHTML = `<h5 class="text-dark">${dadosBoletos.length}</h5>`;
        document.getElementById('total-vencido-est').innerHTML = `<h5 class="text-danger">${driverIdOverdue.length}</h5>`;
        document.getElementById('total-unblock-est').innerHTML = `<h5 class="text-warning">${driverIdDesblock.length}</h5>`;

        $('#modalDrivers').modal('hide');
        swal('Motoristas verificados',
            'Motoristas verificados com sucesso [PENDENTE: ' + driverIdOverdue.length + ' ] [EM DIA: ' + driverIdDesblock.length + ' ]',
            'success');
        console.log(dadosBoletos);
        console.log(driverIdDesblock);
        console.log(driverIdOverdue);
    }
}

// BLOQUEAR MOTORISTAS //
elementProperty.addEventInElement('#btn-bloquear', 'onclick', blockDrivers);
function blockDrivers() {
    preload(true)
    if (boletosVerify) {
        blockDriversAPI(driverIdOverdue)
        $('#progress-bar-block').attr('aria-valuemax', driverIdOverdue.length);
        preload(false)
    } else {
        SwalCustom.messageDialog("Verifique os boletos", "Os boletos precisam ser verificados antes", "error");
    }
};

function blockDriversAPI(driverId) {
    clearTimeout(timeoutBLOCK);

    if (indexArrayBlockAPI < driverId.length) {
        $('#blockDrivers').modal('show');
        document.getElementById('progress-bar-block').innerHTML = `<span class="text-danger"><strong>${indexArrayBlockAPI} / ${driverId.length}</strong></span>`;
        $('#progress-bar-block').attr('aria-valuenow', indexArrayBlockAPI)
        $('#progress-bar-block').width((Math.round(indexArrayBlockAPI * 100) / driverId.length) + "%")

        DriverController.getReasonsBlocked().then(resolve => {
            if (resolve) {
                let data = {};
                data.blockReasonsTypeIds = [];
                let pendencie = JSON.stringify(resolve.response[1]['idBlockReasonsType']);
                data.blockReasonsTypeIds.push(pendencie);

                DriverController.blockDriver(driverId[indexArrayBlockAPI], data).then(res => {
                    if (res.status) {
                        indexArrayBlockAPI++;
                        timeoutBLOCK = setTimeout(() => blockDriversAPI(driverIdOverdue), 500);
                    } else {
                        clearTimeout(timeoutBLOCK);
                        $('#blockDrivers').modal('hide');
                        swal('Erro ao chamar API', 'Error: [STATUS FALSE ERROR API]', 'error');
                    }
                }).catch((err) => {
                    clearTimeout(timeoutBLOCK);
                    $('#blockDrivers').modal('hide');
                    swal('Erro ao bloquear motorista', 'Error: ' + err, 'error');
                })
            } else {
                clearTimeout(timeoutBLOCK);
                $('#blockDrivers').modal('hide');
                swal('Erro ao chamar API', 'Error: [RESOLVE NULL ERROR API]', 'error');
            }
        }).catch((err) => {
            clearTimeout(timeoutBLOCK);
            $('#blockDrivers').modal('hide');
            swal('Erro ao bloquear motorista', 'Error: ' + err, 'error');
        })
    } else {
        $('#blockDrivers').modal('hide');
        swal('Motoristas bloqueados', 'Motoristas bloqueados com sucesso [TOTAL: ' + driverId.length + ' ]', 'success');
    }
}

// DESBLOQUEAR MOTORISTAS //
elementProperty.addEventInElement('#btn-desbloquear', 'onclick', unblockDrivers);
function unblockDrivers() {
    preload(true)
    if (boletosVerify) {
        unblockDriversAPI(driverIdDesblock)
        $('#progress-bar-unblock').attr('aria-valuemax', driverIdDesblock.length);
        preload(false)
    } else {
        SwalCustom.messageDialog("Verifique os boletos", "Os boletos precisam ser verificados antes", "error")
    }
};

function unblockDriversAPI(driverId) {
    clearTimeout(timeoutUNBLOCK);

    if (indexArrayUnBlockAPI < driverId.length) {
        $('#unblockDrivers').modal('show');
        document.getElementById('progress-bar-unblock').innerHTML = `<span class="text-danger"><strong>${indexArrayUnBlockAPI} / ${driverId.length}</strong></span>`;
        $('#progress-bar-unblock').attr('aria-valuenow', indexArrayUnBlockAPI)
        $('#progress-bar-unblock').width((Math.round(indexArrayUnBlockAPI * 100) / driverId.length) + "%")

        DriverController.activateRegister(driverId[indexArrayUnBlockAPI]).then(resolve => {
            if (resolve) {
                indexArrayUnBlockAPI++;
                timeoutUNBLOCK = setTimeout(() => unblockDriversAPI(driverIdDesblock), 500);
            } else {
                clearTimeout(timeoutUNBLOCK);
                $('#unblockDrivers').modal('hide');
                swal('Erro ao desbloquear motorista', 'Error: [RESOLVE FALSE ERROR API]', 'error');
            }
        }).catch((err) => {
            clearTimeout(timeoutUNBLOCK);
            $('#unblockDrivers').modal('hide');
            swal('Erro ao desbloquear motorista', 'Error: ' + err, 'error');
        })
    } else {
        $('#unblockDrivers').modal('hide');
        swal('Motoristas desbloqueados', 'Motoristas desbloqueados com sucesso [TOTAL: ' + driverId.length + ' ]', 'success');
    }
};