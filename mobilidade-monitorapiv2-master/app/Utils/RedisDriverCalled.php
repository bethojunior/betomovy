<?php

namespace App\Utils;

use App\Models\Config\Config;
use Predis\Client;

class RedisDriverCalled
{
    private $client = null;
    private $prefix;

    public function __construct()
    {
        list(
            'url_redis' => $url,
            'password_redis' => $password,
            'enable_redis_into_driver_called' => $enable_redis
            ) = Config::getConf(
            'url_redis',
            'password_redis',
            'enable_redis_into_driver_called'
        );

        $this->prefix = env('DB_DATABASE');

        if ($enable_redis) {
            $url      = env("REDIS_DRIVER_CALLED_DSN") ?? $url;
            $password = env("REDIS_DRIVER_CALLED_PASSWORD") ?? $password;

            list($scheme, $host) = explode('://', $url);

            $this->client = new Client($host, [
                'parameters' => [
                    'scheme'   => $scheme,
                    'host'     => $host,
                    'password' => $password
                ]
            ]);
        }
    }

    public function set($key, $value)
    {
        try {
            if ($this->client) {
                $this->client->transaction()->set($this->prefix.":".$key, json_encode($value))->execute();
            }
        } catch (\Exception $exception) {
        }
    }

    public function get($key)
    {
        try {
            if (!$this->client) {
                return null;
            }

            $result = $this->client->transaction()->get($this->prefix.":".$key)->execute();

            if (!$result[0]) {
                return null;
            }

            return json_decode($result[0]);
        } catch (\Exception $exception) {
            return null;
        }
    }

    public function delete($key)
    {
        try {
            if ($this->client) {
                $this->client->del($this->prefix.":".$key);
            }
        } catch (\Exception $exception) {
        }
    }
}
