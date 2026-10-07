<?php

namespace App\Services\FinancialIntermediary;

use App\Models\Acquirer\DeliveryFinancialIntermediary;
use App\Repositories\Acquirer\DeliveryAcquirerMetaDataRepository;
use App\Repositories\FinancialIntermediary\DeliveryFinancialIntermediaryRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DeliveryFinancialIntermediaryService
{
    private $repository;
    private $deliveryAcquirerMetaDataRepository;

    public function __construct(DeliveryFinancialIntermediaryRepository $repository, DeliveryAcquirerMetaDataRepository $deliveryAcquirerMetaDataRepository)
    {
        $this->repository = $repository;
        $this->deliveryAcquirerMetaDataRepository = $deliveryAcquirerMetaDataRepository;
    }

    public function findAll(array $request)
    {
        return $this->repository->findAll($request);
    }

    public function updateActive(DeliveryFinancialIntermediary $deliveryFinancialIntermediary, array $request): Model
    {
        DB::beginTransaction();

        try {
            $this->repository->disableAll();

            $deliveryFinancialIntermediary->active = true;
            $deliveryFinancialIntermediary->save();

            foreach ($request['metadata'] as $data) {
                $this->deliveryAcquirerMetaDataRepository
                    ->updateValueByKey($data['key'], $data['value']);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return $deliveryFinancialIntermediary;
    }
}
