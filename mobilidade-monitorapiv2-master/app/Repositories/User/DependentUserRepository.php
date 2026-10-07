<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 28/01/2020
 * Time: 17:07
 */

namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\DependentUser;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DependentUserRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(DependentUser::class);
    }

    public function findByResponsible($userId)
    {
        return $this->getModel()
            ::where('responsibleId', $userId)
            ->where('statusId', StatusConst::ACTIVE)
            ->whereHas('user', function ($query) {
                $query
                    ->where('statusId', StatusConst::ACTIVE);
            })
            ->with(['user' => function (BelongsTo $query) {
                $query
                    ->select(
                        'idUser',
                        'name',
                        'nickname',
                        'phone',
                        'email',
                        'document');
            }])
            ->get();
    }

    public function findResponsibleByUserId($userId)
    {
        return $this->getModel()::select(
                    'dependentUser.responsibleId',
                    'user.name',
                    'user.nickname',
                    'user.phone',
                    'user.email',
                    'user.document',
                    'dependentUser.relationship'
                )
            ->join('user', 'dependentUser.responsibleId', 'user.idUser')
            ->where('dependentUser.userId', $userId)
            ->first();
    }
}
