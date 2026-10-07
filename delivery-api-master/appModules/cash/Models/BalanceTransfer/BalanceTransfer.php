<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/07/2020
 * Time: 17:49
 */

namespace Cash\Models\BalanceTransfer;


use App\Models\Balance\Balance;
use App\Models\Customer\CustomerView;
use Illuminate\Database\Eloquent\Model;
use Str;

class BalanceTransfer extends Model
{
    protected $table = 'balanceTransfer';

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['secondaryId'] = $this->attributes['secondaryId'] ?? Str::uuid()->toString();
    }

    public function fromCustomerView()
    {
        return $this->belongsTo(CustomerView::class, 'fromBalanceId', 'balanceId');
    }

    public function toCustomerView()
    {
        return $this->belongsTo(CustomerView::class, 'toBalanceId', 'balanceId');
    }

    public function cashPaymentForm()
    {
        return $this->belongsTo(CashPaymentForm::class, 'cashPaymentFormId');
    }
}
