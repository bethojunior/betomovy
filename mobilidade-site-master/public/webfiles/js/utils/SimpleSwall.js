class SimpleSwall {

    static confirmModal(mainMessage, denyMessage, callback) {
        swal({
            title: mainMessage,
            text: '',
            icon: 'warning',
            buttons: {
                sim: "Sim",
                nao: "Não"
            }
        }).then(value => {
            switch (value) {
                case "sim":{
                    callback()
                    break
                }

                case "nao": {
                    swal(denyMessage, 'false', 'info')
                    break
                }
            }
        })
    }

    static modalSuccess(message) { 
        return swal(message, {
            icon: "success",
            buttons: false,
            timer: 1500,
        });
    }

    static modalError(message) {
        swal(message, {
            icon: "error",
            buttons: false,
            timer: 1500,
        });
    }
}