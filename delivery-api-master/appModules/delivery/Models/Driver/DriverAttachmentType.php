<?php


namespace Delivery\Models\Driver;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverAttachmentType extends Model
{
    use SoftDeletes;

    protected $table = "driverAttachmentType";

    protected $hidden = [
        'deleted_at'
    ];

    public function getPictureAttribute()
    {
        return $this->attributes["picture"] = $this->attributes["picture"] ?
            \Storage::cloud()->url($this->attributes["picture"]) :
            null;
    }
}
