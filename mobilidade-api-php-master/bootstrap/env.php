<?php

if (!function_exists('env')) {
    function env($key)
    {
        $val = getenv($key);
        if ($val !== false && $val !== null && $val !== '') {
            return $val;
        }

        if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
            return $_ENV[$key];
        }

        if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') {
            return $_SERVER[$key];
        }

        if (file_exists("../configs/env/env.json")) {
            $keyUpper = strtoupper($key);
            $data = json_decode(file_get_contents("../configs/env/env.json"));
            if (isset($data->$keyUpper)) {
                return $data->$keyUpper;
            }
        }

        return null;
    }
}