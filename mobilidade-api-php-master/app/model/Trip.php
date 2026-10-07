<?php

namespace app\model;

use app\utils\BaseModel;
use app\utils\UUID;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 23/07/2018
 * Time: 17:26
 */
class Trip extends BaseModel
{
    const SEARCHING = "searching";
    const SEARCHING_FAVORITE = "searching_favorite";
    const ACCEPTED = "accepted";
    const PRE_ACCEPTED = "pre_accepted";
    const BOARDING = "boarding";
    const IN_PROGRESS = "in_progress";
    const FINISHED = "finished";
    const CANCELED = "canceled";
    const NOT_ANSWERED = "not_answered";
    const BACK_OFF = "back_off";
    const PAYMENT_REFUSED = "payment_refused";
    const SCHEDULED = "scheduled";
    const STAND_BY = "stand_by";
    const GET_BID_BY_DRIVERS = "get_bid_by_drivers";
    const WAITING = "waiting";

    const CANCELED_BY_DRIVER = "driver";
    const CANCELED_BY_ESTABLISHMENT = "establishment";
    const CANCELED_BY_CUSTOMER = "customer";
    const CANCELED_BY_CUSTOMER_PARTNER = "customerPartner";

    public static function getFinalizedStatuses(): array
    {
        return [
            self::CANCELED,
            self::FINISHED,
            self::NOT_ANSWERED,
            self::BACK_OFF,
            self::PAYMENT_REFUSED,
            self::SCHEDULED
        ];
    }

    protected $idTrip;
    protected $tripReference;
    protected $status;
    protected $establishmentId;
    protected $stationId;
    protected $driverId;
    protected $userId;
    protected $customerId;
    protected $tripCustomerId;
    protected $estimatedTripTime;
    protected $estimatedTimeDriverArrival;
    protected $price;
    protected $oldPrice;
    protected $date;
    protected $endDate;
    protected $distance;
    protected $cancellationReasonsId;
    protected $canceledBy;
    protected $tripAuditId;
    protected $destinationId;
    protected $originId;
    protected $tripTypeId;
    protected $tripPaymentFormId;
    protected $favoriteDrivers;
    protected $cityId;
    protected $zoneId;
    protected $driverCommissionId;
    protected $partnerCommissionId;
    protected $rewardTripId;
    protected $tripCallTypeId;
    protected $priceId;
    protected $priceRangeId;
    protected $multiplierDynamic;
    protected $scheduleCorporateRouteId;
    protected $description;
    protected $haveReturn;
    protected $oldDestinationId;
    protected $isOffer;


    public function __construct($obj = null)
    {
        $this->tripReference = $obj->tripReference ?? UUID::v4();

        $this->date = $obj->date ?? now();
        parent::__construct($obj);
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
     * @return Trip
     */
    public function setIdTrip($idTrip)
    {
        $this->idTrip = $idTrip;
        return $this;
    }

    /**
     * @return string
     */
    public function getTripReference(): string
    {
        return $this->tripReference;
    }

    /**
     * @param string $tripReference
     * @return Trip
     */
    public function setTripReference(string $tripReference): Trip
    {
        $this->tripReference = $tripReference;
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
     * @return Trip
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEstablishmentId()
    {
        return $this->establishmentId;
    }

    /**
     * @param mixed $establishmentId
     * @return Trip
     */
    public function setEstablishmentId($establishmentId)
    {
        $this->establishmentId = $establishmentId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getStationId()
    {
        return $this->stationId;
    }

    /**
     * @param mixed $stationId
     * @return Trip
     */
    public function setStationId($stationId)
    {
        $this->stationId = $stationId;
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
     * @return Trip
     */
    public function setDriverId($driverId)
    {
        $this->driverId = $driverId;
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
     * @return Trip
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * @param mixed $customerId
     * @return Trip
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripCustomerId()
    {
        return $this->tripCustomerId;
    }

    /**
     * @param mixed $tripCustomerId
     * @return Trip
     */
    public function setTripCustomerId($tripCustomerId)
    {
        $this->tripCustomerId = $tripCustomerId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEstimatedTripTime()
    {
        return $this->estimatedTripTime;
    }

    /**
     * @param mixed $estimatedTripTime
     * @return Trip
     */
    public function setEstimatedTripTime($estimatedTripTime)
    {
        $this->estimatedTripTime = $estimatedTripTime;
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
     * @return Trip
     */
    public function setEstimatedTimeDriverArrival($estimatedTimeDriverArrival)
    {
        $this->estimatedTimeDriverArrival = $estimatedTimeDriverArrival;
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
     * @return Trip
     */
    public function setPrice($price)
    {
        $this->price = $price;
        return $this;
    }

    /**
     * @return false|string
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param false|string $date
     * @return Trip
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    /**
     * @param mixed $endDate
     * @return Trip
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDistance()
    {
        return $this->distance;
    }

    /**
     * @param mixed $distance
     * @return Trip
     */
    public function setDistance($distance)
    {
        $this->distance = $distance;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCancellationReasonsId()
    {
        return $this->cancellationReasonsId;
    }

    /**
     * @param mixed $cancellationReasonsId
     * @return Trip
     */
    public function setCancellationReasonsId($cancellationReasonsId)
    {
        $this->cancellationReasonsId = $cancellationReasonsId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCanceledBy()
    {
        return $this->canceledBy;
    }

    /**
     * @param mixed $canceledBy
     * @return Trip
     */
    public function setCanceledBy($canceledBy)
    {
        $this->canceledBy = $canceledBy;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripAuditId()
    {
        return $this->tripAuditId;
    }

    /**
     * @param mixed $tripAuditId
     * @return Trip
     */
    public function setTripAuditId($tripAuditId)
    {
        $this->tripAuditId = $tripAuditId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDestinationId()
    {
        return $this->destinationId;
    }

    /**
     * @param mixed $destinationId
     * @return Trip
     */
    public function setDestinationId($destinationId)
    {
        $this->destinationId = $destinationId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOriginId()
    {
        return $this->originId;
    }

    /**
     * @param mixed $originId
     * @return Trip
     */
    public function setOriginId($originId)
    {
        $this->originId = $originId;
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
     * @return Trip
     */
    public function setTripTypeId($tripTypeId)
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTripPaymentFormId()
    {
        return $this->tripPaymentFormId;
    }

    /**
     * @param mixed $tripPaymentFormId
     * @return Trip
     */
    public function setTripPaymentFormId($tripPaymentFormId)
    {
        $this->tripPaymentFormId = $tripPaymentFormId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFavoriteDrivers()
    {
        return $this->favoriteDrivers;
    }

    /**
     * @param mixed $favoriteDrivers
     * @return Trip
     */
    public function setFavoriteDrivers($favoriteDrivers)
    {
        $this->favoriteDrivers = $favoriteDrivers;
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
     * @return Trip
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getZoneId()
    {
        return $this->zoneId;
    }

    /**
     * @param mixed $zoneId
     * @return Trip
     */
    public function setZoneId($zoneId)
    {
        $this->zoneId = $zoneId;
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
     * @return Trip
     */
    public function setDriverCommissionId($driverCommissionId)
    {
        $this->driverCommissionId = $driverCommissionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPartnerCommissionId()
    {
        return $this->partnerCommissionId;
    }

    /**
     * @param mixed $partnerCommissionId
     * @return Trip
     */
    public function setPartnerCommissionId($partnerCommissionId)
    {
        $this->partnerCommissionId = $partnerCommissionId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRewardTripId()
    {
        return $this->rewardTripId;
    }

    /**
     * @param mixed $rewardTripId
     * @return Trip
     */
    public function setRewardTripId($rewardTripId)
    {
        $this->rewardTripId = $rewardTripId;
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
     * @return Trip
     */
    public function setTripCallTypeId($tripCallTypeId)
    {
        $this->tripCallTypeId = $tripCallTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPriceId()
    {
        return $this->priceId;
    }

    /**
     * @param mixed $priceId
     * @return Trip
     */
    public function setPriceId($priceId)
    {
        $this->priceId = $priceId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPriceRangeId()
    {
        return $this->priceRangeId;
    }

    /**
     * @param mixed $priceRangeId
     * @return Trip
     */
    public function setPriceRangeId($priceRangeId)
    {
        $this->priceRangeId = $priceRangeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMultiplierDynamic()
    {
        return $this->multiplierDynamic;
    }

    /**
     * @param mixed $multiplierDynamic
     * @return Trip
     */
    public function setMultiplierDynamic($multiplierDynamic)
    {
        $this->multiplierDynamic = $multiplierDynamic;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getScheduleCorporateRouteId()
    {
        return $this->scheduleCorporateRouteId;
    }

    /**
     * @param mixed $scheduleCorporateRouteId
     * @return Trip
     */
    public function setScheduleCorporateRouteId($scheduleCorporateRouteId)
    {
        $this->scheduleCorporateRouteId = $scheduleCorporateRouteId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     * @return Trip
     */
    public function setDescription($description)
    {
        $this->description = $description;
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
     * @return Trip
     */
    public function setIsOffer($isOffer)
    {
        $this->isOffer = $isOffer;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOldPrice()
    {
        return $this->oldPrice;
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
    
}