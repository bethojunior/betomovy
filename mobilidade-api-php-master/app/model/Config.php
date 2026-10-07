<?php

namespace app\model;

use app\dao\ConfigDao;
use app\utils\BaseModel;
use app\utils\CacheUtils;

/**
 * Created by PhpStorm.
 * User: TAXIRETURNDELL
 * Date: 14/08/2018
 * Time: 13:58
 */
class Config extends BaseModel
{
    const CANCELLATION_FEE = "cancellation_fee";

    protected $key;
    protected $value;

    /** @var CacheUtils|null */
    private static ?CacheUtils $cache = null;

    private static function getCache(): CacheUtils
    {
        if (self::$cache === null) {
            self::$cache = new CacheUtils();
        }
        return self::$cache;
    }

    /**
     * @return mixed
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @param mixed $key
     */
    public function setKey($key)
    {
        $this->key = $key;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * @param $key
     * @param $type
     * @return mixed
     */
    public static function get($key, $type = null, $nocache = false)
    {
        return self::getCache()->remember('config_' . $key, env('REDIS_CACHE_TTL'), function () use ($key) {
            $where = empty($type) ?
                [['config.key', '=', ":key"]] :
                [['config.key', '=', ":key", 'AND'], ['configTypeId', '=', ":type"]];

            $bind = empty($type) ?
                [":key" => $key] :
                [":key" => $key, ":type" => $type];

            $config = (new ConfigDao)->sqlSelect([], $where)
                ->bind($bind)
                ->get(false);


            return $config->value ?? null;
        }, $nocache);

        $cacheUtils->disconnect();

        return $config;
    }

    public static function getMany(...$keys)
    {
        $configs = (new ConfigDao)
            ->findMany($keys);

        $responseConfigs = [];

        foreach ($configs as $config) {
            $responseConfigs +=
                [$config->key => $config->value];
        }

        return $responseConfigs;
    }
}
