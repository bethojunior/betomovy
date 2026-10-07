<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2020
 * Time: 14:58
 */

namespace App\Services\Trip\Toll;


use App\Models\Trip\Toll\Toll;
use App\Repositories\Trip\Toll\TollRepository;

class TollService
{
    /**
     * @var TollRepository
     */
    private $repository;

    public function __construct(TollRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return Toll
     */
    public function insert(array $request): Toll
    {
        return Toll::create($request);
    }

    /**
     * @param array $queryRequest
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model
     */
    public function findAll(array $queryRequest = [])
    {
        return $this->repository
            ->findAll($queryRequest);
    }


    public function byCity($city)
    {
        $data = $this->repository->findAll($city);
        $array = [];
        foreach ($data as $value) {
            if($value->cityId == $city['cityId']) {
                $array[] = $value;
            }
        }
        return $array;
    }

    /**
     * @param Toll $toll
     * @param array $request
     * @return Toll
     * @throws \Exception
     */
    public function update(Toll $toll, array $request): Toll
    {
        $this->delete($toll);

        return $this->insert($request);
    }

    /**
     * @param Toll $toll
     * @return bool|null
     * @throws \Exception
     */
    public function delete(Toll $toll): ?bool
    {
        return $toll->delete();
    }
}
