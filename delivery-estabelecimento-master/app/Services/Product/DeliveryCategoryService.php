<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/05/2020
 * Time: 15:32
 */

namespace App\Services\Product;


use App\Exceptions\Delivery\DeliveryCategoryException;
use App\Models\Company\Company;
use App\Models\Product\DeliveryCategory;
use App\Repositories\Company\CompanyRepository;
use App\Repositories\Product\DeliveryCategoryRepository;

class DeliveryCategoryService
{
    /**
     * @var DeliveryCategoryRepository
     */
    private $repository;
    /**
     * @var CompanyRepository
     */
    private $companyRepository;

    public function __construct(DeliveryCategoryRepository $repository,
                                CompanyRepository $companyRepository)
    {
        $this->repository = $repository;
        $this->companyRepository = $companyRepository;
    }

    /**
     * @param array $request
     * @return DeliveryCategory
     * @throws DeliveryCategoryException
     */
    public function store(array $request)
    {
//        /** @var Company $company */
//        $company = $this->companyRepository
//            ->find($request['companyId']);

        $pictureName = \Storage::cloud()
            ->putFile(
                'company/'.$request['companyId'].'/delivery/categories',
                $request['picture']);

        if (!$pictureName)
            throw new DeliveryCategoryException("Não foi possível fazer upload da imagem");

        $deliveryCategory = new DeliveryCategory;
        $deliveryCategory->companyId = $request['companyId'];
        $deliveryCategory->name = $request['name'];
        $deliveryCategory->picture = $pictureName;

        $deliveryCategory->save();

        return $deliveryCategory;
    }

    public function findCompanyCategories()
    {
        $companyWorker = \Auth::user()->companyWorker;

        return $this->repository
            ->findByCompany($companyWorker->companyId);
    }


    public function findCompanyCategoryWithProducts(?array $request = [])
    {
        $companyWorker = \Auth::user()->companyWorker;

        return $this->repository
            ->findCompanyCategoryWithProducts($companyWorker->companyId,$request);
    }

    /**
     * @param DeliveryCategory $deliveryCategory
     * @return bool|null
     * @throws \Exception
     */
    public function delete(DeliveryCategory $deliveryCategory)
    {
        \Storage::cloud()
            ->delete($deliveryCategory->getRawOriginal('picture'));

        return $deliveryCategory->delete();
    }

    public function update(array $request)
    {
        $deliveryCategory = $this->repository->find($request['id']);

        if(isset($request['picture'])) {
            $pictureName = \Storage::cloud()
                ->putFile(
                    'company/' . $request['companyId'] . '/delivery/categories',
                    $request['picture']);

            if (!$pictureName)
                throw new DeliveryCategoryException("Não foi possível fazer upload da imagem");

            $deliveryCategory->picture = $pictureName;
        }

        $deliveryCategory->name = $request['name'];

        $deliveryCategory->save();
    }
}
