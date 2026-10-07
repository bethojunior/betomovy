<?php

namespace app\model;

use app\utils\BaseModel;
use Cielo\API30\Ecommerce\CreditCard;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 10/08/2018
 * Time: 18:15
 */
class CardFlag extends BaseModel
{
    const MASTERCARD = 1;
    const VISA = 2;
    const AMERICAN_EXPRESS = 3;
    const ELO = 4;
    const DINERS_CLUB = 5;

    protected $table = "cardFlag";

    protected $idCardFlag;
    protected $name;
    protected $alias;

    /**
     * @return mixed
     */
    public function getIdCardFlag()
    {
        return $this->idCardFlag;
    }

    /**
     * @param mixed $idCardFlag
     */
    public function setIdCardFlag($idCardFlag)
    {
        $this->idCardFlag = $idCardFlag;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return CardFlag
     */
    public function setAlias($alias)
    {
        $this->alias = $alias;
        return $this;
    }

    public static function getCieloBrand($brand)
    {
        switch ($brand) {
            case self::MASTERCARD:
                return CreditCard::MASTERCARD;
            case self::VISA:
                return CreditCard::VISA;
            default:
                return null;
        }
    }
}