<?php
namespace app\utils;

use Exception;
use Predis\Client;

class CacheUtils
{
    private bool $isMultitenancy;
    /**
     * @var Client
     */
    private $client;

    /**
     * Construtor: inicializa a conexão com o Redis.
     *
     * @param string $host
     * @param int $port
     */
    public function __construct($isMultitenancy = true)
    {
        $this->isMultitenancy = $isMultitenancy;

        $this->client = new Client([
            'scheme' => 'tcp',
            'host'   => env('REDIS_HOST'),
            'port'   => env('REDIS_PORT'),
            'password' => env('REDIS_PASSWORD')
        ]);
    }

    private function processKey($key)
    {
        if($this->isMultitenancy) {
            return 'app' . ':' . env('REDIS_NAME') . ':' . $key;
        }

        return $key;
    }

    /**
     * Busca valor no cache, se não existe, executa a função callback e armazena o resultado no cache.
     *
     * @param string $key
     * @param int $seconds
     * @param callable $callback
     * @return mixed
     */
    public function remember($key, $seconds, callable $callback, $nocache = false)
    {
        $cacheEnabled = $nocache ? false : env('CACHE_ENABLED', false);

        if(!$cacheEnabled || $cacheEnabled === 'false') {
            $value = $callback();
            return $value;
        }
        
        $value = $this->get($key);

        if ($value !== null) {
            return unserialize($value);
        }

        $value = $callback();
        
        $this->setex($key, $seconds, serialize($value));
        
        return $value;
    }

    /**
     * Define um valor para uma chave.
     *
     * @param string $key
     * @param string $value
     * @return void
     */
    public function set($key, $value)
    {
        $this->client->set($this->processKey($key), $value);
    }

    /**
     * Obtém o valor de uma chave.
     *
     * @param string $key
     * @return string|null
     */
    public function get($key)
    {
        return $this->client->get($this->processKey($key));
    }

    /**
     * Define um valor com tempo de expiração.
     *
     * @param string $key
     * @param int $seconds
     * @param string $value
     * @return void
     */
    public function setex($key, $seconds, $value)
    {
        $this->client->setex($this->processKey($key), $seconds, $value);
    }

    /**
     * Remove uma chave.
     *
     * @param string $key
     * @return void
     */
    public function del($key)
    {
        $this->client->del([$this->processKey($key)]);
    }

    /**
     * Adiciona um valor ao final de uma lista.
     *
     * @param string $key
     * @param string $value
     * @return void
     */
    public function rpush($key, $value)
    {
        $this->client->rpush($this->processKey($key), $value);
    }

    /**
     * Obtém elementos de uma lista.
     *
     * @param string $key
     * @param int $start
     * @param int $stop
     * @return array
     */
    public function lrange($key, $start, $stop)
    {
        return $this->client->lrange($this->processKey($key), $start, $stop);
    }

    /**
     * Define um campo em um hash.
     *
     * @param string $key
     * @param string $field
     * @param string $value
     * @return void
     */
    public function hset($key, $field, $value)
    {
        $this->client->hset($this->processKey($key), $field, $value);
    }

    /**
     * Obtém o valor de um campo em um hash.
     *
     * @param string $key
     * @param string $field
     * @return string|null
     */
    public function hget($key, $field)
    {
        return $this->client->hget($this->processKey($key), $field);
    }

    /**
     * Obtém todos os campos e valores de um hash.
     *
     * @param string $key
     * @return array
     */
    public function hgetall($key)
    {
        return $this->client->hgetall($this->processKey($key));
    }

    /**
     * Verifica se uma chave existe.
     *
     * @param string $key
     * @return bool
     */
    public function exists($key)
    {
        return $this->client->exists($this->processKey($key)) > 0;
    }

    /**
     * Fecha a conexão com o Redis.
     *
     * @return void
     */
    public function disconnect()
    {
        $this->client->disconnect();
    }
}
