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
use App\Helpers\CityIdHelper;
use App\Models\Central\Central;
use App\Repositories\Central\CentralDriverRepository;
use App\Repositories\Central\CentralRepository;
use App\Repositories\Locale\CityRepository;
use App\Repositories\ReadOnly\Central\CentralDriverRORepository;

class CentralDriverService
{
    /**
     * @var CentralDriverRepository
     */
    private $repository;
    /**
     * @var CentralDriverRORepository
     */
    private $roRepository;
    /**
     * @var CentralRepository
     */
    private $centralRepository;
    /**
     * @var CityRepository
     */
    private $cityRepository;

    public function __construct(
        CentralDriverRepository $repository, 
        CentralDriverRORepository $roRepository,
        CentralRepository $centralRepository,
        CityRepository $cityRepository
    ) {
        $this->repository = $repository;
        $this->roRepository = $roRepository;
        $this->centralRepository = $centralRepository;
        $this->cityRepository = $cityRepository;
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

    public function positions($centralId, $status = null, ?int $cityId = null)
    {
        if ($status)
            $status = explode(',', $status);

        /** @var Central $central */
        $central = $this->centralRepository->find($centralId);

        if (!$central) {
            throw new CentralDriverException("Central não encontrada");
        }

        if (!$cityId) {
            $cityId = CityIdHelper::inferFromCentral($central, $this->cityRepository);
        }

        return $this->roRepository
            ->findDriversPositionsByCentral($centralId, $status, $central->centralCallDriver, $cityId);
    }
}
