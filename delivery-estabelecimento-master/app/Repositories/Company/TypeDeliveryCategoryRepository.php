<?php


namespace App\Repositories\Company;


use App\Constants\StatusConst;
use App\Models\Company\TypeDeliveryCategory;
use Common\Contracts\Repository\AbstractRepository;

class TypeDeliveryCategoryRepository extends AbstractRepository
{
    public function __construct()
    {
        $this->setModel(TypeDeliveryCategory::class);
    }

    public function findAll()
    {
        return $this->getModel()
            ::where('statusId',StatusConst::ACTIVE)
            ->orderBy('name','ASC')
            ->get();
    }
}
