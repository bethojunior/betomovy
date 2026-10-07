class SwalCustom {
    static dialogConfirm(title, message, callback) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: 'Sim',
        }).then(function (response) {
            if (response.value) {
                callback();
            }
        })
    }

    static messageDialog(message,title,icon = "info"){
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: title,
                text: message,
                icon: icon
            }).then(resolve).catch(reject);
        })
    }

    static dialogInfo(title,message) {
        swal({
                title: title,
                text: message,
                icon: 'success',
                buttons: {
                    Ok: {
                        text: "OK!",
                        value: true,
                    },
                },
            }
        ).then(function () {
            $(document).ready(function () {
                setTimeout(function () {
                    window.location.reload(1);
                }, 500);
            })
        })
    }
    static confirm(title , message){
        return new Promise((resolve , reject) => {
            swal({
                title: title,
                text: message,
                icon: 'info',
                buttons: {
                    yes: {
                        text: "SIM!",
                        value: true,
                    },
                    no: {
                        text: "NÃO!",
                        value: false,
                    },
                },
            })
                .then(function (status) {
                    if(status){
                        resolve(true);
                        return;
                    }
                    reject(false);
                });
        });
    }

    static toast(title, icon = "fas fa-exclamation")
    {
        Swal.fire({
            toast: true,
            title: title,
            icon: icon,
            position: "top-right",
            showCloseButton: true,
            showConfirmButton: false,
        });
    }

}
