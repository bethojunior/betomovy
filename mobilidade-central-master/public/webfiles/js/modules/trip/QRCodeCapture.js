class QRCodeCapture {

    constructor(title, description) {
        this.elementProperty = new ElementProperty();
        this.title = title;
        this.description = description;
        this.value = null;
    }

    capture() {
        return new Promise((resolve, reject) => {
            QRScanner.prepare((error, status) => {

                if (error) {
                    reject("Ocorreu um error ao abrir a camera");
                    this.cancel();
                    return;
                }
                if (status.authorized) {
                    Route.hiddenScreen();
                    viewController.nameView = "qrcode-camera";

                    viewController.onBack(()=>{
                        this.cancel();
                    });

                    layoutBuild(['camera/qrcode'], [], ['camera/qrcode']);

                    document.body.style.background = "transparent";
                    QRScanner.show();
                    QRScanner.scan((error,text)=> {
                        if(error){
                            reject("Ocorreu um error na leitura do qrcode");
                            this.cancel();
                            return;
                        }
                        Route.backPage();
                        resolve(text);
                    });

                    viewController.setObserver("capture-qrcode", () => {
                        this.elementProperty.getElement(".title-qrcode", element => {
                            element.innerHTML = this.title;
                        });
                        this.elementProperty.addEventInElement(".go-back","onclick",()=>{
                            Route.backPage();
                        });
                        this.elementProperty.getElement(".description-qrcode", element => {
                            element.innerHTML = this.description;
                        });
                    });
                    return;
                }
                reject("Sem permissão para abrir a camera");
                this.cancel();
            });
        });
    }

    cancel(){
        QRScanner.destroy((result)=>console.log(result));
        QRScanner.cancelScan();
        QRScanner.hide();
        this.elementProperty.addClass(".menu-close","open");

        setTimeout(()=>{
            document.body.style.background = "#ffffff"
        },1000);
    }
}