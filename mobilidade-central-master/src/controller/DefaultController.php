<?php
/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 10/07/2018
 * Time: 09:01
 */

class DefaultController extends View
{

    public function actionIndex()
    {
        if (Session::get('user')) {
            $centralSelected = Session::get('centralSelected');
            if (!$centralSelected) {
                $centrals = Session::get('centrals');
                if (is_array($centrals) && count($centrals) === 1) {
                    $selected = $centrals[0]->central ?? $centrals[0];
                    Session::add('centralSelected', $selected);
                    $this->actionHome();
                    return;
                } elseif (is_array($centrals) && count($centrals) > 1) {
                    $this->actionSelectCentral();
                    return;
                }
            }
            $this->actionHome();
            return;
        }

        $this->actionLogin();
    }

    public function actionLogin()
    {
        $this->layoutBuilder
        (
            ["default/login", "preload/index"],
            [
                //"controllers/CustomerController",
                "repositories/UserRepository",
                "modules/default/login"
            ],
            ["default/login", "preload/index"]
        );
    }


    public function actionHome()
    {
        $this->layoutBuilder
        (
            [
                'menu/menuBase',
                'trip/formAddressTrip',
                'modal/typeCustomer',
                'modal/evaluation',
                'modal/favoriteDriverTrip',
                'modal/modalFindCustomer',
                'modal/modalConfirmationDataTrip',
                'modal/listDriversActive',
                'modal/scheduleDriverPoolModal',
                'modal/modalCreateCustomer',
                'modal/modalNeighborhood',
                'modal/modalEditScheduledTrip',
                'trip/listTrips',
                'trip/modalTypesReturn',
                "trip/infoTrip",
                'preload/index',
                'default/home',
                'delivery/simpleDelivery',
                'dynamicfields/simpleCentral',
            ],
            [
                "adapters/TripAdapter",
                "service/SocketConnection",
                "realtime/trip/TripRealtimeFirebase",
                "realtime/trip/TripRealtimeSocket",
                "realtime/TripRealtime",
                "realtime/TripRouteRealtime",
                "realtime/ChatRealtime",
                "service/Position",
                "service/MapService",
                "service/PaymentCard",
                "utils/statusTrip",
                "utils/CurrencyFormat",
                "utils/whatsappSession",
                "utils/Driver",
                'repositories/whatsappRepository',
                "repositories/ConfigRepository",
                "repositories/ChatRepository",
                "repositories/DriverRepository",
                "repositories/FavoriteDriver",
                "repositories/CentralRepository",
                "repositories/TripPaymentFormRepository",
                "repositories/PlaceRepository",
                "repositories/TripRepository",
                "repositories/MonitoringRepository",
                "controllers/PriceController",
                "controllers/TripRatingController",
                "controllers/CityController",
                'controllers/CentralController',
                "controllers/DriverController",
                "controllers/DynamicFieldsController",
                "controllers/PartnerController",
                "controllers/CustomerController",
                "controllers/CustomerCardController",
                "controllers/FavoriteDriverController",
                "controllers/CustomerPlaceController",
                "controllers/TripPaymentFormController",
                "controllers/NeighborhoodController",
                "controllers/EstateController",
                "controllers/TripController",
                "controllers/VoucherController",
                "modules/whatsapp/main", // whatsapp module
                "modules/keyboard/index",
                "modules/location/updatePosition",
                "modules/driver/positions",
                "modules/customer/addCustomer",
                "modules/customer/selectCustomer",
                "modules/price/PriceTrip",
                "modules/place/selectPlace",
                "modules/place/address",
                "modules/menu/menuBase",
                "modules/delivery/infoDelivery",
                "modules/dynamicfields/infoFieldsCentral",
                "modules/driver/checkFavorites",
                "modules/driver/anotherTypeDriver",
                "modules/trip/updateTrip",
                "modules/paymentform/TripPaymentForm",
                "modules/init/initEvents",
                "modules/trip/confirmationDataTrip",
                "modules/trip/initTrip",
                "modules/trip/cancelTrip",
                "modules/trip/finishTrip",
                "modules/trip/statusTrip",
                "modules/trip/evaluation",
                "modules/trip/knobTrip",
                "modules/trip/local",
                "modules/trip/QRCodeCapture",
                "modules/partner/selectTrip",
                "modules/default/home",
                "modules/trip/editScheduledTrip",
                "modules/trip/schedulePicker",
                "modules/trip/scheduleDriverPool",
                "modules/chat/index",
                "modules/voucher/index",
                "modules/favoriteDriver/favoriteDriversActive",
                'modules/driver/addDriverInCentral',
                'modules/whatsapp/group',
            ],
            [
                'menu/menu',
                'menu/menu-close',
                "default/home",
                'modal/typeCustomer',
                'modal/modalEvaluation',
                'modal/modalTypesReturn',
                'modal/modalFindCustomer',
                'modal/favoriteDriverTrip',
                'modal/modalConfirmationDataTrip',
                'modal/listDriversActive',
                'modal/scheduleDriverPoolModal',
                'modal/modalCreateCustomer',
                'modal/modalEditScheduledTrip',
                'trip/schedulePicker',
                'trip/listTrips',
                "trip/infoTrip",
                "chat/index",
                'preload/index',
                'price/index',
                "trip/call",
                'delivery/simpleDelivery',
                'voucher/index',
            ]
        );
    }

    public function actionSelectCentral()
    {
        $this->layoutBuilder(
            [
                "central/selectCentral"
            ],
            [
                "modules/central/selectCentral"
            ],
            [
                "central/selectCentral"
            ]);
    }

    public function actionOffline()
    {
        $this->rendererView('offline/index');
    }

    public function actionLogout()
    {
        Session::delete('centralSelected');
        Session::delete('user');
        header('Location: /');
    }

    public function actionRegister()
    {
        $this->layoutBuilder(
            [
                "central/register"
            ],
            [
                "repositories/CentralRepository",
                "repositories/UserRepository",
                "modules/central/register"
            ],
            [
                "central/register"
            ]
        );
    }

    public function actionCadastro()
    {
        $this->layoutBuilder(
            [
                'customer/new'
            ],
            [
                'user/register',
                'repositories/UserRepository',
                'modules/user/register'
            ],
            [
                'user/register',
            ],
        );
    }
}
