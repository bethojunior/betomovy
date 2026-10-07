<?php


namespace App\Services\Company;


use App\Constants\StatusConst;
use App\Models\Company\EstablishmentCategoryDelivery;
use App\Repositories\Company\EstablishmentCategoryDeliveryRepository;

class EstablishmentCategoryDeliveryService
{
    private $repository;

    public function __construct(EstablishmentCategoryDeliveryRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findCompany()
    {
        $companyWorker = \Auth::user()->companyWorker;

        return $this->repository->findByCompany($companyWorker->companyId);
    }

    public function insert(array $request)
    {
        $companyWorker = \Auth::user()->companyWorker;

        $oldCategories = $this->repository->findByCompany($companyWorker->companyId);

        foreach ($oldCategories as $category) {
            $category->statusId = StatusConst::REMOVED;
            $category->save();
        }

        if (isset($request['categories']))
            foreach ($request['categories'] as $value) {
                $establishmentCategory = new EstablishmentCategoryDelivery();
                $establishmentCategory->companyId = $companyWorker->companyId;
                $establishmentCategory->typeDeliveryCategoryId = $value;
                $establishmentCategory->save();
            }
    }
}
