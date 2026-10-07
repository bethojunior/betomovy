<?php


namespace App\Models\Promotion;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class RoutePromotionalBanner extends Model
{
    protected $table = 'routePromotionalBanner';
    protected $fillable = [
        'path',
        'statusId'
    ];
    public $timestamps = false;

    public function getPathAttribute()
    {
        return Storage::cloud()
                ->url($this->attributes['path']);
    }
}
