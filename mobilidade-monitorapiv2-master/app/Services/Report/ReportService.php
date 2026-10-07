<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/02/2020
 * Time: 16:29
 */

namespace App\Services\Report;


use App\Repositories\Report\ReportRepository;
use App\Repositories\Report\ReportTypeRepository;

class ReportService
{
    private $repository;
    /**
     * @var ReportTypeRepository
     */
    private $reportTypeRepository;

    public function __construct(ReportRepository $repository, ReportTypeRepository $reportTypeRepository)
    {
        $this->repository = $repository;
        $this->reportTypeRepository = $reportTypeRepository;
    }

    public function findAllWithType(array $filters = [])
    {
        return $this->reportTypeRepository
            ->findAllWithReport($filters);
    }

    public function findAll(array $filters = [])
    {
        return $this->repository->findAll($filters);
    }
}
