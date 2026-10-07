<?php


namespace App\Models\User;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VerificationCode extends Model
{
    protected $table = 'verificationCode';

    protected $fillable = [
        'code',
        'userId',
        'statusId'
    ];

    protected $hidden = [
        'id',
        'used_at'
    ];

    const UPDATED_AT = null;

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'userId', 'idUser');
    }
}
