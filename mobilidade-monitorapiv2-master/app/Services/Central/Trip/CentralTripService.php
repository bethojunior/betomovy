<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 24/06/2019
 * Time: 13:46
 */

namespace App\Services\Central\Trip;



use App\Repositories\Trip\TripRepository;
use Carbon\Carbon;

class CentralTripService
{
    /**
     * @var TripRepository
     */
    private $repository;

    public function __construct(TripRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByCentral($centralId, $request_query = null)
    {
        if (isset($request_query['date'])){
            $request_query['date'][0] = Carbon::parse(
                $request_query['date'][0])
                ->startOfDay();

            $request_query['date'][1] = Carbon::parse
            ($request_query['date'][1])
                ->endOfDay();
        }

        return $this->repository
            ->findByCentral($centralId, $request_query);
    }
}
