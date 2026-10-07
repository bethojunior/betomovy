<?php

namespace App\Services\Ifood;

use GuzzleHttp\Client;
use App\Models\Central\Central;
use App\Services\Trip\TripService;
use App\Services\Trip\NewTripService;
use App\Repositories\User\UserRepository;
use App\Repositories\Locale\CityRepository;
use Illuminate\Support\Facades\DB;
use App\Helpers\Ifood\IfoodLogisticHelper;

class IfoodService
{
    public $centralId;
    protected Client $clientRequest;
    protected TripService $tripService;
    protected NewTripService $newTripService;
    protected UserRepository $userRepository;
    protected CityRepository $cityRepository;
    protected IfoodLogisticHelper $helper;

    public function __construct(
        TripService $tripService,
        NewTripService  $newTripService,
        UserRepository $userRepository,
        CityRepository $cityRepository,
        IfoodLogisticHelper $helper
    ) {
        $this->tripService    = $tripService;
        $this->clientRequest  = new Client();
        $this->newTripService = $newTripService;
        $this->userRepository = $userRepository;
        $this->cityRepository = $cityRepository;
        $this->helper         = $helper;
    }

    public function getToken($userId)
    {
        $token = DB::table('partner')
            ->where('userId', $userId)
            ->select('api_token')
            ->value('api_token');

        return password_hash($token, PASSWORD_BCRYPT);
    }

    public function getIdUser($centralId)
    {
        return DB::table('central')
            ->join('user', 'central.responsibleId', '=', 'user.idUser')
            ->where('central.id', $centralId)
            ->select('user.*')
            ->first();
    }

    public function instanceTrip($props, $centralId)
    {
        $user = $this->userRepository->findById($this->getIdUser($centralId)->idUser);
        $token = $this->getToken($user->idUser);
        $central = Central::where('id', $centralId)->first();

        $destiny = array();
        $destiny['address']   = $props['address']['address'];
        $destiny['latitude']  = $props['address']['latitude'];
        $destiny['longitude'] = $props['address']['longitude'];

        $origin = array();
        $origin['address']   = $central->address;
        $origin['latitude']  = $central->latitude;
        $origin['longitude'] = $central->longitude;

        $cityId = $this->cityRepository->findByCoordinate($origin['latitude'], $origin['longitude']);
        $price = self::requestPrice($origin, $destiny, $token, $user->idUser);

        $tripTypeId = $props['tripTypeId'] ?? 11;
        $priceSelected = null;

        foreach ($price->data->prices as $item) {
            if ($item->tripTypeId == $tripTypeId) {
                $priceSelected = $item;
                break;
            }
        }

        $tripRequest = [
            'flow' => 'ifood',
            'userId' => $user->idUser,
            'tripTypeId' => $props['tripTypeId'],
            'tripPaymentFormId' => 2,
            'priceId' => $priceSelected->idPrice,
            'centralId' => $centralId,
            'price' => $priceSelected->price,
            'cityId' => $cityId->id,
            'waypoints' => [],
            'distance' => $price->data->distance,
            'estimatedTripTime' => 0,
            'multiplierDynamic' => 0,
            'isOpenPriceTrip' => false,
            'haveReturn' => false,
            'paidByCentral' => 1,
            'favoriteDrivers' => [],
            'favorites' => null,
            'tripCustomer' => [
                'id' => $user->idUser,
            ],
            'deliveryInfo' => [
                'obsOrigin' => $origin['address'],
                'obsDestination' => 'Cliente: ' . $props['customer']['name'],
                'obs' => 'ifood-logistic',
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

        try {
            return $this->newTripService->newTrip($tripRequest, $user, false);
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function requestPrice($origin, $destination, $token, $userId)
    {
        return $this->helper->getPrices($origin, $destination, $token, $userId);
    }
}
