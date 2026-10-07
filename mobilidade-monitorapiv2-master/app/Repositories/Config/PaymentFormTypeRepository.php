<?php


namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\PaymentFormType;

class PaymentFormTypeRepository extends AbstractRepository
{

    public function __construct()
    {
        $this->setModel(PaymentFormType::class);
    }
    public function findShowable()
    {
        return $this->getModel()
              ::where('showable', true)
             ->get();
    }

    public function findOnlyGeneral()
    {
        return $this->getModel()
            ::where('showable', true)
            ->where('isGeneral', true)
            ->get();
    }


}
