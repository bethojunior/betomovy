<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/11/2019
 * Time: 18:02
 */

namespace App\Services\Route;


use App\Constants\StatusConst;
use App\Contracts\Models\Location;
use App\Models\Route\Route;
use App\Models\Route\RouteTripItemType;
use App\Models\Route\RouteWayPoint;
use App\Models\Trip\Destination;
use App\Models\Trip\Origin;
use App\Repositories\Locale\CityRepository;
use App\Repositories\Route\RoutePitStopRepository;
use App\Repositories\Route\RouteRepository;
use App\Repositories\Route\RouteTripItemTypeRepository;
use App\Repositories\Route\RouteWayPointRepository;

class RouteService
{
    /**
     * @var RouteRepository
     */
    private $repository;
    /**
     * @var RoutePitStopRepository
     */
    private $routePitStopRepository;
    /**
     * @var RouteTripItemTypeRepository
     */
    private $routeTripItemTypeRepository;
    /**
     * @var CityRepository
     */
    private $cityRepository;
    /**
     * @var RouteWayPointRepository
     */
    private $routeWayPointRepository;

    public function __construct(RouteRepository $repository,
                                RoutePitStopRepository $routePitStopRepository,
                                RouteTripItemTypeRepository $routeTripItemTypeRepository,
                                RouteWayPointRepository $routeWayPointRepository,
                                CityRepository $cityRepository)
    {
        $this->repository = $repository;
        $this->routePitStopRepository = $routePitStopRepository;
        $this->routeTripItemTypeRepository = $routeTripItemTypeRepository;
        $this->cityRepository = $cityRepository;
        $this->routeWayPointRepository = $routeWayPointRepository;
    }

    /**
     * @param array $request
     * @return Route
     * @throws \Exception
     */
    public function insert(array $request)
    {
        try {
            \DB::beginTransaction();
            $route = new Route($request);

            /** @var Origin $origin */
            $origin = $this->createLocation(
                $request['origin'], Origin::class);
            /** @var Destination $destination */
            $destination = $this->createLocation(
                $request['destination'], Destination::class);

            $city = $this->cityRepository
                ->findByCoordinate($origin->latitude, $origin->longitude);

            $route->cityId = $city->id ?? null;
            $route->originId = $origin->idOrigin;
            $route->destinationId = $destination->idDestination;

            $route->priceId = null;

            if (isset($request['picture']))
                $route->picture =
                    \Storage::cloud()
                        ->putFile('route', $request['picture']);

            $this->repository->save($route);

            $this->createRouteWayPoints($request['routeWayPoints'], $route);
            $this->createRouteTripItemType($request['routeTripItemType'], $route);

        } catch (\Exception $e) {
            \DB::rollBack();

            throw $e;
        }

        \DB::commit();

        return $route;
    }

    public function findAll(array $request = [])
    {
        return $this->repository
            ->findAll($request);
    }

    public function updateStatus($id, int $active = 1)
    {
        /** @var Route $route */
        $route = $this->repository
            ->find($id);

        $route
            ->active = $active;

        $this->repository
            ->save($route);

        return $route;
    }

    public function delete($id)
    {
        /** @var Route $route */
        $route = $this->repository
            ->find($id);

        $route
            ->statusId = StatusConst::REMOVED;

        $this->repository
            ->save($route);

        return $route;
    }

    /**
     * @param array $data
     * @param string $locationModel
     * @return Location
     */
    private function createLocation(array $data, string $locationModel): Location
    {
        return $locationModel::create($data);
    }

    private function createRouteWayPoints(array $wayPoints, Route $route)
    {
        foreach ($wayPoints as $wayPoint) {
            $routeWayPoint = new RouteWayPoint;

            if (isset($wayPoint['routePitStop']['address'])) {
                $routePitStop = $this->routePitStopRepository
                    ->firstOrCreate($wayPoint['routePitStop']);

                $routeWayPoint->routePitStopId = $routePitStop->id;
            }

            $routeWayPoint->routeId = $route->id;
            $routeWayPoint->routePitStopTypeId = $wayPoint['routePitStopTypeId'];
            $routeWayPoint->routePitStopId =
                $wayPoint['routePitStopId'] ?? $routeWayPoint->routePitStopId;

            $this->routeWayPointRepository
                ->save($routeWayPoint);
        }
    }

    private function createRouteTripItemType(array $tripItemsType, Route $route)
    {
        foreach ($tripItemsType as $tripItemType) {
            $routeTripItemType = new RouteTripItemType;
            $routeTripItemType->routeId = $route->id;
            $routeTripItemType->tripItemTypeId = $tripItemType['tripItemTypeId'];
            $routeTripItemType->value = $tripItemType['value'];

            $this->routeTripItemTypeRepository
                ->save($routeTripItemType);
        }
    }

    public function update($id, array $request)
    {
        try {
            \DB::beginTransaction();
            /** @var Origin $origin */
            $origin = $this->createLocation(
                $request['origin'], Origin::class);
            /** @var Destination $destination */
            $destination = $this->createLocation(
                $request['destination'], Destination::class);

            $city = $this->cityRepository
                ->findByCoordinate($origin->latitude, $origin->longitude);

            $route = $this->repository->find($id);

            $route->name = $request['name'];
            $route->defaultLayout = $request['defaultLayout'];
            $route->tripTypeId = $request['tripTypeId'];
            $route->price = $request['price'];
            $route->estimatedTime = $request['estimatedTime'];
            $route->estimatedDistance = $request['estimatedDistance'];
            $route->allowCustomerStops = $request['allowCustomerStops'];


            $route->cityId = $city->id ?? null;
            $route->originId = $origin->idOrigin;
            $route->destinationId = $destination->idDestination;

            $route->priceId = null;

            if (isset($request['picture']))
                $route->picture =
                    \Storage::cloud()
                        ->putFile('route', $request['picture']);

            $this->routeWayPointRepository->removeWayPointByRoute($route->id);

            $this->createRouteWayPoints($request['routeWayPoints'], $route);


            $route->save();

            \DB::commit();
        } catch (\Exception $exception) {
            \DB::rollBack();

            throw $exception;
        }

        return $route;
    }

    public function find($id)
    {
        return $this->repository->findById($id);
    }
}
