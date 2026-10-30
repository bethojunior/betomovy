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
        return new Client($this->buildClientOptions(
            env('REDIS_HOST', '127.0.0.1'),
            (int) env('REDIS_PORT', 6379),
            env('REDIS_PASSWORD') ?: null
        ));
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
        } catch (\Throwable $exception) {
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
        } catch (\Throwable $exception) {
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
        } catch (\Throwable $exception) {
            (new LogDao)->logException($exception);
        }
    }

    private function startCacheConnection(): void
    {
        if ($this->redis !== null) {
            return;
        }

        try {
            $redisUrl = trim((string) env('REDIS_URL', ''));
            if ($redisUrl !== '') {
                $this->redis = new Client($redisUrl, [
                    'timeout' => 2,
                    'read_write_timeout' => 2,
                    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
                ]);
                return;
            }

            $host = env('REDIS_HOST');
            if (empty($host) || in_array(strtolower((string)$host), ['127.0.0.1', 'localhost'], true)) {
                $this->redis = null;
                return;
            }

            $this->redis = new Client($this->buildClientOptions(
                $host,
                (int) env('REDIS_PORT', 6379),
                env('REDIS_PASSWORD') ?: null
            ));
        } catch (\Throwable $exception) {
            $this->redis = null;
            (new LogDao)->logException($exception);
        }
    }

    private function buildClientOptions(string $host, int $port, ?string $password): array
    {
        $useTls = filter_var(env('REDIS_TLS', false), FILTER_VALIDATE_BOOLEAN)
            || stripos((string) env('REDIS_SCHEME', ''), 'tls') !== false
            || stripos((string) env('REDIS_URL', ''), 'rediss://') === 0;

        $options = [
            'scheme'   => $useTls ? 'tls' : 'tcp',
            'host'     => $host,
            'port'     => $port,
            'password' => $password,
            'timeout' => 2,
            'read_write_timeout' => 2,
        ];

        if ($useTls) {
            $options['ssl'] = [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ];
        }

        return $options;
    }
}
