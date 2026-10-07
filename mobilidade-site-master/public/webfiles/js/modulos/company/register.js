document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

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

    elementProperty.addEventInElement('#do-delivery', 'oninput', function () {
        elementProperty.getElement('#delivery-form', these => {
            if (this.checked === true)
                return these.style.display = '';
            return these.style.display = 'none';
        })
    });

    elementProperty.addEventInElement('#do-delivery-mobile', 'oninput', function () {
        elementProperty.getElement('#delivery-form-mobile', these => {
            if (this.checked === true)
                return these.style.display = '';
            return these.style.display = 'none';
        })
    });


    CityController.getActivesV2().then(({response})=>{
        document.querySelector("#cityIdSelected").innerHTML += response.map(item=> {
            return `<option value="${item.cityId}">${item.nome}</option>`
        }).join("");
    });

    elementProperty.addEventInElement('#next-page-web', 'onclick', function (event) {
        event.preventDefault();
        const data = {
            "fantasyName": document.querySelector("#nameFantasy").value,
            "document": document.querySelector("#documentCompany").value,
            "cityId": document.querySelector("#cityIdSelected").value,
            "user": {
                "name": document.getElementById('name-user').value,
                "nickname": document.getElementById('surname-user').value,
                "email": document.getElementById('email-user').value,
                "password": document.getElementById('password').value,
                "phone": document.getElementById('phone-user').value
            }
        };


        if (data.user.name.length === 0)
            return alert("Informe o nome");
        if (data.user.nickname.length === 0)
            return alert("Informe o sobrenome");
        if (data.user.email.length === 0)
            return alert("Informe o e-mail");

        if (!checkEmail(data.user.email))
            return alert("E-mail está inválido");

        if (data.user.password !== document.querySelector("#passwordConfirm").value)
            return alert("As senhas não confere");

        if (data.user.phone.length === 0)
            return alert("Informe o telefone");

        if (!ValidateForm.validatePhone(data.user.phone))
            return alert("Telefone está inválido");

        if (data.user.password.length === 0)
            return alert("Informe a senha");
        if (data.fantasyName.length === 0)
            return alert("Informe o nome fantasia");
        if (data.document.length === 0)
            return alert("Informe o número do documento");

        if (data.document.length === 18) {
            if (!checkCNPJ(data.document))
                return alert("CNPJ está inválido")
        } else {
            if (!checkCPF(data.document))
                return alert("CPF está inválido")
        }

        if (data.cityId.length === 0)
            return alert("Selecione a cidade de atuação");

        preload(true);

        CompanyController.preRegister(data).then(({status, message}) => {
            preload(false);

            SwalCustom.messageDialog("", message, () => {
                if (status)
                    location.href = "/corporateroute";
            }, status ? "success" : "info");
        });
    });
});