<?php

namespace app\services;

use app\dao\ManagerDao;
use app\dao\ManagerPartnerBillingDao;
use app\dao\PartnerDao;
use app\dao\UserPartnerDao;
use app\exceptions\RequestValidatorException;
use app\validator\ManagerValidator;
use Carbon\Carbon;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/06/2019
 * Time: 19:13
 */
class ManagerPartnerService
{
    private $dao;
    private $partnerDao;
    private $managerDao;
    private $validator;
    private $billingDao;

    public function __construct()
    {
        $this->dao = new UserPartnerDao;
        $this->partnerDao = new PartnerDao;
        $this->managerDao = new ManagerDao;
        $this->validator = new ManagerValidator;
        $this->billingDao = new ManagerPartnerBillingDao;
    }

    /**
     * @param $request
     * @param $userId
     * @return array|mixed
     * @throws Exception
     */
    public function findUserPartnerByEmail($request, $userId)
    {
        if (!isset($request->email))
            throw new Exception("Email não enviado");

        $user = $this->dao
            ->findByEmail($request->email, $userId);

        if (!$user)
            throw new Exception("Usuário não encontrado");

        if ($user->managerId)
            throw new Exception("Este email já possui gestor vinculado");

        return $user;
    }

    /**
     * @param $request
     * @param $userId
     * @return array|mixed
     * @throws Exception
     */
    public function store($request, $userId)
    {
        if (!isset($request->userId))
            throw new Exception("Id do usuário do parceiro não enviado");

        $partner = $this->partnerDao
            ->findByUser($request->userId);

        if ($partner->managerId)
            throw new Exception("Este parceiro já possui gestor vinculado");

        $manager = $this->managerDao
            ->findByUserId($userId);

        $this->partnerDao->updateManager($manager->id, $request->userId);

        return
            $this->partnerDao
                ->findByUser($request->userId);
    }

    /**
     * @param $request
     * @param $userId
     * @return array
     */
    public function findPartners($request, $userId)
    {
        return $this->dao
            ->findPartners($userId, $request->page ?? 1);
    }

    /**
     * @param $request
     * @param $userId
     * @return array
     * @throws Exception
     */
    public function billing($request, $userId)
    {
        $this->validator
            ->validateQueryBilling($request);

        if (isset($request['date'])) {
            $dates = explode(',', $request['date']);
            $request['date'] = array(
                Carbon::parse($dates[0])->startOfDay(),
                Carbon::parse($dates[1])->endOfDay()
            );
        }

        $trips = $this->billingDao
            ->getBilling($request, $userId);

        $billingCommissions = $this->billingDao
            ->getCommissionsBilling($request, $userId);

        return compact(
            'trips', 'billingCommissions');
    }

    /**
     * @param $userId
     * @return array|mixed
     * @throws RequestValidatorException
     */
    public function citiesWithBilling($userId)
    {
        if (!$userId)
            throw new RequestValidatorException(1101);

        return $this->billingDao
            ->getCitiesWithBilling($userId);
    }

    /**
     * @param $userId
     * @return mixed
     * @throws RequestValidatorException
     */
    public function partnersWithBilling($userId)
    {
        if (!$userId)
            throw new RequestValidatorException(1101);

        return $this->billingDao
            ->getPartnersWithBilling($userId);
    }
}