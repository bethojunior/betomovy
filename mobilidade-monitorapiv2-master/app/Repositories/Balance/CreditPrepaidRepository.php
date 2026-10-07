<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/05/2020
 * Time: 15:53
 */

namespace App\Repositories\Balance;


use App\Contracts\Repository\AbstractRepository;
use App\Models\Balance\CreditPrepaid;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CreditPrepaidRepository extends AbstractRepository
{

    /**
     * @inheritDoc
     */
    public function __construct()
    {
        $this->setModel(CreditPrepaid::class);
    }

    public function findAll()
    {
        return $this->getModel()
        ::query()
            ->orderByDesc('creditPrepaid.id')
            ->leftJoin('city', 'city.id', 'creditPrepaid.cityId')
            ->select(
                'creditPrepaid.*',
                'city.nome AS cityName'
            )
            ->with([
                'creditPrepaidPaymentForm' => function (HasMany $query) {
                    return $query->with('paymentForm');
                }
            ])
            ->get();
    }
}
