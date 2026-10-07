document.addEventListener("DOMContentLoaded", function () {
    loadData();

    function loadData() {
        preload(true);
        document.querySelector("#btn-list-smtp").style.display = "none";
        document.querySelector("#headerSmtpTable").hidden = false;

        elementProperty.getElement('#tableSmtpServer', element => {
            SMTPServerController.findAllActive().then(({response}) => {
                preload(false);

                const result = response;

                document.querySelector("#tableSmtpServer").innerHTML = result.map(item => {

                    return `<tr ${item.read == true ? "style='opacity:0.75'" : ""}>
                        <td>${item.mailer}</td>
                        <td>${item.fromMailer}</td>
                        <td>${item.fromName}</td>
                        <td>${item.host}</td>
                        <td>${item.port}</td>
                        <td>${item.username}</td>
                        <td>${item.encryption}</td>
                        <td>${item.default == 0 ? 'Não' : 'Sim'}</td>
                        <td>${`
                            <button type="button" title="Editar" class="btn btn-secondary btn-sm btn-edit-smtp" idSmtp="${item.id}">
                                <i class="material-icons">edit</i>
                            </button>
                            <button type="button" title="Excluir" class="btn btn-danger btn-sm btn-remove-smtp" idSmtp="${item.id}">
                                <i class="material-icons">delete</i>
                            </button>
                            <button type="button" title="Testar envio de email" class="btn btn-primary btn-sm btn-send-smtp" idSmtp="${item.id} id="btn-test-smtp">
                                <i class="material-icons">send</i>
                            </button>
                        `}</td>
                    </tr>`
                }).join("");

                elementProperty.addEventInElement(".btn-edit-smtp", "onclick", function () {
                    const idSmtp = this.getAttribute("idSmtp");

                    preload(true);
                    SMTPServerController.editSmtp(idSmtp)
                        .then((response) => {
                            preload(false)
                            editSMTPServer(response.response);
                            updateSMTPServer(response.response);

                            document.querySelector("#btn-create-smtp").style.display = "none";
                            document.querySelector("#btn-list-smtp").style.display = "block";
                            document.querySelector("#btn-update-smtp").style.display = "block";
                            document.querySelector("#btn-save-smtp").style.display = "none";
                            document.querySelector("#headerSmtpTable").hidden = true;
                            document.querySelector("#formSMTPServer").hidden = false;
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                        .finally(() => {
                            preload(false);
                        });
                });

                elementProperty.addEventInElement(".btn-remove-smtp", "onclick", function () {
                    const idSmtp = this.getAttribute("idSmtp");

                    SwalCustom.dialogConfirm("Confirma Exclusão de Smtp", "", (status) => {
                        if (status) {
                            preload(true);
                            SMTPServerController.removeSmtp(idSmtp)
                                .then((response) => {
                                    SwalCustom.messageDialog('', 'Excluido com sucesso!', 'success').then(() => {
                                        preload(false);
                                        window.location.reload();
                                    })
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                                .finally(() => {
                                    preload(false);
                                });
                        }
                    })
                });

                elementProperty.addEventInElement(".btn-send-smtp", "onclick", function () {                    
                    var modal = document.getElementById("myModal");
                    modal.style.display = "block";                  
                    
                    var closeBtn = document.querySelector(".close-smtp");
                    closeBtn.onclick = function() {
                      modal.style.display = "none";
                    };                  
                  
                    window.onclick = function(event) {
                      if (event.target == modal) {
                        modal.style.display = "none";
                      }
                    };                  
                    
                    var sendButton = document.getElementById("sendButton");
                    sendButton.onclick = function() {
                      var emailInput = document.getElementById("emailInput").value;
                      
                      SMTPServerController.sendEmailSmtp({ email: emailInput }).then((response) => {
                        if(!response.status){
                            SwalCustom.messageDialog('', "A autenticação no servidor SMTP falhou", 'error').then(() => {
                                preload(false);
                            })
                            return
                        }

                        SwalCustom.messageDialog('', 'Email enviado com sucesso!', 'success').then(() => {
                            preload(false);
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                            modal.style.display = "none";
                        })
                      }).catch((error) => {
                        console.error(error)
                      }).finally(() => {
                        preload(false);
                      })
                    };
                  });
                  

                const indexOptionSelected = response ? "2" : "1";

                document.querySelector(`input[name='smtpOptions'][value='${indexOptionSelected}']`).checked = true;

                if (response) {
                    document.querySelector("#contentSMTPServer").hidden = false;
                    document.querySelector("#nameService").value = response.mailer ?? "";
                    document.querySelector("#fromMail").value = response.fromMailer ?? "";
                    document.querySelector("#fromName").value = response.fromName ?? "";
                    document.querySelector("#hostname").value = response.host ?? "";
                    document.querySelector("#port").value = response.port ?? "";
                    document.querySelector("#username").value = response.username ?? "";
                    document.querySelector("#password").value = response.password ?? "";
                    document.querySelector("#encryption").value = response.encryption ?? "";
                    elementProperty.getElement(".input-required", element => {
                        element.required = true;
                    })
                }

                document.querySelector("#formSMTPServer").hidden = true;
            });
        });
    }

    elementProperty.addEventInElement("#btn-create-smtp", "onclick", function () {
        document.querySelector("#btn-create-smtp").style.display = "none";
        document.querySelector("#btn-list-smtp").style.display = "block";
        document.querySelector("#btn-save-smtp").style.display = "block";
        document.querySelector("#btn-update-smtp").style.display = "none";
        document.querySelector("#headerSmtpTable").hidden = true;
        document.querySelector("#formSMTPServer").hidden = false;
    });

    elementProperty.addEventInElement("#btn-list-smtp", "onclick", function () {
        document.querySelector("#btn-create-smtp").style.display = "block";
        document.querySelector("#btn-list-smtp").style.display = "none";
        document.querySelector("#headerSmtpTable").hidden = false;
        document.querySelector("#formSMTPServer").hidden = true;
    });

    document.querySelectorAll("input[name='smtpOptions']").forEach(function (element) {
        element.onchange = function () {
            document.querySelector("#contentSMTPServer").hidden = this.value === "1";
            elementProperty.getElement(".input-required", element => {
                element.required = this.value === "2";
            })
        }
    })

    elementProperty.addEventInElement("#formSMTPServer", "onsubmit", function (event) {
        event.preventDefault();

        switch (document.querySelector("input[name='smtpOptions']:checked").value) {
            case "1":
                disableSMTPServer();
                break;
            case "2":
                createSMTPServer();
                break;
        }
    });

    elementProperty.addEventInElement("#showPassword", "onchange", function () {
        document.querySelector("#password").setAttribute("type", this.checked ? "text" : "password");
    });

    function editSMTPServer(response) {
        document.querySelector("#nameService").value = response.mailer ?? "";
        document.querySelector("#fromMail").value = response.fromMailer ?? "";
        document.querySelector("#fromName").value = response.fromName ?? "";
        document.querySelector("#hostname").value = response.host ?? "";
        document.querySelector("#port").value = response.port ?? "";
        document.querySelector("#username").value = response.username ?? "";
        document.querySelector("#password").value = response.password ?? "";
        document.querySelector("#encryption").value = response.encryption ?? "";
    }

    function updateSMTPServer(response) {
        elementProperty.addEventInElement("#btn-update-smtp", "onclick", function () {
            const mailer = document.querySelector("#nameService").value;
            const fromMailer = document.querySelector("#fromMail").value;
            const fromName = document.querySelector("#fromName").value;
            const host = document.querySelector("#hostname").value;
            const port = document.querySelector("#port").value;
            const username = document.querySelector("#username").value;
            const password = document.querySelector("#password").value;
            const encryption = document.querySelector("#encryption").value;
            const smtp = {
                mailer,
                fromMailer,
                fromName,
                host,
                port,
                username,
                password,
                encryption,
            };
            const smtpId = response.id;

            SMTPServerController.updateSmtp(smtpId, smtp)
                .then((response) => {
                    SwalCustom.messageDialog('', 'Atualizado com sucesso!', 'success').then(() => {
                        preload(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    })
                })
                .catch((error) => {
                    console.log(error);
                }).finally(() => {
                    preload(false);
                }
            );
        });
    }

    function disableSMTPServer() {
        document.querySelector("#nameService").value = "";
        document.querySelector("#fromMail").value = "";
        document.querySelector("#fromName").value = "";
        document.querySelector("#hostname").value = "";
        document.querySelector("#port").value = "";
        document.querySelector("#username").value = "";
        document.querySelector("#password").value = "";
        document.querySelector("#encryption").value = "";

        preload(true);
        SMTPServerController.disable().then(({status}) => {
            preload(false)
            if (status) {
                SwalCustom.messageDialog("", "Credenciais de serviço SMTP atualizadas", "success");
            } else {
                SwalCustom.messageDialog("", "Erro ao atualizar credenciais de SMTP");
            }
        });
    }

    function createSMTPServer() {
        const data = {
            mailer: document.querySelector("#nameService").value,
            fromMailer: document.querySelector("#fromMail").value,
            fromName: document.querySelector("#fromName").value,
            host: document.querySelector("#hostname").value,
            port: document.querySelector("#port").value,
            username: document.querySelector("#username").value,
            password: document.querySelector("#password").value,
            encryption: document.querySelector("#encryption").value
        };

        preload(true);
        SMTPServerController.create(data).then(({status}) => {
            preload(false);
            if (status) {
                SwalCustom.messageDialog("", "Credenciais de serviço SMTP atualizadas", "success");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                SwalCustom.messageDialog("", "Erro ao cadastrar credenciais de SMTP");
            }
        });
    }
});
