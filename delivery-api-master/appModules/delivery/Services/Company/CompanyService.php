<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/05/2020
 * Time: 19:27
 */

namespace Delivery\Services\Company;


use App\Exceptions\Delivery\Company\CompanyException;
use Delivery\Constants\DeliveryOrder\TypeDeliveryAreaConst;
use Delivery\Repositories\Company\CompanyRepository;
use Delivery\Repositories\Config\ConfigRepository;
use Delivery\Repositories\Enum\WeekDayRepository;

class CompanyService
{
    /**
     * @var CompanyRepository
     */
    private $repository;
    /**
     * @var WeekDayRepository
     */
    private $weekDayRepository;

    private $configRepository;

    public function __construct(CompanyRepository $repository,
                                WeekDayRepository $weekDayRepository,
                                ConfigRepository  $configRepository)
    {
        $this->repository = $repository;
        $this->weekDayRepository = $weekDayRepository;
        $this->configRepository = $configRepository;
    }

    /**
     * @param array $request
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     * @throws CompanyException
     */
    public function findNear(array $request)
    {
        $this->validateCoordinate($request);
        $config = $this->configRepository->findByKey('type_of_delivery_area');
        switch ($config->value) {
            case TypeDeliveryAreaConst::AREA:
                return $this->repository
                    ->findNear($request['lat'], $request['lng'], $request['q'] ?? null,$request['categories'] ?? null,$request['deliverySectionId'] ?? null);
            case TypeDeliveryAreaConst::NEIGHBORHOOD:
                return $this->repository
                    ->findNearByNeighborhood($request['lat'], $request['lng'], $request['q'] ?? null,$request['categories'] ?? null,$request['deliverySectionId'] ?? null);
        }
    }

    /**
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     * @throws CompanyException
     */
    public function findRandom()
    {
        return $this->repository
            ->findRandom();
    }

    private function validateCoordinate(array $request)
    {
        if (!isset($request['lat']))
            throw new CompanyException("Latitude não enviada");

        if (!isset($request['lng']))
            throw new CompanyException("Longitude não enviada");
    }
}
