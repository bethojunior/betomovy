<?php

namespace App\Models\User\RemoveAccount;

use App\Models\Locale\City;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Jenssegers\Mongodb\Eloquent\SoftDeletes;

class RemoveAccountRequestModel extends Model
{
    use SoftDeletes;

    protected $table = 'removeAccountRequest';

    protected $fillable = [
        'userId',
        'userIdWhoDeleted',
        'cityId',
        'type',
        'reason',
        'details',
        'ip',
        'platform',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function userWhoDeleted(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userIdWhoDeleted');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'cityId');
    }
}
