<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/03/2020
 * Time: 10:47
 */

namespace App\Repositories\Military;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Military\MilitaryForceGraduation;
use Illuminate\Database\Eloquent\Builder;

class MilitaryForceGraduationRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(MilitaryForceGraduation::class);
    }

    public function findAll(array $request)
    {
        return $this->getModel()
            ::where('statusId', '=', 1)
            ->with('militaryForce')
            ->orderBy('level')
            ->when(isset($request['militaryForceId']), function (Builder $query) use ($request) {
                return $query
                    ->where('militaryForceId', $request['militaryForceId']);
            })
            ->when(isset($request['page']),
                function (Builder $query) use ($request) {
                    return $query->paginate();
                }, function (Builder $query) {
                    return $query->get();
                });
    }

    public function findById(int $id)
    {
        return $this->getModel()::join('militaryForce as mf', 'militaryForceGraduation.militaryForceId', '=', 'mf.id')
            ->find($id, [
                'militaryForceGraduation.id',
                'patent',
                'level',
                'statusId',
                'militaryForceId',
                'mf.name as militaryForceName'
            ]);
    }
}
