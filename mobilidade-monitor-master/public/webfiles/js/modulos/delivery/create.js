Mask.setMaskPhone('.numberphone');

const user = {
    name: '',
    nickname: '',
    email: '',
    password: '',
    phone: '',
}

var options = {
    onKeyPress: function (cpf, ev, el, op) {
        var masks = ['000.000.000-000', '00.000.000/0000-00'];
        $('.document').mask((cpf.length > 14) ? masks[1] : masks[0], op);
    }
}
$('.document').length > 11 ? $('.document').mask('00.000.000/0000-00', options) : $('.document').mask('000.000.000-00#', options);

elementProperty.getElement('.logo-aplication' , these => {
    these.src = environment.hosts.hostImageDefault;
});

elementProperty.addEventInElement('#do-delivery','oninput',function () {
    elementProperty.getElement('#delivery-form',these => {
        if(this.checked === true)
            return these.style.display = '';
        return these.style.display = 'none';
    })
});

elementProperty.addEventInElement('#do-delivery-mobile','oninput',function () {
    elementProperty.getElement('#delivery-form-mobile',these => {
        if(this.checked === true)
            return these.style.display = '';
        return these.style.display = 'none';
    })
});

elementProperty.addEventInElement('#search-cep','onkeydown',function () {
    let search = this.value;
    ConnectionServer.simpleRequest(`https://viacep.com.br/ws/${search}/json/`,'GET',response => {
        console.log(response)
    })
})

elementProperty.addEventInElement('#next-page-web','onclick',function () {

    let fields = ['#name-user','#email-user','#password','#phone-user'];
    elementProperty.verifyAllFields(fields).then(resolve => {
        user.name = document.getElementById('name-user').value;
        user.nickname = document.getElementById('name-user').value;
        user.email = document.getElementById('email-user').value;
        user.password = document.getElementById('password-user').value;
        user.phone = document.getElementById('phone-user').value;
        elementProperty.getElement('#data-user',these => {
            these.style.display = 'none';
        })
        elementProperty.getElement('.enterprise-data',these => {
            these.style.display = 'block';
        })

        // UserController.createUserDelivery(user).then(resolve => {
        //     console.log(resolve)
        // }).catch(error => {
        //     console.log(error);
        // })
    }).catch(error => {
        console.log(error)
        swal('ops',error,'info');
    })
});

elementProperty.addEventInElement('#next-page-web-mobile','onclick',function () {

    let fields = ['#name-user-mobile','#email-user-mobile','#password-mobile','#phone-user-mobile'];
    elementProperty.verifyAllFields(fields).then(resolve => {
        user.name = document.getElementById('name-user-mobile').value;
        user.nickname = document.getElementById('name-user-mobile').value;
        user.email = document.getElementById('email-user-mobile').value;
        user.password = document.getElementById('password-user-mobile').value;
        user.phone = document.getElementById('phone-user-mobile').value;
        elementProperty.getElement('#data-user-mobile',these => {
            these.style.display = 'none';
        })
        elementProperty.getElement('#enterprise-data-mobile',these => {
            these.style.display = 'block';
        })

        // UserController.createUserDelivery(user).then(resolve => {
        //     console.log(resolve)
        // }).catch(error => {
        //     console.log(error);
        // })
    }).catch(error => {
        console.log(error)
        swal('ops',error,'info');
    })
});