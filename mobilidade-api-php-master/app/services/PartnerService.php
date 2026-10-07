<?php

namespace app\services;

use app\constant\PartnerCommissionConst;
use app\dao\BankAccountDao;
use app\dao\PartnerCommissionDao;
use app\dao\PartnerDao;
use app\dao\TripSummaryViewDao;
use app\exceptions\InvalidFieldPlaceException;
use app\exceptions\PartnerException;
use app\utils\Headers;
use app\validator\PartnerValidator;
use Exception;
use app\model\Partner;
use app\model\PartnerCommission;

/**
 * Created by PhpStorm.
 * User: Fabrica704_Acer
 * Date: 07/05/2019
 * Time: 16:40
 */
class PartnerService
{
    private $dao;
    private $validator;
    private $tripSummaryDao;
    private $bankAccountDao;
    private $commissionDao;

    public function __construct()
    {
        $this->validator = new PartnerValidator;
        $this->dao = new PartnerDao;
        $this->tripSummaryDao = new TripSummaryViewDao;
        $this->bankAccountDao = new BankAccountDao;
        $this->commissionDao = new PartnerCommissionDao;
    }

    /**
     * @param $userId
     * @return PartnerDao
     * @throws Exception
     */
    public function findByUser($userId)
    {
        $partner = $this->dao
            ->findByUser(Headers::getUserId() ?? $userId);

        if (!$partner)
            throw new Exception("Parceiro não encontrado");

        $partner->bankAccount = $this->bankAccountDao
            ->getByUserId(Headers::getUserId() ?? $userId);

        return $partner;
    }

    /**
     * @param $request
     * @return bool
     * @throws InvalidFieldPlaceException
     * @throws PartnerException
     */
    public function requestPartnership($request)
    {
        $this->validateRequestPartnership($request);

        $partner = new Partner;
        $partner
            ->setAddressEstablishment($request->addressEstablishment)
            ->setCreatedAt(now())
            ->setLatitude($request->latitude)
            ->setLongitude($request->longitude)
            ->setUserId($request->userId)
            ->setNameEstablishment($request->nameEstablishment)
            ->setFunction($request->function)
            ->setIdPartner(
                $this->dao->sqlInsert($partner)
            );

        $commission = new PartnerCommission;
        $commission
            ->setAppCommissionValue(
                PartnerCommissionConst::DEFAULT_APP_COMMISSION_VALUE)
            ->setPartnerCommissionValue(
                PartnerCommissionConst::DEFAULT_PARTNER_COMMISSION_VALUE)
            ->setManagerCommissionValue(
                PartnerCommissionConst::DEFAULT_MANAGER_COMMISSION_VALUE)
            ->setPartnerId($partner->getIdPartner())
            ->setId(
                $this->commissionDao
                    ->sqlInsert($commission)
            );

        return true;
    }

    /**
     * @param $userId
     * @return array|mixed
     * @throws PartnerException
     */
    public function getTrips($userId)
    {
        if (!$userId)
            throw new PartnerException(304);

        $trips = $this->tripSummaryDao
            ->getActiveTripsByUserV2($userId);
//            ->getActiveTripsByUser($userId, ['tripReference', 'status', 'customerName']);

        return $trips;
    }

    /**
     * @param $request
     * @throws InvalidFieldPlaceException
     * @throws PartnerException
     */
    private function validateRequestPartnership($request)
    {
        $this->validator->validateRequestPartnership($request);

        $partner = $this->dao->findByUser($request->userId);

        if ($partner)
            throw new PartnerException(301);
    }
}