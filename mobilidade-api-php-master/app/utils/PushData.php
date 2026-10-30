<?php

namespace app\utils;

/**
 * FCM e Expo exigem que cada campo do data payload seja string.
 * Arrays (additionalData da corrida) não podem passar por strval:
 * no PHP 8 isso lança TypeError e a notificação inteira deixa de ser enviada.
 */
class PushData
{
    public static function stringify(array $data): array
    {
        $flat = [];

        foreach ($data as $key => $value) {
            if ($value === null) {
                continue;
            }

            if (is_array($value) || is_object($value)) {
                $flat[$key] = json_encode($value, JSON_UNESCAPED_UNICODE);
                continue;
            }

            $flat[$key] = strval($value);
        }

        return $flat;
    }
}
