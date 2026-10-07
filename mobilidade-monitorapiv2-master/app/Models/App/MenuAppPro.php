<?php


namespace App\Models\App;

use Illuminate\Database\Eloquent\Model;

class MenuAppPro extends Model
{
    protected $table = 'menuApp';

    protected $fillable = [
        'description',
        'link',
        'phoneNotification',
        'active',
        'menuAppTypeId',
        'menuAppTypeAction',
        'linkImage',
        'textImage',
        'buttonsActions', 
        'buttonCta',
        'quantity'
    ];

    protected $casts = [
        'buttonsActions' => 'array',
        'buttonCta' => 'array',
        'quantity' => 'array',
    ];

    const UPDATED_AT = null;

    public function menuAppType()
    {
        return $this->belongsTo(MenuAppType::class, "menuAppTypeId");
    }
}
