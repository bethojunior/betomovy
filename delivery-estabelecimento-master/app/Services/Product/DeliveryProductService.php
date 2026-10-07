<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/05/2020
 * Time: 14:24
 */

namespace App\Services\Product;


use App\Exceptions\Delivery\DeliveryProductException;
use App\Models\Company\Company;
use App\Models\Product\DeliveryComplement;
use App\Models\Product\DeliveryGroupComplement;
use App\Models\Product\DeliveryProduct;
use App\Repositories\Product\DeliveryProductRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DeliveryProductService
{
    /**
     * @var DeliveryProductRepository
     */
    private $repository;

    /**
     * DeliveryProductService constructor.
     * @param DeliveryProductRepository $repository
     */
    public function __construct(DeliveryProductRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return DeliveryProduct
     * @throws \Throwable
     */
    public function store(array $request): DeliveryProduct
    {
        $deliveryProduct = new DeliveryProduct($request);
        $deliveryProduct->isOpenValue = isset($request['isOpenValue']);
        try {
            \DB::beginTransaction();

            if (isset($request['picture'])) {
                $pictureName = \Storage::cloud()
                    ->putFile(
                        'company/' . $request['companyId'] . '/delivery/products',
                        $request['picture']);

                if (!$pictureName)
                    throw new DeliveryProductException("Não foi possível fazer upload da imagem");

                $deliveryProduct->picture = $pictureName;
            }

            $deliveryProduct->save();

            if (isset($request['complements']))
                $this->createGroupComplements($deliveryProduct, json_decode($request['complements']));

            \DB::commit();

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $deliveryProduct;
    }

    /**
     * @param array|null $request
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function findCompanyProducts(?array $request = [])
    {
        /** @var Company $company */
        $company = \Auth::user()->companyWorker->company;

        return $this->repository
            ->findByCompany($company->id, $request);
    }

    /**
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model
     */
    public function findOne(int $id)
    {
        $deliveryProduct = $this->repository->findOne($id);

        if (!$deliveryProduct)
            throw new ModelNotFoundException("Produto não encontrado");

        return $deliveryProduct;
    }

    /**
     * @param DeliveryProduct $deliveryProduct
     * @param array $request
     * @return DeliveryProduct
     * @throws \Throwable
     */
    public function update(DeliveryProduct $deliveryProduct, array $request): DeliveryProduct
    {
//        dd($request);
        $newDeliveryProduct = $this->store($request);

        $this->delete($deliveryProduct);

        if (!isset($request['picture'])) {
            $newDeliveryProduct->picture = $deliveryProduct->getRawOriginal('picture');
            $newDeliveryProduct->save();
        }

        return $newDeliveryProduct;
    }

    /**
     * @param DeliveryProduct $deliveryProduct
     * @return bool|null
     * @throws \Exception
     */
    public function delete(DeliveryProduct $deliveryProduct)
    {
        return $deliveryProduct->delete();
    }

    /**
     * @param DeliveryProduct $deliveryProduct
     * @param array $groupComplements
     */
    private function createGroupComplements(DeliveryProduct $deliveryProduct, array $groupComplements)
    {
        foreach ($groupComplements as $groupComplement) {
            $deliveryGroupComplement = new DeliveryGroupComplement;
            $deliveryGroupComplement->name = $groupComplement->name;
            $deliveryGroupComplement->minimumQuantity = $groupComplement->minimumQuantity ?? 0;
            $deliveryGroupComplement->maximumQuantity = $groupComplement->maximumQuantity ?? 0;
            $deliveryGroupComplement->required = (bool) $groupComplement->required;
            $deliveryGroupComplement->deliveryProductId = $deliveryProduct->id;

            $deliveryGroupComplement->save();

            $this->createComplement($deliveryGroupComplement, $groupComplement->complements);
        }
    }

    /**
     * @param DeliveryGroupComplement $deliveryGroupComplement
     * @param array $complements
     */
    private function createComplement(DeliveryGroupComplement $deliveryGroupComplement, array $complements)
    {
        foreach ($complements as $complement) {
            $deliveryComplement = new DeliveryComplement;
            $deliveryComplement->name = $complement->name;
            $deliveryComplement->description = $complement->description ?? null;
            $deliveryComplement->price = $complement->price ?? 0;
            $deliveryComplement->deliveryGroupComplementId = $deliveryGroupComplement->id;
            $deliveryComplement->active = $complement->active;

            $deliveryComplement->save();
        }
    }
}
