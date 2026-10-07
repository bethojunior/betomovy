<?php


namespace App\Services\Trip;



use App\Repositories\Trip\TripReportRepository;

class TripReportService
{
    private $repository;

    public function __construct(TripReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findAll(array $request = [], int $cityId = null)
    {
        return $this->repository->findAll($request, $cityId);
    }
}
