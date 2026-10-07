<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 30/08/2019
 * Time: 16:20
 */

namespace App\Repositories\Role;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\Role\Role;
use Illuminate\Database\Eloquent\Builder;

class RoleRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(Role::class);
    }

    public function findAll(bool $roleLoggedIsRoot = true)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->when($roleLoggedIsRoot == false, function (Builder $query) {
                $query
                    ->where('isRoot', false);
            })
            ->with('cities')
            ->get();
    }

    public function findWithCity($id)
    {
        return $this->getModel()
            ::where('id', $id)
            ->where('statusId', StatusConst::ACTIVE)
            ->with('cities')
            ->first();
    }

    public function findByUser($userId)
    {
        return $this->getModel()
            ::whereHas('users', function (Builder $query) use ($userId) {
                $query
                    ->where('idUser', $userId);
            })
            ->first();
    }
}
