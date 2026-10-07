<?php

function env($key)
{
    $key = strtoupper($key);
    $data = json_decode(file_get_contents( "../config/host.json"));
    return $data->$key ?? null;
}
