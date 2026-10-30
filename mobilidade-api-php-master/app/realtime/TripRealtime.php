<?php

namespace app\realtime;

use app\contracts\TripRealtimeServiceInterface;
use app\model\Config;
use app\services\TripFirestoreService;
use app\services\TripSocketService;
use app\utils\TripFirestore;
use app\utils\TripRealtimeApiClient;
use DateTime;
use ReflectionClass;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 27/05/2019
 * Time: 21:42
 */
class TripRealtime
{
    protected $calling_at;
    protected $callingDriver;
    protected $cityId;
    protected $colorAudit;
    protected $customer;
    protected $customerCancellationFee;
    protected $customerName;
    protected $date;
    protected $destination;
    protected $driver;
    protected $driverCommissionId;
    protected $driverId;
    protected $distance;
    protected $estimatedTripTime;
    protected $estimatedTimeDriverArrival;
    protected $deliveryInfo;
    protected $tripItems;
    protected $idTrip;
    protected $origin;
    protected $price;
    protected $oldPrice;
    protected $priceId;
    protected $fare;
    protected $rewardTrip;
    protected $tripLongDistanceValue;
    protected $recalculatedPrice;
    protected $status;
    protected $rand;
    protected $tripCallTypeId;
    protected $tripCallType;
    protected $tripType;
    protected $timeToExpireTrip;
    protected $tripPaymentForm;
    protected $tripPaymentFormId;
    protected $tripReference;
    protected $tripTypeId;
    protected $tripWayPoints;
    protected $centralId;
    protected $userId;
    protected $freightItems;
    protected $blockedDrivers = [];
    protected $accessibility;
    protected $schedule;
    protected $priceRange;
    protected $tripDiscountCoupon;
    protected $multiplierDynamic;
    protected $ride;
    protected $haveReturn;
    protected $oldDestinationId;
    protected $centralNeighborhoodId;
    protected $tripBids;
    protected $isOffer;
    protected $driverCommissionValue;
    protected $driverCommissionType;
    protected $disableOnPromotion;
    protected $driverNetValue;

    /** @var TripRealtimeServiceInterface */
    protected $realtimeService;

    public function setBlockedDrivers($blockedDrivers)
    {
        $this->blockedDrivers = $blockedDrivers;
        return $this;
    }

    public function getBlockedDrivers()
    {
        return $this->blockedDrivers;
    }

    public function __construct()
    {
        $enableRealtimeSocket = (bool)Config::get('enable_realtime_socket');

        if ($enableRealtimeSocket) {
            $tripApiClient = new TripRealtimeApiClient();
            $this->realtimeService = new TripSocketService($tripApiClient);
        } else {
            $firestore = new TripFirestore();
            $this->realtimeService = new TripFirestoreService($firestore);
        }
    }

    public function hydrate(stdClass $trip)
    {
        foreach ($trip as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }

        $this->parseCallingDriver();
        $this->date = new DateTime($this->date);

        return $this;
    }

    public function createTrip()
    {
        $this->realtimeService->create($this->toArray());
    }

    public function updateTrip()
    {
        $this->realtimeService->update($this->toArray());
    }

    public function deleteTrip()
    {
        $this->realtimeService->delete($this->toArray());

        foreach ($this->toArray() as $key => $value) {
            $this->$key = null;
        }
    }

    private function toArray(): array
    {
        $reflection = new ReflectionClass($this);
        $props = $reflection->getProperties();
        $data = [];

        foreach ($props as $prop) {
            $prop->setAccessible(true);
            $name = $prop->getName();

            if (in_array($name, ['realtimeService'])) continue;

            $data[$prop->getName()] = $prop->getValue($this);
        }

        return $data;
    }

    private function parseCallingDriver()
    {
        $raw = $this->callingDriver;

        if (is_int($raw) || is_float($raw)) {
            $raw = (string)$raw;
        }

        if (is_array($raw)) {
            $this->callingDriver = array_values(array_filter(array_map('strval', $raw), function ($id) {
                return $id !== '';
            }));
            return;
        }

        if (is_string($raw) && $raw !== '') {
            $this->callingDriver = array_values(array_filter(array_map('trim', explode(',', $raw)), function ($id) {
                return $id !== '';
            }));
            return;
        }

        $this->callingDriver = [];
    }


    // *** Getters and Setters ***

    /**
     * @return mixed
     */
    public function getCallingAt()
    {
        return $this->calling_at;
    }

    /**
     * @param mixed $calling_at
     * @return TripRealtime
     */
    public function setCallingAt($calling_at)
    {
        $this->calling_at = $calling_at;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCallingDriver()
    {
        return $this->callingDriver;
    }

    /**
     * @param mixed $callingDriver
     * @return TripRealtime
     */
    public function setCallingDriver($callingDriver)
    {
        $this->callingDriver = $callingDriver;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param mixed $cityId
     * @return TripRealtime
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getColorAudit()
    {
        return $this->colorAudit;
    }

    /**
     * @param mixed $colorAudit
     * @return TripRealtime
     */
    public function setColorAudit($colorAudit)
    {
        $this->colorAudit = $colorAudit;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomer()
    {
        return $this->customer;
    }

    /**
     * @param mixed $customer
     * @return TripRealtime
     */
    public function setCustomer($customer)
    {
        $this->customer = $customer;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerCancellationFee()
    {
        return $this->customerCancellationFee;
    }

    /**
     * @param mixed $customerCancellationFee
     * @return TripRealtime
     */
    public function setCustomerCancellationFee($customerCancellationFee)
    {
        $this->customerCancellationFee = $customerCancellationFee;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerName()
    {
        return $this->customerName;
    }

    /**
     * @param mixed $customerName
     * @return TripRealtime
     */
    public function setCustomerName($customerName)
    {
        $this->customerName = $customerName;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     * @return TripRealtime
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestination()
    {
        return $this->destination;
    }

    /**
     * @param mixed $destination
     * @return TripRealtime
     */
    public function setDestination($destination)
    {
        $this->destination = $destination;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriver()
    {
        return $this->driver;
    }

    /**
     * @param mixed $driver
     * @return TripRealtime
     */
    public function setDriver($driver)
    {
        $this->driver = $driver;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverCommissionId()
    {
        return $this->driverCommissionId;
    }

    /**
     * @param mixed $driverCommissionId
     * @return TripRealtime
     */
    public function setDriverCommissionId($driverCommissionId)
    {
        $this->driverCommissionId = $driverCommissionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDriverId()
    {
        return $this->driverId;
    }

    /**
     * @param mixed $driverId
     * @return TripRealtime
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEstimatedTimeDriverArrival()
    {
        return $this->estimatedTimeDriverArrival;
    }

    /**
     * @param mixed $estimatedTimeDriverArrival
     * @return TripRealtime
     */
    public function setEstimatedTimeDriverArrival($estimatedTimeDriverArrival)
    {
        $this->estimatedTimeDriverArrival = $estimatedTimeDriverArrival;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdTrip()
    {
        return $this->idTrip;
    }

    /**
     * @param mixed $idTrip
     * @return TripRealtime
     */
    public function setIdTrip($idTrip)
    {
        $this->idTrip = $idTrip;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOrigin()
    {
        return $this->origin;
    }

    /**
     * @param mixed $origin
     * @return TripRealtime
     */
    public function setOrigin($origin)
    {
        $this->origin = $origin;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param mixed $price
     * @return TripRealtime
     */
    public function setPrice($price)
    {
        $this->price = $price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRewardTrip()
    {
        return $this->rewardTrip;
    }

    /**
     * @param mixed $rewardTrip
     * @return TripRealtime
     */
    public function setRewardTrip($rewardTrip)
    {
        $this->rewardTrip = $rewardTrip;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param mixed $status
     * @return TripRealtime
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRand()
    {
        return $this->rand;
    }

    /**
     * @param mixed $rand
     * @return TripRealtime
     */
    public function setRand($rand)
    {
        $this->rand = $rand;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripCallTypeId()
    {
        return $this->tripCallTypeId;
    }

    /**
     * @param mixed $tripCallTypeId
     * @return TripRealtime
     */
    public function setTripCallTypeId($tripCallTypeId)
    {
        $this->tripCallTypeId = $tripCallTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTimeToExpireTrip()
    {
        return $this->timeToExpireTrip;
    }

    /**
     * @param mixed $timeToExpireTrip
     * @return TripRealtime
     */
    public function setTimeToExpireTrip($timeToExpireTrip)
    {
        $this->timeToExpireTrip = $timeToExpireTrip;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripPaymentForm()
    {
        return $this->tripPaymentForm;
    }

    /**
     * @param mixed $tripPaymentForm
     * @return TripRealtime
     */
    public function setTripPaymentForm($tripPaymentForm)
    {
        $this->tripPaymentForm = $tripPaymentForm;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripReference()
    {
        return $this->tripReference;
    }

    /**
     * @param mixed $tripReference
     * @return TripRealtime
     */
    public function setTripReference($tripReference)
    {
        $this->tripReference = $tripReference;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripTypeId()
    {
        return $this->tripTypeId;
    }

    /**
     * @param mixed $tripTypeId
     * @return TripRealtime
     */
    public function setTripTypeId($tripTypeId)
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripWayPoints()
    {
        return $this->tripWayPoints;
    }

    /**
     * @param mixed $tripWayPoints
     * @return TripRealtime
     */
    public function setTripWayPoints($tripWayPoints)
    {
        $this->tripWayPoints = $tripWayPoints;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCentralId()
    {
        return $this->centralId;
    }

    /**
     * @param mixed $centralId
     * @return TripRealtime
     */
    public function setCentralId($centralId)
    {
        $this->centralId = $centralId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     * @return TripRealtime
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripCallType()
    {
        return $this->tripCallType;
    }

    /**
     * @param mixed $tripCallType
     * @return TripRealtime
     */
    public function setTripCallType($tripCallType)
    {
        $this->tripCallType = $tripCallType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripType()
    {
        return $this->tripType;
    }

    /**
     * @param mixed $tripType
     * @return TripRealtime
     */
    public function setTripType($tripType)
    {
        $this->tripType = $tripType;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRide()
    {
        return $this->ride;
    }

    /**
     * @param mixed $ride
     * @return TripRealtime
     */
    public function setRide($ride)
    {
        $this->ride = $ride;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOldDestinationId()
    {
        return $this->oldDestinationId;
    }

    /**
     * @param mixed $oldDestinationId
     * @return TripRealtime
     */
    public function setOldDestinationId($oldDestinationId)
    {
        $this->oldDestinationId = $oldDestinationId;
        return $this;
    }

    public function getCentralNeighborhoodId()
    {
        return $this->centralNeighborhoodId;
    }

    /**
     * @param mixed $centralNeighborhoodId
     * @return TripRealtime
     */
    public function setCentralNeighborhoodId($centralNeighborhoodId)
    {
        $this->centralNeighborhoodId = $centralNeighborhoodId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripBids()
    {
        return $this->tripBids;
    }

    /**
     * @param mixed $tripBids
     * @return TripRealtime
     */
    public function setTripBids($tripBids)
    {
        $this->tripBids = $tripBids;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIsOffer()
    {
        return $this->isOffer;
    }

    /**
     * @param mixed $isOffer
     * @return TripRealtime
     */
    public function setIsOffer($isOffer)
    {
        $this->isOffer = $isOffer;
        return $this;
    }

    /**
     * @param $oldPrice
     * @return $this
     */
    public function setOldPrice($oldPrice)
    {
        $this->oldPrice = $oldPrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOldPrice()
    {
        return $this->oldPrice;
    }
}
