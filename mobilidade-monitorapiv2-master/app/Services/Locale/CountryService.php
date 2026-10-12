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
        try {
            $data = $this->admin704Apps->getCountries($query);
            if (!empty($data)) {
                return $data;
            }
        } catch (\Throwable $e) {}

        return [
            ['id' => 1, 'name' => 'Brasil', 'nome' => 'Brasil', 'shortName' => 'BR'],
            ['id' => 2, 'name' => 'Estados Unidos', 'nome' => 'Estados Unidos', 'shortName' => 'US'],
            ['id' => 12, 'name' => 'Argentina', 'nome' => 'Argentina', 'shortName' => 'AR'],
            ['id' => 36, 'name' => 'Canadá', 'nome' => 'Canadá', 'shortName' => 'CA'],
            ['id' => 113, 'name' => 'Portugal', 'nome' => 'Portugal', 'shortName' => 'PT'],
            ['id' => 62, 'name' => 'Espanha', 'nome' => 'Espanha', 'shortName' => 'ES'],
            ['id' => 114, 'name' => 'Reino Unido', 'nome' => 'Reino Unido', 'shortName' => 'GB'],
            ['id' => 69, 'name' => 'França', 'nome' => 'França', 'shortName' => 'FR'],
            ['id' => 6, 'name' => 'Alemanha', 'nome' => 'Alemanha', 'shortName' => 'DE'],
            ['id' => 95, 'name' => 'Itália', 'nome' => 'Itália', 'shortName' => 'IT'],
            ['id' => 102, 'name' => 'México', 'nome' => 'México', 'shortName' => 'MX'],
            ['id' => 97, 'name' => 'Japão', 'nome' => 'Japão', 'shortName' => 'JP'],
            ['id' => 120, 'name' => 'Uruguai', 'nome' => 'Uruguai', 'shortName' => 'UY'],
            ['id' => 110, 'name' => 'Paraguai', 'nome' => 'Paraguai', 'shortName' => 'PY'],
            ['id' => 40, 'name' => 'Chile', 'nome' => 'Chile', 'shortName' => 'CL'],
            ['id' => 43, 'name' => 'Colômbia', 'nome' => 'Colômbia', 'shortName' => 'CO'],
        ];
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
