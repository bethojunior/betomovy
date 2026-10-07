<?php


namespace App\Models\Auth;


use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    protected $table = 'verificationCode';
    protected $fillable = [
        'code',
        'userId',
        'statusId'
    ];
    const UPDATED_AT = null;
}
