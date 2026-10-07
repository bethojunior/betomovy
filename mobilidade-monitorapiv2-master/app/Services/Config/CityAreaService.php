<?php

namespace App\Services\Config;

use App\Jobs\Config\SyncCityAreaToAdmin704AppsJob;
use App\Models\Config\CityArea;
use App\Models\Role\RoleCity;
use App\Repositories\Locale\CityAreaRepository;
use App\Repositories\Locale\CityRepository;
use App\Utils\Polygon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CityAreaService
{
    /**
     * @var CityAreaRepository
     */
    private $repository;

    /**
     * @var CityRepository
     */
    private $cityRepository;

    public function __construct(CityAreaRepository $repository, CityRepository $cityRepository)
    {
        $this->repository = $repository;
        $this->cityRepository = $cityRepository;
    }

    /**
     * @throws Exception
     */
    public function store(int $adminCityId, array $request): bool
    {
        $localCityId = null;

        DB::beginTransaction();
        try {
            $findCityIdInLocale = $this->cityRepository->findCityIdByNameAndEstate($request['name'], $request['estate_id']);

            if ($findCityIdInLocale->isEmpty()) {
                $city = $this->cityRepository->create([
                    'nome' => $request['name'],
                    'shortName' => $request['short_name'],
                    'estado' => $request['estate_id']
                ]);

                $localCityId = $city->id;

                $this->saveCityArea($localCityId, $request['polygon']);
                $this->insertIntoDefaultRoles($localCityId);
            } else {
                $localCityId = $findCityIdInLocale[0]->id;
                $this->insertIntoDefaultRoles($localCityId);
                $syncPayload = $this->buildAdminSyncPayload($localCityId, $request);
                $this->persistAreaLocally($localCityId, $request);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }

        if (isset($syncPayload)) {
            $this->dispatchAdminCityAreaSync($adminCityId, $localCityId, $syncPayload);

            return true;
        }

        $this->queueAdminCityAreaSync($adminCityId, $localCityId, $request);

        return true;
    }

    /**
     * @throws Exception
     */
    public function updateArea(int $adminCityId, array $request): void
    {
        $findCityIdInLocale = $this->cityRepository->findCityIdByNameAndEstate($request['old_name'], $request['estate_id']);

        if ($findCityIdInLocale->isEmpty()) {
            throw new Exception('Cidade nao encontrada');
        }

        $localCityId = $findCityIdInLocale[0]->id;

        $syncPayload = $this->buildAdminSyncPayload($localCityId, $request);
        $this->persistAreaLocally($localCityId, $request);
        $this->dispatchAdminCityAreaSync($adminCityId, $localCityId, $syncPayload);
    }

    private function insertIntoDefaultRoles(int $cityId): void
    {
        RoleCity::updateOrCreate(['roleId' => 1, 'cityId' => $cityId]);
        RoleCity::updateOrCreate(['roleId' => 2, 'cityId' => $cityId]);
    }

    private function saveCityArea($cityId, $polygon): CityArea
    {
        $cityArea = new CityArea();
        $polygon  = Polygon::polygonToString($polygon);

        $cityArea->polygon = DB::raw("ST_GeomFromText({$polygon})");
        $cityArea->cityId  = $cityId;
        $cityArea->save();

        return $cityArea;
    }

    private function persistAreaLocally(int $localCityId, array $request): void
    {
        $this->repository->disableAreaByCity($localCityId);
        $this->saveCityArea($localCityId, $request['polygon']);
        $this->forgetCityCache();
        $this->updateCity($localCityId, $request);
    }

    private function queueAdminCityAreaSync(int $adminCityId, int $localCityId, array $request): void
    {
        $this->dispatchAdminCityAreaSync(
            $adminCityId,
            $localCityId,
            $this->buildAdminSyncPayload($localCityId, $request)
        );
    }

    private function dispatchAdminCityAreaSync(int $adminCityId, int $localCityId, array $requestData): void
    {
        SyncCityAreaToAdmin704AppsJob::dispatch($adminCityId, $localCityId, $requestData)
            ->afterResponse();
    }

    private function buildAdminSyncPayload(int $localCityId, array $request): array
    {
        $requestData = $request;
        unset($requestData['polygon']);

        $localCity = $this->cityRepository->find($localCityId);

        if (is_null($localCity)) {
            return $requestData;
        }

        $requestData['name'] = $requestData['name'] ?? $localCity->nome;
        $requestData['short_name'] = $requestData['short_name'] ?? $localCity->shortName;
        $requestData['estate_id'] = $requestData['estate_id'] ?? $localCity->estado;
        $requestData['old_name'] = $requestData['old_name'] ?? $localCity->nome;

        return $requestData;
    }

    private function forgetCityCache(): void
    {
        Cache::forget('city:actives');
        Cache::forget('city:actives:fully');
    }

    private function updateCity(int $cityId, $request): void
    {
        $city = $this->cityRepository->find($cityId);

        if (is_null($city)) {
            throw new Exception('Cidade não encontrada');
        }

        $city->nome      = $request['name'];
        $city->shortName = $request['short_name'];
        $city->estado    = $request['estate_id'];
        $city->save();
    }
}
