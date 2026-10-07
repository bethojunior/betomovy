<?php

namespace app\utils;

use Ramsey\Uuid\Uuid;
use Throwable;

class SessionUtils
{
    /**
     * Gera/reusa um token de sessão por usuário no Redis, pro padrão de billing por sessão
     * de provedores de busca (Mapbox session_token, Google sessiontoken): várias chamadas
     * de autocomplete com o mesmo token contam como 1 sessão faturável, até o limite de
     * chamadas ou segundos de inatividade que o chamador definir (cada provedor tem sua
     * própria regra, por isso $keyPrefix/$maxCalls/$ttlSeconds vêm de fora). Se o Redis
     * falhar, cai pra um token novo (sem economia, mas sem quebrar a busca).
     *
     * @param string $keyPrefix identifica o provedor/uso (ex: "mapbox_places_session")
     * @param int $maxCalls quantas chamadas sucessivas uma sessão aceita antes de renovar
     * @param int $ttlSeconds segundos de inatividade até a sessão expirar sozinha
     */
    public static function resolveToken(string $keyPrefix, int $maxCalls, int $ttlSeconds): string
    {
        $userId = Headers::getUserId();

        if (!$userId || !ctype_digit((string)$userId))
            return Uuid::uuid4()->toString();

        try {
            $cache = new CacheUtils();
            $key = "{$keyPrefix}:{$userId}";
            $session = json_decode($cache->get($key) ?? '', true);

            if (!is_array($session) || !isset($session['count']) || $session['count'] >= $maxCalls)
                $session = ['token' => Uuid::uuid4()->toString(), 'count' => 0];

            $session['count']++;

            $cache->setex($key, $ttlSeconds, json_encode($session));

            return $session['token'];
        } catch (Throwable $exception) {
            return Uuid::uuid4()->toString();
        }
    }
}
