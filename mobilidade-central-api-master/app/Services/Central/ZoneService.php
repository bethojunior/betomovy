<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 14:41
 */

namespace App\Services\Central;


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

    public function findByCentral($centralId)
    {
        return $this->repository
            ->findByCentral($centralId);
    }

    public function store($centralId, array $request)
    {
        $zone = new Zone($request);
        $zone->centralId = $centralId;

        $this->repository
            ->save($zone);

        return $zone;
    }

    public function update($centralId, $zone_id, array $request)
    {
        $this->delete($zone_id);

        return $this->store($centralId, $request);
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
