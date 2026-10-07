<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/05/2020
 * Time: 14:23
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\CreditPrepaidPurchase;
use App\Models\Config\Config;
use Carbon\Carbon;
use http\Env\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditPrepaidPurchaseRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CreditPrepaidPurchase::class);
    }

    public function findAll(array $request, bool $isPerPeriod = false)
    {
        return $this->getModel()
            ::with([
                'creditPrepaid',
                'user' => function (BelongsTo $query) {
                    $query
                        ->select(
                            'idUser',
                            'name',
                            'nickname',
                            'email',
                            'phone',
                            'cityId'
                        );
                }
            ])
            ->orderByDesc('created_at')
            ->when(isset($request['userId']), function (Builder $query) use ($request) {
                $query
                    ->where('userId', $request['userId']);
            })
            ->when($isPerPeriod, function (Builder $query) {
                $timezone = Config::getConf('application_timezone');

                $query
                    ->where('credited', 1)
                    ->whereNotNull('expirationDate')
                    ->where('expirationDate', '<', today($timezone));
            })
            ->when(isset($request['creditPrepaidId']), function (Builder $query) use ($request) {
                $query
                    ->where('creditPrepaidId', $request['creditPrepaidId']);
            })
            ->when(isset($request['credited']), function (Builder $query) use ($request) {
                $query
                    ->where('credited', $request['credited']);
            })
            ->when(isset($request['refused']), function (Builder $query) use ($request) {
                $query
                    ->where('refused', $request['refused']);
            })
            ->when(isset($request['dateStart']), function (Builder $query) use ($request) {
                $query
                    ->where('created_at', '>=', Carbon::parse($request['dateStart'])->startOfDay());
            })
            ->when(isset($request['dateEnd']), function (Builder $query) use ($request) {
                $query
                    ->where('created_at', '<=', Carbon::parse($request['dateEnd'])->endOfDay());
            })
            ->when(isset($request['page']), function (Builder $query) {
                return $query
                    ->paginate();
            }, function (Builder $query) {
                return $query->get();
            });
    }
}
