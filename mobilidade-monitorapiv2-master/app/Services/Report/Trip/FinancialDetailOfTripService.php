<?php

namespace App\Services\Report\Trip;

use App\Repositories\Report\Driver\FinancialDetailOfTripReportRepository;

class FinancialDetailOfTripService
{
    /**
     * @var FinancialDetailOfTripReportRepository
     */
    private $repository;

    public function __construct(FinancialDetailOfTripReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(array $request)
    {
        return $this->repository->getAll($request);
    }
}
