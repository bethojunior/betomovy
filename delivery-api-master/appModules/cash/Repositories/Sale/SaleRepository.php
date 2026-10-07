<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/02/2020
 * Time: 10:18
 */

namespace Cash\Repositories\Sale;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Sale\Sale;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SaleRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(Sale::class);
    }

    public function findBySecondaryId($secondaryId)
    {
        return $this->getModel()
            ::where('secondaryId', $secondaryId)
            ->first();
    }

    public function findFullyBySecondaryId($secondaryId)
    {
        return $this->getModel()
            ::where('secondaryId', $secondaryId)
            ->with([
                'saleStatus',
                'merchant' => function (BelongsTo $query) {
                    $query
                        ->leftJoin('user', 'merchant.userId', '=', 'idUser')
                        ->leftJoin('company', 'merchant.companyId', '=', 'company.id')
                        ->select(
                            'merchant.id',
                            'merchant.companyId',
                            'merchant.userId',
                            'merchant.merchantStatusId',
                            'merchant.statusId',
                            'merchant.logoPicture',
                            'merchant.balanceId',
                            'merchant.created_at',
                            'merchant.updated_at'
                        )
                        ->selectRaw("
                            IFNULL(user.name, company.fantasyName) AS name,
                            IFNULL(user.phone, company.phone) AS phone,
                            IFNULL(user.email, company.email) AS email
                        ");
                },
                'saleProductMerchant' => function (HasMany $query) {
                    $query
                        ->with(['productMerchant' => function (BelongsTo $query) {
                            $query
                                ->select(
                                    'id',
                                    'label',
                                    'description',
                                    'value',
                                    'picture');
                        }]);
                }
            ])
            ->first();
    }

    public function findAllByBuyer($userId, array $request = [])
    {
        return $this->getModel()
            ::where('buyerId', $userId)
            ->orderByDesc('created_at')
            ->with([
                'saleStatus',
                'merchant' => function (BelongsTo $query) {
                    $query
                        ->leftJoin('user', 'merchant.userId', '=', 'idUser')
                        ->leftJoin('company', 'merchant.companyId', '=', 'company.id')
                        ->select(
                            'merchant.id',
                            'merchant.companyId',
                            'merchant.userId',
                            'merchant.merchantStatusId',
                            'merchant.statusId',
                            'merchant.logoPicture',
                            'merchant.balanceId',
                            'merchant.created_at',
                            'merchant.updated_at'
                        )
                        ->selectRaw("
                            IFNULL(user.name, company.fantasyName) AS name,
                            IFNULL(user.phone, company.phone) AS phone,
                            IFNULL(user.email, company.email) AS email
                        ");
                },
            ])
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query
                    ->where('sale.created_at', '>', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query
                    ->where('sale.created_at', '<', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['saleStatusId']), function (Builder $query) use ($request) {
                $query
                    ->where('saleStatusId', $request['saleStatusId']);
            })
            ->when(isset($request['page']), function (Builder $query) {
                return $query
                    ->paginate();
            }, function (Builder $query) {
                return $query
                    ->get();
            });
    }
}
