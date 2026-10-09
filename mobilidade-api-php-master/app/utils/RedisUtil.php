<?php

namespace app\utils;

use app\dao\LogDao;
use Exception;
use Predis\Client;

/**
 * Refactored by BETHO : THE ETERNAL ROMANCE
 */

class RedisUtil
{
    private ?Client $redis = null;
    private string $prefix = 'movy';

    public function __construct()
    {
        $this->prefix = (string)(env('REDIS_PREFIX') ?: 'movy');
    }

    public function returnIstance()
    {
        return new Client([
            'scheme' => 'tcp',
            'host'   => env('REDIS_HOST', '127.0.0.1'),
            'port'   => env('REDIS_PORT', 6379),
            'read_write_timeout' => 0,
        ]);
    }

    public function set($key, $value, int $ttl = 3600): void
    {
        try {
            $this->startCacheConnection();

            if (!$this->redis) {
                return;
            }

            $key = $this->prefix . "-" . $key;

            $this->redis->setex($key, $ttl, serialize($value));
        } catch (Exception $exception) {
            (new LogDao)->logException($exception);
        }
    }

    public function get($key)
    {
        try {
            $this->startCacheConnection();

            if (!$this->redis) {
                return null;
            }

            $key = $this->prefix . "-" . $key;

            $value = $this->redis->get($key);

            if ($value === null) {
                return null;
            }

            return unserialize($value);
        } catch (Exception $exception) {
            (new LogDao)->logException($exception);
            return null;
        }
    }

    public function delete($key): void
    {
        try {
            $this->startCacheConnection();

            if (!$this->redis) {
                return;
            }

            $key = $this->prefix . "-" . $key;

            $this->redis->del([$key]);
        } catch (Exception $exception) {
            (new LogDao)->logException($exception);
        }
    }

    private function startCacheConnection(): void
    {
        if ($this->redis !== null) {
            return;
        }

        try {
            $host = env('REDIS_HOST');
            if (empty($host)) {
                $this->redis = null;
                return;
            }

            $this->redis = new Client([
                'scheme'   => 'tcp',
                'host'     => $host,
                'port'     => (int) env('REDIS_PORT', 6379),
                'password' => env('REDIS_PASSWORD') ?: null,
            ]);
        } catch (Exception $exception) {
            $this->redis = null;
            (new LogDao)->logException($exception);
        }
    }
}
