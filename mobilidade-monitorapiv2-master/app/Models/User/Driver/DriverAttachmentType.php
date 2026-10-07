<?php

namespace App\Models\User\Driver;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverAttachmentType extends Model
{
    use SoftDeletes;

    protected $table = 'driverAttachmentType';

    protected $fillable = [
        'name',
        'description',
        'picture',
        'active'
    ];

    public function getPictureAttribute()
    {
        return $this->attributes['picture'] ?
            \Storage::cloud()
                ->url($this->attributes['picture']) :
            null;
    }
}
