<?php

namespace app\services;

use app\utils\RedisUtil;

class CacheService
{
    public function get($data)
    {
        $redis = new RedisUtil;
        $result = $redis->get($data->key);
        if ($result)
            return $result;

        return false;
    }

    public function set($data)
    {
        $redis = new RedisUtil;
        $redis->set($data->key, $data->value);

        return true;
    }

    public function delete($data)
    {
       $redis = new RedisUtil;
       $redis->delete($data->key);

       return true;
    }
}