<?php


namespace App\Repositories\Establishment;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Establishment\EstablishmentBilling;

class EstablishmentBillingRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(EstablishmentBilling::class);
    }

    public function findAll($companyId)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'statusPayment',
                'company'
            ])
            ->when(isset($companyId), function ($query) use ($companyId) {
                return $query->where('companyId', $companyId);
            })
            ->paginate();
    }
}
