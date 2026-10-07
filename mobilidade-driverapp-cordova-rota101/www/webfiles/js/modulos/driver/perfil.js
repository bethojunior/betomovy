viewController.setObserver("profile-driver", () => {
    const elementProperty = new ElementProperty();
    const driverController = new DriverController();
    const bankAccountController = new BankAccountController();
    const bankController = new BankController();
    const userLogged = Session.get("user");
    
    const dataBank = {
        idBankAccount: null,
        bank: null,
    };

    updateDataDriver();
    updateDataDriverByServer();
    banks();

    function banks(userBankData = null) {
        bankController.getAll().then(({status, data}) => {
            let myBank;

            if (!status)
                return;

            myBank = userBankData 
            ? data.find((res) => {
                return res.bankName = userBankData.bankName;
            }) 
            : ''
    
            const autocomplete = new Autocomplete();
            autocomplete.initAutocomplete("#bankAccountDriver", data, "bankName", ["bankName"]);
    
            autocomplete.getItemSelected(bank => {
                dataBank.bank = bank['idBank'];
            });

            if(myBank) {
                autocomplete.setSelectedItem(myBank.idBank, 'idBank');
            }
            
    
            $('select').material_select();
        });
    }

    function updateDataDriver() {
        const user = Session.get("user");
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });

        const profileImage = userLogged.profileImage;
        const finalLink = `${picturesLink.value}driver/profile/compressed/${profileImage}`;

        elementProperty.getElement(".image-profile-driver", element => {
            element.style.backgroundImage = `url(${finalLink})`;
        });

        elementProperty.getElement(".name-driver", element => {
            element.innerHTML = user.nickname;
        });

        elementProperty.getElement("#driverRating", element => {
            element.innerHTML = Mask.maskMoney(parseFloat(user.rating));
        });

        elementProperty.getElement("#totalTripFinished", element => {
            element.innerHTML = user.totalFinishedTrip;
        });

        elementProperty.getElement("#dataCarDriver", element => {
            if (!Array.isArray(user.car)) {
                element.innerHTML = `${user.car.brand} ${user.car.model} - ${user.car.plate}`;
            } else {
                element.innerHTML = ""
            }
        });
    }

    function getAccount() {
        preload(true)
        driverController.findWithAccountInfo(userLogged.idDriver).then(({status, data}) => {
            preload(false)
            if (!status)
                return

            document.querySelector('.user-name').value = data.holderName;
            document.querySelector('.cpf-bank-driver').value = data.document;
            document.querySelector('.agency-bank-driver').value = data.agency;
            document.querySelector('.agency-digit-bank-driver').value = data.agencyDigit;
            document.querySelector('.number-account-bank-driver').value = data.numberAccount;
            document.querySelector('.number-account-digit-bank-driver').value = data.numberAccountDigit;
            document.querySelector('.op-bank-driver').value = data.op;
            document.querySelector('.pix-bank-driver').value = data.pix;
            banks(data);

            dataBank.idBankAccount = parseInt(data.idBankAccount);
        })
    }

    async function removeAccountAndLogOut(idUser) {
        try {
            const response = await driverController.excludeAccount({idUser: idUser})
            if (!response?.status) {
                preload(false)
                return SwalCustom.messageDialog((response?.errors?.message || response?.message), "Atenção", () => {}, "success")
            }
            
            SwalCustom.messageDialog("Conta excluida com sucesso", "Atenção", () => {}, "success")

             setTimeout(() => {
                Session.delete("user");
                Object.keys(localStorage).forEach(k => { if (k !== "lastLogin") localStorage.removeItem(k) });
                Route.redirect("Main");
            }, 1500)
            return

        } catch (error) {
            preload(false)
            console.log(error)
        }
    }

    function validateAccount(account){
        if(account.holderName.length === 0){
            SwalCustom.messageDialog("Informe o nome do responsavel","Atenção",()=>{},"warning");
            return false;
        }
        if(account.numberAccount.length === 0){
            SwalCustom.messageDialog("Informe o numero da conta ","Atenção",()=>{},"warning");
            return false;
        }
        if(account.agency.length === 0){
            SwalCustom.messageDialog("Informe o numero da agência ","Atenção",()=>{},"warning");
            return false;
        }
        if(account.bankId.length === 0){
            SwalCustom.messageDialog("Selecione um banco","Atenção",()=>{},"warning");
            return false;
        }
        if(!ValidateForm.validateCpf(account.document.replace(/\D/g, ''))){
            SwalCustom.messageDialog("CPF invalido","Atenção",()=>{},"warning");
            return false;
        }
        if(account.typeAccount.length === 0){
            SwalCustom.messageDialog("Informe o tipo de conta","Atenção",()=>{},"warning");
            return false;
        }
        if(dataBank.bank === null){
            elementProperty.getElement("#bankAccount",element=>{
                element.value = "";
                element.focus();
            });
            SwalCustom.messageDialog("Banco não informado","Atenção",()=>{},"warning");
            return false;
        }

        return true;
    }

    function editBank(account) {
        account['idBankAccount'] = dataBank.idBankAccount;

        preload(true);
            bankAccountController.edit(account).then(({status, data}) => {
                preload(false);
                if(!status)
                    return SwalCustom.messageDialog("Erro ao atualizar dados bancários","Atenção",()=>{},"warning");
                
                SwalCustom.messageDialog("Banco atualizado com sucesso","success",() => {
                    elementProperty.removeClass(".driver-account", "active")
                },"success");
            })
    }

    function createAccount(account) {
        bankAccountController.insert(account).then(({status,data})=>{
            if(!status)
                return SwalCustom.messageDialog("Ocorreu um problema ao tentar cadastra conta","atenção",()=>{},"warning");

            SwalCustom.messageDialog("Banco atualizado com sucesso","success",() => {
                elementProperty.removeClass(".driver-account", "active")
            },"success");
        })
    }

    function bankAction() {
        elementProperty.getObjectByForm("#formSignupAccountPerfil").then(object => {
            if(!validateAccount(object))
                    return;
            object['userId'] = parseInt(userLogged.idUser);
            object['driverId'] = parseInt(userLogged.idDriver);
            object['bankId'] = parseInt(dataBank.bank);

            dataBank.idBankAccount ? editBank(object) : createAccount(object);

        })
    };

    elementProperty.addEventInElement("#settingApp", "onclick", () => {
        Route.redirectDynamic("App", "Setting");
    });

    elementProperty.addEventInElement("#excludeApp", "onclick", async() => {
        preload(true)
        const { idUser } = Session.get("user");
        SwalCustom.dialogConfirm("Deseja realmente excluir sua conta ?", "" , async (status) => {
            preload(true)
            status && await removeAccountAndLogOut(idUser)
            preload(false)
        })
        preload(false);
    })

    elementProperty.addEventInElement("#editProfileDriver", "onclick", () => {
        Route.redirectDynamic("Driver", "EditProfileDriver");
    });

    elementProperty.addEventInElement("#accountInProfile", "onclick", function () {
        elementProperty.addClass(".driver-account", "active")
        getAccount();
    });

    elementProperty.addEventInElement("#closeModalBankAccountProfile","onclick", function(){
        elementProperty.removeClass(".driver-account", "active")
    });

    elementProperty.addEventInElement("#btnSaveAccount", "onclick", () => {
        bankAction();
    });

    elementProperty.addEventInElement("#vehicleDriver", "onclick", () => {
        Route.redirectDynamic("Driver", "Vehicle");
    });

    elementProperty.addEventInElement("#qrcodeFiscalizacao", "onclick", () => {
        Route.redirectDynamic("Driver", "Audit");
    });

    elementProperty.addEventInElement("#reportSupport", "onclick", () => {
        const support = !Array.isArray(Session.getValueInSession("cityConfig", "supportContactNumber")) ?
            Session.getValueInSession("cityConfig", "supportContactNumber") :
            CONTACT_SUPPORT;

        window.open(`https://wa.me/${support}/`, '_system', 'location=yes')
    });

    elementProperty.addEventInElement("#reportDebug", "onclick", async () => {
        const version = await cordova.getAppVersion.getVersionNumber();
        const { idDriver, idUser, nickname } = Session.get("user");
        let statusLocationBackground = false;
        let statusGps = false;
        let statusWriteExternalStorage = false;
        let statusSystemOverlay = false;
        let statusIgnoreBatteryOptimization = false;

        FloatingWidget.getPermissionLocation(() => statusLocationBackground = true, () => statusLocationBackground = false);

        FloatingWidget.checkSystemOverlayPermission(({status}) => statusSystemOverlay = status);

        RequestIgnoreBatteryOptimizationCordova.checkPermission(({status}) => statusIgnoreBatteryOptimization = status);

        await positionLocation.verifyGps().then(() => statusGps = true).catch(() => statusGps = false);

        cordova.plugins.permissions.checkPermission(cordova.plugins.permissions.WRITE_EXTERNAL_STORAGE, (result) => {
            if (!result.hasPermission) {
                statusWriteExternalStorage = false;
            } else {
                statusWriteExternalStorage = true;
            }
        }, (error) => {
            console.log(error)
        });

        preload(true);
        setTimeout(() => {
            const data = {
                "driverId": idDriver,
                version,
                "permissionLocationBackground": statusLocationBackground,
                "permissionGps": statusGps,
                "permissionWriteExternalStorage": statusWriteExternalStorage,
                "permissionSystemOverlay": statusSystemOverlay,
                "permissionIgnoreBatteryOptimization": statusIgnoreBatteryOptimization,
                "name": nickname,
                "userId": idUser,
            }

            DriverController.sendAppInfo(data).then(({status}) => {
                if(!status) {
                    swal('', getTextTranslate("profile", "report-debug-error"), 'info');
                    preload(false);
                }

                swal('', getTextTranslate("profile", "report-debug-success"), 'success');
                preload(false);
            });
            preload(false);
        }, 1500);
    });

    elementProperty.addEventInElement("#logoutByProfile", "onclick", () => {
        const trip = Session.get("tripDriver");
        const userLogged = Session.get("user");

        new DriverController().toggleStatus(userLogged.idDriver, 'desligado');

        if (trip.length !== 0) {
            SwalCustom.dialogConfirm("Atenção",
                "Ao sair do aplicativo em corrida você estara cancelando a viagem !", (status) => {
                    if (status) {
                        new DriverController().cancelTrip({
                            tripReference: trip.tripReference,
                            driverId: userLogged.idDriver,
                            cancellationReasonsId: 4
                        }).then(() => {
                            Session.delete("imageCooperative");
                            Session.delete("user");
                            Object.keys(localStorage).forEach(k => { if (k !== "lastLogin") localStorage.removeItem(k) });
                            Route.redirect("Main")
                        })

                    }
                });
            return;
        }

        setTimeout(() => {
            Session.delete("user");
            Object.keys(localStorage).forEach(k => { if (k !== "lastLogin") localStorage.removeItem(k) });
            Route.redirect("Main");
        }, 1500)
    });

    function updateDataDriverByServer() {
        const userLogged = Session.get("user");

        new DriverController().find(userLogged.idDriver).then(result => {
            if (!result.status)
                return;

            userLogged.stationId = result.data.stationId;
            userLogged.status = result.data.status;
            userLogged.driverRegisterStatusId = result.data.driverRegisterStatusId;
            userLogged.reasons = result.data.reasons;
            userLogged.preAvailable = result.data.preAvailable;
            userLogged.preAvailableTrip = result.data.preAvailableTrip;
            userLogged.car = result.data.car;
            userLogged.totalFinishedTrip = result.data.total_finished_trip;
            userLogged.name = result.data.name;
            userLogged.nickname = result.data.nickname;
            userLogged.phone = result.data.phone;
            userLogged.rating = result.data.rating;

            Session.set("user", userLogged);

            updateDataDriver();
        });
    }

    viewController.onResume("profile-driver", () => {
        updateDataDriver();
        updateDataDriverByServer();
    });
});

function comeBackIndexChat() {
    Route.backPage();
}
