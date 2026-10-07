<?php


namespace App\Services\MapService;


use App\Models\MapService\MapServiceMetaDataCity;
use App\Repositories\MapService\MapServiceMetaDataRepository;
use App\Repositories\MapService\MapServiceRepository;
use App\Utils\UUID;
use Illuminate\Support\Facades\DB;

class MapServiceService
{
    private $repository;
    private $mapServiceMetaDataRepository;

    public function __construct(MapServiceRepository $repository, MapServiceMetaDataRepository $mapServiceMetaDataRepository)
    {
        $this->repository = $repository;
        $this->mapServiceMetaDataRepository = $mapServiceMetaDataRepository;
    }

    public function findWithMetaData()
    {
        return $this->repository->findWithMetaData();
    }

    public function disableByGroup($groupCode)
    {
        $this->mapServiceMetaDataRepository->disableByGroup($groupCode);
    }

    public function findAll(int $cityId)
    {
        $mapServices = $this->repository->findAll($cityId);

        $results = [];

        foreach ($mapServices as $mapService) {
            foreach ($mapService->mapServiceMetaData as $data) {
                if (!isset($results[$data->groupCode])) {
                    $results[$data->groupCode] = (object)[
                        'groupCode' => $data->groupCode,
                        'type' => $mapService->name,
                        'keys' => [
                            (object)[
                                'key' => $data->key,
                                'value' => $data->value
                            ]
                        ]
                    ];
                } else {
                    $results[$data->groupCode]->keys[] = (object)[
                        'key' => $data->key,
                        'value' => $data->value
                    ];
                }
            }
        }

        return array_values($results);
    }

    public function store(array $request, int $cityId)
    {
        DB::beginTransaction();

        $mapSerViceMetaDataCityUpdated = [];

        try {
            $groupCode = UUID::v4();

            foreach ($request['metadata'] as $data) {
                $mapServiceMetaDataId = $this->mapServiceMetaDataRepository
                    ->findByKey($data['key'])->id;

                $mapSerViceMetaDataCity = MapServiceMetaDataCity::create([
                    'mapServiceMetaDataId' => $mapServiceMetaDataId,
                    'value' => $data['value'],
                    'cityId' => $cityId,
                    'groupCode' => $groupCode
                ]);

                array_push($mapSerViceMetaDataCityUpdated, $mapSerViceMetaDataCity);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            throw $e;
        }

        return $mapSerViceMetaDataCityUpdated;
    }
}
