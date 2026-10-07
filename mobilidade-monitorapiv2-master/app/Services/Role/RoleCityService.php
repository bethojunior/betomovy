<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 25/09/2019
 * Time: 17:37
 */

namespace App\Services\Role;

use App\Models\Config\CityArea;
use App\Models\Role\RoleCity;
use App\Repositories\Role\RoleCityRepository;
use App\Repositories\Role\RoleRepository;

class RoleCityService
{
    /**
     * @var RoleRepository
     */
    private $roleRepository;
    /**
     * @var RoleCityRepository
     */
    private $roleCityRepository;

    public function __construct(RoleRepository $roleRepository,
                                RoleCityRepository $roleCityRepository)
    {

        $this->roleRepository = $roleRepository;
        $this->roleCityRepository = $roleCityRepository;
    }

    public function insert($roleId, $request)
    {
        $roleCity = new RoleCity;

        $roleCity->roleId = $roleId;
        $roleCity->cityId = $request['cityId'];

        $this->roleCityRepository->save($roleCity);

        return $roleCity;
    }

    public function findAll($roleId)
    {
        return $this->roleRepository
            ->findWithCity($roleId);
    }

    /**
     * @param $id
     * @param $cityId
     * @return bool|mixed|null
     * @throws \Exception
     */
    public function delete($id, $cityId)
    {
        return $this->roleCityRepository
            ->deleteByRoleAndCity($id, $cityId);
    }

    public function deleteByCityId(int $cityId)
    {
        CityArea::where('cityId', $cityId)
        ->update(['statusId' => 2]);

        return RoleCity::where('cityId', $cityId)
            ->delete();
    }
}
