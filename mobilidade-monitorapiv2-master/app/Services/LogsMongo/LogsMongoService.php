<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2019
 * Time: 20:06
 */

namespace App\Services\LogsMongo;

use App\Repositories\Log\LogRepository;

class LogsMongoService
{
    /**
     * @var LogRepository
     */
    private $repository;

    public function __construct(LogRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getLogs($request)
    {
       return $this->repository->getCollectionLogs($request->type);
    }

    public function getLogsApplications($request)
    {
        $data = $this->repository
            ->getCollectionLogsApplications($request->type);

        return $data;
    }

    public function getTransanctionLogs($request)
    {
        $data = $this->repository
            ->getTransactionLogs($request);

        return $data;
    }
}
