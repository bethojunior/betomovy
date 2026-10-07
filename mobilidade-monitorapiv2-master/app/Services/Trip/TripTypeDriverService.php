<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/12/2019
 * Time: 08:11
 */

namespace App\Services\Trip;


use App\Models\Trip\TripTypeDriver;
use App\Repositories\Trip\TripTypeDriverRepository;
use App\Repositories\Trip\TripTypeRepository;
use App\Repositories\User\UserTypeRepository;

class TripTypeDriverService
{
    /**
     * @var UserTypeRepository
     */
    private $userTypeRepository;
    /**
     * @var TripTypeDriverRepository
     */
    private $repository;
    /**
     * @var TripTypeRepository
     */
    private $tripTypeRepository;

    public function __construct(UserTypeRepository $userTypeRepository,
                                TripTypeRepository $tripTypeRepository,
                                TripTypeDriverRepository $repository)
    {
        $this->userTypeRepository = $userTypeRepository;
        $this->repository = $repository;
        $this->tripTypeRepository = $tripTypeRepository;
    }

    public function findAll()
    {
        $tripTypes = $this->tripTypeRepository
            ->findWithDriversType();

        return $tripTypes;
    }

    public function insert(array $request)
    {
        foreach ($request['tripTypeDriver'] as $value) {
            $this->repository->firstOrCreate($value, $value);
        }

        return $this->findAll();
    }

    /**
     * @param array $request
     * @return bool
     * @throws \Exception
     */
    public function delete(array $request)
    {
        foreach ($request['tripTypeDriver'] as $value) {
            $this->repository
                ->deleteTripTypeDriver($value['tripTypeId'], $value['userTypeId']);
        }

        return true;
    }
}
