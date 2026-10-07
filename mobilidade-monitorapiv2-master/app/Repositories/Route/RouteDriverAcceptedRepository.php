<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/12/2019
 * Time: 16:27
 */

namespace App\Repositories\Route;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Route\RouteDriverAccepted;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RouteDriverAcceptedRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(RouteDriverAccepted::class);
    }

    public function findAll(array $request = [])
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->with([
                'route',
                'driver' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'name',
                            'phone',
                            'email',
                            'idDriver',
                            'idUser',
                            'document',
                            'profileImage'
                        )
                        ->join('user', 'userId', '=', 'idUser');
                }
            ])
            ->when(isset($request['routeId']), function (Builder $query) use ($request) {
                $query
                    ->where('routeId', $request['routeId']);
            })
            ->when(isset($request['driverId']), function (Builder $query) use ($request) {
                $query
                    ->where('driverId', $request['driverId']);
            })
            ->when(isset($request['active']), function (Builder $query) use ($request) {
                $query
                    ->where('active', $request['active']);
            })
            ->orderByDesc('created_at')
            ->get();
    }
}
