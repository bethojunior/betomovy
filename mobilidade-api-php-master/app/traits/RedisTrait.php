<?php

namespace app\traits;

use Predis\Client;
use Exception;

/**
 * Created by BETHO`S BRAIN.
 * User: BETHOJUNIOR
 * Date: 02/03/2026
 * Time: 10:47
 */

trait RedisTrait
{
    protected ?Client $redis = null;
    protected string $databaseName;

    protected function checkRedisConn(): void
    {
        if ($this->redis !== null) {
            return;
        }

        $this->redis = new Client([
            'scheme'             => 'tcp',
            'host'               => env('REDIS_HOST', '127.0.0.1'),
            'port'               => (int) env('REDIS_PORT', 6379),
            'password'           => env('REDIS_PASSWORD') ?: null,
            'timeout'            => 2,
            'read_write_timeout' => 3,
        ]);
    }

    protected function getCollection($collection): string
    {
        if (!empty($collection)) {
            return $collection;
        }

        if (property_exists($this, 'table') && !empty($this->table)) {
            return $this->table;
        }

        return 'default';
    }

    protected function buildKey($collection, $id)
    {
        return "{$this->databaseName}:{$collection}:{$id}";
    }

    public function noSqlInsert($data, $collection = null, ?int $ttl = null): bool
    {
        $this->checkRedisConn();
        $collection = $this->getCollection($collection);

        $id  = uniqid();
        $key = $this->buildKey($collection, $id);

        $encoded = json_encode($data);

        if ($ttl !== null) {
            $this->redis->setex($key, $ttl, $encoded);
        } else {
            $this->redis->set($key, $encoded);
        }

        // adiciona em índice da collection
        $this->redis->rpush("{$this->databaseName}:{$collection}:index", [$id]);

        return true;
    }

    public function noSqlInsertMany($data, $collection = null)
    {
        $this->checkRedisConn();
        $collection = $this->getCollection($collection);

        foreach ($data as $obj) {
            $this->noSqlInsert($obj, $collection);
        }

        return true;
    }

    public function noSqlGetAll($collection = null)
    {
        $this->checkRedisConn();
        $collection = $this->getCollection($collection);

        try {
            $ids = $this->redis->lrange("{$this->databaseName}:{$collection}:index", 0, -1);

            $result = [];

            foreach ($ids as $id) {
                $key = $this->buildKey($collection, $id);
                $data = $this->redis->get($key);

                if ($data) {
                    $result[] = json_decode($data, true);
                }
            }

            return ["error" => false, "data" => $result];

        } catch (Exception $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    public function noSqlSelect($filter = [], $options = [], $collection = null)
    {
        $this->checkRedisConn();
        $collection = $this->getCollection($collection);

        $all = $this->noSqlGetAll($collection);

        if ($all['error']) {
            throw new Exception($all['message']);
        }

        $filtered = array_filter($all['data'], function ($item) use ($filter) {
            foreach ($filter as $key => $value) {
                if (!isset($item[$key]) || $item[$key] != $value) {
                    return false;
                }
            }
            return true;
        });

        return array_values($filtered);
    }
}
