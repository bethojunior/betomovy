const codeLanguage = localStorage.getItem('languageApp');

i18next.init({
    lng: 'en',
    resources: {
        pt: {
            translation: {
                nav_title_passenger: 'Passageiro',
                nav_title_driver: 'Motorista',
                button_download: 'Download',
                label_input_name: 'Nome',
                label_input_email: 'Email',
                label_input_subject: 'Assunto',
                button_send: 'Enviar',
                text_merchant_1: 'é um aplicativo de mobilidade urbana para solicitar viagens rápidas e confiáveis.',
                text_merchant_2_part_1: 'Basta abrir o aplicativo, escolher o seu destino e pronto! O ',
                text_merchant_2_part_2: 'tem a melhor tecnologia para encontrar o motorista certo para você. Você pode salvar seus mototoristas favoritos, com ele você terá a comodidade de fazer uma viagem com alguém que você já conhece e confia.',
                text_merchant_3: 'Com uma interface bem simples e intuitiva, nosso app é completo e contém todas as funcionalidades para a fácil comunicação entre passageira e motorista.',
                text_footer: '© Desenvolvido por Fabrica 704',
                title_modal: 'Cadastrar como',
                message_success_doubt_title: 'Email enviado com sucesso',
                message_success_doubt_description: 'Em breve entraremos em contato com você',
                message_toast: 'Digite todos os campos',
                option_select_default_language: 'Idioma',
                option_select_pt_language: 'Português',
                option_select_en_language: 'Inglês',
                option_select_fr_language: 'Francês',
                option_select_es_language: 'Espanhol',
            }
        },
        en: {
            translation: {
                nav_title_passenger: 'Passenger',
                nav_title_driver: 'Driver',
                button_download: 'Download',
                label_input_name: 'Name',
                label_input_email: 'Email',
                label_input_subject: 'Subject',
                button_send: 'Send',
                text_merchant_1: 'is an urban mobility application to request fast and reliable trips.',
                text_merchant_2_part_1: 'Just open the app, choose your destination and go! The ',
                text_merchant_2_part_2: "has the best technology to find the right driver for you. You can save your favorite drivers, with it you'll have the convenience of taking a trip with someone you already know and trust.",
                text_merchant_3: 'With a very simple and intuitive interface, our app is complete and contains all the features for easy communication between passenger and driver.',
                text_footer: '© Developed by Fabrica 704',
                title_modal: 'Register as',
                message_success_doubt_title: 'Email successfully sent',
                message_success_doubt_description: 'Soon, we will contact you',
                message_toast: 'Enter all fields',
                option_select_default_language: 'Language',
                option_select_pt_language: 'Portuguese',
                option_select_en_language: 'English',
                option_select_fr_language: 'French',
                option_select_es_language: 'Spanish',
            }
        },
        fr: {
            translation: {
                nav_title_passenger: 'Passager',
                nav_title_driver: 'Conducteur',
                button_download: 'Télécharger',
                label_input_name: 'Nom',
                label_input_email: 'E-mail',
                label_input_subject: 'Sujet',
                button_send: 'Envoyer',
                text_merchant_1: 'est une application de mobilité urbaine pour demander des trajets rapides et fiables.',
                text_merchant_2_part_1: "Ouvrez simplement l'application, choisissez votre destination et c'est parti! Le ",
                text_merchant_2_part_2: "a la meilleure technologie pour trouver le pilote qui vous convient. Vous pouvez enregistrer vos pilotes préférés, avec cela, vous aurez la possibilité de faire un voyage avec quelqu'un que vous connaissez déjà et en qui vous avez confiance.",
                text_merchant_3: 'Avec une interface très simple et intuitive, notre application est complète et contient toutes les fonctionnalités pour faciliter la communication entre le passager et le conducteur.',
                text_footer: '© Développé par Fabrica 704',
                title_modal: "S'inscrire en tant que",
                message_success_doubt_title: 'E-mail envoyé avec succès',
                message_success_doubt_description: 'Bientôt, nous vous contacterons',
                message_toast: 'Entrez tous les champs',
                option_select_default_language: 'Langue',
                option_select_pt_language: 'Portugais',
                option_select_en_language: 'Anglais',
                option_select_fr_language: 'Français',
                option_select_es_language: 'Espagnol',
            }
        },
        es: {
            translation: {
                nav_title_passenger: 'Pasajero',
                nav_title_driver: 'Conductor',
                button_download: 'Descargar',
                label_input_name: 'Nombre',
                label_input_email: 'Correo electrónico',
                label_input_subject: 'Sujeto',
                button_send: 'Mandar',
                text_merchant_1: 'es una aplicación de movilidad urbana para solicitar viajes rápidos y confiables.',
                text_merchant_2_part_1: '¡Simplemente abra la aplicación, elija su destino y listo! El ',
                text_merchant_2_part_2: "tiene la mejor tecnología para encontrar el controlador adecuado para usted. Puedes guardar tus conductores favoritos, con él tendrás la comodidad de realizar un viaje con alguien que ya conoces y en quien confías.",
                text_merchant_3: 'Con una interfaz muy simple e intuitiva, nuestra aplicación es completa y contiene todas las funciones para facilitar la comunicación entre el pasajero y el conductor.',
                text_footer: '© Desarrollado por Fabrica 704',
                title_modal: 'Registrarse como',
                message_success_doubt_title: 'Correo electrónico enviado con éxito',
                message_success_doubt_description: 'Pronto, nos pondremos en contacto con usted',
                message_toast: 'Ingrese todos los campos',
                option_select_default_language: 'Idioma',
                option_select_pt_language: 'Portugués',
                option_select_en_language: 'Inglés',
                option_select_fr_language: 'Francés',
                option_select_es_language: 'Español',
            }
        }
    }
});

i18next.changeLanguage(codeLanguage, function(err, t) {
    document.getElementById('nav-title-driver').innerHTML = i18next.t('nav_title_driver');
    document.getElementById('nav-title-passenger').innerHTML = i18next.t('nav_title_passenger');
    document.getElementById('title-drop-driver').innerHTML = i18next.t('nav_title_driver');
    document.getElementById('title-drop-passenger').innerHTML = i18next.t('nav_title_passenger');
    document.getElementById('title-dropdown-driver').innerHTML = i18next.t('nav_title_driver');
    document.getElementById('title-dropdown-passenger').innerHTML = i18next.t('nav_title_passenger');
    document.getElementById('button-download').innerHTML = i18next.t('button_download');
    document.getElementById('merchant-text-paragraph-1').innerHTML = i18next.t('text_merchant_1');
    document.getElementById('merchant-text-paragraph-2-part-1').innerHTML = i18next.t('text_merchant_2_part_1');
    document.getElementById('merchant-text-paragraph-2-part-2').innerHTML = i18next.t('text_merchant_2_part_2');
    document.getElementById('merchant-text-paragraph-3').innerHTML = i18next.t('text_merchant_3');
    document.getElementById('label-input-name').innerHTML = i18next.t('label_input_name');
    document.getElementById('label-input-contact').innerHTML = i18next.t('label_input_email');
    document.getElementById('label-input-subject').innerHTML = i18next.t('label_input_subject');
    document.getElementById('send-email').innerHTML = i18next.t('button_send');
    document.getElementById('text-footer').innerHTML = i18next.t('text_footer');
    document.getElementById('title-modal').innerHTML = i18next.t('title_modal');
    document.getElementById('text-passenger-modal').innerHTML = i18next.t('nav_title_passenger');
    document.getElementById('text-driver-modal').innerHTML = i18next.t('nav_title_driver');
    document.getElementById('option-select-default-language').innerHTML = i18next.t('option_select_default_language');
    document.getElementById('option-select-pt-language').innerHTML = i18next.t('option_select_pt_language');
    document.getElementById('option-select-en-language').innerHTML = i18next.t('option_select_en_language');
    document.getElementById('option-select-fr-language').innerHTML = i18next.t('option_select_fr_language');
    document.getElementById('option-select-es-language').innerHTML = i18next.t('option_select_es_language');
});

document.getElementById('select-language').addEventListener('change', (event) => {
    localStorage.setItem('languageApp', event.target.value);
    window.location.reload();
})


function sendEmail() {
    let data = {};
    data.name = document.getElementById('nome-email').value;
    data.contact = document.getElementById('contato-email').value;
    data.subject = document.getElementById('assunto-email').value;
    if(data.name === '' || data.contato === '' || data.assunto === '')
        return Materialize.toast(i18next.t('message_toast'),1200);

    ConnectionServer.requestEmail('Site/SendContactEmail','POST',data,false,callback => {
        swal(i18next.t('message_success_doubt_title'),i18next.t('message_success_doubt_description'),'success');
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const appVersion = new HomeController();

    // appVersion.listAppClientVersion()
    //     .then(response => {
    //             const {link} = response.data;
    //             const element = document.getElementById("title-drop-passenger");
    //             element.setAttribute("href", link);
    //             element.setAttribute("target", "_blank");
    //         }
    //     );
    //
    // appVersion.listAppIOSClientVersion()
    //     .then(response => {
    //             const {link} = response.data;
    //             const element = document.getElementById("title-drop-passenger-ios");
    //             element.setAttribute("href", link);
    //             element.setAttribute("target", "_blank");
    //         }
    //     );

    appVersion.listAppDriverVersion()
        .then(response => {
                const {link} = response.data;
                const element = document.getElementById("title-drop-driver");
                element.setAttribute("href", link);
                element.setAttribute("target", "_blank");
            }
        );

    const androidButton = document.querySelector('.btnAndroid');
    const iosButton = document.querySelector('.btnIos');
    const chooseAppModal = document.getElementById('chooseApp');

    androidButton.addEventListener('click', function() {
        appVersion.listAppClientVersion()
            .then(response => {
                const { link } = response.data;
                window.open(link, '_blank');
                chooseAppModal.classList.remove('active');
            });
    });

    iosButton.addEventListener('click', function() {
        appVersion.listAppIOSClientVersion()
            .then(response => {
                const { link } = response.data;
                window.open(link, '_blank');
                chooseAppModal.classList.remove('active');
            });
    });

    const passengerOption = document.getElementById('title-drop-passenger');

    passengerOption.addEventListener('click', function(event) {
        event.preventDefault();
        chooseAppModal.classList.add('active');
    });

    appVersion.getDefaultAppLogo()
        .then(response => {
           console.log(response);
            const logo = document.querySelector('#default-logo');
            logo.setAttribute('src', response.data);
        });
});