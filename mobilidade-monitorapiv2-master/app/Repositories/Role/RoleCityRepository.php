<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/08/2019
 * Time: 16:26
 */

namespace App\Repositories\Role;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\RoleCity;

class RoleCityRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RoleCity::class);
    }

    /**
     * @param $roleId
     * @param $cityId
     * @return bool|mixed|null
     * @throws \Exception
     */
    public function deleteByRoleAndCity($roleId, $cityId)
    {
        return $this->getModel()
            ::where('roleId', $roleId)
            ->where('cityId', $cityId)
            ->first()
            ->delete();
    }
}
