document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();

    const dataLogin = {
        email: '',
        password: '',
    };

    if(Session.get("dataLogin")){
        const dataLogin = Session.get("dataLogin");
        document.getElementById('password').value = dataLogin.password;
        document.getElementById('email').value = dataLogin.email;
    }

    function auth(dataLogin) {
        preload(true)
        UserRepository.login(dataLogin).then(result => {
        preload(false)
            if (!result.status) {
                swal(result.message,"Usuário ou senha inválido", "info");
                return;
            }

            const { central_user, key_app_partner } = result.response;

            Session.set("centrals", central_user);
            delete result.response.central_user;

            Session.set("dataLogin",dataLogin);
            Session.set('user', result.response);
            localStorage.setItem('keyAppPartner', JSON.stringify(key_app_partner));

            if(environment.appPartner === "false" && key_app_partner !== null) {
                Session.delete("user");
                localStorage.removeItem('keyAppPartner');
            }

            window.location.reload(true);
        }).catch((message) => {
            swal(message, "", "warning")
            preload(false)
        })
    }

    elementProperty.addEventInElement(".form-login","onsubmit",function(e){
        e.preventDefault();

        dataLogin.password = document.getElementById('password').value;
        dataLogin.email = document.getElementById('email').value;

        auth(dataLogin);
    });

});