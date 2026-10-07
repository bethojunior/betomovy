<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    protected $table = 'config';

    protected $primaryKey = 'idConfig';

    public static function getConf(...$key)
    {
        if (count($key) > 1)
            return self::getMany($key);

        $config = self
            ::where('key', $key)
            ->first();

        return $config->getAttributeValue('value');
    }

    private static function getMany(array $keys): array
    {
        $configs = self
            ::where(function (Builder $query) use ($keys){
                foreach ($keys as $key) {
                    $query
                        ->orWhere('key', $key);
                }
            })
            ->select(['key', 'value'])
            ->get();

        $responseConfigs = [];

        foreach ($configs as $config){
            $responseConfigs +=
                [$config->key => $config->value];
        }

        return $responseConfigs;
    }
}
