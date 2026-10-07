<?php

namespace app\services;

use app\constant\GenderConst;
use app\dao\CityConfigDao;
use app\dao\CityDao;
use app\dao\DiscountCouponDao;
use app\dao\GenderDao;
use app\dao\UserDao;
use app\dao\UserDiscountCouponDao;
use app\exceptions\DiscountCouponException;
use app\exceptions\RequestValidatorException;
use app\model\Config;
use app\model\DiscountCoupon;
use stdClass;
use app\model\UserDiscountCoupon;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 13:17
 */
class UserDiscountCouponService
{
    private $dao;
    private $discountCouponDao;
    private $cityDao;
    private $userDao;
    private $genderDao;

    public function __construct()
    {
        $this->dao = new UserDiscountCouponDao;
        $this->discountCouponDao = new DiscountCouponDao;
        $this->cityDao = new CityDao;
        $this->userDao = new UserDao;
        $this->genderDao = new GenderDao;
    }

    /**
     * @param $request
     * @param $userId
     * @return bool|DiscountCoupon|stdClass
     * @throws RequestValidatorException
     * @throws DiscountCouponException
     */
    public function activate($request, $userId)
    {
        $this->validateActivate($request);

        $coupon = $this->findCoupon($request->code);

        if ($coupon->getCityId())
            $this->validateCity($coupon->getCityId(), $request->lat, $request->lng);

        if ($coupon->getGenderId())
            $this->validateGender($coupon->getGenderId(), $userId);

        $cityConfig = (new CityConfigDao)->getByCity($coupon->getCityId());
        $timezone = $cityConfig->timezone ?? Config::get('application_timezone');

        if (dateIsBefore(now($timezone), $coupon->getDateStart()))
            throw new DiscountCouponException(1707);

        if (dateIsBefore($coupon->getDateEnd(), now($timezone)))
            throw new DiscountCouponException(1702);

        if ((bool)$coupon->getUniqueUse())
            $this->validateUniqueUse($userId, $coupon->getId());

        if ($this->dao->findByUserAndCoupon($userId, $coupon->getId()))
            throw new DiscountCouponException(1706);

        $this->createUserDiscountCoupon($coupon, $userId);

        return $coupon->toStdClass();
    }

    public function findActivatedByUser($userId)
    {
        $coupons = $this->dao
            ->findByUser($userId);

        $currencySymbol = Config::get('application_currency');

        return empty($coupons) ? [] : array_map(function ($coupon) use ($currencySymbol) {
            $coupon->valueType =
                $coupon->valueType == '$' ? 'R$' : $coupon->valueType;

            $coupon->currency = $currencySymbol;
            return $coupon;
        }, $coupons);
    }

    /**
     * @param $request
     * @throws RequestValidatorException
     */
    private function validateActivate($request)
    {
        if (!isset($request->code))
            throw new RequestValidatorException(1102);

        if (!isset($request->lat) || !is_numeric($request->lat))
            throw new RequestValidatorException(1103);

        if (!isset($request->lng) || !is_numeric($request->lng))
            throw new RequestValidatorException(1104);
    }

    /**
     * @param $code
     * @param int|null $promotionId
     * @return DiscountCoupon
     * @throws DiscountCouponException
     */
    private function findCoupon($code, ?int $promotionId = null): DiscountCoupon
    {
        $coupon = $promotionId
            ? $this->discountCouponDao->findByPromotionId($promotionId)
            : $this->discountCouponDao->findByCode($code);

        if (empty($coupon))
            throw new DiscountCouponException(1704, compact('code'));

        return new DiscountCoupon($coupon);
    }

    /**
     * @param $couponCityId
     * @param $lat
     * @param $lng
     * @throws DiscountCouponException
     */
    private function validateCity($couponCityId, $lat, $lng)
    {
        $city = $this->cityDao->findByCoordinate($lat, $lng);

        if (!$city || $city->id != $couponCityId)
            throw new DiscountCouponException(1700);
    }

    /**
     * @param $couponGenderId
     * @param $userId
     * @throws DiscountCouponException
     */
    private function validateGender($couponGenderId, $userId)
    {
        $user = $this->userDao->find($userId);
        $gender = $this->genderDao->find($couponGenderId);

        if ($couponGenderId != GenderConst::ALL_ID && $user->gender != $gender->name)
            throw new DiscountCouponException(1701);
    }

    /**
     * @param $userId
     * @param $discountCouponId
     * @throws DiscountCouponException
     */
    private function validateUniqueUse($userId, $discountCouponId)
    {
        $user = $this->dao
            ->findByUserAndCoupon($userId, $discountCouponId);

        if (!empty($user))
            throw new DiscountCouponException(1703);
    }

    /**
     * @param DiscountCoupon $coupon
     * @param $userId
     * @return UserDiscountCoupon
     */
    private function createUserDiscountCoupon(DiscountCoupon $coupon, $userId): UserDiscountCoupon
    {
        $userDiscountCoupon = new UserDiscountCoupon;
        $userDiscountCoupon
            ->setUserId($userId)
            ->setDiscountCouponId($coupon->getId())
            ->setId(
                $this->dao
                    ->sqlInsert($userDiscountCoupon));

        return $userDiscountCoupon;
    }

    public function insertByPromotion(int $promotionId, int $userId)
    {
        $coupon = $this->findCoupon('', $promotionId);

        $this->createUserDiscountCoupon($coupon, $userId);

        return $coupon->toStdClass();
    }
}