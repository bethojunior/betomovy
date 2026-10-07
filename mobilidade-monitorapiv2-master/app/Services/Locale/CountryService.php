<?php


namespace App\Services\Locale;


use App\Models\Locale\Country;
use App\Repositories\Locale\CountryRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CountryService
{
    private $repository;
    private $admin704Apps;

    /**
     * CountryService constructor.
     * @param $repository
     * @param Admin704Apps $admin704Apps
     */
    public function __construct(CountryRepository $repository, Admin704Apps $admin704Apps)
    {
        $this->repository = $repository;
        $this->admin704Apps = $admin704Apps;
    }

    /**
     * @throws \Exception
     */
    public function findAll($query = null)
    {
        return $this->admin704Apps->getCountries($query);
    }

    /**
     * @throws \Exception
     */
    public function find($id)
    {
        $country = $this->admin704Apps->getCountryById($id);
        if (!isset($country)) throw new ModelNotFoundException("País não encontrado");

        return $country;
    }

    /**
     * @throws \Exception
     */
    public function store(array $data)
    {
        return $this->admin704Apps->createCountry($data);
    }

    /**
     * @throws \Exception
     */
    public function update($id, $data)
    {
        return $this->admin704Apps->updateCountry($id, $data);
    }

    /**
     * @throws \Exception
     */
    public function delete(int $id)
    {
        return $this->admin704Apps->deleteCountry($id);
    }
}
