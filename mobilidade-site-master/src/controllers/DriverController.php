<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 22/05/2019
 * Time: 16:16
 */

class DriverController extends View
{
    public function actionSignUp(){
       return $this->layoutBuilder(
           [
                "menu/menuTitle",
                "driver/signup"
           ],
           [
               "controllers/DriverController",
               "controllers/FormStepController",
               "controllers/DocUserTypeController",
               "controllers/EstateController",
               "controllers/CityController",
               "controllers/CooperativeController",
               "controllers/UserController",
               "controllers/StationController",
               "controllers/StationTypeController",
               "controllers/SupportController",
               "controllers/UtilController",
               "service/MapService",
               "utils/ValidateForm",
               "modulos/driver/signup",
               "modulos/validator/validateSignup",
               "controllers/HomeController"
           ],
           [
               "menu/signup",
               "driver/signup"
           ]
       );
    }

    public function actionExemptionRequest(){
        return $this->layoutBuilder(
            [
                "driver/exemptionRequest"
            ],
            [
                "controllers/DriverController",
                "modulos/driver/exemptionRequest",
            ],
            [
                "driver/exemptionRequest"
            ]
        );
    }
}