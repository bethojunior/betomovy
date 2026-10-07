<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2020
 * Time: 14:57
 */

namespace App\Repositories\Trip\Toll;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Trip\Toll\Toll;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class TollRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Toll::class);
    }

    public function findAll(array $queryRequest)
    {
        return $this->getModel()
            ::orderByDesc('id')
            ->when(isset($queryRequest['name']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('name', 'LIKE', "%{$queryRequest['name']}%");
            })
            ->when(isset($queryRequest['address']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('address', 'LIKE', "%{$queryRequest['address']}%");
            })
            ->when(isset($queryRequest['active']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('active', $queryRequest['active']);
            })
            ->when(isset($queryRequest['dateStart']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('created_at', '>=', Carbon::parse($queryRequest['dateStart'])->startOfDay());
            })
            ->when(isset($queryRequest['dateEnd']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('created_at', '<=', Carbon::parse($queryRequest['dateEnd'])->endOfDay());
            })
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('cityId', $queryRequest['cityId']);
            })
            ->when(isset($queryRequest['page']), function (Builder $query) {
                return $query->paginate();
            }, function (Builder $query) {
                return $query->get();
            });
    }
}
