<?php

function env($key)
{
    if (file_exists("../configs/env/env.json")) {
        $key = strtoupper($key);
        $data = json_decode(file_get_contents("../configs/env/env.json"));
        return $data->$key ?? null;
    }

    return $_ENV[$key] ?? null;
}