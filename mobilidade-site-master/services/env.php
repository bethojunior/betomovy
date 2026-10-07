<?php

function env($key) {
    $key = strtoupper($key);
    $data = json_decode(file_get_contents(getEnvironment()));
    return $data->$key ?? null;
}

function getEnvironment(){
    $url = explode(':', $_SERVER['HTTP_HOST'])[0];

    $environments = [
        '192.168.0.28' => "../config/host.local.json",
        'localhost' => "../config/host.local.json",
        'livremobi.fabrica704.com.br' => "../config/host.production.json",
    ];

    return $environments[$url];
}
?>
