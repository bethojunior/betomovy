<?php


namespace App\Services\Config;


use App\Repositories\Config\PaymentFormTypeRepository;

class PaymentFormTypeService
{

    private $repository;

    /**
     * @inheritDoc
     */
    public function __construct(PaymentFormTypeRepository $repository)
    {

         $this->repository = $repository;
    }

    public function findShowable()
    {
        return $this->repository
            ->findShowable();

    }

    public function findOnlyGeneral()
    {
        return  $this->repository
            ->findOnlyGeneral();
    }

}
