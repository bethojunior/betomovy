<?php

namespace App\Services\Whatsapp;

use GuzzleHttp\Client;
use App\Services\Trip\TripService;
use App\Services\Trip\NewTripService;
use App\Repositories\User\UserRepository;
use App\Repositories\Locale\CityRepository;
use App\Helpers\Ifood\IfoodLogisticHelper;
use App\Models\Trip\Trip;
use App\Repositories\Central\CentralCustomerRepository;
use App\Models\Trip\TripPaymentForm;
use App\Providers\PulseProvider;
use App\Services\Trip\CancelTripService;
use App\Utils\Pulse\GroupIds;

class WhatsappService
{
    public $centralId;
    protected Client $clientRequest;
    protected TripService $tripService;
    protected NewTripService $newTripService;
    protected UserRepository $userRepository;
    protected CityRepository $cityRepository;
    protected IfoodLogisticHelper $helper;
    private CentralCustomerRepository $centralCustomerRepository;
    private CancelTripService $cancelTripService;
    private $pulseProvider;

    public function __construct(
        TripService $tripService,
        NewTripService  $newTripService,
        UserRepository $userRepository,
        CityRepository $cityRepository,
        IfoodLogisticHelper $helper,
        CentralCustomerRepository $centralCustomerRepository,
        CancelTripService $cancelTripService
    ) {
        $this->tripService    = $tripService;
        $this->clientRequest  = new Client();
        $this->newTripService = $newTripService;
        $this->userRepository = $userRepository;
        $this->cityRepository = $cityRepository;
        $this->centralCustomerRepository = $centralCustomerRepository;
        $this->cancelTripService = $cancelTripService;
        $this->helper         = $helper;
        $this->pulseProvider = new PulseProvider("central-" . env('APP_NAME', 'central_prod'), GroupIds::CENTRAL_PROD_WPP);
    }

    public function findUserByPhoneAndCentral($centralId, $phone)
    {
        return $this->userRepository->findWithCustomerByWpp($phone, $centralId);
    }

    public function calculatePrice($props)
    {
        $paramsUserRequest = $this->userRepository->getTokenCentralUserManager($props['centralId']);

        $destiny = array();
        $destiny['address']   = $props['destination']['address'];
        $destiny['latitude']  = $props['destination']['latitude'];
        $destiny['longitude'] = $props['destination']['longitude'];

        $origin = array();
        $origin['address']   = $props['origin']['address'];
        $origin['latitude']  = $props['origin']['latitude'];
        $origin['longitude'] = $props['origin']['longitude'];

        return self::requestPrice($origin, $destiny, $paramsUserRequest['token'], $paramsUserRequest['userId'], $props['keyAppPartner']);
    }

    public function newTrip(array $props)
    {
        $user = $this->userRepository->findUserById($props['userId']);
        $paramsUserRequest = $this->userRepository->getTokenCentralUserManager($props['centralId']);

        $destiny = array();
        $destiny['address']   = $props['destination']['address'];
        $destiny['latitude']  = $props['destination']['latitude'];
        $destiny['longitude'] = $props['destination']['longitude'];

        $origin = array();
        $origin['address']   = $props['origin']['address'];
        $origin['latitude']  = $props['origin']['latitude'];
        $origin['longitude'] = $props['origin']['longitude'];

        $customer = array();
        $customer['name']  = $props['customer']['name'];
        $customer['phone'] = $props['customer']['phone'];

        $cityId = $this->cityRepository->findByCoordinate($origin['latitude'], $origin['longitude']);

        if (!is_null($props['keyAppPartner'])) {
            $customer['key_app_partner'] = $props['keyAppPartner'];
        }

        // paymentFormTypeId always have to be 2 (money) for whatsapp trips
        $tripPaymentFormId = TripPaymentForm::where('paymentFormTypeId', 2)->first();

        $this->pulseProvider->critical("now" . now(), "props :" . json_encode($props));
        $tripRequest = [
            'flow' => 'whatsapp',
            'userId' => $props['userId'],
            'tripTypeId' => $props['tripTypeId'],
            'tripPaymentFormId' => $tripPaymentFormId->idTripPaymentForm,
            'price' => $props['price']['value'],
            'priceId' => $props['price']['id'],
            'centralId' => $props['centralId'],
            'cityId' => $cityId->id,
            'waypoints' => $props['waypoints'] ?? [],
            'distance' => $props['price']['distance'],
            'estimatedTripTime' => $props['price']['duration'],
            'multiplierDynamic' => 0,
            'isOpenPriceTrip' => false,
            'haveReturn' => false,
            'paidByCentral' => false,
            'favoriteDrivers' => [],
            'favorites' => null,
            'tripCustomer' => [
                'id' => $props['userId'],
                'name' => $customer['name'],
                'phone' => $customer['phone'],
                'key_app_partner' => $props['keyAppPartner'],
            ],
            'aditionalInfo' => json_encode(['customer' => $customer]),
            'deliveryInfo' => [
                'obsOrigin' => $origin['address'],
                'obsDestination' => '',
                'obs' => '',
            ],
            'origin' => [
                'address'   => $origin['address'],
                'latitude'  => $origin['latitude'],
                'longitude' => $origin['longitude'],
                'cityId'    => $cityId->id,
                'neighborhood' => '',
            ],
            'destination' => [
                'address'   => $destiny['address'],
                'latitude'  => $destiny['latitude'],
                'longitude' => $destiny['longitude'],
            ],
        ];


        if (!is_null($props['keyAppPartner'])) {
            $tripRequest['key_app_partner'] = $props['keyAppPartner'];
        }


        try {
            return $this->newTripService->newTrip($tripRequest, $user, false);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function requestPrice($origin, $destination, $token, $userId, $keyAppPartner = null)
    {
        return $this->helper->getPrices($origin, $destination, $token, $userId, $keyAppPartner);
    }

    public function cancelTrip($phone)
    {
        try {
            $user = $this->userRepository->findUserByPhone($phone);

            if (!$user) {
                throw new \Exception("Usuário não encontrado");
            }

            $trip = Trip::where('userId', $user->idUser)
                ->whereIn('status', ['accepted', 'in_progress', 'boarding'])
                ->latest()
                ->first();

            if (!$trip) {
                throw new \Exception("Nenhuma viagem ativa encontrada para este usuário");
            }

            if ($trip->status !== 'accepted') {
                throw new \Exception("Sua viagem não pode ser cancelada pois ela já está em andamento ou foi concluída");
            }

            if ($trip) {
                return $this->cancelTripService->cancelByFlow($trip->tripReference);
            }
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    public function hasActiveTrip($phone)
    {
        try {
            $user = $this->userRepository->findUserByPhone($phone);

            if (!$user) {
                throw new \Exception("Usuário não encontrado");
            }

            $trip = Trip::where('userId', $user->idUser)
                ->whereIn('status', ['accepted', 'in_progress', 'boarding'])
                ->latest()
                ->first();

            return $trip ? true : false;
        } catch (\Exception $e) {
            $this->pulseProvider->critical("Error ao verificar viagem ativa pelo whatsapp: " . $e->getMessage(), "phone: " . $phone);
            return false;
        }
    }
}
