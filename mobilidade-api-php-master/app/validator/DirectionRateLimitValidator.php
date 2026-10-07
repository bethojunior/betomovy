<?php

namespace app\validator;

use app\exceptions\RateLimitException;
use app\utils\Headers;
use app\utils\RedisUtil;
use app\validator\contracts\Validator;

class DirectionRateLimitValidator extends Validator
{
    private const KEY_PREFIX = 'direction:ratelimit:';
    private const TTL = 5;

    /**
     * @throws RateLimitException
     */
    public function validate(): void
    {
        $userId = Headers::getUserId() ?? ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
        $key = self::KEY_PREFIX . $userId;
        $redis = new RedisUtil();

        if ($redis->get($key) !== null) {
            throw new RateLimitException("Rate limit excedido");
        }

        $redis->set($key, 1, self::TTL);
    }
}
