<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/09/2019
 * Time: 16:10
 */

namespace App\Services\Price;


use App\Constants\StatusConst;
use App\Models\Price\PriceObstacle;
use App\Repositories\Price\PriceObstacleRepository;

class PriceObstacleService
{
    /**
     * @var PriceObstacleRepository
     */
    private $repository;

    public function __construct(PriceObstacleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [])
    {
        return $this->repository
            ->findAll($request);
    }

    public function insert($request)
    {
        $priceObstacle = new PriceObstacle;
        $priceObstacle->value = $request['value'];
        $priceObstacle->cityId = $request['cityId'];
        $priceObstacle->valuePerFloor = $request['valuePerFloor'] ?? 0;
        $priceObstacle->obstacleOnFloorId = $request['obstacleOnFloorId'];

        $this->repository
            ->save($priceObstacle);

        return $priceObstacle;
    }

    public function delete($id)
    {
        $priceObstacle = $this->repository
            ->find($id);

        if (!$priceObstacle)
            return null;

        $priceObstacle->statusId = StatusConst::REMOVED;

        $this->repository->save($priceObstacle);

        return true;
    }
}
