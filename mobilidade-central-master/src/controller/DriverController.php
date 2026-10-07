<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 06/06/2019
 * Time: 11:29
 */

class DriverController extends View
{
    public function actionSignUp()
    {
        $this->setTemplate(Template::defaultView());

        return $this->layoutBuilder(
            [
                "driver/signup",
                "preload/index"
            ],
            [
                "controllers/DriverController",
                "controllers/EstateController",
                "controllers/CityController",
                "controllers/RequiredFieldController",
                "controllers/UserTypeController",
                "controllers/StationTypeController",
                "controllers/SupportController",
                "controllers/CooperativeController",
                "controllers/UtilController",
                "repositories/CentralRepository",
                "service/MapService",
                "utils/FormGroup",
                "utils/Preload",
                "modules/driver/signup",
                "modules/validator/validateSignup",
            ],
            [
                "driver/signup",
                "preload/index"
            ]);
    }

    public function actionList(){

        $this->setTemplate(Template::defaultView());

        return $this->layoutBuilder(
            [
                'driver/list',
                'modal/addDriverInCentral',
                'preload/index',
            ],
            [
                'repositories/CentralRepository',
                'repositories/DriverRepository',
                'modules/driver/list',
                'modules/driver/addDriverInCentral',
                "utils/Preload",
                "utils/Driver",
            ],
            [
                'driver/list',
                'modal/listDriversActive',
                'preload/index',
            ]);
    }
}