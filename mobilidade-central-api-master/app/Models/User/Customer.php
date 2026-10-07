<?php

namespace App\Models\User;

use Illuminate\Database\Eloquent\Model;
use App\Models\User\User;

class Customer extends Model
{
    const UPDATED_AT = null;
    const CREATED_AT = null;

    protected $table = 'customer';

    protected $fillable = [
        'name',
        'phone',
        'customerRegisterStatusId',
        'userId',
    ];

    protected $primaryKey = 'idCustomer';

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'idUser');
    }
}
