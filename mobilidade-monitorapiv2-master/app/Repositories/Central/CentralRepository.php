<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 09:50
 */

namespace App\Repositories\Central;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Central;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CentralRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Central::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::where('central.statusId', StatusConst::ACTIVE)
            ->join('user', 'responsibleId', '=', 'idUser')
            ->leftJoin('balance', 'idBalance', '=', 'central.balanceId')
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query
                    ->where('central.name', 'LIKE', "%{$request['name']}%");
            })
            ->select(
                'id',
                'central.name',
                'latitude',
                'longitude',
                'address',
                'logo',
                'user.name AS responsibleName',
                'balance.tripBalance',
                'user.phone',
                'user.email',
                'central.active',
                'central.created_at',
                'central.discount_type',
                'central.discount_value'
            )
            ->orderByDesc('created_at')
            ->when(isset($request['page']),
                function (Builder $query) {
                    return $query->paginate();
                },
                function (Builder $query) {
                    return $query->get();
                }
            );
    }

    public function find($id, $columns = ['*'])
    {
        return $this->getModel()
            ::with(['responsible' => function(BelongsTo $query) {
                $query
                    ->select([
                        'idUser',
                        'name',
                        'nickname',
                        'phone'
                    ]);
            }])
            ->find($id, $columns);
    }

    public function findByResponsible($id)
    {
        return $this->getModel()
            ::where('responsibleId', $id)
            ->first();
    }

    public function verifyIfHaveBalanceId($request)
    {
        return $this->getModel()
            ::where('central.id', $request['centralId'])
            ->first('balanceId');
    }

    public function updateCentralBalanceId($balanceId, $centralId)
    {
        return $this->getModel()
            ::where('id', $centralId)
            ->update(['balanceId' => $balanceId]);
    }


    public function updateBalanceId($responsibleId, $balanceId){
        return $this->getModel()
            ::where('responsibleId', $responsibleId)
            ->update(['balanceId' => $balanceId]);
    }

    public function listAllCentral()
    {
        return $this->getModel()
            ::select(
                'id',
                'name AS text'
            )
            ->where('central.statusId', StatusConst::ACTIVE)
            ->get();
    }
}
