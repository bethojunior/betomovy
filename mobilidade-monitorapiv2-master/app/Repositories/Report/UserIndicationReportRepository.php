<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/09/2019
 * Time: 16:25
 */

namespace App\Repositories\Report;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\User;
use App\Models\User\UserIndication;
use Illuminate\Database\Eloquent\Builder;

class UserIndicationReportRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(UserIndication::class);
    }

    public function referredUsers($userId, $request)
    {
        return $this->getModel()
            ::where('whoIndicatedId', $userId)
            ->where('userIndication.statusId', StatusConst::ACTIVE)
            ->join('user', 'userIndicatedId', '=', 'idUser')
            ->join('levelAccess', 'idUser', '=', 'userId')
            ->join('userType', 'userTypeId', '=', 'idUserType')
            ->leftJoin('driver', 'driver.userId', '=','idUser')
            ->leftJoin('customer', 'customer.userId', '=', 'idUser')
            ->select(
                'userIndicatedId',
                'user.name',
                'user.nickname',
                'user.phone',
                'user.email',
                'userType.name AS indicated_type',
                'userIndication.created_at'
            )
            ->selectRaw('IFNULL(driver.profileImage, customer.profileImage) AS profileImage')
            ->when(isset($request['name']), function (Builder $query) use ($request) {
                $query
                    ->where('user.name', 'LIKE', '%'.$request['name'].'%');
            })
            ->orderByDesc('userIndication.created_at')
            ->when((isset($request['paginate']) && $request['paginate'] == 1),
                function ($query){
                    return
                        $query->paginate();
                },
                function ($query) {
                    return $query->get();
                });
    }
}
