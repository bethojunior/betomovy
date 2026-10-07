<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 14:41
 */

namespace App\Services\Config;


use App\Constants\StatusConst;
use App\Models\Trip\Zone;
use App\Repositories\Trip\ZoneRepository;

class ZoneService
{
    /**
     * @var ZoneRepository
     */
    private $repository;

    public function __construct(ZoneRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByCity($cityId)
    {
        return $this->repository
            ->findByCity($cityId);
    }

    public function store($cityId, array $request)
    {
        $zone = new Zone($request);
        $zone->cityId = $cityId;

        $zone->longDistanceRadius = $request['longDistanceRadius'] ?? 3;

        $this->repository
            ->save($zone);

        return $zone;
    }

    public function update($cityId, $zone_id, array $request)
    {
        $this->delete($zone_id);

        return $this->store($cityId, $request);
    }

    public function delete($zone_id)
    {
        /** @var Zone $zone */
        $zone = $this->repository
            ->find($zone_id);

        $zone
            ->statusId = StatusConst::REMOVED;

        return $this->repository
            ->save($zone);
    }
}
