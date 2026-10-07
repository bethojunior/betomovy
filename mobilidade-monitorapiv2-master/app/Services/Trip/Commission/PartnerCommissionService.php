<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/05/2020
 * Time: 10:06
 */

namespace App\Services\Trip\Commission;


use App\Constants\StatusConst;
use App\Models\Trip\PartnerCommission;
use App\Repositories\Trip\PartnerCommissionRepository;

class PartnerCommissionService
{
    /**
     * @var PartnerCommissionRepository
     */
    private $repository;

    public function __construct(PartnerCommissionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function insert(array $request): PartnerCommission
    {
        $partnerCommission = new PartnerCommission($request);

        $partnerCommission->save();

        return $partnerCommission;
    }

    public function findAll(array $request)
    {
        return $this->repository
            ->findAll($request);
    }

    public function update(PartnerCommission $partnerCommission, array $request)
    {
        $this->delete($partnerCommission);

        $partnerCommission = new PartnerCommission($request);

        $partnerCommission->save();

        return $partnerCommission;
    }

    public function delete(PartnerCommission $partnerCommission)
    {
        $partnerCommission->statusId = StatusConst::REMOVED;
        return $partnerCommission->save();
    }
}
