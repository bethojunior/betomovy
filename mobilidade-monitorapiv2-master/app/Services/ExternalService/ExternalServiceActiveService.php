<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/07/2020
 * Time: 16:51
 */

namespace App\Services\ExternalService;


use App\Models\ExternalService\ExternalServiceActive;
use App\Repositories\ExternalService\ExternalServiceActiveRepository;

class ExternalServiceActiveService
{
    /**
     * @var ExternalServiceActiveRepository
     */
    private $repository;

    public function __construct(ExternalServiceActiveRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll()
    {
        return $this->repository->findAll();
    }

    public function updateExternalServiceType(ExternalServiceActive $externalServiceActive, array $request)
    {
        $externalServiceActive->externalServiceTypeId = $request['externalServiceTypeId'];
        $externalServiceActive->save();

        return $externalServiceActive;
    }
}
