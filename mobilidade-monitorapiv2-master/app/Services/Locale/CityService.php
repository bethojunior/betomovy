<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:29
 */

namespace App\Services\Locale;


use App\Models\Locale\City;
use App\Models\User\User;
use App\Repositories\Locale\CityRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class CityService
{
    /**
     * @var CityRepository
     */
    private $repository;

    /**
     * @var Admin704Apps
     */
    private $admin704Apps;

    public function __construct(CityRepository $repository, Admin704Apps $admin704Apps)
    {
        $this->repository = $repository;
        $this->admin704Apps = $admin704Apps;
    }

    /**
     * @throws \Exception
     */
    public function all($query = null, $estateId = null, $isUpdate = false)
    {
        if ($isUpdate == 'true') {
            return $this->repository
                ->all($query, $estateId);
        }

        return $this->admin704Apps->getCities($query, $estateId);
    }

    /**
     * @throws \Exception
     */
    public function find(int $id)
    {
        $city = $this->repository->findWithCityAreaById($id);

        if (isset($city)) {
            return $city;
        }

        $city = $this->admin704Apps->getCityById($id);

        if (!isset($city)) {
            throw new ModelNotFoundException("Cidade não encontrada");
        }

        return $city;
    }

    public function findLocale(int $id)
    {
        return $this->repository->findById($id);
    }

    public function findActives()
    {
        return $this->repository->findActives();
    }

    public function findActivesFully(): Collection
    {
        return $this->repository->findActivesFully((Auth::user())->role);
    }

    /**
     * @throws \Exception
     */
    public function store(array $data)
    {
        City::create($data);
        return $this->admin704Apps->createCityName($data);
    }

    public function update(City $city, array $data)
    {
        $city->update($data);

        return $city;
    }

    public function delete(City $city)
    {
        $city->statusId = 2;
        $city->save();

        return $city;
    }

    public function editCityShortName(int $id, string $shortName = null)
    {
        $city = $this->find($id);
        $city->shortName = $shortName;
        $city->save();

        return $city;
    }

    public function getTripTypes(int $cityId): Collection
    {
        return $this->repository->findTripTypes($cityId);
    }

    public function deleteCityName(int $cityId)
    {
        return $this->admin704Apps->deleteCityName($cityId);
    }

    public function allLocale($query = null, $estateId = null)
    {
        return $this->repository
            ->all($query, $estateId);
    }

    private function forgetCityCache(): void
    {
        Cache::forget('city:actives');
        Cache::forget('city:actives:fully');
    }
}
