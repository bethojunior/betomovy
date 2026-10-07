<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Model;

class CentralCallTypeConfig extends Model
{
    protected $table = 'centralCallTypeConfig';

    protected $fillable = [
        'centralCallTypeId',
        'statusId',
        'isActive'
    ];

    public function centralCallType()
    {
        return $this->belongsTo(CentralCallType::class, 'centralCallTypeId');
    }
}
