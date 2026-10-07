<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 01/04/2020
 * Time: 19:36
 */

namespace App\Repositories\Report\Select2;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\Customer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\Auth;

class CustomerSelectRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Customer::class);
    }

    public function listBySelect2(array $request)
    {
        $name = isset($request['q']) ? "%{$request['q']}%" : '';

        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->join('user', 'userId', '=', 'idUser')
            ->select('idCustomer AS id',
                'user.name AS text')
            ->where('user.name', 'LIKE', $name)
            ->orderBy('user.name')
            ->get();
    }

    public function listSelect2WithUserId(array $request)
    {
        $name = isset($request['q']) ? "%{$request['q']}%" : '';
        $authRole = (Auth::user())->role;

        return $this->getModel()
            ::where('user.statusId', StatusConst::ACTIVE)
            ->join('user', 'userId', '=', 'idUser')
            ->select('userId AS id',
                'user.name AS text',
            'user.email AS email',
            'user.phone AS phone')
            ->when(!$authRole->support, function (Builder $query) use ($authRole) {
                $query->join('cityArea', function (JoinClause $join) use ($authRole) {
                    $join->where('cityArea.statusId', StatusConst::ACTIVE)
                        ->whereIn('cityArea.cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole){
                            $query->select('cityId')
                                ->from('roleCity')
                                ->where('roleCity.roleId', $authRole->id);
                        })
                        ->where(function (\Illuminate\Database\Query\Builder $query) {
                            $query->whereColumn('user.cityId', 'cityArea.cityId')
                                ->orWhereRaw('(ST_CONTAINS(cityArea.polygon, POINT(user.last_lat, user.last_lon)))');
                        });
                });
            })
            ->where('user.name', 'LIKE', $name)
            ->orderBy('user.name')
            ->get();
    }
}
