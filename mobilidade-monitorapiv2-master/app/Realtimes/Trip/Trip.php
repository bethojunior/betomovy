<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 19:10
 */

namespace App\Realtimes\Trip;


use App\Contracts\Realtime\CloudFirestoreRealtime;

class Trip extends CloudFirestoreRealtime
{
    protected $collection = 'trips';

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
    protected $estimatedTimeDriverArrival;
    protected $idTrip;
    protected $origin;
    protected $price;
    protected $rewardTrip;
    protected $status;
    protected $tripCallTypeId;
    protected $timeToExpireTrip;
    protected $tripPaymentForm;
    protected $tripReference;
    protected $tripTypeId;
    protected $tripWayPoints;
    protected $centralId;
    protected $userId;

    /**
     * @return mixed
     */
    public function getCallingDriver()
    {
        return $this->callingDriver;
    }

    /**
     * @param mixed $callingDriver
     * @return Trip
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
    public function getColorAudit()
    {
        return $this->colorAudit;
    }

    /**
     * @param mixed $colorAudit
     * @return Trip
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
     * @return Trip
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
     * @return Trip
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
     * @return Trip
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
    public function getDestination()
    {
        return $this->destination;
    }

    /**
     * @param mixed $destination
     * @return Trip
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
     * @return Trip
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
     * @return mixed
     */
    public function getOrigin()
    {
        return $this->origin;
    }

    /**
     * @param mixed $origin
     * @return Trip
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
     * @return Trip
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
     * @return Trip
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
    public function getTimeToExpireTrip()
    {
        return $this->timeToExpireTrip;
    }

    /**
     * @param mixed $timeToExpireTrip
     * @return Trip
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
     * @return Trip
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
     * @return Trip
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
    public function getTripWayPoints()
    {
        return $this->tripWayPoints;
    }

    /**
     * @param mixed $tripWayPoints
     * @return Trip
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
     * @return Trip
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
     * @return Trip
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
    }

    public function mount(\stdClass $trip)
    {
        foreach ($trip as $key => $value) {
            if (property_exists($this, $key))
                $this->$key = $value;
        }

        $this->documentId = $trip->tripReference;

        $this->mountCallingDriver();
        $this->date = new \DateTime($this->date);

        return $this;
    }

    private function mountCallingDriver()
    {
        if ($this->callingDriver)
            $this->callingDriver = explode(',', $this->callingDriver);
    }
}
