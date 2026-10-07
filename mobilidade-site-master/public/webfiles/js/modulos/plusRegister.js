const elementProperty = new ElementProperty();

elementProperty.addEventInElement('#finishThat' , 'onclick' , finishRegister);

function finishRegister() {

    let data = {};

    elementProperty.getElement('#pass' , that => {
        let first = that.value;
        elementProperty.getElement('#passAgain' , that_ => {
            if(first !== that_.value){
                swal('Ops..' , 'As senhas não coincidem' , 'info');
                return;
            }
            secondPass();
            data.password = first;
        });
    });

    function secondPass() {

        elementProperty.getElement('#name' , that => {
            data.name = that.value;
        });

        elementProperty.getElement('#phone' , that => {
            data.phone = that.value;
        });

        elementProperty.getElement('#email' , that => {
            data.email = that.value;
        });

        elementProperty.getElement('#city' , that => {
            data.cityId = that.value;
        });

        if(data.name === ''){
            denied();
            return;
        }

        if(data.phone === ''){
            denied();
            return;
        }

        if(data.email === ''){
            denied();
            return;
        }

        if(data.cityId === ''){
            denied();
            return;
        }

        sendData();

    }

    function sendData() {
        PlusController.preRegister(data).then(resolve => {
            swal('Pré cadastro efetuado' , 'Em breve entraremos em contato com vc!' , 'success');
        })
    }
    
    function denied() {
        swal('ops' , 'Preencha todos os campos' , 'info')
    }

}