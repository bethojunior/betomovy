<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/06/2019
 * Time: 17:25
 */

namespace App\Services\Central;


use App\Constants\StatusConst;
use App\Exceptions\Central\CentralDriverException;
use App\Models\Central\Central;
use App\Repositories\Central\CentralDriverRepository;

class CentralDriverService
{
    /**
     * @var CentralDriverRepository
     */
    private $repository;

    public function __construct(CentralDriverRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param array $request
     * @return CentralDriverRepository|\Illuminate\Database\Eloquent\Model
     * @throws CentralDriverException
     */
    public function store(array $request)
    {
        $centralDriverExists = $this->repository
            ->findByCentralAndDriver($request['centralId'], $request['driverId']);

        if ($centralDriverExists)
            throw new CentralDriverException("Esse motorista já está cadastrado nessa central");

        $centralDriver = $this->repository
            ->create($request);

        return $centralDriver;
    }

    /**
     * @param $centralId
     * @param $driverId
     * @return Central
     * @throws CentralDriverException
     */
    public function delete($centralId, $driverId)
    {
        /** @var Central $central */
        $central = $this->repository
            ->findByCentralAndDriver($centralId, $driverId);

        if (!$central)
            throw new CentralDriverException("Motorista não encontrado nesse central");

        $central
            ->statusId = StatusConst::REMOVED;

        $this->repository->save($central);

        return $central;
    }

    public function positions($centralId, $status = null)
    {
        if ($status)
            $status = explode(',', $status);

        return $this->repository
            ->findDriversPositionsByCentral($centralId, $status);
    }
}
