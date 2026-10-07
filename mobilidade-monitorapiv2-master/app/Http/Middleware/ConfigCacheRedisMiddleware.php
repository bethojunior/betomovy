<?php

namespace App\Http\Middleware;

use App\Repositories\Config\ConfigRepository;
use App\Utils\RedisUtil;
use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class ConfigCacheRedisMiddleware
{
    private $repository;

    public function __construct(ConfigRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $results = Cache::remember('config:redis', 3600, function () {
            return $this->repository->findMany([
                'enable_redis',
                'url_redis',
                'password_redis'
            ])->toArray();
        });

        [$enable_redis, $password_redis, $url_redis] = array_map(function ($item) {
            return $item['value'];
        }, $results);

        if ($enable_redis) {
            $url_redis = explode(":", $url_redis);
            $host = str_replace("//", "", $url_redis[1]);
            $port = $url_redis[2];

            Config::set("database.redis.default.host",$host);
            Config::set("database.redis.default.port", $port);
            Config::set("database.redis.default.password", $password_redis);
        }

        return $next($request);
    }
}
