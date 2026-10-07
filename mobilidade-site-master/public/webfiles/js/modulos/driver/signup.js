const codeLanguage = localStorage.getItem('languageApp');

const userLang = navigator.language.substring(0, 2);

const listLanguage = ['pt', 'en', 'fr', 'es'];

const isExists = listLanguage.includes(userLang);

i18next.init({
    lng: 'pt',
    resources: {
        pt: {
            translation: {
                header_title_categories: 'Escolha a categoria de atuação',
                step_datas_personal: 'Dados pessoais',
                label_input_name: 'Nome',
                label_input_name_complete: 'Informe o nome do usuário completo',
                label_input_cpf_cnpj: 'CPF/CNPJ',
                label_invalid_cnpj: 'O CNPJ informado é inválido',
                label_input_gender: 'Gênero',
                label_select_gender: 'Selecione um gênero',
                label_input_email: 'E-mail',
                label_invalid_email: 'E-mail inválido',
                label_input_phone: 'Telefone',
                label_input_password: 'Senha',
                label_passwords_do_not_match: 'As senhas não conferem',
                label_enter_password: 'Informe a senha',
                min_password_character: 'Senha precisa ter no mínimo 6 caracteres',
                label_select_city: 'Selecione uma cidade',
                step_select_city: 'Selecione a cidade de atuação',
                label_input_city: 'Cidade de trabalho',
                select_default_value_city: 'Selecione a cidade',
                step_datas_military: 'Dados militares',
                select_type_strength: 'Escolha o tipo de força',
                select_type_patent: 'Escolha o tipo de patente',
                select_type_status: 'Tipo de status',
                step_datas_vehicle: 'Dados do veículo',
                label_input_document_car: 'Por favor, digite o número do documento do carro',
                label_input_brand_car: 'Por favor, digite a marca do carro',
                label_input_model_car: 'Por favor, digite o modelo do carro',
                label_input_plate_car: 'Placa do carro',
                label_input_car_plate: 'Por favor, digite a placa do carro',
                label_invalid_car_plate: 'A placa do carro está inválida',
                label_input_number_renavam: 'Número do renavam',
                label_input_renavam: 'Por favor, digite o renavam',
                label_input_color_car: 'Por favor, digite a cor do carro',
                select_color_car: 'Selecione a cor do carro',
                select_color_white: 'Branco',
                select_color_silver: 'Prata',
                select_color_black: 'Preto',
                select_color_gray: 'Cinza',
                select_color_red: 'Vermelho',
                select_color_blue: 'Azul',
                select_color_green: 'Verde',
                select_color_beige: 'Bege',
                select_color_brown: 'Marron',
                select_color_golden: 'Dourado/Amarelo',
                select_color_orange: 'Laranja',
                label_input_number_seats: 'Número de assentos',
                label_input_year_car: 'Informe o ano do carro',
                label_input_vehicle_leased: 'Veículo é locado?',
                step_photo_perfil: 'Perfil',
                message_register_success_title: 'O cadastro do motorista foi realizado com sucesso!',
                message_register_success_description: 'Todas informações do cadastro são de responsabilidade do usuário logado.',
                button_next: 'Próximo',
                label_select_profile_photo: 'Selecione uma foto de perfil',
                label_input_add_document: 'Adicionar foto do documento',
                label_input_alvara_number: 'Por favor, digite o número do ALVARÁ',
                label_take_photo_alvara: 'Retire uma foto do seu ALVARÁ',
                placeholder_write: 'Digite',
                message_modal_alert_document_not_found: 'Digite o documento',
                take_photo_document: 'Retire uma foto do documento',
                request_document: 'Solicite o documento aqui',
                accept_terms_conditions_app: 'Aceite os termos de condições do aplicativo para poder continuar',
                attention_message: 'Atenção!',
                already_exist_email: 'E-mail já esta sendo utilizado',
                already_exist_cpf: 'Cpf já cadastrado',
                label_invalid_cpf: 'O CPF informado é inválido',
                Registration_in_brazil: 'Cadastro no Brasil'
            }
        },
        en: {
            translation: {
                header_title_categories: 'Choose performance category',
                step_datas_personal: 'Personal data',
                label_input_name: 'Name',
                label_input_name_complete: 'Please enter the full user name',
                label_input_cpf_cnpj: 'SSN/CNPJ',
                label_invalid_cnpj: 'The informed CNPJ is invalid',
                label_input_gender: 'Gender',
                label_select_gender: 'Select a gender',
                label_input_email: 'E-mail',
                label_invalid_email: 'Invalid email',
                label_input_phone: 'Phone',
                label_input_password: 'Password',
                label_enter_password: 'Enter the password',
                label_passwords_do_not_match: 'Passwords do not match',
                min_password_character: 'Password must be at least 6 characters long',
                label_select_city: 'Select a city',
                step_select_city: 'Select the city of operation',
                label_input_city: 'Work city',
                select_default_value_city: 'Select city',
                step_datas_military: 'Military data',
                select_type_strength: 'Choose the type of strength',
                select_type_patent: 'Choose patent type',
                select_type_status: 'Status type',
                step_datas_vehicle: 'Vehicle data',
                label_input_document_car: 'Please enter the car document number',
                label_input_brand_car: 'Please enter the car brand',
                label_input_model_car: 'Please enter the car model',
                label_input_plate_car: 'License plate',
                label_input_car_plate: 'Please enter the car plate',
                label_invalid_car_plate: 'The car plate is invalid',
                label_input_number_renavam: 'Renavam number',
                label_input_renavam: 'Please enter the renavam',
                label_input_color_car: 'Please enter the car color',
                select_color_car: 'Select car color',
                select_color_white: 'White',
                select_color_silver: 'Silver',
                select_color_black: 'Black',
                select_color_gray: 'Gray',
                select_color_red: 'Red',
                select_color_blue: 'Blue',
                select_color_green: 'Green',
                select_color_beige: 'Beige',
                select_color_brown: 'Brown',
                select_color_golden: 'Golden/Yellow',
                select_color_orange: 'Orange',
                label_input_number_seats: 'Number of seats',
                label_input_year_car: 'Please enter the car year',
                label_input_vehicle_leased: 'Is vehicle leased?',
                step_photo_perfil: 'Profile',
                message_register_success_title: 'Driver registration has been successfully completed!',
                message_register_success_description: 'All registration information is the responsibility of the logged in user.',
                button_next: 'Next',
                label_select_profile_photo: 'Select a profile photo',
                label_input_add_document: 'Add document photo',
                label_input_alvara_number: 'Please enter the ALVARÁ number',
                label_take_photo_alvara: 'Take a photo of your ALVARÁ',
                placeholder_write: 'Type it',
                message_modal_alert_document_not_found: 'Enter the document',
                take_photo_document: 'Take a photo of the document',
                request_document: 'Request the document here',
                accept_terms_conditions_app: 'Accept the terms and conditions of the application in order to continue',
                attention_message: 'Attention!',
                already_exist_email: 'Email already exists',
                already_exist_cpf: 'Cpf already registered',
                label_invalid_cpf: 'The informed CPF is invalid',
                Registration_in_brazil: 'Registration in Brazil'
            }
        },
        fr: {
            translation: {
                header_title_categories: 'Choisissez la catégorie de performance',
                step_datas_personal: 'Données personnelles',
                label_input_name: 'Nom',
                label_input_name_complete: 'Veuillez saisir le nom complet de l\'utilisateur',
                label_input_cpf_cnpj: 'CPF/CNPJ',
                label_invalid_cnpj: 'Le CNPJ informé est invalide',
                label_input_gender: 'Genre',
                label_select_gender: 'Sélectionnez un genre',
                label_input_email: 'E-mail',
                label_invalid_email: 'E-mail invalide',
                label_input_phone: 'Téléphone',
                label_input_password: 'Mot de passe',
                label_enter_password: 'Entrez le mot de passe',
                label_passwords_do_not_match: 'Les mots de passe ne correspondent pas',
                min_password_character: 'Le mot de passe doit contenir au moins 6 caractères',
                label_select_city: 'Sélectionnez une ville',
                step_select_city: "Sélectionnez la ville d'opération",
                label_input_city: 'Ville de travail',
                select_default_value_city: 'Sélectionnez une ville',
                step_datas_military: 'Données militaires',
                select_type_strength: 'Choisissez le type de puissance',
                select_type_patent: 'Choisissez le type de brevet',
                select_type_status: "Type d'état",
                step_datas_vehicle: 'Données du véhicule',
                label_input_document_car: 'Veuillez saisir le numéro du document de la voiture',
                label_input_brand_car: 'Veuillez saisir la marque de la voiture',
                label_input_model_car: 'Veuillez saisir le modèle de la voiture',
                label_input_plate_car: "Plaque d'immatriculation",
                label_input_car_plate: 'Veuillez saisir la plaque de la voiture',
                label_invalid_car_plate: 'La plaque de la voiture est invalide',
                label_input_number_renavam: 'Numéro renavam',
                label_input_renavam: 'Veuillez saisir le renavam',
                label_input_color_car: 'Veuillez saisir la couleur de la voiture',
                select_color_car: 'Sélectionnez la couleur de la voiture',
                select_color_white: 'Blanc',
                select_color_silver: 'Argent',
                select_color_black: 'Noir',
                select_color_gray: 'Gris',
                select_color_red: 'Rouge',
                select_color_blue: 'Bleu',
                select_color_green: 'Vert',
                select_color_beige: 'Beige',
                select_color_brown: 'Brun',
                select_color_golden: 'Doré/Jaune',
                select_color_orange: 'Orange',
                label_input_number_seats: 'Nombre de places',
                label_input_year_car: 'Veuillez saisir l\'année de la voiture',
                label_input_vehicle_leased: 'Le véhicule est-il loué?',
                step_photo_perfil: 'Profil',
                message_register_success_title: "L'enregistrement du conducteur a été effectué avec succès!",
                message_register_success_description: "Toutes les informations d'enregistrement relèvent de la responsabilité de l'utilisateur connecté.",
                button_next: 'Suivant',
                label_select_profile_photo: 'Sélectionnez une photo de profil',
                label_input_add_document: 'Ajouter une photo de document',
                label_input_alvara_number: 'Veuillez saisir le numéro du ALVARÁ',
                label_take_photo_alvara: 'Prenez une photo de votre ALVARÁ',
                placeholder_write: 'Taper',
                message_modal_alert_document_not_found: 'Entrez le document',
                take_photo_document: 'Prendre une photo du document',
                request_document: 'Demandez le document ici',
                accept_terms_conditions_app: "Acceptez les termes et conditions de l'application afin de continuer",
                attention_message: 'Attention!',
                already_exist_email: "l'email existe déjà",
                already_exist_cpf: 'Cpf déjà inscrit',
                label_invalid_cpf: 'Le CPF informé est invalide',
                Registration_in_brazil: 'Enregistrement au Brésil'
            }
        },
        es: {
            translation: {
                header_title_categories: 'Elija la categoría de rendimiento',
                step_datas_personal: 'Datos personales',
                label_input_name: 'Nombre',
                label_input_name_complete: 'Ingrese el nombre completo del usuario',
                label_input_cpf_cnpj: 'CPF/CNPJ',
                label_invalid_cnpj: 'El CNPJ informado es inválido',
                label_input_gender: 'Género',
                label_select_gender: 'Seleccione un género',
                label_input_email: 'Correo electrónico',
                label_invalid_email: 'Correo electrónico inválido',
                label_input_phone: 'Teléfono',
                label_input_password: 'Contraseña',
                label_enter_password: 'Ingrese la contraseña',
                label_passwords_do_not_match: 'Las contraseñas no coinciden',
                min_password_character: 'La contraseña debe contener 6 caracteres como mínimo',
                label_select_city: 'Seleccione una ciudad',
                step_select_city: 'Seleccione la ciudad de operación',
                label_input_city: 'Ciudad de trabajo',
                select_default_value_city: 'Ciudad selecta',
                step_datas_military: 'Datos militares',
                select_type_strength: 'Elige el tipo de fuerza',
                select_type_patent: 'Elija el tipo de patente',
                select_type_status: 'Tipo de estado',
                step_datas_vehicle: 'Datos del vehículo',
                label_input_document_car: 'Por favor ingrese el número del documento del coche',
                label_input_brand_car: 'Por favor ingrese la marca del coche',
                label_input_model_car: 'Por favor ingrese el modelo del coche',
                label_input_plate_car: 'Placa',
                label_input_car_plate: 'Por favor ingrese la placa del coche',
                label_invalid_car_plate: 'La placa del coche es inválida',
                label_input_number_renavam: 'Número de renovación',
                label_input_renavam: 'Por favor ingrese el renavam',
                label_input_color_car: 'Por favor ingrese el color del coche',
                select_color_car: 'Selecciona el color del coche',
                select_color_white: 'Blanco',
                select_color_silver: 'Plata',
                select_color_black: 'Negro',
                select_color_gray: 'Gris',
                select_color_red: 'Rojo',
                select_color_blue: 'Azul',
                select_color_green: 'Verde',
                select_color_beige: 'Beige',
                select_color_brown: 'Marrón',
                select_color_golden: 'Dorado/Amarillo',
                select_color_orange: 'Naranja',
                label_input_number_seats: 'Numero de asientos',
                label_input_year_car: 'Por favor ingrese el año del coche',
                label_input_vehicle_leased: '¿Se arrienda vehículo?',
                step_photo_perfil: 'Perfil',
                message_register_success_title: '¡El registro del conductor se ha completado con éxito!',
                message_register_success_description: 'Toda la información de registro es responsabilidad del usuario registrado.',
                button_next: 'Próximo',
                label_select_profile_photo: 'Seleccione una foto de perfil',
                label_input_add_document: 'Agregar foto del documento',
                label_input_alvara_number: 'Por favor ingrese el número del ALVARÁ',
                label_take_photo_alvara: 'Tome una foto de su ALVARÁ',
                placeholder_write: 'Escribelo',
                message_modal_alert_document_not_found: 'Introduce el documento',
                take_photo_document: 'Toma una foto del documento.',
                request_document: 'Solicita el documento aquí',
                accept_terms_conditions_app: 'Acepta los términos y condiciones de la aplicación para poder continuar',
                attention_message: 'Atención!',
                already_exist_email: 'El email ya existe',
                already_exist_cpf: 'Cpf ya registrado',
                label_invalid_cpf: 'El CPF informado es inválido',
                Registration_in_brazil: 'Registro en Brasil'
            }
        }
    }
});

i18next.changeLanguage(isExists ? userLang : 'en', function(err, t) {
    document.getElementById('header-title-categories').innerHTML = i18next.t('header_title_categories');
    document.getElementById('step-datas-personal').innerHTML = i18next.t('step_datas_personal');
    document.getElementById('label-input-name').innerHTML = i18next.t('label_input_name');
    document.getElementById("name").placeholder = i18next.t('label_input_name');
    document.getElementById('label-input-cpf-cnpj').innerHTML = i18next.t('label_input_cpf_cnpj');
    document.getElementById("cpf").placeholder = i18next.t('label_input_cpf_cnpj');
    document.getElementById("cnpjCompany").placeholder = i18next.t('label_input_cpf_cnpj');
    document.getElementById('label-input-gender').innerHTML = i18next.t('label_input_gender');
    document.getElementById("gender-default").innerHTML = i18next.t('label_input_gender');
    document.getElementById('label-input-email').innerHTML = i18next.t('label_input_email');
    document.getElementById('label-input-phone').innerHTML = i18next.t('label_input_phone');
    document.getElementById("phone").placeholder = i18next.t('label_input_phone');
    document.getElementById('label-input-password').innerHTML = i18next.t('label_input_password');
    document.getElementById("password").placeholder = i18next.t('label_input_password');
    document.getElementById('step-select-city').innerHTML = i18next.t('step_select_city');
    document.getElementById('label-input-city').innerHTML = i18next.t('label_input_city');
    document.getElementById('select-default-value-city').innerHTML = i18next.t('select_default_value_city');
    document.getElementById('step-datas-military').innerHTML = i18next.t('step_datas_military');
    document.getElementById('select-type-patent').innerHTML = i18next.t('select_type_patent');
    document.getElementById('select-type-status').innerHTML = i18next.t('select_type_status');
    document.getElementById('step-datas-vehicle').innerHTML = i18next.t('step_datas_vehicle');
    document.getElementById('label-input-document-car').innerHTML = i18next.t('label_input_document_car');
    document.getElementById("numberCRLV").placeholder = i18next.t('label_input_document_car');
    document.getElementById('label-input-brand-car').innerHTML = i18next.t('label_input_brand_car');
    document.getElementById("markCar").placeholder = i18next.t('label_input_brand_car');
    document.getElementById('label-input-model-car').innerHTML = i18next.t('label_input_model_car');
    document.getElementById("modelCar").placeholder = i18next.t('label_input_model_car');
    document.getElementById('label-input-plate-car').innerHTML = i18next.t('label_input_plate_car');
    document.getElementById("licensePlate").placeholder = i18next.t('label_input_plate_car');
    document.getElementById('label-input-number-renavam').innerHTML = i18next.t('label_input_number_renavam');
    document.getElementById("renavam").placeholder = i18next.t('label_input_number_renavam');
    document.getElementById('label-input-color-car').innerHTML = i18next.t('label_input_color_car');
    document.getElementById('select-color-car').textContent = i18next.t('select_color_car');
    document.getElementById('select-color-white').innerHTML = i18next.t('select_color_white');
    document.getElementById('select-color-silver').innerHTML = i18next.t('select_color_silver');
    document.getElementById('select-color-black').innerHTML = i18next.t('select_color_black');
    document.getElementById('select-color-gray').innerHTML = i18next.t('select_color_gray');
    document.getElementById('select-color-red').innerHTML = i18next.t('select_color_red');
    document.getElementById('select-color-blue').innerHTML = i18next.t('select_color_blue');
    document.getElementById('select-color-green').innerHTML = i18next.t('select_color_green');
    document.getElementById('select-color-beige').innerHTML = i18next.t('select_color_beige');
    document.getElementById('select-color-brown').innerHTML = i18next.t('select_color_brown');
    document.getElementById('select-color-golden').innerHTML = i18next.t('select_color_golden');
    document.getElementById('select-color-orange').innerHTML = i18next.t('select_color_orange');
    document.getElementById('label-input-number-seats').innerHTML = i18next.t('label_input_number_seats');
    document.getElementById("numberSeatingCar").placeholder = i18next.t('label_input_number_seats');
    document.getElementById('label-input-year-car').innerHTML = i18next.t('label_input_year_car');
    document.getElementById("yearCar").placeholder = i18next.t('label_input_year_car');
    document.getElementById('label-input-vehicle-leased').innerHTML = i18next.t('label_input_vehicle_leased');
    document.getElementById("isRentalOfVehicles").placeholder = i18next.t('label_input_vehicle_leased');
    document.getElementById('step-photo-perfil').innerHTML = i18next.t('step_photo_perfil');
    document.getElementById('message-register-success-title').innerHTML = i18next.t('message_register_success_title');
    document.getElementById('message-register-success-description').innerHTML = i18next.t('message_register_success_description');
    document.getElementById('btnPersonalData').innerHTML = i18next.t('button_next');
    document.getElementById('btnCompany').innerHTML = i18next.t('button_next');
    document.getElementById('btnMilitaryFields').innerHTML = i18next.t('button_next');
    document.getElementById('btCRLV').innerHTML = i18next.t('button_next');
    document.getElementById('btnProfile').innerHTML = i18next.t('button_next');
    document.getElementById('button-next').innerHTML = i18next.t('button_next');
});

$(document).ready(function () {
    const userLang = navigator.language.substring(0, 2);

    $('#cityWork').select2({
        placeholder: i18next.t('select_default_value_city'),
        allowClear: true,
        width: '100%'
    });

    const appVersion = new HomeController();

    appVersion.getDefaultAppLogo()
        .then(response => {
            console.log(response);
            const logo = document.querySelector('#default-logo');
            logo.setAttribute('src', response.data);
        });

    let urlNow = window.location.href;
    urlNow = urlNow.split('/');
    let whoIndication = urlNow[5];
    if (urlNow[5] === '' || urlNow[5] === ' ' || urlNow[5] === undefined || urlNow[5] === null)
        whoIndication = '';

    let clickCitie = false;
    let isFormFinish = false, isValidateEmail = false;

    if (userLang === 'pt') {
        $("#licensePlate").inputmask({mask: ['AAA-9999', 'AAA9A99']});
    }

    const elementProperty = new ElementProperty();
    const driverController = new DriverController();
    const supportController = new SupportController();

    elementProperty.addEventInElement('#cpf', 'onblur', () => {
        elementProperty.getElement('#cpf', res => {
            let document = res.value;
            const documentName = res.placeholder
            if(document.length > 0) {
                DriverController.checkCpf({document}).then(resolve => {
                    if (resolve.status) {
                        swal('Ops', `${documentName}  ${i18next.t('already_exist_cpf')}`, 'info');
                        res.value = "";
                    }
                })
            }
        });
    });

    const documentsApp = {
        driver: 4,
        client: 90
    }

    let documentRequired = false;

    UserController.get(5, 1).then((item) => {
        if(!item.status) return;
        
        const documentVal = item.data.find((item) => item.id == documentsApp.driver)

        const labelElement = document.querySelector("#label-input-cpf-cnpj")
        const inputElement = document.querySelector(".input-cpf-cnpj");
        const containerElement = document.querySelector(".container-cpf");

        if (documentVal.compelField) {
            if(documentVal.alias) {
                labelElement.innerHTML = documentVal.alias
                inputElement.placeholder = documentVal.alias
            }
            documentVal.required
            ? documentRequired = true
            : null;

            containerElement.classList.add("active")
        } else {
            documentRequired = false
            containerElement.classList.remove("active")
        }
    })

    const formGroup = new FormGroup(".group-signup");

    const validateForm = {
        verifyCode: "",
        confirmationCode: ""
    };

    const dataDriver = {
        whoIndicatedId : whoIndication,
        driver: {
            userTypeId: "",
            name: "",
            nickname: "",
            phone: "",
            password: "",
            document: "",
            gender: "",
            email: "",
            stationId: "",
            cityId: null,
            estateId: "",
            cooperativeId: "",
            militaryUser: null,
            cnh: "",
            created_at: "",
            hasCardReader: false,
            numberCNH: null,
            numberCRLV: null,
            numberAlvara: null,
            numberCriminalRecord: null,
            docs: [],
            rentalCar: false,
            rentalCompanyDocument: "",
            registered_in: 'mobilidade'
        },
        image: {
            CNH: null,
            CRLV: null,
            ALVARA: null,
            PROFILE: null,
            CRIMINAL_RECORD: null,
            PROOF_OF_RESIDENCE: null,
            RG_FRONT: null,
            RG_BACK: null,
            DOCUMENTS: []
        },
        car: {
            licensePlate: null,
            renavam: null,
            markCar: null,
            modelCar: null,
            colorCar: null,
            numberSeatingCar: null,
        }
    };

    supportController.getHelpCode().then(({status, data}) => {
        if (!status)
            return;
        Session.set("codeSupport", data);
    });

    elementProperty.addEventInElement(".btn-next-step", "onclick", formPass);

    elementProperty.addEventInElement("#email", "onblur", function () {

        elementProperty.getElement(".container-preload-email", element => {
            element.classList.add("active");
        });

        driverController.checkEmail(this.value).then(result => {
            elementProperty.getElement(".container-preload-email", element => {
                element.classList.remove("active");
            });

            isValidateEmail = !result.status;
        });
    });

    haveMaskOrNot()

    function haveMaskOrNot() {
        var isBrazil = document.getElementById('isBrazil');
        var phone = document.getElementById('phone');
        var password = document.getElementById('password');
        var cpf = document.getElementById('cpf')
        var switchText = document.querySelector('.switch-label');

        switchText.innerHTML = `${i18next.t('Registration_in_brazil')}`

        if(userLang == 'pt') {
            isBrazil.checked = true
        } 
        
        phone.addEventListener('input', function() {
            phone.value = isBrazil.checked 
            ? Mask.formatNumber(phone) 
            : document.getElementById('phone').value.replace(/\D/g, '')
        });


        isBrazil.onclick = function() {
            var phoneElement = document.getElementById('phone')
            if(isBrazil.checked) {
                return phone.value = Mask.formatNumber(phoneElement);;   
            }
            $("#cpf").inputmask('remove');
            cpf.value = cpf.value.replace(/\D/g, '');
            phone.value = phoneElement.value.replace(/\D/g, '');
        }
    
        password.addEventListener('input', function() {
            password.value = password.value.trim();
        })
    }

    function formPass() {
        if (!formGroup.nextGroup()) {
            elementProperty.getElement(".preload-return", element => {
                element.style.display = "flex";
            });

            formGroup.validate.isRegistered = true;
            elementProperty.getElement(".back-to", element => {
                element.style.display = 'none';
            });

            driverController.register(dataDriver).then(result => {
                elementProperty.getElement(".preload-return", element => {
                    element.style.display = "none";
                });

                if (!result.status) {
                    elementProperty.getElement(".back-to", element => {
                        element.style.display = 'block';
                    });
                    formGroup.validate.isRegistered = false;
                    isFormFinish = false;
                    SwalCustom.messageDialog(result.message, `${i18next.t('attention_message')}`, "warning");
                    formGroup.beforeGroup();
                    return;
                }

                isFormFinish = true;

                elementProperty.getElement(".group-signup-finish", element => {
                    element.classList.add("active");
                });

                elementProperty.addEventInElement(".finish-form", "onclick", function () {
                    window.location.reload();
                });
            });
        }
    }

    function isCompletePersonalData() {
        const inputs = [
            document.getElementById("name"),
            documentRequired ? document.getElementById("cpf") : null,
            document.getElementById("email"),
            document.getElementById("phone")
        ];

        for (let i in inputs) {
            const input = inputs[i];

            if (input && input.value.length === 0) {
                input.focus();
                return false;
            }
        }

        return true;
    }

    elementProperty.addEventInElement("#btnPersonalData", "onclick", function () {
        if (!isCompletePersonalData())
            return;

        if (!isValidateEmail) {
            SwalCustom.messageDialog(`${i18next.t('already_exist_email')}`, `${i18next.t('attention_message')}`, () => {
            }, "warning");
            return false;
        }
        const documentCpf = document.getElementById("cpf").value

        dataDriver.driver.name = document.getElementById("name").value;
        dataDriver.driver.nickname = dataDriver.driver.name.split(" ")[0];
        dataDriver.driver.phone = document.getElementById("phone").value;
        dataDriver.driver.email = document.getElementById("email").value;
        dataDriver.driver.gender = document.getElementById("gender").value;
        documentRequired ?  dataDriver.driver.document = documentCpf : null;
        dataDriver.driver.password = document.getElementById("password").value;
        const isNacional = document.getElementById("isBrazil").checked;

        const passDocument = !documentRequired ? false : isNacional

        if (!validateFormPersonalData(dataDriver, passDocument))
            return;

        if (formGroup.validate.VALIDATE_NUMBER)
            if (formGroup.validate.VALIDATE_NUMBER.required) {
                getVerifyCode(dataDriver);
                clearCode();
            }

        formPass();
    });

    elementProperty.addEventInElement("#btnValidateNumber", "onclick", function () {
        validateForm.verifyCode = document.getElementById("verifyCode").value;

        if (!verifyCode(validateForm)) return;

        formPass();
    });

    elementProperty.addEventInElement("#btnSafety", "onclick", function () {
        elementProperty.getElement("#password", element => {
            dataDriver.driver.password = element.value;
        });

        if (!verifyPassword(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement("#btnMilitaryFields", "onclick", function () {
        dataDriver.driver.militaryUser = {
            militaryForceId: document.querySelector("#typeMilitaryForce").value,
            militaryGraduationId: document.querySelector("#typeGraduations").value,
            militaryStatusId: document.querySelector("#typeStatus").value,
            om: document.querySelector("#numberOM").value
        };

        if (!validateMilitaryUser(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement("#btnCompany", "onclick", function () {
        if (!verifyCompany(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement("#isRentalOfVehicles", "onclick", function () {
        if (this.checked) {
            document.querySelector("#cnpjCompany").style.display = "block";
        } else {
            document.querySelector("#cnpjCompany").style.display = "none";
        }
    });

    elementProperty.addEventInElement("#btCRLV", "onclick", function () {
        dataDriver.driver.numberCRLV = document.getElementById("numberCRLV").value;
        dataDriver.car.licensePlate = document.getElementById("licensePlate").value.toUpperCase();
        dataDriver.car.markCar = document.getElementById("markCar").value;
        dataDriver.car.modelCar = document.getElementById("modelCar").value;
        dataDriver.car.numberSeatingCar = document.getElementById("numberSeatingCar").value;
        dataDriver.car.renavam = document.getElementById("renavam").value;
        dataDriver.car.colorCar = document.getElementById("colorCar").value;
        dataDriver.car.year = document.getElementById("yearCar").value;
        dataDriver.driver.rentalCar = document.getElementById("isRentalOfVehicles").checked;
        if (dataDriver.driver.rentalCar) {
            dataDriver.driver.rentalCompanyDocument = document.getElementById("cnpjCompany").value;
        } else {
            dataDriver.driver.rentalCompanyDocument = "";
        }

        if (!verifyDocumentCRLV(dataDriver))
            return;

        formPass();
    });


    elementProperty.addEventInElement("#btnProfile", "onclick", function () {

        if (!verifyDocumentProfile(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement("#btnTerm", "onclick", function () {
        elementProperty.getElement("#useTerm", element => {
            if (!element.checked) {
                SwalCustom.messageDialog(`${i18next.t('accept_terms_conditions_app')} `, `${i18next.t('attention_message')}`, () => {
                }, "warning");
            } else {
                formPass();
            }
        });
    });

    elementProperty.addEventInElement(".open-modal-document", "onclick", function () {
        elementProperty.getElement("#modalPreview" + this.getAttribute("value"), element => {
            element.classList.add("active");
        })
    });

    CityController.getActives().then(result => {
        elementProperty.getElement("#cityWork", element => {
            element.innerHTML = `<option value='' selected disabled >${i18next.t('select_default_value_city')}</option> ` +
                result.data.map(city => {
                    return `<option value="${city.id}">${city.shortName ? city.shortName : city.nome}</option>`;
                }).join("");
        });

        elementProperty.addEventInElement("#cityWork", "onchange", function () {
            dataDriver.driver.cityId = this.value;
        });


    });

    elementProperty.addEventInElement('#cityWork', 'onclick', function () {
        if (!clickCitie) {
            clickCitie = true;
            let element = this;
            CityController.getActives().then(result => {
                console.log(result);
                result.data.map(city => {
                    element.innerHTML += `<option value="${city.cityId}">${city.nome}</option>`;
                });
            });
            dataDriver.driver.cityId = this.value;
            dataDriver.station.cityId = this.value;
        }
    });

    elementProperty.addEventInElement("#typeStation", "onchange", function () {
        dataDriver.station.stationTypeId = this.value;
    });

    elementProperty.getElement("#localReturn", element => {
        new MapService().importScriptWithPlaces().then(() => {
            const searchBox = new google.maps.places.SearchBox(element);

            searchBox.addListener('places_changed', function () {
                const places = searchBox.getPlaces();
                const place = places[0];

                dataDriver.station.address = element.value;
                dataDriver.station.longitude = place.geometry.location.lng();
                dataDriver.station.latitude = place.geometry.location.lat();
            });
        })
    });

    elementProperty.addEventInElement("#email", "onfocus", function () {
        elementProperty.getElement(".group-signup", element => {
            setTimeout(function () {
                element.scrollTo(0, element.scrollHeight);
            }, 300)
        });
    });

    elementProperty.addEventInElement(".toggle-collapsible", "onclick", function () {
        const _that = this;

        elementProperty.getElement(this.getAttribute("href"), element => {
            if (element.classList.contains("active")) {
                disableAllCollapsible();
                return;
            }
            disableAllCollapsible();
            _that.innerHTML = "expand_less";
            element.classList.add("active");
        });
    });

    function disableAllCollapsible() {
        elementProperty.getElement(".body-collapsible", element => {
            element.classList.remove("active");
        });
        elementProperty.getElement(".toggle-collapsible", element => {
            element.innerHTML = "expand_more";
        });
    }

    elementProperty.addEventInElement("#btnCaptureProfile", "onchange", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                elementProperty.getElement(`#imgPreviewPROFILE`, element => {
                    element.style.backgroundImage = `url(${e.target.result})`;
                });
            };

            reader.readAsDataURL(this.files[0]);

            resizeAndUpload(this.files[0], (result) => {
                dataDriver.image[this.getAttribute("typeImage")] = {data: result, name: this.files[0].name};
            });
        }
    });

    elementProperty.addEventInElement(".file-image-driver", "onchange", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                elementProperty.getElement(`#imgPreview${this.getAttribute("typeImage")}`, element => {
                    element.setAttribute("src", e.target.result);
                });
            };

            reader.readAsDataURL(this.files[0]);

            resizeAndUpload(this.files[0], (result) => {
                dataDriver.image[this.getAttribute("typeImage")] = {data: result, name: this.files[0].name};
            });
        }
    });

    window.addEventListener('keyboardDidShow', function () {
        elementProperty.getElement(".btn-next-signup", element => {
            element.classList.add("active");
        });
        elementProperty.getElement(".bottom-button", element => {
            element.classList.add("active");
        });
        elementProperty.getElement(".container-signup", element => {
            element.classList.add("active");
        });
    });

    window.addEventListener('keyboardDidHide', function () {
        elementProperty.getElement(".btn-next-signup", element => {
            element.classList.remove("active");
        });
        elementProperty.getElement(".bottom-button", element => {
            element.classList.remove("active");
        });
        elementProperty.getElement(".container-signup", element => {
            element.classList.remove("active");
        });
    });

    function resizeAndUpload(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function () {

            const tempImg = new Image();
            tempImg.src = reader.result;
            tempImg.onload = function () {

                const MAX_WIDTH = 1500;
                const MAX_HEIGHT = 1500;
                let tempW = tempImg.width;
                let tempH = tempImg.height;
                if (tempW > tempH) {
                    if (tempW > MAX_WIDTH) {
                        tempH *= MAX_WIDTH / tempW;
                        tempW = MAX_WIDTH;
                    }
                } else {
                    if (tempH > MAX_HEIGHT) {
                        tempW *= MAX_HEIGHT / tempH;
                        tempH = MAX_HEIGHT;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = tempW;
                canvas.height = tempH;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, tempW, tempH);
                let quality = 0.7;
                const dataURL = canvas.toDataURL(file.type, quality);

                callback(b64toBlob(
                    dataURL.replace(`data:${file.type};base64,`, ''), file.type));
            }

        }
        reader.readAsDataURL(file);
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    formGroup.callbackIgnore = (element) => {
        const type = element.getAttribute("value");

        if (!formGroup.validate[type])
            return true;

        return !formGroup.validate[type].required;
    };

    UserController.userTypeDrivers().then(({status, data}) => {
        if (!status)
            return;

        elementProperty.getElement("#listTypesDriver", element => {
            element.innerHTML = data.map(({idUserType, picture, name, description}) => {
                return `<li class="type-driver-signup" value="${idUserType}">
                    <img src="${picture}">
                    <div>
                        <p>${name}</p>
                        <label>${description || ""}</label>
                    </div>
                    <i class="material-icons">keyboard_arrow_right</i>
                </li>`;
            }).join("");

            initEventSelectTypeDriver();
        })
    })

    function initEventSelectTypeDriver() {
        elementProperty.addEventInElement(".type-driver-signup", "onclick", function () {
            dataDriver.driver.userTypeId = this.getAttribute("value");

            FormStepController.getByUserType(dataDriver.driver.userTypeId).then(({status, data}) => {
                if (!status)
                    return;

                formGroup.validate = {};

                formGroup.screens = [];

                data.map(item => {

                    if (document.querySelector(`.group-signup[value='${item.step}']`) == null)
                        return;

                    formGroup.validate[item.step] = {
                        wasValidated: false,
                        required: true,
                    };

                    formGroup.screens.push({
                        selectors: `.group-signup[value='${item.step}']`,
                        validated: false
                    });
                });

                document.querySelector(".group-signup[value='TYPE_DRIVER']").classList.remove("active");

                getDocumentsDriver();

                formGroup.initGroup()
            }).finally(() => {
                elementProperty.getElement("#preloadLogin", element => {
                    element.style.display = "none";
                });
            });
        });
    }

    function getDocumentsDriver() {
        DocUserTypeController.findByUserType(dataDriver.driver.userTypeId).then(({data}) => {

            elementProperty.getElement(".container-document-list", element => {
                element.innerHTML = data.map(item => {

                    dataDriver.driver.docs.push({docId: item.docId});

                    formGroup.screens.push({
                        selectors: `.document-driver-content[type='${item.docId}']`,
                        validated: false
                    });

                    return `<div class="document-driver-content" type="${item.docId}">
                                <h4>${item.label}</h4>
                                <div class="content-form-group">
                                    <div ${item.text == true ? "" : "hidden"}>
                                        <label>${item.description || ""}</label>
                                        <a  href="${item.link}" target="_blank">
                                                ${item.link != null ? i18next.t('request_document') : ""}
                                        </a>
                                        <input type="text" placeholder="${i18next.t('placeholder_write')}" typeDocument="${item.docId}"/>
                                    </div>
                                    <div  ${item.image == true ? "" : "hidden"} class="file-document">
                                        <input type="file" typeDocument="${item.docId}" class="input-file-document">
                                        <span>${i18next.t('label_input_add_document')}</span>
                                        <a>
                                            <i class="material-icons">keyboard_arrow_right</i>
                                        </a>
                                    </div>
                                    <div class="content-image-document" typeDocument="${item.docId}"></div>
                                    <button class="btn btn-document-driver" 
                                    typeDocument='${JSON.stringify(item)}' type="button">${i18next.t('button_next')}</button>
                                    </div>
                            </div>`;
                }).join("");

                elementProperty.addEventInElement(".input-file-document", "onchange", function () {
                    const docId = this.getAttribute("typeDocument");

                    const doc = dataDriver.image.DOCUMENTS.find((item) => {
                        return item.docId === docId;
                    }) || {docId, image: null, inArray: false};

                    if (!doc.inArray) {
                        doc.inArray = true;

                        dataDriver.image.DOCUMENTS.push(doc);
                    }

                    if (this.files && this.files[0]) {
                        const reader = new FileReader();

                        reader.onload = (e) => {
                            document.querySelector(`.content-image-document[typeDocument='${docId}']`).style.backgroundImage =
                                `url(${e.target.result})`;
                        };

                        reader.readAsDataURL(this.files[0]);

                        resizeAndUpload(this.files[0], (result) => {
                            doc.image = {data: result, name: this.files[0].name};
                        });
                    }
                });

                elementProperty.addEventInElement(".btn-document-driver", "onclick", function () {
                    const data = JSON.parse(this.getAttribute("typeDocument"));

                    const doc = dataDriver.driver.docs.find(item => {
                        return item.docId === data.docId;
                    });


                    if (data.text == true) {
                        doc.text = document.querySelector(`input[typeDocument='${data.docId}']`).value;

                        if (doc.text.length === 0)
                            return SwalCustom.messageDialog("", `${i18next.t('message_modal_alert_document_not_found')} - ${data.label}`);
                    }

                    if (data.image == true) {
                        if (dataDriver.image.DOCUMENTS.filter(item => {
                            return data.docId === item.docId && item.image != null;
                        }).length === 0)
                            return SwalCustom.messageDialog("", `${i18next.t('take_photo_document')} - ${data.label}`);
                    }

                    formPass();
                })
            });
        });
    }

});