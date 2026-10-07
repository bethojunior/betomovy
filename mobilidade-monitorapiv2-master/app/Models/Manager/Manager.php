<?php

namespace App\Models\Manager;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manager extends Model
{
    use HasFactory;

    protected $table = 'manager';

    protected $fillable = [
        'id',
        'userId',
        'balanceId',
        'managerRegisterStatusId',
        'cityId',
        'valueCommission',
        'valueTypeCommission',
        'partnerCommission',
        'partnerTypeCommission',
    ];

    public $timestamps = false;

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
