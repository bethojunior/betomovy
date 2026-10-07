const codeLanguage = localStorage.getItem('languageApp');

const userLang = navigator.language.substring(0, 2);

const listLanguage = ['pt', 'en', 'fr', 'es'];

const isExists = listLanguage.includes(userLang);

i18next.init({
    lng: 'pt',
    resources: {
        pt: {
            translation: {
                label_input_name: 'Nome',
                label_input_email: 'Email',
                label_input_phone: 'Telefone',
                label_input_gender: 'Gênero',
                label_input_city: 'Cidade',
                label_input_password: 'Senha',
                min_password_character: 'Senha precisa ter no mínimo 6 caracteres',
                description_register: 'Após finalizar seu cadastro, você será redirecionado para o download',
                button_send_data: 'CONCLUIR',
                text_download_android: 'Baixar para android',
                text_download_ios: 'Baixar para IOS',
                fill_fields_alert: 'Preencha todos os campos!',
                select_gender_alert: 'Selecione o gênero!',
                select_city_origin: 'Selecione a cidade origem!',
                select_default_value_gender: 'Gênero',
                select_value_male: 'Masculino',
                select_value_feminine: 'Feminino',
                select_value_other: 'Outro',
                select_default_value_city: 'Cidade'
            }
        },
        en: {
            translation: {
                label_input_name: 'Name',
                label_input_email: 'Email',
                label_input_phone: 'Phone',
                label_input_gender: 'Gender',
                label_input_city: 'City',
                label_input_password: 'Password',
                min_password_character: 'Password must be at least 6 characters long',
                description_register: 'After completing your registration, you will be redirected to the download',
                button_send_data: 'CONCLUDE',
                text_download_android: 'Download for android',
                text_download_ios: 'Download for ios',
                fill_fields_alert: 'Fill in all fields!',
                select_gender_alert: 'Select the genre!',
                select_city_origin: 'Select the city of origin!',
                select_default_value_gender: 'Gender',
                select_value_male: 'Masculine',
                select_value_feminine: 'Feminine',
                select_value_other: 'Other',
                select_default_value_city: 'City'
            }
        },
        fr: {
            translation: {
                label_input_name: 'Nom',
                label_input_email: 'E-mail',
                label_input_phone: 'Téléphone',
                label_input_gender: 'Genre',
                label_input_city: 'Ville',
                label_input_password: 'Mot de passe',
                min_password_character: 'Le mot de passe doit contenir au moins 6 caractères',
                description_register: 'Après avoir terminé votre inscription, vous serez redirigé vers le téléchargement',
                button_send_data: 'CONCLURE',
                text_download_android: 'Télécharger pour Android',
                text_download_ios: 'Télécharger pour IOS',
                fill_fields_alert: 'Remplissez tous les champs!',
                select_gender_alert: 'Sélectionnez le genre!',
                select_city_origin: "Sélectionnez la ville d'origine!",
                select_default_value_gender: 'Genre',
                select_value_male: 'Masculin',
                select_value_feminine: 'Féminin',
                select_value_other: 'Autre',
                select_default_value_city: 'Ville'
            }
        },
        es: {
            translation: {
                label_input_name: 'Nombre',
                label_input_email: 'Correo electrónico',
                label_input_phone: 'Teléfono',
                label_input_gender: 'Género',
                label_input_city: 'Ciudad',
                label_input_password: 'Contraseña',
                min_password_character: 'La contraseña debe contener 6 caracteres como mínimo',
                description_register: 'Después de completar su registro, será redirigido a la descarga',
                button_send_data: 'CONCLUIR',
                text_download_android: 'Descargar para android',
                text_download_ios: 'Descargar para IOS',
                fill_fields_alert: '¡Complete todos los campos!',
                select_gender_alert: '¡Selecciona el género!',
                select_city_origin: 'Seleccione la ciudad de origen!',
                select_default_value_gender: 'Género',
                select_value_male: 'Masculino',
                select_value_feminine: 'Femenino',
                select_value_other: 'Otro',
                select_default_value_city: 'Ciudad'
            }
        }
    }
});

i18next.changeLanguage(isExists ? userLang : 'en', function(err, t) {
    document.getElementById('label-name').innerHTML = i18next.t('label_input_name');
    document.getElementById('label-email').innerHTML = i18next.t('label_input_email');
    document.getElementById('label-phone').innerHTML = i18next.t('label_input_phone');
    document.getElementById('label-gender').innerHTML = i18next.t('label_input_gender');
    document.getElementById('label-city').innerHTML = i18next.t('label_input_city');
    document.getElementById('label-password').innerHTML = i18next.t('label_input_password');
    document.getElementById('description-register').innerHTML = i18next.t('description_register');
    document.getElementById('sendData').innerHTML = i18next.t('button_send_data');
    document.getElementById('text-download-android').innerHTML = i18next.t('text_download_android');
    document.getElementById('text-download-ios').innerHTML = i18next.t('text_download_ios');
    document.getElementById('select-default-value-gender').innerHTML = i18next.t('select_default_value_gender');
    document.getElementById('select-value-male').innerHTML = i18next.t('select_value_male');
    document.getElementById('select-value-feminine').innerHTML = i18next.t('select_value_feminine');
    document.getElementById('select-value-other').innerHTML = i18next.t('select_value_other');
    document.getElementById('select-default-value-city').innerHTML = i18next.t('select_default_value_city');
});

document.addEventListener("DOMContentLoaded", function () {
    preload(true);
    CityController.getActives().then((response) => {
        const { data } = response;
        const selectCity = document.querySelector('#city');

        selectCity.innerHTML += data.map(city => {
            return `
                <option value="${city.id}">${city.shortName ? city.shortName : city.nome}</option>
            `;
        }).join('');

        $('#city').select2({
            placeholder: i18next.t('select_default_value_city'),
            allowClear: false,
            width: 'resolve'
        });

        preload(false);
    });

    const appVersion = new HomeController();

    appVersion.listAppClientVersion()
        .then(response => {
            const { link } = response.data;

            const androidLink = document.getElementById("text-download-android");
            androidLink.setAttribute("href", link);  // Adicionei o atributo "href"
            androidLink.setAttribute("target", "_blank");
        })
        .catch(error => {
            console.error("Erro ao carregar a versão do aplicativo:", error);
        });

    appVersion.listAppIOSClientVersion()
        .then(response => {
            const { link } = response.data;

            const iosLink = document.getElementById("text-download-ios");
            iosLink.setAttribute("href", link);  // Adicionei o atributo "href"
            iosLink.setAttribute("target", "_blank");
        })
        .catch(error => {
            console.error("Erro ao carregar a versão do aplicativo:", error);
        });

    appVersion.getDefaultAppLogo()
        .then(response => {
            const logo = document.querySelector('#promotion');
            logo.setAttribute('src', response.data);
        });
});

const elementProperty = new ElementProperty();
let dataUser = {};
let url = window.location.href
url = url.toString()
let length = (url.split("/").length - 1) 
url = url.split("/")

let last = url[url.length -1];

if(last != "preregister"){
    if(last.length === 0){
        dataUser.userId = atob(url[url.length -2]);
    }else{
        dataUser.userId = atob(last);
    }
}

// $('select').material_select();
/*
ClienteController.getImagePromotion().then(img => {
    elementProperty.getElement('#promotion', set => {
        set.src = img.data;
    })
});
*/

var brDD = document.getElementById('brDD')
var phone = document.getElementById('telphone')
var password = document.getElementById('password')

phone.addEventListener('input', function() {
    phone.value = brDD.checked ? Mask.formatNumber(phone) : phone.value
});

brDD.onclick = function() {
    phone.value = Mask.formatNumber(document.getElementById('telphone'))
}

othersDD.onclick = function() {
    phone.value = document.getElementById('telphone').value.replace(/\D/g, '')
}

password.addEventListener('input', function() {
    password.value = password.value.trim();
})

elementProperty.addEventInElement('#sendData', 'onclick', function () {
    const valueCityId = document.querySelector('#city').value;

    if (valueCityId === "")
        return swal(i18next.t('select_city_origin'), '', 'info');

    dataUser.name = document.getElementById('name').value;
    dataUser.nickname = document.getElementById('name').value;
    dataUser.email = document.getElementById('email').value;
    dataUser.password = document.getElementById('password').value.trim();
    dataUser.phone = document.getElementById('telphone').value;
    dataUser.gender = document.getElementById('genderDependent').value;
    dataUser.cityId = parseInt(valueCityId);
    dataUser.registered_in = 'mobilidade';

    if (dataUser.name === "" || dataUser.email === "" || dataUser.phone === "") {
        return swal(i18next.t('fill_fields_alert'), '', 'info');
    }

    if(dataUser.password.length < 6) {
        return swal(i18next.t('min_password_character'), '', 'info');
    }

    if(document.getElementById('genderDependent').value === '')
        return swal(i18next.t('select_gender_alert'), '', 'info');
    
    this.disabled = true;

    ClienteController.preRegister(dataUser).then(res => {
        if (res.status) {
            swal(res.message, '', 'success');
            elementProperty.getElement('#chooseApp', element => {
                element.classList.add("show");
            });
            return;
        }
        swal(res.message, '', 'error');
        this.disabled = false;
    });
});