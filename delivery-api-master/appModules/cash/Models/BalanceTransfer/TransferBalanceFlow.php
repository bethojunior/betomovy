<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 23/07/2020
 * Time: 15:30
 */

namespace Cash\Models\BalanceTransfer;


use Illuminate\Database\Eloquent\Model;

class TransferBalanceFlow extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'transferBalanceFlow';

    protected $fillable = [
        'balanceTransferId',
        'balanceFlowId',
    ];
}
