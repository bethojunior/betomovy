<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/04/2020
 * Time: 20:00
 */

namespace App\Repositories\Report\Select;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Locale\City;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Builder;

class CitySelectRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(City::class);
    }

    public function listActives(User $user)
    {
        return $this->getModel()
            ::query()->join('cityArea', 'cityArea.cityId', 'city.id')
            ->join('roleCity', 'roleCity.cityId', 'city.id')
            ->join('role', 'role.id', 'roleCity.roleId')
            ->where('role.id', $user->roleId)
            ->where('cityArea.statusId', StatusConst::ACTIVE)
            ->select(
                'city.id',
                'city.nome AS text'
            )
            ->orderBy('city.nome')
            ->get();
    }
}
