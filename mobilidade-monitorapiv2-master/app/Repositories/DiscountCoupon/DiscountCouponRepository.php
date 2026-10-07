<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/11/2019
 * Time: 08:39
 */

namespace App\Repositories\DiscountCoupon;


use App\Constants\StatusConst;
use App\Contracts\Repository\AbstractRepository;
use App\Models\DiscountCoupon\DiscountCoupon;
use App\Models\Role\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscountCouponRepository extends AbstractRepository
{

    /**
     * AbstractRepository constructor.
     * Necessário usar o setModel()
     * para informar qual model será vinculado
     * ao Repository
     */
    public function __construct()
    {
        $this->setModel(DiscountCoupon::class);
    }

    public function findAll(array $queryRequest = [], Role $authRole = null)
    {
        return $this->getModel()
            ::where('statusId', StatusConst::ACTIVE)
            ->where('dateEnd', '>', now())
            ->whereNull('saleTripId')
            ->with([
                'city' => function (BelongsTo $query) {
                    $query
                        ->select('id', 'nome', 'shortName');
                },
                'gender',
                'tripPaymentForm' => function (BelongsTo $query) {
                    $query
                        ->select('idTripPaymentForm', 'name');
                }
            ])
            ->when(isset($queryRequest['cityId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('cityId', $queryRequest['cityId']);
            })
            ->when(isset($authRole) && !$authRole->support, function (Builder $query) use ($authRole) {
                $query->whereIn('cityId', function (\Illuminate\Database\Query\Builder $query) use ($authRole){
                    $query->select('roleCity.cityId')
                        ->from('roleCity')
                        ->where('roleCity.roleId', $authRole->id);
                });
            })
            ->when(isset($queryRequest['genderId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('genderId', $queryRequest['genderId']);
            })
            ->when(isset($queryRequest['tripPaymentFormId']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('tripPaymentFormId', $queryRequest['tripPaymentFormId']);
            })
            ->when(isset($queryRequest['active']), function (Builder $query) use ($queryRequest) {
                $query
                    ->where('active', $queryRequest['active']);
            })
            ->orderByDesc('created_at')
            ->when(isset($queryRequest['page']),
                function (Builder $query){
                    return
                        $query->paginate();
                },
                function (Builder $query) {
                    return $query->get();
                });
    }
}
