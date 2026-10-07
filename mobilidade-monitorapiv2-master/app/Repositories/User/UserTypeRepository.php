<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 26/09/2019
 * Time: 17:16
 */

namespace App\Repositories\User;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\User\UserType;
use App\Models\User\LevelAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserTypeRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(UserType::class);
    }

    public function findAllActives()
    {
        return $this->getModel()::query()->where('statusId', 1)
            ->where('isActive', true)
            ->select(
                'idUserType',
                'name',
                'isDriver',
                'picture'
            )
            ->get();
    }

    public function findDriversType()
    {
        return $this->getModel()
            ::where(function (Builder $query) {
                $query->where('isDriver', true)
                    ->orWhere('isDeliveryMan', true);
            })
            ->with(['userTypeLinkedAppPartner' => function ($query) {
                $query->with('configAppPartners');
            }])
            ->where('statusId', StatusConst::ACTIVE)
//            ->where('isActive', true)
            ->orderByDesc('isActive')
            ->get();
    }

    public function findDriversTypeWithTripTypes()
    {
        return $this->getModel()
            ::where('isDriver', true)
            ->where('statusId', StatusConst::ACTIVE)
            ->whereHas('tripTypes')
            ->with(['tripTypes' => function (HasMany $query) {
                $query
                    ->with(['tripType' => function (BelongsTo $query) {
                        $query->select(
                            'idTripType',
                            'type',
                            'picture',
                            'description');
                    }]);
            }])
            ->get();
    }

    public function moveUsers(int $oldUserTypeId, int $newUserTypeId):bool
    {
        return LevelAccess::where('userTypeId', '=', $oldUserTypeId)
            ->update(['userTypeId' => $newUserTypeId]);
    }
}
