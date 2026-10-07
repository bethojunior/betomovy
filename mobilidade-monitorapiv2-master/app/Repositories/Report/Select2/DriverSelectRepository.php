<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/03/2020
 * Time: 14:28
 */

namespace App\Repositories\Report\Select2;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Driver;
use App\Traits\Scopes\Select2ScopeTrait;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class DriverSelectRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Driver::class);
    }

    public function listBySelect2(array $request)
    {
        $name = isset($request['q']) ? "%{$request['q']}%" : '';

        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when(!Auth::user()->role->support, function (Builder $query) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', Auth::user()->roleId);
                });
            })
            ->join('user', 'userId', '=', 'idUser')
            ->select('idDriver AS id',
                'name AS text')
            ->where('user.name', 'LIKE', $name)
            ->orderBy('user.name')
            ->get();
    }

    public function listBySelect2WithName(array $request)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when(!Auth::user()->role->support, function (Builder $query) {
                $query->whereIn('driver.cityId', function (\Illuminate\Database\Query\Builder $query) {
                    $query->select('cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', Auth::user()->roleId);
                });
            })
            ->join('user', 'userId', '=', 'idUser')
            ->select('idDriver AS id',
                'email',
                'phone',
                'name AS text')
            ->where('user.name', 'LIKE', "%{$request['name']}%")
            ->orderBy('user.name')
            ->get();
    }
}
