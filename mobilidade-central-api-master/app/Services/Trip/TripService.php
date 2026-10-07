<?php

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 14/06/2019
 * Time: 16:10
 */

namespace App\Services\Trip;


use App\Repositories\Trip\TripRepository;
use App\Repositories\Trip\TripSummaryViewRepository;

class TripService
{
    /**
     * @var TripRepository
     */
    private $repository;
    /**
     * @var TripSummaryViewRepository
     */
    private $viewRepository;

    public function __construct(
        TripRepository $repository,
        TripSummaryViewRepository $viewRepository
    ) {
        $this->repository = $repository;
        $this->viewRepository = $viewRepository;
    }

    public function findActiveSummaries($centralId)
    {
        $trips = $this->viewRepository->findActivesByCentral($centralId);
        return $trips;
    }

    public function find($tripReference)
    {
        $trip = $this->repository->findFully($tripReference);
        return $trip;
    }

    public function findActives($centralId, array $filters = [], $with = [])
    {
        return [
            'trips' => $this->repository->findActivesByCentral($centralId, $with, $filters),
            'scheduledTotal' => $this->repository->countScheduledActivesByCentral($centralId, $filters),
        ];
    }
}
