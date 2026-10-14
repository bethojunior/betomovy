<?php

namespace app\model;

use app\constant\TripTypeConst;
use app\utils\BaseModel;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 11/09/2018
 * Time: 14:45
 */
class Price extends BaseModel
{
    const PRICE_DEFAULT = 1;

    protected $id;
    protected $min_price;
    protected $base_price;
    protected $km_price;
    protected $minute_price;
    protected $code;
    protected $name;
    protected $description;
    protected $cityId;
    protected $tripTypeId;
    protected $tax_price;
    protected $tax_price_type;
    protected $tax_price_description;
    protected $another_fee;
    protected $another_fee_type;
    protected $another_fee_description;
    protected $waypoint_price;
    protected $tag;
    protected $color;
    protected $statusId;
    protected $long_distance_per_km;
    protected $long_distance_radius;
    protected $long_distance_value_to_final_price;
    protected $long_distance_delivery_price;
    protected $reward_driver_min_price;
    protected $promotional_price_temp;
    protected $km_to_additional_value;
    protected $additional_value_after_km;
    protected $type_additional_value_after_km;
    protected $multiplierValue;
    protected $dynamicTag;
    protected $onlyCentral;
    protected $idealListCommonPrice;
    protected $comparisionPrice;
    protected $subtractionCompetitivePrice;
    protected $picture;
    protected $deliveryOption;
    protected $freightOption;
    protected $waiting_tolerance_seconds;
    protected $waiting_extra_fee_per_minute;
    protected $waiting_penalty_fee;
    protected $order;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     * @return Price
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMinPrice()
    {
        return $this->min_price;
    }

    /**
     * @param mixed $min_price
     * @return Price
     */
    public function setMinPrice($min_price)
    {
        $this->min_price = $min_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBasePrice()
    {
        return $this->base_price;
    }

    /**
     * @param mixed $base_price
     * @return Price
     */
    public function setBasePrice($base_price)
    {
        $this->base_price = $base_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getKmPrice()
    {
        return $this->km_price;
    }

    /**
     * @param mixed $km_price
     * @return Price
     */
    public function setKmPrice($km_price)
    {
        $this->km_price = $km_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMinutePrice()
    {
        return $this->minute_price;
    }

    /**
     * @param mixed $minute_price
     * @return Price
     */
    public function setMinutePrice($minute_price)
    {
        $this->minute_price = $minute_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * @param mixed $code
     * @return Price
     */
    public function setCode($code)
    {
        $this->code = $code;
        return $this;
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
     * @return Price
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return Price
     */
    public function setDescription($description)
    {
        $this->description = $description;
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
     * @return Price
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
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
     * @return Price
     */
    public function setTripTypeId($tripTypeId)
    {
        $this->tripTypeId = $tripTypeId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTaxPrice()
    {
        return $this->tax_price;
    }

    /**
     * @param mixed $tax_price
     * @return Price
     */
    public function setTaxPrice($tax_price)
    {
        $this->tax_price = $tax_price;
        return $this;
    }

    public function getTaxPriceType(): ?string
    {
        return $this->tax_price_type;
    }

    public function setTaxPriceType(?string $tax_price_type): Price
    {
        $this->tax_price_type = $tax_price_type;
        return $this;
    }

    public function getTaxPriceDescription(): ?string
    {
        return $this->tax_price_description;
    }

    public function setTaxPriceDescription(?string $tax_price_description): Price
    {
        $this->tax_price_description = $tax_price_description;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAnotherFee()
    {
        return $this->another_fee;
    }

    /**
     * @param mixed $another_fee
     * @return Price
     */
    public function setAnotherFee($another_fee)
    {
        $this->another_fee = $another_fee;
        return $this;
    }

    public function getAnotherFeeType(): ?string
    {
        return $this->another_fee_type;
    }

    public function setAnotherFeeType(?string $another_fee_type): Price
    {
        $this->another_fee_type = $another_fee_type;
        return $this;
    }

    public function getAnotherFeeDescription(): ?string
    {
        return $this->another_fee_description;
    }

    public function setAnotherFeeDescription(?string $another_fee_description): Price
    {
        $this->another_fee_description = $another_fee_description;
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
     * @return Price
     */
    public function setStatusId($statusId)
    {
        $this->statusId = $statusId;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getWaypointPrice()
    {
        return $this->waypoint_price;
    }

    /**
     * @param mixed $waypoint_price
     * @return Price
     */
    public function setWaypointPrice($waypoint_price)
    {
        $this->waypoint_price = $waypoint_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTag()
    {
        return $this->tag;
    }

    /**
     * @param mixed $tag
     * @return Price
     */
    public function setTag($tag)
    {
        $this->tag = $tag;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * @param mixed $color
     * @return Price
     */
    public function setColor($color)
    {
        $this->color = $color;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongDistancePerKm()
    {
        return $this->long_distance_per_km;
    }

    /**
     * @param mixed $long_distance_per_km
     * @return Price
     */
    public function setLongDistancePerKm($long_distance_per_km)
    {
        $this->long_distance_per_km = $long_distance_per_km;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongDistanceRadius()
    {
        return $this->long_distance_radius;
    }

    /**
     * @param mixed $long_distance_radius
     * @return Price
     */
    public function setLongDistanceRadius($long_distance_radius)
    {
        $this->long_distance_radius = $long_distance_radius;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongDistanceValueToFinalPrice()
    {
        return $this->long_distance_value_to_final_price;
    }

    /**
     * @param mixed $long_distance_value_to_final_price
     * @return Price
     */
    public function setLongDistanceValueToFinalPrice($long_distance_value_to_final_price)
    {
        $this->long_distance_value_to_final_price = $long_distance_value_to_final_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLongDistanceDeliveryPrice()
    {
        return $this->long_distance_delivery_price;
    }

    /**
     * @param mixed $long_distance_delivery_price
     * @return Price
     */
    public function setLongDistanceDeliveryPrice($long_distance_delivery_price)
    {
        $this->long_distance_delivery_price = $long_distance_delivery_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRewardDriverMinPrice()
    {
        return $this->reward_driver_min_price;
    }

    /**
     * @param mixed $reward_driver_min_price
     * @return Price
     */
    public function setRewardDriverMinPrice($reward_driver_min_price)
    {
        $this->reward_driver_min_price = $reward_driver_min_price;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPromotionalPriceTemp()
    {
        return $this->promotional_price_temp;
    }

    /**
     * @param mixed $promotional_price_temp
     * @return Price
     */
    public function setPromotionalPriceTemp($promotional_price_temp)
    {
        $this->promotional_price_temp = $promotional_price_temp;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getKmToAdditionalValue()
    {
        return $this->km_to_additional_value;
    }

    /**
     * @param mixed $km_to_additional_value
     * @return Price
     */
    public function setKmToAdditionalValue($km_to_additional_value)
    {
        $this->km_to_additional_value = $km_to_additional_value;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getAdditionalValueAfterKm()
    {
        return $this->additional_value_after_km;
    }

    /**
     * @param mixed $additional_value_after_km
     * @return Price
     */
    public function setAdditionalValueAfterKm($additional_value_after_km)
    {
        $this->additional_value_after_km = $additional_value_after_km;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getTypeAdditionalValueAfterKm()
    {
        return $this->type_additional_value_after_km;
    }

    /**
     * @param mixed $type_additional_value_after_km
     * @return Price
     */
    public function setTypeAdditionalValueAfterKm($type_additional_value_after_km)
    {
        $this->type_additional_value_after_km = $type_additional_value_after_km;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getMultiplierValue()
    {
        return $this->multiplierValue;
    }

    /**
     * @param mixed $multiplierValue
     * @return Price
     */
    public function setMultiplierValue($multiplierValue)
    {
        $this->multiplierValue = $multiplierValue;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDynamicTag()
    {
        return $this->dynamicTag;
    }

    /**
     * @param mixed $dynamicTag
     * @return Price
     */
    public function setDynamicTag($dynamicTag)
    {
        $this->dynamicTag = $dynamicTag;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getIdealListCommonPrice()
    {
        return $this->idealListCommonPrice;
    }

    /**
     * @param mixed $idealListCommonPrice
     * @return Price
     */
    public function setIdealListCommonPrice($idealListCommonPrice)
    {
        $this->idealListCommonPrice = $idealListCommonPrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getComparisionPrice()
    {
        return $this->comparisionPrice;
    }

    /**
     * @param mixed $comparisionPrice
     * @return Price
     */
    public function setComparisionPrice($comparisionPrice)
    {
        $this->comparisionPrice = $comparisionPrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getSubtractionCompetitivePrice()
    {
        return $this->subtractionCompetitivePrice;
    }

    /**
     * @param mixed $subtractionCompetitivePrice
     * @return Price
     */
    public function setSubtractionCompetitivePrice($subtractionCompetitivePrice)
    {
        $this->subtractionCompetitivePrice = $subtractionCompetitivePrice;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getPicture()
    {
        if ($this->picture) {
            if (strpos($this->picture, 'http://') === 0 || strpos($this->picture, 'https://') === 0) {
                return $this->picture;
            }
            $storage = '';
            try {
                $storage = \app\model\Config::get('link_storage_pictures');
            } catch (\Throwable $t) {}

            if (empty($storage)) {
                $storage = 'https://minio.704app.com.br/rota101fb704/';
            }
            return rtrim($storage, '/') . '/tripType/' . ltrim($this->picture, '/');
        }

        return $this->picture;
    }

    /**
     * @param mixed $picture
     * @return Price
     */
    public function setPicture($picture)
    {
        $this->picture = $picture;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDeliveryOption()
    {
        return $this->deliveryOption;
    }

    /**
     * @param mixed $deliveryOption
     * @return Price
     */
    public function setDeliveryOption($deliveryOption)
    {
        $this->deliveryOption = $deliveryOption;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOnlyCentral()
    {
        return $this->onlyCentral;
    }

    /**
     * @param mixed $onlyCentral
     * @return Price
     */
    public function setOnlyCentral($onlyCentral)
    {
        $this->onlyCentral = $onlyCentral;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getFreightOption()
    {
        return $this->freightOption;
    }

    /**
     * @param mixed $freightOption
     * @return Price
     */
    public function setFreightOption($freightOption)
    {
        $this->freightOption = $freightOption;
        return $this;
    }

        /**
     * @return mixed
     */
    public function getWaitingToleranceSeconds()
    {
        return $this->waiting_tolerance_seconds;
    }

    /**
     * @param mixed $waiting_tolerance_seconds
     * @return Price
     */
    public function setWaitingToleranceSeconds($waiting_tolerance_seconds)
    {
        $this->waiting_tolerance_seconds = $waiting_tolerance_seconds;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getWaitingExtraFeePerMinute()
    {
        return $this->waiting_extra_fee_per_minute;
    }

    /**
     * @param mixed $waiting_extra_fee_per_minute
     * @return Price
     */
    public function setWaitingExtraFeePerMinute($waiting_extra_fee_per_minute)
    {
        $this->waiting_extra_fee_per_minute = $waiting_extra_fee_per_minute;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getWaitingPenaltyFee()
    {
        return $this->waiting_penalty_fee;
    }

    /**
     * @param mixed $waiting_penalty_fee
     * @return Price
     */
    public function setWaitingPenaltyFee($waiting_penalty_fee)
    {
        $this->waiting_penalty_fee = $waiting_penalty_fee;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * @param mixed $order
     * @return Price
     */
    public function setOrder($order)
    {
        $this->order = $order;
        return $this;
    }

}