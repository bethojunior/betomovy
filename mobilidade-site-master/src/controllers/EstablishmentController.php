<?php

class EstablishmentController extends View
{

    function actionRegister()
    {

        $js = [
            'plugins/jquery.mask',
            'plugins/jquery.maskMoney.min',
            'utils/getCoords',
            'utils/validateData',
            'utils/preload',
            'controllers/BankController',
            'controllers/CountryController',
            'controllers/EstablishmentController',
            'controllers/UserController',
            'modulos/addEstablishment/applyMask',
            'modulos/addEstablishment/defaults',
            'modulos/addEstablishment/renderEstablishments',
            'modulos/addEstablishment/autocomplete',
            'modulos/addEstablishment/stars',
            'modulos/addEstablishment/calcDailyValue',
            'modulos/addEstablishment/loadBanks',
            'modulos/addEstablishment/addImages',
            'modulos/addEstablishment/addEmployee',
            'modulos/addEstablishment/addEstablishmentDesktop'
        ];

        $css = ['reset', 'addEstablishment', 'navbarTransparent', 'menuMobileHome', 'preload'];

        $views = ['preload/index', 'nav/navBarTransparent', 'establishment/index'];

        $seo = new stdClass();
        $seo->description = 'Aplicativo de Taxi de Fortaleza que conecta hotelaria à taxistas, oferecendo o melhor preço em corridas com destinos à rodoviária/aeroporto. Acesse e descubra.';
        $seo->title = 'Return | Aplicativo de Táxi em Fortaleza';

        $this->layoutBuilder($views, $js, $css, $seo);
    }

    function actionRegisterMobile()
    {

        $js = [
            'plugins/jquery.mask',
            'plugins/jquery.maskMoney.min',
            'utils/getCoords',
            'utils/validateData',
            'utils/preload',
            'controllers/CountryController',
            'controllers/BankController',
            'controllers/EstablishmentController',
            'service/MaskService',
            'modulos/addEstablishmentMobile/renderSteps',
            'modulos/addEstablishmentMobile/defaults',
            'modulos/addEstablishmentMobile/getEstates',
            'modulos/addEstablishmentMobile/applyMask',
            'modulos/addEstablishment/stars',
            'modulos/addEstablishmentMobile/autocompleteAddress',
            'modulos/addEstablishmentMobile/addBasicInfo',
            'modulos/addEstablishmentMobile/addGeneralInfo',
            'modulos/addEstablishmentMobile/addContactInfo',
            'modulos/addEstablishmentMobile/addBankInfo',
            'modulos/addEstablishmentMobile/addImages',
            'modulos/addEstablishmentMobile/addEmployee',
            'modulos/addEstablishmentMobile/saveEstablishment'
        ];

        $css = [
            'addEstablishmentMobile/header',
            'addEstablishmentMobile/form',
            'preload'
        ];

        $views = ['preload/index', 'establishment/addMobile'];

        $seo = new stdClass();
        $seo->description = 'Aplicativo de Taxi de Fortaleza que conecta hotelaria à taxistas, oferecendo o melhor preço em corridas com destinos à rodoviária/aeroporto. Acesse e descubra.';
        $seo->title = 'Return | Aplicativo de Táxi em Fortaleza';

        $this->layoutBuilder($views, $js, $css, $seo);
    }

    function actionPreRegister() {

        $js    = [
            'plugins/jquery.mask',
            'plugins/jquery.maskMoney.min',
            'utils/getCoords',
            'utils/validateData',
            'utils/preload',
            'controllers/CountryController',
            'controllers/BankController',
            'controllers/EstablishmentController',
            'controllers/EmployeeController',
            'service/MaskService',
            'service/MapService',
            'service/Autocomplete',
            'modulos/preSignUpEstablishment/renderSteps',
            'modulos/preSignUpEstablishment/defaults',
            'modulos/preSignUpEstablishment/getEstates',
            'modulos/preSignUpEstablishment/applyMask',
            'modulos/addEstablishment/stars',
            'modulos/preSignUpEstablishment/autocompleteAddress',
            'modulos/preSignUpEstablishment/addBasicInfo',
            'modulos/preSignUpEstablishment/addGeneralInfo',
            'modulos/preSignUpEstablishment/addContactInfo',
            'modulos/preSignUpEstablishment/addBankInfo',
            'modulos/preSignUpEstablishment/addDataUser',
            'modulos/preSignUpEstablishment/addImages',
            'modulos/preSignUpEstablishment/addEmployee',
            'modulos/preSignUpEstablishment/saveEstablishment'
        ];

        $css   = [
            'addEstablishmentMobile/header',
            'addEstablishmentMobile/form',
            'preload'
        ];

        $views = ['preload/index','establishment/preSignUp'];

        $seo = new stdClass();
        $seo->description   = 'Aplicativo de Taxi de Fortaleza que conecta hotelaria à taxistas, oferecendo o melhor preço em corridas com destinos à rodoviária/aeroporto. Acesse e descubra.';
        $seo->title         = 'Return | Aplicativo de Táxi em Fortaleza';

        $this->layoutBuilder($views, $js, $css, $seo);
    }
}