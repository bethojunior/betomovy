<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/02/2020
 * Time: 17:32
 */

namespace Cash\Repositories\User;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(User::class);
    }

    public function findForAuthProvider($userId)
    {
        /** @var User $user */
        $user = $this->getModel()
            ::where('idUser', $userId)
            ->select([
                'idUser',
                'name',
                'nickname',
                'document',
                'phone',
                'email',
                'password',
                'profilePhoto',
                'bankAccountId',
                'gender',
                'user.created_at',
                'updated_at',
                'roleId',
                'blocked',
                'user.statusId',
                'api_token',
                'id_asaas',
                'zipcode',
                'addressNumber'
            ])
            ->where('statusId', StatusConst::ACTIVE)
            ->where('blocked', 0)
            ->first();

        return $user;
    }
}
