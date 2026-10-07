<?php

namespace app\services;

use app\constant\CustomerBalanceConst;
use app\constant\DriverBalanceConst;
use app\dao\BalanceFlowDao;
use app\dao\CustomerDao;
use app\dao\DriverBalanceDao;
use app\dao\ReferralMonetizationDao;
use app\dao\UserIndicationDao;
use app\model\Driver;
use Exception;
use app\model\ReferralMonetization;
use app\model\Trip;
use app\model\TripAudit;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/09/2019
 * Time: 17:41
 */
class DriverReferralMonetizationService
{
    private $dao;
    private $userIndicationDao;
    private $balanceDao;
    private $balanceFlowDao;
    private $customerDao;

    public function __construct()
    {
        $this->dao = new ReferralMonetizationDao;
        $this->userIndicationDao = new UserIndicationDao;
        $this->balanceDao = new DriverBalanceDao;
        $this->balanceFlowDao = new BalanceFlowDao;
        $this->customerDao = new CustomerDao;
    }

    /**
     * @param \app\model\\app\model\Driver $driver
     * @param \app\model\Trip $trip
     * @return void
     * @throws Exception
     */
    public function monetizeSponsors(Driver $driver, Trip $trip)
    {
        $this->monetizeDriverSponsor($driver, $trip);
        $this->monetizeCustomerSponsor($trip);
    }

    /**
     * @param \app\model\Trip $trip
     * @return void
     * @throws Exception
     */
    private function monetizeCustomerSponsor(Trip $trip): void
    {
        $sponsor = $this->findSponsor($trip->getUserId());
        $getCustomerByUserId = $this->customerDao->getCustomerByUserId($trip->getUserId());

        if (!$sponsor || !$getCustomerByUserId || empty($getCustomerByUserId)) {
            return;
        }

        $referralMonetization = $this
            ->findReferralMonetizationByUser($sponsor->idUser, $trip->getTripTypeId(), $trip->getCityId());

        if (!$referralMonetization) {
            return;
        }

        $this->paySponsor($sponsor->balanceId, $referralMonetization, $trip, (bool)$sponsor->isDriver);
    }

    /**
     * @param \app\model\Driver $driver
     * @param \app\model\Trip $trip
     * @return void
     * @throws Exception
     */
    private function monetizeDriverSponsor(Driver $driver, Trip $trip): void
    {
        $sponsor = $this->findSponsor($driver->getUserId());

        if (!$sponsor) {
            return;
        }

        $referralMonetization = $this
            ->findReferralMonetizationByUser($sponsor->idUser, $trip->getTripTypeId(), $trip->getCityId());

        if (!$referralMonetization) {
            return;
        }

        $this->paySponsor($sponsor->balanceId, $referralMonetization, $trip, (bool)$sponsor->isDriver);
    }

    /**
     * @param $userIndicatedId
     * @return null|mixed
     */
    private function findSponsor($userIndicatedId)
    {
        $sponsor = $this->userIndicationDao
            ->findWhoIndicated($userIndicatedId);

        if (!$sponsor)
            return null;

        return $sponsor;
    }

    /**
     * @param $userId
     * @param $tripCityId
     * @param $tripTypeId
     * @return null|ReferralMonetization
     */
    private function findReferralMonetizationByUser($userId, $tripTypeId, $tripCityId): ?ReferralMonetization
    {
        $referralMonetization = $this->dao
            ->findTripMonetization($userId, $tripTypeId, $tripCityId);

        if (!$referralMonetization)
            return null;

        return new ReferralMonetization($referralMonetization);
    }

    /**
     * @param $balanceId
     * @param ReferralMonetization $referralMonetization
     * @param \app\model\Trip $trip
     * @param bool $sponsorIsADriver
     * @return void
     * @throws Exception
     */
    private function paySponsor(
        $balanceId,
        ReferralMonetization $referralMonetization,
        Trip $trip,
        bool $sponsorIsADriver
    ): void
    {
        $property = "balance";
        $type = DriverBalanceConst::BONUS_MONETIZATION;

        if ($trip->getTripAuditId() != TripAudit::RELEASED) {
            $property = "blockedBalance";
            $type = DriverBalanceConst::BONUS_MONETIZATION_BLOCKED;
        }

        if ($referralMonetization->getBackToTripBalance() && !$sponsorIsADriver) {
            $property = "tripBalance";
            $type = CustomerBalanceConst::VOUCHER_BONUS_MONETIZATION;
        }

        $valueMonetization = $referralMonetization->getValueType() == '$' ?
            $referralMonetization->getValue() :
            (($referralMonetization->getValue() / 100) * $trip->getPrice());

        $this->balanceDao->add($balanceId, (float)$valueMonetization, $property);

        $this->balanceFlowDao->insert(
            $valueMonetization,
            $type,
            $balanceId,
            $trip->getTripReference());
    }
}