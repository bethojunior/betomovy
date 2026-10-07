<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 19:01
 */

namespace App\Services\FinancialIntermediary;

use App\Constants\Cache\CacheKeyConst;
use App\Helpers\Cache\CacheHelper;
use App\Models\Acquirer\AcquirerMetaDataCity;
use App\Models\Acquirer\FinancialIntermediary;
use App\Models\Config\Config;
use App\Repositories\FinancialIntermediary\AcquirerMetaDataRepository;
use App\Repositories\FinancialIntermediary\AcquirerMetaDataCityRepository;
use App\Repositories\FinancialIntermediary\FinancialIntermediaryRepository;
use App\Utils\Acquirers\Ipag\Connection;
use App\Utils\Acquirers\Ipag\Webhook;
use Illuminate\Support\Facades\Cache;

class FinancialIntermediaryService
{
    private $repository;
    private $acquirerMetaDataRepository;
    private $acquirerMetaDataCityRepository;

    public function __construct(FinancialIntermediaryRepository $repository,
                                AcquirerMetaDataRepository      $acquirerMetaDataRepository,
                                AcquirerMetaDataCityRepository  $acquirerMetaDataCityRepository)
    {
        $this->repository = $repository;
        $this->acquirerMetaDataRepository = $acquirerMetaDataRepository;
        $this->acquirerMetaDataCityRepository = $acquirerMetaDataCityRepository;
    }

    public function findAll(array $request)
    {
        return $this->repository->findAll($request);
    }

    public function findAllByCity(int $cityId, array $request)
    {
        return $this->repository->findAllByCity($cityId, $request);
    }


    public function findByActive()
    {
        return $this->repository->findByActive();
    }

    public function updateActive(FinancialIntermediary $financialIntermediary, array $request)
    {
        \DB::beginTransaction();

        try {
            $this->repository->disableAll();

            $financialIntermediary->active = true;
            $financialIntermediary->save();

            foreach ($request['metadata'] as $data) {
                if($data['key'] === "epag_secret") {
                    (new Webhook(new Connection($data['value'], 'prod')))->processWebhook();
                }

                $this->acquirerMetaDataRepository
                    ->updateValueByKey($data['key'], $data['value']);

                if (strcmp($data['key'], 'mp_public_key') == 0 || strcmp($data['key'], 'mp_access_token') == 0) {
                    Config::where('key', $data['key'])
                        ->update(['value' => $data['value']]);
                    Config::where('key', 'disable_mercado_pago_app')
                        ->update(['value' => 0]);
                } else {
                    Config::where('key', 'disable_mercado_pago_app')
                        ->update(['value' => 1]);
                }
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        Cache::forget(CacheHelper::processKey(CacheKeyConst::MP_PUBLIC_KEY));

        return $financialIntermediary;
    }

    public function updateActiveInCity(array $request)
    {
        \DB::beginTransaction();

        try {
            $acquirersMetaDataCityUpdated = [];
            $citiesUpdated = [];
            foreach ($request['metadata'] as $data) {
                if (!in_array($data['cityId'], $citiesUpdated)) {
                    $this->acquirerMetaDataCityRepository->disableAllInCity($data['cityId']);
                    array_push($citiesUpdated, $data['cityId']);
                }

                $acquirerMetaDataId = $this->acquirerMetaDataRepository
                    ->findByKey($data['key'])->id;

                $this->acquirerMetaDataCityRepository->deleteByAcquirerMetaDataIdAndCity($acquirerMetaDataId, $data['cityId']);

                $acquirerMetaDataCity = AcquirerMetaDataCity::create([
                    'acquirerMetaDataId' => $acquirerMetaDataId,
                    'value' => $data['value'],
                    'active' => true,
                    'cityId' => $data['cityId']
                ]);

                if($data['key'] === "epag_secret") {
                    (new Webhook(new Connection($data['value'], 'prod')))->processWebhook();
                }

                array_push($acquirersMetaDataCityUpdated, $acquirerMetaDataCity);

                if (strcmp($data['key'], 'mp_public_key') == 0 || strcmp($data['key'], 'mp_access_token') == 0) {
                    Config::where('key', $data['key'])
                        ->update(['value' => $data['value']]);
                }
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return $acquirersMetaDataCityUpdated;
    }

    public function deleteActiveInCity(array $request)
    {
        \DB::beginTransaction();

        try {
            $citiesUpdated = [];
            foreach ($request['metadata'] as $data) {
                if (!in_array($data['cityId'], $citiesUpdated)) {
                    $this->acquirerMetaDataCityRepository->disableAllInCity($data['cityId']);
                    array_push($citiesUpdated, $data['cityId']);
                }

                $acquirerMetaDataId = $this->acquirerMetaDataRepository
                    ->findByKey($data['key'])->id;

                $this->acquirerMetaDataCityRepository->deleteByAcquirerMetaDataIdAndCity($acquirerMetaDataId, $data['cityId']);

                if (strcmp($data['key'], 'mp_public_key') == 0 || strcmp($data['key'], 'mp_access_token') == 0) {
                    Config::where('key', 'disable_mercado_pago_app')
                        ->update(['value' => 1]);
                }
            }
            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        return true;
    }

}
