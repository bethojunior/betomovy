<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/06/2020
 * Time: 12:06
 */

namespace App\Repositories\Config;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Config\AddressBlacklist;
use Illuminate\Database\Eloquent\Builder;

class AddressBlacklistRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(AddressBlacklist::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::orderByDesc('created_at')
            ->when(isset($request['address']), function (Builder $query) use ($request) {
                $query->where('address', 'LIKE', "%{$request['address']}%");
            })
            ->when(isset($request['approved']), function (Builder $query) use ($request) {
                $query->where('approved', $request['approved']);
            })
            ->when(isset($request['page']), function (Builder $query) {
                return $query->paginate();
            }, function (Builder $query) {
                return $query->get();
            });
    }
}
