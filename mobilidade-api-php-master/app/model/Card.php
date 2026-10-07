<?php

namespace app\model;

use app\exceptions\CardException;
use app\utils\BaseModel;
use Exception;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:16
 */
class Card extends BaseModel
{
    protected $idCard;
    protected $alias;
    protected $number;
    protected $expirationDate;
    protected $expirationMonth;
    protected $expirationYear;
    protected $cardholderName;
    protected $holderDocument;
    protected $cvv;
    protected $cardTypeId;
    protected $cardFlagId;
    protected $establishmentId;
    protected $userId;
    protected $statusId;
    protected $created_at;
    protected $mpCardInfoId;
    protected $cardInfoId;
    protected $birthDate;

    public function __construct($obj = null)
    {
        $this->created_at = now();
        parent::__construct($obj);
    }

    /**
     * @return mixed
     */
    public function getIdCard()
    {
        return $this->idCard;
    }

    /**
     * @param mixed $idCard
     * @return Card
     */
    public function setIdCard($idCard)
    {
        $this->idCard = $idCard;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAlias()
    {
        return $this->alias;
    }

    /**
     * @param mixed $alias
     * @return Card
     */
    public function setAlias($alias)
    {
        $this->alias = $alias;
        return $this;
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
     * @return Card
     */
    public function setNumber($number)
    {
        $this->number = str_replace(" ", "", $number);
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExpirationDate()
    {
        return $this->expirationDate;
    }

    /**
     * @param mixed $expirationDate
     * @return Card
     */
    public function setExpirationDate($expirationDate)
    {
        $this->expirationDate = $expirationDate;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExpirationMonth()
    {
        return $this->expirationMonth;
    }

    /**
     * @param mixed $expirationMonth
     * @return Card
     */
    public function setExpirationMonth($expirationMonth)
    {
        $this->expirationMonth = $expirationMonth;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getExpirationYear()
    {
        return $this->expirationYear;
    }

    /**
     * @param mixed $expirationYear
     * @return Card
     */
    public function setExpirationYear($expirationYear)
    {
        $this->expirationYear = $expirationYear;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCardholderName()
    {
        return $this->cardholderName;
    }

    /**
     * @param mixed $cardholderName
     * @return Card
     */
    public function setCardholderName($cardholderName)
    {
        $this->cardholderName = $cardholderName;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getHolderDocument()
    {
        return $this->holderDocument;
    }

    /**
     * @param mixed $holderDocument
     * @return Card
     */
    public function setHolderDocument($holderDocument)
    {
        $this->holderDocument = $holderDocument;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCvv()
    {
        return $this->cvv;
    }

    /**
     * @param mixed $cvv
     * @return Card
     */
    public function setCvv($cvv)
    {
        $this->cvv = $cvv;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCardTypeId()
    {
        return $this->cardTypeId;
    }

    /**
     * @param mixed $cardTypeId
     * @return Card
     */
    public function setCardTypeId($cardTypeId)
    {
        $this->cardTypeId = $cardTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCardFlagId()
    {
        return $this->cardFlagId;
    }

    /**
     * @param mixed $cardFlagId
     * @return Card
     */
    public function setCardFlagId($cardFlagId)
    {
        $this->cardFlagId = $cardFlagId;
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
     * @return Card
     */
    public function setEstablishmentId($establishmentId)
    {
        $this->establishmentId = $establishmentId;
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
     * @return Card
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
        return $this;
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
     * @return Card
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMpCardInfoId()
    {
        return $this->mpCardInfoId;
    }

    /**
     * @return mixed
     */
    public function getCardInfoId()
    {
        return $this->cardInfoId;
    }

    /**
     * @param mixed $mpCardInfoId
     * @return Card
     */
    public function setMpCardInfoId($mpCardInfoId)
    {
        $this->mpCardInfoId = $mpCardInfoId;
        return $this;
    }

     /**
     * @param mixed $cardInfoId
     * @return Card
     */
    public function setCardInfoId($cardInfoId)
    {
        $this->cardInfoId = $cardInfoId;
        return $this;
    }

    /**
     * @param $birthDate
     * @return Card
     */
    public function setBirthDate($birthDate)
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    /**
     * @return $this
     * @throws Exception
     */
    public function encode()
    {
        if (!$this->userId)
            throw new CardException(900);

        $keyToEncode = stringTo32((string)$this->userId);

        $values = array_filter(get_object_vars($this));
        $this->ignoreEncryption($values);

        foreach ($values as $key => $value) {
            $this->$key = safeEncrypt((string)$value, $keyToEncode);
        }

        return $this;
    }

    /**
     * @return $this
     * @throws CardException
     * @throws Exception
     */
    public function decode()
    {
        if (!$this->userId)
            throw new CardException(900);

        $keyToDecode = stringTo32((string)$this->userId);

        $values = array_filter(get_object_vars($this));
        $this->ignoreEncryption($values);

        foreach ($values as $key => $value) {
            $this->$key = safeDecrypt($value, $keyToDecode);
        }

        return $this;
    }

    private function ignoreEncryption(array &$fields)
    {
        unset($fields['userId']);
        unset($fields['mpCardInfoId']);
        unset($fields['cardInfoId']);
        unset($fields['alias']);
        unset($fields['idCard']);
        unset($fields['created_at']);
        unset($fields['cardFlagId']);
        unset($fields['cardTypeId']);
        unset($fields['statusId']);
    }
}