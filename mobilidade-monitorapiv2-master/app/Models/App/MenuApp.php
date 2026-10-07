<?php


namespace App\Models\App;

use Illuminate\Database\Eloquent\Model;

class MenuApp extends Model
{
    protected $table = 'menuApp';

    protected $fillable = [
        'description',
        'link',
        'phoneNotification',
        'active',
        'menuAppTypeId'
    ];

    const UPDATED_AT = null;

    public function menuAppType()
    {
        return $this->belongsTo(MenuAppType::class, "menuAppTypeId");
    }

}
