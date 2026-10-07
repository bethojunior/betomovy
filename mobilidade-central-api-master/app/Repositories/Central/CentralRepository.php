<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 13/06/2019
 * Time: 09:50
 */

namespace App\Repositories\Central;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Central\Central;
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

    public function find($id, $columns = ['*'])
    {
        return $this->getModel()
            ::with(['responsible' => function(BelongsTo $query) {
                $query
                    ->select([
                        'idUser',
                        'name',
                        'nickname',
                        'phone',
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

    public function updateBalanceId($responsibleId, $balanceId){
        return $this->getModel()
            ::where('responsibleId', $responsibleId)
            ->update(['balanceId' => $balanceId]);
    }
}
