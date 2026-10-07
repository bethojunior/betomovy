<?php

namespace app\model;

use app\dao\StationTypeDao;
use app\utils\BaseModel;
use app\utils\Email;
use app\utils\FormatValue;
use app\utils\PhoneMessage;
use app\utils\Photo;
use Exception;

/**
 * Created by PhpStorm.
 * User: EASSESSO
 * Date: 10/07/2018
 * Time: 13:27
 */
class Establishment extends BaseModel
{
    const PHOTOS_DIR = 'establishment/';

    const SUBJECT_EMAIL_INDICATION = "TaxiReturn - Está aqui a lista das melhores pousadas para você";

    const DISPONIVEL = 1;
    const ATIVO = 1;

    const RECHARGE_MIN = 100;

    protected $idEstablishment;
    protected $fantasyName;
    protected $socialName;
    protected $document;
    protected $address;
    protected $number;
    protected $zipcode;
    protected $neighborhood;
    protected $cityId;
    protected $estateId;
    protected $rating;
    protected $minDailyRate;
    protected $maxDailyRate;
    protected $averageValue;
    protected $commercialEmail;
    protected $administratorEmail;
    protected $commercialPhone;
    protected $administratorPhone;
    protected $photos;
    protected $bankAccountId;
    protected $statusId;
    protected $created_at;
    protected $updated_at;
    protected $establishmentStatus;
    protected $latitude;
    protected $longitude;
    protected $balanceId;
    protected $indicationDiscount;
    protected $indicationDiscountType;

    public function __construct($obj = null)
    {
        $this->created_at = $obj->created_at ?? now();
        $this->updated_at = $obj->updated_at ?? now();
        parent::__construct($obj);
    }

    public function getSeparatedStations($stations)
    {
        foreach ((new StationTypeDao)->sqlSelect()->get() as $stationType) {

            foreach ($stations as $station) {
                if ($station->stationTypeId == $stationType->idStationType)
                    $stationsArray[] = $station;
            }

            $response[] = [
                'idStationType' => $stationType->idStationType,
                'stationTypeName' => $stationType->name,
                'data' => $stationsArray ?? []
            ];

            $stationsArray = [];
        }

        return $response ?? [];
    }

    public function sendPromotionSms($number, $message, int $cityId = null)
    {
        $phoneMessage = new PhoneMessage(FormatValue::formatPhoneClear($number), $message, null, $cityId);
        $result = $phoneMessage->send();
        return $result['sms'] ?? $result['sms']->status ?? null;
    }

    public function sendPromotionEmail($email, $message)
    {
        return Email::sendMail($email, self::SUBJECT_EMAIL_INDICATION, self::SUBJECT_EMAIL_INDICATION, $message);
    }

    /**
     * @return mixed
     */
    public function getBalanceId()
    {
        return $this->balanceId;
    }

    /**
     * @param mixed $balanceId
     */
    public function setBalanceId($balanceId)
    {
        $this->balanceId = $balanceId;
    }

    /**
     * @param bool $returnString
     * @return mixed
     */
    public function getPhotos($returnString = true)
    {
        return $returnString ? $this->photos : explode(',', $this->photos);
    }

    /**
     * @param $photos
     * @throws Exception
     */
    public function setPhotos($photos)
    {
        $photoObj = new Photo;

        $this->photos = implode(',', $photoObj->saveMany($photos, self::PHOTOS_DIR));
    }

    /**
     * @return mixed
     */
    public function getBankAccountId()
    {
        return $this->bankAccountId;
    }

    /**
     * @param mixed $bankAccountId
     */
    public function setBankAccountId($bankAccountId)
    {
        $this->bankAccountId = $bankAccountId;
    }

    /**
     * @return mixed
     */
    public function getIdEstablishment()
    {
        return $this->idEstablishment;
    }

    /**
     * @param mixed $idEstablishment
     */
    public function setIdEstablishment($idEstablishment)
    {
        $this->idEstablishment = $idEstablishment;
    }

    /**
     * @return mixed
     */
    public function getFantasyName()
    {
        return $this->fantasyName;
    }

    /**
     * @param mixed $fantasyName
     */
    public function setFantasyName($fantasyName)
    {
        $this->fantasyName = $fantasyName;
    }

    /**
     * @return mixed
     */
    public function getSocialName()
    {
        return $this->socialName;
    }

    /**
     * @param mixed $socialName
     */
    public function setSocialName($socialName)
    {
        $this->socialName = $socialName;
    }

    /**
     * @return mixed
     */
    public function getDocument()
    {
        return $this->document;
    }

    /**
     * @param mixed $document
     */
    public function setDocument($document)
    {
        $this->document = $document;
    }

    /**
     * @return mixed
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param mixed $address
     */
    public function setAddress($address)
    {
        $this->address = $address;
    }

    /**
     * @return mixed
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @param mixed $number
     */
    public function setNumber($number)
    {
        $this->number = $number;
    }

    /**
     * @return mixed
     */
    public function getZipcode()
    {
        return $this->zipcode;
    }

    /**
     * @param mixed $zipcode
     */
    public function setZipcode($zipcode)
    {
        $this->zipcode = $zipcode;
    }

    /**
     * @return mixed
     */
    public function getNeighborhood()
    {
        return $this->neighborhood;
    }

    /**
     * @param mixed $neighborhood
     */
    public function setNeighborhood($neighborhood)
    {
        $this->neighborhood = $neighborhood;
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
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
    }

    /**
     * @return mixed
     */
    public function getEstateId()
    {
        return $this->estateId;
    }

    /**
     * @param mixed $estateId
     */
    public function setEstateId($estateId)
    {
        $this->estateId = $estateId;
    }

    /**
     * @return mixed
     */
    public function getRating()
    {
        return $this->rating;
    }

    /**
     * @param mixed $rating
     */
    public function setRating($rating)
    {
        $this->rating = $rating;
    }

    /**
     * @return mixed
     */
    public function getMinDailyRate()
    {
        return $this->minDailyRate;
    }

    /**
     * @param mixed $minDailyRate
     */
    public function setMinDailyRate($minDailyRate)
    {
        $this->minDailyRate = $minDailyRate;
    }

    /**
     * @return mixed
     */
    public function getMaxDailyRate()
    {
        return $this->maxDailyRate;
    }

    /**
     * @param mixed $maxDailyRate
     */
    public function setMaxDailyRate($maxDailyRate)
    {
        $this->maxDailyRate = $maxDailyRate;
    }

    /**
     * @return mixed
     */
    public function getAverageValue()
    {
        return $this->averageValue;
    }

    /**
     * @param mixed $averageValue
     */
    public function setAverageValue($averageValue)
    {
        $this->averageValue = $averageValue;
    }

    /**
     * @return mixed
     */
    public function getCommercialEmail()
    {
        return $this->commercialEmail;
    }

    /**
     * @param mixed $commercialEmail
     */
    public function setCommercialEmail($commercialEmail)
    {
        $this->commercialEmail = $commercialEmail;
    }

    /**
     * @return mixed
     */
    public function getAdministratorEmail()
    {
        return $this->administratorEmail;
    }

    /**
     * @param mixed $administratorEmail
     */
    public function setAdministratorEmail($administratorEmail)
    {
        $this->administratorEmail = $administratorEmail;
    }

    /**
     * @return mixed
     */
    public function getCommercialPhone()
    {
        return $this->commercialPhone;
    }

    /**
     * @param mixed $commercialPhone
     */
    public function setCommercialPhone($commercialPhone)
    {
        $this->commercialPhone = $commercialPhone;
    }

    /**
     * @return mixed
     */
    public function getAdministratorPhone()
    {
        return $this->administratorPhone;
    }

    /**
     * @param mixed $administratorPhone
     */
    public function setAdministratorPhone($administratorPhone)
    {
        $this->administratorPhone = $administratorPhone;
    }

    /**
     * @return mixed
     */
    public function getStatusId()
    {
        return $this->statusId;
    }

    /**
     * @param mixed $statusId
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
    }

    /**
     * @return mixed
     */
    public function getCreatedat()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     */
    public function setCreatedat($created_at)
    {
        $this->created_at = $created_at;
    }

    /**
     * @return mixed
     */
    public function getUpdatedat()
    {
        return $this->updated_at;
    }

    /**
     * @param mixed $updated_at
     */
    public function setUpdatedat($updated_at)
    {
        $this->updated_at = $updated_at;
    }

    /**
     * @return mixed
     */
    public function getEstablishmentStatus()
    {
        return $this->establishmentStatus;
    }

    /**
     * @param mixed $establishmentStatus
     */
    public function setEstablishmentStatus($establishmentStatus)
    {
        $this->establishmentStatus = $establishmentStatus;
    }

    /**
     * @return mixed
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * @param mixed $latitude
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;
    }

    /**
     * @return mixed
     */
    public function getLongitude()
    {
        return $this->longitude;
    }

    /**
     * @param mixed $longitude
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
    }

    /**
     * @return mixed
     */
    public function getIndicationDiscount()
    {
        return $this->indicationDiscount;
    }

    /**
     * @param mixed $indicationDiscount
     */
    public function setIndicationDiscount($indicationDiscount): void
    {
        $this->indicationDiscount = $indicationDiscount;
    }

    /**
     * @return mixed
     */
    public function getIndicationDiscountType()
    {
        return $this->indicationDiscountType;
    }

    /**
     * @param mixed $indicationDiscountType
     */
    public function setIndicationDiscountType($indicationDiscountType): void
    {
        $this->indicationDiscountType = $indicationDiscountType;
    }

}