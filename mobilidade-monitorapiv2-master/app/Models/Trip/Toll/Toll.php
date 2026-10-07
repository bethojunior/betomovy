<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/08/2020
 * Time: 14:55
 */

namespace App\Models\Trip\Toll;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Toll extends Model
{
    use SoftDeletes;

    protected $table = 'toll';

    protected $fillable = [
        'name',
        'address',
        'value',
        'polygon',
        'active',
        'cityId'
    ];

    protected $hidden = [
        'deleted_at',
    ];

    protected static function booted()
    {
        static::saving(function (Toll $toll) {
            if (is_array($toll->polygon)) {
                $stringablePolygon = array_map(function ($point) {
                    return $point['lat'] . " " . $point['lng'];
                }, $toll->polygon);

                $stringablePolygon = "'POLYGON((". implode(',', $stringablePolygon) ."))'";

                $toll->polygon = \DB::raw("ST_GeomFromText({$stringablePolygon})");
            }
        });

        static::retrieved(function (Toll $toll) {
            if (is_string($toll->polygon)) {
                $polygon = str_replace(["(", "POLYGON", ")", "'"], '', $toll->polygon);
                $polygon = explode(',', $polygon);

                $toll->polygon = array_map(function ($coordinate){
                    $point = new \stdClass;
                    $coordinate = explode(" ", $coordinate);

                    $point->lat = (float) $coordinate[0];
                    $point->lng = (float) $coordinate[1];

                    return $point;
                }, $polygon);
            }
        });

        static::addGlobalScope('polygonAsText', function (Builder $builder) {
            $builder->addSelect(
                'id',
                'name',
                'address',
                'value',
                \DB::raw('ST_AsText(polygon) AS polygon'),
                'active',
                'cityId',
                'created_at',
                'updated_at',
                'deleted_at'
            );
        });
    }
}
