<?php


namespace App\Repositories\Report\Select;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Partner\PartnerRegisterStatus;
use Illuminate\Database\Eloquent\Collection;

class PartnerRegisterStatusSelectRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(PartnerRegisterStatus::class);
    }

    public function listBySelect(): Collection
    {
        return $this->getModel()
            ::select(
                'id',
                'name as text'
            )
            ->where('statusId', StatusConst::ACTIVE)
            ->get();
    }
}
