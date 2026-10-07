<?php


namespace Delivery\Models\PaymentForm;


use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $table = 'card';
    protected $primaryKey = 'idCard';
    const UPDATED_AT = null;
}
