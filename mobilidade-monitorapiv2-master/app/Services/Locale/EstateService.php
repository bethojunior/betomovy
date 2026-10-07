<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 18:37
 */

namespace App\Services\Locale;


use App\Models\Locale\Estate;
use App\Repositories\Locale\EstateRepository;
use App\Utils\Admin704Apps\Admin704Apps;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class EstateService
{
    /**
     * @var EstateRepository|Model
     */
    private $repository;

    /**
     * @var Admin704Apps
     */
    private $admin704Apps;

    public function __construct(EstateRepository $repository, Admin704Apps $admin704Apps)
    {
        $this->repository = $repository;
        $this->admin704Apps = $admin704Apps;
    }

    /**
     * @throws \Exception
     */
    public function all($query = null)
    {
        return $this->admin704Apps->getEstates($query);
    }

    /**
     * @throws \Exception
     */
    public function find($id)
    {
        return $this->admin704Apps->getEstateById($id);
    }

    /**
     * @throws \Exception
     */
    public function store(array $data)
    {
//        $data['name'] = $data['nome'];
//        $data['country_id'] = $data['countryId'];
//
//        unset($data['nome']);
//        unset($data['countryId']);

        return $this->admin704Apps->createEstate($data);
    }

    /**
     * @throws \Exception
     */
    public function update(int $id, array $data)
    {
        $data['name'] = $data['nome'];
        $data['country_id'] = $data['countryId'];

        unset($data['nome']);
        unset($data['countryId']);

        return $this->admin704Apps->updateEstate($id, $data);
    }

    /**
     * @throws \Exception
     */
    public function delete(int $id)
    {
        return $this->admin704Apps->deleteEstate($id);
    }

    /**
     * @throws \Exception
     */
    public function getEstatesByCountryId(int $countryId)
    {
        return $this->admin704Apps->getEstatesByCountryId($countryId);
    }
}
