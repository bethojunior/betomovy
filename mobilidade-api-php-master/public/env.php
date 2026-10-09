<?php

function env($key)
{
    if (file_exists("../configs/env/env.json")) {
        $keyUpper = strtoupper($key);
        $data = json_decode(file_get_contents("../configs/env/env.json"));
        if (isset($data->$keyUpper)) {
            return $data->$keyUpper;
        }
    }

    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    }

    if (isset($_SERVER[$key])) {
        return $_SERVER[$key];
    }

    $val = getenv($key);
    return ($val !== false) ? $val : null;
}