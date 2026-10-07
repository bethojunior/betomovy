<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/10/2019
 * Time: 08:34
 */

namespace App\Services\Company;


use App\Constants\StatusConst;
use App\Constants\Users\PartnerRegisterStatusConst;
use App\Models\Company\CompanyWorker;
use App\Repositories\Company\CompanyWorkerRepository;
use App\Repositories\User\PartnerRepository;

class CompanyWorkerService
{
    /**
     * @var CompanyWorkerRepository
     */
    private $repository;
    /**
     * @var PartnerRepository
     */
    private $partnerRepository;

    public function __construct(CompanyWorkerRepository $repository,
                                PartnerRepository $partnerRepository)
    {
        $this->repository = $repository;
        $this->partnerRepository = $partnerRepository;
    }

    public function add(array $request)
    {
        $companyWorker = new CompanyWorker($request);

        $this->partnerRepository
            ->firstOrCreate([
                'userId' => $companyWorker->userId,
                'statusId' => StatusConst::ACTIVE
            ], [
                'partnerRegisterStatusId' => PartnerRegisterStatusConst::ACTIVE
            ]);

        return $this->repository
            ->save($companyWorker);
    }

    public function delete($id)
    {
        $companyWorker = $this->repository
            ->find($id);

        $companyWorker
            ->statusId = StatusConst::REMOVED;

        return $this->repository
            ->save($companyWorker);
    }
}
