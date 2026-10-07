<?php
/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 23/08/2018
 * Time: 17:49
 */

class WebPagueCard
{
    private $number;
    private $expirationDate;
    private $cardholderName;
    private $cvv;
    private $cardTypeId;
    private $cardFlagId;

    /**
     * @return mixed
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @param $number
     * @return WebPagueCard
     */
    public function setNumber($number) : WebPagueCard
    {
        $this->number = $number;

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
     * @param $expirationDate
     * @return WebPagueCard
     */
    public function setExpirationDate($expirationDate) : WebPagueCard
    {
        $this->expirationDate = $expirationDate;

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
     * @param $cardholderName
     * @return WebPagueCard
     */
    public function setCardholderName($cardholderName) : WebPagueCard
    {
        $this->cardholderName = $cardholderName;

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
     * @param $cvv
     * @return WebPagueCard
     */
    public function setCvv($cvv) : WebPagueCard
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
     * @param $cardTypeId
     * @return WebPagueCard
     */
    public function setCardTypeId($cardTypeId) : WebPagueCard
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
     * @param $cardFlagId
     * @return WebPagueCard
     */
    public function setCardFlagId($cardFlagId) : WebPagueCard
    {
        $this->cardFlagId = $cardFlagId;

        return $this;
    }

    public function toArray()
    {
        return get_object_vars($this);
    }

}