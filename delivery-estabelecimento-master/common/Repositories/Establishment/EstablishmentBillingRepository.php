<?php


namespace Common\Repositories\Establishment;


use Common\Constants\StatusConst;
use Common\Contracts\Repository\AbstractRepository;
use Common\Models\Establishment\EstablishmentBilling;

class EstablishmentBillingRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(EstablishmentBilling::class);
    }

    public function findByCompany($companyId)
    {
        return $this->getModel()
            ::where('statusId',StatusConst::ACTIVE)
            ->where('companyId', $companyId)
            ->with([
                'statusPayment'
            ])
            ->orderByDesc('id')
            ->paginate();
    }
}
